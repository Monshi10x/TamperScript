class InstallSummary {

    constructor() {
        this.sidePanel = document.getElementById('divLeftColumn');
        this.newPanel = document.createElement('div');
        this.newPanel.className = "ord-box";
        this.newPanel.style = "margin-top: 10px;border: 1px solid #999;float: left;width: 219px;overflow: hidden;background: #fff;";

        this.newPanelHeader = document.createElement('span');
        this.newPanelHeader.className = "ord-box ord-title";
        this.newPanelHeader.style = "background-color:" + COLOUR.Blue + ";";
        this.newPanelHeader.innerHTML = "Install Analysis Summary";

        this.newPanelContent = document.createElement('div');
        this.newPanelContent.className = "ord-box ord-body";
        this.newPanelContent.style = "font-family: 'Roboto', sans-serif, Arial;font-style: normal;font-weight: 400;font-size: 13px;color: #444;float: left; width: 100%; padding: 5px; box-sizing: border-box; border-bottom: 1px solid rgb(204, 204, 204); display: block;";

        //cost
        this.newPanelContent_CostContainer = document.createElement('div');
        this.newPanelContent_CostContainer.className = "row";

        this.newPanelContent_CostContainer_Header = document.createElement('div');
        this.newPanelContent_CostContainer_Header.style = "float:left;";
        this.newPanelContent_CostContainer_Header.innerHTML = "Install Costs: ";

        this.newPanelContent_CostContainer_TotalCosts = document.createElement('div');
        this.newPanelContent_CostContainer_TotalCosts.style = "text-align: right; float:right;width:100px;";
        this.newPanelContent_CostContainer_TotalCosts.innerHTML = "$0";

        //price
        this.newPanelContent_PriceContainer = document.createElement('div');
        this.newPanelContent_PriceContainer.className = "row";

        this.newPanelContent_PriceContainer_Header = document.createElement('div');
        this.newPanelContent_PriceContainer_Header.style = "float:left;";
        this.newPanelContent_PriceContainer_Header.innerHTML = "Install Prices: ";

        this.newPanelContent_PriceContainer_TotalPrices = document.createElement('div');
        this.newPanelContent_PriceContainer_TotalPrices.style = "text-align: right; float:right;width:100px;";
        this.newPanelContent_PriceContainer_TotalPrices.innerHTML = "$0";

        //profit
        this.newPanelContent_ProfitContainer = document.createElement('div');
        this.newPanelContent_ProfitContainer.className = "row";

        this.newPanelContent_ProfitContainer_Header = document.createElement('div');
        this.newPanelContent_ProfitContainer_Header.style = "float:left;";
        this.newPanelContent_ProfitContainer_Header.innerHTML = "Install Profit: ";

        this.newPanelContent_ProfitContainer_TotalProfit = document.createElement('div');
        this.newPanelContent_ProfitContainer_TotalProfit.style = "text-align: right; float:right;width:100px;";
        this.newPanelContent_ProfitContainer_TotalProfit.innerHTML = "$0";

        //markup
        this.newPanelContent_MarkupContainer = document.createElement('div');
        this.newPanelContent_MarkupContainer.className = "row";

        this.newPanelContent_MarkupContainer_Header = document.createElement('div');
        this.newPanelContent_MarkupContainer_Header.style = "float:left;";
        this.newPanelContent_MarkupContainer_Header.innerHTML = "Install Markup: ";

        this.newPanelContent_MarkupContainer_TotalMarkup = document.createElement('div');
        this.newPanelContent_MarkupContainer_TotalMarkup.style = "text-align: right; float:right;width:100px;";
        this.newPanelContent_MarkupContainer_TotalMarkup.innerHTML = "0% / 0x";

        this.reorderProductsBtn = createButton("Re-Order Products", "width:100%;margin-top:8px;background-color:" + COLOUR.Blue + ";color:white;min-height:32px;", () => {
            this.openReorderProductsModal();
        });

        //adds
        this.newPanel.appendChild(this.newPanelHeader);
        this.newPanelContent_CostContainer.appendChild(this.newPanelContent_CostContainer_Header);
        this.newPanelContent_CostContainer.appendChild(this.newPanelContent_CostContainer_TotalCosts);
        this.newPanelContent.appendChild(this.newPanelContent_CostContainer);
        this.newPanelContent_PriceContainer.appendChild(this.newPanelContent_PriceContainer_Header);
        this.newPanelContent_PriceContainer.appendChild(this.newPanelContent_PriceContainer_TotalPrices);
        this.newPanelContent.appendChild(this.newPanelContent_PriceContainer);
        this.newPanelContent_ProfitContainer.appendChild(this.newPanelContent_ProfitContainer_Header);
        this.newPanelContent_ProfitContainer.appendChild(this.newPanelContent_ProfitContainer_TotalProfit);
        this.newPanelContent.appendChild(this.newPanelContent_ProfitContainer);
        this.newPanelContent_MarkupContainer.appendChild(this.newPanelContent_MarkupContainer_Header);
        this.newPanelContent_MarkupContainer.appendChild(this.newPanelContent_MarkupContainer_TotalMarkup);
        this.newPanelContent.appendChild(this.newPanelContent_MarkupContainer);
        this.newPanelContent.appendChild(this.reorderProductsBtn);
        this.newPanel.appendChild(this.newPanelContent);
        this.sidePanel.appendChild(this.newPanel);
        this.sidePanel.appendChild(this.reorderProductsBtn);
    }

    getCurrentProductRefs() {
        const productElements = document.querySelectorAll('div[class^="ord-prod-model-item"]');
        const refs = [];
        for(let i = 0; i < productElements.length; i++) {
            const context = ko.contextFor(productElements[i]);
            const productRef = context?.$data || null;
            if(productRef) refs.push(productRef);
        }
        return refs;
    }

    getCurrentProductsForModal() {
        const productElements = document.querySelectorAll('div[class^="ord-prod-model-item"]');
        const products = [];
        for(let i = 0; i < productElements.length; i++) {
            const productElement = productElements[i];
            const context = ko.contextFor(productElement);
            const productRef = context?.$data || null;
            if(!productRef) continue;

            const nameField = productElement.querySelector("input[id^='productDescription']");
            const productName = nameField?.value || ("Product " + (i + 1));
            products.push({id: String(i), productRef, productName});
        }
        return products;
    }

    async applyProductOrder(orderedProductIds, productLookup) {
        if(!Array.isArray(orderedProductIds) || orderedProductIds.length === 0) return;

        const desiredRefs = orderedProductIds
            .map((id) => productLookup.get(id))
            .filter((productRef) => !!productRef);
        if(desiredRefs.length === 0) return;

        const currentRefs = this.getCurrentProductRefs();

        for(let targetIndex = 0; targetIndex < desiredRefs.length; targetIndex++) {
            const desiredRef = desiredRefs[targetIndex];
            let currentIndex = currentRefs.findIndex((currentRef) => currentRef === desiredRef);
            if(currentIndex < 0 || currentIndex === targetIndex) continue;

            await MoveProduct(currentIndex, targetIndex);

            const movedRef = currentRefs.splice(currentIndex, 1)[0];
            currentRefs.splice(targetIndex, 0, movedRef);
        }
    }

    openReorderProductsModal() {
        const products = this.getCurrentProductsForModal();
        if(products.length <= 1) return;

        const modal = new Modal("Re-Order Products", () => {});
        modal.setContainerSize(900, 420);
        this.ensureSpinnerStyle();

        const productLookup = new Map();
        const sortableContainer = document.createElement("div");
        sortableContainer.style = "width:100%;min-height:180px;max-height:220px;display:block;overflow-y:auto;overflow-x:hidden;padding:8px;box-sizing:border-box;background-color:#f3f6fb;border:1px solid #d5dce8;";

        for(let i = 0; i < products.length; i++) {
            const product = products[i];
            productLookup.set(product.id, product.productRef);

            const card = document.createElement("div");
            card.dataset.productId = product.id;
            card.style = "width:calc(100% - 4px);min-height:48px;background-color:#ffffff;color:#1b2b44;padding:10px 14px;box-sizing:border-box;cursor:move;box-shadow:rgba(0,0,0,0.15) 0px 2px 6px;border-left:6px solid " + COLOUR.Blue + ";margin:6px 2px;";
            const productNo = document.createElement("div");
            productNo.style = "font-weight:bold;float:left;margin-right:12px;color:" + COLOUR.Blue + ";";
            productNo.innerText = "#" + (i + 1);
            const productName = document.createElement("div");
            productName.style = "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:24px;";
            productName.innerText = product.productName;
            card.appendChild(productNo);
            card.appendChild(productName);
            sortableContainer.appendChild(card);
        }

        new Sortable(sortableContainer, {
            animation: 120,
            direction: "vertical",
            ghostClass: "sortable-ghost"
        });

        const loadingContainer = document.createElement("div");
        loadingContainer.style = "display:none;align-items:center;justify-content:flex-start;gap:10px;margin-top:10px;padding:8px;border:1px solid #d5dce8;background-color:#eef3ff;";
        const loadingSpinner = document.createElement("div");
        loadingSpinner.className = "ts-reorder-spinner";
        loadingSpinner.style = "width:18px;height:18px;border:3px solid #b8c7e6;border-top-color:" + COLOUR.Blue + ";border-radius:50%;animation:ts-reorder-spin 0.8s linear infinite;";
        const loadingText = document.createElement("div");
        loadingText.innerText = "Moves in progress";
        loadingText.style = "font-weight:bold;color:" + COLOUR.Blue + ";";
        loadingContainer.appendChild(loadingSpinner);
        loadingContainer.appendChild(loadingText);

        modal.addBodyElement(sortableContainer);
        modal.addBodyElement(loadingContainer);

        const cancelBtn = createButton("Cancel", "width:100px;float:right;", () => {
            modal.hide();
        });
        const applyBtn = createButton("Apply", "width:100px;float:right;", async () => {
            const orderedProductIds = [...sortableContainer.children].map((child) => child.dataset.productId);
            loadingContainer.style.display = "flex";
            applyBtn.disabled = true;
            cancelBtn.disabled = true;
            try {
                await this.applyProductOrder(orderedProductIds, productLookup);
                modal.hide();
            } finally {
                loadingContainer.style.display = "none";
                applyBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        });
        modal.addFooterElement(applyBtn);
        modal.addFooterElement(cancelBtn);
    }

    ensureSpinnerStyle() {
        if(document.getElementById("tsReorderSpinnerStyle")) return;
        const style = document.createElement("style");
        style.id = "tsReorderSpinnerStyle";
        style.innerHTML = "@keyframes ts-reorder-spin {from {transform: rotate(0deg);} to {transform: rotate(360deg);}}";
        document.head.appendChild(style);
    }

    getCurrentProductRefs() {
        const productElements = document.querySelectorAll('div[class^="ord-prod-model-item"]');
        const refs = [];
        for(let i = 0; i < productElements.length; i++) {
            const context = ko.contextFor(productElements[i]);
            const productRef = context?.$data || null;
            if(productRef) refs.push(productRef);
        }
        return refs;
    }

    getCurrentProductsForModal() {
        const productElements = document.querySelectorAll('div[class^="ord-prod-model-item"]');
        const products = [];
        for(let i = 0; i < productElements.length; i++) {
            const productElement = productElements[i];
            const context = ko.contextFor(productElement);
            const productRef = context?.$data || null;
            if(!productRef) continue;

            const nameField = productElement.querySelector("input[id^='productDescription']");
            const productName = nameField?.value || ("Product " + (i + 1));
            products.push({id: String(i), productRef, productName});
        }
        return products;
    }

    async applyProductOrder(orderedProductIds, productLookup) {
        if(!Array.isArray(orderedProductIds) || orderedProductIds.length === 0) return;

        const desiredRefs = orderedProductIds
            .map((id) => productLookup.get(id))
            .filter((productRef) => !!productRef);
        if(desiredRefs.length === 0) return;

        const currentRefs = this.getCurrentProductRefs();

        for(let targetIndex = 0; targetIndex < desiredRefs.length; targetIndex++) {
            const desiredRef = desiredRefs[targetIndex];
            let currentIndex = currentRefs.findIndex((currentRef) => currentRef === desiredRef);
            if(currentIndex < 0 || currentIndex === targetIndex) continue;

            await MoveProduct(currentIndex, targetIndex);

            const movedRef = currentRefs.splice(currentIndex, 1)[0];
            currentRefs.splice(targetIndex, 0, movedRef);
        }
    }

    openReorderProductsModal() {
        const products = this.getCurrentProductsForModal();
        if(products.length <= 1) return;

        const modal = new Modal("Re-Order Products", () => {});
        modal.setContainerSize(900, 420);

        const productLookup = new Map();
        const sortableContainer = document.createElement("div");
        sortableContainer.style = "width:100%;min-height:180px;display:flex;gap:10px;overflow-x:auto;overflow-y:hidden;padding:10px;box-sizing:border-box;background-color:#f3f6fb;border:1px solid #d5dce8;";

        for(let i = 0; i < products.length; i++) {
            const product = products[i];
            productLookup.set(product.id, product.productRef);

            const card = document.createElement("div");
            card.dataset.productId = product.id;
            card.style = "min-width:220px;max-width:220px;min-height:120px;background-color:" + COLOUR.Blue + ";color:white;padding:10px;box-sizing:border-box;cursor:move;box-shadow:rgba(0,0,0,0.2) 0px 2px 6px;";
            const productNo = document.createElement("div");
            productNo.style = "font-weight:bold;margin-bottom:6px;";
            productNo.innerText = "#" + (i + 1);
            const productName = document.createElement("div");
            productName.style = "white-space:normal;word-break:break-word;";
            productName.innerText = product.productName;
            card.appendChild(productNo);
            card.appendChild(productName);
            sortableContainer.appendChild(card);
        }

        new Sortable(sortableContainer, {
            animation: 120,
            direction: "horizontal",
            ghostClass: "sortable-ghost"
        });

        modal.addBodyElement(sortableContainer);
        modal.addFooterElement(createButton("Apply", "width:100px;float:right;", async () => {
            const orderedProductIds = [...sortableContainer.children].map((child) => child.dataset.productId);
            await this.applyProductOrder(orderedProductIds, productLookup);
            modal.hide();
        }));
        modal.addFooterElement(createButton("Cancel", "width:100px;float:right;", () => {
            modal.hide();
        }));
    }

    set price(value) {
        this.l_price = parseFloat(value);
    }

    get price() {
        return this.l_price;
    }

    set cost(value) {
        this.l_cost = parseFloat(value);
    }

    get cost() {
        return this.l_cost;
    }

    set profit(value) {
        this.l_profit = parseFloat(value);
    }

    get profit() {
        return this.l_profit;
    }

    update() {
        var markupPercentage = 0;
        var markupDecimal = 0;

        this.profit = this.price - this.cost;

        if(this.cost != 0) {
            markupPercentage = (this.profit / this.cost) * 100;
            markupDecimal = 1 + (markupPercentage / 100);
            this.newPanelContent_MarkupContainer_TotalMarkup.innerHTML = Math.round(markupPercentage * 100) / 100 + "% / " + Math.round(markupDecimal * 100) / 100 + "x";
        } else if(this.cost == 0 && this.price != 0) {
            markupPercentage = "Inf";
            markupDecimal = "Inf";
            this.newPanelContent_MarkupContainer_TotalMarkup.innerHTML = "Inf % / Inf x";
        }

        this.newPanelContent_PriceContainer_TotalPrices.innerHTML = "$" + Math.round(this.price * 100) / 100;
        this.newPanelContent_CostContainer_TotalCosts.innerHTML = "$" + Math.round(this.cost * 100) / 100;
        this.newPanelContent_ProfitContainer_TotalProfit.innerHTML = "$" + Math.round(this.profit * 100) / 100;
    }
}
