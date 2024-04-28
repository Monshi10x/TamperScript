class Loader {
      #container;
      #ID;
      constructor(overrideCssStyles, parentObjectToAppendTo) {
            this.#ID = "loaderSP6-" + generateUniqueID();
            this.#container = document.createElement("div");
            this.#container.className = "loaderSP6";
            this.#container.id = this.#ID;
            this.#container.style.cssText += overrideCssStyles;

            if(parentObjectToAppendTo != null) {
                  parentObjectToAppendTo.appendChild(this.#container);
            }
      }

      setSize(widthNumber) {
            this.#container.style.cssText += ";width:" + widthNumber + "px;height:" + widthNumber + "px;margin:-" + (widthNumber) + "px 0px 0px -" + (widthNumber) + "px;";
      }

      Delete() {
            $(document.querySelector("#" + this.#ID)).remove();
      }
}