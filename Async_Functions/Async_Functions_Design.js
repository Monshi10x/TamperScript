
/*
                            
        DESIGN BOARD        
*/
async function getDesignJobs() {
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
      console.log(data);
      return data.d.QueueEntries;
}

async function getProductionJobs() {
      const response = await fetch("https://sar10686.corebridge.net/SalesModule/Orders/OrderProduct.asmx/GetOrderProductQueueEntriesPaged", {
            "headers": {
                  "accept": "application/json, text/javascript, */*; q=0.01",
                  "accept-language": "en-US,en;q=0.9",
                  "content-type": "application/json; charset=UTF-8",
                  "priority": "u=1, i",
                  "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                  "sec-ch-ua-mobile": "?0",
                  "sec-ch-ua-platform": "\"Windows\"",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://sar10686.corebridge.net/ProductionModule/WipQueue.aspx",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"sEcho\":2,\"iColumns\":21,\"sColumns\":\"\",\"iDisplayStart\":0,\"iDisplayLength\":500,\"iSortCol_0\":6,\"sSortDir_0\":\"asc\",\"viewType\":\"production\",\"queueType\":\"production_wip\",\"txSearch\":\"\",\"pageIndex\":1,\"arrQueueFilters\":[null,\"\",null,\"\",\"\",\"\",\"\",\"\",null,null,\"\",\"\",null,null]}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
      });;
      const data = await response.json();
      console.log(data);
      return data.d.QueueEntries;
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