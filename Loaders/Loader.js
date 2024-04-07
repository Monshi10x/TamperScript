class Loader {
      constructor(overrideCssStyles, parentObjectToAppendTo) {
            this.div = document.createElement("div");
            this.div.className = "loaderSP6";
            this.div.style.cssText += overrideCssStyles;

            if(parentObjectToAppendTo != null) {
                  parentObjectToAppendTo.appendChild(this.div);
            }
      }

      setSize(widthNumber) {
            this.div.style.cssText += "width:" + widthNumber + "px;height:" + widthNumber + "px;margin:-" + widthNumber - 5 + "px 0 0 -" + widthNumber - 5 + "px;";
      }

      Delete() {
            deleteElement(this.div);
      }
}