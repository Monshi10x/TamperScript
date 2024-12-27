/**
 * @see https://github.com/timmywil/panzoom/
 * @see https://github.com/anvaka/panzoom/blob/main/README.md
 * @see https://github.com/thednp/svg-path-commander
 */
class DragZoomSVG {
      /*
                         
      Variables         */
      #scale = 1;
      #scrollSpeed = 0.2;
      #measurementOffset_Small = 10;
      #measurementOffset_Large = 50;
      #textOffset = 5;
      #defaultStrokeWidth = 2;
      #holding = false;
      #allowPanning = true;
      #allowZoom = true;
      #activeTool;
      #mouseXY = {x: 0, y: 0};
      #panZoomInstance;
      #addOverallMeasure = true;
      #totalArea = 0;
      #allElements = [];
      #allPathElements = [];
      #outerPathElements = [];
      #innerPathElements = [];
      #measurementElements = [];
      #areaElements = [];
      #shapeAreaPolygons = [];
      #scaleMeasurementsWithScale = false;
      #scaleStrokeOnScroll = true;
      #scaleFontOnScroll = false;
      #defaultFontSize = 12;
      /*
                        
      Fields            */
      #f_svg;
      #f_container;
      #f_moveFunctionRef;
      #f_mouseupFunctionRef;
      #f_svgG;

      /*
                        
      Getter            */
      get scale() {return this.#scale;}
      get svg() {return this.#f_svg;}
      set svgWidth(width) {this.#f_svg.width.baseVal.value = width;}
      get svgWidth() {return this.#f_svg.width.baseVal.value;}
      set svgHeight(height) {this.#f_svg.height.baseVal.value = height;}
      get svgHeight() {return this.#f_svg.height.baseVal.value;}
      /*
                        
      Setter            */
      set scale(value) {this.#scale = value;}


      /*
                        
      Start             */
      constructor(svgWidth, svgHeight, svgText, parentToAppendTo, options = {
            convertShapesToPaths: true,
            splitCompoundPaths: true,
            scaleStrokeOnScroll: true,
            scaleFontOnScroll: true,
            defaultStrokeWidth: 2,
            defaultFontSize: 12
      }) {
            let _this = this;
            this.#scaleStrokeOnScroll = options.scaleStrokeOnScroll;
            this.#defaultStrokeWidth = options.defaultStrokeWidth;
            this.#scaleFontOnScroll = options.scaleFontOnScroll;
            this.#defaultFontSize = options.defaultFontSize;

            this.#f_container = document.createElement("div");
            this.#f_container.innerHTML += svgText;
            this.#f_container.style = "display: block;float: left;outline:1px solid black;";
            this.#f_container.style.cssText += "width:" + svgWidth + "px;height:" + svgHeight + "px;";
            this.#f_container.className = "svgContainerDiv";
            if(parentToAppendTo) parentToAppendTo.appendChild(this.#f_container);

            this.#f_svg = this.#f_container.querySelector("svg");
            this.#f_svg.setAttribute("width", svgWidth);
            this.#f_svg.setAttribute("height", svgHeight);

            this.#f_svgG = document.createElementNS('http://www.w3.org/2000/svg', "g");
            this.#f_svgG.id = "mainGcreatedByT";
            let numChildren = this.#f_svg.children.length;
            for(let i = 0; i < numChildren; i++) {
                  this.#f_svgG.appendChild(this.#f_svg.children[0]);
            }
            this.#f_svg.appendChild(this.#f_svgG);

            this.#allElements = this.#f_svgG.getElementsByTagName("*");

            this.#panZoomInstance = panzoom(this.#f_svgG, {
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


            this.#scale = this.#panZoomInstance.getTransform().scale;

            if(options.convertShapesToPaths) this.convertShapesToPaths();
            if(options.splitCompoundPaths) this.splitCompoundPaths();

            this.initSVGStyles();

            _this.#f_moveFunctionRef = function(e) {_this.onMouseMove(e);};//necessary for removeEventListener
            _this.#f_mouseupFunctionRef = function(e) {_this.onMouseUp(e);};//necessary for removeEventListener

            window.addEventListener('mousemove', _this.#f_moveFunctionRef);
            $(this.#f_svg).mousedown((e) => {this.onMouseDown(e);});
            window.addEventListener('mouseup', _this.#f_mouseupFunctionRef);

            this.#f_container.onmouseover = (e) => this.onHoverEnter(e);
            this.#f_container.onmouseout = (e) => this.onHoverExit(e);
      }

      Close() {
            window.removeEventListener('mousemove', this.#f_moveFunctionRef);
            window.removeEventListener('mouseup', this.#f_mouseupFunctionRef);
      }

      onHoverEnter(e) {
            this.#f_container.style.outlineColor = COLOUR.Blue;
      }

      onHoverExit(e) {
            this.#f_container.style.outlineColor = COLOUR.Black;
      }

      onMouseDown(e) {
            e.preventDefault();

            this.updateMouseXY(e);

            this.#f_svg.style.cursor = "grabbing";
            this.#holding = true;

            this.updateTools("Mouse Down");
      }

      onMouseMove(e) {
            e.preventDefault();

            this.updateMouseXY(e);

            this.updateTools("Mouse Move");
      }

      onMouseUp(e) {
            this.updateMouseXY(e);

            this.#f_svg.style.cursor = "auto";
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

            for(let i = 0; i < this.#allElements.length; i++) {
                  if(this.#scaleStrokeOnScroll) this.#allElements[i].style.cssText += 'stroke-width:' + (this.#defaultStrokeWidth / this.scale) + ";";
                  if(this.#scaleFontOnScroll) this.#allElements[i].style.cssText += "font-size:" + (this.#defaultFontSize / this.scale) + "px;";
            }
      }

      convertShapesToPaths() {
            let svgElements = this.#f_svg.getElementsByTagName("*");

            for(let i = 0; i < svgElements.length; i++) {
                  if(svgElements[i].nodeName != "g" && svgElements[i].nodeName != "path") {
                        let element = SVGPathCommander.shapeToPath(svgElements[i], true);
                  }
            }

            this.#allElements = this.#f_svgG.getElementsByTagName("*");
      }

      get totalPathLengths() {
            let totalPathLength = 0;
            let svgElements = this.#f_svg.getElementsByTagName("path");

            for(let i = 0; i < svgElements.length; i++) {
                  totalPathLength += svg_getPathLength_mm(svgElements[i]);
            }

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
                        if(event.data.shapeAreaPolygons) self.#shapeAreaPolygons = event.data.shapeAreaPolygons;
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

      initSVGStyles() {
            let svgElements = this.#f_svg.getElementsByTagName("path");

            for(let i = 0; i < svgElements.length; i++) {
                  svgElements[i].setAttribute('stroke-miterlimit', `0`);

                  svgElements[i].addEventListener("mouseover", (e) => {
                        svgElements[i].classList.add("SVGHover");
                  });
                  svgElements[i].addEventListener("mouseout", (e) => {
                        svgElements[i].classList.remove("SVGHover");
                  });
                  svgElements[i].addEventListener("click", (e) => {
                        svgElements[i].classList.toggle("SVGSelected");
                  });
            }
      }

      /**
       * @summary separates path elements with inner paths into separate outer/inner path elements
       * @example letter 'B' will be split into 1 outer + 2 inner separate path elements 
       * @satisfies only SVGPath elements, not shapes i.e. SVGRect
       */
      splitCompoundPaths() {
            this.#allPathElements = [];

            let newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newGroup.id = "pathGroup";
            this.#f_svgG.appendChild(newGroup);

            let svgElements = this.#f_svgG.getElementsByTagName("path");
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
                              let outerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                              outerPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                              outerPathElement.style = "stroke:green;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:none;";
                              outerPathElement.className.baseVal = "outerPath";
                              outerPathParent_id = generateUniqueID("outerPath-");
                              outerPathElement.id = outerPathParent_id;
                              newGroup.appendChild(outerPathElement);
                              this.#outerPathElements.push(outerPathElement);
                              this.#allPathElements.push(outerPathElement);
                        }

                        //if has Inner compound paths
                        else {
                              let innerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                              innerPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                              innerPathElement.style = "stroke:red;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:none;";
                              innerPathElement.className.baseVal = "innerPath";
                              innerPathElement.setAttribute("data-outerPathParent", outerPathParent_id);
                              newGroup.appendChild(innerPathElement);
                              this.#innerPathElements.push(innerPathElement);
                              this.#allPathElements.push(innerPathElement);
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

            this.#allElements = this.#f_svgG.getElementsByTagName("*");
      }
      /*
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
      
      
            }*/



      /*
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
     }*/

      /////////////////////////
      showOverallMeasures() {
            let elements = this.svg.querySelector("#overallMeasures");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addOverallMeasures();
      }

      ////////////////////
      hideOverallMeasures() {
            let elements = this.svg.querySelector("#overallMeasures");
            $(elements).hide();
      }

      /////////////////////
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

      //////////////
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

      ///////
      hideElementMeasures() {
            let elements = this.svg.querySelector("#itemMeasures");
            $(elements).hide();
      }

      ///////
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

      /////////
      showShapeAreas() {
            let elements = this.svg.querySelector("#shapeAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            elements = this.svg.querySelector("#mainGcreatedByT").querySelectorAll("path");

            this.addShapeAreas();

      }

      /////////////
      hideShapeAreas() {
            let elements = this.svg.querySelector("#shapeAreas");
            $(elements).hide();
      }

      //////////
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

      //////////
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

      //////////
      hidePartAreas() {
            let elements = this.svg.querySelector("#partAreas");
            $(elements).hide();
      }

      /////////////
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
                  x: e.clientX - this.#f_svg.getBoundingClientRect().x,
                  y: e.clientY - this.#f_svg.getBoundingClientRect().y
            };
      }

      updateFromFields() {

      }

      /////////////
      setCurrentTool(tool) {
            this.#activeTool = tool;
            this.updateTools("Tool Selected");
      }

      /////////////////////
      getCurrentTool() {
            return this.#activeTool;
      }

      //////////////////
      updateTools(state) {
            switch(this.#activeTool) {
                  case "Selection Tool":
                        this.#allowPanning = false;

                        if(state == "Mouse Down") {
                              this.selectionRect_mouseDownPos = {
                                    x: ((this.#mouseXY.x - this.#panZoomInstance.getTransform().x) / this.scale),
                                    y: ((this.#mouseXY.y - this.#panZoomInstance.getTransform().y) / this.scale)
                              };
                              this.selectionRect = new TSVGRect(this.svg.querySelector("#mainGcreatedByT"), "stroke-width:" + (1 / this.scale), this.selectionRect_mouseDownPos.x, this.selectionRect_mouseDownPos.y, 0, 0);

                        } else if(state == "Mouse Move") {
                              let mousePos = {
                                    x: ((this.#mouseXY.x - this.#panZoomInstance.getTransform().x) / this.scale),
                                    y: ((this.#mouseXY.y - this.#panZoomInstance.getTransform().y) / this.scale)
                              };
                              if(this.#holding) {
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

                              for(let i = 0; i < this.#outerPathElements.length + this.#innerPathElements.length; i++) {
                                    let element = i < this.#outerPathElements.length ? this.#outerPathElements[i] : this.#innerPathElements[i - this.#outerPathElements.length];
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
                        this.#allowPanning = true;
                        break;
            }
      }
}