
class Supplier extends SubMenu {
      #qty;
      #cost;
      #markup;
      #supplierName;
      constructor(parentObject, ctx, updateFunction) {
            super(parentObject, ctx, updateFunction, "Supplier");

            this.#qty = createInput_Infield("Qty", 1, "width:80px", () => {this.Update();}, this.contentContainer, true, 1);
            this.#cost = createInput_Infield("Cost", null, "width:100px", () => {this.Update();}, this.contentContainer, true, 1);
            this.#markup = createInput_Infield("Markup", null, "width:100px", () => {this.Update();}, this.contentContainer, true, 1);
            this.#supplierName = createDropdown_Infield_Icons_Search("Supplier", 0, "width:200px", 40, false, [["Mulford", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkbiJarSPG1EXUnQ24f7kOzpi_rpAaS_wr6iEB0N4PHDyBeU5tCyGBWsZwIvYr8Cyg_ZU&usqp=CAU"]], () => {this.Update();}, this.contentContainer, true);

            makeFieldGroup("Checkbox", this.requiredField[1], false, this.#qty[0], this.#cost[0], this.#markup[0], this.#supplierName[0]);
      }

      Update() {
            super.Update();
      }

      async Create(productNo, partIndex) {
            if(this.required) {

            }
            return partIndex;
      }

      Description() {
            return "";
      }
}