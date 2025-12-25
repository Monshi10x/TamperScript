class ModalVinylJoins extends ModalWidthHeight {

      #ID = "ModalVinylJoins " + generateUniqueID();
      dragZoomSVG;
      #borrowedFields = [];

      get svgFile() {return this.dragZoomSVG.svgFile;}
      get unscaledSVGString() {return this.dragZoomSVG.unscaledSVGString;}

      //An array of multiple parents matrixSizes
      sizeArrays = [];
      setSizeArrays(...sizeArrays) {
            this.sizeArrays = sizeArrays;
            this.UpdateFromFields();
      }

      #bleedTopField;
      #bleedBottomField;
      #bleedLeftField;
      #bleedRightField;
      setBleedFields(top, bottom, left, right) {
            this.#bleedTopField = top;
            this.#bleedBottomField = bottom;
            this.#bleedLeftField = left;
            this.#bleedRightField = right;
      }

      get bleedTop() {return zeroIfNaNNullBlank(this.#bleedTopField?.value) || 0;};
      get bleedBottom() {return zeroIfNaNNullBlank(this.#bleedBottomField?.value) || 0;};
      get bleedLeft() {return zeroIfNaNNullBlank(this.#bleedLeftField?.value) || 0;};
      get bleedRight() {return zeroIfNaNNullBlank(this.#bleedRightField?.value) || 0;};


      #joinOrientationField;
      setJoinOrientationField(field) {
            this.#joinOrientationField = field;
      }

      get joinOrientation() {
            if(this.#joinOrientationField?.checked) return "Horizontal";
            return "Vertical";
      }

      #rollWidthField;
      setRollWidthField(field) {
            this.#rollWidthField = field;
      }

      get rollWidth() {return zeroIfNaNNullBlank(this.#rollWidthField?.value) || 1370;};

      #joinOverlapField;
      setJoinOverlapField(field) {
            this.#joinOverlapField = field;
      }

      get joinOverlap() {return zeroIfNaNNullBlank(this.#joinOverlapField?.value) || 0;};

      #gapBetweenX = 100;
      #gapBetweenXField;
      #gapBetweenY = 100;
      #gapBetweenYField;

      #textSize = 15;
      #lineWidth = 1;
      #crossScale = 0.2;
      #offsetFromShape = 15;

      #maintainGapBetweenBleed = true;
      #maintainGapBetweenBleedField;

      #gapSettingsContainer;
      #containerBeforeCanvas;
      #containerAfterCanvas;

      /*override*/get shouldShowOnCreation() {return false;};

      constructor(headerText, incrementAmount, callback, sheetClass) {
            super(headerText, incrementAmount, callback);

            this.sheetClass = sheetClass;

            this.flipped = false;

            setFieldDisabled(true, this.widthField[1], this.widthField[0]);
            setFieldDisabled(true, this.heightField[1], this.heightField[0]);

            this.#gapSettingsContainer = createDivStyle5(null, "Gap Settings", this.getBodyElement())[1];

            this.#gapBetweenXField = createInput_Infield("gapBetweenX", this.#gapBetweenX, null, () => {this.#gapBetweenX = zeroIfNaNNullBlank(this.#gapBetweenXField[1].value); this.UpdateFromFields();}, this.#gapSettingsContainer, true, 10);
            this.#gapBetweenYField = createInput_Infield("gapBetweenY", this.#gapBetweenY, null, () => {this.#gapBetweenY = zeroIfNaNNullBlank(this.#gapBetweenYField[1].value); this.UpdateFromFields();}, this.#gapSettingsContainer, true, 10);

            this.#maintainGapBetweenBleedField = createCheckbox_Infield("maintainGapBetweenBleed", this.#maintainGapBetweenBleed, null, () => {this.#maintainGapBetweenBleed = this.#maintainGapBetweenBleedField[1].checked; this.UpdateFromFields();}, this.#gapSettingsContainer, () => {this.#maintainGapBetweenBleed = this.#maintainGapBetweenBleedField[1].checked; this.UpdateFromFields();});

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];
            AddCssStyle("overflow-y:auto;", this.#containerBeforeCanvas);
            this.borrowFieldsContainer = this.#containerBeforeCanvas;

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

            this.#containerAfterCanvas = createDivStyle5(null, "View Settings", this.getBodyElement())[1];
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

            /** @info Draw Each Sheet from matrixSizes, per parent */
            let distanceBetweenParentDraws = 1000;

            //for(let i = 0; i < this.sizeArrays.length; i++) {//per parent subscriptions matrix (i.e. Sheet or Size Matrix)
            if(this.sizeArrays.length > 0) {
                  let i = 0;
                  for(let j = 0; j < this.sizeArrays[i].length; j++) {//per vinyl subscription matrix
                        let matrixSize = this.sizeArrays[i][j];

                        let isFirstRow, isFirstColumn = false;

                        for(let r = 0; r < matrixSize.length; r++) {//per matrix row
                              xo = 0;
                              isFirstRow = r == 0;

                              for(let c = 0; c < matrixSize[r].length; c++) {//per matrix column i.e. size [w, h]
                                    isFirstColumn = c == 0;

                                    let [rectWidth, rectHeight] = matrixSize[r][c];
                                    let [rectWidth_Initial, rectHeight_Initial] = matrixSize[r][c];

                                    //draw matrixSize without bleeds
                                    let rect = this.DrawRect({
                                          x: xo,
                                          y: yo,
                                          width: rectWidth,
                                          height: rectHeight,
                                          fill: "none"
                                    });

                                    rectWidth += (this.bleedLeft + this.bleedRight);
                                    rectHeight += (this.bleedTop + this.bleedBottom);

                                    if(isFirstRow) {
                                          this.measurements.push(new TSVGMeasurement(this.dragZoomSVG.svgG, {
                                                direction: "width",
                                                x1: xo - this.bleedLeft,
                                                y1: yo,
                                                x2: xo - this.bleedLeft + rectWidth,
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
                                                y1: yo - this.bleedTop,
                                                x2: xo,
                                                y2: yo - this.bleedTop + rectHeight,
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

                                    let times = 1;
                                    let joinAmountX = 0;
                                    let joinAmountY = 0;

                                    //joins
                                    if(Vinyl.needsJoins(rectWidth, rectHeight, this.rollWidth)) {
                                          let newSizes = Vinyl.getJoins(1, rectWidth, rectHeight, this.joinOrientation == "Horizontal", true, this.rollWidth, this.joinOverlap);

                                          times = newSizes[0].qty;

                                          if(this.joinOrientation == "Horizontal") joinAmountY = this.joinOverlap;
                                          if(this.joinOrientation == "Vertical") joinAmountX = this.joinOverlap;

                                          rectWidth = newSizes[0].width;
                                          rectHeight = newSizes[0].height;
                                    }

                                    for(let t = 0; t < times; t++) {
                                          if(this.joinOrientation == "Horizontal") {
                                                //drawFillRect(canvasCtx, xo - this.bleedLeft, yo - this.bleedTop + (t * (rectHeight - joinAmountY)), rectWidth, rectHeight, "TL", COLOUR.Red, 0.4);
                                                let rect2 = this.DrawRect({
                                                      x: xo - this.bleedLeft,
                                                      y: yo - this.bleedTop + (t * (rectHeight - joinAmountY)),
                                                      width: rectWidth,
                                                      height: rectHeight,
                                                      fill: COLOUR.Orange,
                                                      opacity: 0.5
                                                });
                                          }
                                          if(this.joinOrientation == "Vertical") {
                                                //drawFillRect(canvasCtx, xo - this.bleedLeft + (t * (rectWidth - joinAmountX)), yo - this.bleedTop, rectWidth, rectHeight, "TL", COLOUR.Red, 0.4);
                                                let rect2 = this.DrawRect({
                                                      x: xo - this.bleedLeft + (t * (rectWidth - joinAmountX)),
                                                      y: yo - this.bleedTop,
                                                      width: rectWidth,
                                                      height: rectHeight,
                                                      fill: COLOUR.Orange,
                                                      opacity: 0.5
                                                });
                                          }
                                    }

                                    let bo = this.#maintainGapBetweenBleed ? (this.bleedLeft + this.bleedRight) : 0;

                                    if(this.joinOrientation == "Horizontal") xo += rectWidth_Initial + this.#gapBetweenX + bo;
                                    if(this.joinOrientation == "Vertical") xo += rectWidth_Initial + this.#gapBetweenX + bo;
                              }

                              let bo = this.#maintainGapBetweenBleed ? (this.bleedTop + this.bleedBottom) : 0;
                              yo += matrixSize[r][0][1] + this.#gapBetweenY + bo;
                        }
                        yo += distanceBetweenParentDraws;
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
