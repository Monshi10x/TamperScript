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
// @resource     EmailTemplate_QuoteWording https://github.com/Monshi10x/TamperScript/raw/main/OrderHome/EmailTemplates/QuoteWording.txt
// @resource     EmailTemplate_OrderAcknowledgement https://github.com/Monshi10x/TamperScript/raw/main/OrderHome/EmailTemplates/OrderAcknowledgementWording.txt
// @require      https://cdn.plot.ly/plotly-latest.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.createjs.com/1.0.0/createjs.min.js
// @require      https://raw.githack.com/SortableJS/Sortable/master/Sortable.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Charts\Chart.js
// @require      file://C:\Users\monsh\Documents\TamperScript\DragAndDrop\DragAndDrop.js
// @require      file://C:\Users\monsh\Documents\TamperScript\UI\UI.js
// @require      file://C:\Users\monsh\Documents\TamperScript\UI\UIContainerType3.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Common\Common.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Subscription\SubscriptionManager.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Common\ObjectArray.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Console\Console.js
// @require      file://C:\Users\monsh\Documents\TamperScript\FileIO\FileIO.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Tables\Table.js
// @require      file://C:\Users\monsh\Documents\TamperScript\SVG_Common\SVG_Common.js
// @require      file://C:\Users\monsh\Documents\TamperScript\SVG_Common\DragZoomCanvas.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\Modal.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalManageSubscriptions.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSingleInput.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalPopOut.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSetOrder.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalMoveProduct.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSingleInputText.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSingleInputCheckbox.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSingleInputWithCalcResult.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalWidthHeightWithCalcResult.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalToggleTokens.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalWidthHeight.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalStandoffHelper.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalSheetJoins.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Modal\ModalVinylJoins.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Mouse\ContextMenu.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Product_Components\ProductComponents.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Styles\Styles.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Styles\Images.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Styles\Colour.js
// @require      file://C:\Users\monsh\Documents\TamperScript\Polygon\Polygon.js
// @require      file://C:\Users\monsh\Documents\TamperScript\OrderHome\OrderHome.js
// ==/UserScript==