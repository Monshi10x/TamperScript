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
            this.#grainDirectionField = field;
      }

      get grainDirection() {
            return this.#grainDirectionField.value;
      }

      #isFoldedField;
      setIsFoldedField(field) {
            this.#isFoldedField = field;
      }

      get isFolded() {
            return this.#isFoldedField.checked;
      }

      #foldFields = [];
      setFoldFields(topField, leftField, rightField, bottomField) {
            this.#foldFields = [topField, leftField, rightField, bottomField];
      }

      get folds() {
            return [
                  this.#foldFields[0],
                  this.#foldFields[1],
                  this.#foldFields[2],
                  this.#foldFields[3]];
      }

      #depth;
      setDepth(field) {this.#depth = field;}
      get depth() {return this.#depth;}

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

            this.#dragZoomCanvas = new DragZoomSVG(this.container.getBoundingClientRect().width, 500, '<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="1243.89mm" height="988.13mm" viewBox="0 0 3526 2801"></svg>', this.getBodyElement(),
                  {
                        convertShapesToPaths: true,
                        splitCompoundPaths: false,
                        scaleStrokeOnScroll: true,
                        scaleFontOnScroll: true,
                        defaultStrokeWidth: 1,
                        defaultFontSize: 12
                  });
            this.#dragZoomCanvas.onTransform = () => {this.draw();};
            //DragZoomCanvas(this.container.getBoundingClientRect().width, 500, () => this.draw(), this.getBodyElement());

            this.#containerBeforeCanvas = createDivStyle5("width: calc(100%);height:300px;", "Borrowed Fields", this.getBodyElement())[1];
            AddCssStyle("overflow-y:auto;", this.#containerBeforeCanvas);
            this.borrowFieldsContainer = this.#containerBeforeCanvas;

            this.#containerAfterCanvas = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            this.#gapBetweenXField = createInput_Infield("Gap Between Panels (x)", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);
            this.#gapBetweenYField = createInput_Infield("Gap Between Panels (y)", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.updateFromFields();}, this.#containerAfterCanvas, true, 10);
      }

      updateFromFields() {
            super.updateFromFields();
            this.draw();
            this.#dragZoomCanvas.updateFromFields();
      }

      Close() {
            this.returnAllBorrowedFields();
            this.#dragZoomCanvas.Close();
      }

      rects = [];
      measurements = [];
      DrawRect(params) {
            let rect = new TSVGRectangle(this.#dragZoomCanvas.svgG, {
                  fill: "blue",
                  strokeWidth: 2 / this.#dragZoomCanvas.scale,
                  stroke: "black",
                  opacity: 1,
                  usePattern: false,
                  patternType: 'hatchHorizontal',// Available patternType values: 'hatch45', 'hatchHorizontal', 'hatchVertical', 'soil'
                  hatchFill: 'none',
                  hatchLineColor: 'black',
                  hatchLineWidth: 4,
                  hatchSpacing: 20,
                  ...params
            });

            this.rects.push(rect);

            return rect.rect;
      }

      draw() {
            for(let r = this.rects.length - 1; r >= 0; r--) {
                  this.rects[r].Delete();
            }
            this.rects = [];

            for(let r = this.measurements.length - 1; r >= 0; r--) {
                  this.measurements[r].Delete();
            }
            this.measurements = [];
            /// let canvasCtx = this.#dragZoomCanvas.canvasCtx;
            ///let canvasScale = this.#dragZoomCanvas.scale;

            let xo = 0, yo = 0;

            for(let i = 0; i < this.#sizeArrays.length; i++) {//per parent subscriptions matrix (i.e. Sheet or Size Matrix)
                  for(let j = 0; j < this.#sizeArrays[i].length; j++) {//per sheet subscription matrix
                        let matrixSize = this.#sizeArrays[i][j];

                        let isFirstRow, isFirstColumn, isLastRow, isLastColumn = false;

                        for(let r = 0; r < matrixSize.length; r++) {//per matrix row
                              xo = 0;
                              isFirstRow = r == 0;
                              isLastRow = r == matrixSize.length - 1;

                              for(let c = 0; c < matrixSize[r].length; c++) {//per matrix column i.e. size [w, h]
                                    isFirstColumn = c == 0;
                                    isLastColumn = c == matrixSize[r].length - 1;

                                    let [rectWidth, rectHeight] = matrixSize[r][c];

                                    let rectWidth_Initial = rectWidth;

                                    //draw matrixSize
                                    ///drawRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Black, 1);
                                    let rect = this.DrawRect({
                                          x: xo,
                                          y: yo,
                                          width: rectWidth,
                                          height: rectHeight,
                                          usePattern: this.hasGrain,
                                          patternType: ((this.flipped && this.grainDirection == "With Short Side") || (!this.flipped && this.grainDirection == "With Long Side")) ? 'hatchHorizontal' : 'hatchVertical'

                                    });

                                    ///if(isFirstRow) drawMeasurement_Verbose(canvasCtx, xo, yo, rectWidth, 0, "T", roundNumber(rectWidth, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, true, "B", false, canvasScale);

                                    if(isFirstRow) {
                                          this.measurements.push(new TSVGMeasurement(this.#dragZoomCanvas.svgG, {
                                                direction: "width",
                                                x1: xo,
                                                y1: yo,
                                                x2: xo + rectWidth,
                                                y2: yo,
                                                autoLabel: true,
                                                text: roundNumber(rectWidth, 2) + " mm",
                                                deletable: true,
                                                unit: "mm",
                                                precision: 2,
                                                scale: 1,
                                                arrowSize: 5,
                                                textOffset: 10 / this.#dragZoomCanvas.scale,
                                                stroke: "#000",
                                                sides: ["top"],
                                                lineWidth: 2 / this.#dragZoomCanvas.scale,
                                                fontSize: 12 / this.#dragZoomCanvas.scale + "px",
                                                tickLength: 20 / this.#dragZoomCanvas.scale,
                                                handleRadius: 8 / this.#dragZoomCanvas.scale,
                                                offsetX: 0,
                                                offsetY: -20 / this.#dragZoomCanvas.scale
                                          }));
                                    }


                                    ///if(isFirstColumn) drawMeasurement_Verbose(canvasCtx, xo, yo, 0, rectHeight, "L", roundNumber(rectHeight, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, this.#offsetFromShape, false, "R", false, canvasScale);

                                    if(isFirstColumn) {
                                          this.measurements.push(new TSVGMeasurement(this.#dragZoomCanvas.svgG, {
                                                direction: "height",
                                                x1: xo,
                                                y1: yo,
                                                x2: xo,
                                                y2: yo + rectHeight,
                                                autoLabel: true,
                                                text: roundNumber(rectHeight, 2) + " mm",
                                                deletable: true,
                                                unit: "mm",
                                                precision: 2,
                                                scale: 1,
                                                arrowSize: 5,
                                                textOffset: 10 / this.#dragZoomCanvas.scale,
                                                stroke: "#000",
                                                sides: ["left"],
                                                lineWidth: 2 / this.#dragZoomCanvas.scale,
                                                fontSize: 12 / this.#dragZoomCanvas.scale + "px",
                                                tickLength: 20 / this.#dragZoomCanvas.scale,
                                                handleRadius: 8 / this.#dragZoomCanvas.scale,
                                                offsetX: -20 / this.#dragZoomCanvas.scale,
                                                offsetY: 0,
                                                sideHint: "left"
                                          }));
                                    }


                                    ///drawFillRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Red, 0.3);

                                    //draw grain
                                    if(this.hasGrain) {
                                          rect.setAttribute('usePattern', true);
                                          rect.setAttribute('useHatch', 'hatchHorizontal');

                                          console.log(this.flipped, this.grainDirection);
                                          if(!this.flipped && this.grainDirection == "With Long Side") {
                                                let numberOfGrains = (rectHeight / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      ///drawLine_WH(canvasCtx, xo, yo + ((g + 1) * 20), rectWidth, 0, COLOUR.Blue, 1, 1);
                                                }
                                          } if(!this.flipped && this.grainDirection == "With Short Side") {
                                                let numberOfGrains = (rectWidth / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      ///drawLine_WH(canvasCtx, xo + ((g + 1) * 20), yo, 0, rectHeight, COLOUR.Blue, 1, 1);
                                                }
                                          } if(this.flipped && this.grainDirection == "With Long Side") {
                                                let numberOfGrains = (rectWidth / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      ///drawLine_WH(canvasCtx, xo + ((g + 1) * 20), yo, 0, rectHeight, COLOUR.Blue, 1, 1);
                                                }
                                          } if(this.flipped && this.grainDirection == "With Short Side") {
                                                let numberOfGrains = (rectHeight / 20) - 1;
                                                for(let g = 0; g < numberOfGrains; g++) {
                                                      ///drawLine_WH(canvasCtx, xo, yo + ((g + 1) * 20), rectWidth, 0, COLOUR.Blue, 1, 1);
                                                }

                                          }
                                    }

                                    if(this.isFolded) {
                                          console.log(this.folds);
                                          //top
                                          if(this.folds[0].checked && isFirstRow) {
                                                ///drawLine_WH(canvasCtx, xo, yo + this.depth, rectWidth, 0, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //left
                                          if(this.folds[1].checked && isFirstColumn) {
                                                ///drawLine_WH(canvasCtx, xo + this.depth, yo, 0, rectHeight, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //right
                                          if(this.folds[2].checked && isLastColumn) {
                                                ///drawLine_WH(canvasCtx, xo + rectWidth - this.depth, yo, 0, rectHeight, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //bottom
                                          if(this.folds[3].checked && isLastRow) {
                                                ///drawLine_WH(canvasCtx, xo, yo + rectHeight - this.depth, rectWidth, 0, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }

                                          //top/Left corner
                                          if(this.folds[0].checked && this.folds[1].checked && isFirstRow && isFirstColumn) {
                                                ///drawFillRect(canvasCtx, xo - 1, yo - 1, this.depth + 2, this.#depth + 2, "TL", COLOUR.White, 1);
                                          }
                                          //top/right corner
                                          if(this.folds[0].checked && this.folds[2].checked && isFirstRow && isLastColumn) {
                                                ///drawFillRect(canvasCtx, xo + rectWidth + 1, yo - 1, this.depth + 2, this.#depth + 2, "TR", COLOUR.White, 1);
                                          }
                                          //bottom/left corner
                                          if(this.folds[3].checked && this.folds[1].checked && isLastRow && isFirstColumn) {
                                                ///drawFillRect(canvasCtx, xo - 1, yo + rectHeight - this.depth - 1, this.depth + 2, this.#depth + 2, "TL", COLOUR.White, 1);
                                          }
                                          //bottom/right corner
                                          if(this.folds[3].checked && this.folds[2].checked && isLastRow && isLastColumn) {
                                                ///drawFillRect(canvasCtx, xo + rectWidth + 1, yo + rectHeight - this.depth - 1, this.depth + 2, this.#depth + 2, "TR", COLOUR.White, 1);
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
