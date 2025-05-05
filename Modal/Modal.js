class Modal {

      #modalContainer;
      get container() {return this.#modalContainer;}

      modalOpaqueBackground;
      #headerContainer;
      #headerText;

      #f_mouseDownRef;
      #f_windowResizeRef;
      #f_mouseMoveRef;
      #f_keyUpRef;

      #bodyContainer;
      getBodyElement() {return this.#bodyContainer;}

      #footerContainer;

      #callbackFunction;
      get callbackFunction() {return this.#callbackFunction;}
      set callbackFunction(value) {this.#callbackFunction = value;}

      shouldHideOnEnterKeyPress = true;
      /*overrideable*/get shouldShowOnCreation() {return true;};

      #borrowedFields = [];
      #borrowFieldsContainer;
      get borrowFieldsContainer() {return this.#borrowFieldsContainer;}
      set borrowFieldsContainer(containerElement) {this.#borrowFieldsContainer = containerElement;}

      setContainerSize(width = 300, height = 300) {
            this.#modalContainer.style.width = width + 'px';
            this.#modalContainer.style.height = height + 'px';
      }

      constructor(headerText, callbackFunction) {
            this.#headerText = headerText;
            this.#callbackFunction = callbackFunction;

            this.createGUI();
      }

      createGUI() {
            this.modalOpaqueBackground = document.createElement('div');
            this.modalOpaqueBackground.style = "display: none;position: fixed;z-index: 1000;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0, 0, 0);background-color: rgba(0, 0, 0, 0.5);overflow-y: auto;display: flex; align - items: center;justify - content: center; ";
            this.modalOpaqueBackground.className = "modalOpaqueBackground";
            document.body.appendChild(this.modalOpaqueBackground);

            this.#modalContainer = document.createElement('div');
            this.#modalContainer.className = 'modalContainer';
            this.#modalContainer.style = "width:60%;height:80%;min-height:300px;min-width:300px;max-height:calc(100% - 200px);max-width:calc(100% - 200px);position:relative;z-index:1002;background-color:white;margin: auto;" + STYLE.DropShadow;
            this.modalOpaqueBackground.appendChild(this.#modalContainer);

            this.#headerContainer = createText(this.#headerText, "width:100%;height:30px;text-align: center;color:white;margin:0px;background-color:" + COLOUR.Blue + ";" + STYLE.HeaderFont);
            this.#headerContainer.className = 'modalContainerHeader';
            this.#modalContainer.appendChild(this.#headerContainer);

            this.#bodyContainer = document.createElement('div');
            this.#bodyContainer.className = 'modalContainerBody';
            this.#bodyContainer.style = "width:100%;min-height:50px;display:block;z-index:1002;background-color:white;margin:0px;overflow-y:auto;margin-bottom:50px;height:calc(100% - 80px)";
            this.#modalContainer.appendChild(this.#bodyContainer);

            this.#footerContainer = document.createElement('div');
            this.#footerContainer.className = 'modalContainerFooter';
            this.#footerContainer.style = "width:100%;height:50px;display:block;position:absolute;bottom:0px;background-color:" + COLOUR.Blue;
            this.#modalContainer.appendChild(this.#footerContainer);

            if(this.shouldShowOnCreation) this.show();
            else this.hide();
      }

      show() {
            this.modalOpaqueBackground.style.display = 'block';
            this.modalOpaqueBackground.style.display = 'flex';

            this.#f_mouseDownRef = (e) => this.onMouseDown(e);
            this.modalOpaqueBackground.addEventListener("mousedown", this.#f_mouseDownRef);

            this.#f_windowResizeRef = (e) => this.onWindowResize(e);
            this.modalOpaqueBackground.addEventListener("resize", this.#f_windowResizeRef);

            this.#f_mouseMoveRef = (e) => this.onMouseMove(e);
            this.modalOpaqueBackground.addEventListener("mousemove", this.#f_mouseMoveRef);

            this.#f_keyUpRef = (e) => this.onKeyUp(e);
            this.modalOpaqueBackground.addEventListener("keyup", this.#f_keyUpRef, {bubbles: false});

            createWindowDragZones(this.container, 10, (event) => this.onWindowResize(event));

            $("#btnGoToOrderStep2").hide();
      }

      hide() {
            this.modalOpaqueBackground.style.display = 'none';
            //removeAllChildrenFromParent(this.modalOpaqueBackground);
            $("#btnGoToOrderStep2").show();
            //deleteElement(this.modalOpaqueBackground);
            this.returnAllBorrowedFields();
            this.modalOpaqueBackground.removeEventListener("mousedown", this.#f_mouseDownRef);
            this.modalOpaqueBackground.removeEventListener("resize", this.#f_windowResizeRef);
            this.modalOpaqueBackground.removeEventListener("mousemove", this.#f_mouseMoveRef);
            this.modalOpaqueBackground.removeEventListener("keyup", this.#f_keyUpRef);
      }

      Delete() {
            deleteElement(this.modalOpaqueBackground);
      }

      addFooterElement(element) {
            this.#footerContainer.appendChild(element);
            return element;
      }

      addBodyElement(element, appendAfterChild = null) {
            if(appendAfterChild == null) {
                  this.#bodyContainer.appendChild(element);
            } else {
                  insertAfter(element, appendAfterChild);
            }
            return element;
      }

      callback(/*args*/) {
            if(this.#callbackFunction) {
                  this.#callbackFunction(arguments);
            }
            this.hide();
      };

      onMouseDown(event) {
            if(event.target.className == "modalOpaqueBackground") this.onMouseOut();
      }

      onMouseOut() {
            this.hide();
      }

      onMouseMove(event) { }

      onWindowResize(event) { }

      onKeyUp(event) {
            if(event.key === "Enter" && this.shouldHideOnEnterKeyPress) this.hide();
      }

      borrowFields(...fieldContainers) {
            if(!this.borrowFieldsContainer) return Error("must set a borrowFieldsContainer");
            this.#borrowedFields = [];

            for(let i = 0; i < fieldContainers.length; i++) {
                  let elementToBorrow = fieldContainers[i];
                  let placeholderBefore = document.createElement("div");
                  let placeholderAfter = document.createElement("div");

                  insertBefore(placeholderBefore, elementToBorrow);
                  insertAfter(placeholderAfter, elementToBorrow);

                  this.#borrowedFields.push({
                        elementToBorrow: elementToBorrow,
                        placeholderBefore: placeholderBefore,
                        placeholderAfter: placeholderAfter,
                        currentCssStyle: elementToBorrow.style.cssText
                  });
            }
            for(let i = 0; i < fieldContainers.length; i++) {
                  let elementToBorrow = fieldContainers[i];
                  this.borrowFieldsContainer.appendChild(elementToBorrow);
            }
      }

      returnAllBorrowedFields() {
            console.trace(this.#borrowedFields);
            for(let i = this.#borrowedFields.length - 1; i >= 0; i--) {
                  insertAfter(this.#borrowedFields[i].elementToBorrow, this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderAfter);
            }
            this.#borrowedFields = [];
      }
}