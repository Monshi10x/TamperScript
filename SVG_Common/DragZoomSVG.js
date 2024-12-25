class DragZoomSVG {

      //@see https://github.com/timmywil/panzoom/
      //@see https://github.com/anvaka/panzoom/blob/main/README.md
      //@see https://github.com/thednp/svg-path-commander

      #xOffset = 0;
      #yOffset = 0;

      #scale = 1;
      get scale() {return this.#scale;}
      set scale(value) {this.#scale = value;}

      #scrollSpeed = 0.2;

      #ctxLineWidth = 3;

      #measurementOffset_Small = 10;
      #measurementOffset_Large = 50;
      #textOffset = 5;

      #holding;

      #allowPanning = true;
      #allowZoom = true;

      #activeTool;


      #mouseXY = {x: 0, y: 0};

      #originToMouseOffset = {x: 0, y: 0};

      #svg;
      get svg() {return this.#svg;}

      set svgWidth(width) {this.#svg.width.baseVal.value = width;}
      get svgWidth() {return this.#svg.width.baseVal.value;}
      set svgHeight(height) {this.#svg.height.baseVal.value = height;}
      get svgHeight() {return this.#svg.height.baseVal.value;}

      #container;

      #svgIsLoaded = false;

      #drawFunction = null;

      moveFunctionRef;
      mouseupFunctionRef;

      #panZoomInstance;

      #addOverallMeasure = true;

      #totalArea = 0;

      #outerPathElements = [];
      #innerPathElements = [];

      #measurementElements = [];
      #areaElements = [];
      #scaleMeasurementsWithScale = false;

      constructor(svgWidth, svgHeight, svgText, drawFunction, parentToAppendTo) {
            this.#drawFunction = drawFunction;

            this.#container = document.createElement("div");
            this.#container.innerHTML += svgText;
            this.#container.style = "display: block;float: left;outline:1px solid black;";
            this.#container.style.cssText += "width:" + svgWidth + "px;height:" + svgHeight + "px;";
            this.#container.className = "svgContainerDiv";

            this.#svg = this.#container.querySelector("svg");

            this.#svg.setAttribute("width", svgWidth);
            this.#svg.setAttribute("height", svgHeight);

            if(parentToAppendTo) parentToAppendTo.appendChild(this.#container);

            let g = document.createElementNS('http://www.w3.org/2000/svg', "g");
            g.id = "mainGcreatedByT";
            let numChildren = this.#svg.children.length;

            for(let i = 0; i < numChildren; i++) {
                  g.appendChild(this.#svg.children[0]);
            }
            this.#svg.appendChild(g);

            let _this = this;

            this.#panZoomInstance = panzoom(g, {
                  zoomSpeed: this.#scrollSpeed,
                  beforeMouseDown: function(e) {
                        return !_this.onBeforeMouseDown(e);
                  },
                  beforeWheel: function(e) {
                        return !_this.onBeforeWheel(e);
                  }
            });
            this.#panZoomInstance.on('zoom', (e) => {
                  this.onZoom(e);
            });


            this.scale = this.#panZoomInstance.getTransform().scale;

            this.convertShapesToPaths();

            this.formatCompoundPaths();
            this.addSVGStyles();
            this.addOverallMeasures();

            this.getTotalPathLengths();

            let self = this;
            self.moveFunctionRef = function(e) {self.onMouseMove(e);};//necessary for removeEventListener
            self.mouseupFunctionRef = function(e) {self.onMouseUp(e);};//necessary for removeEventListener

            window.addEventListener('mousemove', self.moveFunctionRef);
            $(this.#svg).mousedown((e) => {this.onMouseDown(e);});
            window.addEventListener('mouseup', self.mouseupFunctionRef);

            this.#container.onmouseover = (e) => this.onHoverEnter(e);
            this.#container.onmouseout = (e) => this.onHoverExit(e);
      }

      Close() {
            window.removeEventListener('mousemove', this.moveFunctionRef);
            window.removeEventListener('mouseup', this.mouseupFunctionRef);
      }

      onHoverEnter(e) {
            this.#container.style.outlineColor = COLOUR.Blue;
      }

      onHoverExit(e) {
            this.#container.style.outlineColor = COLOUR.Black;
      }

      onMouseDown(e) {
            e.preventDefault();

            this.updateMouseXY(e);

            this.#svg.style.cursor = "grabbing";
            this.#holding = true;

            this.updateTools("Mouse Down");
      }

      onMouseMove(e) {
            e.preventDefault();

            this.updateMouseXY(e);

            this.updateTools("Mouse Move");

            if(this.#holding) {
                  this.draw();
            }
      }

      onMouseUp(e) {
            this.updateMouseXY(e);

            this.#svg.style.cursor = "auto";
            this.#holding = false;

            this.updateTools("Mouse Up");
      }

      onBeforeMouseDown(e) {
            if(this.#allowPanning == false) return false;
            else return true;
      }

      onBeforeWheel(e) {
            if(this.#allowZoom == false) return false;
            else return true;
      }

      onZoom(e) {
            this.scale = this.#panZoomInstance.getTransform().scale;

            for(let i = 0; i < this.#innerPathElements.length; i++) {
                  this.#innerPathElements[i].style.cssText += 'stroke-width:' + (2 / this.scale) + ";";
            }
            for(let i = 0; i < this.#outerPathElements.length; i++) {
                  this.#outerPathElements[i].style.cssText += 'stroke-width:' + (2 / this.scale) + ";";
            }

            if(this.#scaleMeasurementsWithScale) {
                  for(let i = 0; i < this.#measurementElements.length; i++) {
                        this.#measurementElements[i].setAttribute('stroke-width', 2 / this.scale);
                        this.#measurementElements[i].style.cssText += "font-size:" + 25 / this.scale + "px;";
                  }
            }

      }

      convertShapesToPaths() {
            let svgElements = this.#svg.getElementsByTagName("*");

            for(let i = 0; i < svgElements.length; i++) {
                  if(svgElements[i].nodeName != "g" && svgElements[i].nodeName != "path") {
                        let newShape = SVGPathCommander.shapeToPath(svgElements[i], true);
                  }
            }
      }

      getTotalPathLengths() {
            let totalPathLength = 0;
            let svgElements = this.#svg.getElementsByTagName("path");

            for(let i = 0; i < svgElements.length; i++) {
                  console.log(svgElements[i]);
                  totalPathLength += svg_getPathLength_mm(svgElements[i]);
            }
            console.log("Total Path Length: " + totalPathLength);
            return totalPathLength;
      }

      async getTotalPathArea_m2() {

            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let svgElements = mainGroup.getElementsByTagName("path");

            this.#totalArea = 0;

            let webWorker;
            let webWorkerFinished = false;

            let self = this;
            if(typeof (Worker) !== "undefined") {
                  console.log("window enabled worker");
                  webWorker = new Worker(GM_getResourceURL("SVGWebWorker"));

                  let elementDs = [];
                  let isElementInnerPath = [];
                  for(let i = 0; i < svgElements.length; i++) {
                        elementDs.push(svgElements[i].getAttribute("d"));
                        isElementInnerPath.push(svgElements[i].classList.contains("innerPath"));
                  }

                  webWorker.postMessage({
                        elementDs: elementDs,
                        isElementInnerPath: isElementInnerPath
                  });
                  webWorker.onmessage = async function(event) {
                        console.log("DragZoomSVG.js recieves message from Webworker", event);
                        if(event.data.totalArea) self.#totalArea = event.data.totalArea;
                        if(event.data.shapeAreas) {
                              for(let i = 0; i < svgElements.length; i++) {
                                    svgElements[i].setAttribute("data-area", event.data.shapeAreas[i]);
                              }
                              console.log(event.data.shapeAreas);
                        }
                        webWorker.terminate();
                        webWorkerFinished = true;
                  };

                  await new Promise(resolve => {
                        var resolvedStatus = 'reject';
                        var timer = setInterval(() => {
                              if(webWorkerFinished == true) {
                                    resolvedStatus = 'fulfilled';
                                    resolve();
                                    clearInterval(timer);
                                    timer = undefined;
                              } else {
                                    resolvedStatus = 'reject';
                              }
                        }, 10);
                  });
                  return this.#totalArea;
            } else {
                  console.error("window disabled worker :(");
            }
      }

      addSVGStyles() {
            let svgElements = this.#svg.getElementsByTagName("path");
            let mainGroup = this.svg.querySelector("#mainGcreatedByT");

            for(let i = 0; i < svgElements.length; i++) {
                  //if(svgElements[i].nodeName == "g") continue;

                  svgElements[i].setAttribute('stroke-miterlimit', `0`);

                  let isSelected = false;

                  svgElements[i].addEventListener("mouseover", (e) => {
                        if(isSelected) return;

                        if(svgElements[i].classList.contains("outerPath")) {
                              svgElements[i].style.cssText += 'stroke:#00ff00';
                        }
                        if(svgElements[i].classList.contains("innerPath")) {
                              svgElements[i].style.cssText += 'stroke:maroon';
                        }
                  });
                  svgElements[i].addEventListener("mouseout", (e) => {
                        if(isSelected) return;

                        if(svgElements[i].classList.contains("outerPath")) {
                              svgElements[i].style.cssText += 'stroke:green';
                        }
                        if(svgElements[i].classList.contains("innerPath")) {
                              svgElements[i].style.cssText += 'stroke:red';
                        }
                  });
                  svgElements[i].addEventListener("click", (e) => {

                        isSelected = !isSelected;
                        if(isSelected) {
                              svgElements[i].setAttribute('stroke-dasharray', `35,10`);
                        } else {
                              svgElements[i].removeAttribute('stroke-dasharray');
                        }
                  });
            }
      }

      formatCompoundPaths() {
            console.log("is formatted", (2 / this.scale));
            let mainGroup = this.svg.querySelector("#mainGcreatedByT");

            let newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newGroup.id = "pathGroup";
            mainGroup.appendChild(newGroup);

            let svgElements = mainGroup.getElementsByTagName("path");
            let svgElementsLength = svgElements.length;

            //format outer/inner paths
            for(let i = 0; i < svgElementsLength; i++) {

                  let pathString = svgElements[i].getAttribute("d");
                  let pathStringSplitOverZ = pathString.split("Z");

                  let outerPathParent_id;
                  for(let j = 0; j < pathStringSplitOverZ.length; j++) {
                        if(pathStringSplitOverZ[j] == "") continue;
                        //Outer Compound

                        if(j == 0) {
                              let compoundPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                              compoundPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                              compoundPathElement.style = "stroke:green;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:none;";
                              compoundPathElement.className.baseVal = "outerPath";
                              outerPathParent_id = generateUniqueID("outerPath-");
                              compoundPathElement.id = outerPathParent_id;
                              newGroup.appendChild(compoundPathElement);
                              this.#outerPathElements.push(compoundPathElement);
                              ;
                        }
                        //if has Inner compound paths
                        else {
                              let compoundPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                              compoundPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                              compoundPathElement.style = "stroke:red;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:none;";
                              compoundPathElement.className.baseVal = "innerPath";
                              compoundPathElement.setAttribute("data-outerPathParent", outerPathParent_id);
                              newGroup.appendChild(compoundPathElement);
                              this.#innerPathElements.push(compoundPathElement);
                        }
                  }
            }

            //remove previous unformatted elements
            let elemsToDelete = [];
            for(let i = 0; i < svgElementsLength; i++) {
                  elemsToDelete.push(svgElements[i]);
            }
            for(let i = 0; i < elemsToDelete.length; i++) {
                  deleteElement(elemsToDelete[i]);
            }

      }

      async showArea_PolygonApproximation() {
            console.log("showArea_PolygonApproximation");
            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let svgElements = mainGroup.getElementsByTagName("path");

            for(let i = 0; i < svgElements.length; i++) {

                  let pathPointsArray = convertPathToPolygon(svgElements[i]);
                  let area = svg_pixelToMM(svg_pixelToMM(calculateAreaOfPolygon(pathPointsArray))) / 1000000;

                  mainGroup.appendChild(createPolygonFromPoints(pathPointsArray));
                  this.createText(roundNumber(area, 2), pathPointsArray[0], mainGroup);
            }
      }

      showArea_Real() {
            console.log("showArea_Real");
            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let svgElements = mainGroup.getElementsByTagName("path");

            for(let i = 0; i < svgElements.length; i++) {
                  let area = getShapeArea(svgElements[i], 7);
                  this.createText2(roundNumber(area, 3), svgElements[i]);
            }


      }

      createText(textString, locationPoint, parentToAppendTo) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.innerHTML = textString;
            text.setAttribute('fill', `#ff00ff`);
            text.setAttribute('x', locationPoint.x);
            text.setAttribute('y', locationPoint.y);
            parentToAppendTo.appendChild(text);
      }

      createText2(textString, parentToAppendTo) {
            let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.innerHTML = textString;
            text.setAttribute('fill', `#ff00ff`);

            parentToAppendTo.appendChild(text);
      }

      showOverallMeasures() {
            let elements = this.svg.querySelector("#overallMeasures");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addOverallMeasures();
      }

      hideOverallMeasures() {
            let elements = this.svg.querySelector("#overallMeasures");
            $(elements).hide();
      }

      addOverallMeasures() {
            let timer = setInterval(function() {next();}, 100);

            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.svg.querySelector("#pathGroup");

            let next = () => {
                  let clientRect = pathGroup.getBoundingClientRect();
                  if(clientRect.width == 0) return;
                  else clearInterval(timer);


                  let scaledBox = {
                        width: svg_pixelToMM(pathGroup.getBoundingClientRect().width / this.scale),
                        height: svg_pixelToMM(pathGroup.getBoundingClientRect().height / this.scale),
                  };

                  if(this.#addOverallMeasure) {
                        let newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "overallMeasures";

                        let widthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        widthText.innerHTML = roundNumber(scaledBox.width, 2) + " mmW";
                        widthText.style = "font-size:" + 25 / this.scale + "px;";
                        widthText.setAttribute('fill', `rgb(206, 206, 206)`);
                        widthText.setAttribute('text-anchor', "middle");
                        widthText.setAttribute('dominant-baseline', "Auto");
                        widthText.setAttribute('x', ((pathGroup.getBoundingClientRect().width) / 2) / this.scale);
                        widthText.setAttribute('y', '' + ((- this.#measurementOffset_Large) - 10) / this.scale);

                        let widthLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        widthLine.setAttribute('stroke', `rgb(206, 206, 206)`);
                        widthLine.setAttribute('stroke-width', 2 / this.scale);
                        widthLine.setAttribute('x1', `0`);
                        widthLine.setAttribute('y1', (- this.#measurementOffset_Large) / this.scale);
                        widthLine.setAttribute('x2', pathGroup.getBoundingClientRect().width / this.scale);
                        widthLine.setAttribute('y2', (- this.#measurementOffset_Large) / this.scale);

                        let heightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        heightText.innerHTML = roundNumber(scaledBox.height, 2) + " mmH";
                        heightText.setAttribute('fill', `rgb(206, 206, 206)`);
                        heightText.setAttribute('text-anchor', "middle");
                        heightText.setAttribute('dominant-baseline', "Auto");
                        heightText.style = "font-size:" + 25 / this.scale + "px;";
                        heightText.setAttribute('x', (- this.#measurementOffset_Large - 10) / this.scale);
                        heightText.setAttribute('y', (pathGroup.getBoundingClientRect().height / 2) / this.scale);
                        heightText.setAttribute('transform', "rotate(270," +
                              ((- this.#measurementOffset_Large - 10) / this.scale) +
                              "," +
                              ((pathGroup.getBoundingClientRect().height / 2) / this.scale) + ")");


                        let heightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                        heightLine.setAttribute('stroke', `rgb(206, 206, 206)`);
                        heightLine.setAttribute('stroke-width', 2 / this.scale);
                        heightLine.setAttribute('x1', `` + (0 - this.#measurementOffset_Large) / this.scale);
                        heightLine.setAttribute('y1', `0`);
                        heightLine.setAttribute('x2', `` + (0 - this.#measurementOffset_Large) / this.scale);
                        heightLine.setAttribute('y2', '' + (pathGroup.getBoundingClientRect().height - this.#measurementOffset_Small) / this.scale);

                        this.#measurementElements.push(widthText);
                        this.#measurementElements.push(widthLine);
                        this.#measurementElements.push(heightText);
                        this.#measurementElements.push(heightLine);

                        newGroup.appendChild(widthText);
                        newGroup.appendChild(widthLine);
                        newGroup.appendChild(heightText);
                        newGroup.appendChild(heightLine);

                        mainGroup.appendChild(newGroup);
                  }
            };
      }

      showElementMeasures() {
            let elements = this.svg.querySelector("#itemMeasures");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");
            for(let i = 0; i < elements.length; i++) {
                  this.addElementMeasures(elements[i]);
            }
      }

      hideElementMeasures() {
            let elements = this.svg.querySelector("#itemMeasures");
            $(elements).hide();
      }

      addElementMeasures(element) {
            let timer = setInterval(function() {next();}, 100);

            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.svg.querySelector("#pathGroup");

            let next = () => {
                  let clientRect = element.getBoundingClientRect();
                  if(clientRect.width == 0) return;
                  else clearInterval(timer);

                  //in mm
                  let scaledBox = {
                        width: element.getBoundingClientRect().width / this.scale,
                        height: element.getBoundingClientRect().height / this.scale,
                        x: ((element.getBoundingClientRect().x - pathGroup.getBoundingClientRect().x) / this.scale),
                        y: ((element.getBoundingClientRect().y - pathGroup.getBoundingClientRect().y) / this.scale)
                  };

                  let newGroup = mainGroup.querySelector("#itemMeasures");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "itemMeasures";
                        mainGroup.appendChild(newGroup);
                  }

                  let widthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  widthText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.width), 2) + " mmW";
                  widthText.style = "font-size:" + 12 / this.scale + "px;";
                  widthText.setAttribute('fill', `rgb(206, 206, 206)`);
                  widthText.setAttribute('text-anchor', "middle");
                  widthText.setAttribute('dominant-baseline', "Auto");
                  widthText.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
                  widthText.setAttribute('y', scaledBox.y + (- this.#measurementOffset_Small - this.#textOffset) / this.scale);

                  let widthLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                  widthLine.setAttribute('stroke', `rgb(206, 206, 206)`);
                  widthLine.setAttribute('stroke-width', 2 / this.scale);
                  widthLine.setAttribute('x1', scaledBox.x);
                  widthLine.setAttribute('y1', scaledBox.y + (- this.#measurementOffset_Small) / this.scale);
                  widthLine.setAttribute('x2', (scaledBox.x + scaledBox.width));
                  widthLine.setAttribute('y2', scaledBox.y + (- this.#measurementOffset_Small) / this.scale);

                  let heightText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  heightText.innerHTML = roundNumber(svg_pixelToMM(scaledBox.height), 2) + " mmH";
                  heightText.setAttribute('fill', `rgb(206, 206, 206)`);
                  heightText.style = "font-size:" + 12 / this.scale + "px;";
                  heightText.setAttribute('text-anchor', "middle");
                  heightText.setAttribute('dominant-baseline', "Auto");
                  heightText.setAttribute('x', scaledBox.x + (- this.#measurementOffset_Small - this.#textOffset) / this.scale);
                  heightText.setAttribute('y', scaledBox.y + (scaledBox.height / 2));
                  heightText.setAttribute('transform', "rotate(270," +
                        (scaledBox.x + (- this.#measurementOffset_Small - this.#textOffset) / this.scale) +
                        "," +
                        (scaledBox.y + (scaledBox.height / 2)) + ")");

                  let heightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                  heightLine.setAttribute('stroke', `rgb(206, 206, 206)`);
                  heightLine.setAttribute('stroke-width', 2 / this.scale);
                  heightLine.setAttribute('x1', scaledBox.x + (- this.#measurementOffset_Small) / this.scale);
                  heightLine.setAttribute('y1', scaledBox.y);
                  heightLine.setAttribute('x2', scaledBox.x + (- this.#measurementOffset_Small) / this.scale);
                  heightLine.setAttribute('y2', scaledBox.y + scaledBox.height);

                  this.#measurementElements.push(widthText);
                  this.#measurementElements.push(widthLine);
                  this.#measurementElements.push(heightText);
                  this.#measurementElements.push(heightLine);

                  newGroup.appendChild(widthText);
                  newGroup.appendChild(widthLine);
                  newGroup.appendChild(heightText);
                  newGroup.appendChild(heightLine);
            };
      }

      showShapeAreas() {
            let elements = this.svg.querySelector("#shapeAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");

            this.addShapeAreas();

      }

      hideShapeAreas() {
            let elements = this.svg.querySelector("#shapeAreas");
            $(elements).hide();
      }

      addShapeAreas() {

            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.svg.querySelector("#pathGroup");

            for(let i = 0; i < this.#outerPathElements.length; i++) {

                  let timer = setInterval(function() {next();}, 100);

                  let next = () => {
                        let element = this.#outerPathElements[i];
                        let elementId = element.id;
                        let elementArea = zeroIfNaNNullBlank(element.getAttribute("data-area"));


                        let clientRect = element.getBoundingClientRect();
                        if(clientRect.width == 0) return;
                        else clearInterval(timer);

                        let childrenArea = 0;
                        for(let j = 0; j < this.#innerPathElements.length; j++) {
                              //if inner path has this element as parent (outer-path)
                              if(this.#innerPathElements[j].getAttribute("data-outerPathParent") == elementId) {
                                    childrenArea += zeroIfNaNNullBlank(this.#innerPathElements[j].getAttribute("data-area"));
                              }
                        }

                        let shapeArea = elementArea + childrenArea; //note: positive because children areas are negative already.


                        //in mm
                        let scaledBox = {
                              width: element.getBoundingClientRect().width / this.scale,
                              height: element.getBoundingClientRect().height / this.scale,
                              x: ((element.getBoundingClientRect().x - pathGroup.getBoundingClientRect().x) / this.scale),
                              y: ((element.getBoundingClientRect().y - pathGroup.getBoundingClientRect().y) / this.scale)
                        };

                        let newGroup = mainGroup.querySelector("#shapeAreas");

                        if(!newGroup) {
                              newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                              newGroup.id = "shapeAreas";
                              mainGroup.appendChild(newGroup);
                        }

                        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        text.innerHTML = roundNumber(shapeArea, 2) + " m2";
                        text.style = "font-size:" + 12 / this.scale + "px;";
                        text.setAttribute('fill', `rgb(206, 206, 206)`);
                        text.setAttribute('text-anchor', "middle");
                        text.setAttribute('dominant-baseline', "middle");
                        text.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
                        text.setAttribute('y', scaledBox.y + (scaledBox.height / 2));

                        this.#areaElements.push(text);

                        newGroup.appendChild(text);
                  };
            }
      }

      showPartAreas() {
            let elements = this.svg.querySelector("#partAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");
            for(let i = 0; i < elements.length; i++) {
                  this.addPartAreas(elements[i]);
            }
      }

      hidePartAreas() {
            let elements = this.svg.querySelector("#partAreas");
            $(elements).hide();
      }

      addPartAreas(element) {
            let timer = setInterval(function() {next();}, 100);

            let mainGroup = this.svg.querySelector("#mainGcreatedByT");
            let pathGroup = this.svg.querySelector("#pathGroup");

            let next = () => {
                  let clientRect = element.getBoundingClientRect();
                  if(clientRect.width == 0) return;
                  else clearInterval(timer);

                  //in mm
                  let scaledBox = {
                        width: element.getBoundingClientRect().width / this.scale,
                        height: element.getBoundingClientRect().height / this.scale,
                        x: ((element.getBoundingClientRect().x - pathGroup.getBoundingClientRect().x) / this.scale),
                        y: ((element.getBoundingClientRect().y - pathGroup.getBoundingClientRect().y) / this.scale)
                  };

                  let newGroup = mainGroup.querySelector("#partAreas");

                  if(!newGroup) {
                        newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        newGroup.id = "partAreas";
                        mainGroup.appendChild(newGroup);
                  }

                  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  text.innerHTML = roundNumber(element.getAttribute("data-area"), 2) + " m2";
                  text.style = "font-size:" + 12 / this.scale + "px;";
                  text.setAttribute('fill', `rgb(206, 206, 206)`);
                  text.setAttribute('text-anchor', "middle");
                  text.setAttribute('dominant-baseline', "middle");
                  text.setAttribute('x', scaledBox.x + (scaledBox.width / 2));
                  text.setAttribute('y', scaledBox.y + (scaledBox.height / 2));

                  this.#areaElements.push(text);

                  newGroup.appendChild(text);
            };
      }

      updateMouseXY(e) {

            this.#mouseXY = {
                  //x: clamp(e.clientX - this.#svg.getBoundingClientRect().x, 0, this.svgWidth),
                  //y: clamp(e.clientY - this.#svg.getBoundingClientRect().y, 0, this.svgHeight),
                  x: e.clientX - this.#svg.getBoundingClientRect().x,
                  y: e.clientY - this.#svg.getBoundingClientRect().y
            };

            console.log(this.#mouseXY);
      }

      updateFromFields() {

      }

      draw() {
            if(this.#drawFunction != null) {
                  this.#drawFunction();
            } else {
                  console.log("no draw function provided");
            }
      }

      setCurrentTool(tool) {
            this.#activeTool = tool;
            this.updateTools("Tool Selected");
      }

      updateTools(state) {
            console.log("current tool " + this.#activeTool, state);
            switch(this.#activeTool) {
                  case "Selection Tool":
                        this.#allowPanning = false;

                        if(state == "Mouse Down") {
                              this.selectionRect = new TSVGRect(this.svg, null, this.#mouseXY.x, this.#mouseXY.y, 0, 0);
                              this.selectionRect_mouseDownPos = this.#mouseXY;
                        } else if(state == "Mouse Move") {
                              if(this.#holding) {
                                    let distX = this.#mouseXY.x - this.selectionRect_mouseDownPos.x;
                                    let distY = this.#mouseXY.y - this.selectionRect_mouseDownPos.y;

                                    if(distX >= 0) {
                                          this.selectionRect.width = distX;
                                          this.selectionRect.x = this.selectionRect_mouseDownPos.x;
                                    }
                                    else {
                                          this.selectionRect.width = Math.abs(this.selectionRect_mouseDownPos.x - this.#mouseXY.x);
                                          this.selectionRect.x = this.#mouseXY.x;
                                    }

                                    if(distY >= 0) {
                                          this.selectionRect.height = distY;
                                          this.selectionRect.y = this.selectionRect_mouseDownPos.y;
                                    }
                                    else {
                                          this.selectionRect.height = Math.abs(this.selectionRect_mouseDownPos.y - this.#mouseXY.y);
                                          this.selectionRect.y = this.#mouseXY.y;
                                    }


                                    //this.selectionRect.width = this.#mouseXY.x - this.selectionRect.x;
                                    //this.selectionRect.height = this.#mouseXY.y - this.selectionRect.y;
                              }
                        } else if(state == "Mouse Up") {
                              this.selectionRect.Delete();
                        }
                        break;
                  default:
                        this.#allowPanning = true;
                        break;
            }
      }

}