class MenuPOS extends LHSMenuWindow {

      //VARIABLES
      #page1;

      //FIELDS
      #f_qty;
      #f_costForQty;
      #f_link_IBS;
      #f_link_EasySigns;
      #f_link_InhousePrint;
      #f_link_DisplayMe;
      #f_link_SlimlineWarehouse;
      #f_typeDropdown;
      #f_gsmDropdown;
      #f_dimensions;
      #f_width;
      #f_height;
      #f_finishDropdown;
      #f_extras;
      #f_isPanelProduct;
      #f_thickness;
      #f_markup;
      #f_createProductBtn;
      #f_sides;
      #artwork;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(1);
            this.#page1 = this.getPage(0);

            this.CreateGUI();
      }

      show() {
            super.show();
      }

      CreateGUI() {
            this.clearPages(0);

            let container = createDivStyle5(null, "Type", this.#page1)[1];

            this.#f_typeDropdown = createDropdown_Infield_Icons_Search("Type", 0, null, 100, false, [
                  ["Business Cards", "https://orders.ibscards.com.au/assets/images/Products/5400.png"],
                  ["Flyers", "https://orders.ibscards.com.au/assets/images/Products/5407.png"],
                  ["Corflute - Direct Print", "https://onespotprint.com.au/wp-content/uploads/2018/07/Corflute-Signs-1-One-Spot-Print.jpg"],
                  ["Flags", ""],
                  ["Snap Frames", ""]], () => {
                        setCheckboxChecked(this.#f_typeDropdown[1].value == "Corflute - Direct Print", this.#f_isPanelProduct[1]);
                  }, container, true);

            this.#f_isPanelProduct = createCheckbox_Infield("Is Panel Product", false, "width:300px;", () => {
                  this.togglePanelProducts(this.#f_isPanelProduct[1].checked);
            }, container);

            let container2 = createDivStyle5(null, "Cost", this.#page1)[1];

            this.#f_qty = createInput_Infield("Quantity", null, null, () => {
                  this.#f_costForQty[2].innerText = "Cost (for " + this.#f_qty[1].value + ") +GST";
            }, container2, true, 1);

            this.#f_costForQty = createInput_Infield("Cost (for 0) +GST", null, null, () => { }, container2, true, 1, {prefix: "$"});

            this.#f_markup = createInput_Infield("Markup", 2, null, () => { }, container2, true, 1);

            let container3 = createDivStyle5(null, "Specs", this.#page1)[1];

            this.#f_dimensions = createDropdown_Infield_Icons_Search("Dimensions", 0, null, 10, true, [
                  ["DL (210x99)", "#ffffff"],
                  ["A0 (1189x841)", "#ffffff"],
                  ["A1 (841x594)", "#ffffff"],
                  ["A2 (594x420)", "#ffffff"],
                  ["A3 (297x420)", "#ffffff"],
                  ["A4 (297x210)", "#ffffff"],
                  ["A5 (210x148)", "#ffffff"],
                  ["A6 (148x105)", "#ffffff"],
                  ["A7 (105x75)", "#ffffff"],
                  ["90x55", "#ffffff"],
                  ["600x900", "#ffffff"],
                  ["Custom Size", "#0000ff"]], () => {
                        if(this.#f_dimensions[1].value == "Custom Size") {
                              $(this.#f_width[0]).fadeIn(200);
                              $(this.#f_height[0]).fadeIn(200);
                        } else {
                              $(this.#f_width[0]).fadeOut(200);
                              $(this.#f_height[0]).fadeOut(200);
                        }
                  }, container3, true);

            this.#f_width = createInput_Infield("Width", null, "display:none;", () => { }, container3, true, 1, {postfix: "mm"});
            this.#f_height = createInput_Infield("Height", null, "display:none;", () => { }, container3, true, 1, {postfix: "mm"});

            this.#f_thickness = createInput_Infield("Thickness", null, "display:none;margin-right: 60%;", () => { }, container3, true, 1, {postfix: "mm"});

            this.#f_gsmDropdown = createDropdown_Infield_Icons_Search("GSM", 0, "margin-right:60%;", 10, true, [
                  ["115", "#ffffff"],
                  ["150", "#ffffff"],
                  ["250", "#ffffff"],
                  ["350", "#ffffff"],
                  ["420", "#ffffff"]], () => { }, container3, true);

            this.#f_finishDropdown = createDropdown_Infield_Icons_Search("Finish", 0, "margin-right:60%;", 10, true, [
                  ["Gloss", "#ffffff"],
                  ["Silk/Matte", "#ffffff"],
                  ["Matte", "#ffffff"]], () => { }, container3, true);

            this.#f_sides = createDropdown_Infield_Icons_Search("Sides", 0, "margin-right:60%;", 10, true, [
                  ["Single Sided", "Single Sided"],
                  ["Double Sided", "Double Sided"]], () => { }, container3, true);

            this.#f_extras = createTextarea("Other Extras", null, "margin-right:60%;", () => { }, container3);

            let container4 = createDivStyle5(null, "Links", this.#page1)[1];

            this.#f_link_IBS = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "IBS", "https://orders.ibscards.com.au/member/dashboard", "new window", container4);
            this.#f_link_EasySigns = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "Easy Signs", "https://www.easysigns.com.au/", "new window", container4);
            this.#f_link_InhousePrint = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "Inhouse Print", "https://inhouseprint.com.au/", "new window", container4);
            this.#f_link_DisplayMe = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "DisplayMe", "https://www.displayme.com.au/", "new window", container4);
            this.#f_link_SlimlineWarehouse = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "Slimline Warehouse", "https://www.slimlinewarehouse.com.au/", "new window", container4);

            let container5 = createDivStyle5(null, "Artwork", this.#page1)[1];
            this.#artwork = new Artwork(container5, null, null);

            this.#f_createProductBtn = createButton('Create Product', "margin:0px;width:100%", async () => {
                  await this.Create();
            });
            this.footer.appendChild(this.#f_createProductBtn);
      }

      togglePanelProducts(show = true) {
            if(show) {
                  $(this.#f_thickness[0]).fadeIn(200);

                  $(this.#f_gsmDropdown[0]).fadeOut(200);
                  $(this.#f_finishDropdown[0]).fadeOut(200);
            }
            else {
                  $(this.#f_thickness[0]).fadeOut(200);

                  $(this.#f_gsmDropdown[0]).fadeIn(200);
                  $(this.#f_finishDropdown[0]).fadeIn(200);
            }
      }

      hide() {
            super.hide();
      }

      async Create() {
            this.minimize();
            await AddBlankProduct();
            let productNo = getNumProducts();
            var newPartIndex = 1;
            console.log(parseFloat(this.#f_costForQty[1].value) / parseFloat(this.#f_qty[1].value));
            await q_AddPart_CostMarkup(productNo, 0, true, false, 1, parseFloat(this.#f_costForQty[1].value) / parseFloat(this.#f_qty[1].value), this.#f_markup[1].value, "");
            await setProductQty(productNo, this.#f_qty[1].value);
            await setProductSummary(productNo, this.Description());
            await setProductName(productNo, this.#f_typeDropdown[1].value);

            Toast.notify("Done", 3000, {position: "top-right"});
            return newPartIndex;
      }
      //catchNull(value, valueIfNull)
      Description() {
            return "<ul>" +
                  "<li>" + "Size: " + this.#f_dimensions[1].value + "</li>" +
                  IFELSE(isVisible(this.#f_thickness[0]), "<li>" + "Thickness: " + this.#f_thickness[1].value + "mm</li>", "") +
                  "<li>" + "GSM: " + this.#f_gsmDropdown[1].value + "</li>" +
                  "<li>" + "Finish: " + this.#f_finishDropdown[1].value + "</li>" +
                  "<li>" + this.#f_sides[1].value + "</li>" +
                  IFELSE(this.#f_extras.value, "<li>" + "Extras: " + this.#f_extras.value + "</li>", "") +
                  "</ul>" +
                  this.#artwork.Description();
      }
} 
