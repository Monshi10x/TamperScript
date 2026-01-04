class Toast {
      static _defaults = {
            duration: 2600,
            position: "top-right", // top-right | top-left | top-center
            stack: 4,              // max visible toasts in that position
            gap: 10,               // px between toasts
            width: 360,            // max width in px (clamped by viewport)
            offsetX: 18,           // px
            offsetY: 18,           // px
            zIndex: 999999,
            pauseOnHover: true,
            closeOnClick: true,
            closeButton: false,
            newestOnTop: true,
            showProgress: true,
            // theme
            background: "#111214",
            text: "#F2F4F7",
            border: "rgba(255,255,255,0.10)",
            shadow: "0 10px 24px rgba(0,0,0,0.35)",
            fontFamily: `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"`,
            fontSize: 14,
            lineHeight: 1.25,
            radius: 12,
            // motion
            enterMs: 160,
            exitMs: 140,
      };

      static _typeStyles = {
            info: {band: "#3B82F6", icon: "ℹ️", aria: "polite"},
            success: {band: "#22C55E", icon: "✅", aria: "polite"},
            warn: {band: "#F59E0B", icon: "⚠️", aria: "polite"},
            error: {band: "#ff0000ff", icon: "⛔", aria: "assertive"},
      };

      static _containers = new Map(); // position -> {el, toasts: Set}
      static _styleInjected = false;

      static notify(message, duration, options = {}) {
            return this._show("info", message, duration, options);
      }
      static success(message, duration, options = {}) {
            return this._show("success", message, duration, options);
      }
      static warn(message, duration, options = {}) {
            return this._show("warn", message, duration, options);
      }
      static error(message, duration, options = {}) {
            return this._show("error", message, duration, options);
      }
      static confirm(message, options = {}) {
            const {
                  onYes,
                  onNo,
                  yesLabel = "Yes",
                  noLabel = "No",
                  type = "info",
                  ...rest
            } = options || {};

            const actions = [
                  {
                        label: yesLabel,
                        onClick: () => {
                              try {onYes?.();} catch(err) {console.error(err);}
                        },
                  },
                  {
                        label: noLabel,
                        onClick: () => {
                              try {onNo?.();} catch(err) {console.error(err);}
                        },
                  },
            ];

            return this._show(type, message, rest.duration, {
                  ...rest,
                  actions,
                  closeOnClick: rest.closeOnClick ?? false,
            });
      }

      static dismiss(idOrElement) {
            if(!idOrElement) return false;
            const el =
                  typeof idOrElement === "string"
                        ? document.querySelector(`[data-toast-id="${CSS.escape(idOrElement)}"]`)
                        : idOrElement;
            if(!el) return false;
            this._close(el, true);
            return true;
      }

      static clear(position) {
            if(!position) {
                  for(const {el} of this._containers.values()) {
                        el.querySelectorAll(".Toast__item").forEach(t => this._close(t, true));
                  }
                  return;
            }
            const bucket = this._containers.get(position);
            if(!bucket) return;
            bucket.el.querySelectorAll(".Toast__item").forEach(t => this._close(t, true));
      }

      // ---------- Internals ----------
      static _show(type, message, duration, options) {
            this._ensureStyles();

            const opts = this._mergeOptions(duration, options);
            const ts = this._typeStyles[type] || this._typeStyles.info;

            const {el: container} = this._getContainer(opts.position, opts);

            // Enforce stack limit (remove oldest visible toast)
            const existing = Array.from(container.querySelectorAll(".Toast__item"));
            if(existing.length >= opts.stack) {
                  const target = opts.newestOnTop ? existing[existing.length - 1] : existing[0];
                  this._close(target, true);
            }

            const id = options.id || `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

            const toast = document.createElement("div");
            toast.className = `Toast__item Toast__${type}`;
            toast.dataset.toastId = id;
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", ts.aria);
            toast.style.setProperty("--toast-band", opts.bandColor || ts.band);

            // clickable close (also used for “closeOnClick”)
            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.className = "Toast__close";
            closeBtn.setAttribute("aria-label", "Dismiss notification");
            closeBtn.innerHTML = "✕";

            const icon = document.createElement("div");
            icon.className = "Toast__icon";
            icon.textContent = opts.icon ?? ts.icon;

            const body = document.createElement("div");
            body.className = "Toast__body";

            const titleEl = document.createElement("div");
            titleEl.className = "Toast__title";
            if(opts.title) {
                  titleEl.textContent = opts.title;
                  body.appendChild(titleEl);
            }

            const msgEl = document.createElement("div");
            msgEl.className = "Toast__message";
            if(opts.allowHtml) {
                  msgEl.innerHTML = String(message ?? "");
            } else {
                  msgEl.textContent = String(message ?? "");
            }
            body.appendChild(msgEl);

            const actions = document.createElement("div");
            actions.className = "Toast__actions";
            if(Array.isArray(opts.actions) && opts.actions.length) {
                  for(const a of opts.actions) {
                        const b = document.createElement("button");
                        b.type = "button";
                        b.className = "Toast__action";
                        b.textContent = a.label ?? "Action";
                        b.addEventListener("click", (e) => {
                              e.stopPropagation();
                              try {a.onClick?.(toast);} catch(err) {console.error(err);}
                              if(a.dismiss !== false) this._close(toast, true);
                        });
                        actions.appendChild(b);
                  }
                  body.appendChild(actions);
            }

            const progress = document.createElement("div");
            progress.className = "Toast__progress";

            toast.appendChild(icon);
            toast.appendChild(body);
            if(opts.closeButton) toast.appendChild(closeBtn);
            if(opts.showProgress && opts.duration > 0) toast.appendChild(progress);

            // Insert order
            if(opts.newestOnTop) container.prepend(toast);
            else container.appendChild(toast);

            // Events
            const state = {
                  opts,
                  closing: false,
                  start: performance.now(),
                  remaining: opts.duration,
                  timer: null,
                  raf: null,
                  progressStart: null,
            };
            toast._toastState = state;

            const startTimer = () => {
                  if(state.opts.duration <= 0) return;
                  state.start = performance.now();
                  state.timer = window.setTimeout(() => this._close(toast, false), state.remaining);
                  if(state.opts.showProgress) this._startProgress(toast);
            };

            const pauseTimer = () => {
                  if(state.opts.duration <= 0) return;
                  window.clearTimeout(state.timer);
                  state.timer = null;
                  const now = performance.now();
                  state.remaining = Math.max(0, state.remaining - (now - state.start));
                  if(state.raf) cancelAnimationFrame(state.raf);
                  state.raf = null;
            };

            if(opts.pauseOnHover) {
                  toast.addEventListener("mouseenter", pauseTimer);
                  toast.addEventListener("mouseleave", startTimer);
                  // for touch (long press / hold)
                  toast.addEventListener("pointerdown", pauseTimer, {passive: true});
                  toast.addEventListener("pointerup", startTimer, {passive: true});
                  toast.addEventListener("pointercancel", startTimer, {passive: true});
            }

            if(opts.closeOnClick) {
                  toast.addEventListener("click", (e) => {
                        if(e.target === closeBtn || e.target.closest(".Toast__action")) return;
                        this._close(toast, true);
                  });
            }

            closeBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  this._close(toast, true);
            });

            // Enter animation (next frame)
            requestAnimationFrame(() => toast.classList.add("is-in"));

            // Auto dismiss
            startTimer();

            // Callback
            try {opts.onShow?.(toast);} catch(err) {console.error(err);}

            return {id, el: toast, dismiss: () => this._close(toast, true)};
      }

      static _mergeOptions(duration, options) {
            const opts = {...this._defaults, ...(options || {})};

            // duration resolution (priority: arg duration -> options.duration -> default)
            if(typeof duration === "number") opts.duration = duration;
            else if(typeof options?.duration === "number") opts.duration = options.duration;
            else opts.duration = this._defaults.duration;

            // clamp width to viewport
            const maxW = Math.min(opts.width, Math.max(240, window.innerWidth - 24));
            opts._computedWidth = maxW;

            return opts;
      }

      static _getContainer(position, opts) {
            const pos = position || "top-right";
            if(this._containers.has(pos)) return this._containers.get(pos);

            const el = document.createElement("div");
            el.className = `Toast__container Toast__container--${pos}`;
            el.style.zIndex = String(opts.zIndex);
            el.style.gap = `${opts.gap}px`;

            // offset + width
            el.style.setProperty("--toast-x", `${opts.offsetX}px`);
            el.style.setProperty("--toast-y", `${opts.offsetY}px`);
            el.style.setProperty("--toast-w", `${opts._computedWidth}px`);

            document.body.appendChild(el);

            const bucket = {el};
            this._containers.set(pos, bucket);
            return bucket;
      }

      static _startProgress(toast) {
            const state = toast._toastState;
            const bar = toast.querySelector(".Toast__progress");
            if(!bar || state.opts.duration <= 0) return;

            // Reset, then animate via rAF to avoid CSS timing drift when paused
            state.progressStart = performance.now();
            const total = state.remaining;

            const tick = () => {
                  if(!toast.isConnected) return;
                  if(!state.timer) return; // paused
                  const now = performance.now();
                  const elapsed = now - state.start;
                  const frac = Math.min(1, elapsed / total);
                  bar.style.transform = `scaleX(${Math.max(0, 1 - frac)})`;
                  if(frac < 1) state.raf = requestAnimationFrame(tick);
            };

            bar.style.transform = "scaleX(1)";
            state.raf = requestAnimationFrame(tick);
      }

      static _close(toast, userInitiated) {
            if(!toast || !toast.isConnected) return;
            const state = toast._toastState;
            if(state?.closing) return;
            if(state) state.closing = true;

            window.clearTimeout(state?.timer);
            if(state?.raf) cancelAnimationFrame(state.raf);

            toast.classList.remove("is-in");
            toast.classList.add("is-out");

            try {state?.opts?.onClose?.(toast, {userInitiated: !!userInitiated});} catch(err) {console.error(err);}

            const exitMs = state?.opts?.exitMs ?? this._defaults.exitMs;
            window.setTimeout(() => {
                  if(toast.isConnected) toast.remove();
            }, exitMs + 30);
      }

      static _ensureStyles() {
            if(this._styleInjected) return;
            this._styleInjected = true;
      }
}
