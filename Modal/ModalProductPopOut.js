class ModalProductPopOut extends Modal {
      #containersToBorrow;
      #borrowedFields = [];

      whenClosedReturnBorrowed = true;

      constructor(headerText, callback, ...containersToBorrow) {
            super(headerText, callback);
            this.#containersToBorrow = containersToBorrow;

            this.setContainerSize(1100, 1000);
            this.borrowFieldsContainer = this.getBodyElement();
            this.borrowFields(...containersToBorrow);

            this.btn = createButton("Close", "width:100px;float:right;", () => {
                  if(this.whenClosedReturnBorrowed == true) this.returnAllBorrowedFields();
                  this.callback();
            });

            this.addFooterElement(this.btn);
      }

      /**@Override */
      /*note this is similar, but not exactly same as Modal's method*/
      borrowFields(...fieldContainers) {
            this.#borrowedFields = [];
            for(let i = 0; i < fieldContainers.length; i++) {
                  let borrowedElement = fieldContainers[i];
                  let placeholder = document.createElement("div");
                  placeholder.style = borrowedElement.style.cssText + ";opacity:0.2;height:" + borrowedElement.clientHeight + "px;";
                  insertAfter(placeholder, borrowedElement);

                  this.#borrowedFields.push({
                        fieldContainer: borrowedElement,
                        placeholder: placeholder,
                        returnBeforeElement: borrowedElement.nextElementSibling,
                        currentCssStyle: borrowedElement.style.cssText
                  });

                  this.addBodyElement(borrowedElement);
            }
      }

      /**@Override */
      /*note this is similar, but not exactly same as Modal's method*/
      returnAllBorrowedFields() {
            for(let i = 0; i < this.#borrowedFields.length; i++) {
                  this.#borrowedFields[i].placeholder.replaceWith(this.#borrowedFields[i].fieldContainer);
                  this.#borrowedFields[i].fieldContainer.style = this.#borrowedFields[i].currentCssStyle;

                  deleteElement(this.#borrowedFields[i].placeholder);
            }
      }


      /**@Override */
      onMouseOut() {
            this.callback();
      }

      hide() {
            if(this.whenClosedReturnBorrowed == true) this.returnAllBorrowedFields();
            super.hide();
      }

}