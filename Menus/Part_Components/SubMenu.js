class SubMenu extends SubscriptionManager {
      #canvasCtx;
      #parentContainer;
      #headerText = "Sub Menu";
      #container;
      #header;
      #required;
      #updateFunction;
      #UNIQUEID;
      #showIDInContainer = false;
      get UNIQUEID() {return this.#UNIQUEID;}
      get ID() {return this.UNIQUEID;};

      constructor(parentContainer, canvasCtx, updateFunction, headerText) {
            super();
            this.#canvasCtx = canvasCtx;
            this.#parentContainer = parentContainer;
            if(updateFunction) this.#updateFunction = updateFunction;
            else this.#updateFunction = () => { };
            if(headerText) this.#headerText = headerText;

            this.#UNIQUEID = headerText + "-" + generateUniqueID();

            this.#container = new UIContainerType3(null, this.#headerText, this.#parentContainer);

            if(this.#showIDInContainer) {
                  let label = createLabel(this.UNIQUEID, "width:100%", this.contentContainer);
            }

            this.#required = createCheckbox_Infield("Required", true, "width:97%", () => {this.Update();}, this.contentContainer, true);
      }

      get ctx() {return this.#canvasCtx;}

      get callback() {return this.#updateFunction;}

      get container() {return this.#container;}
      get contentContainer() {return this.#container.contentContainer;}

      set showContainer(value) {setFieldHidden(value, this.#container.container);}
      removeContainerStyles = () => {this.#container.container.style = "";};

      set headerName(value) {this.header.innerText = value; this.#headerText = value;}
      get headerName() {return this.#headerText;}
      set showHeader(value) {setFieldHidden(value, this.header);}
      get header() {return this.#container.headingText;}

      get required() {return this.#required[1].checked;}
      set required(value) {setCheckboxChecked(value, this.#required[1]);}
      get requiredField() {return this.#required;}
      set requiredName(value) {this.#required[0].querySelector("p").innerText = value;}

      Minimize() {
            this.#container.Minimize();
      }

      Maximize() {
            this.#container.Maximize();
      }

      Update() {
            this.#updateFunction();
      }

      async Create(productNo, partIndex) {
            return partIndex;
      }

      Description() { }
}