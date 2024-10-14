(function() {
      'use strict';
})();

window.addEventListener("load", async (event) => {
      new OrderHome();
});


class OrderHome {

      #emailTemplate_OrderAcknowledgement;

      constructor() {
            this.Start();
      }

      async Start() {
            this.InitEmailTemplates();
            this.InitEvents();
      }

      InitEmailTemplates() {
            this.#emailTemplate_OrderAcknowledgement = GM_getResourceText("EmailTemplate_OrderAcknowledgement");
            console.log(this.#emailTemplate_OrderAcknowledgement);
      }

      InitEvents() {
            console.log("in init events");
            let emailEstimateBtn = document.getElementById("hlEmailInvoiceOrEstimate");
            emailEstimateBtn.addEventListener("click", () => {
                  this.OnEstimateBtnClicked();
            });
      }

      OnEstimateBtnClicked() {
            console.log("onEstimateBtnClicked");



            let overlayF = setInterval(function() {
                  console.log("in timeout");
                  if(document.getElementById("simplemodal-overlay")) {
                        let overlay = document.getElementById("simplemodal-overlay");
                        let contentArea = document.getElementsByClassName("trumbowyg-editor notranslate")[0];

                        let overlayContainer = document.createElement("div");
                        overlayContainer.style = "position:absolute;top:200px;left:0;width:200px;height:500px;background-color:white;display:block;z-index: 2010 !important;";

                        let button1 = createButton("Order Acknowledgement", "width:calc(100% - 16px);", (e) => {
                              e.preventDefault();
                              contentArea.innerHTML = "Hi";
                        }, overlayContainer);

                        insertAfter(overlayContainer, overlay);

                        clearInterval(overlayF);
                  }
            }, 100);


      }
}