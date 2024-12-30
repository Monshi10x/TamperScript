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
        this.newPanel.appendChild(this.newPanelContent);
        this.sidePanel.appendChild(this.newPanel);
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