class CapralMenu extends LHSMenuWindow {

      #page;
      #statusText;
      #productGrid;
      #reloadButton;
      #categoryDropdown;
      #categoryDropdownContainer;
      #filterDropdowns = [];
      #filterDropdownContainer;
      #cardProducts = new WeakMap();
      #isUpdatingFilters = false;
      #draggedProduct;
      #onDrop;

      #productsByCategory = new Map();
      #cards = [];
      #imageCache = new Map();
      #categoryImages = new Map();
      #isLoading = false;
      #hasAttemptedLoad = false;

      #CAPRAL_CATEGORY_MIN = 25;
      #CAPRAL_CATEGORY_MAX = 40;
      #CAPRAL_ENDPOINT = "https://s1k2jek8fa.execute-api.ap-southeast-2.amazonaws.com/production/internal/v1/product_list";
      #CAPRAL_CATEGORY_LABELS = new Map([
            [25, "Angle"],
            [26, "U Channel"],
            [27, "Tee Section"],
            [28, "Flat Bar"],
            [29, "RHS"],
            [30, "SHS"],
            [31, "Square Solid"],
            [32, "Round Hollow"],
            [33, "Round Solid"],
            [34, "Machining Round Bar"],
            [36, "Sheet"],
            [37, "Plate"],
            [38, "Treadplate"],
            [39, "Specialties"]
      ]);

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
            this.#page = this.getPage(0);

            this.createGUI();
      }

      show() {
            super.show();
            this.registerDropListener();
            if(!this.#hasAttemptedLoad) {
                  this.loadAllCategories();
            } else {
                  this.applyFilter();
            }
      }

      hide() {
            if(this.#onDrop) {
                  document.removeEventListener("dropEvent", this.#onDrop);
            }
            super.hide();
      }

      createGUI() {
            this.clearPages(0);

            const controls = document.createElement("div");
            controls.className = "capral-controls";
            controls.style = "display:flex;flex-wrap:wrap;gap:10px;padding:10px;align-items:center;background-color:#f6f8fb;position:sticky;top:0;z-index:5;border-bottom:1px solid #c5d9ff;";

            this.#categoryDropdownContainer = document.createElement("div");
            this.#categoryDropdownContainer.className = "capral-category-dropdown";
            this.#categoryDropdownContainer.style = "display:flex;align-items:center;gap:10px;";
            controls.appendChild(this.#categoryDropdownContainer);

            this.buildCategoryDropdown([{label: "All categories (loading…)", value: "all", img: ""}], "all");
            this.setCategoryDropdownDisabled(true);

            this.#filterDropdownContainer = document.createElement("div");
            this.#filterDropdownContainer.style = "display:flex;flex-wrap:wrap;gap:10px;align-items:center;transform:scale(0.6);transform-origin:left top;width:100%;";
            const filterWrapper = createDivStyle5("margin:0;width:100%;", "Filters", controls);
            filterWrapper[1].appendChild(this.#filterDropdownContainer);
            this.buildFilterDropdowns();

            this.#reloadButton = createButton("Reload", "margin:0;padding:8px 12px;min-width:100px;background-color:#1f5ca8;color:white;border:0;float:none;width:auto;", () => {
                  this.loadAllCategories(true);
            });
            controls.appendChild(this.#reloadButton);

            const resetFiltersButton = createButton("Reset Filters", "margin:0;padding:8px 12px;min-width:120px;background-color:#1f5ca8;color:white;border:0;float:none;width:auto;", () => {
                  this.resetFilters();
            });
            controls.appendChild(resetFiltersButton);

            this.#statusText = createText("Load Capral products to begin.", "flex:1 1 100%;padding:8px 10px;color:#0e335f;background-color:#e8f2ff;border:1px solid #c5d9ff;border-radius:4px;box-sizing:border-box;");
            controls.appendChild(this.#statusText);

            this.#page.appendChild(controls);

            const dropdownStyle = document.createElement("style");
            dropdownStyle.textContent = ".capral-category-dropdown .TDropdown-item img { width: 100px; height: 100px; }";
            this.#page.appendChild(dropdownStyle);

            this.#productGrid = document.createElement("div");
            this.#productGrid.style = "display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:10px;padding:10px;box-sizing:border-box;overflow-y:auto;background-color:white;color:black;";
            this.#page.appendChild(this.#productGrid);
      }

      async loadAllCategories(forceReload = false) {
            if(this.#isLoading) return;
            if(this.#hasAttemptedLoad && !forceReload) return;

            this.#hasAttemptedLoad = true;
            this.#isLoading = true;
            this.#productsByCategory.clear();
            this.#cards = [];
            this.#categoryImages.clear();
            this.#cardProducts = new WeakMap();
            this.#productGrid.innerHTML = "";
            this.buildCategoryDropdown([{label: "All categories (loading…)", value: "all", img: ""}], "all");
            this.setCategoryDropdownDisabled(true);
            this.buildFilterDropdowns();
            this.updateStatus("Scanning Capral categories " + this.#CAPRAL_CATEGORY_MIN + "-" + this.#CAPRAL_CATEGORY_MAX + "…");

            const failedCategories = [];
            for(let category = this.#CAPRAL_CATEGORY_MIN; category <= this.#CAPRAL_CATEGORY_MAX; category++) {
                  this.updateStatus("Loading category " + category + " of " + this.#CAPRAL_CATEGORY_MAX + "…");
                  const {products, failed, categoryImage} = await this.fetchCategory(category);
                  if(failed) failedCategories.push(category);
                  if(products.length > 0) {
                        this.#productsByCategory.set(category, products);
                        const resolvedCategoryImage = categoryImage || this.extractCategoryImageFromProducts(products);
                        if(resolvedCategoryImage) {
                              this.#categoryImages.set(category, resolvedCategoryImage);
                        } else {
                              console.log("Capral category missing image, using product fallback failed", {category, products});
                        }
                        this.renderCards(category, products);
                  }
            }

            this.#isLoading = false;
            this.setCategoryDropdownDisabled(this.#productsByCategory.size === 0);
            this.buildCategoryDropdown(this.buildCategoryOptions(), "all");
            this.updateFilterDropdowns();

            if(this.#productsByCategory.size === 0) {
                  this.updateStatus("No Capral products were returned. Check your connection or try again" + (failedCategories.length ? " (failed categories: " + failedCategories.join(", ") + ")" : "") + ".");
            } else {
                  const failedSuffix = failedCategories.length > 0 ? " • " + failedCategories.length + " categories failed: " + failedCategories.join(", ") : "";
                  this.updateStatus("Loaded " + this.totalProductCount() + " products across " + this.#productsByCategory.size + " categories." + failedSuffix);
                  this.applyFilter();
            }
      }

      buildCategoryOptions() {
            const options = [{label: "All categories", value: "all", img: ""}];
            for(const [category, products] of this.#productsByCategory) {
                  const categoryLabel = this.#CAPRAL_CATEGORY_LABELS.get(category) || ("Category " + category);
                  options.push({
                        label: categoryLabel + " (" + products.length + ")",
                        value: String(category),
                        img: this.#categoryImages.get(category) || ""
                  });
            }
            return options;
      }

      buildCategoryDropdown(options, defaultValue) {
            if(this.#categoryDropdown?.element?.parentNode) {
                  this.#categoryDropdown.element.parentNode.removeChild(this.#categoryDropdown.element);
            }

            this.#categoryDropdown = new TDropdown({
                  label: "Category",
                  options: options,
                  defaultValue: defaultValue,
                  parent: this.#categoryDropdownContainer,
                  onChange: () => {
                        if(this.#isUpdatingFilters) return;
                        this.updateFilterDropdowns();
                        this.applyFilter();
                  }
            });
      }

      setCategoryDropdownDisabled(disabled) {
            if(!this.#categoryDropdown) return;
            this.#categoryDropdown.element.style.pointerEvents = disabled ? "none" : "auto";
            this.#categoryDropdown.element.style.opacity = disabled ? "0.6" : "1";
      }

      applyFilter() {
            const filter = this.#categoryDropdown?.getValue() || "all";
            const activeFilters = this.getActiveFilters();
            for(const card of this.#cards) {
                  const cardProduct = this.#cardProducts.get(card);
                  if(!cardProduct) {
                        card.style.display = "none";
                        continue;
                  }
                  const matchesCategory = filter === "all" || cardProduct.category === filter;
                  const matchesFilters = this.productMatchesFilters(cardProduct.product, activeFilters);
                  card.style.display = matchesCategory && matchesFilters ? "flex" : "none";
            }
      }

      updateStatus(text) {
            this.#statusText.innerText = text;
      }

      async fetchCategory(category) {
            const url = this.#CAPRAL_ENDPOINT + "?include=variants,custom_fields&limit=1000&page=1&category=" + category + "&group_id=2670";
            try {
                  const response = await fetch(url, {
                        method: "GET",
                        mode: "cors",
                        credentials: "omit",
                        headers: {
                              "Accept": "application/json"
                        }
                  });

                  if(!response.ok) {
                        throw new Error("HTTP " + response.status);
                  }

                  const data = await response.json();
                  const categoryImage = this.extractCategoryImage(data, category);
                  const products = this.extractProducts(data);
                  if(products.length === 0) {
                        return {products: [], failed: false, categoryImage: categoryImage};
                  }
                  return {products: products, failed: false, categoryImage: categoryImage};
            } catch(error) {
                  console.error("Capral fetch error for category " + category, error);
                  this.updateStatus("Category " + category + " failed: " + error.message);
                  return {products: [], failed: true, categoryImage: null};
            }
      }

      extractProducts(apiResponse) {
            if(!apiResponse) return [];
            const directArray = Array.isArray(apiResponse) ? apiResponse : null;
            if(directArray) return directArray;

            const dataField = apiResponse.data ?? apiResponse.results ?? apiResponse.products;
            if(Array.isArray(dataField)) return dataField;
            if(Array.isArray(dataField?.data)) return dataField.data;
            return [];
      }

      extractCategoryImage(apiResponse) {
            if(!apiResponse) return null;
            const category = apiResponse.category ?? apiResponse.category_data ?? apiResponse.categoryInfo;
            const candidates = [
                  category?.image_url,
                  category?.image,
                  category?.image?.url,
                  category?.image?.src,
                  apiResponse.category_image,
                  apiResponse.image,
                  apiResponse.image_url,
                  apiResponse.images?.[0]?.src,
                  apiResponse.images?.[0]?.url
            ];
            return candidates.find((value) => typeof value === "string" && value.length > 0) || null;
      }

      extractCategoryImageFromProducts(products) {
            if(!Array.isArray(products)) return null;
            for(const product of products) {
                  const imageUrl = this.extractImageUrl(product);
                  if(this.isNonEmptyString(imageUrl)) return imageUrl;
            }
            return null;
      }

      renderCards(category, products) {
            for(const product of products) {
                  const card = document.createElement("div");
                  card.className = "capral-card";
                  card.dataset.category = String(category);
                  card.style = "display:flex;flex-direction:column;gap:6px;background:linear-gradient(135deg,#f7fbff,#eef4ff);border:1px solid #c5d9ff;border-left:4px solid #1f5ca8;border-radius:6px;padding:10px;cursor:pointer;box-shadow:rgb(0 0 0 / 10%) 0px 2px 6px;";

                  const imageUrl = this.extractImageUrl(product);
                  if(imageUrl) {
                        const image = this.createCardImage(imageUrl, product.name || product.title || "Capral product image");
                        card.appendChild(image);
                  }

                  const headerRow = document.createElement("div");
                  headerRow.style = "display:flex;align-items:center;gap:6px;";

                  const description = document.createElement("div");
                  description.innerText = product.description || "N/A";
                  description.style = "font-weight:bold;color:#0e335f;font-size:14px;flex:1;";
                  headerRow.appendChild(description);

                  const dragButton = createButton("Drag", "margin:0;padding:4px 8px;min-width:auto;float:none;font-size:11px;background-color:#1f5ca8;color:white;border:0;", () => { });
                  dragButton.draggable = true;
                  dragButton.addEventListener("dragstart", (event) => {
                        this.#draggedProduct = product;
                        if(event.dataTransfer) {
                              event.dataTransfer.setData("text/plain", "capral-product");
                        }
                  });
                  headerRow.appendChild(dragButton);
                  card.appendChild(headerRow);

                  const name = document.createElement("div");
                  name.innerText = product.name || product.title || "Unnamed product";
                  name.style = "color:#2d3a4a;font-size:12px;";
                  card.appendChild(name);

                  const dimensionPills = this.createDimensionPills(product);
                  if(dimensionPills) {
                        card.appendChild(dimensionPills);
                  }

                  const price = document.createElement("div");
                  const variantPrices = this.extractVariantPrices(product);
                  price.innerText = "Cost: " + (variantPrices.length ? this.formatPrices(variantPrices) : "N/A");
                  price.style = "color:#1f5ca8;font-weight:bold;font-size:12px;";
                  card.appendChild(price);

                  const categoryBadge = document.createElement("div");
                  categoryBadge.innerText = "Category " + category;
                  categoryBadge.style = "align-self:flex-start;background:#1f5ca8;color:white;padding:2px 6px;border-radius:4px;font-size:11px;";
                  card.appendChild(categoryBadge);

                  card.onclick = () => this.showProductModal(product, category);

                  this.#productGrid.appendChild(card);
                  this.#cards.push(card);
                  this.#cardProducts.set(card, {product: product, category: String(category)});
            }
      }

      extractVariantPrices(product) {
            if(!product || !Array.isArray(product.variants)) return [];
            const priceSet = new Set();
            for(const variant of product.variants) {
                  if(variant && typeof variant.price === "number") {
                        priceSet.add(variant.price);
                  }
            }
            return Array.from(priceSet.values()).sort((a, b) => a - b);
      }

      formatPrices(values) {
            return values.map((value) => "$" + Number(value).toFixed(2)).join(" | ");
      }

      totalProductCount() {
            let count = 0;
            for(const [, products] of this.#productsByCategory) {
                  count += products.length;
            }
            return count;
      }

      showProductModal(product, category) {
            const modal = new Modal("Capral • " + (product.name || "Product") + " (Cat " + category + ")");
            const body = modal.getBodyElement();
            while(body.firstChild) {
                  body.removeChild(body.firstChild);
            }

            const imageUrl = this.extractImageUrl(product);
            if(imageUrl) {
                  const image = this.createCardImage(imageUrl, product.name || product.title || "Capral product image");
                  image.style.cssText += "max-height:220px;object-fit:contain;";
                  body.appendChild(image);
            }

            const summary = document.createElement("div");
            summary.style = "padding:10px;color:#0e335f;";
            const variantPrices = this.extractVariantPrices(product);
            summary.innerHTML = "<b>Name:</b> " + (product.name || "N/A") + "<br>" +
                  "<b>Type:</b> " + (product.type || product.product_type || "N/A") + "<br>" +
                  "<b>Category:</b> " + category + "<br>" +
                  "<b>Cost:</b> " + (variantPrices.length ? this.formatPrices(variantPrices) : "N/A") + "<br>" +
                  "<b>SKU:</b> " + (product.sku || (product.variants && product.variants[0] ? product.variants[0].sku || "N/A" : "N/A"));
            body.appendChild(summary);

            const detail = document.createElement("pre");
            detail.style = "background:#f6f8fb;border:1px solid #c5d9ff;border-radius:6px;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;";
            detail.textContent = JSON.stringify(product, null, 2);
            body.appendChild(detail);

            const closeBtn = createButton("Close", "margin:10px;background-color:#1f5ca8;color:white;border:0;padding:8px 12px;float:none;width:auto;", () => modal.hide());
            modal.addFooterElement(closeBtn);
      }

      extractImageUrl(product) {
            if(!product) return null;
            const productImage = this.extractImageUrlFromFields(product.custom_fields);
            if(this.isValidImageUrl(productImage)) return productImage;
            if(Array.isArray(product.variants)) {
                  for(const variant of product.variants) {
                        const variantImage = this.extractImageUrlFromFields(variant?.custom_fields);
                        if(this.isValidImageUrl(variantImage)) return variantImage;
                  }
            }
            return null;
      }

      extractImageUrlFromFields(customFields) {
            if(!Array.isArray(customFields)) return null;
            const imageField = customFields.find((field) => field?.name === "Google_Merchant_Image_2_URL");
            if(!imageField || !imageField.value) return null;
            return typeof imageField.value === "string" ? imageField.value.trim() : imageField.value;
      }

      isNonEmptyString(value) {
            return typeof value === "string" && value.trim().length > 0;
      }

      isValidImageUrl(value) {
            if(!this.isNonEmptyString(value)) return false;
            if(value.trim().toUpperCase() === "NONE") return false;
            return true;
      }

      createDimensionPills(product) {
            if(!product || !Array.isArray(product.custom_fields)) return null;
            const dimensionFields = product.custom_fields.filter((field) => {
                  if(!field?.name) return false;
                  if(!(field.name === "LENGTH" || field.name.startsWith("DIMENSION_") || field.name === "COATING_DESC" || field.name === "WIDTH" || field.name === "HEIGHT" || field.name === "ALLOY" || field.name === "TEMPER")) return false;
                  return this.isValidDimensionValue(field.value);
            });

            if(dimensionFields.length === 0) return null;

            const preferredOrder = ["A", "B", "T", "RADIUS", "LENGTH", "WIDTH", "HEIGHT", "COATING_DESC", "ALLOY", "TEMPER"];
            dimensionFields.sort((a, b) => {
                  const aLabel = this.getDimensionLabel(a.name);
                  const bLabel = this.getDimensionLabel(b.name);
                  const aIndex = preferredOrder.indexOf(aLabel);
                  const bIndex = preferredOrder.indexOf(bLabel);
                  if(aIndex !== -1 || bIndex !== -1) {
                        if(aIndex === -1) return 1;
                        if(bIndex === -1) return -1;
                        return aIndex - bIndex;
                  }
                  return aLabel.localeCompare(bLabel);
            });

            const wrapper = document.createElement("div");
            wrapper.style = "display:flex;flex-wrap:wrap;gap:6px;";

            for(const field of dimensionFields) {
                  const labelText = this.getDimensionLabel(field.name);
                  const isPrimary = ["A", "B", "T", "RADIUS", "LENGTH", "WIDTH", "HEIGHT", "COATING_DESC"].includes(labelText);
                  const pill = document.createElement("div");
                  pill.style = "display:flex;flex-direction:column;gap:2px;background:" + (isPrimary ? "#1f5ca8" : "#e8f2ff") + ";border:1px solid " + (isPrimary ? "#1f5ca8" : "#c5d9ff") + ";border-radius:999px;padding:4px 10px;";

                  const label = document.createElement("div");
                  label.innerText = labelText;
                  label.style = "font-size:10px;color:" + (isPrimary ? "#e8f2ff" : "#1f5ca8") + ";text-transform:uppercase;letter-spacing:0.4px;";

                  const value = document.createElement("div");
                  value.innerText = this.formatDimensionValue(field.value);
                  value.style = "font-size:12px;color:" + (isPrimary ? "#ffffff" : "#0e335f") + ";font-weight:bold;";

                  pill.appendChild(label);
                  pill.appendChild(value);
                  wrapper.appendChild(pill);
            }

            return wrapper;
      }

      isValidDimensionValue(value) {
            if(value === null || value === undefined) return false;
            if(typeof value === "number") return value !== 0;
            const trimmed = String(value).trim();
            if(trimmed.length === 0) return false;
            if(trimmed.toUpperCase() === "NONE") return false;
            const numeric = Number(trimmed);
            if(!Number.isNaN(numeric) && numeric === 0) return false;
            if(trimmed === "0.00") return false;
            return true;
      }

      formatDimensionValue(value) {
            if(value === null || value === undefined) return "";
            const numeric = Number(value);
            if(!Number.isNaN(numeric)) {
                  return numeric.toString();
            }
            const trimmed = String(value).trim();
            if(trimmed.includes(".")) {
                  const parsed = Number(trimmed);
                  if(!Number.isNaN(parsed)) return parsed.toString();
                  return trimmed.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
            }
            return trimmed;
      }

      getDimensionLabel(fieldName) {
            if(!fieldName) return "";
            if(fieldName === "LENGTH") return "LENGTH";
            if(fieldName === "WIDTH") return "WIDTH";
            if(fieldName === "HEIGHT") return "HEIGHT";
            if(fieldName === "COATING_DESC") return "COATING";
            if(fieldName === "ALLOY") return "ALLOY";
            if(fieldName === "TEMPER") return "TEMPER";
            if(fieldName.startsWith("DIMENSION_")) {
                  return fieldName.replace("DIMENSION_", "");
            }
            return fieldName;
      }

      buildFilterDropdowns() {
            if(!this.#filterDropdownContainer) return;
            this.#filterDropdownContainer.innerHTML = "";
            this.#filterDropdowns = [];
            this.updateFilterDropdowns();
      }

      resetFilters() {
            this.#isUpdatingFilters = true;
            this.#filterDropdowns.forEach((entry) => entry.dropdown.setValue(""));
            this.#isUpdatingFilters = false;
            this.updateFilterDropdowns();
            this.applyFilter();
      }

      updateFilterDropdowns() {
            if(!this.#filterDropdownContainer) return;
            const category = this.#categoryDropdown?.getValue() || "all";
            const baseProducts = this.getProductsForCategory(category);
            const previousSelections = new Map(this.#filterDropdowns.map((entry) => [entry.label, entry.dropdown.getValue()]));
            const nextDropdowns = [];
            const labels = this.getFilterLabels(baseProducts);

            this.#isUpdatingFilters = true;
            this.#filterDropdownContainer.innerHTML = "";

            for(const label of labels) {
                  const otherFilters = this.getActiveFilters().filter((filter) => filter.label !== label);
                  const scopedProducts = this.filterProductsByFilters(baseProducts, otherFilters);
                  const options = this.buildFilterOptionsForLabel(scopedProducts, label);
                  const currentValue = previousSelections.get(label) || "";
                  const hasCurrentValue = options.some((option) => option.value === currentValue);
                  const dropdown = new TDropdown({
                        label: label,
                        options: options,
                        defaultValue: "",
                        parent: this.#filterDropdownContainer,
                        onChange: () => {
                              if(this.#isUpdatingFilters) return;
                              this.updateFilterDropdowns();
                              this.applyFilter();
                        }
                  });
                  dropdown.setValue(hasCurrentValue ? currentValue : "");
                  nextDropdowns.push({label: label, dropdown: dropdown});
            }

            this.#filterDropdowns = nextDropdowns;
            this.#isUpdatingFilters = false;
      }

      buildFilterOptions(products) {
            const optionsMap = new Map();
            for(const product of products) {
                  const pairs = this.getDimensionPairs(product);
                  for(const pair of pairs) {
                        const key = pair.label + "::" + pair.value;
                        if(!optionsMap.has(key)) {
                              optionsMap.set(key, {label: pair.label + ": " + pair.value, value: key, img: ""});
                        }
                  }
            }
            return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
      }

      buildFilterOptionsForLabel(products, label) {
            const optionsMap = new Map();
            for(const product of products) {
                  const pairs = this.getDimensionPairs(product).filter((pair) => pair.label === label);
                  for(const pair of pairs) {
                        const key = pair.label + "::" + pair.value;
                        if(!optionsMap.has(key)) {
                              optionsMap.set(key, {label: pair.value, value: key, img: ""});
                        }
                  }
            }
            return Array.from(optionsMap.values()).sort((a, b) => a.label.localeCompare(b.label));
      }

      getActiveFilters() {
            return this.#filterDropdowns
                  .map((entry) => entry.dropdown.getValue())
                  .filter((value) => value)
                  .map((value) => {
                        const [label, val] = value.split("::");
                        return {label: label, value: val};
                  });
      }

      filterProductsByFilters(products, filters) {
            if(filters.length === 0) return products;
            return products.filter((product) => this.productMatchesFilters(product, filters));
      }

      productMatchesFilters(product, filters) {
            if(filters.length === 0) return true;
            const pairs = this.getDimensionPairs(product);
            return filters.every((filter) => pairs.some((pair) => pair.label === filter.label && pair.value === filter.value));
      }

      getProductsForCategory(category) {
            if(category === "all") {
                  const allProducts = [];
                  for(const products of this.#productsByCategory.values()) {
                        allProducts.push(...products);
                  }
                  return allProducts;
            }
            const categoryNumber = Number(category);
            return this.#productsByCategory.get(categoryNumber) || [];
      }

      getFilterLabels(products) {
            const labels = new Set();
            for(const product of products) {
                  const pairs = this.getDimensionPairs(product);
                  for(const pair of pairs) {
                        labels.add(pair.label);
                  }
            }
            const preferredOrder = ["A", "B", "T", "RADIUS", "LENGTH", "WIDTH", "HEIGHT", "COATING", "ALLOY", "TEMPER"];
            return Array.from(labels).sort((a, b) => {
                  const aIndex = preferredOrder.indexOf(a);
                  const bIndex = preferredOrder.indexOf(b);
                  if(aIndex !== -1 || bIndex !== -1) {
                        if(aIndex === -1) return 1;
                        if(bIndex === -1) return -1;
                        return aIndex - bIndex;
                  }
                  return a.localeCompare(b);
            });
      }

      getDimensionPairs(product) {
            if(!product || !Array.isArray(product.custom_fields)) return [];
            const pairs = [];
            for(const field of product.custom_fields) {
                  if(!field?.name) continue;
                  if(!(field.name === "LENGTH" || field.name.startsWith("DIMENSION_") || field.name === "COATING_DESC" || field.name === "WIDTH" || field.name === "HEIGHT" || field.name === "ALLOY" || field.name === "TEMPER")) continue;
                  if(!this.isValidDimensionValue(field.value)) continue;
                  const label = this.getDimensionLabel(field.name);
                  const value = this.formatDimensionValue(field.value);
                  if(label && value) pairs.push({label: label, value: value});
            }
            return pairs;
      }

      createCardImage(url, altText) {
            let cachedImage = this.#imageCache.get(url);
            if(!cachedImage) {
                  cachedImage = document.createElement("img");
                  cachedImage.src = url;
                  cachedImage.loading = "lazy";
                  cachedImage.style = "width:100%;height:140px;object-fit:cover;border-radius:4px;border:1px solid #c5d9ff;background-color:white;";
                  cachedImage.alt = altText;
                  this.#imageCache.set(url, cachedImage);
            }

            const image = cachedImage.cloneNode(true);
            image.alt = altText;
            return image;
      }

      registerDropListener() {
            if(this.#onDrop) {
                  document.removeEventListener("dropEvent", this.#onDrop);
            }
            this.#onDrop = async (event) => {
                  if(!this.#draggedProduct || !event?.detail?.productNo) return;
                  const productNo = event.detail.productNo;
                  const cost = this.getDraggedProductCost(this.#draggedProduct);
                  const description = this.getDraggedProductDescription(this.#draggedProduct);
                  const partNo = getNumPartsInProduct(productNo);
                  const createdPartNo = await q_AddPart_CostMarkup(productNo, partNo, true, false, 1, cost, 2.5, description);
                  await setPartNotes(productNo, createdPartNo, this.buildPartNotes(this.#draggedProduct));
                  this.#draggedProduct = null;
            };
            document.addEventListener("dropEvent", this.#onDrop);
      }

      getDraggedProductCost(product) {
            const prices = this.extractVariantPrices(product);
            if(prices.length > 0) return prices[0];
            return 0;
      }

      getDraggedProductDescription(product) {
            const base = product.description || product.name || product.title || "Capral Item";
            return base.includes("(Capral)") ? base : base + " (Capral)";
      }

      buildPartNotes(product) {
            const sku = this.getProductSku(product);
            const prices = this.extractVariantPrices(product);
            const dimensions = this.getDimensionPairs(product);
            const dimensionText = dimensions.length
                  ? dimensions.map((pair) => pair.label + ": " + pair.value).join(", ")
                  : "N/A";
            const priceText = prices.length ? this.formatPrices(prices) : "N/A";
            return [
                  "Name: " + (product.name || product.title || "N/A"),
                  "Description: " + (product.description || "N/A"),
                  "SKU: " + (sku || "N/A"),
                  "Cost: " + priceText,
                  "Category: " + (product.category || "N/A"),
                  "Dimensions: " + dimensionText
            ].join("\n");
      }

      getProductSku(product) {
            if(product?.sku) return product.sku;
            if(Array.isArray(product?.variants)) {
                  const variantWithSku = product.variants.find((variant) => variant?.sku);
                  if(variantWithSku) return variantWithSku.sku;
            }
            return null;
      }
}
