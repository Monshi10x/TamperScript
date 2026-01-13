// ==UserScript==
// @name         Corebridge Plugin (advanced) github
// @namespace    http://tampermonkey.net/
// @version      10.498
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
// @connect      api-shop.spandex.com
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @updateURL    https://github.com/Monshi10x/TamperScript/raw/main/TamperStart.js
// @downloadURL  https://github.com/Monshi10x/TamperScript/raw/main/TamperStart.js
// @resource     Icon_BoundingArea https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-BoundingArea.svg
// @resource     Icon_ShapeArea https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-ShapeArea.svg
// @resource     Icon_Download https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Download.svg
// @resource     Icon_M2 https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-M2.svg
// @resource     Icon_Lnm https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Lnm.svg
// @resource     Icon_LED https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-LED.svg
// @resource     Icon_Find https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Find.svg
// @resource     Icon_Lightbox https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Lightbox.svg
// @resource     Icon_Billboard https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Billboard.svg
// @resource     Icon_Compare https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Compare.svg
// @resource     Icon_Router https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Router.svg
// @resource     Icon_Window https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Window.svg
// @resource     Icon_Layers https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Layers.svg
// @resource     Icon_Vehicle https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Vehicle.svg
// @resource     Icon_CreditCard https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-CreditCard.svg
// @resource     Icon_Chart https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Chart.svg
// @resource     Icon_3D https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-3D.svg
// @resource     Icon_POS https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-POS.svg
// @resource     Icon_Admin https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Admin.svg
// @resource     Icon_Bin https://github.com/Monshi10x/TamperScript/raw/main/Images/BinIcon.svg
// @resource     Icon_Bin2 https://github.com/Monshi10x/TamperScript/raw/main/Images/BinIcon2.svg
// @resource     Icon_Select https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Select.svg
// @resource     Icon_Map https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Map.svg
// @resource     Icon_Capral https://github.com/Monshi10x/TamperScript/raw/main/Images/Icon-Capral.svg
// @resource     IMPORTED_CSS https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles_Sales.css
// @resource     JSONTransformers https://github.com/Monshi10x/TamperScript/raw/main/External Files/Transformers.json
// @resource     JSONPredefinedVehicleTemplates https://github.com/Monshi10x/TamperScript/raw/main/External Files/PredefinedVehicleTemplates.json
// @resource     JSONBlankVehicleTemplates https://github.com/Monshi10x/TamperScript/raw/main/External Files/BlankVehicleTemplates.json
// @resource     JSONRouter https://github.com/Monshi10x/TamperScript/raw/main/External Files/RouterToolpathTimes.json
// @resource     JSONLaser https://github.com/Monshi10x/TamperScript/raw/main/External Files/LaserToolpathTimes.json
// @resource     JSONPartItems https://github.com/Monshi10x/TamperScript/raw/main/External Files/PartItems.json
// @resource     JSONInstallTimes https://github.com/Monshi10x/TamperScript/raw/main/External Files/InstallTimes.json
// @resource     Image_Corflute https://github.com/Monshi10x/TamperScript/raw/main/Images/Corflute-Resized.jpg
// @resource     Image_Coil https://github.com/Monshi10x/TamperScript/raw/main/Images/Coil.jpg
// @resource     Image_FrontLitLetters https://github.com/Monshi10x/TamperScript/raw/main/Images/FrontLitLetters.webp
// @resource     Image_FrontLitLettersPainted https://github.com/Monshi10x/TamperScript/raw/main/Images/3DLetter-FrontLit.png
// @resource     Image_FabLettersPainted https://github.com/Monshi10x/TamperScript/raw/main/Images/3DLetter-Fab.png
// @resource     Image_PaintedPanel https://github.com/Monshi10x/TamperScript/raw/main/Images/PaintedPanel.png
// @resource     Image_PaintedPanelWithLetters https://github.com/Monshi10x/TamperScript/raw/main/Images/PaintedPanelWithLetters.png
// @resource     Image_IsStocked https://github.com/Monshi10x/TamperScript/raw/main/Images/IsStockedImage.png
// @resource     Image_SpiderBoom https://github.com/Monshi10x/TamperScript/raw/main/Images/SpiderBoomImage.png
// @resource     Image_Scissor https://github.com/Monshi10x/TamperScript/raw/main/Images/ScissorImage.png
// @resource     SVGWebWorker https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_WebWorker.js
// @resource     GoogleScript https://github.com/Monshi10x/TamperScript/raw/main/GoogleMap/GoogleMap.js
// @require      https://cdn.plot.ly/plotly-3.0.1.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @require      https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js
// @require      https://cdn.jsdelivr.net/npm/svg-path-commander/dist/svg-path-commander.js
// @require      https://cdn.jsdelivr.net/npm/path-data-polyfill@1.0.6/path-data-polyfill.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Charts/Chart.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Loaders/Loader.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/DragAndDrop/DragAndDrop.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UI.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainerType3.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/TDropdown.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/TNode.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/Toast.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Async_Functions/Async_Functions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/Toggle.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Subscription/SubscriptionManager.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/ObjectArray.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/TArray.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Console/Console.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/FileIO/FileIO.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Tables/Table.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_PathFunctions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVGPathFunctions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_ShapeArea.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/DragZoomCanvas.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/DragZoomSVG.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/LHSMenu.js
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
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/MenuPOS.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/MenuMap.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/OrderedVinyls.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/CapralMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/LHS_Menu/ConsoleMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/Modal.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalManageSubscriptions.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInput.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalProductPopOut.js
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
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSVG.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSVG3DViewer.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Mouse/ContextMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/SaveReminder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/ProductComponents.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/TogglePartsMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/SummaryHelper.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/CostAnalysisSummary.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Estimate_Supplementals/InstallSummary.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Images.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Colour.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/QWHD.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Powdercoat.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/SubMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Material.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Size.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/SVGCutfile.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Artwork.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Baseplate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Footing.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Frame.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Install.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/LED.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Leg.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Production.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Router.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Laser.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/ProductDetails.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/InstallSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/ArtworkSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/ProductionSubscribable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Sheet.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Vinyl.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Coil.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Laminate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Finishing.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Painting.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Sign.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Supplier.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/TotalQuantity.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/VehicleTemplate.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/HandTrimming.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/AppTaping.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/PrintMounting.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Menus/Part_Components/Transformer.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Polygon/Polygon.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Main.js
// ==/UserScript==
