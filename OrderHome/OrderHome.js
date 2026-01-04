(function() {
      'use strict';
})();

window.addEventListener("load", () => new OrderHome());

class OrderHome {
      githubBranch = "main";
      //known static info:
      //BSB: 014-218
      //Account: 3064-70312
      //Account Name: The Trustee for Cargill Investment Trust
      //Payment Reference: <span id="quote-number">#QT-1000</span> 
      //CardSurcharge 2.5%
      //Quote or invoice number - get from span with id = 'lblOrderNumber'

      #emailTemplateContainer;
      #emailModalIsOpen = false;
      #templateBaseUrl;
      #templateDefinitions = [
            {key: "QuoteWording", label: "Quote Wording", file: "QuoteWording.txt"},
            {key: "OrderAcknowledgement", label: "Order Acknowledgement", file: "OrderAcknowledgementWording.txt"},
            {key: "OrderDepositRequest", label: "Deposit Request", file: "OrderDepositRequestWording.txt"},
            {key: "OrderDepositPaidThanks", label: "Deposit Paid Thanks", file: "OrderDepositPaidThanks.txt"},
            {key: "PaymentDue", label: "Payment Due", file: "PaymentDue.txt"},
            {key: "OrderFinalPaymentRequest", label: "Final Payment Request", file: "OrderFinalPaymentRequest.txt"}
      ];
      #emailTemplates = {};
      #userInfo = null;
      #attachmentCache = new Map();
      #defaultAttachmentFiles = ["Capabilities One Page 3D CUT LETTERS V2 (E).pdf"];
      #defaultAttachmentBaseUrl = "https://raw.githubusercontent.com/Monshi10x/TamperScript/" + this.githubBranch + "/OrderHome/EmailAttachments/";

      constructor() {
            const defaultTemplateBaseUrl = "https://raw.githubusercontent.com/Monshi10x/TamperScript/" + this.githubBranch + "/OrderHome/EmailTemplates/";
            this.#templateBaseUrl = window.ORDER_HOME_TEMPLATE_BASE_URL
                  || defaultTemplateBaseUrl;

            this.start();
            setInterval(() => this.tick(), 100);
      }

      async start() {
            await Promise.all([this.fetchEmailTemplates(), this.fetchCurrentUser()]);
            this.initPaymentModal();
      }

      tick() {
            this.tickEmailModal();
      }

      async fetchEmailTemplates() {
            await Promise.all(this.#templateDefinitions.map(async (template) => {
                  try {
                        const response = await fetch(`${this.#templateBaseUrl}${template.file}`);
                        if(!response.ok) {
                              throw new Error(`Failed to load ${template.file}`);
                        }
                        const content = await response.text();
                        this.#emailTemplates[template.key] = content;
                  } catch(error) {
                        console.error("OrderHome template load error:", error);
                        this.#emailTemplates[template.key] = "";
                  }
            }));
      }

      async fetchCurrentUser() {
            try {
                  const response = await fetch("https://sar10686.corebridge.net/Api/OrderEntryProducts/GetProductMultiQuantitiesCheck?orderProductIds=0", {
                        method: "GET",
                        credentials: "include",
                        mode: "cors",
                        headers: {
                              "accept": "*/*",
                              "accept-language": "en-US,en;q=0.9",
                              "content-type": "application/json; charset=utf-8",
                              "x-requested-with": "XMLHttpRequest"
                        },
                        referrer: "https://sar10686.corebridge.net/SalesModule/Estimates/QuickPrice.aspx"
                  });

                  if(!response.ok) {
                        throw new Error(`HTTP ${response.status} – ${response.statusText}`);
                  }

                  const data = await response.json();
                  const user = data?.RelatedProperties?.User;
                  if(user) {
                        this.#userInfo = {
                              firstName: user.FirstName || "",
                              lastName: user.LastName || "",
                              email: user.EmailAddress || "",
                              phone: user.CellPhoneNumber || user.WorkPhoneNumber || user.HomePhoneNumber || ""
                        };
                        console.log("OrderHome salesperson info:", {
                              name: `${this.#userInfo.firstName} ${this.#userInfo.lastName}`.trim(),
                              phone: this.#userInfo.phone,
                              email: this.#userInfo.email
                        });
                  }
            } catch(error) {
                  console.error("OrderHome user fetch error:", error);
                  this.#userInfo = null;
            }
      }

      tickEmailModal() {
            const overlayContainer = document.getElementById("simplemodal-container");
            const overlay = document.getElementById("simplemodal-overlay");

            if(overlayContainer && overlay) {
                  if(!this.#emailModalIsOpen) {
                        this.#emailModalIsOpen = true;
                        this.renderTemplatePanel(overlayContainer);
                  }
            } else {
                  this.#emailModalIsOpen = false;
                  if(this.#emailTemplateContainer) {
                        deleteElement(this.#emailTemplateContainer);
                        this.#emailTemplateContainer = null;
                  }
            }
      }

      renderTemplatePanel(overlayContainer) {
            const contentArea = document.querySelector(".trumbowyg-editor.notranslate");
            const customerFullNameNode = document.querySelectorAll(".eItem")?.[0]?.childNodes?.[0];
            const quoteNumber = document.querySelector("#lblOrderNumber").textContent;

            if(!contentArea || !customerFullNameNode) {
                  return;
            }

            const customerFirstName = customerFullNameNode.nodeValue.split(" ")[0];

            if(getComputedStyle(overlayContainer).position === "static") {
                  overlayContainer.style.position = "relative";
            }

            this.#emailTemplateContainer = document.createElement("div");
            this.#emailTemplateContainer.id = "order-home-template-panel";
            this.#emailTemplateContainer.style = [
                  "position:absolute",
                  "top:0",
                  "right:-325px",
                  "width:300px",
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
            buttonContainer.style.maxHeight = "300px";
            buttonContainer.style.overflowY = "auto";

            this.#templateDefinitions.forEach((template) => {
                  this.createTemplateButton(template, customerFirstName, quoteNumber, contentArea, buttonContainer);
            });

            const effectsContainer = this.buildTextEffects(contentArea);
            const attachmentsContainer = this.buildAttachmentSelector();

            this.#emailTemplateContainer.appendChild(header);
            this.#emailTemplateContainer.appendChild(buttonContainer);
            this.#emailTemplateContainer.appendChild(effectsContainer);
            this.#emailTemplateContainer.appendChild(attachmentsContainer);

            overlayContainer.appendChild(this.#emailTemplateContainer);

            this.ensureDefaultAttachments();
      }

      createTemplateButton(template, customerFirstName, quoteNumber, contentArea, parent) {
            createButton(template.label, "width:calc(100% - 20px);", (e) => {
                  e.preventDefault();

                  const templateContent = this.#emailTemplates[template.key];
                  if(!templateContent) {
                        return;
                  }

                  const personalizedContent = this.personalizeTemplate(templateContent, customerFirstName, quoteNumber);
                  contentArea.innerHTML = personalizedContent;

                  // Trigger a synthetic keyup event because it wasn't saving
                  const event = new KeyboardEvent('keyup', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                  });
                  contentArea.focus();
                  contentArea.dispatchEvent(event);
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
                  this.applyStyleToSelection(contentArea, {color});
            });
            const highlightRow = this.createEffectRow("Highlight", (color) => {
                  this.applyStyleToSelection(contentArea, {backgroundColor: color});
            });

            effectsContainer.appendChild(textColorRow);
            effectsContainer.appendChild(highlightRow);

            const importantButton = document.createElement("button");
            importantButton.innerText = "Important";
            importantButton.style.backgroundColor = "#dc2626";
            importantButton.style.color = "#fef2f2";
            importantButton.style.border = "none";
            importantButton.style.padding = "8px";
            importantButton.style.borderRadius = "4px";
            importantButton.style.cursor = "pointer";
            importantButton.style.fontWeight = "700";
            importantButton.addEventListener("click", (e) => {
                  e.preventDefault();
                  this.applyStyleToSelection(contentArea, {color: "#dc2626", fontWeight: "700"});
            });
            effectsContainer.appendChild(importantButton);

            return effectsContainer;
      }

      buildAttachmentSelector() {
            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.gap = "6px";
            wrapper.style.borderTop = "1px solid #1f2937";
            wrapper.style.paddingTop = "10px";

            const header = document.createElement("div");
            header.innerText = "Attachments";
            header.style.fontWeight = "600";
            header.style.fontSize = "14px";

            const selectContainer = document.createElement("div");
            selectContainer.style.display = "flex";
            selectContainer.style.flexDirection = "column";
            selectContainer.style.gap = "4px";

            const attachmentFiles = window.ORDER_HOME_ATTACHMENT_FILES || this.#defaultAttachmentFiles;
            attachmentFiles.forEach((fileName) => {
                  const row = document.createElement("label");
                  row.style.display = "flex";
                  row.style.alignItems = "center";
                  row.style.gap = "8px";
                  row.style.cursor = "pointer";

                  const checkbox = document.createElement("input");
                  checkbox.type = "checkbox";
                  checkbox.checked = true;
                  checkbox.dataset.attachmentName = fileName;
                  checkbox.addEventListener("change", async (e) => {
                        const shouldInclude = e.target.checked;
                        await this.toggleRemoteAttachment(fileName, shouldInclude);
                  });

                  const text = document.createElement("span");
                  text.innerText = fileName;
                  text.style.fontSize = "12px";

                  row.appendChild(checkbox);
                  row.appendChild(text);
                  selectContainer.appendChild(row);
            });

            wrapper.appendChild(header);
            wrapper.appendChild(selectContainer);
            return wrapper;
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
            if(!selection || selection.rangeCount === 0 || selection.isCollapsed) {
                  return;
            }

            const range = selection.getRangeAt(0);
            if(!contentArea.contains(range.commonAncestorContainer)) {
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

      buildSignature(fullName, phone, email) {
            const lines = [];
            if(fullName) lines.push(fullName);
            if(phone) lines.push(`Mobile: ${phone}`);
            if(email) lines.push(`Email: ${email}`);
            return lines.join("\n");
      }

      parseCurrencyValue(raw) {
            if(raw === null || raw === undefined) {
                  return null;
            }

            const numeric = parseFloat(String(raw).replace(/[^0-9.-]+/g, ""));
            return Number.isFinite(numeric) ? Math.round(numeric * 100) / 100 : null;
      }

      getCurrencyFromSelector(selector) {
            const node = document.querySelector(selector);
            if(!node) {
                  return null;
            }

            const rawValue = (node.value ?? node.textContent ?? node.innerText ?? "").trim();
            return this.parseCurrencyValue(rawValue);
      }

      formatCurrency(amount) {
            if(typeof amount !== "number" || Number.isNaN(amount)) {
                  return "";
            }

            return new Intl.NumberFormat("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(amount);
      }

      getAmountFromSelectors(selectors, {allowZero = false} = {}) {
            for(const selector of selectors) {
                  const amount = this.getCurrencyFromSelector(selector);
                  if(amount === null) {
                        continue;
                  }

                  if(amount > 0 || (allowZero && amount === 0)) {
                        return amount;
                  }
            }

            return null;
      }

      calculateAmountDue() {
            const preferredSelectors = ["#BalanceDueLabel", "#lblAmountDue"];
            const preferredAmount = this.getAmountFromSelectors(preferredSelectors);
            if(preferredAmount !== null) {
                  return preferredAmount;
            }

            const totalPaidSelectors = ["#TotalPayedLabel", "#lblTotalPaid", "#hfTotalPaid", "#lblTotalPayments", "#lblTotalPaymentsAmount", "#lblTotalPaidAmount", "#lblTotalPaidValue", "#lblPaymentsToDate", "#tbTotalPaid", "#hfTotalPaidAmount"];
            const totalPaid = this.getAmountFromSelectors(totalPaidSelectors, {allowZero: true});

            const orderTotalSelectors = ["#lblTotalAmount", "#lblTotal", "#lblOrderTotal", "#lblTotalWithTax", "#lblEstimateTotal", "#lblGrandTotal", "#hfOrderTotal", "#hfOrderAmount"];
            const orderTotal = this.getAmountFromSelectors(orderTotalSelectors);

            if(orderTotal !== null) {
                  if(orderTotal < 600) {
                        return orderTotal;
                  }

                  if(totalPaid === 0 || totalPaid === null) {
                        const downPayment = this.getAmountFromSelectors(["#DownpaymentDueValue"]);
                        return downPayment !== null ? downPayment : orderTotal * 0.5;
                  }

                  const paidAmount = totalPaid ?? 0;
                  return Math.max(orderTotal - paidAmount, 0);
            }

            const downPaymentFallback = this.getAmountFromSelectors(["#DownpaymentDueValue", "#tbPaymentAmount", "#txtTotalPaymentAmount"]);
            if(downPaymentFallback !== null) {
                  return downPaymentFallback;
            }

            return null;
      }

      buildPaymentReference(quoteNumber) {
            if(!quoteNumber) {
                  return "";
            }

            const trimmed = quoteNumber.trim();
            return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      }

      personalizeTemplate(templateContent, customerFirstName, quoteNumber) {
            const userName = `${this.#userInfo?.firstName || ""} ${this.#userInfo?.lastName || ""}`.trim();
            const userPhone = this.#userInfo?.phone || "";
            const userEmail = this.#userInfo?.email || "";

            const safeQuoteNumber = quoteNumber || "";
            const paymentReference = this.buildPaymentReference(safeQuoteNumber);
            const amountDue = this.calculateAmountDue();
            const staticPaymentDetails = {
                  accountName: "The Trustee for Cargill Investment Trust",
                  bsb: "014-218",
                  accountNumber: "3064-70312",
                  cardSurcharge: "2.5"
            };

            let content = templateContent.replaceAll("<%CustomerName%>", customerFirstName);
            content = content.replaceAll("<%QuoteNumber%>", safeQuoteNumber);
            content = content.replaceAll("<%SalesPersonName%>", userName);
            content = content.replaceAll("<%SalesPersonPhone%>", userPhone);
            content = content.replaceAll("<%SalesPersonEmail%>", userEmail);
            content = content.replaceAll("{%InvoiceOrQuoteNumber%}", paymentReference || safeQuoteNumber);
            content = content.replaceAll("{%AmountDue%}", this.formatCurrency(amountDue));
            content = content.replaceAll("{%AccountName%}", staticPaymentDetails.accountName);
            content = content.replaceAll("{%BSB%}", staticPaymentDetails.bsb);
            content = content.replaceAll("{%AccountNumber%}", staticPaymentDetails.accountNumber);
            content = content.replaceAll("{%Reference%}", paymentReference);
            content = content.replaceAll("{%CardSurcharge%}", staticPaymentDetails.cardSurcharge);

            // Allow swapping by tag ids in the template HTML
            const container = document.createElement("div");
            container.innerHTML = content;

            const replacements = [
                  {selector: "#quote-number", value: paymentReference || safeQuoteNumber},
                  {selector: "#customer-name", value: customerFirstName},
                  {selector: "#salesperson-name", value: userName},
                  {selector: "#salesperson-phone", value: "M: " + userPhone},
                  {selector: "#salesperson-email", value: "E: " + userEmail}
            ];

            replacements.forEach(({selector, value}) => {
                  container.querySelectorAll(selector).forEach((node) => {
                        node.textContent = value;
                  });
            });

            return container.innerHTML;
      }

      initPaymentModal() {
            const lastFourInput = document.querySelector("#txtOfflineCcLast4Digits");
            if(lastFourInput) {
                  lastFourInput.value = "0000";
            }
      }

      async ensureDefaultAttachments() {
            if(typeof cbEmailAttachment === "undefined") {
                  return;
            }

            this.patchAttachmentHandling();

            const attachmentFiles = window.ORDER_HOME_ATTACHMENT_FILES || this.#defaultAttachmentFiles;
            const attachmentBaseUrl = window.ORDER_HOME_ATTACHMENT_BASE_URL || this.#defaultAttachmentBaseUrl;

            const existingRemote = Array.isArray(cbEmailAttachment.remoteAttachments) ? cbEmailAttachment.remoteAttachments : [];
            const missingFiles = attachmentFiles.filter((fileName) => !existingRemote.some((item) => item.name === fileName));

            if(missingFiles.length > 0) {
                  await Promise.all(missingFiles.map(async (fileName, index) => {
                        try {
                              const response = await fetch(`${attachmentBaseUrl}${fileName}`);
                              if(!response.ok) {
                                    throw new Error(`Failed to load attachment ${fileName}`);
                              }
                              const blob = await response.blob();
                              this.#attachmentCache.set(fileName, {blob, size: blob.size});
                              this.addRemoteAttachment(fileName, blob);
                        } catch(error) {
                              console.error("OrderHome attachment load error:", error);
                        }
                  }));
            }

            this.renderRemoteAttachments();
      }

      patchAttachmentHandling() {
            if(typeof cbEmailAttachment !== "object" || typeof cbEmailAttachment.GetAttachments !== "function") {
                  return;
            }

            const attachmentManager = cbEmailAttachment;
            if(!Array.isArray(attachmentManager.remoteAttachments)) {
                  attachmentManager.remoteAttachments = [];
            }

            if(attachmentManager._remotePatched) {
                  return;
            }

            attachmentManager._remotePatched = true;
            attachmentManager._originalGetAttachments = attachmentManager.GetAttachments.bind(attachmentManager);

            attachmentManager.GetAttachments = function() {
                  try {
                        const existing = attachmentManager._originalGetAttachments();
                        const formData = existing || new FormData();

                        attachmentManager.remoteAttachments.forEach((attachment, idx) => {
                              if(attachment?.blob && attachment?.name) {
                                    formData.append(`remote_file_${idx}`, attachment.blob, attachment.name);
                              }
                        });

                        if(existing === null && attachmentManager.remoteAttachments.length === 0) {
                              return null;
                        }

                        return formData;
                  } catch(error) {
                        console.error("OrderHome attachment pipeline error:", error);
                        return null;
                  }
            };
      }

      addRemoteAttachment(name, blob, index) {
            if(!cbEmailAttachment.remoteAttachments) {
                  cbEmailAttachment.remoteAttachments = [];
            }

            const size = blob?.size || 0;
            const existing = cbEmailAttachment.remoteAttachments.find((item) => item.name === name);
            if(!existing) {
                  cbEmailAttachment.remoteAttachments.push({name, blob, size});
                  cbEmailAttachment.attachmentSize = (cbEmailAttachment.attachmentSize || 0) + size;
            }

            this.renderRemoteAttachments();
      }

      async toggleRemoteAttachment(name, shouldInclude) {
            if(shouldInclude) {
                  const cached = this.#attachmentCache.get(name);
                  if(cached?.blob) {
                        this.addRemoteAttachment(name, cached.blob);
                        return;
                  }

                  const existing = cbEmailAttachment.remoteAttachments?.find((item) => item.name === name && item.blob);
                  if(existing?.blob) {
                        this.addRemoteAttachment(name, existing.blob);
                        return;
                  }

                  const attachmentBaseUrl = window.ORDER_HOME_ATTACHMENT_BASE_URL || this.#defaultAttachmentBaseUrl;
                  try {
                        const response = await fetch(`${attachmentBaseUrl}${name}`);
                        if(!response.ok) {
                              throw new Error(`Failed to load attachment ${name}`);
                        }
                        const fetchedBlob = await response.blob();
                        this.#attachmentCache.set(name, {blob: fetchedBlob, size: fetchedBlob.size});
                        this.addRemoteAttachment(name, fetchedBlob);
                  } catch(error) {
                        console.error("OrderHome attachment toggle error:", error);
                  }
            } else {
                  this.removeRemoteAttachment(name);
            }

            this.renderRemoteAttachments();
      }

      removeRemoteAttachment(name) {
            if(!Array.isArray(cbEmailAttachment.remoteAttachments)) {
                  return;
            }

            const target = cbEmailAttachment.remoteAttachments.find((item) => item.name === name);
            if(target) {
                  cbEmailAttachment.remoteAttachments = cbEmailAttachment.remoteAttachments.filter((item) => item.name !== name);
                  cbEmailAttachment.attachmentSize = Math.max(0, (cbEmailAttachment.attachmentSize || 0) - (target.size || 0));
            }

            const attachmentsContainer = document.getElementById("divClientEmailAttachments");
            const chip = attachmentsContainer?.querySelector(`.attachName[data-remote-name=\"${name}\"]`)?.parentElement;
            if(chip) {
                  chip.remove();
            }
      }

      renderRemoteAttachments() {
            const attachmentsContainer = document.getElementById("divClientEmailAttachments");
            if(!attachmentsContainer || !Array.isArray(cbEmailAttachment.remoteAttachments)) {
                  return;
            }

            const remoteNames = cbEmailAttachment.remoteAttachments.map((a) => a.name);
            attachmentsContainer.querySelectorAll(".attachName[data-remote-name]").forEach((node) => {
                  if(!remoteNames.includes(node.dataset.remoteName)) {
                        node.parentElement?.remove();
                  }
            });

            cbEmailAttachment.remoteAttachments.forEach((attachment, idx) => {
                  const alreadyRendered = attachmentsContainer.querySelector(`.attachName[data-remote-name=\"${attachment.name}\"]`);
                  if(alreadyRendered) {
                        return;
                  }

                  const wrapper = document.createElement("div");
                  wrapper.className = "eItem";
                  wrapper.id = `docsObjId_remote_${idx}`;

                  const nameSpan = document.createElement("span");
                  nameSpan.className = "attachName";
                  nameSpan.dataset.remoteName = attachment.name;
                  nameSpan.innerText = attachment.name;

                  const removeSpan = document.createElement("span");
                  removeSpan.className = "eClose";
                  removeSpan.title = "Remove";
                  removeSpan.innerHTML = "&times;";
                  removeSpan.addEventListener("click", () => {
                        cbEmailAttachment.remoteAttachments = cbEmailAttachment.remoteAttachments.filter((item) => item.name !== attachment.name);
                        cbEmailAttachment.attachmentSize = Math.max(0, (cbEmailAttachment.attachmentSize || 0) - (attachment.size || 0));
                        wrapper.remove();
                  });

                  wrapper.appendChild(nameSpan);
                  wrapper.appendChild(removeSpan);
                  attachmentsContainer.appendChild(wrapper);
            });
      }
}
