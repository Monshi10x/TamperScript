class Loader {
      constructor(overrideCssStyles, parentObjectToAppendTo) {
            this.div = document.createElement("div");
            this.div.className = "loaderSP6";
            //div.style = STYLE.Div2;
            this.div.style.cssText += overrideCssStyles;

            if(parentObjectToAppendTo != null) {
                  parentObjectToAppendTo.appendChild(this.div);
            }
      }

      Delete() {
            deleteElement(this.div);
      }
}