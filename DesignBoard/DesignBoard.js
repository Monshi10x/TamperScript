/**
 * @see https://github.com/SortableJS/Sortable
 */

// PrivateWeb.SalesModule.OrderWebService.AddOrderProductNote(OrderProductNote.OrderProductId, noteText, strSelection, OrderProductNote.OnAddOrderProductNoteComplete, OnError, OnTimeOut);
(function() {
      'use strict';
      const myCss = GM_getResourceText("IMPORTED_CSS");
      GM_addStyle(myCss);
})();

let defaultView = "Card View";

var colour_Urgent = "#ff0000";
var colour_Design = "#4472c4";
var colour_Hold = "#a5a5a5";
var colour_DesignRevision = "#a9d08e";
var colour_PrintFilesToBeDone = "#d9e1f2";
var colour_TToApprovePrintFiles = "#47ad8b";
var colour_PrintFilesApproved = "#ffc000";
var colour_InProduction = "#000000";
let currentUser = "";
let noteQtyCircles = [];

let allOrderProductStatuses = [
      {
            "Id": 12,
            "Name": "ESTIMATE",
            "CbText": "QUOTE : Quote",
            "CustomerText": "Quote",
            "Sequence": 10,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 34,
            "Name": "DESIGN NEEDED",
            "CbText": "QUOTE : Design Needed (Concept or Cut Files)",
            "CustomerText": "Quote",
            "Sequence": 20,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 42,
            "Name": "SALES REVIEW (FROM DESIGN)",
            "CbText": "QUOTE : Quote for Review",
            "CustomerText": "Quote",
            "Sequence": 25,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 35,
            "Name": "AWAITING CUSTOMER APPROVAL",
            "CbText": "QUOTE : Awaiting Customer Approval",
            "CustomerText": "Need Customer Approval",
            "Sequence": 30,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 38,
            "Name": "DESIGN REVISION",
            "CbText": "QUOTE : Revision",
            "CustomerText": "Quote : Under Revision",
            "Sequence": 40,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 36,
            "Name": "APPROVED",
            "CbText": "QUOTE : Approved",
            "CustomerText": "Quote : Approved",
            "Sequence": 50,
            "AllowCustomization": null,
            "OrderStatusId": 6,
            "IsDisabled": false
      },
      {
            "Id": 37,
            "Name": "CANCELLED",
            "CbText": "QUOTE : Cancelled",
            "CustomerText": "Cancelled",
            "Sequence": 60,
            "AllowCustomization": null,
            "OrderStatusId": 13,
            "IsDisabled": false
      },
      {
            "Id": 18,
            "Name": "ORDER REVIEW",
            "CbText": "WIP : Finalize Order Details for Design",
            "CustomerText": "Prepping For Design",
            "Sequence": 70,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 7,
            "Name": "IN DESIGN",
            "CbText": "WIP : In Design",
            "CustomerText": "In Design",
            "Sequence": 80,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 41,
            "Name": "AWAITING CUSTOMER ACTION",
            "CbText": "WIP : Awaiting Customer Action",
            "CustomerText": "Customer Action Needed",
            "Sequence": 85,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 9,
            "Name": "AWAITING PROOF APPROVAL",
            "CbText": "WIP : Awaiting Proof Approval",
            "CustomerText": "Requires Proof Approval",
            "Sequence": 90,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 10,
            "Name": "IN DESIGN REVISION",
            "CbText": "WIP : In Design Revision",
            "CustomerText": "In Design Revision",
            "Sequence": 100,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 14,
            "Name": "PROOF APPROVED",
            "CbText": "WIP : Proof Approved",
            "CustomerText": "Proof Approved",
            "Sequence": 110,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 8,
            "Name": "IN PRODUCTION",
            "CbText": "WIP : In Production",
            "CustomerText": "In Production",
            "Sequence": 120,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 26,
            "Name": "VENDED PRODUCT",
            "CbText": "WIP : Outsourced Product",
            "CustomerText": "In Production",
            "Sequence": 130,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 43,
            "Name": "QUALITY CONTROL",
            "CbText": "WIP : Quality Control",
            "CustomerText": "In Production",
            "Sequence": 135,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 19,
            "Name": "DESIGN REVIEW (FROM PRODUCTION)",
            "CbText": "WIP : Design Review",
            "CustomerText": "In Production",
            "Sequence": 140,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 24,
            "Name": "SALES REVIEW (FROM DESIGN)",
            "CbText": "WIP : Sales Review",
            "CustomerText": "Quality Control",
            "Sequence": 150,
            "AllowCustomization": null,
            "OrderStatusId": 4,
            "IsDisabled": false
      },
      {
            "Id": 6,
            "Name": "BUILT",
            "CbText": "BUILT",
            "CustomerText": "BUILT",
            "Sequence": 160,
            "AllowCustomization": null,
            "OrderStatusId": 9,
            "IsDisabled": false
      },
      {
            "Id": 5,
            "Name": "BUILT",
            "CbText": "BUILT",
            "CustomerText": "BUILT",
            "Sequence": 170,
            "AllowCustomization": null,
            "OrderStatusId": 9,
            "IsDisabled": true
      },
      {
            "Id": 20,
            "Name": "BUILT",
            "CbText": "BUILT",
            "CustomerText": "BUILT",
            "Sequence": 180,
            "AllowCustomization": null,
            "OrderStatusId": 9,
            "IsDisabled": true
      },
      {
            "Id": 21,
            "Name": "BUILT",
            "CbText": "BUILT",
            "CustomerText": "BUILT",
            "Sequence": 190,
            "AllowCustomization": null,
            "OrderStatusId": 9,
            "IsDisabled": true
      },
      {
            "Id": 4,
            "Name": "COMPLETED",
            "CbText": "COMPLETED",
            "CustomerText": "COMPLETED",
            "Sequence": 200,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": false
      },
      {
            "Id": 2,
            "Name": "COMPLETED",
            "CbText": "COMPLETED",
            "CustomerText": "COMPLETED",
            "Sequence": 210,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": true
      },
      {
            "Id": 3,
            "Name": "COMPLETED",
            "CbText": "COMPLETED",
            "CustomerText": "COMPLETED",
            "Sequence": 220,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": true
      },
      {
            "Id": 22,
            "Name": "COMPLETED",
            "CbText": "COMPLETED",
            "CustomerText": "COMPLETED",
            "Sequence": 230,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": true
      },
      {
            "Id": 27,
            "Name": "ON ACCOUNT",
            "CbText": "COMPLETED : On Account",
            "CustomerText": "On Account",
            "Sequence": 240,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": false
      },
      {
            "Id": 28,
            "Name": "PAST DUE",
            "CbText": "COMPLETED : Past Due",
            "CustomerText": "Past Due",
            "Sequence": 250,
            "AllowCustomization": null,
            "OrderStatusId": 2,
            "IsDisabled": false
      },
      {
            "Id": 29,
            "Name": "PAID IN FULL",
            "CbText": "CLOSED : Paid In Full",
            "CustomerText": "Paid In Full",
            "Sequence": 260,
            "AllowCustomization": null,
            "OrderStatusId": 1,
            "IsDisabled": false
      },
      {
            "Id": 11,
            "Name": "VOIDED",
            "CbText": "VOIDED",
            "CustomerText": "Voided",
            "Sequence": 270,
            "AllowCustomization": null,
            "OrderStatusId": 5,
            "IsDisabled": false
      },
      {
            "Id": 13,
            "Name": "NONE",
            "CbText": "NONE",
            "CustomerText": "Order Closed",
            "Sequence": 1000,
            "AllowCustomization": false,
            "OrderStatusId": 5,
            "IsDisabled": false
      },
      {
            "Id": 1,
            "Name": "CLOSED",
            "CbText": "CLOSED : Closed",
            "CustomerText": "Order Closed",
            "Sequence": 1010,
            "AllowCustomization": false,
            "OrderStatusId": 1,
            "IsDisabled": false
      },
      {
            "Id": 25,
            "Name": "OLD_CLOSED",
            "CbText": "IMPORT_CLOSED",
            "CustomerText": "Old Closed",
            "Sequence": 1020,
            "AllowCustomization": false,
            "OrderStatusId": 1,
            "IsDisabled": false
      }
];
window.addEventListener("load", async (event) => {
      await getRowsData();
      TODO("await getRowsData_awaitingApproval()");

      await init();
});

var jobs;
async function getRowsData() {
      const response = await fetch("https://sar10686.corebridge.net/SalesModule/Orders/OrderProduct.asmx/GetOrderProductQueueEntriesPaged", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"sEcho\":2,\"iColumns\":21,\"sColumns\":\"\",\"iDisplayStart\":0,\"iDisplayLength\":\"500\",\"iSortCol_0\":0,\"sSortDir_0\":\"asc\",\"viewType\":\"design\",\"queueType\":\"design_wip\",\"txSearch\":\"\",\"pageIndex\":1,\"arrQueueFilters\":[null,\"\",null,\"\",\"\",\"\",null,\"\",null,null,\"\",\"\",null,null]}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      jobs = data.d.QueueEntries;
}

var awaitingApprovalJobs;
async function getRowsData_awaitingApproval() {
      const response = await fetch("https://sar10686.corebridge.net/SalesModule/Orders/OrderProduct.asmx/GetOrderProductQueueEntriesPaged", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignAwaitingApproval.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"sEcho\":2,\"iColumns\":21,\"sColumns\":\"\",\"iDisplayStart\":0,\"iDisplayLength\":500,\"iSortCol_0\":6,\"sSortDir_0\":\"asc\",\"viewType\":\"design\",\"queueType\":\"design_awaiting_approval\",\"txSearch\":\"\",\"pageIndex\":1,\"arrQueueFilters\":[null,\"\",null,\"\",\"\",\"\",null,\"\",null,null,\"\",\"\",null,null]}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      awaitingApprovalJobs = data.d.QueueEntries;
}

async function getOrderData(CB_OrderID, CB_AccountID) {
      console.log(CB_OrderID, CB_AccountID);
      const response = await fetch("https://sar10686.corebridge.net/Api/OrderViewBase/GetOrderProductsView", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignOrderView.aspx?OrderId=" + CB_OrderID + "",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"OrderId\":\"" + CB_OrderID + "\",\"OrderAccountId\":" + CB_AccountID + "}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      return data;
}

async function getOrderData_QuoteLevel(CB_OrderID, CB_AccountID, CB_AccountName) {
      let accN1 = CB_AccountName.split(" ").join("+");
      let accN2 = CB_AccountName.split(" ").join("%20");


      const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryCustomer/GetInitialOneTimeFormFields?OrderType=Order&IsEditMode=true&UseTheLatestProductSetupfee=true&MeasurementUnit=2&OrderIdentifier=00000000-0000-0000-0000-000000000000&OrderMode=OrderEdit&PdpIds=&Convert=&OrderId=" + CB_OrderID + "&Acctid=" + CB_AccountID + "&Acctname=" + accN1 + "&PartId=&TxtPricingTierValue=&UseLite=false&LoadAll=false&LatestProdSetupFee=false", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=utf-8",
                  "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/SalesModule/Orders/EditOrder.aspx?Edit=1&OrderId=" + CB_OrderID + "&acctid=" + CB_AccountID + "&acctname=" + accN2 + '',
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      return data;
}

/**
 * 
 * @param {*} orderProductId 
 * @param {*} noteTypeID -> Sales=1, Design=2, Production=3, Customer=4, Vendor=5
 * @returns 
 */
async function getProductNotes(orderProductId, noteTypeID) {
      const response = await fetch("https://sar10686.corebridge.net/Api/OrderProduct/GetProductNotesView?orderProductId=" + orderProductId + "&noteTypeId=" + noteTypeID + "&isPdpEdit=false", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=utf-8",
                  "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      return data;
}

async function getProductNotesAll(orderProductId) {
      let responses = [];
      let data = [];
      for(let i = 1; i <= 5; i++) {
            const response = await fetch("https://sar10686.corebridge.net/Api/OrderProduct/GetProductNotesView?orderProductId=" + orderProductId + "&noteTypeId=" + i + "&isPdpEdit=false", {
                  "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json; charset=utf-8",
                        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest"
                  },
                  "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
                  "referrerPolicy": "strict-origin-when-cross-origin",
                  "body": null,
                  "method": "GET",
                  "mode": "cors",
                  "credentials": "include"
            });
            let item = await response.json();
            console.log(item);
            data.push(item);
            responses.push(response);
      }
      return data;
}

async function addProductNote(orderProductId, noteText, toSales = false, toDesign = false, toProduction = false, toCustomer = false, toVendor = false) {
      const response = await fetch("https://sar10686.corebridge.net/SalesModule/Orders/Order.asmx/AddOrderProductNote", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"orderProductId\":\"" + orderProductId + "\",\"noteText\":\"" + noteText + "\",\"selectedNoteTypesText\":\"" + toSales + "|" + toDesign + "|" + toProduction + "|" + toCustomer + "|" + toVendor + "\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      console.log(data);
      return data;
}

async function deleteProductNote(noteId) {
      const response = await fetch("https://sar10686.corebridge.net/Api/OrderProduct/DeleteOrderProductNote?orderProductNoteId=" + noteId + "", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=utf-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      return data;
}

async function updateItemStatus(orderProductId, currentStatusID, newStatusId) {
      const response = await fetch("https://sar10686.corebridge.net/Api/OrderProduct/UpdateOrderProductStatusChangeWithOPLoad", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\n  \"OrderProductId\": " + orderProductId + ",\n  \"CurrentOrderProductStatusId\": \"" + currentStatusID + "\",\n  \"NewOrderProductStatusId\": \"" + newStatusId + "\",\n  \"ViewType\": \"design\",\n  \"VoidNotes\": \"\"\n}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      return data;
}

async function updateItemPriority(orderProductId, orderId, priority, colour, QueuePrioritizationSettingId) {
      const response = await fetch("https://sar10686.corebridge.net/ManagementModule/GlobalSettings/ProductionSettings.asmx/SaveQueuePrioritization", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"QueuePrioritizationSettingId\":\"" + QueuePrioritizationSettingId + "\",\"Priority\":" + priority + ",\"Color\":\"" + colour + "\",\"OrderId\":\"" + orderId + "\",\"OrderProductId\":\"" + orderProductId + "\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();

      PrivateWeb.ManagementModule.ProductionSettingsWebService.SaveQueuePrioritization(QueuePrioritizationSettingId, priority, colour,
            orderId, orderProductId, QueuePrioritization.DoneSaving, QueuePrioritization.OnError, QueuePrioritization.OnTimeOut);

      return data;
}

async function getCustomerEmail(OrderId, AccountId) {
      let res = await fetch("https://sar10686.corebridge.net/MsService.asmx/GetEmailMessage", {
            "headers": {
                  "accept": "*/*",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/SalesModule/Orders/Order.aspx?OrderId=" + OrderId + "",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"request\":{\"CbEmailReason\":\"CUST_ORDER_INVOICE\",\"OrderIdentifier\":\"\",\"OrderId\":" + OrderId + ",\"AccountId\":" + AccountId + ",\"IsTriggeredFromGrouped\":false}}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      let data = await res.json();
      console.log(data);
      return data.d.EmailView.To;
}

/**
 * 
 * @param {BigInteger} OrderId i.e. 14777
 * @param {BigInteger} OrderProductId i.e. 56762
 * @param {String} UserIds i.e. "31,20" (ensure no spaces)
 * @returns JSON Data Object
 * @function asynchronous function that assignes user(s) to line item
 */
async function AssignUsersToOrderProduct(OrderId, OrderProductId, UserIds) {
      const response = await fetch("https://sar10686.corebridge.net/Api/OrderProduct/AssignUsersToOrderProduct", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/DesignModule/DesignMainQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"OrderId\":" + OrderId + ",\"OrderProductId\":" + OrderProductId + ",\"UserIds\":\"" + UserIds + "\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      await OrderProductAssignedTo.ShowModal(OrderId, OrderProductId);
      await sleep(500);
      await OrderProductAssignedTo.Save(OrderId, OrderProductId);
      await OrderProductAssignedTo.Close();
      return data;
}

const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var newDiv_Urgent;
var newDiv_DesignHold;
var newDiv_InDesign;
var newDiv_InDesignRevision;
var newDiv_Approved;
var newDiv_TristanToApprove;
var newDiv_ReadyToPrint;
var newDiv_Production;
//Loop Through Jobs
let dataPromise = [];
let lineItemDescriptionFields = [];
let lineItemDescriptionSpinners = [];
let customerEmails = [];
let jobContainers = [];
let notesSales = [];
let notesDesign = [];
let notesProduction = [];
let notesCustomer = [];
let notesVendor = [];
let salesNotesBtns = [];
let designNotesBtns = [];
let productionNotesBtns = [];
let customerNotesBtns = [];
let vendorNotesBtns = [];
let placeHolderPaymentDueBtns = [];
let placeHolderPaymentDueLoaders = [];
let queuePriority = [];
let productQtyFields = [];
let productQtySpinners = [];
async function init() {
      console.log(jobs);
      currentUser = document.querySelector("#CurrentUserLabel").innerText;
      let parentContainer = document.body;

      let existingJobBoard = document.querySelector("#MainContent");
      let existingJobBoardFooter = document.querySelector("#divFooterLogoWrapper");

      let masterContainer = document.createElement("div");
      parentContainer.appendChild(masterContainer);
      masterContainer.style = "display:flex;float:left;width:100vw;height:calc(100vh - 157px);background-color:white;flex-wrap: nowrap;overflow: auto;overflow-x:scroll;margin-bottom:0px;";
      masterContainer.classList.add("x-scrollable");


      let optionsHeader = document.createElement("div");
      optionsHeader.style = "width:100%;height:75px;display:block;float: left;background-color:" + COLOUR.White;

      insertBefore(optionsHeader, existingJobBoard);

      let option_viewType = createDropdown_Infield("View", 1, "width:200px;box-shadow:none;",
            [createDropdownOption("List View", "List View"),
            createDropdownOption("Card View", "Card View"),
            createDropdownOption("All", "All")], () => {
                  if(option_viewType[1].value == "List View") {
                        $(existingJobBoard).show();
                        $(existingJobBoardFooter).show();
                        $(masterContainer).hide();
                  } else if(option_viewType[1].value == "Card View") {
                        $(existingJobBoard).hide();
                        $(existingJobBoardFooter).hide();
                        $(masterContainer).show();
                  } else if(option_viewType[1].value == "All") {
                        $(existingJobBoard).show();
                        $(existingJobBoardFooter).show();
                        $(masterContainer).show();
                  }
            }, optionsHeader);

      if(defaultView == "List View") {
            $(existingJobBoard).show();
            $(existingJobBoardFooter).show();
            $(masterContainer).hide();
      } else if(defaultView == "Card View") {
            $(existingJobBoard).hide();
            $(existingJobBoardFooter).hide();
            $(masterContainer).show();
      } if(defaultView == "All") {
            $(existingJobBoard).show();
            $(existingJobBoardFooter).show();
            $(masterContainer).show();
      }

      let columnContainers = [];

      //Urgent
      let newDiv_Urgent = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;height:calc(100% - 40px);;flex: 0 0 auto;", "Urgent", masterContainer);
      newDiv_Urgent.container.style.cssText += "background-color:#ff0000;";
      new Sortable(newDiv_Urgent.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_Urgent);
      newDiv_Urgent.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_Urgent.contentContainer.classList.add("x-scrollable");
      newDiv_Urgent.headingContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_Urgent.headingContainer.children.length; x++) {
            newDiv_Urgent.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Hold
      let newDiv_DesignHold = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);;flex: 0 0 auto;", "Design Hold", masterContainer);
      newDiv_DesignHold.container.style.cssText += "background-color:#a5a5a5;";
      new Sortable(newDiv_DesignHold.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_DesignHold);
      newDiv_DesignHold.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_DesignHold.contentContainer.classList.add("x-scrollable");
      newDiv_DesignHold.headingContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_DesignHold.headingContainer.children.length; x++) {
            newDiv_DesignHold.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Design
      let newDiv_InDesign = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);;flex: 0 0 auto;", "In Design", masterContainer);
      newDiv_InDesign.container.style.cssText += "background-color:rgb(68, 114, 196);";
      new Sortable(newDiv_InDesign.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            /*forceFallback: true,
            dragoverBubble: false,
            onChoose: function(evt) {
                  console.log("onChoose");
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'grabbing');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Run when you click
            onMove: function(evt) {
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'auto');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Run when you click
            onStart: function(evt) {
                  console.log("onStart");
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'grabbing');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Dragging started
            onSort: function(evt) {
                  console.log("onSort");
                  $(evt.item).css('cursor', 'grabbing');
                  // $(evt.related).css('cursor', 'auto');
            },*/
            onEnd: function(evt) {
                  /*console.log("onEnd");
                  $(evt.item).css('cursor', 'auto');
                  $(evt.from).css('cursor', 'auto');
                  $(evt.to).css('cursor', 'auto');
                  //$(evt.related).css('cursor', 'auto');
                  $(evt.dragged).css('cursor', 'auto');*/
                  onMoveEnd();
            }/*, onChange: function(evt) {
                  console.log("onChange");
                  $(evt.item).css('cursor', 'auto');
            }*/
      });
      columnContainers.push(newDiv_InDesign);
      newDiv_InDesign.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_InDesign.contentContainer.classList.add("x-scrollable");
      newDiv_InDesign.headingContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_InDesign.headingContainer.children.length; x++) {
            newDiv_InDesign.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Design Revision
      let newDiv_InDesignRevision = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "In Design Revision", masterContainer);
      newDiv_InDesignRevision.container.style.cssText += "background-color:#a9d08e";
      new Sortable(newDiv_InDesignRevision.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            /*forceFallback: true,
            dragoverBubble: false,
            onChoose: function(evt) {
                  console.log("onChoose");
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'grabbing');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Run when you click
            onMove: function(evt) {
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'auto');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Run when you click
            onStart: function(evt) {
                  console.log("onStart");
                  $(evt.item).css('cursor', 'grabbing');
                  $(evt.from).css('cursor', 'grabbing');
                  $(evt.to).css('cursor', 'grabbing');
                  $(evt.related).css('cursor', 'grabbing');
                  $(evt.dragged).css('cursor', 'grabbing');
            }, // Dragging started
            onSort: function(evt) {
                  console.log("onSort");
                  $(evt.item).css('cursor', 'grabbing');
                  // $(evt.related).css('cursor', 'auto');
            },*/
            onEnd: function(evt) {
                  /*console.log("onEnd");
                  $(evt.item).css('cursor', 'auto');
                  $(evt.from).css('cursor', 'auto');
                  $(evt.to).css('cursor', 'auto');
                  //$(evt.related).css('cursor', 'auto');
                  $(evt.dragged).css('cursor', 'auto');*/
                  onMoveEnd();
            }/*, onChange: function(evt) {
                  console.log("onChange");
                  $(evt.item).css('cursor', 'auto');
            }*/
      });
      columnContainers.push(newDiv_InDesignRevision);
      newDiv_InDesignRevision.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_InDesignRevision.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_InDesignRevision.headingContainer.children.length; x++) {
            newDiv_InDesignRevision.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Proof Approved - Setup Print Files
      let newDiv_Approved = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Proof Approved - Setup Print Files", masterContainer);
      newDiv_Approved.container.style.cssText += "background-color:rgb(217, 225, 242)";
      new Sortable(newDiv_Approved.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            dragClass: "sortable-drag",
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_Approved);
      newDiv_Approved.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_Approved.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_Approved.headingContainer.children.length; x++) {
            newDiv_Approved.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Proof Approved - Tristan To Approve
      let newDiv_TristanToApprove = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Tristan To Approve", masterContainer);
      newDiv_TristanToApprove.container.style.cssText += "background-color:rgb(71, 173, 139);";
      new Sortable(newDiv_TristanToApprove.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            dragClass: "sortable-drag",
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_TristanToApprove);
      newDiv_TristanToApprove.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_TristanToApprove.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_TristanToApprove.headingContainer.children.length; x++) {
            newDiv_TristanToApprove.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Proof Approved - Ready To Print
      let newDiv_ReadyToPrint = new UIContainerType3("width:calc(17% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Ready To Print", masterContainer);
      newDiv_ReadyToPrint.container.style.cssText += "background-color:rgb(255, 192, 0);";
      new Sortable(newDiv_ReadyToPrint.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            dragClass: "sortable-drag",
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_ReadyToPrint);
      newDiv_ReadyToPrint.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_ReadyToPrint.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_ReadyToPrint.headingContainer.children.length; x++) {
            newDiv_ReadyToPrint.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Production
      let newDiv_Production = new UIContainerType3("width:calc(15% - 24px);min-width:350px;max-width:450px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Printed -> Production", masterContainer);
      newDiv_Production.container.style.cssText += "background-color:rgb(0,0,0);";
      new Sortable(newDiv_Production.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            dragClass: "sortable-drag",
            direction: 'vertical',
            onEnd: function(event) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_Production);
      newDiv_Production.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_Production.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_Production.headingContainer.children.length; x++) {
            newDiv_Production.headingContainer.children[x].classList.add("x-scrollable");
      }

      //Scroll Container
      const slider = masterContainer;
      let isDown = false;
      let startX;
      let scrollLeft;

      window.addEventListener('mousedown', (e) => {
            if(e.target.classList.contains("x-scrollable")) {
                  e.preventDefault();
                  isDown = true;
                  slider.classList.add('active');
                  startX = e.pageX - slider.offsetLeft;
                  scrollLeft = slider.scrollLeft;
            }
      });
      window.addEventListener('mouseleave', () => {

      });
      window.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
      });
      window.addEventListener('mousemove', (e) => {
            if(!isDown) return;

            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1;
            slider.scrollLeft = scrollLeft - walk;
      });



      for(let i = 0; i < jobs.length; i++) {
            let toAppendTo;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design") toAppendTo = newDiv_InDesign.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design" && jobs[i].QueuePrioritySettingColor == colour_Hold) toAppendTo = newDiv_DesignHold.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design Revision") toAppendTo = newDiv_InDesignRevision.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && (jobs[i].QueuePrioritySettingColor == colour_PrintFilesToBeDone || jobs[i].QueuePrioritySettingColor == colour_Design || jobs[i].QueuePrioritySettingColor == null || jobs[i].QueuePrioritySettingColor == "#ffffff")) toAppendTo = newDiv_Approved.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == colour_TToApprovePrintFiles) toAppendTo = newDiv_TristanToApprove.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == colour_PrintFilesApproved) toAppendTo = newDiv_ReadyToPrint.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Production" && jobs[i].QueuePrioritySettingColor == colour_InProduction) toAppendTo = newDiv_Production.contentContainer;
            if(jobs[i].QueuePrioritySettingColor == colour_Urgent) toAppendTo = newDiv_Urgent.contentContainer;

            //Create Job Container
            let newJobContainer = new UIContainer_Design("max-height:200px;", jobs[i].CompanyName, jobs[i].Description, toAppendTo);
            newJobContainer.container.dataset.cb_id = jobs[i].Id;
            newJobContainer.Id = jobs[i].Id;
            newJobContainer.OrderId = jobs[i].OrderId;
            newJobContainer.Priority = jobs[i].QueuePriority;
            newJobContainer.JobColour = jobs[i].QueuePrioritySettingColor;
            newJobContainer.QueuePrioritySettingId = jobs[i].QueuePrioritySettingId;
            newJobContainer.onPopOutCallback = function() {OnJobPopOut(jobs[i].Id, i, jobs[i].OrderId, jobs[i].AccountId, newJobContainer);};
            newJobContainer.onPopOutLeaveCallback = function() {OnJobPopOutLeave(jobs[i].Id, i, newJobContainer);};
            jobContainers.push(newJobContainer);
            jobs[i].jobContainer = newJobContainer;
            newJobContainer.container.id = "sortablelist";

            //Loading Spinner
            let tempSpinnerDiv = document.createElement("div");
            tempSpinnerDiv.style = "display: block;position:relative; text-align: center;font-size:8px;line-height:30px;float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:0px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; background-color:" + COLOUR.MediumGrey + ";";
            tempSpinnerDiv.innerHTML = "  $";
            placeHolderPaymentDueBtns.push(tempSpinnerDiv);
            newJobContainer.addHeadingButtons(tempSpinnerDiv);
            let placeholderLoader = new Loader("", tempSpinnerDiv);
            placeHolderPaymentDueLoaders.push(placeholderLoader);
            placeholderLoader.setSize(10);

            //Description Container
            let descriptionField = new UIContainerType3("width:calc(100% - 40px);", "DESCRIPTION", jobContainers[i].contentContainer);
            descriptionField.contentContainer.style.cssText += "min-height:100px;";
            lineItemDescriptionFields.push(descriptionField.contentContainer);
            let loader = new Loader("", descriptionField.contentContainer);
            lineItemDescriptionSpinners.push(loader);

            jobContainers[i].Minimize();

            //Customer Contact Container
            let customerContactDiv = new UIContainerType3("width:calc(100% - 40px);", "CUSTOMER CONTACT", jobContainers[i].contentContainer);

            createInput_Infield("Contact Name", jobs[i].OrderContactName, null, () => { }, customerContactDiv.contentContainer, false, null);
            createInput_Infield("Contact Phone", jobs[i].OrderContactWorkPhone, null, () => { }, customerContactDiv.contentContainer, false, null);
            createInput_Infield("Contact Phone 2", jobs[i].OrderContactCellPhone, null, () => { }, customerContactDiv.contentContainer, false, null);
            customerEmails.push(createInput_Infield("Contact Email", "", null, () => { }, customerContactDiv.contentContainer, false, null));

            //Inhouse Items Container

            let inhouseDiv = new UIContainerType3("width:calc(100% - 40px);", "INHOUSE ITEMS", jobContainers[i].contentContainer);

            let productQty = createInput_Infield("product Qty", null, null, null, inhouseDiv.contentContainer, false, null);
            setFieldDisabled(true, productQty[1], productQty[0]);
            productQtyFields.push(productQty);
            let productQtyLoader = new Loader("", productQty[0]);
            productQtySpinners.push(productQtyLoader);

            let designer = createDropdown_Infield("Designer", 2, "",
                  [createDropdownOption("Darren Frankish", "20"),
                  createDropdownOption("Leandri Hayward", "31"),
                  createDropdownOption("null", "")], async () => {
                        let loader = new Loader("", designer[0]);

                        await AssignUsersToOrderProduct(jobs[i].OrderId, jobs[i].Id, designer[1].value);
                        loader.Delete();
                  }, inhouseDiv.contentContainer);

            for(let x = 0; x < designer[1].options.length; x++) {

                  let val1 = "" + designer[1].options[x].innerText.toString().replaceAll(" ", "");

                  let val2 = "";
                  if(jobs[i].AssignedUsers == null) val2 += "null";
                  else val2 += jobs[i].AssignedUsers.toString().replaceAll(" ", "");

                  if(val1 == val2) {
                        designer[1].selectedIndex = x;
                        break;
                  }
            }

            let WIPOptions = [
                  "WIP : In Design",
                  "WIP : Awaiting Proof Approval",
                  "WIP : In Design Revision",
                  "WIP : Proof Approved",
                  "WIP : In Production",
                  "WIP : Outsourced Product",
                  "WIP : Design Review",
                  "WIP : Sales Review"
            ];

            let dropdownOptions = [];
            for(let j = 0; j < WIPOptions.length; j++) {
                  WIPID = 0;
                  for(let k = 0; k < allOrderProductStatuses.length; k++) {
                        if(allOrderProductStatuses[k]['CbText'] == WIPOptions[j]) {
                              WIPID = allOrderProductStatuses[k]['Id'];
                        }
                  }
                  dropdownOptions.push(createDropdownOption(WIPOptions[j], WIPID));
            }
            let WIPStatus = createDropdown_Infield("WIP Status", 0, "",
                  dropdownOptions, async () => {
                        let loader = new Loader("", WIPStatus[0]);
                        await updateItemStatus(jobs[i].Id, WIPStatus[1].options[WIPStatus[1].dataset.currentValue].value, WIPStatus[1].options[WIPStatus[1].selectedIndex].value);

                        jobContainers[i].whenClosedReturnBorrowed = false;
                        $("#imgExpander_" + jobs[i].Id).click();
                        $("#imgExpander_" + jobs[i].Id).click();

                        reorderJobContainer(jobContainers[i].container, WIPStatus[1].options[WIPStatus[1].selectedIndex].innerText, jobs[i].QueuePrioritySettingColor);
                        jobContainers[i].callbackOverridable = function() {
                              reorderJobContainer(jobContainers[i].container, WIPStatus[1].options[WIPStatus[1].selectedIndex].innerText, jobs[i].QueuePrioritySettingColor);
                        };
                        WIPStatus[1].dataset.currentValue = WIPStatus[1].selectedIndex;
                        loader.Delete();

                  }, inhouseDiv.contentContainer);
            WIPStatus[1].dataset.currentValue = 0;
            WIPStatus[1].id = "WIPStatus";

            for(let x = 0; x < WIPStatus[1].options.length; x++) {
                  if(jobs[i].OrderProductStatusTextWithOrderStatus == WIPStatus[1].options[x].innerText) {
                        WIPStatus[1].selectedIndex = x;
                        WIPStatus[1].dataset.currentValue = x;
                        break;
                  }
            }

            createInput_Infield("Sales Person", jobs[i].SalesPersonName, null, () => { }, inhouseDiv.contentContainer, false, null);
            createInput_Infield("Item Price", jobs[i].TotalPrice, null, () => { }, inhouseDiv.contentContainer, false, null);

            //Notes Container
            notesContainer = new UIContainerType3("width:calc(100% - 40px);", "NOTES", jobContainers[i].contentContainer);

            let btnContainer = document.createElement("div");
            btnContainer.style = "padding-left:10px;width:calc(100%);box-sizing:border-box;display:block;min-height: 10px;float:left;margin-top:12px;";
            notesContainer.contentContainer.appendChild(btnContainer);

            let noteInput = createTextarea("Note", "", "width:80%;margin:0px;box-sizing:border-box;height:35px;margin:10px;margin-right:0px;resize: vertical;", () => { }, notesContainer.contentContainer);
            let c = notesContainer.contentContainer;
            let noteBtn = createButton("+ Add Note", "width:calc(20% - 20px);margin:10px;margin-left:0px;", async () => {

                  let loader = new Loader("", c);

                  await addProductNote(jobs[i].Id, noteInput.value,
                        $(salesNotesContainer).is(':visible'),
                        $(designNotesContainer).is(':visible'),
                        $(productionNotesContainer).is(':visible'),
                        $(customerNotesContainer).is(':visible'),
                        $(vendorNotesContainer).is(':visible'));

                  if($(notesSales[i]).is(':visible')) {
                        let currentNotes = await getProductNotes(jobs[i].Id, 1);
                        newNoteId = currentNotes.ProductionNotes[0].Id;
                        addNote(noteInput.value, currentUser, newNoteId, 0, notesSales[i]);
                        noteQtyCircles[0].innerText = parseInt(noteQtyCircles[0].innerText) + 1;
                        $(noteQtyCircles[0]).show();
                  };
                  if($(notesDesign[i]).is(':visible')) {
                        let currentNotes = await getProductNotes(jobs[i].Id, 2);
                        newNoteId = currentNotes.ProductionNotes[0].Id;
                        addNote(noteInput.value, currentUser, newNoteId, 1, notesDesign[i]);
                        noteQtyCircles[1].innerText = parseInt(noteQtyCircles[1].innerText) + 1;
                        $(noteQtyCircles[1]).show();
                  };
                  if($(notesProduction[i]).is(':visible')) {
                        let currentNotes = await getProductNotes(jobs[i].Id, 3);
                        newNoteId = currentNotes.ProductionNotes[0].Id;
                        addNote(noteInput.value, currentUser, newNoteId, 2, notesProduction[i]);
                        noteQtyCircles[2].innerText = parseInt(noteQtyCircles[2].innerText) + 1;
                        $(noteQtyCircles[2]).show();
                  };
                  if($(notesCustomer[i]).is(':visible')) {
                        let currentNotes = await getProductNotes(jobs[i].Id, 4);
                        newNoteId = currentNotes.ProductionNotes[0].Id;
                        addNote(noteInput.value, currentUser, newNoteId, 3, notesCustomer[i]);
                        noteQtyCircles[3].innerText = parseInt(noteQtyCircles[3].innerText) + 1;
                        $(noteQtyCircles[3]).show();
                  };
                  if($(notesVendor[i]).is(':visible')) {
                        let currentNotes = await getProductNotes(jobs[i].Id, 5);
                        newNoteId = currentNotes.ProductionNotes[0].Id;
                        addNote(noteInput.value, currentUser, newNoteId, 4, notesVendor[i]);
                        noteQtyCircles[4].innerText = parseInt(noteQtyCircles[4].innerText) + 1;
                        $(noteQtyCircles[4]).show();
                  };
                  noteInput.value = "";
                  loader.Delete();

            }, notesContainer.contentContainer);

            let salesBtn = createButton("Sales", "width:100px;margin:0px;position:relative;", () => {
                  toggleNotes(salesNotesContainer);
                  salesBtn.style.borderBottomColor = "red";
            }, btnContainer);
            let designBtn = createButton("Design", "width:100px;margin:0px;position:relative;", () => {
                  toggleNotes(designNotesContainer);
                  designBtn.style.borderBottomColor = "red";
            }, btnContainer);
            let productionBtn = createButton("Production", "width:100px;margin:0px;position:relative;", () => {
                  toggleNotes(productionNotesContainer);
                  productionBtn.style.borderBottomColor = "red";
            }, btnContainer);
            let customerBtn = createButton("Customer", "width:100px;margin:0px;position:relative;", () => {
                  toggleNotes(customerNotesContainer);
                  customerBtn.style.borderBottomColor = "red";
            }, btnContainer);
            let vendorBtn = createButton("Vendor", "width:100px;margin:0px;position:relative;", () => {
                  toggleNotes(vendorNotesContainer);
                  vendorBtn.style.borderBottomColor = "red";
            }, btnContainer);

            salesNotesBtns.push(salesBtn);
            designNotesBtns.push(designBtn);
            productionNotesBtns.push(productionBtn);
            customerNotesBtns.push(customerBtn);
            vendorNotesBtns.push(vendorBtn);

            let salesNotesContainer = document.createElement("div");
            salesNotesContainer.style = "width:calc(100% - 20px);margin:10px;min-height:50px;max-height:200px;overflow-y:auto;box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 0px;";
            notesContainer.contentContainer.appendChild(salesNotesContainer);
            notesSales.push(salesNotesContainer);

            let designNotesContainer = document.createElement("div");
            designNotesContainer.style = "width:calc(100% - 20px);margin:10px;min-height:50px;max-height:200px;overflow-y:auto;box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 0px;";
            notesContainer.contentContainer.appendChild(designNotesContainer);
            notesDesign.push(designNotesContainer);

            let productionNotesContainer = document.createElement("div");
            productionNotesContainer.style = "width:calc(100% - 20px);margin:10px;min-height:50px;max-height:200px;overflow-y:auto;box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 0px;";
            notesContainer.contentContainer.appendChild(productionNotesContainer);
            notesProduction.push(productionNotesContainer);

            let customerNotesContainer = document.createElement("div");
            customerNotesContainer.style = "width:calc(100% - 20px);margin:10px;min-height:50px;max-height:200px;overflow-y:auto;box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 0px;";
            notesContainer.contentContainer.appendChild(customerNotesContainer);
            notesCustomer.push(customerNotesContainer);

            let vendorNotesContainer = document.createElement("div");
            vendorNotesContainer.style = "width:calc(100% - 20px);margin:10px;min-height:50px;max-height:200px;overflow-y:auto;box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 20px 0px;";
            notesContainer.contentContainer.appendChild(vendorNotesContainer);
            notesVendor.push(vendorNotesContainer);

            toggleNotes(designNotesContainer);
            designBtn.style.borderBottomColor = "red";
            function toggleNotes(elementToShow) {
                  $(salesNotesContainer).hide();
                  $(designNotesContainer).hide();
                  $(productionNotesContainer).hide();
                  $(customerNotesContainer).hide();
                  $(vendorNotesContainer).hide();
                  $(elementToShow).show();

                  salesBtn.style.borderBottomColor = COLOUR.Blue;
                  designBtn.style.borderBottomColor = COLOUR.Blue;
                  productionBtn.style.borderBottomColor = COLOUR.Blue;
                  customerBtn.style.borderBottomColor = COLOUR.Blue;
                  vendorBtn.style.borderBottomColor = COLOUR.Blue;
            }

            //Job Buttons
            let jobNoBtn = createLink("display: block; float: left; width: " + 80 + "px;height:" + 30 + "px; border:none;color:White;text-align:center;line-height:30px;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Black + ";", jobs[i].OrderInvoiceNumber, "/DesignModule/DesignOrderView.aspx?OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            jobContainers[i].addHeadingButtons(jobNoBtn);

            let itemNoBtn = createLink("display: block; float: left; width: " + 40 + "px;height:" + 30 + "px; border:none;color:White;text-align:center;line-height:30px;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkGrey, jobs[i].LineItemOrder + "/" + jobs[i].TotalProductsInOrder, "/DesignModule/DesignProductEdit.aspx?OrderProductId=" + jobs[i].Id + "&OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            jobContainers[i].addHeadingButtons(itemNoBtn);

            //Buttons
            let buttonsContainer = new UIContainerType3("width:calc(100% - 40px);", "VISIT", jobContainers[i].contentContainer);
            createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;", "pop-out order", "/DesignModule/DesignOrderView.aspx?OrderId=" + jobs[i].OrderId, "new window", buttonsContainer.contentContainer);
            createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;", "pop-out item", "/DesignModule/DesignProductEdit.aspx?OrderProductId=" + jobs[i].Id + "&OrderId=" + jobs[i].OrderId, "new window", buttonsContainer.contentContainer);
            createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;", "open order in sales", "/SalesModule/Orders/Order.aspx?OrderId=" + jobs[i].OrderId, "new window", buttonsContainer.contentContainer);


            let jobColour = document.createElement("div");
            jobColour.style = "display: block; float: left; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:0px; position:relative;color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + (jobs[i].QueuePrioritySettingColor == null ? "white" : jobs[i].QueuePrioritySettingColor) + ";";
            jobColour.id = "jobColour";
            jobContainers[i].addHeadingButtons(jobColour);

            let jobOrder = createButton(jobs[i].QueuePriority, "display: block; float: left; width: " + 30 + "px;height:" + 30 + "px; border:none;pointer-events:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.White + ";", () => {

            });

            jobOrder.id = "queuePriority";
            queuePriority.push(jobOrder);
            jobContainers[i].addHeadingButtons(jobOrder);

            if(jobs[i].ProofFileName != "") {
                  let proofLink = createLink("display: block; float: right; width: 30px; background-color: " + COLOUR.White + "; color:white;min-height: 30px; margin: 0px; border:0px solid " + COLOUR.Blue + ";cursor: pointer;font-size:10px;text-align:center;line-height:30px;", "", "../../ShowImage.aspx?LoadLocalProof=proof_" + jobs[i].OrderId + "_" + jobs[i].Id + "_0.pdf", "new window", jobContainers[i].contentContainer);
                  proofLink.style.backgroundImage = "url(/Themes/Images/icon_view_proof.png)";
                  proofLink.style.cssText += "background-repeat: no-repeat;background-size:100%;background-position:center center";
                  jobContainers[i].addHeadingButtons(proofLink);
            }

            dataPromise.push(getOrderData_QuoteLevel(jobs[i].OrderId, jobs[i].AccountId, jobs[i].CompanyName));
      }

      onMoveEnd();

      async function onMoveEnd() {

            for(let c = 0; c < columnContainers.length; c++) {
                  let jobContainers_c = columnContainers[c].contentContainer.querySelectorAll(".UIContainer_Design");
                  let jobContainer_Colour = columnContainers[c].container.style.backgroundColor;

                  for(let j = 0; j < jobContainers_c.length; j++) {
                        let requiresUpdatePriority = false;
                        let requiresUpdateStatus = false;
                        let jobContainer = jobContainers_c[j];
                        let jobArrayElement;
                        for(let x = 0; x < jobs.length; x++) {
                              //if job container holds this item
                              if(jobs[x].Id == jobContainer.dataset.cb_id) {
                                    jobArrayElement = jobs[x];
                                    break;
                              }
                        }

                        //Number Priority
                        let priority = jobContainer.querySelector("#queuePriority");
                        let previousPriority = priority.innerHTML;
                        let newPriority = priority.innerHTML = (j + 1);
                        if(previousPriority != newPriority) requiresUpdatePriority = true;

                        //Colour
                        let jobColour = jobContainer.querySelector("#jobColour");
                        let prevColour = jobColour.style.backgroundColor;
                        let newColour = jobColour.style.backgroundColor = jobContainer_Colour;
                        let newColourAsHex = RGBToHex(jobColour.style.backgroundColor);
                        if(prevColour != newColour) requiresUpdatePriority = true;
                        let loader = new Loader("", jobColour);

                        //state
                        let currentState = jobArrayElement.OrderProductStatusTextWithOrderStatus;
                        let newState;
                        let currentStateId = jobArrayElement.OrderProductStatusId;
                        let newStateId;
                        let currentQueueID = jobArrayElement.QueuePrioritySettingId;
                        let newQueueID;
                        switch(newColourAsHex) {
                              case colour_Urgent:
                                    newState = currentState;
                                    newQueueID = "3";
                                    break;
                              case colour_Design:
                                    newState = "WIP : In Design";
                                    newQueueID = "5";
                                    newStateId = "7";
                                    break;
                              case colour_Hold:
                                    newState = "WIP : In Design";
                                    newQueueID = "9";
                                    newStateId = "7";
                                    break;
                              case colour_DesignRevision:
                                    newState = "WIP : In Design Revision";
                                    newQueueID = "14";
                                    newStateId = "10";
                                    break;
                              case colour_PrintFilesToBeDone:
                                    newState = "WIP : Proof Approved";
                                    newQueueID = "13";
                                    newStateId = "14";
                                    break;
                              case colour_TToApprovePrintFiles:
                                    newState = "WIP : Proof Approved";
                                    newQueueID = "6";
                                    newStateId = "14";
                                    break;
                              case colour_PrintFilesApproved:
                                    newState = "WIP : Proof Approved";
                                    newQueueID = "8";
                                    newStateId = "14";
                                    break;
                              case colour_InProduction:
                                    newState = "WIP : In Production";
                                    newQueueID = "5";
                                    newStateId = "8";

                                    let wipStatusField = jobContainer.querySelector("#WIPStatus");
                                    for(let a = 0; a < wipStatusField.options.length; a++) {
                                          if(wipStatusField.options[a].innerText === "WIP : In Production") {
                                                wipStatusField.selectedIndex = a;
                                          }
                                    }
                                    $(wipStatusField).change();
                                    wipStatusField.dataset.currentValue = "WIP : In Production";

                                    break;
                              default:
                                    newState = "WIP : In Design";
                                    newQueueID = "5";
                                    break;
                        }
                        if(newState != currentState) {
                              requiresUpdatePriority = true;
                              requiresUpdateStatus = true;
                        }
                        if(currentQueueID != newQueueID) requiresUpdatePriority = true;

                        if(requiresUpdatePriority) {
                              jobArrayElement.QueuePrioritySettingId = newQueueID == null ? currentQueueID : newQueueID;

                              await updateItemPriority("" + jobArrayElement.Id, "" + jobArrayElement.OrderId, (j + 1), "" + newColourAsHex, newQueueID == null ? currentQueueID : newQueueID);

                        }
                        if(requiresUpdateStatus) {
                              jobArrayElement.OrderProductStatusId = newStateId == null ? currentStateId : newStateId;
                              await updateItemStatus(jobArrayElement.Id, currentQueueID, newStateId == null ? currentStateId : newStateId);
                              $("#imgExpander_" + jobArrayElement.Id).click();
                              $("#imgExpander_" + jobArrayElement.Id).click();
                        }
                        loader.Delete();
                  }
            }
            console.log("done");
      }

      let data = await Promise.all(dataPromise);
      console.log(data);

      //After All Jobs Data Fetched

      //OrderTitle = data[i].OrderDescription;
      //BillingAddr = data[i].OrderInformation.OrderInformation.J1.[G0-G9],[H0-H7];
      //customerEmail = data[i].OrderInformation.OrderInformation.J1.E8

      for(let i = 0; i < jobs.length; i++) {

            let lineItemOrder = jobs[i].LineItemOrder;
            let jobName = jobs[i].OrderDescription;
            let productQty = data[i].OrderInformation.OrderInformation.H2[lineItemOrder - 1].B0;
            let lineItemDescription = data[i].OrderInformation.OrderInformation.H2[lineItemOrder - 1].I1;
            let amountPaid = data[i].OrderInformation.OrderInformation.G0;
            let amountDue = data[i].OrderInformation.OrderInformation.F9;
            let companyName = jobs[i].CompanyName;
            let invoiceNumber = jobs[i].OrderInvoiceNumber;
            let orderContact = jobs[i].OrderContactName;
            let phone1 = jobs[i].OrderContactWorkPhone;
            let phone2 = jobs[i].OrderContactCellPhone;
            let salesPerson = jobs[i].SalesPersonName;
            let itemDescription = jobs[i].Description;
            let partPreviewsArray = data[i].OrderInformation.OrderInformation.H2[lineItemOrder - 1].PartPeekViews;
            console.log(data[i].OrderInformation.OrderInformation);

            //Placeholder Btns
            deleteElement(placeHolderPaymentDueBtns[i]);
            placeHolderPaymentDueLoaders[i].Delete();

            //Qty
            $(productQtyFields[i][1]).val(productQty).change();
            productQtySpinners[i].Delete();

            //Parts
            partContainer = new UIContainerType3("width:calc(100% - 40px);", "PARTS", jobContainers[i].contentContainer);
            let partsString = "";
            for(let a = 0; a < partPreviewsArray.length; a++) {
                  let partName = partPreviewsArray[a].O2;
                  partsString += (a + 1) + ': ' + partName + '\n';
            }
            createText(partsString, "width:100%;height:fit-content;float:left;display:block;", partContainer.contentContainer);

            //Illustrator Clipboard
            createIconButton(GM_getResourceURL("Icon_AdobeIllustrator"), "Copy For Illustrator", "width:200px;height:35px;", async () => {
                  let x = '<?xml version="1.0" encoding="UTF-8"?>' +
                        '<svg id = "Layer_1" data-name="Layer 1" xmlns = "http://www.w3.org/2000/svg" width = "210mm" height = "297mm" viewBox = "0 0 595.28 841.89">' +
                        '<g>' +
                        '<text x="0" y="15" fill="black">' + ('Client: ' + companyName.replace("&", "and")) + '</text>' +
                        '<text x="0" y="30" fill="black">' + ('Job: ' + jobName.replace("&", "and")) + '</text>' +
                        '<text x="0" y="45" fill="black">' + 'Description: ' + lineItemDescription.replace("<br>", "      ").replace("&nbsp;", "         ").replace(/<[^>]+>/g, '') + '</text>' +
                        '<text x="0" y="60" fill="black">' + 'Invoice Number: ' + invoiceNumber + '</text>' +
                        '<text x="0" y="75" fill="black">' + 'Line Item: ' + lineItemOrder + '</text>' +
                        '<text x="0" y="90" fill="black">' + 'Product Qty: ' + productQty + '</text>' +
                        '<text x="0" y="105" fill="black">' + 'Customer Name: ' + orderContact.replace("&", "and") + '</text>' +
                        '<text x="0" y="120" fill="black">' + 'Contact Phone 1: ' + phone1 + '</text>' +
                        '<text x="0" y="135" fill="black">' + 'Contact Phone 2: ' + phone2 + '</text>' +
                        '<text x="0" y="150" fill="black">' + 'Sales Person: ' + salesPerson + '</text>' +
                        '<text x="0" y="165" fill="black">' + 'Item Description: ' + itemDescription.replace("&", "and") + '</text>' +
                        '<text x="0" y="180" fill="black">' + 'Parts: ' + partsString.replace("&", "and") + '</text>' +
                        '<rect x="0" y="180" width = "595.28" height = "841.89" fill = "none" stroke = "#969696" stroke-miterlimit="10"/>' +
                        '</g>' +
                        '</svg>';
                  saveToClipboard(x);

                  var parser = new DOMParser();
                  var doc = parser.parseFromString(x, "image/svg+xml");

            }, jobContainers[i].contentContainer, true);

            //Payment
            let paymentDueBtn = createButton("$", "display: block; float: right; width: " + 30 + "px;height:" + 30 +
                  "px; border:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Yellow + ";", () => {
                        let paymentModal = new ModalSingleInput("Payment Due - " + companyName + " - " + invoiceNumber, () => { });
                        paymentModal.value = amountDue;
                        paymentModal.setContainerSize(400, 300);
                  });
            let paymentNotDueBtn = createButton("&#10003", "display: block; float: right; width: " + 30 + "px;height:" + 30 +
                  "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Green + ";", () => { });
            paymentNotDueBtn.innerHTML = "&#10003";

            if(amountDue > 0) {
                  jobContainers[i].addHeadingButtons(paymentDueBtn);
            } else {
                  jobContainers[i].addHeadingButtons(paymentNotDueBtn);
            }

            //Line Item Description
            let lineItemDescriptionText = createText("", "width:100%; height:300px;", lineItemDescriptionFields[i]);
            lineItemDescriptionText.innerHTML = lineItemDescription;
            lineItemDescriptionSpinners[i].Delete();
      }
}

function reorderJobContainer(container, status, currentQueueColour) {
      if(status == "WIP : In Design") newDiv_InDesign.contentContainer.appendChild(container);
      if(status == "WIP : In Design Revision") newDiv_InDesignRevision.contentContainer.appendChild(container);
      if(status == "WIP : Proof Approved" && (currentQueueColour == colour_PrintFilesToBeDone || currentQueueColour == colour_Design)) newDiv_Approved.contentContainer.appendChild(container);
      if(status == "WIP : Proof Approved" && currentQueueColour == colour_TToApprovePrintFiles) newDiv_TristanToApprove.contentContainer.appendChild(container);
      if(status == "WIP : Proof Approved" && currentQueueColour == colour_PrintFilesApproved) newDiv_ReadyToPrint.contentContainer.appendChild(container);
      if(status == "WIP : In Production" && currentQueueColour == colour_InProduction) newDiv_Production.contentContainer.appendChild(container);
      if(currentQueueColour == colour_Urgent) newDiv_Urgent.contentContainer.appendChild(container);
}

function createBoardItem(parentObjectToAppendTo, customerName, jobName, invoiceNumber, lineItemNumber) {
      let div = document.createElement("div");
      div.style = STYLE.Div3;

      if(parentObjectToAppendTo != null) {
            parentObjectToAppendTo.appendChild(div);
      }
      return div;
}

async function OnJobPopOut(jobId, jobIndex, OrderId, AccountId, jobContainer) {
      //Styles
      jobContainer.growOnHover = false;

      //Notes
      let productNotes = await getProductNotesAll(jobId);

      let numOfNotes_Type = {
            Design: 0,
            Sales: 0,
            Production: 0,
            Vendor: 0,
            Customer: 0
      };

      console.log(productNotes);
      for(let j = 0; j < 5; j++) {
            let numOfNotes = productNotes[j].ProductionNotes.length;

            //Add Notes
            for(let x = 0; x < numOfNotes; x++) {

                  if(productNotes[j].ProductionNotes[x].IsHidden) continue;

                  let containerToAppendTo;
                  switch(j) {
                        case 0:/*Sales*/
                              containerToAppendTo = notesSales[jobIndex];
                              numOfNotes_Type.Sales++;
                              break;
                        case 1:/*Design*/
                              containerToAppendTo = notesDesign[jobIndex];
                              numOfNotes_Type.Design++;
                              break;
                        case 2:/*Production*/
                              containerToAppendTo = notesProduction[jobIndex];
                              numOfNotes_Type.Production++;
                              break;
                        case 3:/*Customer*/
                              containerToAppendTo = notesCustomer[jobIndex];
                              numOfNotes_Type.Customer++;
                              break;
                        case 4:/*Vendor*/
                              containerToAppendTo = notesVendor[jobIndex];
                              numOfNotes_Type.Vendor++;
                              break;
                        default: break;
                  }

                  if(x == 0) removeAllChildrenFromParent(containerToAppendTo);

                  addNote(productNotes[j].ProductionNotes[x].Note, productNotes[j].ProductionNotes[x].CreatedByName, productNotes[j].ProductionNotes[x].Id, j, containerToAppendTo);
            }
      }

      //Add Qty Count Circle 
      function createQtyCircle(qty, attachedTo) {
            let numberDisplayDiv = document.createElement("div");
            numberDisplayDiv.innerText = qty;
            numberDisplayDiv.style = "width:20px;height:15px;background-color:red;border-radius:10px;font-size:10px;font-weight:bold;position:absolute;top:-15px;left:35px;color:white;padding-top:4px;";
            attachedTo.appendChild(numberDisplayDiv);
            return numberDisplayDiv;
      }

      noteQtyCircles =
            [createQtyCircle(numOfNotes_Type.Sales, salesNotesBtns[jobIndex]),
            createQtyCircle(numOfNotes_Type.Design, designNotesBtns[jobIndex]),
            createQtyCircle(numOfNotes_Type.Production, productionNotesBtns[jobIndex]),
            createQtyCircle(numOfNotes_Type.Customer, customerNotesBtns[jobIndex]),
            createQtyCircle(numOfNotes_Type.Vendor, vendorNotesBtns[jobIndex])];

      if(numOfNotes_Type.Sales > 0) $(noteQtyCircles[0]).show(); else $(noteQtyCircles[0]).hide();
      if(numOfNotes_Type.Design > 0) $(noteQtyCircles[1]).show(); else $(noteQtyCircles[1]).hide();
      if(numOfNotes_Type.Production > 0) $(noteQtyCircles[2]).show(); else $(noteQtyCircles[2]).hide();
      if(numOfNotes_Type.Customer > 0) $(noteQtyCircles[3]).show(); else $(noteQtyCircles[3]).hide();
      if(numOfNotes_Type.Vendor > 0) $(noteQtyCircles[4]).show(); else $(noteQtyCircles[4]).hide();

      //Customer Email
      let email = await getCustomerEmail(OrderId, AccountId);
      console.log(email);
      customerEmails[jobIndex][1].value = email;
}

async function OnJobPopOutLeave(jobId, jobIndex, jobContainer) {
      //Styles
      jobContainer.growOnHover = true;
}

function addNote(text, createdBy = "", noteId, typeIndex = 1/*Design*/, containerToAppendTo) {
      let newNote, noteText, deleteButton, createdByText;

      newNote = createDiv("width:calc(100% - 20px);margin:10px;min-height:40px;background-color:#eee;padding:10px;" + STYLE.DropShadow, null, containerToAppendTo);
      newNote.id = noteId;

      noteText = createText(text, "width:calc(100% - 120px);height:100%;", newNote);

      deleteButton = createButton("X", "width:30px;height:15px;margin:0px;float:right;backgrou-color:" + COLOUR.Red + ";transform: translate(10px, -10px);", async () => {
            await deleteNote(noteId, typeIndex);
            deleteElement(newNote);
            deleteElement(deleteButton);
            deleteElement(noteText);
            deleteElement(createdByText);
      }, newNote);

      createdByText = createText(createdBy, "width:calc(80px);height:100%;text-align:right;float:right;color:" + COLOUR.MidGrey, newNote);
}

async function deleteNote(noteId, typeIndex) {
      await deleteProductNote(noteId);
      let newNumber = parseInt(noteQtyCircles[typeIndex].innerText) - 1;
      noteQtyCircles[typeIndex].innerText = newNumber;

      if(newNumber <= 0) $(noteQtyCircles[typeIndex]).hide();
}