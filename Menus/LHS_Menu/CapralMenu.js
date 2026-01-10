class CapralMenu extends LHSMenuWindow {

      #page;
      #statusText;
      #productGrid;
      #reloadButton;
      #categoryDropdown;
      #categoryDropdownContainer;

      #productsByCategory = new Map();
      #cards = [];
      #imageCache = new Map();
      #categoryImages = new Map();
      #isLoading = false;
      #hasAttemptedLoad = false;

      #CAPRAL_CATEGORY_MIN = 1;
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
            if(!this.#hasAttemptedLoad) {
                  this.loadAllCategories();
            } else {
                  this.applyFilter();
            }
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

            this.#reloadButton = createButton("Reload", "margin:0;padding:8px 12px;min-width:100px;background-color:#1f5ca8;color:white;border:0;float:none;width:auto;", () => {
                  this.loadAllCategories(true);
            });
            controls.appendChild(this.#reloadButton);

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
            this.#productGrid.innerHTML = "";
            this.buildCategoryDropdown([{label: "All categories (loading…)", value: "all", img: ""}], "all");
            this.setCategoryDropdownDisabled(true);
            this.updateStatus("Scanning Capral categories 1-" + this.#CAPRAL_CATEGORY_MAX + "…");

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
                  onChange: () => this.applyFilter()
            });
      }

      setCategoryDropdownDisabled(disabled) {
            if(!this.#categoryDropdown) return;
            this.#categoryDropdown.element.style.pointerEvents = disabled ? "none" : "auto";
            this.#categoryDropdown.element.style.opacity = disabled ? "0.6" : "1";
      }

      applyFilter() {
            const filter = this.#categoryDropdown?.getValue() || "all";
            for(const card of this.#cards) {
                  card.style.display = (filter === "all" || card.dataset.category === filter) ? "flex" : "none";
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

                  const name = document.createElement("div");
                  name.innerText = product.name || product.title || "Unnamed product";
                  name.style = "font-weight:bold;color:#0e335f;font-size:14px;";
                  card.appendChild(name);

                  const description = document.createElement("div");
                  description.innerText = "Description: " + (product.description || "N/A");
                  description.style = "color:#2d3a4a;font-size:12px;";
                  card.appendChild(description);

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
}
