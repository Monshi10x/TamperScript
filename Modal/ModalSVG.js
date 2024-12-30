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

      get getTotalPathLengths() {return this.#dragZoomSVG.getTotalPathLengths();}
      get currentTool() {return this.#activeTool;}

      constructor(headerText, incrementAmount, callback, svgText) {
            super(headerText, incrementAmount, callback);

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];

            this.#dragZoomSVG = new DragZoomSVG(this.container.getBoundingClientRect().width, 500, svgText, this.getBodyElement());
            this.#dragZoomSVG.onMouseUpdate = this.onMouseUpdate;

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

            this.#controlsContainer = createDivStyle5(null, "Controls", this.getBodyElement())[1];

            let selectionTool = createIconButton(GM_getResourceURL("Icon_Select"), null, "width:50px;height:50px;background-color:" + COLOUR.DarkGrey, () => {
                  IFELSEF(this.currentTool != "Selection Tool", () => {this.setCurrentTool("Selection Tool");}, () => {this.setCurrentTool("null");});
                  IFELSEF(selectionTool.style.borderColor != "red", () => {selectionTool.style.borderColor = "red";}, () => {selectionTool.style.borderColor = COLOUR.DarkGrey;});
            }, this.#controlsContainer, true);

            this.loadPathArea();
            this.loadBoundingRectAreas();
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

      updateFromFields() {
            this.#dragZoomSVG.updateFromFields();
      }

      hide() {
            this.#dragZoomSVG.Close();
            this.returnAllBorrowedFields();
            super.hide();
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            this.#dragZoomSVG.svgWidth = this.container.getBoundingClientRect().width;
            this.updateFromFields();
      }

      addOverallMeasures() {

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");
            let pathGroupBounds = pathGroup.getBBox();
            let svgScale = this.#dragZoomSVG.scale;

            // let clientRect = pathGroup.getBBox();

            //in mm
            let scaledBox = {
                  width: pathGroupBounds.width,
                  height: pathGroupBounds.height,
                  x: pathGroupBounds.x,
                  y: pathGroupBounds.y
            };

            let newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newGroup.id = "overallMeasures";

            let widthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            widthText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.width), 2) + " mmW";
            widthText.style = "font-size:" + this.#measurementOffset_Large / svgScale + "px;";
            widthText.setAttribute('fill', `rgb(206, 206, 206)`);
            widthText.setAttribute('text-anchor', "middle");
            widthText.setAttribute('dominant-baseline', "Auto");
            widthText.setAttribute('x', scaledBox.x + scaledBox.width / 2);
            widthText.setAttribute('y', scaledBox.y - (this.#measurementOffset_Large + this.#textOffset) / svgScale);

            let widthLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            widthLine.setAttribute('stroke', `rgb(206, 206, 206)`);
            widthLine.setAttribute('stroke-width', 2 / svgScale);
            widthLine.setAttribute('x1', scaledBox.x);
            widthLine.setAttribute('y1', scaledBox.y - this.#measurementOffset_Large / svgScale);
            widthLine.setAttribute('x2', scaledBox.x + scaledBox.width);
            widthLine.setAttribute('y2', scaledBox.y - this.#measurementOffset_Large / svgScale);

            let heightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            heightText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.height), 2) + " mmH";
            heightText.setAttribute('fill', `rgb(206, 206, 206)`);
            heightText.setAttribute('text-anchor', "middle");
            heightText.setAttribute('dominant-baseline', "Auto");
            heightText.style = "font-size:" + this.#measurementOffset_Large / svgScale + "px;";
            heightText.setAttribute('x', scaledBox.x - (this.#measurementOffset_Large + this.#textOffset) / svgScale);
            heightText.setAttribute('y', scaledBox.y + scaledBox.height / 2);
            heightText.setAttribute('transform', "rotate(270," +
                  ((- this.#measurementOffset_Large - this.#textOffset) / svgScale) +
                  "," +
                  ((scaledBox.y + scaledBox.height / 2)) + ")");


            let heightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            heightLine.setAttribute('stroke', `rgb(206, 206, 206)`);
            heightLine.setAttribute('stroke-width', 2 / svgScale);
            heightLine.setAttribute('x1', scaledBox.x - this.#measurementOffset_Large / svgScale);
            heightLine.setAttribute('y1', scaledBox.y);
            heightLine.setAttribute('x2', scaledBox.x - this.#measurementOffset_Large / svgScale);
            heightLine.setAttribute('y2', scaledBox.y + scaledBox.height);

            newGroup.appendChild(widthText);
            newGroup.appendChild(widthLine);
            newGroup.appendChild(heightText);
            newGroup.appendChild(heightLine);

            mainGroup.appendChild(newGroup);
      }

      showOverallMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#overallMeasures");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addOverallMeasures();
      }

      hideOverallMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#overallMeasures");
            if(elements) $(elements).hide();
      }

      addElementMeasures(element) {

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let svgScale = this.#dragZoomSVG.scale;
            let clientRect = element.getBBox();

            //in mm
            let scaledBox = {
                  width: clientRect.width,
                  height: clientRect.height,
                  x: clientRect.x,
                  y: clientRect.y
            };

            let newGroup = mainGroup.querySelector("#itemMeasures");

            if(!newGroup) {
                  newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  newGroup.id = "itemMeasures";
                  mainGroup.appendChild(newGroup);
            }

            let widthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            widthText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.width), 2) + " mmW";
            widthText.style = "font-size:" + 12 / svgScale + "px;";
            widthText.setAttribute('fill', `rgb(206, 206, 206)`);
            widthText.setAttribute('text-anchor', "middle");
            widthText.setAttribute('dominant-baseline', "Auto");
            widthText.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
            widthText.setAttribute('y', scaledBox.y + (- this.#measurementOffset_Small - this.#textOffset) / svgScale);

            let widthLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            widthLine.setAttribute('stroke', `rgb(206, 206, 206)`);
            widthLine.setAttribute('stroke-width', 2 / svgScale);
            widthLine.setAttribute('x1', scaledBox.x);
            widthLine.setAttribute('y1', scaledBox.y + (- this.#measurementOffset_Small) / svgScale);
            widthLine.setAttribute('x2', (scaledBox.x + scaledBox.width));
            widthLine.setAttribute('y2', scaledBox.y + (- this.#measurementOffset_Small) / svgScale);

            let heightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            heightText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.height), 2) + " mmH";
            heightText.setAttribute('fill', `rgb(206, 206, 206)`);
            heightText.style = "font-size:" + 12 / svgScale + "px;";
            heightText.setAttribute('text-anchor', "middle");
            heightText.setAttribute('dominant-baseline', "Auto");
            heightText.setAttribute('x', scaledBox.x + (- this.#measurementOffset_Small - this.#textOffset) / svgScale);
            heightText.setAttribute('y', scaledBox.y + (scaledBox.height / 2));
            heightText.setAttribute('transform', "rotate(270," +
                  (scaledBox.x + (- this.#measurementOffset_Small - this.#textOffset) / svgScale) +
                  "," +
                  (scaledBox.y + (scaledBox.height / 2)) + ")");

            let heightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            heightLine.setAttribute('stroke', `rgb(206, 206, 206)`);
            heightLine.setAttribute('stroke-width', 2 / svgScale);
            heightLine.setAttribute('x1', scaledBox.x + (- this.#measurementOffset_Small) / svgScale);
            heightLine.setAttribute('y1', scaledBox.y);
            heightLine.setAttribute('x2', scaledBox.x + (- this.#measurementOffset_Small) / svgScale);
            heightLine.setAttribute('y2', scaledBox.y + scaledBox.height);

            newGroup.appendChild(widthText);
            newGroup.appendChild(widthLine);
            newGroup.appendChild(heightText);
            newGroup.appendChild(heightLine);

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
            console.log("in addShapeBoundingRect");

            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");
            let svgScale = this.#dragZoomSVG.scale;

            let outerPathElements = this.#dragZoomSVG.outerPathElements;
            //let innerPathElements = this.#dragZoomSVG.innerPathElements;

            for(let i = 0; i < outerPathElements.length; i++) {

                  let element = outerPathElements[i];
                  let clientRect = element.getBBox();

                  //in mm
                  let scaledBox = {
                        width: clientRect.width,
                        height: clientRect.height,
                        x: clientRect.x,
                        y: clientRect.y
                  };

                  let newGroup = mainGroup.querySelector("#shapeBoundingRects");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "shapeBoundingRects";
                        mainGroup.appendChild(newGroup);
                  }

                  let boundingRect = new TSVGRect(newGroup, "stroke-width:" + 1 / svgScale + ";stroke:black;fill:#ddd;opacity:0.4", scaledBox.x, scaledBox.y, scaledBox.width, scaledBox.height);
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
                        x: ((element.getBoundingClientRect().x - pathGroup.getBoundingClientRect().x) / svgScale),
                        y: ((element.getBoundingClientRect().y - pathGroup.getBoundingClientRect().y) / svgScale)
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
                              this.selectionRect = new TSVGRect(this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT"), "stroke-width:" + (1 / this.#dragZoomSVG.scale), this.selectionRect_mouseDownPos.x, this.selectionRect_mouseDownPos.y, 0, 0);

                        } else if(state == "Mouse Move") {
                              let mousePos = this.#dragZoomSVG.relativeMouseXY;
                              if(this.#dragZoomSVG.isHolding) {
                                    let distX = mousePos.x - this.selectionRect_mouseDownPos.x;
                                    let distY = mousePos.y - this.selectionRect_mouseDownPos.y;

                                    if(distX >= 0) {
                                          this.selectionRect.width = distX;
                                          this.selectionRect.x = this.selectionRect_mouseDownPos.x;
                                    }
                                    else {
                                          this.selectionRect.width = Math.abs(this.selectionRect_mouseDownPos.x - mousePos.x);
                                          this.selectionRect.x = mousePos.x;
                                    }

                                    if(distY >= 0) {
                                          this.selectionRect.height = distY;
                                          this.selectionRect.y = this.selectionRect_mouseDownPos.y;
                                    }
                                    else {
                                          this.selectionRect.height = Math.abs(this.selectionRect_mouseDownPos.y - mousePos.y);
                                          this.selectionRect.y = mousePos.y;
                                    }
                              }
                        } else if(state == "Mouse Up") {
                              let _x = (this.selectionRect.x),
                                    _y = (this.selectionRect.y),
                                    _width = (this.selectionRect.width),
                                    _height = (this.selectionRect.height);

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
                                    let isWithinSelection = pointInPolygon(elementFirstPoint, selectionPolygon);
                                    if(isWithinSelection) {
                                          element.classList.add("SVGSelected");
                                    }
                              }
                              if(this.selectionRect) this.selectionRect.Delete();
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

}
