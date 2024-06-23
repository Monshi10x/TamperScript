class ModalPopOut extends Modal {
      #containersToBorrow;
      #borrowedFields = [];

      #whenClosedReturnBorrowed = true;
      set whenClosedReturnBorrowed(value) {this.#whenClosedReturnBorrowed = value;}

      constructor(headerText, callback, ...containersToBorrow) {
            super(headerText, callback);
            this.#containersToBorrow = containersToBorrow;

            this.setContainerSize(900, 900);
            this.borrowFields(...containersToBorrow);

            this.btn = createButton("Close", "width:100px;float:right;", () => {
                  if(this.#whenClosedReturnBorrowed == true) this.returnAllBorrowedFields();
                  console.log("in callback modal popout");
                  this.callback();
            });

            this.addFooterElement(this.btn);
      }

      borrowFields(...fieldContainers) {
            for(let i = 0; i < fieldContainers.length; i++) {
                  let borrowedElement = fieldContainers[i];
                  let placeholder = document.createElement("div");
                  insertAfter(placeholder, borrowedElement);

                  console.log(borrowedElement.style.cssText);

                  this.#borrowedFields.push({
                        fieldContainer: borrowedElement,
                        returnAfterElement: placeholder,
                        returnBeforeElement: borrowedElement.nextElementSibling,
                        currentCssStyle: borrowedElement.style.cssText,
                        placeholder: placeholder
                  });

                  this.addBodyElement(borrowedElement);
            }
      }

      returnAllBorrowedFields() {
            for(let i = 0; i < this.#borrowedFields.length; i++) {
                  if(this.#borrowedFields[i].returnAfterElement) insertAfter(this.#borrowedFields[i].fieldContainer, this.#borrowedFields[i].returnAfterElement);
                  else insertBefore(this.#borrowedFields[i].fieldContainer, this.#borrowedFields[i].returnBeforeElement);

                  this.#borrowedFields[i].fieldContainer.style = this.#borrowedFields[i].currentCssStyle;
            }
      }

      /**@Override */
      onMouseOut() {
            this.callback();
      }

      hide() {
            if(this.#whenClosedReturnBorrowed == true) this.returnAllBorrowedFields();
            super.hide();
      }

}