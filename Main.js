// ==UserScript==
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/QWH.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UI.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UIContainerType3.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Async_Functions/Async_Functions.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/Common.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Subscription/SubscriptionManager.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/ObjectArray.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Console/Console.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/FileIO/FileIO.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Tables/Table.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/SVG_Common.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/DragZoomCanvas.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LHSMenu.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/VehicleBuilder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Windows.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Billboard.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Admin.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductCompare.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/RouterBuilder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LightboxBuilder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LEDBuilder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedLnm.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductFinder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedSqm.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CreditSurchargeMenu.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Menu3D.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/PanelSigns.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/TogglePartsMenu.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/Modal.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalManageSubscriptions.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalPopOut.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSetOrder.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInput.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputText.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputCheckbox.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputWithCalcResult.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeightWithCalcResult.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalToggleTokens.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeight.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalStandoffHelper.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSheetJoins.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalVinylJoins.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Mouse/ContextMenu.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/SummaryHelper.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/CostAnalysisSummary.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/InstallSummary.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Styles.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Images.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Colour.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/SubMenu.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Artwork.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Baseplate.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Footing.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Frame.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Install.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LED.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Leg.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Production.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Router.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Material.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size2.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductDetails.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/InstallSubscribable.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Sheet.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Vinyl.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Laminate.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Finishing.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Sign.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Supplier.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/TotalQuantity.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/VehicleTemplate.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/HandTrimming.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/AppTaping.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/PrintMounting.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Part_Specific/Transformer.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Polygon/Polygon.js
// @require      https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Main.js
// ==/UserScript==

import {testTest} from "./Product_Components/ProductComponents";

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
  /*
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/QWH.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/QWH.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UI.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UI.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UIContainerType3.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/UI/UIContainerType3.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Async_Functions/Async_Functions.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Async_Functions/Async_Functions.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/Common.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/Common.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Subscription/SubscriptionManager.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Subscription/SubscriptionManager.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/ObjectArray.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Common/ObjectArray.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Console/Console.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Console/Console.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/FileIO/FileIO.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/FileIO/FileIO.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Tables/Table.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Tables/Table.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/SVG_Common.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/SVG_Common.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/DragZoomCanvas.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/SVG_Common/DragZoomCanvas.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LHSMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LHSMenu.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/VehicleBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/VehicleBuilder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Windows.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Windows.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Billboard.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Billboard.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Admin.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Admin.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductCompare.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductCompare.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/RouterBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/RouterBuilder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LightboxBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LightboxBuilder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LEDBuilder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/LEDBuilder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedLnm.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedLnm.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductFinder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/ProductFinder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedSqm.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CombinedSqm.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CreditSurchargeMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/CreditSurchargeMenu.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Menu3D.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/Menu3D.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/PanelSigns.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/LHS_Menu/PanelSigns.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/TogglePartsMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/TogglePartsMenu.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/Modal.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/Modal.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalManageSubscriptions.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalManageSubscriptions.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalPopOut.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalPopOut.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSetOrder.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSetOrder.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInput.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInput.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputText.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputText.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputCheckbox.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputCheckbox.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputWithCalcResult.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSingleInputWithCalcResult.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeightWithCalcResult.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeightWithCalcResult.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalToggleTokens.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalToggleTokens.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeight.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalWidthHeight.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalStandoffHelper.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalStandoffHelper.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSheetJoins.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalSheetJoins.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalVinylJoins.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Modal/ModalVinylJoins.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Mouse/ContextMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Mouse/ContextMenu.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/SummaryHelper.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/SummaryHelper.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/CostAnalysisSummary.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/CostAnalysisSummary.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/InstallSummary.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/InstallSummary.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Styles.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Styles.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Images.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Images.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Colour.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Styles/Colour.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/SubMenu.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/SubMenu.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Artwork.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Artwork.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Baseplate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Baseplate.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Footing.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Footing.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Frame.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Frame.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Install.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Install.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LED.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LED.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Leg.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Leg.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Production.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Production.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Router.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Router.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Material.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Material.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size2.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Size2.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductDetails.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductDetails.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/InstallSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/InstallSubscribable.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Sheet.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Sheet.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Vinyl.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Vinyl.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Laminate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Laminate.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Finishing.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Materials/Finishing.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Sign.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Sign.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Supplier.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/Supplier.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/TotalQuantity.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/TotalQuantity.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/VehicleTemplate.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/VehicleTemplate.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/HandTrimming.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/HandTrimming.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/AppTaping.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/AppTaping.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/PrintMounting.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Menus/Sub_Menus/LabourParts/PrintMounting.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Part_Specific/Transformer.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Part_Specific/Transformer.js'; document.body.appendChild(e);}});
    GM_xmlhttpRequest({method: 'GET', url: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Polygon/Polygon.js', onload: function(response) {let e = document.createElement('script'); e.type = 'text/javascript'; e.src = 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Polygon/Polygon.js'; document.body.appendChild(e); finished();}});
  GM_addElement('script', {src: 'https://raw.githubusercontent.com/Monshi10x/TamperScript/main/Product_Components/ProductComponents.js', type: 'text/javascript'});

    */


  finished();
  function finished() {
    console.log("1");
    let T = new TestingTest();
    /*createCopyPartModal();
    console.log("2");
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
    }, 1000);*/
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

