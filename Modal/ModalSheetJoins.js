class ModalSheetJoins extends ModalWidthHeight {

      #ID = "ModalSheetJoins " + generateUniqueID();
      dragZoomSVG;
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
            this.UpdateFromFields();
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
            if(!this.#flippedField) return false;
            return this.#flippedField.checked;
      }

      #hasGrainField;
      setHasGrainField(field) {
            this.#hasGrainField = field;
      }

      get hasGrain() {
            if(!this.#hasGrainField) return false;
            return this.#hasGrainField.checked;
      }

      #grainDirectionField;
      setGrainDirectionField(field) {
            this.#grainDirectionField = field;
      }

      get grainDirection() {
            if(!this.#grainDirectionField) return false;
            return this.#grainDirectionField.value;
      }

      #isFoldedField;
      setIsFoldedField(field) {
            this.#isFoldedField = field;
      }

      get isFolded() {
            if(!this.#isFoldedField) return false;
            return this.#isFoldedField.checked;
      }

      #foldFields = [];
      setFoldFields(topField, leftField, rightField, bottomField) {
            this.#foldFields = [topField, leftField, rightField, bottomField];
      }

      get folds() {
            if(!this.#foldFields) return false;
            return [
                  this.#foldFields[0],
                  this.#foldFields[1],
                  this.#foldFields[2],
                  this.#foldFields[3]];
      }

      #foldDepth;
      setFoldDepth(field) {this.#foldDepth = field;}
      get foldDepth() {return this.#foldDepth;}

      get svgFile() {return this.dragZoomSVG.svgFile;}
      get unscaledSVGString() {return this.dragZoomSVG.unscaledSVGString;}

      #gapBetweenX = 0;
      #gapBetweenXField;
      #gapBetweenY = 0;
      #gapBetweenYField;

      #containerBeforeCanvas;
      #containerAfterCanvas;

      /*override*/get shouldShowOnCreation() {return false;};

      constructor(headerText, incrementAmount, callback, sheetClass) {
            super(headerText, incrementAmount, callback);

            this.sheetClass = sheetClass;

            setFieldDisabled(true, this.widthField[1], this.widthField[0]);
            setFieldDisabled(true, this.heightField[1], this.heightField[0]);


            this.svgContainer = createDiv("width:100%;", null, this.getBodyElement());

            this.dragZoomSVG = new DragZoomSVG(/*this.container.getBoundingClientRect().width*/"calc(100%)", "500px", null, this.svgContainer,
                  {
                        convertShapesToPaths: true,
                        splitCompoundPaths: false,
                        scaleStrokeOnScroll: true,
                        scaleFontOnScroll: true,
                        defaultStrokeWidth: 1,
                        defaultFontSize: 12
                  });
            this.dragZoomSVG.onTransform = () => {this.draw();};

            this.#containerBeforeCanvas = createDivStyle5("width: calc(100%);height:300px;", "Borrowed Fields", this.getBodyElement())[1];
            AddCssStyle("overflow-y:auto;", this.#containerBeforeCanvas);
            this.borrowFieldsContainer = this.#containerBeforeCanvas;

            this.#containerAfterCanvas = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            this.#gapBetweenXField = createInput_Infield("Gap Between Panels (x)", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.UpdateFromFields();}, this.#containerAfterCanvas, true, 10);
            this.#gapBetweenYField = createInput_Infield("Gap Between Panels (y)", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.UpdateFromFields();}, this.#containerAfterCanvas, true, 10);
      }

      show() {
            super.show();

            this.modalOpaqueBackground.style.zIndex = "1004";

            if(this.dragZoomSVG) {
                  setTimeout(() => {
                        this.dragZoomSVG.centerAndFitSVGContent();
                  }, 1);
            }
      }

      UpdateFromFields() {
            super.UpdateFromFields();

            if(this.dragZoomSVG) {
                  this.draw();
                  this.dragZoomSVG.UpdateFromFields();
            }
      }

      shapes = [];
      measurements = [];
      DrawRect(params) {
            let rect = new TSVGRectangle(this.dragZoomSVG.svgG, {
                  fill: COLOUR.LightBlue,
                  strokeWidth: 2 / this.dragZoomSVG.scale,
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

            this.shapes.push(rect);

            return rect.rect;
      }

      DrawLine(params) {
            let line = new TSVGLine(this.dragZoomSVG.svgG, {
                  stroke: 'black',
                  'stroke-width': 2 / this.dragZoomSVG.scale,
                  ...params
            });

            this.shapes.push(line);

            return line.line;
      }

      draw() {
            for(let r = this.shapes.length - 1; r >= 0; r--) {
                  this.shapes[r].Delete();
            }
            this.shapes = [];

            for(let r = this.measurements.length - 1; r >= 0; r--) {
                  this.measurements[r].Delete();
            }
            this.measurements = [];

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
                                    let rect = this.DrawRect({
                                          x: xo,
                                          y: yo,
                                          width: rectWidth,
                                          height: rectHeight,
                                          usePattern: this.hasGrain,
                                          patternType: ((this.flipped && this.grainDirection == "With Short Side") || (!this.flipped && this.grainDirection == "With Long Side")) ? 'hatchHorizontal' : 'hatchVertical'

                                    });

                                    if(isFirstRow) {
                                          this.measurements.push(new TSVGMeasurement(this.dragZoomSVG.svgG, {
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
                                                arrowSize: 10 / this.dragZoomSVG.scale,
                                                textOffset: 10 / this.dragZoomSVG.scale,
                                                stroke: "#000",
                                                sides: ["top"],
                                                lineWidth: 2 / this.dragZoomSVG.scale,
                                                fontSize: 12 / this.dragZoomSVG.scale + "px",
                                                tickLength: 20 / this.dragZoomSVG.scale,
                                                handleRadius: 8 / this.dragZoomSVG.scale,
                                                offsetX: 0,
                                                offsetY: -20 / this.dragZoomSVG.scale
                                          }));
                                    }

                                    if(isFirstColumn) {
                                          this.measurements.push(new TSVGMeasurement(this.dragZoomSVG.svgG, {
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
                                                arrowSize: 10 / this.dragZoomSVG.scale,
                                                textOffset: 10 / this.dragZoomSVG.scale,
                                                stroke: "#000",
                                                sides: ["left"],
                                                lineWidth: 2 / this.dragZoomSVG.scale,
                                                fontSize: 12 / this.dragZoomSVG.scale + "px",
                                                tickLength: 20 / this.dragZoomSVG.scale,
                                                handleRadius: 8 / this.dragZoomSVG.scale,
                                                offsetX: -20 / this.dragZoomSVG.scale,
                                                offsetY: 0,
                                                sideHint: "left"
                                          }));
                                    }

                                    //draw grain
                                    if(this.hasGrain) {
                                          rect.setAttribute('usePattern', true);
                                          rect.setAttribute('useHatch', 'hatchHorizontal');
                                    }

                                    if(this.isFolded) {
                                          //top
                                          if(this.folds[0].checked && isFirstRow) {
                                                this.DrawLine({
                                                      x1: xo,
                                                      y1: yo + this.foldDepth,
                                                      x2: xo + rectWidth,
                                                      y2: yo + this.foldDepth,
                                                      stroke: "red"
                                                });
                                                ///drawLine_WH(canvasCtx, xo, yo + this.foldDepth, rectWidth, 0, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //left
                                          if(this.folds[1].checked && isFirstColumn) {
                                                this.DrawLine({
                                                      x1: xo + this.foldDepth,
                                                      y1: yo,
                                                      x2: xo + this.foldDepth,
                                                      y2: yo + rectHeight,
                                                      stroke: "red"
                                                });
                                                ///drawLine_WH(canvasCtx, xo + this.foldDepth, yo, 0, rectHeight, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //right
                                          if(this.folds[2].checked && isLastColumn) {
                                                this.DrawLine({
                                                      x1: xo + rectWidth - this.foldDepth,
                                                      y1: yo,
                                                      x2: xo + rectWidth - this.foldDepth,
                                                      y2: yo + rectHeight,
                                                      stroke: "red"
                                                });
                                                ///drawLine_WH(canvasCtx, xo + rectWidth - this.foldDepth, yo, 0, rectHeight, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }
                                          //bottom
                                          if(this.folds[3].checked && isLastRow) {
                                                this.DrawLine({
                                                      x1: xo,
                                                      y1: yo + rectHeight - this.foldDepth,
                                                      x2: xo + rectWidth,
                                                      y2: yo + rectHeight - this.foldDepth,
                                                      stroke: "red"
                                                });
                                                ///drawLine_WH(canvasCtx, xo, yo + rectHeight - this.foldDepth, rectWidth, 0, COLOUR.Black, 1, 1, {stroke: [10, 10]});
                                          }

                                          //top/Left corner
                                          if(this.folds[0].checked && this.folds[1].checked && isFirstRow && isFirstColumn) {
                                                ///drawFillRect(canvasCtx, xo - 1, yo - 1, this.foldDepth + 2, this.#foldDepth + 2, "TL", COLOUR.White, 1);
                                          }
                                          //top/right corner
                                          if(this.folds[0].checked && this.folds[2].checked && isFirstRow && isLastColumn) {
                                                ///drawFillRect(canvasCtx, xo + rectWidth + 1, yo - 1, this.foldDepth + 2, this.#foldDepth + 2, "TR", COLOUR.White, 1);
                                          }
                                          //bottom/left corner
                                          if(this.folds[3].checked && this.folds[1].checked && isLastRow && isFirstColumn) {
                                                ///drawFillRect(canvasCtx, xo - 1, yo + rectHeight - this.foldDepth - 1, this.foldDepth + 2, this.#foldDepth + 2, "TL", COLOUR.White, 1);
                                          }
                                          //bottom/right corner
                                          if(this.folds[3].checked && this.folds[2].checked && isLastRow && isLastColumn) {
                                                ///drawFillRect(canvasCtx, xo + rectWidth + 1, yo + rectHeight - this.foldDepth - 1, this.foldDepth + 2, this.#foldDepth + 2, "TR", COLOUR.White, 1);
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
            //this.returnAllBorrowedFields();
            super.hide();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            if(this.dragZoomSVG) this.dragZoomSVG.canvasWidth = this.container.getBoundingClientRect().width;
            this.UpdateFromFields();
      }
}
