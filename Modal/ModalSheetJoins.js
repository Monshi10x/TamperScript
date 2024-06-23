class ModalSheetJoins extends ModalWidthHeight {

      #ID = "ModalSheetJoins " + generateUniqueID();
      #dragZoomCanvas;
      #borrowedFields = [];


      #textSize = 15;
      #lineWidth = 1;
      #crossScale = 0.2;
      #offsetFromShape = 15;

      /** @info Draw Each Sheet from matrixSizes, per parent */
      #distanceBetweenParentDraws = 1000;

      //An array of multiple parents matrixSizes
      #sizeArrays = [];
      setSizeArrays(...sizeArrays) {
            this.#sizeArrays = sizeArrays;
            this.updateFromFields();
      }

      #sheetSizeField;
      setSheetSizeField(field) {
            this.#sheetSizeField = field;
      }

      get sheetSize() {
            let array = this.#sheetSizeField.value.replaceAll(" ", "").replaceAll("mm", "").split("x");
            return [array[0], array[1]];
      }

      #flippedField;
      setFlippedField(field) {
            this.#flippedField = field;
      }

      get flipped() {
            return this.#flippedField.checked;
      }

      #gapBetweenX = 0;
      #gapBetweenXField;
      #gapBetweenY = 0;
      #gapBetweenYField;

      #containerBeforeCanvas;
      #containerAfterCanvas;

      constructor(headerText, incrementAmount, callback, sheetClass) {
            super(headerText, incrementAmount, callback);

            this.sheetClass = sheetClass;

            setFieldDisabled(true, this.widthField[1], this.widthField[0]);
            setFieldDisabled(true, this.heightField[1], this.heightField[0]);

            this.#containerBeforeCanvas = createDiv("width:100%;margin:10px 0px;", "Borrowed Fields", this.getBodyElement());

            this.#dragZoomCanvas = new DragZoomCanvas(this.container.getBoundingClientRect().width, 400, () => this.draw(), this.getBodyElement());

            this.#containerAfterCanvas = createDiv("width:100%;margin:10px 0px;", "View Settings", this.getBodyElement());

            this.#gapBetweenXField = createInput_Infield("gapBetweenX", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);
            this.#gapBetweenYField = createInput_Infield("gapBetweenY", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);

            this.resultText = createText("Result:", "width:100%;min-height:100px;box-sizing:border-box;");
            this.addBodyElement(this.resultText);
      }

      updateFromFields() {
            super.updateFromFields();
            this.#dragZoomCanvas.updateFromFields();
      }

      Close() {
            this.returnAllBorrowedFields();
            this.#dragZoomCanvas.Close();
      }

      draw() {
            let canvasCtx = this.#dragZoomCanvas.canvasCtx;
            let canvasScale = this.#dragZoomCanvas.scale;

            let xo = 0, yo = 0;

            for(let i = 0; i < this.#sizeArrays.length; i++) {//per parent subscriptions matrix (i.e. Sheet or Size Matrix)
                  for(let j = 0; j < this.#sizeArrays[i].length; j++) {//per sheet subscription matrix
                        let matrixSize = this.#sizeArrays[i][j];

                        let isFirstRow, isFirstColumn = false;

                        for(let r = 0; r < matrixSize.length; r++) {//per matrix row
                              xo = 0;
                              isFirstRow = r == 0;

                              for(let c = 0; c < matrixSize[r].length; c++) {//per matrix column i.e. size [w, h]
                                    isFirstColumn = c == 0;

                                    let [rectWidth, rectHeight] = matrixSize[r][c];

                                    let [rectWidth_Initial, rectHeight_Initial] = [rectWidth, rectHeight];

                                    //draw matrixSize
                                    drawRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Black, 1);

                                    if(isFirstRow) drawMeasurement_Verbose(canvasCtx, xo, yo, rectWidth, 0, "T", roundNumber(rectWidth, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, true, "B", false, canvasScale);
                                    if(isFirstColumn) drawMeasurement_Verbose(canvasCtx, xo, yo, 0, rectHeight, "L", roundNumber(rectHeight, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, false, "R", false, canvasScale);

                                    drawFillRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Red, 0.4);

                                    xo += rectWidth_Initial + this.#gapBetweenX;
                              }
                              yo += matrixSize[r][0][1] + this.#gapBetweenY;
                        }
                        yo += this.#distanceBetweenParentDraws;
                  }
            }
      }

      borrowFields(...fieldContainers) {
            for(let i = 0; i < fieldContainers.length; i++) {
                  let elementToBorrow = fieldContainers[i];
                  let placeholderBefore = document.createElement("div");
                  let placeholderAfter = document.createElement("div");

                  insertBefore(placeholderBefore, elementToBorrow);
                  insertAfter(placeholderAfter, elementToBorrow);

                  this.#borrowedFields.push({
                        elementToBorrow: elementToBorrow,
                        placeholderBefore: placeholderBefore,
                        placeholderAfter: placeholderAfter
                  });
            }
            for(let i = 0; i < fieldContainers.length; i++) {
                  let elementToBorrow = fieldContainers[i];
                  this.#containerBeforeCanvas.appendChild(elementToBorrow);
            }
      }

      returnAllBorrowedFields() {
            for(let i = this.#borrowedFields.length - 1; i >= 0; i--) {
                  insertAfter(this.#borrowedFields[i].elementToBorrow, this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderBefore);
                  deleteElement(this.#borrowedFields[i].placeholderAfter);
            }
      }

      hide() {
            this.returnAllBorrowedFields();
            super.hide();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            this.#dragZoomCanvas.canvasWidth = this.container.getBoundingClientRect().width;
            this.updateFromFields();
      }
}
