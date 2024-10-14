(function() {
      'use strict';
})();

window.addEventListener("load", async (event) => {
      new OrderHome();
});


class OrderHome {

      #emailTemplateContainer;
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
      }

      InitEvents() {
            console.log("in init events");
            let emailBtn = document.getElementById("hlEmailInvoiceOrEstimate");
            emailBtn.addEventListener("click", () => {
                  this.OnEmailBtnClicked();
            });

            let sendBtn = document.getElementById("btnClientEmailFormOne");
            sendBtn.addEventListener("click", () => {
                  this.OnSendBtnClicked();
            });
      }

      OnEmailBtnClicked() {
            console.log("OnEmailBtnClicked");


            let self = this;
            let overlayF = setInterval(function() {
                  console.log("in timeout");
                  if(document.getElementById("simplemodal-overlay")) {
                        let overlay = document.getElementById("simplemodal-overlay");
                        let contentArea = document.getElementsByClassName("trumbowyg-editor notranslate")[0];

                        self.#emailTemplateContainer = document.createElement("div");
                        self.#emailTemplateContainer.style = "position:absolute;top:200px;left:0;width:200px;height:500px;background-color:white;display:block;z-index: 2010 !important;";

                        let orderAcknowledgementBtn = createButton("Order Acknowledgement", "width:calc(100% - 20px);", (e) => {
                              e.preventDefault();
                              contentArea.innerHTML = self.#emailTemplate_OrderAcknowledgement;
                        }, self.#emailTemplateContainer);

                        insertAfter(self.#emailTemplateContainer, overlay);

                        clearInterval(overlayF);
                  }
            }, 100);
      }

      OnSendBtnClicked() {
            deleteElement(this.#emailTemplateContainer);
      }
}