(function initialiseCorebridgeScrollHogMonitor() {
    const injectedScript = document.createElement('script');

    injectedScript.textContent = `(${function runCorebridgeScrollHogMonitor() {
        const config = {
            namespace: '[CB ScrollHog]',
            watchedEvents: new Set(['scroll', 'wheel', 'mousewheel', 'touchmove', 'touchstart', 'keydown', 'keyup']),
            slowListenerThresholdMs: 16,
            monitorWindowMs: 8000,
            scrollSettleMs: 250,
            maxStackLines: 8,
            maxRecentEvents: 120,
            maxListenerRecords: 400,
        };

        if (window.__corebridgeScrollHogMonitorInstalled) {
            console.info(config.namespace, 'already installed');
            return;
        }

        window.__corebridgeScrollHogMonitorInstalled = true;

        class RingBuffer {
            constructor(limit) {
                this.limit = limit;
                this.items = [];
            }

            push(item) {
                this.items.push(item);
                if (this.items.length > this.limit) {
                    this.items.shift();
                }
            }

            toArray() {
                return this.items.slice();
            }
        }

        class ScrollHogMonitor {
            constructor() {
                this.originalAddEventListener = EventTarget.prototype.addEventListener;
                this.originalRemoveEventListener = EventTarget.prototype.removeEventListener;
                this.originalScrollTo = window.scrollTo;
                this.originalScrollBy = window.scrollBy;
                this.originalScrollIntoView = Element.prototype.scrollIntoView;
                this.listenerMap = new WeakMap();
                this.listenerRecords = new RingBuffer(config.maxListenerRecords);
                this.recentEvents = new RingBuffer(config.maxRecentEvents);
                this.monitoringUntil = 0;
                this.lastPartCount = this.getPartCount();
                this.lastScroll = this.getScrollSnapshot();
                this.installTime = performance.now();
            }

            install() {
                this.patchEventListeners();
                this.patchScrollMethods();
                this.observeParts();
                this.startHeartbeat();
                this.exposeDebugApi();
                console.info(config.namespace, 'installed. Reproduce the async part creation issue, then paste console output or run CorebridgeScrollHogDebug.report().');
            }

            exposeDebugApi() {
                window.CorebridgeScrollHogDebug = {
                    report: () => this.report({ reason: 'manual-report' }),
                    start: (milliseconds = config.monitorWindowMs) => this.startMonitoring({ reason: 'manual-start', milliseconds }),
                    recentEvents: () => this.recentEvents.toArray(),
                    listenerRecords: () => this.listenerRecords.toArray(),
                };
            }

            patchEventListeners() {
                const monitor = this;
                EventTarget.prototype.addEventListener = function patchedAddEventListener(type, listener, options) {
                    if (!config.watchedEvents.has(type) || !listener) {
                        return monitor.originalAddEventListener.call(this, type, listener, options);
                    }

                    const wrappedListener = monitor.wrapListener({ target: this, type, listener, options });
                    monitor.rememberWrappedListener({ target: this, type, listener, wrappedListener });
                    monitor.logListenerAdded({ target: this, type, listener, options });
                    return monitor.originalAddEventListener.call(this, type, wrappedListener, options);
                };

                EventTarget.prototype.removeEventListener = function patchedRemoveEventListener(type, listener, options) {
                    const wrappedListener = monitor.getWrappedListener({ target: this, type, listener });
                    return monitor.originalRemoveEventListener.call(this, type, wrappedListener || listener, options);
                };
            }

            patchScrollMethods() {
                const monitor = this;

                window.scrollTo = function patchedScrollTo(...args) {
                    monitor.logProgrammaticScroll({ method: 'window.scrollTo', args });
                    return monitor.originalScrollTo.apply(this, args);
                };

                window.scrollBy = function patchedScrollBy(...args) {
                    monitor.logProgrammaticScroll({ method: 'window.scrollBy', args });
                    return monitor.originalScrollBy.apply(this, args);
                };

                Element.prototype.scrollIntoView = function patchedScrollIntoView(...args) {
                    monitor.logProgrammaticScroll({ method: 'Element.scrollIntoView', args, target: this });
                    return monitor.originalScrollIntoView.apply(this, args);
                };
            }

            observeParts() {
                const observer = new MutationObserver(() => {
                    const partCount = this.getPartCount();
                    if (partCount > this.lastPartCount) {
                        const added = partCount - this.lastPartCount;
                        this.lastPartCount = partCount;
                        this.startMonitoring({ reason: 'part-rows-added', addedParts: added, partCount });
                    } else {
                        this.lastPartCount = partCount;
                    }
                });

                observer.observe(document.documentElement, { childList: true, subtree: true });
            }

            startHeartbeat() {
                window.addEventListener('scroll', () => {
                    const current = this.getScrollSnapshot();
                    const deltaY = current.y - this.lastScroll.y;
                    const deltaX = current.x - this.lastScroll.x;
                    this.lastScroll = current;

                    if (this.isMonitoring()) {
                        this.recentEvents.push({
                            kind: 'scroll-position',
                            atMs: Math.round(performance.now()),
                            x: current.x,
                            y: current.y,
                            deltaX,
                            deltaY,
                            activeElement: this.describeTarget(document.activeElement),
                        });
                    }
                }, { passive: true, capture: true });

                window.setInterval(() => {
                    if (this.isMonitoring()) {
                        this.report({ reason: 'monitor-heartbeat' });
                    }
                }, 2000);
            }

            wrapListener({ target, type, listener, options }) {
                const monitor = this;
                const targetDescription = this.describeTarget(target);
                const listenerName = listener.name || 'anonymous';
                const listenerStack = this.getStack();
                const passive = this.getPassiveOption(options);

                if (typeof listener === 'function') {
                    return function wrappedScrollListener(event) {
                        return monitor.measureListener({ event, listener, context: this, type, targetDescription, listenerName, listenerStack, passive });
                    };
                }

                return {
                    handleEvent(event) {
                        return monitor.measureListener({ event, listener: listener.handleEvent, context: listener, type, targetDescription, listenerName, listenerStack, passive });
                    },
                };
            }

            measureListener({ event, listener, context, type, targetDescription, listenerName, listenerStack, passive }) {
                const before = this.getScrollSnapshot();
                const defaultPreventedBefore = event.defaultPrevented;
                const startedAt = performance.now();
                let result;

                result = listener.call(context, event);

                const durationMs = performance.now() - startedAt;
                const after = this.getScrollSnapshot();
                const preventedDuringListener = !defaultPreventedBefore && event.defaultPrevented;
                const changedScroll = before.x !== after.x || before.y !== after.y;
                const shouldLog = this.isMonitoring() || durationMs >= config.slowListenerThresholdMs || preventedDuringListener || changedScroll;

                if (shouldLog) {
                    const record = {
                        kind: 'listener-run',
                        atMs: Math.round(performance.now()),
                        type,
                        target: targetDescription,
                        listenerName,
                        durationMs: Math.round(durationMs * 10) / 10,
                        passive,
                        preventedDuringListener,
                        defaultPrevented: event.defaultPrevented,
                        cancelable: event.cancelable,
                        before,
                        after,
                        activeElement: this.describeTarget(document.activeElement),
                        stack: listenerStack,
                    };

                    this.recentEvents.push(record);

                    if (durationMs >= config.slowListenerThresholdMs || preventedDuringListener || changedScroll) {
                        console.warn(config.namespace, 'suspicious listener', record);
                    }
                }

                return result;
            }

            startMonitoring({ reason, milliseconds = config.monitorWindowMs, addedParts = 0, partCount = this.getPartCount() }) {
                this.monitoringUntil = Math.max(this.monitoringUntil, performance.now() + milliseconds);
                console.info(config.namespace, 'monitoring started', {
                    reason,
                    addedParts,
                    partCount,
                    milliseconds,
                    scroll: this.getScrollSnapshot(),
                    activeElement: this.describeTarget(document.activeElement),
                });

                window.setTimeout(() => this.report({ reason: 'monitor-window-complete' }), milliseconds + config.scrollSettleMs);
            }

            report({ reason }) {
                const report = {
                    reason,
                    atMs: Math.round(performance.now()),
                    installedForMs: Math.round(performance.now() - this.installTime),
                    monitoring: this.isMonitoring(),
                    partCount: this.getPartCount(),
                    scroll: this.getScrollSnapshot(),
                    activeElement: this.describeTarget(document.activeElement),
                    recentEvents: this.recentEvents.toArray(),
                    listenerRecords: this.listenerRecords.toArray(),
                };

                console.info(config.namespace, 'report', report);
                return report;
            }

            logListenerAdded({ target, type, listener, options }) {
                const record = {
                    kind: 'listener-added',
                    atMs: Math.round(performance.now()),
                    type,
                    target: this.describeTarget(target),
                    listenerName: listener.name || 'anonymous',
                    passive: this.getPassiveOption(options),
                    capture: this.getCaptureOption(options),
                    stack: this.getStack(),
                };

                this.listenerRecords.push(record);
                if (this.isMonitoring()) {
                    console.debug(config.namespace, 'listener added', record);
                }
            }

            logProgrammaticScroll({ method, args, target = window }) {
                const record = {
                    kind: 'programmatic-scroll',
                    atMs: Math.round(performance.now()),
                    method,
                    target: this.describeTarget(target),
                    args: this.serialiseArgs(args),
                    before: this.getScrollSnapshot(),
                    stack: this.getStack(),
                };

                this.recentEvents.push(record);
                if (this.isMonitoring()) {
                    console.warn(config.namespace, 'programmatic scroll', record);
                }
            }

            rememberWrappedListener({ target, type, listener, wrappedListener }) {
                let targetMap = this.listenerMap.get(target);
                if (!targetMap) {
                    targetMap = new Map();
                    this.listenerMap.set(target, targetMap);
                }

                targetMap.set(this.getListenerKey({ type, listener }), wrappedListener);
            }

            getWrappedListener({ target, type, listener }) {
                const targetMap = this.listenerMap.get(target);
                return targetMap ? targetMap.get(this.getListenerKey({ type, listener })) : null;
            }

            getListenerKey({ type, listener }) {
                return `${type}:${listener}`;
            }

            isMonitoring() {
                return performance.now() <= this.monitoringUntil;
            }

            getPartCount() {
                return document.querySelectorAll('div[id^="ord_prod_part_"]').length;
            }

            getScrollSnapshot() {
                return {
                    x: Math.round(window.scrollX || window.pageXOffset || 0),
                    y: Math.round(window.scrollY || window.pageYOffset || 0),
                };
            }

            getStack() {
                const stack = new Error().stack || '';
                return stack.split('\n').slice(3, 3 + config.maxStackLines).map((line) => line.trim());
            }

            getPassiveOption(options) {
                return Boolean(options && typeof options === 'object' && options.passive);
            }

            getCaptureOption(options) {
                return Boolean(options === true || (options && typeof options === 'object' && options.capture));
            }

            describeTarget(target) {
                if (!target) {
                    return 'null';
                }

                if (target === window) {
                    return 'window';
                }

                if (target === document) {
                    return 'document';
                }

                if (target === document.documentElement) {
                    return 'html';
                }

                if (target === document.body) {
                    return 'body';
                }

                if (target.nodeType === Node.ELEMENT_NODE) {
                    const id = target.id ? `#${target.id}` : '';
                    const className = typeof target.className === 'string' && target.className ? `.${target.className.trim().split(/\s+/).slice(0, 4).join('.')}` : '';
                    return `${target.tagName.toLowerCase()}${id}${className}`;
                }

                return Object.prototype.toString.call(target);
            }

            serialiseArgs(args) {
                return args.map((arg) => {
                    if (arg && arg.nodeType === Node.ELEMENT_NODE) {
                        return this.describeTarget(arg);
                    }

                    if (arg && typeof arg === 'object') {
                        return JSON.parse(JSON.stringify(arg, (key, value) => (typeof value === 'function' ? '[function]' : value)));
                    }

                    return arg;
                });
            }
        }

        const monitor = new ScrollHogMonitor();
        monitor.install();
    }}).call(window);`;

    (document.head || document.documentElement).appendChild(injectedScript);
    injectedScript.remove();
})();
