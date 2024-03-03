class TotalQuantity {

      #canvasCtx;

      constructor(parentObject, canvasCtx, updateFunction) {
            this.createGUI(parentObject, canvasCtx, updateFunction);
      }

      createGUI(parentObject, canvasCtx, updateFunction) {
            this.#canvasCtx = canvasCtx;
            this.callback = updateFunction;

            this.l_container = document.createElement("div");
            this.l_container.style = STYLE.BillboardMenus;

            this.l_qty = createInput_Infield("Total Quantity", 1, "width:97%", this.callback, this.l_container, true, 1);

            parentObject.appendChild(this.l_container);
      }

      get container() {
            return this.l_container;
      }

      get qty() {
            return parseFloat(this.l_qty[1].value);
      }
      set qty(value) {
            this.l_qty[1].value = value;
      }

      async Create(productNo, partIndex) {
            await setProductQty(productNo, this.qty);
            return partIndex;
      }
}
