(function() {
      'use strict';
})();

window.addEventListener("load", async (event) => {
      new OrderHome();
});


class OrderHome {

      #emailTemplateContainer;
      #emailTemplate_OrderAcknowledgement;
      #emailModalIsOpen = false;

      constructor() {
            this.Start();

            setInterval(() => {this.Tick();}, 100);
      }

      async Start() {
            this.FetchEmailTemplates();
            this.InitEvents();
            this.InitPaymentModal();
      }

      Tick() {
            this.TickEmailModal();
      }

      FetchEmailTemplates() {
            this.#emailTemplate_OrderAcknowledgement = GM_getResourceText("EmailTemplate_OrderAcknowledgement");
      }

      InitEvents() {
            console.log("in init events");
            /*let emailBtn = document.getElementById("hlEmailInvoiceOrEstimate");
            emailBtn.addEventListener("click", () => {
                  this.OnEmailBtnClicked();
            });*/

            /*let sendBtn = document.getElementById("btnClientEmailFormOne");
            sendBtn.addEventListener("click", () => {
                  this.OnSendBtnClicked();
            });*/
      }

      TickEmailModal() {
            if(document.getElementById("simplemodal-overlay")) {
                  if(this.#emailModalIsOpen == false) {
                        let overlay = document.getElementById("simplemodal-overlay");
                        let contentArea = document.getElementsByClassName("trumbowyg-editor notranslate")[0];
                        let customerFullName = document.querySelectorAll(".eItem")[0].childNodes[0];
                        let customerFirstName = customerFullName.split(" ")[0];

                        this.#emailTemplateContainer = document.createElement("div");
                        this.#emailTemplateContainer.style = "position:absolute;top:200px;left:0;width:200px;height:500px;background-color:white;display:block;z-index: 2010 !important;";

                        let orderAcknowledgementBtn = createButton("Order Acknowledgement", "width:calc(100% - 20px);", (e) => {
                              e.preventDefault();
                              this.#emailTemplate_OrderAcknowledgement.replace("<%CustomerName%>", customerFirstName);

                              contentArea.innerHTML = this.#emailTemplate_OrderAcknowledgement;
                        }, this.#emailTemplateContainer);

                        insertAfter(this.#emailTemplateContainer, overlay);
                  }

                  this.#emailModalIsOpen = true;
            } else {
                  this.#emailModalIsOpen = false;

                  if(this.#emailTemplateContainer != null) {
                        deleteElement(this.#emailTemplateContainer);
                        this.#emailTemplateContainer == null;
                  }
            }
      }

      InitPaymentModal() {
            document.querySelector("#txtOfflineCcLast4Digits").value = "0000";
      }
}