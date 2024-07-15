// ==UserScript==
// @name         Corebridge Plugin (advanced) github
// @namespace    http://tampermonkey.net/
// @version      10.49
// @description  Corebridge Plugin
// @author       Tristan Cargill
// @match        https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice*
// @match        https://sar10686.corebridge.net/SalesModule/Estimates/EditEstimate*
// @match        https://sar10686.corebridge.net/SalesModule/Estimates/CreateEstimate*
// @match        https://sar10686.corebridge.net/SalesModule/Orders/EditOrder*
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @updateURL    https://github.com/Monshi10x/TamperScript/raw/main/TamperStart.js
// @downloadURL  https://github.com/Monshi10x/TamperScript/raw/main/TamperStart.js
// @resource     IMPORTED_CSS https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles_Sales.css
// @resource     Image_Corflute https://github.com/Monshi10x/TamperScript/raw/main/Images/Corflute-Resized.jpg
// @require      https://cdn.plot.ly/plotly-latest.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Charts/Chart.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/DragAndDrop/DragAndDrop.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/QWH.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UI.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainerType3.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Async_Functions/Async_Functions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Subscription/SubscriptionManager.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/ObjectArray.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Console/Console.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/FileIO/FileIO.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Tables/Table.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/DragZoomCanvas.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/LHSMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/VehicleBuilder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/Windows.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/Billboard.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/Admin.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/ProductCompare.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/RouterBuilder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/LightboxBuilder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/LEDBuilder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/CombinedLnm.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/ProductFinder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/CombinedSqm.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/CreditSurchargeMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/Menu3D.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/PanelSigns.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/ChartMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/TogglePartsMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/Modal.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalManageSubscriptions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInput.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalPopOut.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSetOrder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalMoveProduct.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputText.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputCheckbox.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputWithCalcResult.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalWidthHeightWithCalcResult.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalToggleTokens.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalWidthHeight.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalStandoffHelper.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSheetJoins.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalVinylJoins.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Mouse/ContextMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/SummaryHelper.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/CostAnalysisSummary.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/InstallSummary.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Product_Components/ProductComponents.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Images.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Colour.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/SubMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Artwork.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Baseplate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Footing.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Frame.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Install.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/LED.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Leg.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Production.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Router.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/Material.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Size.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Size2.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/ProductDetails.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/InstallSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/ArtworkSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/ProductionSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/Sheet.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/Vinyl.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/Laminate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Materials/Finishing.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Sign.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/Supplier.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/TotalQuantity.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/VehicleTemplate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/LabourParts/HandTrimming.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/LabourParts/AppTaping.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Sub_Menus/LabourParts/PrintMounting.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Part_Specific/Transformer.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Polygon/Polygon.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Main.js
// ==/UserScript==