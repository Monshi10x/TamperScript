class CreditSurchargeMenu extends LHSMenuWindow {
      surchargePercentage = 2.5;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);

            var page = this.getPage(0);

            while(this.footer.hasChildNodes()) {this.footer.removeChild(this.footer.lastChild);}

            this.l_balanceDue = createInput_Infield("Balance Due (inc GST)", this.balanceDue, "width:200px;margin-left:100px", () => {}, page, false, null);
            setFieldDisabled(true, this.l_balanceDue[1], this.l_balanceDue[0]);

            this.price_preGst = createInput_Infield("Order Price (+GST)", this.pricePreGst, "width:200px;margin-left:100px", () => {}, page, false, null);
            setFieldDisabled(true, this.price_preGst[1], this.price_preGst[0]);

            createText("", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page).innerHTML = "&#8681";

            this.priceExcludingPreviousSurcharges_preGst = createInput_Infield("Price Excluding Previous Surcharges (+GST)", this.pricePreGst, "width:300px;margin-left:50px", () => {}, page, false, null);
            setFieldDisabled(true, this.priceExcludingPreviousSurcharges_preGst[1], this.priceExcludingPreviousSurcharges_preGst[0]);

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

            this.adjustedAmount_preGst = createInput_Infield("adjusted amount (+GST)", this.adjustedAmountPreGst, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.adjustedAmount_preGst[1], this.adjustedAmount_preGst[0]);

            createText("X", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page);

            this.surchargePercentageField = createInput_Infield("Surcharge Percentage %", this.surchargePercentage, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.surchargePercentageField[1], this.surchargePercentageField[0]);

            createText("=", "width:95%;height:30px;font-size:20px;font-weight:bold;color:black;text-align:center", page);

            this.creditSurcharge_preGst = createInput_Infield("Credit Surcharge (+GST)", this.creditSurchargePreGst, "width:200px;margin-left:100px", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.creditSurcharge_preGst[1], this.creditSurcharge_preGst[0]);

            this.amountToTake_incGst = createInput_Infield("Amount To Take (Inc GST)", this.amountToTakeIncGst, "width:200px;margin-left:100px;border:3px solid " + COLOUR.Blue + "", () => {this.fieldChangeUpdate();}, page, false, null);
            setFieldDisabled(true, this.amountToTake_incGst[1], this.amountToTake_incGst[0]);

            this.note = createText("NOTE: Do not change product name", "width:95%;font-weight:bold;", page);

            this.createProductBtn = createButton("Create Product   " + "\u25BA", "width:100%;margin:0px;", () => {this.createProduct(this);});
            this.footer.appendChild(this.createProductBtn);

      }

      get balanceDue() {
            if(document.querySelector("#ord_prod_model_item_1") == null) return null;
            var product1 = ko.contextFor(document.querySelector("#ord_prod_model_item_1"));
            return product1.$parent.BalanceDue();
      }

      get pricePreGst() {
            return Math.round(totalOrderPrice * 100) / 100;
      }

      get adjustedAmountPreGst() {
            if(this.percent_remaining_Ckb[1].checked) return zeroIfNaN(zeroIfNull(parseFloat(this.balanceDue / 1.1)));
            if(this.percent_custom_Ckb[1].checked) return zeroIfNaN(zeroIfNull(parseFloat(this.customAmount[1].value)));
            if(this.percent_50_Ckb[1].checked) return this.priceExcludingPreviousSurchargesPreGst * 0.5;
            if(this.percent_100_Ckb[1].checked) return this.priceExcludingPreviousSurchargesPreGst * 1.0;
      }

      get creditSurchargePreGst() {
            return parseFloat(this.adjustedAmountPreGst * (this.surchargePercentage / 100));
      }


      get amountToExcludePreGst() {
            var productsWithName = getProductsWithName("Credit Card Surcharge - 2.5%");
            var amount = 0;
            for(var n = 0; n < productsWithName.length; n++) {
                  amount += getProductPrice(productsWithName[n]);
            }
            return amount;
      }

      get priceExcludingPreviousSurchargesPreGst() {
            return zeroIfNaN(zeroIfNull(parseFloat(this.priceExcludingPreviousSurcharges_preGst[1].value)));
      }

      get amountToTakeIncGst() {
            return roundNumber((this.adjustedAmountPreGst + this.creditSurchargePreGst) * 1.1, 2);
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
            this.l_balanceDue[1].value = this.balanceDue;
            this.price_preGst[1].value = this.pricePreGst;
            this.adjustedAmount_preGst[1].value = this.adjustedAmountPreGst;
            this.creditSurcharge_preGst[1].value = this.creditSurchargePreGst;
            this.priceExcludingPreviousSurcharges_preGst[1].value = this.pricePreGst - this.amountToExcludePreGst;
            this.amountToTake_incGst[1].value = this.amountToTakeIncGst;
      };

      async createProduct(parent) {
            console.log(getProductsWithName(" ACM panel with Laminated Vinyl"));
            parent.minimize();
            await AddQuickProduct("Credit Card Surcharge - 2.5%");
            var productNo = getNumProducts();
            await DeletePart(productNo, 1);
            console.log(this.creditSurchargePreGst);
            await q_AddPart_CostPrice(productNo, 0, true, false, 1, parent.creditSurchargePreGst, parent.creditSurchargePreGst, "Credit card surcharge");
            Ordui.Alert("done");
      }

}