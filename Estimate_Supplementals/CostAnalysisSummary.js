var sidePanel;
var newPanelHeader;
var newPanelContent;
var newPanelHeader2;
var newPanelContent2;
var newPanelContent_CostContainer_TotalCosts;
var newPanelContent_PriceContainer_TotalPrices;
var newPanelContent_ProfitContainer_TotalProfit;
var newPanelContent_MarkupContainer_TotalMarkup;
var newPanelContent_TimeClock_Time;
var newPanelContent_Install_Address;
function createCostAnalysisSummaryContainer() {
    sidePanel = document.getElementById('divLeftColumn');
    var newPanel = document.createElement('div');
    newPanel.className = "ord-box";
    newPanel.style = "margin-top: 10px;border: 1px solid #999;float: left;width: 219px;overflow: hidden;background: #fff;";

    newPanelHeader = document.createElement('span');
    newPanelHeader.className = "ord-box ord-title";
    newPanelHeader.style = "background-color:" + COLOUR.Blue + ";";
    newPanelHeader.innerHTML = "Cost Analysis Summary (pre GST)";

    newPanelContent = document.createElement('div');
    newPanelContent.className = "ord-box ord-body";
    newPanelContent.style = "font-family: 'Roboto', sans-serif, Arial;font-style: normal;font-weight: 400;font-size: 13px;color: #444;float: left; width: 100%; padding: 5px; box-sizing: border-box; border-bottom: 1px solid rgb(204, 204, 204); display: block;";

    //cost
    var newPanelContent_CostContainer = document.createElement('div');
    newPanelContent_CostContainer.className = "row";

    var newPanelContent_CostContainer_Header = document.createElement('div');
    newPanelContent_CostContainer_Header.style = "float:left;";
    newPanelContent_CostContainer_Header.innerHTML = "Total Costs: ";

    newPanelContent_CostContainer_TotalCosts = document.createElement('div');
    newPanelContent_CostContainer_TotalCosts.style = "text-align: right; float:right;width:100px;";
    newPanelContent_CostContainer_TotalCosts.innerHTML = "$0";

    //price
    var newPanelContent_PriceContainer = document.createElement('div');
    newPanelContent_PriceContainer.className = "row";

    var newPanelContent_PriceContainer_Header = document.createElement('div');
    newPanelContent_PriceContainer_Header.style = "float:left;";
    newPanelContent_PriceContainer_Header.innerHTML = "Total Prices: ";

    newPanelContent_PriceContainer_TotalPrices = document.createElement('div');
    newPanelContent_PriceContainer_TotalPrices.style = "text-align: right; float:right;width:100px;";
    newPanelContent_PriceContainer_TotalPrices.innerHTML = "$0";

    //profit
    var newPanelContent_ProfitContainer = document.createElement('div');
    newPanelContent_ProfitContainer.className = "row";

    var newPanelContent_ProfitContainer_Header = document.createElement('div');
    newPanelContent_ProfitContainer_Header.style = "float:left;";
    newPanelContent_ProfitContainer_Header.innerHTML = "Total Profit: ";

    newPanelContent_ProfitContainer_TotalProfit = document.createElement('div');
    newPanelContent_ProfitContainer_TotalProfit.style = "text-align: right; float:right;width:100px;";
    newPanelContent_ProfitContainer_TotalProfit.innerHTML = "$0";

    //markup
    var newPanelContent_MarkupContainer = document.createElement('div');
    newPanelContent_MarkupContainer.className = "row";

    var newPanelContent_MarkupContainer_Header = document.createElement('div');
    newPanelContent_MarkupContainer_Header.style = "float:left;";
    newPanelContent_MarkupContainer_Header.innerHTML = "Total Markup: ";

    newPanelContent_MarkupContainer_TotalMarkup = document.createElement('div');
    newPanelContent_MarkupContainer_TotalMarkup.style = "text-align: right; float:right;width:100px;";
    newPanelContent_MarkupContainer_TotalMarkup.innerHTML = "0% / 0x";

    //Time Clock
    var newPanelContent_TimeClock = document.createElement('div');
    newPanelContent_TimeClock.className = "row";

    var newPanelContent_TimeClock_Header = document.createElement('div');
    newPanelContent_TimeClock_Header.style = "float:left;";
    newPanelContent_TimeClock_Header.innerHTML = "Total Time: ";

    newPanelContent_TimeClock_Time = document.createElement('div');
    newPanelContent_TimeClock_Time.style = "text-align: right; float:right;width:100px;";
    newPanelContent_TimeClock_Time.innerHTML = "0% / 0x";

    //Install Address
    var newPanelContent_Install = document.createElement('div');
    newPanelContent_Install.className = "row";

    var newPanelContent_Install_Header = document.createElement('div');
    newPanelContent_Install_Header.style = "float:left;";
    newPanelContent_Install_Header.innerHTML = "Install Address: ";

    newPanelContent_Install_Address = document.createElement('div');
    newPanelContent_Install_Address.style = "text-align: right; float:right;width:200px;";
    newPanelContent_Install_Address.innerHTML = "";

    //adds
    newPanel.appendChild(newPanelHeader);
    newPanelContent_CostContainer.appendChild(newPanelContent_CostContainer_Header);
    newPanelContent_CostContainer.appendChild(newPanelContent_CostContainer_TotalCosts);
    newPanelContent.appendChild(newPanelContent_CostContainer);
    newPanelContent_PriceContainer.appendChild(newPanelContent_PriceContainer_Header);
    newPanelContent_PriceContainer.appendChild(newPanelContent_PriceContainer_TotalPrices);
    newPanelContent.appendChild(newPanelContent_PriceContainer);
    newPanelContent_ProfitContainer.appendChild(newPanelContent_ProfitContainer_Header);
    newPanelContent_ProfitContainer.appendChild(newPanelContent_ProfitContainer_TotalProfit);
    newPanelContent.appendChild(newPanelContent_ProfitContainer);
    newPanelContent_MarkupContainer.appendChild(newPanelContent_MarkupContainer_Header);
    newPanelContent_MarkupContainer.appendChild(newPanelContent_MarkupContainer_TotalMarkup);
    newPanelContent.appendChild(newPanelContent_MarkupContainer);

    newPanelContent_TimeClock.appendChild(newPanelContent_TimeClock_Header);
    newPanelContent_TimeClock.appendChild(newPanelContent_TimeClock_Time);
    newPanelContent.appendChild(newPanelContent_TimeClock);

    newPanelContent_Install.appendChild(newPanelContent_Install_Header);
    newPanelContent_Install.appendChild(newPanelContent_Install_Address);
    newPanelContent.appendChild(newPanelContent_Install);

    newPanel.appendChild(newPanelContent);
    sidePanel.appendChild(newPanel);
}
function costAnalysisSummaryTick() {
    var markupPercentage = 0;
    var markupDecimal = 0;

    if(totalOrderCost != 0) {
        markupPercentage = (totalOrderProfit / totalOrderCost) * 100;
        markupDecimal = 1 + (markupPercentage / 100);
        newPanelContent_MarkupContainer_TotalMarkup.innerHTML = Math.round(markupPercentage * 100) / 100 + "% / " + Math.round(markupDecimal * 100) / 100 + "x";
    } else if(totalOrderCost == 0 && totalOrderPricePreGst != 0) {
        markupPercentage = "Inf";
        markupDecimal = "Inf";
        newPanelContent_MarkupContainer_TotalMarkup.innerHTML = "Inf % / Inf x";
    }

    newPanelContent_CostContainer_TotalCosts.innerHTML = "$" + Math.round(totalOrderCost * 100) / 100;
    newPanelContent_PriceContainer_TotalPrices.innerHTML = "$" + Math.round(totalOrderPricePreGst * 100) / 100;
    newPanelContent_ProfitContainer_TotalProfit.innerHTML = "$" + Math.round(totalOrderProfit * 100) / 100;
    let secondsToUse = quoteSeconds_Total == 0 ? quoteSeconds_CurrentSession : quoteSeconds_Total;
    let smhd = getSMHD(secondsToUse);
    newPanelContent_TimeClock_Time.innerHTML = smhd[0] + "d " + smhd[1] + "h " + smhd[2] + "m " + smhd[3] + "s";

    newPanelContent_Install_Address.innerHTML = getKOStorageVariable().formattedInstallAddress || "";

    tickCreateCustomerModal();
}

let isCompanyPopupOpen = false;
let createHelper = false;
function tickCreateCustomerModal() {
    let companyPopup = document.getElementById("addCompanyPopup") || null;

    if(companyPopup == null) return;

    if(isCompanyPopupOpen == false && companyPopup.style.display == "block") {
        isCompanyPopupOpen = true;
        createHelper = true;
    }

    if(companyPopup.style.display != "block") {
        isCompanyPopupOpen = false;
        createHelper = false;
    }

    if(createHelper) {
        let billingAddressTable = companyPopup.querySelector("table[id^='BillingAddressTable']");

        let address1Field = companyPopup.querySelector("input[id^='AccountBillingStreetTextBox']");
        let address2Field = companyPopup.querySelector("input[id^='AccountBillingStreet2TextBox']");
        let cityField = companyPopup.querySelector("input[id^='AccountBillingCityTextBox']");
        let stateField = companyPopup.querySelector("input[id^='AccountBillingStateTextBox']");
        let postCodeField = companyPopup.querySelector("input[id^='AccountBillingPostalCodeTextBox']");

        let newRow = document.createElement("tr");
        billingAddressTable.getElementsByTagName("tbody")[0].appendChild(newRow);

        let useInstallAddressBtn = createButton("Use Install Address", "width:150px", () => {
            let koObject = getKOStorageVariable();
            if(koObject == null || !getKOStorageVariable().formattedInstallAddress) {
                alert("no install address set");
                return;
            }

            let [street, suburb, state, postCode, country] = getKOStorageVariable().formattedInstallAddress.split(", ");

            $(address1Field).val(street);
            $(cityField).val(suburb);
            $(stateField).val(state);
            $(postCodeField).val(postCode);

        }, newRow);
    }

    createHelper = false;
}