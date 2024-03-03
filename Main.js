// ==UserScript==
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// ==/UserScript==

var sleepMS = 300;
var menuXOffset = 160;
var dayHours = 8;
var widthText;
var heightText;
var nameText;
var width;
var height;
var parts;
var products;
var partSqm;
var partCost;
var partCostElement;
var partPrice;
var partPriceElement;
var partNameNumber;
var productNumber;
var productTotalPrice;
var productTotalPricePostDiscounts;
var productTotalCost;
var partNumber;
var partInfo;
var prevPartNumber;
var prevProductNumber;
var SqmPriceGroup;
var PriceGroup;
var totalNumberOfProducts;
var productQty;
var partQty;
var quickSearchInputField;
var quickSearchContainer;
var totalOrderCost = 0;
var totalOrderPrice = 0;
var totalOrderProfit = 0;
var totalOrderInstallCost = 0;
var totalOrderInstallPrice = 0;
var totalOrderInstallProfit = 0;
var installSummary;
var quoteSeconds_CurrentSession = 0;
var quoteSeconds_Stored = 0;
var quoteSeconds_Total = 0;

(function() {
  "use strict";

  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/QWH.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/QWH.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UI.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UI.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UIContainerType3.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UIContainerType3.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Async_Functions/Async_Functions.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Async_Functions/Async_Functions.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/Common.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/Common.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Subscription/SubscriptionManager.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Subscription/SubscriptionManager.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/ObjectArray.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/ObjectArray.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Console/Console.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Console/Console.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/FileIO/FileIO.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/FileIO/FileIO.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Tables/Table.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Tables/Table.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/SVG_Common.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/SVG_Common.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/DragZoomCanvas.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/DragZoomCanvas.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LHSMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LHSMenu.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/VehicleBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/VehicleBuilder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Windows.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Windows.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Billboard.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Billboard.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Admin.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Admin.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductCompare.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductCompare.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/RouterBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/RouterBuilder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LightboxBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LightboxBuilder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LEDBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LEDBuilder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedLnm.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedLnm.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductFinder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductFinder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedSqm.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedSqm.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CreditSurchargeMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CreditSurchargeMenu.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Menu3D.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Menu3D.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/PanelSigns.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/PanelSigns.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/TogglePartsMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/TogglePartsMenu.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/Modal.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/Modal.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalManageSubscriptions.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalManageSubscriptions.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalPopOut.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalPopOut.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSetOrder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSetOrder.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInput.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInput.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputText.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputText.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputCheckbox.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputCheckbox.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputWithCalcResult.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputWithCalcResult.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeightWithCalcResult.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeightWithCalcResult.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalToggleTokens.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalToggleTokens.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeight.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeight.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalStandoffHelper.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalStandoffHelper.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSheetJoins.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSheetJoins.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalVinylJoins.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalVinylJoins.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Mouse/ContextMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Mouse/ContextMenu.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/SummaryHelper.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/SummaryHelper.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/CostAnalysisSummary.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/CostAnalysisSummary.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/InstallSummary.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/InstallSummary.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Styles.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Styles.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Images.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Images.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Colour.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Colour.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/SubMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/SubMenu.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Artwork.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Artwork.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Baseplate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Baseplate.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Footing.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Footing.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Frame.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Frame.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Install.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Install.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LED.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LED.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Leg.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Leg.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Production.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Production.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Router.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Router.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Material.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Material.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size2.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size2.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductDetails.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductDetails.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/InstallSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/InstallSubscribable.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Sheet.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Sheet.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Vinyl.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Vinyl.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Laminate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Laminate.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Finishing.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Finishing.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Sign.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Sign.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Supplier.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Supplier.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/TotalQuantity.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/TotalQuantity.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/VehicleTemplate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/VehicleTemplate.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/HandTrimming.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/HandTrimming.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/AppTaping.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/AppTaping.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/PrintMounting.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/PrintMounting.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Part_Specific/Transformer.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Part_Specific/Transformer.js'; document.head.appendChild(e);}});
  GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Polygon/Polygon.js', onload: function(response) {let e = document.createElement('script'); e.type = 'module'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Polygon/Polygon.js'; document.head.appendChild(e); finished();}});

  function finished() {
    createCopyPartModal();
    createCostAnalysisSummaryContainer();
    createOptionsContainer();
    createSummaryHelper();
    installSummary = new InstallSummary();
    initLHSMenu();
    init();
    updateErrors();
    createLog();
    hideLog();
    keyboardTick();

    setInterval(function() {
      tick();
    }, 800);
    setInterval(function() {
      tickSecond();
    }, 1000);
  }
})();

async function init() {
  document.getElementById("ctl00_RibbonsTabs").style = "position:fixed;";
  document.getElementById("MainContent").style = "margin-top:80px;";
  nextStepBtn = document.getElementById("btnGoToOrderStep2");
  nextStepBtn2 = document.getElementById("btnGoToOrderStep3");
  orderStep1Btn = document.getElementById("orderStep1Btn");
  orderStep2Btn = document.getElementById("orderStep2Btn");
  orderStep3Btn = document.getElementById("orderStep3Btn");

  addQuickFindProducts();
  await loadPredefinedQuickProducts();
  await loadPredefinedParts();
  await loadPredefinedModifiers();
  await loadRHSList();
  await loadBaseplateList();
}

function tick() {
  partInfoTick();
  costAnalysisSummaryTick();
  summaryHelperTick();
  installSummary.update();
  consoleTick();
}

function tickSecond() {
  quoteSeconds_CurrentSession++;
}

const event_testing = new Event("testingEvent");
function keyboardTick() {
  $(document.body).keyup(function(e) {
    if(e.keyCode == 188) {
      //var t = new ModalStandoffHelper("Standoff Helper", 100, null);
      console.log(getProductPrice(1));
    }
  });
  $(document).keydown(function(e) {
    if(e.which == 81) {
      window.dispatchEvent(event_testing);
    }
    if(e.which == 87) {
      //test3();
    }
    if(e.which == 69) {
      //test2();
    }
    if(e.which == 82) {
    }
  });
}

