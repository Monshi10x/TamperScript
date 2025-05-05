// ==UserScript==
// @name         Production Board v2
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  try to take over the world!
// @author       You
// @match        https://sar10686.corebridge.net/ProductionModule/WipQueue.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=corebridge.net
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @updateURL    https://github.com/Monshi10x/TamperScript/raw/main/TamperStartProduction.js
// @downloadURL  https://github.com/Monshi10x/TamperScript/raw/main/TamperStartProduction.js
// @resource     IMPORTED_CSS https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles_DesignBoard.css
// @resource     Icon_AdobeIllustrator https://github.com/Monshi10x/TamperScript/raw/main/Images/IllustratorIcon.png
// @require      https://cdn.plot.ly/plotly-latest.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://raw.githack.com/SortableJS/Sortable/master/Sortable.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Charts/Chart.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Async_Functions/Async_Functions_Design.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Async_Functions/WebWorker_load.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UI.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainerType3.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainer_Design.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainer_Design2.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Loaders/Loader.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/ObjectArray.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Console/Console.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/FileIO/FileIO.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Tables/Table.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Images.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Colour.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/DragAndDrop/DragAndDrop.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Mouse/ContextMenu.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/Modal.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInput.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalProductPopOut.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSetOrder.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputText.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputCheckbox.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalSingleInputWithCalcResult.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalWidthHeightWithCalcResult.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalToggleTokens.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Modal/ModalWidthHeight.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/DragZoomCanvas.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/DesignBoard/JobBoard.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/ProductionBoard/ProductionBoard.js
// ==/UserScript==