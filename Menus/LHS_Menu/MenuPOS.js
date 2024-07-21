class MenuPOS extends LHSMenuWindow {

      //VARIABLES
      #page1;

      //FIELDS
      #f_qty;
      #f_costForQty;
      #f_link_IBS;
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
                  ["Corflute", "https://onespotprint.com.au/wp-content/uploads/2018/07/Corflute-Signs-1-One-Spot-Print.jpg"]], () => {
                        setCheckboxChecked(this.#f_typeDropdown[1].value == "Corflute", this.#f_isPanelProduct[1]);
                  }, container, true);

            this.#f_isPanelProduct = createCheckbox_Infield("Is Panel Product", false, "width:300px;", () => {
                  this.togglePanelProducts(this.#f_isPanelProduct[1].checked);
            }, container);

            let container2 = createDivStyle5(null, "Cost", this.#page1)[1];

            this.#f_qty = createInput_Infield("Quantity", null, null, () => {
                  this.#f_costForQty[2].innerText = "Cost (for " + this.#f_qty[1].value + ")";
            }, container2, true, 1);

            this.#f_costForQty = createInput_Infield("Cost (for 0)", null, null, () => { }, container2, true, 1, {prefix: "$"});

            this.#f_markup = createInput_Infield("Markup", 2, null, () => { }, container2, true, 1);

            let container3 = createDivStyle5(null, "Specs", this.#page1)[1];

            this.#f_dimensions = createDropdown_Infield_Icons_Search("Dimensions", 0, null, 10, true, [
                  ["A7 (105x75)", "#ffffff"],
                  ["A6 (148x105)", "#ffffff"],
                  ["DL (210x99)", "#ffffff"],
                  ["A5 (210x148)", "#ffffff"],
                  ["A4 (297x210)", "#ffffff"],
                  ["A3 (297x420)", "#ffffff"],
                  ["A2 (594x420)", "#ffffff"],
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

            this.#f_extras = createTextarea("Other Extras", null, "margin-right:60%;", () => { }, container3);

            let container4 = createDivStyle5(null, "Links", this.#page1)[1];

            this.#f_link_IBS = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "IBS", "https://orders.ibscards.com.au/member/dashboard", "new window", container4);

            let container5 = createDivStyle5(null, "Artwork", this.#page1)[1];
            this.#artwork = new Artwork(container5, null, null);

            this.#f_createProductBtn = createButton('Create Product', "margin:0px;width:100%", function() {
                  this.Create();
            });
            this.footer.appendChild(this.#f_createProductBtn);
      }

      togglePanelProducts(show = true) {
            if(show) $(this.#f_thickness[0]).fadeIn(200);
            else $(this.#f_thickness[0]).fadeOut(200);
      }

      hide() {
            super.hide();
      }

      Create() {

      }
}