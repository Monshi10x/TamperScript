class CorebridgeAtlasTheme {
    constructor() {
        this.rootAttribute = "data-cb-atlas-theme";
        this.scopeAttribute = "data-cb-atlas-editor";
        this.storageKey = "cbAtlasTheme";
        this.toggleId = "cb-atlas-theme-toggle";
        this.observer = null;
        this.storageListenerId = null;
        this.handleToggle = this.handleToggle.bind(this);
        this.handleMutations = this.handleMutations.bind(this);
    }

    isSupportedPage() {
        const path = window.location.pathname.toLowerCase();
        const supportedRoutes = [
            "/salesmodule/estimates/quickprice",
            "/salesmodule/estimates/editestimate",
            "/salesmodule/estimates/createestimate",
            "/salesmodule/orders/editorder"
        ];
        const supportedRoute = supportedRoutes.some(route => path.indexOf(route) === 0);
        return supportedRoute && Boolean(document.querySelector("#createOrderEntry, #innerOrderStep"));
    }

    getStoredTheme() {
        try {
            const storedTheme = GM_getValue(this.storageKey, "dark");
            return storedTheme === "light" ? "light" : "dark";
        }
        catch(error) {
            console.warn("[CB Atlas Theme] Could not read theme preference.", error);
            return "dark";
        }
    }

    init() {
        if(!this.isSupportedPage()) return false;
        this.addStyles();
        document.documentElement.setAttribute(this.scopeAttribute, "");
        this.applyTheme(this.getStoredTheme(), {persist: false});
        this.mountToggle();
        this.observePage();
        this.observePreference();
        return true;
    }

    addStyles() {
        if(document.getElementById("cb-atlas-theme-styles")) return;
        const style = document.createElement("style");
        style.id = "cb-atlas-theme-styles";
        style.textContent = GM_getResourceText("ATLAS_THEME_CSS");
        (document.head || document.documentElement).appendChild(style);
    }

    mountToggle() {
        if(document.getElementById(this.toggleId)) return;
        const host = document.querySelector("#ctl00_RibbonsTabs, #Header, #orderHeader");
        if(!host) return;

        const button = document.createElement("button");
        button.id = this.toggleId;
        button.className = "cb-atlas-theme-toggle";
        button.type = "button";
        button.addEventListener("click", this.handleToggle);
        host.appendChild(button);
        this.updateToggle();
    }

    handleToggle(event) {
        event.preventDefault();
        event.stopPropagation();
        const currentTheme = document.documentElement.getAttribute(this.rootAttribute);
        this.applyTheme(currentTheme === "dark" ? "light" : "dark", {persist: true});
    }

    applyTheme(theme, {persist = true} = {}) {
        const safeTheme = theme === "light" ? "light" : "dark";
        document.documentElement.setAttribute(this.rootAttribute, safeTheme);
        this.updateToggle();
        if(!persist) return;
        try {
            GM_setValue(this.storageKey, safeTheme);
        }
        catch(error) {
            console.warn("[CB Atlas Theme] Could not save theme preference.", error);
        }
    }

    updateToggle() {
        const button = document.getElementById(this.toggleId);
        if(!button) return;
        const isDark = document.documentElement.getAttribute(this.rootAttribute) === "dark";
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        button.textContent = isDark ? "☀ Light" : "● Dark";
    }

    observePage() {
        if(this.observer || !document.body) return;
        this.observer = new MutationObserver(this.handleMutations);
        this.observer.observe(document.body, {childList: true, subtree: true});
    }

    handleMutations(mutations) {
        if(document.getElementById(this.toggleId)) return;
        const needsToggle = mutations.some(mutation => Array.from(mutation.addedNodes).some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches?.("#ctl00_RibbonsTabs, #Header, #orderHeader") || node.querySelector?.("#ctl00_RibbonsTabs, #Header, #orderHeader"))
        ));
        if(needsToggle) this.mountToggle();
    }

    observePreference() {
        if(typeof GM_addValueChangeListener !== "function" || this.storageListenerId !== null) return;
        this.storageListenerId = GM_addValueChangeListener(this.storageKey, (name, oldValue, newValue, remote) => {
            if(remote && (newValue === "dark" || newValue === "light")) this.applyTheme(newValue, {persist: false});
        });
    }

    destroy() {
        this.observer?.disconnect();
        this.observer = null;
        if(this.storageListenerId !== null && typeof GM_removeValueChangeListener === "function") {
            GM_removeValueChangeListener(this.storageListenerId);
        }
        this.storageListenerId = null;
        const button = document.getElementById(this.toggleId);
        button?.removeEventListener("click", this.handleToggle);
        button?.remove();
        document.getElementById("cb-atlas-theme-styles")?.remove();
        document.documentElement.removeAttribute(this.rootAttribute);
        document.documentElement.removeAttribute(this.scopeAttribute);
    }
}
