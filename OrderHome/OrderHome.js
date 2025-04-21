(function() {
      'use strict';
})();

window.addEventListener("load", async (event) => {
      new OrderHome();
});


class OrderHome {

      #emailTemplateContainer;
      #emailTemplate_QuoteWording;
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
            this.#emailTemplate_QuoteWording = GM_getResourceText("EmailTemplate_QuoteWording");
            this.#emailTemplate_OrderAcknowledgement = GM_getResourceText("EmailTemplate_OrderAcknowledgementWording");
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
                        let overlayContainer = document.getElementById("simplemodal-container");
                        let overlay = document.getElementById("simplemodal-overlay");
                        let overlayBounding = overlayContainer.getBoundingClientRect();
                        console.log(overlayBounding);
                        let contentArea = document.getElementsByClassName("trumbowyg-editor notranslate")[0];
                        let customerFullName = document.querySelectorAll(".eItem")[0].childNodes[0];
                        let customerFirstName = customerFullName.nodeValue.split(" ")[0];

                        this.#emailTemplateContainer = document.createElement("div");
                        this.#emailTemplateContainer.style = "position:absolute;top:" + overlayBounding.top + "px;left:" + (overlayBounding.left - 250) + "px;width:200px;height:" + overlayBounding.height + "px;background-color:white;display:block;z-index: 2010 !important;";

                        createButton("Quote Wording", "width:calc(100% - 20px);", (e) => {
                              e.preventDefault();

                              this.#emailTemplate_QuoteWording = this.#emailTemplate_QuoteWording.replaceAll("<%CustomerName%>", customerFirstName);

                              contentArea.innerHTML = this.#emailTemplate_QuoteWording;
                        }, this.#emailTemplateContainer);

                        createButton("Order Acknowledgement", "width:calc(100% - 20px);", (e) => {
                              e.preventDefault();

                              this.#emailTemplate_OrderAcknowledgement = this.#emailTemplate_OrderAcknowledgement.replaceAll("<%CustomerName%>", customerFirstName);

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