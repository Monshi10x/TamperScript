class CreditSurchargeMenu extends LHSMenuWindow {
      surchargePercentage = 2.5;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            var page = this.getPage(0);

            while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

            this.l_balanceDueIncGst = createInput_Infield("Balance Due (inc GST)", this.balanceDueIncGst, "width:200px;margin-left:100px", () => { }, page, false, null);
            setFieldDisabled(true, this.l_balanceDueIncGst[1], this.l_balanceDueIncGst[0]);

            this.price_incGst = createInput_Infield("Order Price (inc GST)", this.priceIncGst, "width:200px;margin-left:100px", () => { }, page, false, null);
            setFieldDisabled(true, this.price_incGst[1], this.price_incGst[0]);

            createText("", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page).innerHTML = "&#8681";

            this.priceExcludingPreviousSurcharges_incGst = createInput_Infield("Price Excluding Previous Surcharges (inc GST)", this.priceIncGst, "width:300px;margin-left:50px", () => { }, page, false, null);
            setFieldDisabled(true, this.priceExcludingPreviousSurcharges_incGst[1], this.priceExcludingPreviousSurcharges_incGst[0]);

            createText("", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page).innerHTML = "&#8681";

            this.percent_50_Ckb = createCheckbox_Infield("Take 50%", true, null, () => {this.fieldChangeUpdate();}, page);
            this.percent_100_Ckb = createCheckbox_Infield("Take 100%", false, null, () => {this.fieldChangeUpdate();}, page);
            this.percent_remaining_Ckb = createCheckbox_Infield("Take Remaining from Balance Due", false, null, () => {this.fieldChangeUpdate();}, page);
            this.percent_custom_Ckb = createCheckbox_Infield("Take Custom Amount", false, null, () => {
                  var show = this.percent_custom_Ckb[1].checked;
                  setFieldHidden(!show, this.customAmount[1], this.customAmount[0]);
                  this.fieldChangeUpdate();
            }, page);
            this.customAmount = createInput_Infield("Custom Amount", 0, "margin-left:50px;", () => {this.fieldChangeUpdate();}, page, false, 100);
            setFieldHidden(true, this.customAmount[1], this.customAmount[0]);

            checkboxesAddToSelectionGroup(true, this.percent_50_Ckb, this.percent_100_Ckb, this.percent_remaining_Ckb, this.percent_custom_Ckb);

            createText("", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page).innerHTML = "&#8681";

            this.adjustedAmount_IncGst = createInput_Infield("adjusted amount (inc GST)", this.adjustedAmountIncGst, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.adjustedAmount_IncGst[1], this.adjustedAmount_IncGst[0]);

            createText("X", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page);

            this.surchargePercentageField = createInput_Infield("Surcharge Percentage %", this.surchargePercentage, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.surchargePercentageField[1], this.surchargePercentageField[0]);

            createText("=", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page);

            this.creditSurcharge_IncGst = createInput_Infield("Credit Surcharge (inc GST)", this.creditSurchargeIncGst, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.creditSurcharge_IncGst[1], this.creditSurcharge_IncGst[0]);

            this.amountToTake_incGst = createInput_Infield("Amount To Take (inc GST)", this.amountToTakeIncGst, "width:200px;margin-left:100px;border:3px solid " + COLOUR.Blue + "", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.amountToTake_incGst[1], this.amountToTake_incGst[0]);

            this.note = createText("NOTE: Do not change product name", "width:95%;font-weight:bold;", page);

            this.createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.createProduct(this);});
            this.footer.appendChild(this.createProductBtn);
      }

      get balanceDueIncGst() {
            if(document.querySelector("#ord_prod_model_item_1") == null) return null;
            var product1 = ko.contextFor(document.querySelector("#ord_prod_model_item_1"));
            console.log(product1.$parent.balanceDueIncGst());
            return product1.$parent.balanceDueIncGst();
      }

      get priceIncGst() {
            return Math.round((totalOrderPriceIncGst) * 100) / 100;
      }

      get adjustedAmountIncGst() {
            if(this.percent_remaining_Ckb[1].checked) return zeroIfNaN(zeroIfNull(parseFloat(this.balanceDueIncGst)));
            if(this.percent_custom_Ckb[1].checked) return zeroIfNaN(zeroIfNull(parseFloat(this.customAmount[1].value)));
            if(this.percent_50_Ckb[1].checked) return this.priceExcludingPreviousSurchargesIncGst * 0.5;
            if(this.percent_100_Ckb[1].checked) return this.priceExcludingPreviousSurchargesIncGst * 1.0;
      }

      get creditSurchargeIncGst() {
            return parseFloat(this.adjustedAmountIncGst * (this.surchargePercentage / 100));
      }

      get amountToExcludeIncGst() {
            var productsWithName = getProductsWithName("Credit Card Surcharge - 2.5%");
            var amount = 0;
            for(var n = 0; n < productsWithName.length; n++) {
                  amount += getProductPrice(productsWithName[n]);
            }
            return amount;
      }

      get priceExcludingPreviousSurchargesIncGst() {
            return zeroIfNaN(zeroIfNull(parseFloat(this.priceExcludingPreviousSurcharges_incGst[1].value)));
      }

      get amountToTakeIncGst() {
            return roundNumber((this.adjustedAmountIncGst + this.creditSurchargeIncGst), 2);
      }

      show() {
            super.show();
            this.interval = setInterval(() => {this.tick();}, 1000 / 2);
      }

      hide() {
            super.hide();
            clearInterval(this.interval);
      }

      tick() {
            this.fieldChangeUpdate();
      }

      fieldChangeUpdate() {
            this.l_balanceDueIncGst[1].value = this.balanceDueIncGst;
            this.price_incGst[1].value = this.priceIncGst;
            this.adjustedAmount_IncGst[1].value = this.adjustedAmountIncGst;
            this.creditSurcharge_IncGst[1].value = this.creditSurchargeIncGst;
            this.priceExcludingPreviousSurcharges_incGst[1].value = this.priceIncGst - this.amountToExcludeIncGst;
            this.amountToTake_incGst[1].value = this.amountToTakeIncGst;
      };

      async createProduct(parent) {
            console.log(getProductsWithName(" ACM panel with Laminated Vinyl"));
            parent.minimize();
            await AddQuickProduct("Credit Card Surcharge - 2.5%");
            var productNo = getNumProducts();
            await DeletePart(productNo, 1);
            console.log(this.creditSurchargeIncGst);
            await q_AddPart_CostPrice(productNo, 0, true, false, 1, parent.creditSurchargeIncGst, parent.creditSurchargeIncGst, "Credit card surcharge");
            Ordui.Alert("done");
      }

}