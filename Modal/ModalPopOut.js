class ModalPopOut extends Modal {
      #containersToBorrow;
      #borrowedFields = [];

      constructor(headerText, callback, ...containersToBorrow) {
            super(headerText, callback);
            this.#containersToBorrow = containersToBorrow;
            this.borrowFields(...containersToBorrow);

            this.addFooterElement(createButton("Close", "width:100px;float:right;", () => {this.callback(); this.returnAllBorrowedFields(); console.log("in callback");}));
      }

      borrowFields(...fieldContainers) {
            for(let i = 0; i < fieldContainers.length; i++) {
                  let borrowedElement = fieldContainers[i];

                  let placeholder = document.createElement("div");
                  insertAfter(placeholder, borrowedElement);

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
            }
      }

      /**@Override */
      onMouseOut() {
            this.callback();
      }

      hide() {
            this.returnAllBorrowedFields();
            super.hide();
      }
}