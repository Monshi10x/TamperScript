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
                  this.#borrowedFields.push({
                        fieldContainer: borrowedElement,
                        returnAfterElement: borrowedElement.previousElementSibling,
                        returnBeforeElement: borrowedElement.nextElementSibling,
                        currentCssStyle: borrowedElement.style.cssText
                  });
                  //borrowedElement.style.maxHeight = "100%";
                  this.addBodyElement(borrowedElement);
            }
      }

      returnAllBorrowedFields() {
            for(let i = 0; i < this.#borrowedFields.length; i++) {
                  if(this.#borrowedFields[i].returnAfterElement) insertAfter(this.#borrowedFields[i].fieldContainer, this.#borrowedFields[i].returnAfterElement);
                  else insertBefore(this.#borrowedFields[i].fieldContainer, this.#borrowedFields[i].returnBeforeElement);
                  //this.#borrowedFields[i].style = this.#borrowedFields[i].currentCssStyle;
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