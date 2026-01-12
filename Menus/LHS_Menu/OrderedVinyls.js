class OrderedVinyls extends LHSMenuWindow {

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            this.init();
      }

      init() {
            new SpandexColourCards(this.getPage(0));
      }

      show() {
            super.show();

            var page = this.getPage(0);

            //while(page.hasChildNodes()) {page.removeChild(page.lastChild);}
            //while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}


      }

      hide() {
            super.hide();
      }

      tick() {
            this.tickUpdate();
      }

      tickUpdate() { }
}



class SpandexColourCards {
      constructor(parentToAppendTo) {
            this.parent =
                  typeof parentToAppendTo === "string"
                        ? document.querySelector(parentToAppendTo)
                        : parentToAppendTo;

            if(!this.parent) throw new Error("SpandexColourCards: parent container not found");

            // ===== CONFIG =====
            this.PAGE_SIZE = 500; // confirmed cap
            this.TOKEN_STORAGE_KEY = "spx_bearer_token";
            this.TOKEN_ENDPOINT = "https://signschedulerapp.ts.r.appspot.com/SpandexBearerToken";

            // KEEP URL-ENCODED EXACTLY
            this.BASE_URL_PREFIX =
                  "https://api-shop.spandex.com/occ/v2/AU_Site/products/search?fields=products(code%2Cname%2CbaseProduct%2CbaseProductName%2CshortDescription%2Curl%2CstatusOptions%2CgreenProduct%2Cclassifications%2Cprice(FULL)%2CslittingOption%2CcolourCommercial%2CcolourHex%2CpreviewImage(FULL)%2CbrandImage(FULL)%2CsalesUnit(FULL)%2CadditionalSalesUnits(FULL)%2Cpurchasable%2CminOrderQuantity%2CorderQuantityInterval%2CcolourFinish%2Cdeclaration)%2Cfacets(FULL)%2Cbreadcrumbs%2CsubCategoryCodes%2Cpagination(DEFAULT)%2Csorts(DEFAULT)%2CfreeTextSearch%2CcurrentQuery&query=";
            this.BASE_URL_SUFFIX = "&searchQueryContext=PDP&lang=en_AU&curr=AUD";
            this.CATEGORIES = [
                  {label: "Avery 700", baseProductCode: "955"},
                  {label: "Avery Translucent", baseProductCode: "738"},
                  {label: "Arlon Translucent", baseProductCode: "TA7"},
                  {label: "Avery Supreme Wrap", baseProductCode: "F10"},
            ];
            // ==================

            this.products = [];
            this.categoryProducts = new Map();
            this.loadedCategories = new Set();
            this.activeCategory = this.CATEGORIES[0]?.label || "";
            this.loadingSpinner = null;
            this.draggedProduct = null;
            this.onDrop = null;

            this.injectStyles();
            this.buildUI();
            this.bindEvents();
            this.registerDropListener();
            this.renderTabs();

            // load saved token (if any)
            this.setToken(this.getSavedToken());

            this.setStatus("Loading products…", "muted", "#408cff");
            this.fetchAndRender().catch((e) => {
                  console.error(e);
                  this.setStatus(e?.message || "Fetch failed", "error", "#ff5a5a");
            });
      }

      /* --------------------- utils --------------------- */

      $(sel, root = this.root) {
            return root.querySelector(sel);
      }

      safe(v) {
            return v == null ? "" : String(v).replace(/\s+/g, " ").trim();
      }

      escape(v) {
            return this.safe(v)
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
      }

      isHex(v) {
            const s = this.safe(v);
            return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(s);
      }

      cmp(a, b) {
            return (a || "").localeCompare(b || "", undefined, {numeric: true, sensitivity: "base"});
      }

      priceText(p) {
            const price = p?.price;
            if(!price) return "";
            if(price.formattedValue) return price.formattedValue;
            if(price.value != null && price.currencyIso) return `${price.currencyIso} ${price.value}`;
            if(price.FULL?.formattedValue) return price.FULL.formattedValue;
            return "";
      }

      getSavedToken() {
            try {
                  return localStorage.getItem(this.TOKEN_STORAGE_KEY) || "";
            } catch {
                  return "";
            }
      }

      saveToken(token) {
            try {
                  localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
            } catch { }
      }

      clearSavedToken() {
            try {
                  localStorage.removeItem(this.TOKEN_STORAGE_KEY);
            } catch { }
      }

      setToken(token) {
            this.bearerToken = this.safe(token);
      }

      /* --------------------- styles --------------------- */

      injectStyles() {
            const css = `
      .spxCardsWrap{max-width:1200px;margin:18px auto;padding:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e8eef6;}
      .spxPanel{background:rgba(11,15,20,.92);border:1px solid rgba(255,255,255,.10);border-radius:16px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.35);}
      .spxHeader{padding:14px;border-bottom:1px solid rgba(255,255,255,.10);background:rgba(11,15,20,.92);backdrop-filter:blur(10px);}
      .spxTitle{font-size:16px;font-weight:900;margin:0 0 10px 0;}
      .spxControls{display:grid;grid-template-columns:1fr 160px 220px;gap:10px;align-items:center;}
      @media (max-width: 1000px){.spxControls{grid-template-columns:1fr 1fr;}}
      .spxInput,.spxSelect,.spxBtn{
        width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);
        background:rgba(255,255,255,.06);color:#e8eef6;outline:none;
      }
      .spxBtn{cursor:pointer;background:rgba(64,140,255,.18);border-color:rgba(64,140,255,.35);font-weight:800;}
      .spxBtn:hover{background:rgba(64,140,255,.26);}
      .spxBtn.danger{background:rgba(255,90,90,.12);border-color:rgba(255,90,90,.35);}
      .spxBtn.danger:hover{background:rgba(255,90,90,.20);}
      .spxToggle{display:inline-flex;gap:10px;align-items:center;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);user-select:none;}
      .spxToggle input{transform:scale(1.1);}
      .spxRow{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap;}
      .spxTabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}
      .spxTab{
        border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 12px;font-size:12px;
        background:rgba(255,255,255,.06);color:#e8eef6;cursor:pointer;font-weight:800;
      }
      .spxTab.active{background:rgba(64,140,255,.35);border-color:rgba(64,140,255,.6);}
      .spxPill{display:inline-flex;gap:8px;align-items:center;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);font-size:12px;color:rgba(232,238,246,.9);}
      .spxDot{width:10px;height:10px;border-radius:999px;background:#777;border:1px solid rgba(255,255,255,.25);}
      .spxStatus{padding:12px 14px;border-top:1px solid rgba(255,255,255,.10);color:rgba(232,238,246,.85);font-size:13px;}
      .spxStatus.error{background:rgba(255,90,90,.10);border-top-color:rgba(255,90,90,.25);}
      .spxStatus.ok{background:rgba(90,255,170,.08);border-top-color:rgba(90,255,170,.22);}
      .spxBody{padding:14px;}
      .spxGridContainer{display:grid;gap:16px;}
      .spxCategory{display:flex;flex-direction:column;gap:10px;}
      .spxCategoryTitle{font-size:14px;font-weight:900;color:#e8eef6;display:flex;align-items:center;gap:8px;}
      .spxCategoryTitle::before{content:"";width:10px;height:10px;border-radius:999px;background:rgba(64,140,255,.6);}
      .spxCategoryGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;}
      @media (max-width:1100px){.spxCategoryGrid{grid-template-columns:repeat(3,1fr);}}
      @media (max-width:820px){.spxCategoryGrid{grid-template-columns:repeat(2,1fr);}}
      @media (max-width:520px){.spxCategoryGrid{grid-template-columns:1fr;}}
      .spxCard{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.10);border-radius:16px;overflow:hidden;display:flex;flex-direction:column;min-height:240px;}
      .spxCard:hover{border-color:rgba(64,140,255,.35);}
      .spxColourHeader{height:120px;position:relative;display:grid;place-items:center;background:#444;}
      .spxPlaceholder{font-size:12px;color:rgba(232,238,246,.75);padding:10px;text-align:center;}
      .spxColourLabel{
        position:absolute;bottom:8px;right:8px;padding:4px 8px;border-radius:999px;font-size:12px;font-weight:900;
        background:rgba(0,0,0,.45);color:#fff;border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(4px);
      }
      .spxContent{padding:12px;display:grid;gap:8px;}
      .spxName{font-size:14px;line-height:1.2;font-weight:900;}
      .spxMeta{display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;color:rgba(232,238,246,.75);}
      .spxTag{padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);}
      .spxDesc{font-size:12px;line-height:1.35;color:rgba(232,238,246,.72);max-height:3.9em;overflow:hidden;}
      .spxSwatch{display:inline-flex;gap:8px;align-items:center;}
      .spxSwatchBox{width:18px;height:18px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:#555;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25);}
      .spxFooter{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-top:6px;font-size:12px;color:rgba(232,238,246,.75);}
      .spxLink{color:rgba(64,140,255,.95);text-decoration:none;font-weight:850;}
      .spxLink:hover{text-decoration:underline;}
      .spxMuted{color:rgba(232,238,246,.65);}
      .spxSmallBtnRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;}
      .spxHelp{font-size:12px;color:rgba(232,238,246,.7);margin-top:8px;line-height:1.35;}
      .spxHelp code{background:rgba(255,255,255,.06);padding:2px 6px;border-radius:8px;border:1px solid rgba(255,255,255,.10);}
      .spxDragBtn{
        border:0;border-radius:10px;padding:6px 10px;font-size:11px;font-weight:800;
        background:rgba(64,140,255,.35);color:#fff;cursor:grab;
      }
      .spxDragBtn:active{cursor:grabbing;}
    `;

            if(typeof GM_addStyle === "function") GM_addStyle(css);
            else {
                  const style = document.createElement("style");
                  style.textContent = css;
                  document.head.appendChild(style);
            }
      }

      /* --------------------- UI --------------------- */

      buildUI() {
            this.root = document.createElement("div");
            this.root.className = "spxCardsWrap";
            this.root.innerHTML = `
      <div class="spxPanel">
        <div class="spxHeader">
          <div class="spxTitle">Spandex Products — Colour Cards (baseProductCode: 955)</div>

          <div class="spxControls">
            <input class="spxInput" id="spxQ" type="search" placeholder="Search name/code/base/desc..." />
            <select class="spxSelect" id="spxSort">
              <option value="name_asc">Sort: Name A→Z</option>
              <option value="name_desc">Sort: Name Z→A</option>
              <option value="code_asc">Sort: Code A→Z</option>
              <option value="code_desc">Sort: Code Z→A</option>
            </select>
            <label class="spxToggle" title="Only show products with a valid #RRGGBB colourHex">
              <input id="spxOnlyHex" type="checkbox" />
              Only with colourHex
            </label>
          </div>

          <div class="spxHelp">
            Products load automatically when the menu opens. Use tabs, search, and filters to refine results.
          </div>

          <div class="spxRow">
            <span class="spxPill"><span class="spxDot" id="spxDot"></span><span id="spxSummary">Idle</span></span>
            <span class="spxPill">Shown: <strong id="spxShown">0</strong> <span class="spxMuted">/ Loaded:</span> <strong id="spxLoaded">0</strong></span>
            <span class="spxPill">TotalResults: <strong id="spxTotal">?</strong></span>
          </div>

          <div class="spxTabs" id="spxTabs"></div>

          <div class="spxSmallBtnRow">
            <button class="spxBtn" id="spxLoad">Reload products</button>
            <button class="spxBtn" id="spxExport">Export JSON</button>
            <button class="spxBtn" id="spxClear">Clear</button>
          </div>
        </div>

        <div class="spxBody">
          <div class="spxGridContainer" id="spxGrid"></div>
        </div>

        <div class="spxStatus spxMuted" id="spxStatus">Ready.</div>
      </div>
    `;

            this.parent.appendChild(this.root);

            this.ui = {
                  q: this.$("#spxQ"),
                  sort: this.$("#spxSort"),
                  onlyHex: this.$("#spxOnlyHex"),
                  exportBtn: this.$("#spxExport"),
                  loadBtn: this.$("#spxLoad"),
                  clearBtn: this.$("#spxClear"),
                  grid: this.$("#spxGrid"),
                  status: this.$("#spxStatus"),
                  dot: this.$("#spxDot"),
                  summary: this.$("#spxSummary"),
                  shown: this.$("#spxShown"),
                  loaded: this.$("#spxLoaded"),
                  total: this.$("#spxTotal"),
                  tabs: this.$("#spxTabs"),
            };
      }

      bindEvents() {
            this.ui.q.addEventListener("input", () => this.render());
            this.ui.sort.addEventListener("change", () => this.render());
            this.ui.onlyHex.addEventListener("change", () => this.render());
            this.ui.tabs.addEventListener("click", (event) => {
                  const target = event.target.closest(".spxTab");
                  if(!target) return;
                  const label = target.dataset.category || "";
                  if(!label || label === this.activeCategory) return;
                  this.activeCategory = label;
                  this.loadCategory(label).catch((e) => {
                        console.error(e);
                        this.setStatus(e?.message || "Fetch failed", "error", "#ff5a5a");
                  });
            });

            this.ui.clearBtn.addEventListener("click", () => {
                  this.products = [];
                  this.categoryProducts.clear();
                  this.loadedCategories.clear();
                  this.ui.grid.innerHTML = "";
                  this.ui.shown.textContent = "0";
                  this.ui.loaded.textContent = "0";
                  this.ui.total.textContent = "?";
                  this.setStatus("Cleared.", "muted", "#777");
                  this.renderTabs();
            });

            this.ui.exportBtn.addEventListener("click", () => {
                  const blob = new Blob([JSON.stringify(this.products, null, 2)], {type: "application/json"});
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "spandex-products.json";
                  a.click();
                  URL.revokeObjectURL(a.href);
            });

            this.ui.loadBtn.addEventListener("click", () => {
                  this.loadCategory(this.activeCategory, {force: true}).catch((e) => {
                        console.error(e);
                        this.setStatus(e?.message || "Fetch failed", "error", "#ff5a5a");
                  });
            });
      }

      setStatus(text, kind = "muted", dot = "#777") {
            this.ui.status.className = `spxStatus ${kind}`;
            this.ui.status.textContent = text;
            this.ui.summary.textContent = text;
            this.ui.dot.style.background = dot;
      }

      registerDropListener() {
            if(this.onDrop) {
                  document.removeEventListener("dropEvent", this.onDrop);
            }
            this.onDrop = async (event) => {
                  if(!this.draggedProduct || !event?.detail?.productNo) return;
                  const productNo = event.detail.productNo;
                  const cost = this.getDraggedProductCost(this.draggedProduct);
                  const description = this.getDraggedProductDescription(this.draggedProduct);
                  const partNo = getNumPartsInProduct(productNo);
                  const createdPartNo = await q_AddPart_CostMarkup(productNo, partNo, true, false, 1, cost, 2.5, description);
                  await setPartNotes(productNo, createdPartNo, this.buildPartNotes(this.draggedProduct));
                  this.draggedProduct = null;
            };
            document.addEventListener("dropEvent", this.onDrop);
      }

      getDraggedProductCost(product) {
            const priceValue = product?.price?.value ?? product?.price?.FULL?.value;
            const parsed = Number(priceValue);
            return Number.isFinite(parsed) ? parsed : 0;
      }

      getDraggedProductDescription(product) {
            const base = product?.name || product?.baseProductName || product?.baseProduct || "Spandex Item";
            return base.includes("(Spandex)") ? base : base + " (Spandex)";
      }

      buildPartNotes(product) {
            const lines = [
                  "Name: " + (product?.name || "N/A"),
                  "Code: " + (product?.code || "N/A"),
                  "Base: " + (product?.baseProductName || product?.baseProduct || "N/A"),
                  "Colour: " + (product?.colourCommercial || "N/A"),
                  "Colour Hex: " + (product?.colourHex || "N/A"),
                  "Price: " + (this.priceText(product) || "N/A"),
            ];
            return lines.join("\n");
      }

      /* --------------------- GM request (CORS bypass) --------------------- */

      requestJson(url, headers = {}) {
            return new Promise((resolve, reject) => {
                  if(typeof GM_xmlhttpRequest !== "function") {
                        reject(new Error("GM_xmlhttpRequest not available (missing @grant?)"));
                        return;
                  }

                  GM_xmlhttpRequest({
                        method: "GET",
                        url,
                        headers,
                        responseType: "json",
                        onload: (resp) => {
                              if(resp.status >= 200 && resp.status < 300) {
                                    try {
                                          const data = resp.response ?? JSON.parse(resp.responseText);
                                          resolve(data);
                                    } catch {
                                          reject(new Error("Failed to parse JSON response"));
                                    }
                              } else {
                                    const body = String(resp.responseText || "").slice(0, 500);
                                    reject(new Error(`HTTP ${resp.status}: ${body}`));
                              }
                        },
                        onerror: () => reject(new Error("Network error / request blocked")),
                        ontimeout: () => reject(new Error("Request timeout")),
                  });
            });
      }

      /* --------------------- fetch --------------------- */

      async fetchBearerToken() {
            const response = await fetch(this.TOKEN_ENDPOINT, {
                  method: "GET",
                  headers: {accept: "application/json"},
            });

            if(!response.ok) {
                  throw new Error(`Token fetch failed (HTTP ${response.status})`);
            }

            const data = await response.json();
            const rawToken = this.safe(data?.bearerToken);

            if(!rawToken) {
                  throw new Error("Token response missing bearerToken");
            }

            const token = /^Bearer\s+/i.test(rawToken) ? rawToken : `Bearer ${rawToken}`;
            this.setToken(token);
            this.saveToken(token);
      }

      async fetchCategory(category, {onProgress} = {}) {
            const token = this.safe(this.bearerToken);

            if(!token) {
                  throw new Error("No token set. Try reloading products.");
            }
            if(!/^Bearer\s+/i.test(token)) {
                  throw new Error("Token must start with 'Bearer ' (include the prefix).");
            }

            const headers = {
                  accept: "application/json, text/plain, */*",
                  authorization: token,
            };

            if(!category) return [];

            const all = [];
            let currentPage = 0;
            let categoryTotal = Infinity;
            let categoryCollected = 0;
            const query = encodeURIComponent(`::baseProductCode:${category.baseProductCode}`);

            while(categoryCollected < categoryTotal) {
                  const url = `${this.BASE_URL_PREFIX}${query}${this.BASE_URL_SUFFIX}&pageSize=${this.PAGE_SIZE}&currentPage=${currentPage}`;
                  const data = await this.requestJson(url, headers);

                  const products = (data.products || []).map((product) => ({
                        ...product,
                        spxCategory: category.label,
                  }));
                  const pag = data.pagination || {};
                  if(categoryTotal === Infinity) {
                        categoryTotal = Number(pag.totalResults ?? 0);
                  }

                  all.push(...products);
                  categoryCollected += products.length;

                  if(onProgress) {
                        onProgress({
                              category: category.label,
                              currentPage,
                              pageCount: products.length,
                              collected: categoryCollected,
                              totalResults: categoryTotal,
                        });
                  }

                  if(products.length === 0) break;
                  currentPage++;
            }

            const byCode = new Map();
            for(const p of all) {
                  const key = `${p.spxCategory || "Unknown"}:${p.code || ""}`;
                  byCode.set(key, p);
            }
            return Array.from(byCode.values());
      }

      /* --------------------- render --------------------- */

      render() {
            const q = this.safe(this.ui.q.value).toLowerCase();
            const onlyHex = this.ui.onlyHex.checked;
            const sort = this.ui.sort.value;

            let items = (this.categoryProducts.get(this.activeCategory) || []).slice();

            if(q) {
                  items = items.filter((p) => {
                        const hay = [
                              p.name,
                              p.code,
                              p.baseProduct,
                              p.baseProductName,
                              p.shortDescription,
                              p.colourCommercial,
                              p.colourHex,
                        ]
                              .map((v) => this.safe(v))
                              .join(" ")
                              .toLowerCase();
                        return hay.includes(q);
                  });
            }

            if(onlyHex) items = items.filter((p) => this.isHex(p.colourHex));

            items.sort((a, b) => {
                  switch(sort) {
                        case "name_desc":
                              return this.cmp(b.name, a.name);
                        case "code_asc":
                              return this.cmp(a.code, b.code);
                        case "code_desc":
                              return this.cmp(b.code, a.code);
                        case "name_asc":
                        default:
                              return this.cmp(a.name, b.name);
                  }
            });

            const renderCard = (p) => {
                  const name = this.escape(p.name || "(No name)");
                  const code = this.escape(p.code || "");
                  const base = this.escape(p.baseProductName || p.baseProduct || "");
                  const desc = this.escape(p.shortDescription || "");
                  const hexRaw = this.safe(p.colourHex);
                  const hexValid = this.isHex(hexRaw);
                  const headerBg = hexValid ? hexRaw : "#444";
                  const swatchLabel = hexValid ? hexRaw : (hexRaw ? `${hexRaw} (invalid)` : "No colourHex");
                  const colourName = this.escape(p.colourCommercial || "Colour");
                  const price = this.escape(this.priceText(p));
                  const url = this.safe(p.url);
                  const category = this.escape(p.spxCategory || "Unknown");
                  const dragButton = code
                        ? `<button class="spxDragBtn" data-code="${this.escape(code)}" data-category="${category}" draggable="true">Drag</button>`
                        : "";

                  const openLink =
                        url && url.startsWith("/")
                              ? `<a class="spxLink" href="https://shop.spandex.com${this.escape(url)}" target="_blank" rel="noopener">Open</a>`
                              : "";
                  const footerActions = [openLink, dragButton].filter(Boolean).join(" ");

                  return `
          <article class="spxCard">
            <div class="spxColourHeader" style="background:${this.escape(headerBg)}" title="${this.escape(swatchLabel)}">
              ${hexValid ? `<div class="spxColourLabel">${this.escape(hexRaw)}</div>` : `<div class="spxPlaceholder">No colourHex</div>`}
            </div>

            <div class="spxContent">
              <div class="spxName">${name}</div>

              <div class="spxMeta">
                ${code ? `<span class="spxTag">Code: ${code}</span>` : ""}
                ${base ? `<span class="spxTag">Base: ${base}</span>` : ""}
                ${price ? `<span class="spxTag">Price: ${price}</span>` : ""}
              </div>

              <div class="spxSwatch">
                <span class="spxSwatchBox" style="background:${hexValid ? this.escape(hexRaw) : "#555"}" title="${this.escape(swatchLabel)}"></span>
                <span class="spxTag">${colourName}</span>
                <span class="spxTag">${this.escape(swatchLabel)}</span>
              </div>

              ${desc ? `<div class="spxDesc">${desc}</div>` : ""}

              <div class="spxFooter">
                <span>${p.purchasable === false ? "Not purchasable" : (p.purchasable === true ? "Purchasable" : "")}</span>
                <span>${footerActions}</span>
              </div>
            </div>
          </article>
        `;
            };

            this.ui.grid.innerHTML = `
          <section class="spxCategory">
            <div class="spxCategoryTitle">${this.escape(this.activeCategory)} (${items.length})</div>
            <div class="spxCategoryGrid">
              ${items.map(renderCard).join("")}
            </div>
          </section>
        `;

            this.ui.shown.textContent = String(items.length);
            this.ui.loaded.textContent = String(items.length);
            this.ui.total.textContent = String(items.length);
            this.renderTabs();
            this.bindCardDragEvents(items);
      }

      renderTabs() {
            const tabs = this.CATEGORIES.map((category) => {
                  const count = this.categoryProducts.get(category.label)?.length ?? 0;
                  const isActive = category.label === this.activeCategory;
                  const label = this.escape(category.label);
                  return `<button class="spxTab${isActive ? " active" : ""}" data-category="${label}">${label} (${count})</button>`;
            }).join("");
            this.ui.tabs.innerHTML = tabs;
      }

      bindCardDragEvents(items) {
            const map = new Map(items.map((item) => [`${item.spxCategory || "Unknown"}:${item.code || ""}`, item]));
            const buttons = this.ui.grid.querySelectorAll(".spxDragBtn");
            for(const button of buttons) {
                  button.addEventListener("dragstart", (event) => {
                        const code = button.dataset.code || "";
                        const category = button.dataset.category || "Unknown";
                        this.draggedProduct = map.get(`${category}:${code}`) || null;
                        if(event.dataTransfer) {
                              event.dataTransfer.setData("text/plain", "spandex-product");
                        }
                  });
            }
      }

      /* --------------------- load + render --------------------- */

      async loadCategory(label, {force = false} = {}) {
            const category = this.CATEGORIES.find((item) => item.label === label);
            if(!category) return;
            if(this.loadedCategories.has(label) && !force) {
                  this.render();
                  return;
            }

            this.ui.grid.innerHTML = "";
            this.ui.shown.textContent = "0";
            this.ui.loaded.textContent = "0";
            this.ui.total.textContent = "?";

            if(this.loadingSpinner) {
                  this.loadingSpinner.Delete();
            }
            this.loadingSpinner = new Loader(this.ui.grid);
            this.loadingSpinner.setSize(40);

            try {
                  this.setStatus("Fetching token…", "muted", "#408cff");
                  await this.fetchBearerToken();

                  this.setStatus(`Fetching ${label}…`, "muted", "#408cff");
                  const products = await this.fetchCategory(category, {
                        onProgress: ({category: name, currentPage, pageCount, collected, totalResults}) => {
                              this.ui.loaded.textContent = String(collected);
                              this.ui.total.textContent = totalResults ? String(totalResults) : "?";
                              this.setStatus(
                                    `${name}: page ${currentPage} -> +${pageCount} (collected ${collected})`,
                                    "muted",
                                    "#408cff"
                              );
                        },
                  });

                  this.categoryProducts.set(label, products);
                  this.loadedCategories.add(label);
                  this.products = Array.from(this.categoryProducts.values()).flat();
                  window.spandexProducts = this.products;

                  this.ui.loaded.textContent = String(products.length);
                  this.ui.total.textContent = String(products.length);

                  this.setStatus(`Done. ${label}: ${products.length} products`, "ok", "#5affaa");
                  this.render();
            } finally {
                  if(this.loadingSpinner) {
                        this.loadingSpinner.Delete();
                        this.loadingSpinner = null;
                  }
            }
      }

      async fetchAndRender() {
            await this.loadCategory(this.activeCategory);
      }
}

/* =========================
   INSTANTIATION
   ========================= */
//(function init() {
// new SpandexColourCards(document.body);
//})();
