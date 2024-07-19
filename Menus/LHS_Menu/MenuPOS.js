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

            this.#f_typeDropdown = createDropdown_Infield_Icons_Search("Type", 0, null, 100, false, [
                  ["Business Cards", "https://orders.ibscards.com.au/assets/images/Products/5400.png"],
                  ["Flyers", "https://orders.ibscards.com.au/assets/images/Products/5407.png"]], () => { }, this.#page1, true);

            this.#f_isPanelProduct = createCheckbox_Infield("Is Panel Product", false, "width:300px;", () => {
                  this.togglePanelProducts(this.#f_isPanelProduct[1].checked);
            }, this.#page1);

            this.#f_qty = createInput_Infield("Quantity", 0, null, () => {
                  this.#f_costForQty[2].innerText = "Cost (for " + this.#f_qty[1].value + ")";
            }, this.#page1, true, 1);

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
                              setFieldHidden(false, this.#f_width[1], this.#f_width[0]);
                              setFieldHidden(false, this.#f_height[1], this.#f_height[0]);
                        } else {
                              setFieldHidden(true, this.#f_width[1], this.#f_width[0]);
                              setFieldHidden(true, this.#f_height[1], this.#f_height[0]);
                        }
                  }, this.#page1, true);

            this.#f_width = createInput_Infield("Width", 0, "display:none;", () => { }, this.#page1, true, 1);

            this.#f_height = createInput_Infield("Height", 0, "display:none;", () => { }, this.#page1, true, 1);

            this.#f_thickness = createInput_Infield("Thickness", 0, "display:none;", () => { }, this.#page1, true, 1);

            this.#f_costForQty = createInput_Infield("Cost (for 0)", 0, null, () => { }, this.#page1, true, 1);

            this.#f_gsmDropdown = createDropdown_Infield_Icons_Search("GSM", 0, null, 10, true, [
                  ["115", "#ffffff"],
                  ["150", "#ffffff"],
                  ["250", "#ffffff"],
                  ["350", "#ffffff"],
                  ["420", "#ffffff"]], () => { }, this.#page1, true);

            this.#f_finishDropdown = createDropdown_Infield_Icons_Search("Finish", 0, null, 10, true, [
                  ["Gloss", "#ffffff"],
                  ["Silk/Matte", "#ffffff"],
                  ["Matte", "#ffffff"]], () => { }, this.#page1, true);

            this.#f_extras = createTextarea("Other Extras", null, null, () => { }, this.#page1);

            this.#f_link_IBS = createLink("float:left;display:block;background-color:" + COLOUR.Blue + ";text-decoration: none;padding:10px;margin:5px;", "IBS", "https://orders.ibscards.com.au/member/dashboard", "new window", this.#page1);
      }

      togglePanelProducts(show = true) {
            setFieldHidden(!show, this.#f_thickness[1], this.#f_thickness[0]);
      }

      hide() {
            super.hide();
      }

      tick() {
            this.tickUpdate();
      }

      tickUpdate() {

      }
}