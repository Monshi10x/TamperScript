class ModalStandoffHelper2 extends ModalWidthHeight {

      #ID = "ModalSheetJoins2 " + generateUniqueID();
      #dragZoomSVG;
      #borrowedFields = [];

      #textSize = 15;
      #lineWidth = 1;
      #crossScale = 0.2;

      #standOffDiameter = 19;

      #totalNumber = 0;
      get qty() {return this.#totalNumber;}

      /** @info Draw Each Sheet from matrixSizes, per parent */
      #distanceBetweenParentDraws = 1000;

      //An array of multiple parents matrixSizes
      #sizeArrays = [];
      setSizeArrays(...sizeArrays) {
            this.#sizeArrays = sizeArrays;
            this.UpdateFromFields();
      }

      #gapBetweenX = 0;
      #gapBetweenXField;
      #gapBetweenY = 0;
      #gapBetweenYField;
      #diameterField;

      #offsetFromEdgeField;
      setOffsetFromEdgeField(field) {
            this.#offsetFromEdgeField = field;
      }
      #horizontalSpacingField;
      setHorizontalSpacingField(field) {
            this.#horizontalSpacingField = field;
      }
      #verticalSpacingField;
      setVerticalSpacingField(field) {
            this.#verticalSpacingField = field;
      }
      #spacingAllowanceField;
      setSpacingAllowanceField(field) {
            this.#spacingAllowanceField = field;
      }

      #containerBeforeCanvas;
      #containerAfterCanvas;

      get diameter() {return parseFloat(this.#standOffTypeField.value.split(",")[0]);}

      set offsetFromEdge(value) {$(this.#offsetFromEdgeField).val(value).change();}
      get offsetFromEdge() {return parseFloat(this.#offsetFromEdgeField.value);}

      set horizontalSpacing(value) {$(this.#horizontalSpacingField).val(value).change();}
      get horizontalSpacing() {return parseFloat(this.#horizontalSpacingField.value);}

      set verticalSpacing(value) {$(this.#verticalSpacingField).val(value).change();}
      get verticalSpacing() {return parseFloat(this.#verticalSpacingField.value);}

      set spacingAllowance(value) {$(this.#spacingAllowanceField).val(value).change();}
      get spacingAllowance() {return parseFloat(this.#spacingAllowanceField.value);}

      #standOffTypeField;
      setTypeField(field) {
            this.#standOffTypeField = field;

            $(field).on('change', () => {
                  this.UpdateFromFields();
            });
      }

      get svgFile() {return this.#dragZoomSVG.svgFile;}
      get unscaledSVGString() {return this.#dragZoomSVG.unscaledSVGString;}

      constructor(headerText, incrementAmount, callback, sheetClass) {
            super(headerText, incrementAmount, callback);

            this.sheetClass = sheetClass;

            setFieldDisabled(true, this.widthField[1], this.widthField[0]);
            setFieldDisabled(true, this.heightField[1], this.heightField[0]);

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];
            this.borrowFieldsContainer = this.#containerBeforeCanvas;

            //this.#dragZoomCanvas = new DragZoomCanvas(this.container.getBoundingClientRect().width, 400, () => this.draw(), this.getBodyElement());

            this.#dragZoomSVG = new DragZoomSVG(/*this.container.getBoundingClientRect().width*/"calc(100%)", "500px", '<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="1243.89mm" height="988.13mm" viewBox="0 0 3526 2801"></svg>', this.getBodyElement(),
                  {
                        convertShapesToPaths: true,
                        splitCompoundPaths: false,
                        scaleStrokeOnScroll: true,
                        scaleFontOnScroll: true,
                        defaultStrokeWidth: 1,
                        defaultFontSize: 12
                  });
            this.#dragZoomSVG.onTransform = () => {this.draw();};

            this.#containerAfterCanvas = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            this.#gapBetweenXField = createInput_Infield("gapBetweenX", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.UpdateFromFields();}, this.#containerAfterCanvas, true, 10);
            this.#gapBetweenYField = createInput_Infield("gapBetweenY", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.UpdateFromFields();}, this.#containerAfterCanvas, true, 10);
      }

      UpdateFromFields() {
            super.UpdateFromFields();
            this.draw();
            this.#dragZoomSVG.UpdateFromFields();
      }


      Close() {
            //this.returnAllBorrowedFields();
            this.#dragZoomSVG.Close();
      }

      rects = [];
      measurements = [];
      DrawRect(params) {
            let rect = new TSVGRectangle(this.#dragZoomSVG.svgG, {
                  fill: COLOUR.LightBlue,
                  strokeWidth: 2 / this.#dragZoomSVG.scale,
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

      DrawCircle(params) {
            let circle = new TSVGCircle(this.#dragZoomSVG.svgG, {
                  fill: COLOUR.White,
                  strokeWidth: 2 / this.#dragZoomSVG.scale,
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

            this.rects.push(circle);

            return circle.circle;
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

            //let canvasCtx = this.#dragZoomCanvas.canvasCtx;
            // let canvasScale = this.#dragZoomCanvas.scale;

            let xo = 0, yo = 0;

            this.#totalNumber = 0;
            console.log(this.#sizeArrays);
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

                                    //draw sheetSize
                                    ///drawRect(canvasCtx, xo, yo, rectWidth, rectHeight, "TL", COLOUR.Black, 1);
                                    //draw matrixSize
                                    let rect = this.DrawRect({
                                          x: xo,
                                          y: yo,
                                          width: rectWidth,
                                          height: rectHeight
                                    });

                                    //draw Measurements
                                    ///if(isFirstRow) drawMeasurement_Verbose(canvasCtx, xo, yo, rectWidth, 0, "T", roundNumber(rectWidth, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, 20, true, "B", false, canvasScale);
                                    ///if(isFirstColumn) drawMeasurement_Verbose(canvasCtx, xo, yo, 0, rectHeight, "L", roundNumber(rectHeight, 2), this.#textSize, COLOUR.Blue, this.#lineWidth, this.#crossScale, 20, false, "R", false, canvasScale);
                                    if(isFirstRow) {
                                          this.measurements.push(new TSVGMeasurement(this.#dragZoomSVG.svgG, {
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
                                                arrowSize: 10 / this.#dragZoomSVG.scale,
                                                textOffset: 10 / this.#dragZoomSVG.scale,
                                                stroke: "#000",
                                                sides: ["top"],
                                                lineWidth: 2 / this.#dragZoomSVG.scale,
                                                fontSize: 12 / this.#dragZoomSVG.scale + "px",
                                                tickLength: 20 / this.#dragZoomSVG.scale,
                                                handleRadius: 8 / this.#dragZoomSVG.scale,
                                                offsetX: 0,
                                                offsetY: -20 / this.#dragZoomSVG.scale
                                          }));
                                    }

                                    if(isFirstColumn) {
                                          this.measurements.push(new TSVGMeasurement(this.#dragZoomSVG.svgG, {
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
                                                arrowSize: 10 / this.#dragZoomSVG.scale,
                                                textOffset: 10 / this.#dragZoomSVG.scale,
                                                stroke: "#000",
                                                sides: ["left"],
                                                lineWidth: 2 / this.#dragZoomSVG.scale,
                                                fontSize: 12 / this.#dragZoomSVG.scale + "px",
                                                tickLength: 20 / this.#dragZoomSVG.scale,
                                                handleRadius: 8 / this.#dragZoomSVG.scale,
                                                offsetX: -20 / this.#dragZoomSVG.scale,
                                                offsetY: 0,
                                                sideHint: "left"
                                          }));
                                    }

                                    //draw Stand-offs
                                    let numberTop = 2 + Math.ceil((rectWidth - 2 * this.offsetFromEdge) / clamp((this.horizontalSpacing + this.spacingAllowance), 1, Infinity));
                                    let spacingTop = (rectWidth - 2 * this.offsetFromEdge) / (numberTop - 2);
                                    let numberLeft = 2 + Math.ceil((rectHeight - 2 * this.offsetFromEdge) / clamp((this.verticalSpacing + this.spacingAllowance), 1, Infinity));
                                    let spacingLeft = (rectHeight - 2 * this.offsetFromEdge) / (numberLeft - 2);

                                    //top
                                    for(let x = 0; x < numberTop - 1; x++) {
                                          this.#totalNumber++;
                                          let circle = this.DrawCircle({
                                                cx: xo + this.offsetFromEdge + spacingTop * x,
                                                cy: yo + this.offsetFromEdge,
                                                r: this.diameter / 2,
                                          });
                                    }
                                    //bottom
                                    for(let x = 0; x < numberTop - 1; x++) {
                                          this.#totalNumber++;
                                          let circle = this.DrawCircle({
                                                cx: xo + this.offsetFromEdge + spacingTop * x,
                                                cy: yo + rectHeight - this.offsetFromEdge,
                                                r: this.diameter / 2,
                                          });
                                    }
                                    //left
                                    for(let x = 0; x < numberLeft - 1; x++) {
                                          if(x == 0 || x == (numberLeft - 2)) continue;
                                          this.#totalNumber++;
                                          let circle = this.DrawCircle({
                                                cx: xo + this.offsetFromEdge,
                                                cy: yo + this.offsetFromEdge + spacingLeft * x,
                                                r: this.diameter / 2,
                                          });
                                    }
                                    //right
                                    for(let x = 0; x < numberLeft - 1; x++) {
                                          if(x == 0 || x == (numberLeft - 2)) continue;
                                          this.#totalNumber++;
                                          let circle = this.DrawCircle({
                                                cx: xo + rectWidth - this.offsetFromEdge,
                                                cy: yo + this.offsetFromEdge + spacingLeft * x,
                                                r: this.diameter / 2,
                                          });
                                    }

                                    //Standoff measurements
                                    if(isFirstRow && isFirstColumn) {
                                          /*top*/
                                          ///drawMeasurement_Verbose(canvasCtx, xo + this.offsetFromEdge, yo, spacingTop, 0, "T", roundNumber(spacingTop, 2), this.#textSize, COLOUR.DarkGrey, this.#lineWidth, this.#crossScale, 60, true, "B", false, canvasScale);
                                          /*left*/
                                          ///drawMeasurement_Verbose(canvasCtx, xo, yo + this.offsetFromEdge, 0, spacingLeft, "L", roundNumber(spacingLeft, 2), this.#textSize, COLOUR.DarkGrey, this.#lineWidth, this.#crossScale, 60, false, "R", false, canvasScale);
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

      callback() {
            super.callback();
            this.Close();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            //this.#dragZoomCanvas.canvasWidth = this.container.getBoundingClientRect().width;
            this.UpdateFromFields();
      }
}
