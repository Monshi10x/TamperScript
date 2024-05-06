/**
 * @see https://github.com/SortableJS/Sortable
 */
(function() {
      'use strict';
      const myCss = GM_getResourceText("IMPORTED_CSS");
      GM_addStyle(myCss);
})();

let defaultView = "Card View";

let colour_Urgent = "#ff0000";
let colour_Design = "#4472c4";
let colour_Hold = "#a5a5a5";
let colour_DesignRevision = "#a9d08e";
let colour_PrintFilesToBeDone = "#d9e1f2";
let colour_TToApprovePrintFiles = "#47ad8b";
let colour_PrintFilesApproved = "#ffc000";
let colour_InProduction = "#000000";

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

//Darren: 20
//Lee: 31

window.addEventListener("load", (event) => {
      getRowsData();
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
            "body": "{\"sEcho\":2,\"iColumns\":21,\"sColumns\":\"\",\"iDisplayStart\":0,\"iDisplayLength\":\"250\",\"iSortCol_0\":0,\"sSortDir_0\":\"asc\",\"viewType\":\"design\",\"queueType\":\"design_wip\",\"txSearch\":\"\",\"pageIndex\":1,\"arrQueueFilters\":[null,\"\",null,\"\",\"\",\"\",null,\"\",null,null,\"\",\"\",null,null]}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });
      const data = await response.json();
      jobs = data.d.QueueEntries;

      await updateBoard();
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

/**
 * 
 * @param {BigInteger} OrderId i.e. 14777
 * @param {BigInteger} OrderProductId i.e. 56762
 * @param {String} UserIds i.e. "31,20" (ensure no spaces)
 * @returns JSON Data Object
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

async function updateBoard() {
      console.log(jobs);
      // multiDrag: true, // Enable multi-drag
      //selectedClass: 'selected', // The class applied to the selected items
      //fallbackTolerance: 3, // So that we can select items on mobile
      //let table = document.querySelector("#tblQueue");
      //let tableRows = document.querySelectorAll(".queue-parentrow")
      let parentContainer = document.body;

      let existingJobBoard = document.querySelector("#MainContent");
      let existingJobBoardFooter = document.querySelector("#divFooterLogoWrapper");

      let masterContainer = document.createElement("div");
      parentContainer.appendChild(masterContainer);
      masterContainer.style = "display:flex;float:left;width:100vw;height:calc(100vh - 157px);background-color:white;flex-wrap: nowrap;overflow: auto;overflow-x:scroll;margin-bottom:0px;";
      masterContainer.classList.add("x-scrollable");


      let optionsHeader = document.createElement("div");
      optionsHeader.style = "width:100%;height:75px;display:block;float: left;background-color:" + COLOUR.White;
      //parentContainer.appendChild(optionsHeader);
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


      let newDiv_Urgent = new UIContainerType3("width:calc(17% - 24px);min-width:350px;height:calc(100% - 40px);;flex: 0 0 auto;", "Urgent", masterContainer);
      newDiv_Urgent.container.style.cssText += "background-color:#ff0000;";
      new Sortable(newDiv_Urgent.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
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


      let newDiv_DesignHold = new UIContainerType3("width:calc(17% - 24px);min-width:350px;height:calc(100% - 40px);;flex: 0 0 auto;", "Design Hold", masterContainer);
      newDiv_DesignHold.container.style.cssText += "background-color:#a5a5a5;";
      new Sortable(newDiv_DesignHold.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
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








      let newDiv_InDesign = new UIContainerType3("width:calc(17% - 24px);min-width:350px;height:calc(100% - 40px);;flex: 0 0 auto;", "In Design", masterContainer);
      newDiv_InDesign.container.style.cssText += "background-color:rgb(68, 114, 196);";
      new Sortable(newDiv_InDesign.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_InDesign);
      newDiv_InDesign.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_InDesign.contentContainer.classList.add("x-scrollable");
      newDiv_InDesign.headingContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_InDesign.headingContainer.children.length; x++) {
            newDiv_InDesign.headingContainer.children[x].classList.add("x-scrollable");
      }


      let newDiv_InDesignRevision = new UIContainerType3("width:calc(17% - 24px);min-width:350px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "In Design Revision", masterContainer);
      newDiv_InDesignRevision.container.style.cssText += "background-color:#a9d08e";
      new Sortable(newDiv_InDesignRevision.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_InDesignRevision);
      newDiv_InDesignRevision.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_InDesignRevision.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_InDesignRevision.headingContainer.children.length; x++) {
            newDiv_InDesignRevision.headingContainer.children[x].classList.add("x-scrollable");
      }

      let newDiv_Approved = new UIContainerType3("width:calc(17% - 24px);min-width:350px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Proof Approved - Setup Print Files", masterContainer);
      newDiv_Approved.container.style.cssText += "background-color:rgb(217, 225, 242)";
      new Sortable(newDiv_Approved.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_Approved);
      newDiv_Approved.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_Approved.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_Approved.headingContainer.children.length; x++) {
            newDiv_Approved.headingContainer.children[x].classList.add("x-scrollable");
      }


      let newDiv_TristanToApprove = new UIContainerType3("width:calc(17% - 24px);min-width:350px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Tristan To Approve", masterContainer);
      newDiv_TristanToApprove.container.style.cssText += "background-color:rgb(71, 173, 139);";
      new Sortable(newDiv_TristanToApprove.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_TristanToApprove);
      newDiv_TristanToApprove.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_TristanToApprove.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_TristanToApprove.headingContainer.children.length; x++) {
            newDiv_TristanToApprove.headingContainer.children[x].classList.add("x-scrollable");
      }

      let newDiv_ReadyToPrint = new UIContainerType3("width:calc(17% - 24px);min-width:350px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Ready To Print", masterContainer);
      newDiv_ReadyToPrint.container.style.cssText += "background-color:rgb(255, 192, 0);";
      new Sortable(newDiv_ReadyToPrint.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_ReadyToPrint);
      newDiv_ReadyToPrint.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_ReadyToPrint.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_ReadyToPrint.headingContainer.children.length; x++) {
            newDiv_ReadyToPrint.headingContainer.children[x].classList.add("x-scrollable");
      }

      let newDiv_Production = new UIContainerType3("width:calc(15% - 24px);min-width:350px;margin-left:0px;height:calc(100% - 40px);flex: 0 0 auto;", "Printed -> Production", masterContainer);
      newDiv_Production.container.style.cssText += "background-color:rgb(0,0,0);";
      new Sortable(newDiv_Production.contentContainer, {
            animation: 120,
            group: 'shared',
            swapThreshold: 1,
            ghostClass: 'sortable-ghost',
            direction: 'vertical',
            onEnd: function(/**Event*/evt) {
                  onMoveEnd();
            }
      });
      columnContainers.push(newDiv_Production);
      newDiv_Production.contentContainer.style.cssText += "min-height:calc(100% - 30px)";
      newDiv_Production.contentContainer.classList.add("x-scrollable");
      for(let x = 0; x < newDiv_Production.headingContainer.children.length; x++) {
            newDiv_Production.headingContainer.children[x].classList.add("x-scrollable");
      }

      const slider = masterContainer;
      let isDown = false;
      let startX;
      let scrollLeft;

      slider.addEventListener('mousedown', (e) => {
            if(e.target.classList.contains("x-scrollable")) {
                  e.preventDefault();
                  isDown = true;
                  slider.classList.add('active');
                  startX = e.pageX - slider.offsetLeft;
                  scrollLeft = slider.scrollLeft;
            }
      });
      slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
      });
      slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
      });
      slider.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            if(e.target.classList.contains("x-scrollable")) {
                  e.preventDefault();
                  const x = e.pageX - slider.offsetLeft;
                  const walk = (x - startX) * 1; //scroll-fast
                  slider.scrollLeft = scrollLeft - walk;
            }
      });


      let dataPromise = [];
      let lineItemDescriptionFields = [];
      let lineItemDescriptionSpinners = [];
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

            let newJobContainer = new UIContainer_Design("max-height:200px;", jobs[i].CompanyName, jobs[i].Description, toAppendTo);
            newJobContainer.container.dataset.cb_id = jobs[i].Id;
            newJobContainer.Id = jobs[i].Id;
            newJobContainer.OrderId = jobs[i].OrderId;
            newJobContainer.Priority = jobs[i].QueuePriority;
            newJobContainer.JobColour = jobs[i].QueuePrioritySettingColor;
            newJobContainer.QueuePrioritySettingId = jobs[i].QueuePrioritySettingId;

            jobContainers.push(newJobContainer);
            jobs[i].jobContainer = newJobContainer;
            newJobContainer.container.id = "sortablelist";

            let tempSpinnerDiv = document.createElement("div");
            tempSpinnerDiv.style = "display: block;position:relative; text-align: center;font-size:8px;line-height:30px;float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:0px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; background-color:" + COLOUR.MediumGrey + ";";
            tempSpinnerDiv.innerHTML = "  $";
            placeHolderPaymentDueBtns.push(tempSpinnerDiv);
            newJobContainer.addHeadingButtons(tempSpinnerDiv);
            let placeholderLoader = new Loader("", tempSpinnerDiv);

            placeHolderPaymentDueLoaders.push(placeholderLoader);
            placeholderLoader.setSize(10);

            let descriptionField = createDiv("width:calc(100% - 12px);margin:6px;min-height:40px;background-color:white;position:relative;", "Description", jobContainers[i].contentContainer);
            lineItemDescriptionFields.push(descriptionField);
            let loader = new Loader("", descriptionField);
            lineItemDescriptionSpinners.push(loader);

            jobContainers[i].Minimize();

            let customerContactDiv = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:block;", "Customer Contact", jobContainers[i].contentContainer);

            createLabel("Contact: " + jobs[i].OrderContactName, null, customerContactDiv);
            createLabel("Contact Ph: " + jobs[i].OrderContactWorkPhone, null, customerContactDiv);
            createLabel("Contact Ph2: " + jobs[i].OrderContactCellPhone, null, customerContactDiv);

            let inhouseDiv = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:block;", "Inhouse Items", jobContainers[i].contentContainer);
            let designer = createDropdown_Infield("Designer", 2, "max-width:30%;min-width:150px;margin-right: 70%;",
                  [createDropdownOption("Darren Frankish", "20"),
                  createDropdownOption("Leandri Hayward", "31"),
                  createDropdownOption("null", "")], async () => {
                        let loader = new Loader("", designer[0]);

                        await AssignUsersToOrderProduct(jobs[i].OrderId, jobs[i].Id, designer[1].value);
                        loader.Delete();
                  }, inhouseDiv);

            for(let x = 0; x < designer[1].options.length; x++) {

                  let val1 = "" + designer[1].options[x].innerText.toString().replaceAll(" ", "");

                  let val2 = "";
                  if(jobs[i].AssignedUsers == null) val2 += "null";
                  else val2 += jobs[i].AssignedUsers.toString().replaceAll(" ", "");

                  console.log(val1, val2);
                  if(val1 == val2) {
                        designer[1].selectedIndex = x;
                        break;
                  }
            }

            //WIP Status


            /*
            allOrderProductStatuses
 
            {
                  "Id": 7,
                  "Name": "IN DESIGN",
                  "CbText": "WIP : In Design",
                  "CustomerText": "In Design",
                  "Sequence": 80,
                  "AllowCustomization": null,
                  "OrderStatusId": 4,
                  "IsDisabled": false
            }
            */
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
            let WIPStatus = createDropdown_Infield("WIP Status", 0, "max-width:30%;min-width:150px;margin-right: 70%;",
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

                  }, inhouseDiv);
            WIPStatus[1].dataset.currentValue = 0;
            WIPStatus[1].id = "WIPStatus";

            for(let x = 0; x < WIPStatus[1].options.length; x++) {
                  //WIPStatus[1].options.length
                  if(jobs[i].OrderProductStatusTextWithOrderStatus == WIPStatus[1].options[x].innerText) {
                        WIPStatus[1].selectedIndex = x;
                        WIPStatus[1].dataset.currentValue = x;
                        break;
                  }
            }

            // createLabel("#: " + jobs[i].OrderInvoiceNumber, null, jobContainers[i].contentContainer);
            createLabel("Sales Person: " + jobs[i].SalesPersonName, null, inhouseDiv);
            //createLabel("Total Paid: $" + jobs[i].TotalPaid, null, jobContainers[i].contentContainer);
            createLabel("Item Price: $" + jobs[i].TotalPrice, null, inhouseDiv);

            /* Notes */
            let ns, nd, np, nc, nv;
            let btnContainer = document.createElement("div");
            btnContainer.style = "padding-left:6px;width:100%;box-sizing:border-box;display:block;min-height: 10px;float:left;margin-top:12px;";
            jobContainers[i].contentContainer.appendChild(btnContainer);
            salesNotesBtns.push(createButton("Sales", "width:100px;margin:0px;position:relative;", () => {toggleNotes(ns);}, btnContainer));
            designNotesBtns.push(createButton("Design", "width:100px;margin:0px;position:relative;", () => {toggleNotes(nd);}, btnContainer));
            productionNotesBtns.push(createButton("Production", "width:100px;margin:0px;position:relative;", () => {toggleNotes(np);}, btnContainer));
            customerNotesBtns.push(createButton("Customer", "width:100px;margin:0px;position:relative;", () => {toggleNotes(nc);}, btnContainer));
            vendorNotesBtns.push(createButton("Vendor", "width:100px;margin:0px;position:relative;", () => {toggleNotes(nv);}, btnContainer));
            ns = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:block;", "Sales Notes", jobContainers[i].contentContainer);
            nd = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:none;", "Design Notes", jobContainers[i].contentContainer);
            np = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:none;", "Production Notes", jobContainers[i].contentContainer);
            nc = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:none;", "Customer Notes", jobContainers[i].contentContainer);
            nv = createDiv("width:calc(100% - 12px);margin:6px;margin-top:0px;min-height:40px;background-color:white;display:none;", "Vendor Notes", jobContainers[i].contentContainer);
            notesSales.push(ns);
            notesDesign.push(nd);
            notesProduction.push(np);
            notesCustomer.push(nc);
            notesVendor.push(nv);

            function toggleNotes(elementToShow) {
                  $(notesSales).hide();
                  $(notesDesign).hide();
                  $(notesProduction).hide();
                  $(notesCustomer).hide();
                  $(notesVendor).hide();
                  $(elementToShow).show();
            }

            //createLabel("Item " + jobs[i].LineItemOrder + " of " + jobs[i].TotalProductsInOrder, null, jobContainers[i].contentContainer);
            createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;"
                  , "view item", "/DesignModule/DesignProductEdit.aspx?OrderProductId=" + jobs[i].Id + "&OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;", "view order", "/DesignModule/DesignOrderView.aspx?OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            if(jobs[i].ProofFileName != "") {
                  createLink("display: block; float: left; width: 200px; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;font-size:14px;text-align:center;line-height:35px;", "proof", "../../ShowImage.aspx?LoadLocalProof=proof_" + jobs[i].OrderId + "_" + jobs[i].Id + "_0.pdf", "_blank", jobContainers[i].contentContainer);
            }
            //




            let jobNoBtn = createButton(jobs[i].OrderInvoiceNumber, "display: block; float: left; width: " + 80 + "px;height:" + 30 + "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Black + ";", () => { });
            jobContainers[i].addHeadingButtons(jobNoBtn);

            let itemNoBtn = createButton(jobs[i].LineItemOrder + "/" + jobs[i].TotalProductsInOrder, "display: block; float: left; width: " + 40 + "px;height:" + 30 + "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.DarkGrey, () => { });
            jobContainers[i].addHeadingButtons(itemNoBtn);


            let jobColour = document.createElement("div");
            jobColour.style = "display: block; float: left; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:0px; position:relative;color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + (jobs[i].QueuePrioritySettingColor == null ? "white" : jobs[i].QueuePrioritySettingColor) + ";";

            jobContainers[i].addHeadingButtons(jobColour);
            jobColour.id = "jobColour";

            //QueuePriority
            //let queuePriority = jobs[i].QueuePriority;
            //if(jobs[i].QueuePriority == null) {
            //      console.log("i " + i);
            //      queuePriority = (i + 1);
            //}
            let jobOrder = createButton(jobs[i].QueuePriority, "display: block; float: left; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.White + ";", () => {

            });
            jobOrder.id = "queuePriority";
            queuePriority.push(jobOrder);
            jobContainers[i].addHeadingButtons(jobOrder);


            //if(jobs[i].TotalPaid < jobs[i].TotalPrice) jobContainer.addHeadingButtons(paymentDueBtn);
            dataPromise.push(getOrderData_QuoteLevel(jobs[i].OrderId, jobs[i].AccountId, jobs[i].CompanyName));
      }

      onMoveEnd();

      /*

none: ""
todo:"5"
redesign :"14"
hold:"9"
urgent: "3"
Print files to be done: "13"
files approved by T: "8"
to to approved print files: "6"
production: 7
      */


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
                                    //newState = can be any state
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
                              default /*No Colour*/:
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
                              console.log("" + jobArrayElement.Id, "" + jobArrayElement.OrderId, (j + 1), "" + newColourAsHex, newQueueID == null ? currentQueueID : newQueueID);
                              jobArrayElement.QueuePrioritySettingId = newQueueID == null ? currentQueueID : newQueueID;

                              await updateItemPriority("" + jobArrayElement.Id, "" + jobArrayElement.OrderId, (j + 1), "" + newColourAsHex, newQueueID == null ? currentQueueID : newQueueID);

                        }
                        if(requiresUpdateStatus) {
                              console.log("requires status: " + jobArrayElement.Id, currentStateId, newStateId);
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



      /**
       * @Notes
       */
      for(let i = 0; i < jobs.length; i++) {
            let productNotesDesign = await getProductNotes(jobs[i].Id, 2);
            let numOfNotes = productNotesDesign.ProductionNotes.length;
            for(let x = 0; x < numOfNotes; x++) {
                  let newNote = createDiv("width:calc(100% - 20px);margin:10px;min-height:40px;background-color:#eee;padding:10px;" + STYLE.DropShadow, null, notesDesign[i]);
                  newNote.innerText = productNotesDesign.ProductionNotes[x].Note;
            }

            //let btns = [salesNotesBtns[i], designNotesBtns[i], productionNotesBtns[i], customerNotesBtns[i], vendorNotesBtns[i]];
            if(numOfNotes > 0) {
                  let numberDisplayDiv = document.createElement("div");
                  numberDisplayDiv.innerText = numOfNotes;
                  numberDisplayDiv.style = "width:20px;height:15px;background-color:red;border-radius:10px;font-size:10px;font-weight:bold;position:absolute;top:-15px;left:35px;color:white;padding-top:4px;";

                  designNotesBtns[i].appendChild(numberDisplayDiv);
            }

      }

      let data = await Promise.all(dataPromise);


      /**
       * @AfterFetch
       */
      for(let j = 0; j < placeHolderPaymentDueBtns.length; j++) {
            deleteElement(placeHolderPaymentDueBtns[j]);
            placeHolderPaymentDueLoaders[j].Delete();
      }
      for(let i = 0; i < jobs.length; i++) {
            /**
             * Payment
             */
            let amountPaid = data[i].OrderInformation.OrderInformation.G0;
            let amountDue = data[i].OrderInformation.OrderInformation.F9;

            let paymentDueBtn = createButton("$", "display: block; float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Yellow + ";", () => {
                  let paymentModal = new ModalSingleInput("Payment Due - " + jobs[i].CompanyName + " - " + jobs[i].OrderInvoiceNumber, () => { });
                  paymentModal.value = amountDue;
                  paymentModal.setContainerSize(400, 300);
            });
            let paymentNotDueBtn = createButton("&#10003", "display: block; float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Green + ";", () => { });
            paymentNotDueBtn.innerHTML = "&#10003";

            if(amountDue > 0) {
                  jobContainers[i].addHeadingButtons(paymentDueBtn);
            } else {
                  jobContainers[i].addHeadingButtons(paymentNotDueBtn);
            }
            /**
             * Line Item Description
             */
            let lineItemDescription = data[i].OrderInformation.OrderInformation.H2[jobs[i].LineItemOrder - 1].I1;
            lineItemDescriptionFields[i].innerHTML = lineItemDescriptionFields[i].innerHTML + lineItemDescription;

            lineItemDescriptionSpinners[i].Delete();

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
}

function createBoardItem(parentObjectToAppendTo, customerName, jobName, invoiceNumber, lineItemNumber) {
      let div = document.createElement("div");
      div.style = STYLE.Div3;

      if(parentObjectToAppendTo != null) {
            parentObjectToAppendTo.appendChild(div);
      }
      return div;
}