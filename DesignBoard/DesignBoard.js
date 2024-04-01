(function() {
      'use strict';

})();

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

async function updateBoard() {
      console.log(jobs);

      //let table = document.querySelector("#tblQueue");
      //let tableRows = document.querySelectorAll(".queue-parentrow")
      let parentContainer = document.body;
      let masterContainer = document.createElement("div");
      parentContainer.appendChild(masterContainer);
      masterContainer.style = "display:flex;float:left;width:100%;height:800px;background-color:white;flex-wrap: nowrap;overflow: auto;";

      let newDiv_InDesign = new UIContainerType3("width:280px;height:90%;flex: 0 0 auto;", "In Design", masterContainer);
      let newDiv_InDesignRevision = new UIContainerType3("width:280px;margin-left:0px;height:90%;flex: 0 0 auto;", "In Design Revision", masterContainer);
      let newDiv_Approved = new UIContainerType3("width:280px;margin-left:0px;height:90%;flex: 0 0 auto;", "Proof Approved - Setup Print Files", masterContainer);
      let newDiv_TristanToApprove = new UIContainerType3("width:280px;margin-left:0px;height:90%;flex: 0 0 auto;", "Tristan To Approve", masterContainer);
      let newDiv_ReadyToPrint = new UIContainerType3("width:280px;margin-left:0px;height:90%;flex: 0 0 auto;", "Ready To Print", masterContainer);

      for(let i = 0; i < jobs.length; i++) {
            let jobContainer;
            console.log(jobs[i]);
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design") jobContainer = new UIContainerType3("max-height:200px;", jobs[i].CompanyName, newDiv_InDesign.contentContainer);
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : In Design Revision") jobContainer = new UIContainerType3("max-height:200px;", jobs[i].CompanyName, newDiv_InDesignRevision.contentContainer);
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == "#d9e1f2") jobContainer = new UIContainerType3("max-height:200px;", jobs[i].CompanyName, newDiv_Approved.contentContainer);
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == "#47ad8b") jobContainer = new UIContainerType3("max-height:200px;", jobs[i].CompanyName, newDiv_TristanToApprove.contentContainer);
            if(jobs[i].OrderProductStatusTextWithOrderStatus == "WIP : Proof Approved" && jobs[i].QueuePrioritySettingColor == "#ffc000") jobContainer = new UIContainerType3("max-height:200px;", jobs[i].CompanyName, newDiv_ReadyToPrint.contentContainer);

            createText("Description: " + jobs[i].Description, "width:100%;height:40px;text-overflow: ellipsis; overflow: hidden;", jobContainer.contentContainer);
            jobContainer.Minimize();

            createLabel("Designer: " + jobs[i].AssignedUsers, null, jobContainer.contentContainer);
            createLabel("Contact: " + jobs[i].OrderContactName, null, jobContainer.contentContainer);
            createLabel("Contact Ph: " + jobs[i].OrderContactWorkPhone, null, jobContainer.contentContainer);
            createLabel("#: " + jobs[i].OrderInvoiceNumber, null, jobContainer.contentContainer);
            createLabel("Sales Person: " + jobs[i].SalesPersonName, null, jobContainer.contentContainer);
            createLabel("Total Paid: $" + jobs[i].TotalPaid, null, jobContainer.contentContainer);
            createLabel("Total Price: $" + jobs[i].TotalPrice, null, jobContainer.contentContainer);
            createLabel("Item " + jobs[i].LineItemOrder + " of " + jobs[i].TotalProductsInOrder, null, jobContainer.contentContainer);
            createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;"
                  , "view item", "/DesignModule/DesignProductEdit.aspx?OrderProductId=" + jobs[i].Id + "&OrderId=" + jobs[i].OrderId, "_blank", jobContainer.contentContainer);
            createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;", "view order", "/DesignModule/DesignOrderView.aspx?OrderId=" + jobs[i].OrderId, "_blank", jobContainer.contentContainer);
            if(jobs[i].ProofFileName != "") {
                  createLink("display: block; float: left; width: 45%; background-color: " + COLOUR.Blue + "; color:white;min-height: 35px; margin: 10px; border:4px solid " + COLOUR.Blue + ";cursor: pointer;", "proof", "../../ShowImage.aspx?LoadLocalProof=proof_" + jobs[i].OrderId + "_" + jobs[i].Id + "_0.pdf", "_blank", jobContainer.contentContainer);
            }

      }
      for(let i = 0; i < jobs.length; i++) {
            var c = await getOrderData(jobs[i].OrderId, jobs[i].AccountId);
            console.log(c);
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