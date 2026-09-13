# CoreBridge Estimates / Orders — Dark and Light Mode

## Task
Implement a working, reversible dark/light theme for the existing CoreBridge estimate and order editor. Dark mode should feel like Atlas Tools: near-black backgrounds, layered charcoal panels, warm gold accents, white text and crisp borders. Keep CoreBridge's familiar workflow, information density and functionality. Implement the feature, not just a mockup or proposal.

Read this document explicitly as the task brief. If repository-wide automatic Codex instructions are wanted, merge the relevant instructions into the repository's `AGENTS.md`; do not overwrite existing instructions. The supplied filename `agent.md` is a task brief, not an assumption about automatic instruction discovery.

## Inputs and evidence
- Inspect the accompanying `estimate form component.html`. It is a captured form fragment, approximately 12.7 MB, not a complete standalone application. Ask for this attachment only if it is absent from the working files.
- It includes ASP.NET Web Forms (`#aspnetForm`, `__doPostBack`, ViewState, ScriptManager/AjaxControlToolkit), Knockout-related markup, jQuery UI classes, repeated product/part sections, inline styling, hidden templates and payment dialogs. There are 79 `.ord-prod-part` elements in this snapshot and thousands of `.hide` elements.
- It also contains custom Cost Analysis Summary and Install Analysis Summary panels and controls such as Toggle Parts, Load all and Re-Order Products. Preserve these existing enhancements.
- Visual reference: https://atlastools.co/ (requested URL: https://www.atlastools.co/). Homepage source inspected on 13 September 2026 contains repeated `#f5a900` gold, `#050505`, `#070707`, `#111111` surfaces and white, with supporting `#ffb300` / `#dca101` accents. The palette below adapts those colours for an application; it is not a claim that every token is an exact brand value.
- Only an estimate capture is supplied. Do not claim order-page compatibility is verified until an actual order DOM or representative fixture has been tested.

## Integration decision
1. Inspect the repository and its existing instructions first. If there is an existing CoreBridge extension/userscript, add the theme there using its existing build, settings and injection architecture. Do not create competing injectors.
2. If no implementation exists, create a small Chrome/Edge Manifest V3 extension with packaged CSS and a content script. Provide unpacked installation instructions. Keep the core CSS and controller modular enough to reuse in a userscript later; do not build two installation systems unnecessarily.
3. Use the configured CoreBridge tenant origin and verified editor paths. Never ship `<all_urls>` or guess a tenant URL from the company name. If the origin is unavailable, provide a clearly marked configuration placeholder and installation instructions; the packaged extension must fail closed until configured.
4. The capture includes `EditEstimate.aspx` in the form action and a resource reference to `/salesmodule/Orders/CreateOrderv2.aspx`. A resource URL alone does not prove that it is an order editor navigation route. Verify create/edit estimate and order paths from the available application/repository and maintain an explicit route list.
5. Activate only on supported editor routes and a confirmed editor DOM. Theme the surrounding navigation while on these pages. Do not apply to login pages, unrelated modules or third-party payment frames.
6. Use local assets only. No remote scripts, fonts, analytics, business-data collection or network interception. Theme code must not read or store customer, payment or order field values.

## Theme behaviour
- Offer a visible, compact Light / Dark toggle near the upper-right editor/header controls. Default to Dark on first use; persist the explicit selection across reloads and supported pages. No page refresh is required to switch.
- Use a namespaced root attribute, for example `data-cb-atlas-theme="dark"` / `"light"`, plus a namespaced page-scope marker. Switch tokens through CSS instead of restyling individual nodes.
- Store only the preference using the existing settings API or extension storage. Handle unavailable/invalid storage gracefully. If supported by the chosen storage API, synchronise changes across open tabs without loops.
- Minimise initial colour flash using the earliest supported injection and stored preference retrieval. Never hide the whole document while waiting for settings.
- Every injected button inside the ASP.NET form must have `type="button"`. Toggle activation must not submit, trigger postback, alter dirty state or invoke save logic.
- Provide an accessible label and state (`aria-pressed` for a binary switch, or correctly implemented radio controls). Keyboard operation, visible focus and screen-reader state must work.
- Initialise idempotently: exactly one stylesheet, one toggle and one lifecycle registration. Removing/disabling the feature restores the original application styling and removes its own attributes, controls and listeners.

## Design tokens
Use CSS variables prefixed `--cb-atlas-`. These are starting values; validate actual foreground/background pairs and adjust where needed.

| Token | Dark | Light |
| --- | --- | --- |
| page | #070707 | #F3F4F6 |
| surface | #111111 | #FFFFFF |
| surface-raised | #1B1B1B | #F8F9FA |
| surface-hover | #252525 | #ECEFF3 |
| input | #161616 | #FFFFFF |
| border | #383838 | #D1D5DB |
| control-border | #707070 | #737B87 |
| text | #F4F4F4 | #181B20 |
| text-muted | #B6B6B6 | #56606E |
| accent | #F5A900 | #F5A900 |
| accent-hover | #FFB300 | #E49D00 |
| on-accent | #111111 | #111111 |
| link | #FFC14D | #825400 |
| focus | #FFC14D | #825400 |
| success-text | #8CDEAE | #17683A |
| warning-text | #FFD078 | #805000 |
| danger-text | #FFAAAA | #A51D29 |
| info-text | #A0CAFF | #235DA0 |

Create matching subdued semantic backgrounds and borders. Do not substitute gold for all status colours. Use darker gold for links on white; bright brand gold is chiefly a filled action background with dark text. Meet 4.5:1 for normal text and 3:1 for large text and meaningful UI boundaries/focus indicators, checking the actual rendered combinations.

Use a readable existing application font or system sans-serif. Preserve icon font families. Keep rows compact, headings clear, radii around 4–6 px, and shadows subtle. Use gold for primary actions, active steps/tabs and restrained dividing accents. Do not import storefront banners, decorative animation, glints, textures, oversized typography or logos. Preserve existing company branding and artwork colours.

## Concrete selector coverage
Verify these selectors against the attachment and record any live differences. Use existing repeated classes rather than hard-coded product/part numbers.

| Area | Observed anchors | Required treatment |
| --- | --- | --- |
| Shell | `#Header`, `#divLeftHeaderSection`, `#ctl00_RibbonsTabs`, `#ctl00_pnlSalesNav`, `#MainContent`, `#MainContentInner` | Coordinated backgrounds, navigation text, active/hover/focus states |
| Editor and steps | `#createOrderEntry`, `#divLeftColumn`, `#orderHeader`, `#orderStepsBtn`, `#orderStep1Btn`, `#orderStep2Btn`, `#orderStep3Btn`, `#stepsInfos`, `#innerOrderStep` | Clearly differentiated current step; preserve layout and click targets |
| Summary | `#orderSummary`, `#orderSummaryTitle`, `#orderSummaryBody`, `#newSubtotal`, `#newtotal`, `#divTriggerSaveDraft`, `#divTriggerSaveOrder` | Strong total hierarchy; readable taxes, discounts and save states |
| Details | `#orderDetailEntry`, `#companyPanel`, `#txtCompanyName`, `#txtOrderDescription`, `#orderContactGroup` | Labels, inputs, selectors, validation and disabled/readonly states |
| Products | `.ord-prod-header`, `.ord-prod-header-tab`, `.ord-prod-body`, `.ord-prod-footer`, `.ord-prod-title`, `.ord-prod-number`, `.ord-prod-action` | Product hierarchy without changing collapse, reorder, clone or delete behaviour |
| Parts | `.ord-prod-part`, `.ord-prod-part-header`, `.ord-prod-part-body`, `.ord-prod-part-container`, `.ord-prod-part-footer`, `.partExpander`, `.partPrice`, `.partNameBtn` | Parts visually distinct from product containers; clear expand/edit states |
| Pricing | `.pricing-panel-table`, `.part-cost-bg`, `.part-retail-bg`, `.pnlPricingAllViews`, `.sectionTitle` | Differentiate cost from retail; retain override/discount/validation cues |
| Controls | `.defaultInput`, `.txtStyle-2`, `.defaultbutton`, `.defaultbutton-2`, `.buttonStyle`, `.buttonStyleSelected`, `.lbSavePart` | Consistent primary/secondary/destructive roles; retain selected and disabled states |
| Widgets | `.ui-widget`, `.ui-widget-content`, `.ui-widget-header`, `.ui-tabs-nav`, `.ui-tabs-panel`, `.ui-state-default`, `.ui-state-active`, `.ui-tabs-selected` | Theme tabs and actual runtime autocomplete/date/dialog widgets; discover missing runtime selectors |
| Dialogs | `#modalAddOrderPayment`, `#modalCreditCardSurchargeFee`, `.modalSectionBg`, `.simplemodal-data`, `.simplemodal-close`, `.custom-modal-close` | Theme visible dialog shells, close controls and overlays; preserve stacking, drag and focus behaviour |
| Custom analysis | Cost Analysis Summary, Install Analysis Summary and their controls | Inspect actual enclosing DOM/repository hooks; use stable selectors or add namespaced hooks in owned code; do not invent IDs or match labels repeatedly at runtime |

The capture contains duplicate IDs in places. Do not assume every ID is unique, rename vendor IDs or depend on `getElementById` to enumerate repeated content. Avoid broad substring selectors like `[id*="price"]` when a meaningful class exists.

## CSS and runtime constraints
- Scope every rule to the active editor/theme. Body-appended menus and dialogs need scoped rules rooted at the page theme marker, not only descendants of `#createOrderEntry`.
- Keep Light mode deliberately styled with the same hierarchy. It must not be an accidental mix of dark overrides and legacy white panels.
- Do not use page inversion, universal colour overrides (`*`), global image/SVG filters, or blanket replacement of inline styles. Override confirmed inline colour/background declarations with narrow, documented `!important` rules only where necessary. Avoid overriding layout properties.
- Never override `.hide`, `.ui-tabs-hide`, `[hidden]`, inline `display:none`, visibility, business-driven opacity, pointer events or hidden inputs. Do not reveal inactive fields/templates or make disabled controls clickable.
- Preserve all existing IDs, names, values, attributes, bindings, listeners and form behaviour. Do not replace existing DOM using `innerHTML`, clone live controls, change tab order or modify CoreBridge JavaScript.
- Preserve photos, artwork, colour swatches and previews. Treat icon-font glyphs using their text colour; patch individual legacy image icons only when identified and safe.
- Use `color-scheme` appropriately for native controls. Check select options, placeholders, autofill, checkboxes, radio buttons, readonly and disabled fields.
- Existing nodes and newly inserted parts should receive styling automatically from CSS. Do not scan every node or call `getComputedStyle` across the page.
- Use the host's existing lifecycle hook when available. ASP.NET AJAX hooks may require page-world access that an isolated extension content script does not have. Prefer a bounded DOM observer for mounting/recovery when that is sufficient; never assume `window.Sys` is visible in an isolated world. If a bridge is necessary, package it locally, minimise its duties and avoid exposing business data.
- If observing DOM changes, observe relevant containers for `childList`, batch work, process only added subtrees and ignore self-generated nodes. Do not watch every style/class mutation or poll continuously. Handle replaced editor roots without accumulating observers.
- No expensive work per part per toggle. Benchmark on the supplied 79-part capture, including repeated toggles and inserted parts. Aim for an imperceptible switch; record actual timing/environment and investigate theme-controller long tasks above 50 ms rather than inventing results.
- Apply screen styling under `@media screen` so browser print retains CoreBridge's original print appearance. Hide injected controls in print. Do not change customer-facing PDFs, email templates or quote/order output.
- Leave cross-origin payment iframes untouched. Their contents may stay light; theme their surrounding shell. Do not request payment-provider host permissions just for appearance.

## Implementation and verification
1. Inventory existing integration points, relevant styles, custom panels and routes. Summarise assumptions briefly, then implement without stopping for routine design decisions.
2. Build theme tokens, selector-based CSS, controller, persistent preference and toggle. Integrate with existing packaging, or supply the minimal extension described above.
3. Create a safe local preview fixture from the capture. Treat embedded scripts, form actions, resource URLs, frames and inline handlers as potentially active. Disable execution/submission/navigation and remove business/person/payment data and ViewState from distributable fixtures. Do not commit the raw capture. Preserve representative structure, repeated parts and inline styling conflicts.
4. The attachment lacks a full document/head and may lack original stylesheet assets. Use local available assets where possible and explicitly report this preview limitation. A styled static fixture does not prove live business functionality.
5. Verify both modes at 1366×768 and 1920×1080, plus 200% zoom. Inspect shell, all three editor steps, expanded/collapsed parts, pricing/overrides, totals, custom analysis, validation, tabs, dropdowns, dialogs, empty/loading states and disabled fields. Retain usable horizontal scrolling where the legacy application requires it.
6. Test persistence, repeated initialisation, partial DOM replacement, newly added parts, keyboard operation and that toggling does not submit or mutate business fields. Assert hidden elements stay hidden and theme selectors do not affect unsupported routes.
7. Where an authorised test environment exists, check representative customer selection, part edits, calculations, expansion, drag/reorder and save behaviour with test records. Do not create real orders, send estimates or submit payments merely to test styling. Use mocks/test environments for consequential actions.
8. Inspect browser print preview and unchanged artwork. Capture meaningful before/after screenshots in both modes with sample data only.
9. Separate confirmed checks from untested areas, especially live orders, missing runtime widgets, host assets and cross-origin frames. Fix confirmed theme regressions before delivery.

## Deliverables and done criteria
Deliver implementation source, installable build/package if applicable, setup/rollback instructions, the sanitised preview fixture, concise validation results and representative screenshots. Document the configured origin/routes and selector map so future CoreBridge changes can be maintained.

Done means: Dark and Light are coherent across the supported editor; the toggle persists and never triggers a form action; dynamic content is themed; hidden content stays hidden; custom panels remain usable; no calculations or workflows were rewritten; print/artwork colours remain intact; no duplicate controls or runaway observers occur; limitations are honestly listed. If only the estimate fixture was available, label order support as implemented provisionally and awaiting live verification rather than claiming completion of that test.
