(function() {
      'use strict';
      const myCss = GM_getResourceText("IMPORTED_CSS");
      GM_addStyle(myCss);
})();

///Commonui.Alert("Done!");

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

async function updateBoard() {
      console.log(jobs);

      //let table = document.querySelector("#tblQueue");
      //let tableRows = document.querySelectorAll(".queue-parentrow")
      let parentContainer = document.body;
      let masterContainer = document.createElement("div");
      parentContainer.appendChild(masterContainer);
      masterContainer.style = "display:flex;float:left;width:100%;height:800px;background-color:white;flex-wrap: nowrap;overflow: auto;";

      let newDiv_InDesign = new UIContainerType3("width:calc(20% - 24px);height:90%;flex: 0 0 auto;", "In Design", masterContainer);
      newDiv_InDesign.container.style.cssText += "background-color:#aaacff";
      makeReceiveDraggable(newDiv_InDesign.container);
      let newDiv_InDesignRevision = new UIContainerType3("width:calc(20% - 24px);margin-left:0px;height:90%;flex: 0 0 auto;", "In Design Revision", masterContainer);
      newDiv_InDesignRevision.container.style.cssText += "background-color:#aaacff";
      makeReceiveDraggable(newDiv_InDesignRevision.container);
      let newDiv_Approved = new UIContainerType3("width:calc(20% - 24px);margin-left:0px;height:90%;flex: 0 0 auto;", "Proof Approved - Setup Print Files", masterContainer);
      newDiv_Approved.container.style.cssText += "background-color:#c8c8c8";
      makeReceiveDraggable(newDiv_Approved.container);
      let newDiv_TristanToApprove = new UIContainerType3("width:calc(20% - 24px);margin-left:0px;height:90%;flex: 0 0 auto;", "Tristan To Approve", masterContainer);
      newDiv_TristanToApprove.container.style.cssText += "background-color:#a2ff9b";
      makeReceiveDraggable(newDiv_TristanToApprove.container);
      let newDiv_ReadyToPrint = new UIContainerType3("width:calc(20% - 24px);margin-left:0px;height:90%;flex: 0 0 auto;", "Ready To Print", masterContainer);
      newDiv_ReadyToPrint.container.style.cssText += "background-color:#feffa6";
      makeReceiveDraggable(newDiv_ReadyToPrint.container);
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
      for(let i = 0; i < jobs.length; i++) {
            console.log(jobs[i]);
            //hide() {
            //     this.returnAllBorrowedFields();
            //super.hide();
            //}
            let toAppendTo;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design") toAppendTo = newDiv_InDesign.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design Revision") toAppendTo = newDiv_InDesignRevision.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && (jobs[i].QueuePrioritySettingColor == "#d9e1f2" || jobs[i].QueuePrioritySettingColor == "#4472c4")) toAppendTo = newDiv_Approved.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == "#47ad8b") toAppendTo = newDiv_TristanToApprove.contentContainer;
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == "#ffc000") toAppendTo = newDiv_ReadyToPrint.contentContainer;

            let newJobContainer = new UIContainer_Design("max-height:200px;", jobs[i].CompanyName, jobs[i].Description, toAppendTo);
            jobContainers.push(newJobContainer);

            makeDraggable(newJobContainer.container);


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
            let designer = createDropdown_Infield("Designer", 2, "width:300px;margin-right: calc(100% - 312px);",
                  [createDropdownOption("Darren Frankish", "Darren Frankish"),
                  createDropdownOption("Leandri Hayward", "Leandri Hayward"),
                  createDropdownOption("null", "null")], () => {alert("TODO: Designer On Change");}, inhouseDiv);

            for(let x = 0; x < designer[1].options.length; x++) {

                  let val1 = "" + designer[1].options[x].value.toString().replaceAll(" ", "");

                  let val2 = "";
                  if(jobs[i].AssignedUsers == null) val2 += "null";
                  else val2 += jobs[i].AssignedUsers.toString().replaceAll(" ", "");

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
                  console.log(WIPID);
                  dropdownOptions.push(createDropdownOption(WIPOptions[j], WIPID));
            }
            let WIPStatus = createDropdown_Infield("WIP Status", 0, "width:300px;margin-right: calc(100% - 312px);",
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

            for(let x = 0; x < WIPStatus[1].options.length; x++) {
                  //WIPStatus[1].options.length
                  console.log(jobs[i].OrderProductStatusTextWithOrderStatus + "/" + WIPStatus[1].options[x].value);
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
            createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;"
                  , "view item", "/DesignModule/DesignProductEdit.aspx?OrderProductId=" + jobs[i].Id + "&OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;", "view order", "/DesignModule/DesignOrderView.aspx?OrderId=" + jobs[i].OrderId, "_blank", jobContainers[i].contentContainer);
            if(jobs[i].ProofFileName != "") {
                  createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;", "proof", "../../ShowImage.aspx?LoadLocalProof=proof_" + jobs[i].OrderId + "_" + jobs[i].Id + "_0.pdf", "_blank", jobContainers[i].contentContainer);
            }
            //


            let itemNoBtn = createButton(jobs[i].LineItemOrder + "/" + jobs[i].TotalProductsInOrder, "display: block; float: right; width: " + 60 + "px;height:" + 30 + "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:rgb(255 111 63);", () => { });
            jobContainers[i].addHeadingButtons(itemNoBtn);


            let jobNoBtn = createButton(jobs[i].OrderInvoiceNumber, "display: block; float: right; width: " + 80 + "px;height:" + 30 + "px; border:none;padding:2px; color:White;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Orange + ";", () => { });
            jobContainers[i].addHeadingButtons(jobNoBtn);

            let jobColour = createButton("", "display: block; float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + (jobs[i].QueuePrioritySettingColor == null ? "white" : jobs[i].QueuePrioritySettingColor) + ";", () => {

            });
            jobContainers[i].addHeadingButtons(jobColour);
            console.log(jobs[i].QueuePrioritySettingColor);


            //if(jobs[i].TotalPaid < jobs[i].TotalPrice) jobContainer.addHeadingButtons(paymentDueBtn);
            dataPromise.push(getOrderData_QuoteLevel(jobs[i].OrderId, jobs[i].AccountId, jobs[i].CompanyName));
      }

      //Notes
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


      for(let i = 0; i < jobs.length; i++) {
            console.log(data[i]);
            /**
             * Payment
             */
            let amountPaid = data[i].OrderInformation.OrderInformation.G0;
            let amountDue = data[i].OrderInformation.OrderInformation.F9;
            let paymentDueBtn = createButton("$", "display: block; float: right; width: " + 30 + "px;height:" + 30 + "px; border:none;padding:2px; color:black;min-height: 20px; margin: 0px 0px 0px 0px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px;background-color:" + COLOUR.Yellow + ";", () => {
                  let paymentModal = new ModalSingleInput("Payment Due - " + jobs[i].CompanyName + " - " + jobs[i].OrderInvoiceNumber, () => { });
                  paymentModal.value = amountDue;
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
            console.log(container, status, currentQueueColour);
            console.log(status == "WIP : In Design");
            console.log(status == "WIP : In Design Revision");
            if(status == "WIP : In Design") newDiv_InDesign.contentContainer.appendChild(container);
            if(status == "WIP : In Design Revision") newDiv_InDesignRevision.contentContainer.appendChild(container);
            if(status == "WIP : Proof Approved" && (currentQueueColour == "#d9e1f2" || currentQueueColour == "#4472c4")) newDiv_Approved.contentContainer.appendChild(container);
            if(status == "WIP : Proof Approved" && currentQueueColour == "#47ad8b") newDiv_TristanToApprove.contentContainer.appendChild(container);
            if(status == "WIP : Proof Approved" && currentQueueColour == "#ffc000") newDiv_ReadyToPrint.contentContainer.appendChild(container);
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