# Atlas editor theme integration

## Scope

The userscript activates the Atlas theme only on the configured `sar10686.corebridge.net` estimate Quick Price, estimate edit/create, and order edit matches already declared in the userscript. The controller also requires an editor root (`#createOrderEntry` or `#innerOrderStep`) before it changes the page. Order support is provisional because the supplied repository contains no representative order fixture.

`Styles/AtlasTheme.css` maps the stable shell, editor, summary, product, part, pricing, widget, dialog, and custom `.ord-box` hooks described in the task brief. Rules are rooted in `data-cb-atlas-editor` and `data-cb-atlas-theme`, and screen-only rules leave CoreBridge print output unchanged.

## Behaviour

- Dark mode is the default. Only `dark` or `light` is stored in the Tampermonkey value store.
- The top-right toggle is a non-submitting `type="button"`, exposes `aria-pressed` and an action label, and switches without a reload.
- Initialization is idempotent. A bounded child-list observer only remounts the toggle if an ASP.NET partial update replaces its host; CSS automatically covers new rows.
- `destroy()` disconnects the observer and removes all owned controls, attributes, listeners, and styles.
- Cross-tab preference changes are applied when Tampermonkey supplies remote value-change notifications.

## Installation and rollback

Install or update `TamperStart.js` in Tampermonkey. Local development can use `LocalIncludes.txt`. To roll back the feature, disable the userscript or call `destroy()` on the controller instance during development; disabling the userscript restores the unmodified CoreBridge presentation on the next load.

## Validation limitations

The available `Agents/Dark Mode Code.html` is an Atlas Dimensions panel rather than the 12.7 MB estimate-form capture described by the brief. Consequently, no raw customer/order fixture was committed and live CoreBridge workflows, runtime autocomplete/date widgets, payment frames, and order-page DOM remain unverified. The implementation does not inspect business field values or intercept network traffic.
