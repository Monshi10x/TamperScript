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

      #hasGrainField;
      setHasGrainField(field) {
            this.#hasGrainField = field;
      }

      get hasGrain() {
            return this.#hasGrainField.checked;
      }

      #grainDirectionField;
      setGrainDirectionField(field) {
            this.grainDirectionField = field;
      }

      get grainDirection() {
            return this.grainDirectionField.value;
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

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];

            this.#dragZoomCanvas = new DragZoomCanvas(this.container.getBoundingClientRect().width, 500, () => this.draw(), this.getBodyElement());

            this.#containerAfterCanvas = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            this.#gapBetweenXField = createInput_Infield("Gap Between Panels (x)", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);
            this.#gapBetweenYField = createInput_Infield("Gap Between Panels (y)", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);
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

                                    let rectWidth_Initial = rectWidth;

                                    //draw matrixSize
                                    drawRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Black, 1);

                                    if(isFirstRow) drawMeasurement_Verbose(canvasCtx, xo, yo, rectWidth, 0, "T", roundNumber(rectWidth, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, true, "B", false, canvasScale);
                                    if(isFirstColumn) drawMeasurement_Verbose(canvasCtx, xo, yo, 0, rectHeight, "L", roundNumber(rectHeight, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, false, "R", false, canvasScale);

                                    drawFillRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Red, 0.3);

                                    //draw grain
                                    if(this.hasGrain) {
                                          console.log(this.flipped, this.grainDirection);
                                          if(!this.flipped && this.grainDirection == "With Long Side") {
                                                let numberOfGrains = (rectHeight / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      drawLine_WH(canvasCtx, xo, yo + ((g + 1) * 20), rectWidth, 0, COLOUR.Blue, 1, 1);
                                                }
                                          } if(!this.flipped && this.grainDirection == "With Short Side") {
                                                let numberOfGrains = (rectWidth / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      drawLine_WH(canvasCtx, xo + ((g + 1) * 20), yo, 0, rectHeight, COLOUR.Blue, 1, 1);
                                                }
                                          } if(this.flipped && this.grainDirection == "With Long Side") {
                                                let numberOfGrains = (rectWidth / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      drawLine_WH(canvasCtx, xo + ((g + 1) * 20), yo, 0, rectHeight, COLOUR.Blue, 1, 1);
                                                }
                                          } if(this.flipped && this.grainDirection == "With Short Side") {
                                                let numberOfGrains = (rectHeight / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      drawLine_WH(canvasCtx, xo, yo + ((g + 1) * 20), rectWidth, 0, COLOUR.Blue, 1, 1);
                                                }

                                          }
                                    }

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
