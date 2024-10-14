// ==UserScript==
// @name         Order Home
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Corebridge Plugin
// @author       Tristan Cargill
// @match        https://sar10686.corebridge.net/SalesModule/Orders/Order.aspx*
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
// @updateURL    https://github.com/Monshi10x/TamperScript/raw/main/TamperStartQuote.js
// @downloadURL  https://github.com/Monshi10x/TamperScript/raw/main/TamperStartQuote.js
// @resource     EmailTemplate_OrderAcknowledgement https://github.com/Monshi10x/TamperScript/raw/main/OrderHome/OrderAcknowledgement.txt
// @require      https://cdn.plot.ly/plotly-latest.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Charts/Chart.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/DragAndDrop/DragAndDrop.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UI.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/UI/UIContainerType3.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Subscription/SubscriptionManager.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Common/ObjectArray.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Console/Console.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/FileIO/FileIO.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Tables/Table.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/SVG_Common.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/SVG_Common/DragZoomCanvas.js
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
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Product_Components/ProductComponents.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Styles.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Images.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Styles/Colour.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/Polygon/Polygon.js
// @require      https://github.com/Monshi10x/TamperScript/raw/main/OrderHome/OrderHome.js
// ==/UserScript==