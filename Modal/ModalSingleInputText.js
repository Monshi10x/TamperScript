class ModalSingleInputText extends Modal {
      constructor(headerText, callback) {
            console.log("in modal single input text");
            super(headerText, callback);
            this.l_value = "";
            var tempThis = this;
            this.valField = createInput_Infield("Value", tempThis.value, null, () => {tempThis.value = tempThis.valField[1].value;}, null, true, null);
            this.valField[1].focus();
            this.addBodyElement(this.valField[0]);
            this.addFooterElement(createButton("Ok", "width:100px;float:right;", () => {tempThis.callback(); console.log("in callback");}));
            this.addFooterElement(createButton("Cancel", "width:100px;float:right;", () => {tempThis.hide(); console.log("cancel called");}));
      }

      get value() {
            return this.l_value;
      }

      set value(val) {
            this.l_value = val;
      }
}