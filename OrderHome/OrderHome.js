(function () {
      'use strict';
})();

window.addEventListener("load", () => new OrderHome());

class OrderHome {
      #emailTemplateContainer;
      #emailModalIsOpen = false;
      #templateBaseUrl;
      #templateDefinitions = [
            { key: "QuoteWording", label: "Quote Wording", file: "QuoteWording.txt" },
            { key: "OrderAcknowledgement", label: "Order Acknowledgement", file: "OrderAcknowledgementWording.txt" },
            { key: "OrderDepositRequest", label: "Deposit Request", file: "OrderDepositRequestWording.txt" },
            { key: "OrderDepositPaidThanks", label: "Deposit Paid Thanks", file: "OrderDepositPaidThanks.txt" },
            { key: "OrderFinalPaymentRequest", label: "Final Payment Request", file: "OrderFinalPaymentRequest.txt" }
      ];
      #emailTemplates = {};
      #attachmentsLoaded = false;
      #defaultAttachmentFiles = ["OrderDepositPaidThanks.txt", "OrderFinalPaymentRequest.txt"];
      #defaultAttachmentBaseUrl = "https://raw.githubusercontent.com/Monshi10x/TamperScript/main/OrderHome/EmailTemplates/";

      constructor() {
            const defaultTemplateBaseUrl = "https://raw.githubusercontent.com/Monshi10x/TamperScript/main/OrderHome/EmailTemplates/";
            this.#templateBaseUrl = window.ORDER_HOME_TEMPLATE_BASE_URL
                  || defaultTemplateBaseUrl;

            this.start();
            setInterval(() => this.tick(), 100);
      }

      async start() {
            await this.fetchEmailTemplates();
            this.initPaymentModal();
      }

      tick() {
            this.tickEmailModal();
      }

      async fetchEmailTemplates() {
            await Promise.all(this.#templateDefinitions.map(async (template) => {
                  try {
                        const response = await fetch(`${this.#templateBaseUrl}${template.file}`);
                        if (!response.ok) {
                              throw new Error(`Failed to load ${template.file}`);
                        }
                        const content = await response.text();
                        this.#emailTemplates[template.key] = content;
                  } catch (error) {
                        console.error("OrderHome template load error:", error);
                        this.#emailTemplates[template.key] = "";
                  }
            }));
      }

      tickEmailModal() {
            const overlayContainer = document.getElementById("simplemodal-container");
            const overlay = document.getElementById("simplemodal-overlay");

            if (overlayContainer && overlay) {
                  if (!this.#emailModalIsOpen) {
                        this.#emailModalIsOpen = true;
                        this.renderTemplatePanel(overlayContainer);
                  }
            } else {
                  this.#emailModalIsOpen = false;
                  if (this.#emailTemplateContainer) {
                        deleteElement(this.#emailTemplateContainer);
                        this.#emailTemplateContainer = null;
                  }
            }
      }

      renderTemplatePanel(overlayContainer) {
            const contentArea = document.querySelector(".trumbowyg-editor.notranslate");
            const customerFullNameNode = document.querySelectorAll(".eItem")?.[0]?.childNodes?.[0];

            if (!contentArea || !customerFullNameNode) {
                  return;
            }

            const customerFirstName = customerFullNameNode.nodeValue.split(" ")[0];

            if (getComputedStyle(overlayContainer).position === "static") {
                  overlayContainer.style.position = "relative";
            }

            this.#emailTemplateContainer = document.createElement("div");
            this.#emailTemplateContainer.id = "order-home-template-panel";
            this.#emailTemplateContainer.style = [
                  "position:absolute",
                  "top:0",
                  "right:-260px",
                  "width:240px",
                  "height:100%",
                  "background-color:#111827",
                  "color:#e5e7eb",
                  "display:flex",
                  "flex-direction:column",
                  "gap:12px",
                  "padding:12px",
                  "box-shadow:0 10px 30px rgba(0,0,0,0.35)",
                  "border-radius:8px",
                  "z-index:2010"
            ].join(";");

            const header = document.createElement("div");
            header.innerText = "Email Templates";
            header.style.fontWeight = "700";
            header.style.fontSize = "16px";
            header.style.letterSpacing = "0.2px";

            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.flexDirection = "column";
            buttonContainer.style.gap = "8px";

            this.#templateDefinitions.forEach((template) => {
                  this.createTemplateButton(template, customerFirstName, contentArea, buttonContainer);
            });

            const effectsContainer = this.buildTextEffects(contentArea);

            this.#emailTemplateContainer.appendChild(header);
            this.#emailTemplateContainer.appendChild(buttonContainer);
            this.#emailTemplateContainer.appendChild(effectsContainer);

            overlayContainer.appendChild(this.#emailTemplateContainer);

            this.ensureDefaultAttachments();
      }

      createTemplateButton(template, customerFirstName, contentArea, parent) {
            createButton(template.label, "width:calc(100% - 20px);", (e) => {
                  e.preventDefault();

                  const templateContent = this.#emailTemplates[template.key];
                  if (!templateContent) {
                        return;
                  }

                  const personalizedContent = templateContent.replaceAll("<%CustomerName%>", customerFirstName);
                  contentArea.innerHTML = personalizedContent;
            }, parent);
      }

      buildTextEffects(contentArea) {
            const effectsContainer = document.createElement("div");
            effectsContainer.style.display = "flex";
            effectsContainer.style.flexDirection = "column";
            effectsContainer.style.gap = "6px";
            effectsContainer.style.borderTop = "1px solid #1f2937";
            effectsContainer.style.paddingTop = "10px";

            const title = document.createElement("div");
            title.innerText = "Text Effects";
            title.style.fontWeight = "600";
            title.style.fontSize = "14px";
            effectsContainer.appendChild(title);

            const textColorRow = this.createEffectRow("Text Colour", (color) => {
                  this.applyStyleToSelection(contentArea, { color });
            });
            const highlightRow = this.createEffectRow("Highlight", (color) => {
                  this.applyStyleToSelection(contentArea, { backgroundColor: color });
            });

            effectsContainer.appendChild(textColorRow);
            effectsContainer.appendChild(highlightRow);

            return effectsContainer;
      }

      createEffectRow(labelText, applyCallback) {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.justifyContent = "space-between";
            row.style.gap = "8px";

            const label = document.createElement("span");
            label.innerText = labelText;
            label.style.fontSize = "12px";
            label.style.flex = "1";

            const input = document.createElement("input");
            input.type = "color";
            input.value = "#fbbf24";
            input.style.flex = "0 0 40px";
            input.style.border = "1px solid #1f2937";
            input.style.backgroundColor = "#0f172a";

            const applyButton = document.createElement("button");
            applyButton.innerText = "Apply";
            applyButton.style.flex = "0 0 60px";
            applyButton.style.backgroundColor = "#2563eb";
            applyButton.style.color = "#e5e7eb";
            applyButton.style.border = "none";
            applyButton.style.padding = "6px";
            applyButton.style.borderRadius = "4px";
            applyButton.style.cursor = "pointer";
            applyButton.addEventListener("click", (e) => {
                  e.preventDefault();
                  applyCallback(input.value);
            });

            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(applyButton);

            return row;
      }

      applyStyleToSelection(contentArea, styleOptions = {}) {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
                  return;
            }

            const range = selection.getRangeAt(0);
            if (!contentArea.contains(range.commonAncestorContainer)) {
                  return;
            }

            const span = document.createElement("span");
            Object.assign(span.style, styleOptions);

            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
            selection.removeAllRanges();
            selection.selectAllChildren(span);
      }

      initPaymentModal() {
            const lastFourInput = document.querySelector("#txtOfflineCcLast4Digits");
            if (lastFourInput) {
                  lastFourInput.value = "0000";
            }
      }

      async ensureDefaultAttachments() {
            if (this.#attachmentsLoaded || typeof cbEmailAttachment === "undefined") {
                  return;
            }

            this.#attachmentsLoaded = true;
            this.patchAttachmentHandling();

            const attachmentFiles = window.ORDER_HOME_ATTACHMENT_FILES || this.#defaultAttachmentFiles;
            const attachmentBaseUrl = window.ORDER_HOME_ATTACHMENT_BASE_URL || this.#defaultAttachmentBaseUrl;

            await Promise.all(attachmentFiles.map(async (fileName, index) => {
                  try {
                        const response = await fetch(`${attachmentBaseUrl}${fileName}`);
                        if (!response.ok) {
                              throw new Error(`Failed to load attachment ${fileName}`);
                        }
                        const blob = await response.blob();
                        this.addRemoteAttachment(fileName, blob, index);
                  } catch (error) {
                        console.error("OrderHome attachment load error:", error);
                  }
            }));
      }

      patchAttachmentHandling() {
            if (!cbEmailAttachment.remoteAttachments) {
                  cbEmailAttachment.remoteAttachments = [];
            }

            if (!cbEmailAttachment._originalGetAttachments) {
                  cbEmailAttachment._originalGetAttachments = cbEmailAttachment.GetAttachments.bind(cbEmailAttachment);
                  cbEmailAttachment.GetAttachments = function () {
                        const existing = cbEmailAttachment._originalGetAttachments();
                        const formData = existing || new FormData();

                        cbEmailAttachment.remoteAttachments.forEach((attachment, idx) => {
                              formData.append(`remote_file_${idx}`, attachment.blob, attachment.name);
                        });

                        if (!existing && cbEmailAttachment.remoteAttachments.length === 0) {
                              return null;
                        }

                        return formData;
                  };
            }
      }

      addRemoteAttachment(name, blob, index) {
            if (!cbEmailAttachment.remoteAttachments) {
                  cbEmailAttachment.remoteAttachments = [];
            }

            cbEmailAttachment.remoteAttachments.push({ name, blob });
            cbEmailAttachment.attachmentSize = (cbEmailAttachment.attachmentSize || 0) + blob.size;

            const attachmentsContainer = document.getElementById("divClientEmailAttachments");
            if (!attachmentsContainer) {
                  return;
            }

            const wrapper = document.createElement("div");
            wrapper.className = "eItem";
            wrapper.id = `docsObjId_remote_${index}`;

            const nameSpan = document.createElement("span");
            nameSpan.className = "attachName";
            nameSpan.innerText = name;

            const removeSpan = document.createElement("span");
            removeSpan.className = "eClose";
            removeSpan.title = "Remove";
            removeSpan.innerHTML = "&times;";
            removeSpan.addEventListener("click", () => {
                  cbEmailAttachment.remoteAttachments = cbEmailAttachment.remoteAttachments.filter((item) => item.name !== name);
                  cbEmailAttachment.attachmentSize = Math.max(0, (cbEmailAttachment.attachmentSize || 0) - blob.size);
                  wrapper.remove();
            });

            wrapper.appendChild(nameSpan);
            wrapper.appendChild(removeSpan);
            attachmentsContainer.appendChild(wrapper);
      }
}
