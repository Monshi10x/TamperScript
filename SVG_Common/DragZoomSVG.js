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

      /**
       * @summary mouse X,Y position relative to SVG Container
       */
      #mouseXY = {x: 0, y: 0};
      /**
       * @summary mouse X,Y position relative to scaled/translated SVG
       */
      #relativeMouseXY = {x: 0, y: 0};
      #panZoomInstance;
      #addOverallMeasure = true;
      #totalPathArea = 0;
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
      #convertShapesToPaths;
      #splitCompoundPaths;
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
      get totalPathLengths() {
            let totalPathLength = 0;

            for(let i = 0; i < this.#allPathElements.length; i++) {
                  totalPathLength += svg_getPathLength_mm(this.#allPathElements[i]);
            }

            return totalPathLength;
      }
      get outerPathElements() {return this.#outerPathElements;}
      get innerPathElements() {return this.#innerPathElements;}
      get allowPanning() {return this.#allowPanning;}
      get allowZoom() {return this.#allowZoom;}
      get relativeMouseXY() {return this.#relativeMouseXY;}
      get isHolding() {return this.#holding;}
      get allPathElements() {return this.#allPathElements;}
      /*
                        
      Setter            */
      set scale(value) {this.#scale = value;}
      set allowPanning(value) {this.#allowPanning = value;}
      set allowZoom(value) {this.#allowZoom = value;}
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
            this.#convertShapesToPaths = options.convertShapesToPaths;
            this.#splitCompoundPaths = options.splitCompoundPaths;
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

            this.onMouseUpdate("Mouse Down");
      }

      onMouseMove(e) {
            e.preventDefault();

            this.updateMouseXY(e);

            this.onMouseUpdate("Mouse Move");
      }

      onMouseUp(e) {
            this.updateMouseXY(e);

            this.#f_svg.style.cursor = "auto";
            this.#holding = false;

            this.onMouseUpdate("Mouse Up");
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
                  if(svgElements[i].nodeName != "g" && svgElements[i].nodeName != "path" && svgElements[i].nodeName != "defs" && svgElements[i].nodeName != "style") {
                        let element = SVGPathCommander.shapeToPath(svgElements[i], true);
                  }
            }

            this.#allElements = this.#f_svgG.getElementsByTagName("*");
      }

      async getTotalPathArea_m2() {
            return await svg_getTotalPathArea_m2(this.svg, no);
      }

      getTotalBoundingRectAreas_m2() {
            return svg_getTotalBoundingRectAreas_m2(this.outerPathElements, no);
      }

      initSVGStyles() {
            let svgElements = this.#f_svg.getElementsByTagName("path");

            [...svgElements].forEach((element) => {
                  element.setAttribute('stroke-miterlimit', `0`);

                  element.addEventListener("mouseover", (e) => {
                        element.classList.add("SVGHover");
                  });
                  element.addEventListener("mouseout", (e) => {
                        element.classList.remove("SVGHover");
                  });
                  element.addEventListener("mousedown", (e) => {
                        element.classList.toggle("SVGSelected");
                  });
            });
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


      updateMouseXY(e) {
            this.#mouseXY = {
                  x: e.clientX - this.#f_svg.getBoundingClientRect().x,
                  y: e.clientY - this.#f_svg.getBoundingClientRect().y
            };
            this.#relativeMouseXY = {
                  x: ((this.#mouseXY.x - this.#panZoomInstance.getTransform().x) / this.scale),
                  y: ((this.#mouseXY.y - this.#panZoomInstance.getTransform().y) / this.scale)
            };
      }

      updateFromFields() {
            this.#outerPathElements = [];
            this.#innerPathElements = [];
            this.#allPathElements = [];

            [...this.#f_svgG.getElementsByTagName("path")].forEach(element => {

                  if(element.classList.contains("outerPath")) this.#outerPathElements.push(element);
                  if(element.classList.contains("innerPath")) this.#innerPathElements.push(element);
                  this.#allPathElements.push(element);
            });
      }

      deleteElement(element) {
            deleteElement(element);

            this.updateFromFields();
      }

      /*overrideable*/onMouseUpdate(updateFrom) { }

}