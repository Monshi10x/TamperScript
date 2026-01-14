class ModalSVG extends Modal {

      #ID = "ModalSVG " + generateUniqueID();
      #dragZoomSVG;
      #borrowedFields = [];
      #measurementOffset_Small = 10;
      #measurementOffset_Large = 20;
      #textOffset = 10;
      #activeTool;

      #textSize = 15;
      #lineWidth = 1;
      #crossScale = 0.2;
      #offsetFromShape = 15;

      /** @info Draw Each Sheet from matrixSizes, per parent */
      #distanceBetweenParentDraws = 1000;

      #gapBetweenX = 0;
      #gapBetweenXField;
      #gapBetweenY = 0;
      #gapBetweenYField;

      #containerBeforeCanvas;

      #statsContainer;
      #totalPathLength;
      #totalShapeAreas;
      #viewSettingsContainer;
      #showIndividualMeasures;
      #showOverallMeasures;
      #showIndividualAreas;
      #showShapeAreas;
      #controlsContainer;
      #showShapeBoundingRect;
      #totalBoundingRectAreas;
      #svgText;
      #showPoints;
      #f_saveSVG;
      #f_cancelSave;
      #svgScale = 1;
      #svgScaleField;
      #svgBaseSize;
      #svgScaleGroup;
      #isUpdatingSvgScale = false;

      get getTotalPathLengths() {return this.#dragZoomSVG.getTotalPathLengths();}
      get currentTool() {return this.#activeTool;}
      get svgFile() {return this.#dragZoomSVG.svg.outerHTML;}

      constructor(headerText, incrementAmount, callback, svgText, callerObject, options = {
            convertShapesToPaths: true,
            splitCompoundPaths: true,
            scaleStrokeOnScroll: true,
            scaleFontOnScroll: true,
            defaultStrokeWidth: 1,
            defaultFontSize: 12
      }) {
            super(headerText, incrementAmount, callback);
            this.#svgText = svgText;

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];

            this.#dragZoomSVG = new DragZoomSVG(this.container.getBoundingClientRect().width + "px", "500px", svgText, this.getBodyElement(), options);
            this.#dragZoomSVG.onMouseUpdate = this.onMouseUpdate;
            this.#svgBaseSize = this.getSvgBaseSize(svgText);
            this.#svgScaleGroup = this.ensureScaleGroup();

            this.#statsContainer = createDivStyle5(null, "Stats", this.getBodyElement())[1];
            this.#totalPathLength = createInput_Infield("Total Paths Length", this.#dragZoomSVG.totalPathLengths, null, () => { }, this.#statsContainer, false, 1, {postfix: "mm"});
            this.#totalShapeAreas = createInput_Infield("Total Shape Areas", null, null, () => { }, this.#statsContainer, false, 1, {postfix: "m2"});
            this.#totalBoundingRectAreas = createInput_Infield("Total Bounding Rect Areas", null, null, () => { }, this.#statsContainer, false, 1, {postfix: "m2"});

            this.#viewSettingsContainer = createDivStyle5(null, "View Settings", this.getBodyElement())[1];

            let overallMeasureToggle = new Toggle(() => {this.showOverallMeasures();}, () => {this.hideOverallMeasures();});
            this.#showOverallMeasures = createCheckbox_Infield("Show Overall Measures", true, "width:250px;", () => {
                  overallMeasureToggle.toggle();
            }, this.#viewSettingsContainer);
            this.showOverallMeasures();


            let measureToggle = new Toggle(() => {this.hideElementMeasures();}, () => {this.showElementMeasures();});
            this.#showIndividualMeasures = createCheckbox_Infield("Show Individual Measures", false, "width:250px;", () => {
                  measureToggle.toggle();
            }, this.#viewSettingsContainer);

            let areaToggle = new Toggle(() => {this.hidePartAreas();}, () => {this.showPartAreas();});
            this.#showIndividualAreas = createCheckbox_Infield("Show Individual Areas", false, "width:250px;", () => {
                  areaToggle.toggle();
            }, this.#viewSettingsContainer);

            let shapeAreaToggle = new Toggle(() => {this.hideShapeAreas();}, () => {this.showShapeAreas();});
            this.#showShapeAreas = createCheckbox_Infield("Show Shape Areas", false, "width:250px;", () => {
                  shapeAreaToggle.toggle();
            }, this.#viewSettingsContainer);

            let shapeBoundingRectToggle = new Toggle(() => {this.hideShapeBoundingRect();}, () => {this.showShapeBoundingRect();});
            this.#showShapeBoundingRect = createCheckbox_Infield("Show Shape Bounding Rect", false, "width:250px;", () => {
                  shapeBoundingRectToggle.toggle();
            }, this.#viewSettingsContainer);

            let pointsToggle = new Toggle(() => {this.hideElementPoints();}, () => {this.showElementPoints();});
            this.#showPoints = createCheckbox_Infield("Show Points", false, "width:250px;", () => {
                  pointsToggle.toggle();
            }, this.#viewSettingsContainer);

            this.#svgScaleField = createInput_Infield("SVG Scale", this.#svgScale, "width:250px;", () => {
                  this.updateSvgScaleFromField();
            }, this.#viewSettingsContainer, false, 0.1);

            this.#controlsContainer = createDivStyle5(null, "Controls", this.getBodyElement())[1];
            this.#svgScaleField = createInput_Infield("SVG Scale", this.#svgScale, "width:250px;", () => {
                  this.updateSvgScaleFromField();
            }, this.#controlsContainer, false, 0.1);

            let deleteTool;
            let selectionTool;

            selectionTool = createIconButton(GM_getResourceURL("Icon_Select"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey, () => {
                  IFELSEF(this.currentTool != "Selection Tool", () => {
                        if(deleteTool.style.borderColor == "red") $(deleteTool).click();
                        this.setCurrentTool("Selection Tool");

                  }, () => {this.setCurrentTool("null");});
                  IFELSEF(selectionTool.style.borderColor != "red", () => {selectionTool.style.borderColor = "red";}, () => {selectionTool.style.borderColor = COLOUR.DarkGrey;});
            }, this.#controlsContainer, true);

            deleteTool = createIconButton(GM_getResourceURL("Icon_Bin2"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey, () => {
                  IFELSEF(this.currentTool != "Delete Tool", () => {
                        if(selectionTool.style.borderColor == "red") $(selectionTool).click();
                        this.setCurrentTool("Delete Tool");

                  }, () => {this.setCurrentTool("null");});
                  IFELSEF(deleteTool.style.borderColor != "red", () => {deleteTool.style.borderColor = "red";}, () => {deleteTool.style.borderColor = COLOUR.DarkGrey;});
            }, this.#controlsContainer, true);

            this.loadPathArea();
            this.loadBoundingRectAreas();

            ///Save Changes
            this.#f_saveSVG = createButton("Save Changes", "", () => {
                  if(callerObject instanceof SVGCutfile) {
                        let groups = Array.from(this.#dragZoomSVG.svg.getElementsByTagName("g"));

                        let pathGroup;

                        for(let i = groups.length - 1; i >= 0; i--) {
                              if(groups[i].id == "pathGroup") {
                                    pathGroup = groups[i].outerHTML;
                              }
                              if(["overallMeasures", "itemMeasures", "shapeAreas", "partAreas", "shapeBoundingRects", "itemPoints"].includes(groups[i].id)) {
                                    groups[i].remove();
                                    groups.splice(i, 1);
                              }
                        }

                        callerObject.svgFile = this.#dragZoomSVG.svg.outerHTML;
                        callerObject.onFileChange();
                  }
                  this.hide();
            }, null);
            this.#f_cancelSave = createButton("Cancel Changes", "", () => {this.hide();}, null);

            this.addFooterElement(this.#f_saveSVG);
            this.addFooterElement(this.#f_cancelSave);
            this.applySvgScale(this.#svgScale);
      }

      async loadPathArea() {
            let loader = new Loader(this.#totalShapeAreas[0]);
            let totalArea = await this.#dragZoomSVG.getTotalPathArea_m2();
            $(this.#totalShapeAreas[1]).val(totalArea).change();
            loader.Delete();
      }

      loadBoundingRectAreas() {
            let loader = new Loader(this.#totalBoundingRectAreas[0]);
            let totalArea = this.#dragZoomSVG.getTotalBoundingRectAreas_m2();
            $(this.#totalBoundingRectAreas[1]).val(totalArea).change();
            loader.Delete();
      }

      UpdateFromFields() {
            this.#dragZoomSVG.UpdateFromFields();
      }

      hide() {
            this.#dragZoomSVG.Close();
            //this.returnAllBorrowedFields();
            super.hide();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            this.#dragZoomSVG.svgWidth = this.container.getBoundingClientRect().width;
            this.UpdateFromFields();
      }

      addOverallMeasures() {

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");

            let newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newGroup.id = "overallMeasures";

            if(!pathGroup) return console.warn("no pathGroup exists");

            let measures = new TSVGMeasurement(newGroup, {
                  target: pathGroup,
                  direction: "both",
                  sides: ["top", "left"],
                  autoLabel: true,
                  unit: "mm",
                  scale: svg_pixelToMM(1),
                  precision: 2,
                  arrowSize: 10,
                  textOffset: 30,
                  stroke: "#000",
                  lineWidth: 40,
                  fontSize: "240px",
                  tickLength: 300,
                  handleRadius: 8,
                  offsetX: 300,
                  offsetY: 300,
                  sideHint: null
            });

            mainGroup.appendChild(newGroup);
      }

      showOverallMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#overallMeasures");
            if(!elements) $(elements).show();

            this.addOverallMeasures();
      }

      hideOverallMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#overallMeasures");
            if(elements) $(elements).hide();
      }

      addElementMeasures(element) {
            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let newGroup = mainGroup.querySelector("#itemMeasures");

            if(!newGroup) {
                  newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  newGroup.id = "itemMeasures";
                  mainGroup.appendChild(newGroup);
            }

            let measures = new TSVGMeasurement(newGroup, {
                  target: element,
                  direction: "both",
                  sides: ["top", "left"],
                  autoLabel: true,
                  unit: "mm",
                  scale: svg_pixelToMM(1),
                  precision: 2,
                  arrowSize: 3,
                  textOffset: 5,
                  stroke: "#000",
                  lineWidth: 8,
                  fontSize: "48px",
                  tickLength: 20,
                  handleRadius: 8,
                  offsetX: 10,
                  offsetY: 10,
                  sideHint: null
            });
      }

      showElementMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#itemMeasures");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");
            for(let i = 0; i < elements.length; i++) {
                  this.addElementMeasures(elements[i]);
            }
      }

      hideElementMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#itemMeasures");
            $(elements).hide();
      }

      showShapeAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");

            this.addShapeAreas();
      }

      hideShapeAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeAreas");
            $(elements).hide();
      }

      addShapeAreas() {

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");

            let svgScale = this.#dragZoomSVG.scale;

            let outerPathElements = this.#dragZoomSVG.outerPathElements;
            let innerPathElements = this.#dragZoomSVG.innerPathElements;

            for(let i = 0; i < outerPathElements.length; i++) {

                  let element = outerPathElements[i];
                  let elementId = element.id;
                  let elementArea = zeroIfNaNNullBlank(element.getAttribute("data-area"));

                  let clientRect = element.getBBox();

                  let childrenArea = 0;
                  for(let j = 0; j < innerPathElements.length; j++) {
                        //if inner path has this element as parent (outer-path)
                        if(innerPathElements[j].getAttribute("data-outerPathParent") == elementId) {
                              childrenArea += zeroIfNaNNullBlank(innerPathElements[j].getAttribute("data-area"));
                        }
                  }

                  let shapeArea = elementArea + childrenArea; //note: positive because children areas are negative already.

                  let scaledBox = {
                        width: clientRect.width,
                        height: clientRect.height,
                        x: clientRect.x,
                        y: clientRect.y
                  };

                  let newGroup = mainGroup.querySelector("#shapeAreas");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "shapeAreas";
                        mainGroup.appendChild(newGroup);
                  }

                  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  text.innerHTML = roundNumber(shapeArea, 2) + " m2";
                  text.style = "font-size:" + 12 / svgScale + "px;";
                  text.setAttribute('fill', `rgb(206, 206, 206)`);
                  text.setAttribute('text-anchor', "middle");
                  text.setAttribute('dominant-baseline', "middle");
                  text.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
                  text.setAttribute('y', scaledBox.y + (scaledBox.height / 2));

                  newGroup.appendChild(text);

            }
      }

      showPartAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#partAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");
            for(let i = 0; i < elements.length; i++) {
                  this.addPartAreas(elements[i]);
            }
      }

      hidePartAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#partAreas");
            $(elements).hide();
      }

      addShapeBoundingRect() {
            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");
            let svgScale = this.#dragZoomSVG.scale;

            let outerPathElements = this.#dragZoomSVG.outerPathElements;

            for(let i = 0; i < outerPathElements.length; i++) {
                  let element = outerPathElements[i];
                  let clientRect = element.getBBox();

                  let newGroup = mainGroup.querySelector("#shapeBoundingRects");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "shapeBoundingRects";
                        mainGroup.appendChild(newGroup);
                  }

                  let boundingRect = new TSVGRectangle(newGroup, {
                        x: clientRect.x,
                        y: clientRect.y,
                        width: clientRect.width,
                        height: clientRect.height,
                        strokeWidth: 1 / svgScale,
                        stroke: "black",
                        fill: "#ddd",
                        opacity: 0.8
                  });
            }
      }

      showShapeBoundingRect() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeBoundingRects");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addShapeBoundingRect();
      }

      hideShapeBoundingRect() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeBoundingRects");
            $(elements).hide();
      }

      addPartAreas(element) {
            let timer = setInterval(function() {next();}, 100);

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");

            let svgScale = this.#dragZoomSVG.scale;

            let next = () => {
                  let clientRect = element.getBoundingClientRect();
                  if(clientRect.width == 0) return;
                  else clearInterval(timer);

                  //in mm
                  let scaledBox = {
                        width: element.getBoundingClientRect().width / svgScale,
                        height: element.getBoundingClientRect().height / svgScale,
                        x: ((element.getBoundingClientRect().x - pathGroup?.getBoundingClientRect().x || 0) / svgScale),
                        y: ((element.getBoundingClientRect().y - pathGroup?.getBoundingClientRect().y || 0) / svgScale)
                  };

                  let newGroup = mainGroup.querySelector("#partAreas");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "partAreas";
                        mainGroup.appendChild(newGroup);
                  }

                  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  text.innerHTML = roundNumber(element.getAttribute("data-area"), 2) + " m2";
                  text.style = "font-size:" + 12 / svgScale + "px;";
                  text.setAttribute('fill', `rgb(206, 206, 206)`);
                  text.setAttribute('text-anchor', "middle");
                  text.setAttribute('dominant-baseline', "middle");
                  text.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
                  text.setAttribute('y', scaledBox.y + (scaledBox.height / 2));

                  newGroup.appendChild(text);
            };
      }


      addElementPoints() {

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let svgScale = this.#dragZoomSVG.scale;

            let newGroup = mainGroup.querySelector("#itemPoints");

            if(!newGroup) {
                  newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  newGroup.id = "itemPoints";
                  mainGroup.appendChild(newGroup);
            }


            this.#dragZoomSVG.allPathElements.forEach((element) => {

                  let d2 = element.getAttribute("d");

                  let path2 = {
                        type: 'path',
                        d: d2
                  };

                  const points = SVGPoints.toPoints(path2);

                  console.log(points);

                  points.forEach((entry) => {
                        if(!entry.x || !entry.y) return;

                        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        circle.setAttribute('fill', `rgb(0,0,255)`);
                        circle.setAttribute('r', 1 / svgScale);
                        circle.setAttribute('cx', entry.x);
                        circle.setAttribute('cy', entry.y);

                        newGroup.appendChild(circle);
                  });

            });
      }

      showElementPoints() {
            let elements = this.#dragZoomSVG.svg.querySelector("#itemPoints");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addElementPoints();

      }

      hideElementPoints() {
            let elements = this.#dragZoomSVG.svg.querySelector("#itemPoints");
            $(elements).hide();
      }


      setCurrentTool(tool) {
            this.#activeTool = tool;
            this.updateTools("Tool Selected");
      }

      updateTools(state) {
            switch(this.#activeTool) {
                  case "Selection Tool":
                        this.#dragZoomSVG.allowPanning = false;

                        if(state == "Mouse Down") {
                              this.selectionRect_mouseDownPos = this.#dragZoomSVG.relativeMouseXY;

                              this.selectionRect = new TSVGRectangle(this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT"), {
                                    x: this.selectionRect_mouseDownPos.x,
                                    y: this.selectionRect_mouseDownPos.y,
                                    width: 0,
                                    height: 0,
                                    strokeWidth: (1 / this.#dragZoomSVG.scale),
                                    stroke: "black",
                                    fill: "#ddd",
                                    opacity: 0.8
                              });

                        } else if(state == "Mouse Move") {
                              let mousePos = this.#dragZoomSVG.relativeMouseXY;
                              if(this.#dragZoomSVG.isHolding) {
                                    let distX = mousePos.x - this.selectionRect_mouseDownPos.x;
                                    let distY = mousePos.y - this.selectionRect_mouseDownPos.y;

                                    if(distX >= 0) {
                                          this.selectionRect.setAttribute("width", distX);
                                          this.selectionRect.setAttribute("x", this.selectionRect_mouseDownPos.x);
                                    }
                                    else {
                                          this.selectionRect.setAttribute("width", Math.abs(this.selectionRect_mouseDownPos.x - mousePos.x));
                                          this.selectionRect.setAttribute("x", mousePos.x);
                                    }

                                    if(distY >= 0) {
                                          this.selectionRect.setAttribute("height", distY);
                                          this.selectionRect.setAttribute("y", this.selectionRect_mouseDownPos.y);
                                    }
                                    else {
                                          this.selectionRect.setAttribute("height", Math.abs(this.selectionRect_mouseDownPos.y - mousePos.y));
                                          this.selectionRect.setAttribute("y", mousePos.y);
                                    }
                              }
                        } else if(state == "Mouse Up") {
                              if(!this.selectionRect) break;
                              let _x = parseFloat(this.selectionRect.getAttribute("x")),
                                    _y = parseFloat(this.selectionRect.getAttribute("y")),
                                    _width = parseFloat(this.selectionRect.getAttribute("width")),
                                    _height = parseFloat(this.selectionRect.getAttribute("height"));

                              let selectionPolygon = [
                                    {x: _x, y: _y},
                                    {x: _x + _width, y: _y},
                                    {x: _x + _width, y: _y + _height},
                                    {x: _x, y: _y + _height}
                              ];

                              let pathElements = this.#dragZoomSVG.allPathElements;
                              for(let i = 0; i < pathElements.length; i++) {
                                    let element = pathElements[i];

                                    let elementFirstPoint = element.getPointAtLength(0);
                                    let isWithinSelection = svgNest_pointInPolygon(elementFirstPoint, selectionPolygon);
                                    if(isWithinSelection) {
                                          if(!element.classList.contains("innerPath")) element.classList.add("SVGSelected");
                                    }
                              }
                              if(this.selectionRect) this.selectionRect.Delete();
                        }
                        break;
                  case "Delete Tool":
                        let elementsToDelete = [];
                        this.#dragZoomSVG.allPathElements.forEach((element) => {
                              if(element.classList.contains("SVGSelected")) elementsToDelete.push(element.parentNode/*Deletes the group containing outer & inner paths*/);
                        });

                        let countToDelete = elementsToDelete.length;
                        for(let i = 0; i < countToDelete; i++) {
                              this.#dragZoomSVG.deleteElement(elementsToDelete[i]);
                        }
                        break;

                  default:
                        this.#dragZoomSVG.allowPanning = true;
                        break;
            }
      }

      /**Overrides DragZoomSVG onMouseUpdate*/
      onMouseUpdate = (updateFrom) => {
            this.updateTools(updateFrom);
      };

      parseSvgLength(value) {
            if(!value) return null;
            let match = String(value).trim().match(/^([0-9]*\.?[0-9]+)([a-z%]*)$/i);
            if(!match) return null;
            return {value: parseFloat(match[1]), unit: match[2] || ""};
      }

      getSvgBaseSize(svgText) {
            let svgElement = null;
            if(svgText) {
                  try {
                        svgElement = svg_makeFromString(svgText);
                  } catch(error) {
                        console.warn("Unable to parse SVG text for base size.");
                  }
            }

            if(!svgElement) svgElement = this.#dragZoomSVG?.svg;
            if(!svgElement) return null;

            let widthData = this.parseSvgLength(svgElement.getAttribute("width"));
            let heightData = this.parseSvgLength(svgElement.getAttribute("height"));

            if(!widthData || !heightData) {
                  let viewBox = svgElement.getAttribute("viewBox");
                  if(viewBox) {
                        let viewBoxParts = viewBox.split(/[\s,]+/).map((entry) => parseFloat(entry)).filter((entry) => !Number.isNaN(entry));
                        if(viewBoxParts.length === 4) {
                              widthData = widthData || {value: viewBoxParts[2], unit: "px"};
                              heightData = heightData || {value: viewBoxParts[3], unit: "px"};
                        }
                  }
            }

            if(!widthData || !heightData) return null;

            return {
                  width: widthData.value,
                  height: heightData.value,
                  widthUnit: widthData.unit,
                  heightUnit: heightData.unit
            };
      }

      updateSvgScaleFromField() {
            if(this.#isUpdatingSvgScale) return;
            let scaleValue = parseFloat(this.#svgScaleField[1].value);
            if(!Number.isFinite(scaleValue) || scaleValue <= 0) scaleValue = 1;
            this.#isUpdatingSvgScale = true;
            this.#svgScaleField[1].value = scaleValue;
            this.#isUpdatingSvgScale = false;
            this.applySvgScale(scaleValue);
      }

      applySvgScale(scaleValue) {
            this.#svgScale = scaleValue;
            if(this.#svgBaseSize && this.#dragZoomSVG?.svg) {
                  let width = roundNumber(this.#svgBaseSize.width * scaleValue, 6);
                  let height = roundNumber(this.#svgBaseSize.height * scaleValue, 6);
                  this.#dragZoomSVG.svg.setAttribute("width", `${width}${this.#svgBaseSize.widthUnit}`);
                  this.#dragZoomSVG.svg.setAttribute("height", `${height}${this.#svgBaseSize.heightUnit}`);
            }
            if(this.#svgScaleGroup) {
                  this.#svgScaleGroup.setAttribute("transform", `scale(${scaleValue})`);
            }
            this.updateSavePulse();
      }

      updateSavePulse() {
            if(!this.#f_saveSVG) return;
            if(this.#svgScale !== 1) {
                  this.#f_saveSVG.classList.add("urgentPulse");
                  return;
            }
            this.#f_saveSVG.classList.remove("urgentPulse");
      }

      ensureScaleGroup() {
            let mainGroup = this.#dragZoomSVG?.svg?.querySelector("#mainGcreatedByT");
            if(!mainGroup) return null;
            let scaleGroup = mainGroup.querySelector("#scaleGroup");
            if(scaleGroup) return scaleGroup;

            scaleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            scaleGroup.id = "scaleGroup";

            let children = Array.from(mainGroup.children);
            children.forEach((child) => {
                  scaleGroup.appendChild(child);
            });

            mainGroup.appendChild(scaleGroup);
            return scaleGroup;
      }

}
