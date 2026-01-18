/**
 * @see https://github.com/timmywil/panzoom/ - Archive
 * @see https://github.com/anvaka/panzoom/blob/main/README.md - main panzoom library
 * @see https://github.com/thednp/svg-path-commander
 */
class DragZoomSVG {
      /*
                         
      Variables         */
      #scale = 0.3;
      #scrollSpeed = 0.2;
      #measurementOffset_Small = 10;
      #measurementOffset_Large = 50;
      #textOffset = 5;
      #holding = false;
      #allowPanning = true;
      #allowZoom = true;
      supportedSVGTypes = ['rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'path', 'text'];

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
      #measurementElements = [];
      #areaElements = [];
      #shapeAreaPolygons = [];
      #scaleMeasurementsWithScale = false;
      #convertShapesToPaths;

      /*
                        
      Fields            */
      #f_svg;
      #f_container;
      #f_mouseMoveRef;
      #f_mouseUpRef;
      #f_mouseDownRef;
      #f_svgG;
      /*
                        
      Getter            */
      get scale() {return this.#scale;}
      get svg() {return this.#f_svg;}
      get svgG() {return this.#f_svgG;}
      set svgWidth(width) {this.#f_svg.width.baseVal.value = width;}
      get svgWidth() {return this.#f_svg.width.baseVal.value;}
      set svgHeight(height) {this.#f_svg.height.baseVal.value = height;}
      get svgHeight() {return this.#f_svg.height.baseVal.value;}
      get totalPathLengths() {
            let totalPathLength = 0;

            let paths = this.allPathElements;
            for(let i = 0; i < paths.length; i++) {
                  totalPathLength += svg_getPathLength_mm(paths[i]);
            }

            return totalPathLength;
      }
      get allPathElements() {return this.#f_svgG.querySelectorAll(".outerPath, .innerPath");}
      get outerPathElements() {return this.#f_svgG.getElementsByClassName("outerPath");}
      get innerPathElements() {return this.#f_svgG.getElementsByClassName("innerPath");}
      get allowPanning() {return this.#allowPanning;}
      get allowZoom() {return this.#allowZoom;}
      get relativeMouseXY() {return this.#relativeMouseXY;}
      get isHolding() {return this.#holding;}
      get svgFile() {return this.#f_svg.outerHTML;}
      get container() {return this.#f_container;}

      get unscaledSVGString() {
            let svgClone = this.svg.cloneNode(true);
            let group = svgClone.getElementById("mainGcreatedByT");
            if(group) {
                  group.setAttribute('transform', `matrix(${svg_mmToPixel(1)} 0 0 ${svg_mmToPixel(1)} 0 0)`);
            }

            return svgClone.outerHTML;
      }
      get panZoomInstance() {return this.#panZoomInstance;}
      /*
                        
      Setter            */
      set scale(value) {this.#scale = value;}
      set allowPanning(value) {this.#allowPanning = value;}
      set allowZoom(value) {this.#allowZoom = value;}
      /*
                        
      Start             */
      constructor(svgWidth = "calc(100%)", svgHeight = "500px", svgText = "", parentToAppendTo, options = {}) {
            const defaultOptions = {
                  convertShapesToPaths: true,
                  splitCompoundPaths: true,
                  scaleStrokeOnScroll: true,
                  scaleFontOnScroll: true,
                  defaultStrokeWidth: 1,
                  defaultFontSize: 16,
                  overrideCssStyles: ""
            };

            this.options = {...defaultOptions, ...options};

            let _this = this;

            this.#f_container = document.createElement("div");
            this.#f_container.innerHTML = svgText || '<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="1980.32mm" height="1186.57mm" viewBox="0 0 5613.5 3363.5"><g id="mainGcreatedByT" transform="matrix(1 0 0 1 0 0)"></g></svg>';
            this.#f_container.style = "display: block;float: left;;overflow:hidden;width:" + svgWidth + ";height:" + svgHeight;//outline:1px solid black
            this.#f_container.style.cssText += options.overrideCssStyles;
            console.log("width:" + svgWidth + ";height:" + svgHeight + ";");

            this.#f_container.className = "svgContainerDiv";
            if(parentToAppendTo) parentToAppendTo.appendChild(this.#f_container);

            this.#f_svg = this.#f_container.querySelector("svg");
            this.#f_svg.setAttribute("width", 'calc(100%)');
            this.#f_svg.setAttribute("height", 'calc(100%)');
            this.#f_svg.setAttribute("data-scaleStrokeOnScroll", this.options.scaleStrokeOnScroll);
            this.#f_svg.style.cssText += ";background-color:white;";

            this.#f_svgG = this.#f_svg.querySelector("#mainGcreatedByT");
            //Add mainGcreatedByT Group if not already
            if(!this.#f_svgG) {
                  console.log("creating new group");
                  this.#f_svgG = document.createElementNS('http://www.w3.org/2000/svg', "g");
                  this.#f_svgG.id = "mainGcreatedByT";
                  let numChildren = this.#f_svg.children.length;
                  for(let i = 0; i < numChildren; i++) {
                        this.#f_svgG.appendChild(this.#f_svg.children[0]);
                  }
                  this.#f_svg.appendChild(this.#f_svgG);
            }

            this.#panZoomInstance = panzoom(this.#f_svgG, {
                  zoomSpeed: this.#scrollSpeed,
                  initialZoom: _this.#scale,
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

            //Fired when any transformation has happened
            this.#panZoomInstance.on('transform', (e) => {
                  this.onTransform(e);
            });

            if(options.convertShapesToPaths) svg_convertShapesToPaths(this.#f_svgG);
            if(options.splitCompoundPaths) svg_formatCompoundPaths(this.#f_svg);

            //this.#scale = this.#panZoomInstance.getTransform().scale;

            this.initSVGStyles();

            this.#f_mouseUpRef = (e) => this.onMouseUp(e);//necessary for removeEventListener
            this.#f_mouseDownRef = (e) => this.onMouseDown(e);//necessary for removeEventListener
            //~60fps
            let lastMove = 0;
            this.#f_mouseMoveRef = (e) => {
                  if(Date.now() - lastMove > 16) {
                        this.onMouseMove(e);
                        lastMove = Date.now();
                  }
            };

            this.#f_svg.addEventListener('mousedown', this.#f_mouseDownRef);
            window.addEventListener('mousemove', this.#f_mouseMoveRef);
            window.addEventListener('mouseup', this.#f_mouseUpRef);

            this.#f_container.onmouseover = (e) => this.onHoverEnter(e);
            this.#f_container.onmouseout = (e) => this.onHoverExit(e);

            setTimeout(() => {
                  this.centerAndFitSVGContent(this.svg, this.#f_svgG, this.#panZoomInstance);
            }, 1);
      }

      /**
       * 
       * @param {*} svg 
       * @param {*} elementToFit 
       * @param {*} panzoomInstance 
       * @param {*} margin 
       * @description arguments are optional and will default otherwise
       */
      centerAndFitSVGContent(svg, elementToFit, panzoomInstance, margin = 40) {
            //defaults:
            if(svg == null) svg = this.svg;
            if(elementToFit == null) elementToFit = this.#f_svgG;
            if(panzoomInstance == null) panzoomInstance = this.#panZoomInstance;

            const bbox = elementToFit.getBBox();
            const containerRect = svg.getBoundingClientRect();

            if(bbox.width <= 0 || bbox.height <= 0) return console.warn("elementToFix width || height <=0");

            const availableWidth = containerRect.width - margin * 2;
            const availableHeight = containerRect.height - margin * 2;

            const scaleX = availableWidth / bbox.width;
            const scaleY = availableHeight / bbox.height;
            const scale = Math.min(scaleX, scaleY);

            const scaledWidth = bbox.width * scale;
            const scaledHeight = bbox.height * scale;

            const dx = (containerRect.width - scaledWidth) / 2 - bbox.x * scale;
            const dy = (containerRect.height - scaledHeight) / 2 - bbox.y * scale;

            panzoomInstance.moveTo(0, 0);
            panzoomInstance.zoomAbs(0, 0, scale);
            panzoomInstance.moveTo(dx, dy);
      }

      Close() {
            this.#f_svg.removeEventListener('mousedown', this.#f_mouseDownRef);
            window.removeEventListener('mousemove', this.#f_mouseMoveRef);
            window.removeEventListener('mouseup', this.#f_mouseUpRef);

            this.#f_container.onmouseover = null;
            this.#f_container.onmouseout = null;
            this.#panZoomInstance?.dispose();
            this.deleteElement(this.#f_container);
      }

      onHoverEnter(e) {
            //this.#f_container.style.outlineColor = COLOUR.Blue;
      }

      onHoverExit(e) {
            //this.#f_container.style.outlineColor = COLOUR.Black;
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
            if(!this.#allowPanning) return false;
            else return true;
      }

      onBeforeWheel(e) {
            if(!this.#allowZoom) return false;
            else return true;
      }

      onZoom() {
            this.#scale = this.#panZoomInstance.getTransform().scale;
            this.refreshElementStyles();
      }

      refreshElementStyles() {
            let allElements = this.#f_svgG.querySelectorAll(this.supportedSVGTypes.join(", "));
            allElements.forEach(el => {
                  if(this.options.scaleStrokeOnScroll) el.style.strokeWidth = `${this.options.defaultStrokeWidth / this.#scale}`;
                  if(this.options.scaleFontOnScroll) el.style.fontSize = `${this.options.defaultFontSize / this.#scale}px`;
            });
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
                        if(element.classList.contains("innerPath")) return;
                        element.classList.add("SVGHover");
                  });
                  element.addEventListener("mouseout", (e) => {
                        element.classList.remove("SVGHover");
                  });
                  element.addEventListener("mouseup", (e) => {
                        if(element.classList.contains("innerPath")) return;
                        element.classList.toggle("SVGSelected");
                  });
            });
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

      UpdateFromFields() { }

      deleteElement(element) {
            deleteElement(element);

            this.UpdateFromFields();
      }

      show() {
            if(this.#f_container) this.#f_container.style.display = "block";
      }

      hide() {
            if(this.#f_container) this.#f_container.style.display = "none";
      }

      toggleShow() {
            if(!this.#f_container) return;

            toggle(this.#f_container.style.display == "none", () => {this.show();}, () => {this.hide();});
      }

      /*overrideable*/onMouseUpdate(updateFrom) { }

      /*overrideable*/onTransform(e) { }

}
