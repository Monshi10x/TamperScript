class ModalSVG extends Modal {
      static #lastControlSettings = {
            svgScale: 1
      };

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
      #showShapeAreaPolygons;
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
      #isUpdatingSvgScale = false;
      #isLoadingShapeAreas = false;
      #pendingShapeAreaPolygonRender = false;
      #widthShouldBeField;
      #heightShouldBeField;
      #calculatedScaleText;
      #applyCalculatedScaleButton;
      #calculatedScaleValue = 1;
      #originalBoundsMm;
      #svgWorkspaceContainer;
      #toolColumnContainer;
      #selectionToolButton;
      #deleteToolButton;
      #rectangleToolButton;
      #circleToolButton;
      #grabToolButton;
      #drawRectangleMouseDownPos;
      #drawRectanglePreview;
      #drawCircleMouseDownPos;
      #drawCirclePreview;
      #grabShapeTarget;
      #grabStartMousePos;
      #grabOriginalPathData;
      #keyDownRef;
      #contextMenuRef;

      get getTotalPathLengths() {return this.#dragZoomSVG.getTotalPathLengths();}
      get currentTool() {return this.#activeTool;}
      get svgFile() {return this.#dragZoomSVG.svg.outerHTML;}

      constructor(headerText, incrementAmount, callback, svgText, callerObject, options = {}) {
            const defaultOptions = {
                  convertShapesToPaths: true,
                  splitCompoundPaths: true,
                  scaleStrokeOnScroll: true,
                  scaleFontOnScroll: true,
                  defaultStrokeWidth: 1,
                  defaultFontSize: 12,
                  hideScaleControl: false,
                  hideSelectionTool: false,
                  hideDeleteTool: false
            };
            const mergedOptions = {...defaultOptions, ...options};
            const controlOptions = {
                  hideScaleControl: mergedOptions.hideScaleControl,
                  hideSelectionTool: mergedOptions.hideSelectionTool,
                  hideDeleteTool: mergedOptions.hideDeleteTool
            };
            const dragZoomOptions = {...mergedOptions};
            delete dragZoomOptions.hideScaleControl;
            delete dragZoomOptions.hideSelectionTool;
            delete dragZoomOptions.hideDeleteTool;

            super(headerText, incrementAmount, callback);
            this.#svgText = svgText;

            this.#containerBeforeCanvas = createDivStyle5(null, "Borrowed Fields", this.getBodyElement())[1];
            this.#svgWorkspaceContainer = document.createElement("div");
            this.#svgWorkspaceContainer.style = "display:flex;align-items:stretch;justify-content:flex-start;gap:8px;width:100%;height:500px;";
            this.getBodyElement().appendChild(this.#svgWorkspaceContainer);

            this.#toolColumnContainer = document.createElement("div");
            this.#toolColumnContainer.style = "display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:6px;width:68px;min-width:68px;padding:4px 0px;";
            this.#svgWorkspaceContainer.appendChild(this.#toolColumnContainer);

            this.#dragZoomSVG = new DragZoomSVG("calc(100% - 76px)", "100%", svgText, this.#svgWorkspaceContainer, dragZoomOptions);
            this.#dragZoomSVG.onMouseUpdate = this.onMouseUpdate;
            this.#contextMenuRef = (event) => this.handleContextMenu(event);
            this.#keyDownRef = (event) => this.handleKeyDown(event);
            this.#dragZoomSVG.container.addEventListener('contextmenu', this.#contextMenuRef);
            window.addEventListener('keydown', this.#keyDownRef);
            this.#svgBaseSize = this.getSvgBaseSize(svgText);
            this.cacheOriginalPathData();
            this.cacheOriginalBounds();
            this.applyOriginalBoundsToSvgElement(this.#dragZoomSVG.svg);

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

            let shapeAreaPolygonToggle = new Toggle(() => {this.hideShapeAreaPolygons();}, () => {this.showShapeAreaPolygons();});
            this.#showShapeAreaPolygons = createCheckbox_Infield("Show Shape Area Polygons", false, "width:250px;", () => {
                  shapeAreaPolygonToggle.toggle();
            }, this.#viewSettingsContainer);

            let shapeBoundingRectToggle = new Toggle(() => {this.hideShapeBoundingRect();}, () => {this.showShapeBoundingRect();});
            this.#showShapeBoundingRect = createCheckbox_Infield("Show Shape Bounding Rect", false, "width:250px;", () => {
                  shapeBoundingRectToggle.toggle();
            }, this.#viewSettingsContainer);

            let pointsToggle = new Toggle(() => {this.hideElementPoints();}, () => {this.showElementPoints();});
            this.#showPoints = createCheckbox_Infield("Show Points", false, "width:250px;", () => {
                  pointsToggle.toggle();
            }, this.#viewSettingsContainer);

            this.#controlsContainer = createDivStyle5(null, "Controls", this.getBodyElement())[1];
            if(!controlOptions.hideScaleControl) {
                  this.#svgScaleField = createInput_Infield("SVG Scale", this.#svgScale, "width:250px;", () => {
                        this.updateSvgScaleFromField();
                  }, this.#controlsContainer, false, 0.1);

                  this.#widthShouldBeField = createInput_Infield("Width Should Be", null, "width:250px;", () => {
                        this.updateCalculatedScaleFields();
                  }, this.#controlsContainer, false, null);
                  this.#heightShouldBeField = createInput_Infield("Height Should Be", null, "width:250px;", () => {
                        this.updateCalculatedScaleFields();
                  }, this.#controlsContainer, false, null);

                  this.#calculatedScaleText = createText("Calculated Scale: --", "width:250px;margin:5px 0px;", this.#controlsContainer);
                  this.#applyCalculatedScaleButton = createButton("Apply Calculated Scale", "width:250px;", () => {
                        if(!Number.isFinite(this.#calculatedScaleValue)) return;
                        if(this.#svgScaleField?.[1]) {
                              this.#isUpdatingSvgScale = true;
                              this.#svgScaleField[1].value = this.#calculatedScaleValue;
                              this.#isUpdatingSvgScale = false;
                              this.updateSvgScaleFromField();
                        }
                  }, this.#controlsContainer);
            }

            let deleteTool;
            let selectionTool;
            let rectangleTool;
            let circleTool;
            let grabTool;

            if(!controlOptions.hideSelectionTool) {
                  selectionTool = createIconButton(GM_getResourceURL("Icon_Select"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey + ";margin:0px auto;", () => {
                        this.toggleTool("Selection Tool");
                  }, this.#toolColumnContainer, true);
                  this.#selectionToolButton = selectionTool;
            }

            if(!controlOptions.hideDeleteTool) {
                  deleteTool = createIconButton(GM_getResourceURL("Icon_Bin2"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey + ";margin:0px auto;", () => {
                        this.toggleTool("Delete Tool");
                  }, this.#toolColumnContainer, true);
                  this.#deleteToolButton = deleteTool;
            }

            rectangleTool = createIconButton(GM_getResourceURL("Icon_AddRectangle"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey + ";margin:0px auto;", () => {
                  this.toggleTool("Rectangle Tool");
            }, this.#toolColumnContainer, true);
            this.#rectangleToolButton = rectangleTool;

            circleTool = createIconButton(GM_getResourceURL("Icon_AddCircle"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey + ";margin:0px auto;", () => {
                  this.toggleTool("Circle Tool");
            }, this.#toolColumnContainer, true);
            this.#circleToolButton = circleTool;

            grabTool = createIconButton(GM_getResourceURL("Icon_Grab"), null, "width:60px;height:50px;background-color:" + COLOUR.DarkGrey + ";margin:0px auto;", () => {
                  this.toggleTool("Grab Tool");
            }, this.#toolColumnContainer, true);
            this.#grabToolButton = grabTool;

            this.loadPathArea();
            this.loadBoundingRectAreas();

            ///Save Changes
            this.#f_saveSVG = createButton("Save Changes", "", () => {
                  if(callerObject instanceof SVGCutfile) {
                        callerObject.svgFile = this.buildExportSvgMarkup();
                        callerObject.onFileChange();
                  }
                  this.hide();
            }, null);
            this.#f_cancelSave = createButton("Cancel Changes", "", () => {this.hide();}, null);

            this.addFooterElement(this.#f_saveSVG);
            this.addFooterElement(this.#f_cancelSave);
            this.applySavedControlSettings();
            this.scheduleInitialFitToSvgBounds();
      }

      async loadPathArea() {
            let loader = new Loader(this.#totalShapeAreas[0]);
            let shapeAreaPolygonGroup = this.#dragZoomSVG.svg.querySelector("#shapeAreaPolygons");
            if(shapeAreaPolygonGroup) {
                  shapeAreaPolygonGroup.remove();
                  console.log("Shape area polygons deleted.");
            }
            console.log("Shape area worker started.");
            this.#isLoadingShapeAreas = true;
            let totalArea = await this.#dragZoomSVG.getTotalPathArea_m2();
            this.#isLoadingShapeAreas = false;
            console.log("Shape area worker finished.");
            $(this.#totalShapeAreas[1]).val(totalArea).change();
            loader.Delete();
            if(this.#pendingShapeAreaPolygonRender || this.#showShapeAreaPolygons?.[1]?.checked) {
                  this.#pendingShapeAreaPolygonRender = false;
                  this.showShapeAreaPolygons();
            }
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
            if(this.#contextMenuRef) this.#dragZoomSVG?.container?.removeEventListener('contextmenu', this.#contextMenuRef);
            if(this.#keyDownRef) window.removeEventListener('keydown', this.#keyDownRef);
            closeCustomContextMenu();
            this.#dragZoomSVG.Close();
            //this.returnAllBorrowedFields();
            super.hide();
      }

      buildExportSvgMarkup() {
            if(!this.#dragZoomSVG?.svg) return "";

            let svgClone = this.#dragZoomSVG.svg.cloneNode(true);
            this.applyOriginalBoundsToSvgElement(svgClone);

            let mainGroup = svgClone.querySelector("#mainGcreatedByT");
            if(mainGroup) {
                  // Pan/zoom is a view-state concern and should not be exported as model geometry.
                  mainGroup.setAttribute("transform", "matrix(1 0 0 1 0 0)");
            }

            let overlayGroupIds = ["overallMeasures", "itemMeasures", "shapeAreas", "shapeAreaPolygons", "partAreas", "shapeBoundingRects", "itemPoints"];
            overlayGroupIds.forEach((groupId) => {
                  let group = svgClone.querySelector(`#${groupId}`);
                  if(group) group.remove();
            });

            delete svgClone.__shapeAreaPolygons;

            return svgClone.outerHTML;
      }

      onWindowResize(event) {
            super.onWindowResize(event);
            this.#dragZoomSVG.svgWidth = this.#dragZoomSVG.container.getBoundingClientRect().width;
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
            if(elements) {
                  $(elements).show();
                  this.#dragZoomSVG.syncScaleFromTransform();
                  return;
            }

            this.addOverallMeasures();
            this.#dragZoomSVG.syncScaleFromTransform();
      }

      hideOverallMeasures() {
            let elements = this.#dragZoomSVG.svg.querySelector("#overallMeasures");
            if(elements) $(elements).hide();
      }

      addElementMeasures(element) {
            if(!element || (!element.classList.contains("outerPath") && !element.classList.contains("innerPath"))) return;
            if(element.closest("#itemMeasures") || element.closest("#overallMeasures")) return;
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
                  this.#dragZoomSVG.syncScaleFromTransform();
                  return;
            }

            let pathElements = this.#dragZoomSVG.allPathElements;
            for(let i = 0; i < pathElements.length; i++) {
                  this.addElementMeasures(pathElements[i]);
            }
            this.#dragZoomSVG.syncScaleFromTransform();
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

            this.addShapeAreas();
      }

      hideShapeAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeAreas");
            $(elements).hide();
      }

      showShapeAreaPolygons() {
            if(this.#isLoadingShapeAreas) {
                  this.#pendingShapeAreaPolygonRender = true;
                  return;
            }
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeAreaPolygons");
            if(elements) {
                  $(elements).show();
                  return;
            }

            this.addShapeAreaPolygons();
      }

      hideShapeAreaPolygons() {
            let elements = this.#dragZoomSVG.svg.querySelector("#shapeAreaPolygons");
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

      addShapeAreaPolygons() {
            let mainGroup = this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT");
            let svgScale = this.#dragZoomSVG.scale;
            let polygons = this.#dragZoomSVG.shapeAreaPolygons || [];

            if(!polygons.length) return;

            let newGroup = mainGroup.querySelector("#shapeAreaPolygons");
            if(!newGroup) {
                  newGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  newGroup.id = "shapeAreaPolygons";
                  mainGroup.appendChild(newGroup);
            }

            let buildPathData = (polygonPoints) => {
                  if(!polygonPoints || polygonPoints.length < 3) return null;
                  let pathParts = polygonPoints.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`);
                  pathParts.push("Z");
                  return pathParts.join(" ");
            };

            let outerPolygons = polygons.filter((polygon) => !polygon.isInner);

            outerPolygons.forEach((outerPolygon) => {
                  let outerPathData = buildPathData(outerPolygon.points);
                  if(!outerPathData) return;

                  let innerPolygons = polygons.filter((polygon) => polygon.isInner && polygon.outerParentId === outerPolygon.elementId);
                  let innerPathData = innerPolygons.map((polygon) => buildPathData(polygon.points)).filter(Boolean).join(" ");

                  let combinedPathData = innerPathData ? `${outerPathData} ${innerPathData}` : outerPathData;

                  let polygonPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                  polygonPath.setAttribute("d", combinedPathData);
                  polygonPath.setAttribute("fill-rule", "evenodd");
                  polygonPath.style = `fill:rgb(173, 216, 230);stroke:rgb(70, 130, 180);stroke-width:${1 / svgScale};`;
                  newGroup.appendChild(polygonPath);
            });
            console.log("Shape area polygons created.");
      }

      showPartAreas() {
            let elements = this.#dragZoomSVG.svg.querySelector("#partAreas");
            if(elements) {
                  $(elements).show();
                  return;
            }

            let pathElements = this.#dragZoomSVG.allPathElements;
            for(let i = 0; i < pathElements.length; i++) {
                  this.addPartAreas(pathElements[i]);
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
            if(!element || (!element.classList.contains("outerPath") && !element.classList.contains("innerPath"))) return;
            if(element.closest("#itemMeasures") || element.closest("#overallMeasures")) return;
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

      toggleTool(tool) {
            this.setCurrentTool(this.currentTool === tool ? "null" : tool);
      }

      updateToolButtonStates() {
            let buttons = [
                  {tool: "Selection Tool", button: this.#selectionToolButton},
                  {tool: "Delete Tool", button: this.#deleteToolButton},
                  {tool: "Rectangle Tool", button: this.#rectangleToolButton},
                  {tool: "Circle Tool", button: this.#circleToolButton},
                  {tool: "Grab Tool", button: this.#grabToolButton}
            ];

            buttons.forEach((entry) => {
                  if(!entry.button) return;
                  entry.button.style.borderColor = this.currentTool === entry.tool ? "red" : COLOUR.DarkGrey;
            });
      }

      updateDragRectanglePreview(mousePos) {
            if(!this.#drawRectanglePreview || !this.#drawRectangleMouseDownPos) return;

            let distX = mousePos.x - this.#drawRectangleMouseDownPos.x;
            let distY = mousePos.y - this.#drawRectangleMouseDownPos.y;

            this.#drawRectanglePreview.setAttribute("x", distX >= 0 ? this.#drawRectangleMouseDownPos.x : mousePos.x);
            this.#drawRectanglePreview.setAttribute("y", distY >= 0 ? this.#drawRectangleMouseDownPos.y : mousePos.y);
            this.#drawRectanglePreview.setAttribute("width", Math.abs(distX));
            this.#drawRectanglePreview.setAttribute("height", Math.abs(distY));
      }

      finalizeDrawRectanglePreview() {
            if(!this.#drawRectanglePreview) return;

            let width = parseFloat(this.#drawRectanglePreview.getAttribute("width")) || 0;
            let height = parseFloat(this.#drawRectanglePreview.getAttribute("height")) || 0;
            if(width <= 0 || height <= 0) {
                  this.#drawRectanglePreview.Delete();
            } else {
                  this.commitDrawnRectangle(
                        parseFloat(this.#drawRectanglePreview.getAttribute("x")) || 0,
                        parseFloat(this.#drawRectanglePreview.getAttribute("y")) || 0,
                        width,
                        height
                  );
                  this.#drawRectanglePreview.Delete();
            }

            this.#drawRectanglePreview = null;
            this.#drawRectangleMouseDownPos = null;
      }

      updateDragCirclePreview(mousePos) {
            if(!this.#drawCirclePreview || !this.#drawCircleMouseDownPos) return;

            let distX = mousePos.x - this.#drawCircleMouseDownPos.x;
            let distY = mousePos.y - this.#drawCircleMouseDownPos.y;
            let size = Math.max(Math.abs(distX), Math.abs(distY));
            let finalX = distX >= 0 ? this.#drawCircleMouseDownPos.x : this.#drawCircleMouseDownPos.x - size;
            let finalY = distY >= 0 ? this.#drawCircleMouseDownPos.y : this.#drawCircleMouseDownPos.y - size;

            this.#drawCirclePreview.setAttribute("x", finalX);
            this.#drawCirclePreview.setAttribute("y", finalY);
            this.#drawCirclePreview.setAttribute("width", size);
            this.#drawCirclePreview.setAttribute("height", size);
      }

      finalizeDrawCirclePreview() {
            if(!this.#drawCirclePreview) return;

            let width = parseFloat(this.#drawCirclePreview.getAttribute("width")) || 0;
            let height = parseFloat(this.#drawCirclePreview.getAttribute("height")) || 0;
            if(width <= 0 || height <= 0) {
                  this.#drawCirclePreview.Delete();
            } else {
                  this.commitDrawnCircle(
                        parseFloat(this.#drawCirclePreview.getAttribute("x")) || 0,
                        parseFloat(this.#drawCirclePreview.getAttribute("y")) || 0,
                        width
                  );
                  this.#drawCirclePreview.Delete();
            }

            this.#drawCirclePreview = null;
            this.#drawCircleMouseDownPos = null;
      }

      beginGrabShape(shapeElement) {
            if(!shapeElement) return false;
            let shapeGroup = shapeElement.parentNode;
            if(!shapeGroup) return false;

            this.#grabShapeTarget = shapeGroup;
            this.#grabStartMousePos = {...this.#dragZoomSVG.relativeMouseXY};
            this.#grabOriginalPathData = Array.from(shapeGroup.querySelectorAll("path")).map((pathElement) => ({
                  element: pathElement,
                  d: pathElement.getAttribute("d") || ""
            }));
            return true;
      }

      updateGrabShape(mousePos) {
            if(!this.#grabShapeTarget || !this.#grabStartMousePos || !this.#grabOriginalPathData?.length) return;

            let deltaX = mousePos.x - this.#grabStartMousePos.x;
            let deltaY = mousePos.y - this.#grabStartMousePos.y;

            this.#grabOriginalPathData.forEach((entry) => {
                  if(!entry.d) return;
                  try {
                        let translatedPath = new SVGPathCommander(entry.d)
                              .transform({translate: [deltaX, deltaY]})
                              .toString();
                        entry.element.setAttribute("d", translatedPath);
                  } catch(error) {
                        console.warn("Unable to translate grabbed shape.", error);
                  }
            });
      }

      finalizeGrabShape() {
            if(this.#grabOriginalPathData?.length) {
                  this.#grabOriginalPathData.forEach((entry) => {
                        entry.element.dataset.baseD = entry.element.getAttribute("d") || entry.d;
                  });
                  this.refreshMeasurements();
                  this.updateSavePulse();
            }

            this.#grabShapeTarget = null;
            this.#grabStartMousePos = null;
            this.#grabOriginalPathData = null;
      }

      deleteSelectedShapes() {
            let groupsToDelete = new Set();
            this.#dragZoomSVG.allPathElements.forEach((element) => {
                  if(element.classList.contains("SVGSelected") && element.parentNode) groupsToDelete.add(element.parentNode);
            });

            if(groupsToDelete.size === 0) return;

            groupsToDelete.forEach((group) => {
                  this.#dragZoomSVG.deleteElement(group);
            });

            this.refreshMeasurements();
            this.updateSavePulse();
            closeCustomContextMenu();
      }

      createRectanglePathData(x, y, width, height) {
            return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
      }

      createCirclePathData(x, y, size) {
            let radius = size / 2;
            let centerX = x + radius;
            let centerY = y + radius;
            return `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 1 0 ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 0 ${centerX - radius} ${centerY} Z`;
      }

      commitDrawnRectangle(x, y, width, height) {
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");
            if(!pathGroup) {
                  pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  pathGroup.id = "pathGroup";
                  this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT")?.appendChild(pathGroup);
            }

            let newPathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newPathGroup.id = "newPathGroup";

            let outerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let pathData = this.createRectanglePathData(x, y, width, height);

            outerPathElement.setAttribute("d", pathData);
            outerPathElement.dataset.baseD = pathData;
            outerPathElement.className.baseVal = "outerPath";
            outerPathElement.id = generateUniqueID("outerPath-");
            outerPathElement.setAttribute("data-area", "0");
            outerPathElement.setAttribute("fill", "#fffffe");
            outerPathElement.setAttribute("stroke", "black");
            outerPathElement.setAttribute("stroke-width", `${1 / this.#dragZoomSVG.scale}`);
            outerPathElement.setAttribute("opacity", "1");

            newPathGroup.appendChild(outerPathElement);
            pathGroup.appendChild(newPathGroup);

            this.#dragZoomSVG.initPathElement(outerPathElement);
            this.#dragZoomSVG.refreshElementStyles();
            this.refreshMeasurements();
            this.updateSavePulse();
      }

      commitDrawnCircle(x, y, size) {
            let pathGroup = this.#dragZoomSVG.svg.querySelector("#pathGroup");
            if(!pathGroup) {
                  pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                  pathGroup.id = "pathGroup";
                  this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT")?.appendChild(pathGroup);
            }

            let newPathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newPathGroup.id = "newPathGroup";

            let outerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let pathData = this.createCirclePathData(x, y, size);

            outerPathElement.setAttribute("d", pathData);
            outerPathElement.dataset.baseD = pathData;
            outerPathElement.className.baseVal = "outerPath";
            outerPathElement.id = generateUniqueID("outerPath-");
            outerPathElement.setAttribute("data-area", "0");
            outerPathElement.setAttribute("fill", "#fffffe");
            outerPathElement.setAttribute("stroke", "black");
            outerPathElement.setAttribute("stroke-width", `${1 / this.#dragZoomSVG.scale}`);
            outerPathElement.setAttribute("opacity", "1");

            newPathGroup.appendChild(outerPathElement);
            pathGroup.appendChild(newPathGroup);

            this.#dragZoomSVG.initPathElement(outerPathElement);
            this.#dragZoomSVG.refreshElementStyles();
            this.refreshMeasurements();
            this.updateSavePulse();
      }

      getContextTargetShape(event) {
            let targetPath = event.target?.closest?.("path");
            if(!targetPath) return null;
            if(targetPath.classList.contains("outerPath")) return targetPath;
            if(targetPath.classList.contains("innerPath")) return targetPath.parentNode?.querySelector?.(".outerPath") || null;
            return null;
      }

      parseColorToHex(colorValue) {
            if(!colorValue) return "#fffffe";
            let value = String(colorValue).trim();
            if(/^#([0-9a-f]{3}){1,2}$/i.test(value)) {
                  if(value.length === 4) {
                        return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`.toLowerCase();
                  }
                  return value.toLowerCase();
            }

            let rgbMatch = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
            if(!rgbMatch) return "#fffffe";

            let rgbToHex = (component) => Math.max(0, Math.min(255, parseInt(component, 10))).toString(16).padStart(2, "0");
            return `#${rgbToHex(rgbMatch[1])}${rgbToHex(rgbMatch[2])}${rgbToHex(rgbMatch[3])}`;
      }

      getShapeFillHex(shapeElement) {
            return this.parseColorToHex(shapeElement.style.fill || shapeElement.getAttribute("fill") || window.getComputedStyle(shapeElement)?.fill || "#fffffe");
      }

      applyShapeFill(shapeElement, fillHex) {
            if(!shapeElement) return;
            let outerPath = shapeElement.classList.contains("outerPath") ? shapeElement : shapeElement.parentNode?.querySelector?.(".outerPath");
            if(!outerPath) return;

            outerPath.setAttribute("fill", fillHex);
            outerPath.style.fill = fillHex;
            this.updateSavePulse();
      }

      scaleShapeGroupToSize(shapeElement, targetWidth, targetHeight) {
            if(!shapeElement) return;

            let shapeGroup = shapeElement.parentNode;
            if(!shapeGroup?.getBBox) return;

            let boundingBox;
            try {
                  boundingBox = shapeGroup.getBBox();
            } catch(error) {
                  console.warn("Unable to get shape bounds for resizing.", error);
                  return;
            }

            if(!boundingBox || boundingBox.width <= 0 || boundingBox.height <= 0) return;

            let targetWidthPixels = svg_mmToPixel(targetWidth);
            let targetHeightPixels = svg_mmToPixel(targetHeight);

            let scaleX = targetWidthPixels / boundingBox.width;
            let scaleY = targetHeightPixels / boundingBox.height;
            if(!Number.isFinite(scaleX) || !Number.isFinite(scaleY) || scaleX <= 0 || scaleY <= 0) return;

            let shapePaths = shapeGroup.querySelectorAll("path");
            shapePaths.forEach((pathElement) => {
                  let currentPathData = pathElement.getAttribute("d");
                  if(!currentPathData) return;

                  try {
                        let resizedPath = new SVGPathCommander(currentPathData)
                              .transform({translate: [-boundingBox.x, -boundingBox.y]})
                              .transform({scale: [scaleX, scaleY]})
                              .transform({translate: [boundingBox.x, boundingBox.y]})
                              .toString();

                        pathElement.setAttribute("d", resizedPath);
                        pathElement.dataset.baseD = resizedPath;
                  } catch(error) {
                        console.warn("Unable to resize shape path.", error);
                  }
            });

            this.refreshMeasurements();
            this.updateSavePulse();
      }

      handleKeyDown(event) {
            if(event.key !== "Delete" && event.key !== "Backspace") return;

            const targetTag = (event.target && event.target.tagName) ? event.target.tagName.toLowerCase() : "";
            if(["input", "textarea", "select"].includes(targetTag) || event.target?.isContentEditable) return;

            let selectedShapeExists = Array.from(this.#dragZoomSVG.allPathElements).some((element) => element.classList.contains("SVGSelected"));
            if(!selectedShapeExists) return;

            event.preventDefault();
            this.deleteSelectedShapes();
      }

      async handleContextMenu(event) {
            let targetShape = this.getContextTargetShape(event);
            if(!targetShape) return;

            event.preventDefault();
            this.#dragZoomSVG.updateMouseXY(event);

            const shapeGroup = targetShape.parentNode;
            const shapeBounds = shapeGroup?.getBBox?.() || targetShape.getBBox();

            if(!customContextMenuContainer) initCustomContextMenu();
            setFieldHidden(false, customContextMenuContainer);
            customContextMenuContainer.style.left = event.pageX + "px";
            customContextMenuContainer.style.top = event.pageY + "px";

            removeAllChildrenFromParent(customContextMenuContainer);
            const containerPanel = document.createElement('div');
            containerPanel.style = "padding:0px;display:flex;flex-direction:column;gap:6px;color:white;background-color:" + COLOUR.DarkGrey + ";width:100%;box-shadow:0 4px 12px rgba(0,0,0,0.8);position:relative;cursor:default;user-select:none;padding-top:15px;";
            let dragOffset = {x: 0, y: 0};
            const dragHandle = document.createElement('div');
            dragHandle.innerText = "☰";
            dragHandle.style = "position:absolute;left:5px;top:5px;cursor:grab;color:white;font-size:18px;";
            dragHandle.onmousedown = (e) => {
                  e.preventDefault();
                  dragHandle.style.cursor = "grabbing";
                  dragOffset = {x: e.clientX - customContextMenuContainer.offsetLeft, y: e.clientY - customContextMenuContainer.offsetTop};
                  const move = (ev) => {
                        customContextMenuContainer.style.left = (ev.clientX - dragOffset.x) + "px";
                        customContextMenuContainer.style.top = (ev.clientY - dragOffset.y) + "px";
                  };
                  const up = () => {
                        document.removeEventListener('mousemove', move);
                        document.removeEventListener('mouseup', up);
                        dragHandle.style.cursor = "grab";
                  };
                  document.addEventListener('mousemove', move);
                  document.addEventListener('mouseup', up);
            };
            containerPanel.appendChild(dragHandle);

            let outsideHandler;
            const closeBtn = createButton("X", "background-color:red;width:26px;height:26px;position:absolute;top:6px;right:6px;margin:0px;min-height:26px;border:0px;font-weight:bold;font-size:14px;", () => {
                  if(outsideHandler) document.removeEventListener('mousedown', outsideHandler, true);
                  closeCustomContextMenu();
            });
            containerPanel.appendChild(closeBtn);

            const panel = document.createElement('div');
            panel.style = "padding:10px;display:flex;flex-direction:column;gap:6px;color:white;";

            const title = createText("Shape Options", "color:white;font-weight:bold;margin:0;");
            panel.appendChild(title);

            const widthField = createInput_Infield("Width", roundNumber(svg_pixelToMM(shapeBounds.width), 1), "box-shadow: black 4px 6px 20px 0px;width:calc(100% - 10px);", () => {
                  let nextWidth = parseFloat(widthField[1].value);
                  let nextHeight = parseFloat(heightField[1].value);
                  if(!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight)) return;
                  this.scaleShapeGroupToSize(targetShape, nextWidth, nextHeight);
            }, null, false, 1, {postfix: "mm"});
            widthField[1].setAttribute("min", "0");
            widthField[1].style.width = "calc(100% - 0px)";

            const heightField = createInput_Infield("Height", roundNumber(svg_pixelToMM(shapeBounds.height), 1), "box-shadow: black 4px 6px 20px 0px;width:calc(100% - 10px);", () => {
                  let nextWidth = parseFloat(widthField[1].value);
                  let nextHeight = parseFloat(heightField[1].value);
                  if(!Number.isFinite(nextWidth) || !Number.isFinite(nextHeight)) return;
                  this.scaleShapeGroupToSize(targetShape, nextWidth, nextHeight);
            }, null, false, 1, {postfix: "mm"});
            heightField[1].setAttribute("min", "0");
            heightField[1].style.width = "calc(100% - 0px)";

            const colorRow = document.createElement("div");
            colorRow.style = "display:flex;align-items:center;gap:8px;margin:5px 0px;";
            const colorLabel = createText("Fill Colour", "color:white;margin:0;min-width:80px;");
            const colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.value = this.getShapeFillHex(targetShape);
            colorInput.style = "width:48px;height:32px;padding:0;border:0;background:none;cursor:pointer;";
            colorInput.addEventListener("input", () => {
                  this.applyShapeFill(targetShape, colorInput.value);
            });
            colorRow.appendChild(colorLabel);
            colorRow.appendChild(colorInput);

            const eyeDropperBtn = createButton("Eye Dropper", "width:calc(100% - 10px);margin:5px;", async () => {
                  if(typeof EyeDropper === "undefined") {
                        alert("EyeDropper API is not available in this browser.");
                        return;
                  }
                  try {
                        const eyeDropper = new EyeDropper();
                        const result = await eyeDropper.open();
                        if(result?.sRGBHex) {
                              colorInput.value = result.sRGBHex;
                              this.applyShapeFill(targetShape, result.sRGBHex);
                        }
                  } catch(error) {
                        console.warn("EyeDropper cancelled or failed.", error);
                  }
            });
            if(typeof EyeDropper === "undefined") eyeDropperBtn.disabled = true;

            const deleteBtn = createButton("Delete", "background-color:red;border-color:red;width:calc(100% - 10px);margin:5px;", () => {
                  Array.from(shapeGroup?.querySelectorAll?.(".outerPath, .innerPath") || []).forEach((element) => {
                        element.classList.add("SVGSelected");
                  });
                  this.deleteSelectedShapes();
            });

            panel.appendChild(widthField[0]);
            panel.appendChild(heightField[0]);
            panel.appendChild(colorRow);
            panel.appendChild(eyeDropperBtn);
            panel.appendChild(deleteBtn);

            containerPanel.appendChild(panel);
            customContextMenuContainer.appendChild(containerPanel);

            const rectBounds = customContextMenuContainer.getBoundingClientRect();
            let top = rectBounds.top;
            let left = rectBounds.left;
            if(rectBounds.bottom > window.innerHeight) top = Math.max(0, window.innerHeight - rectBounds.height - 10);
            if(rectBounds.right > window.innerWidth) left = Math.max(0, window.innerWidth - rectBounds.width - 10);
            customContextMenuContainer.style.top = `${top}px`;
            customContextMenuContainer.style.left = `${left}px`;

            outsideHandler = (ev) => {
                  if(customContextMenuContainer && !customContextMenuContainer.contains(ev.target)) {
                        closeCustomContextMenu();
                        document.removeEventListener('mousedown', outsideHandler, true);
                  }
            };
            document.addEventListener('mousedown', outsideHandler, true);
      }

      setCurrentTool(tool) {
            if(this.currentTool === "Selection Tool" && this.selectionRect) {
                  this.selectionRect.Delete();
                  this.selectionRect = null;
            }
            if(this.currentTool === "Rectangle Tool") {
                  this.finalizeDrawRectanglePreview();
            }
            if(this.currentTool === "Circle Tool") {
                  this.finalizeDrawCirclePreview();
            }
            if(this.currentTool === "Grab Tool") {
                  this.finalizeGrabShape();
            }
            this.#activeTool = tool;
            this.updateToolButtonStates();
            this.refreshMeasurements();
            this.updateTools("Tool Selected");
      }

      updateTools(state, event) {
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
                              this.selectionRect = null;
                        }
                        break;
                  case "Rectangle Tool":
                        this.#dragZoomSVG.allowPanning = false;

                        if(state == "Mouse Down") {
                              this.#drawRectangleMouseDownPos = {...this.#dragZoomSVG.relativeMouseXY};

                              this.#drawRectanglePreview = new TSVGRectangle(this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT"), {
                                    x: this.#drawRectangleMouseDownPos.x,
                                    y: this.#drawRectangleMouseDownPos.y,
                                    width: 0,
                                    height: 0,
                                    strokeWidth: (1 / this.#dragZoomSVG.scale),
                                    stroke: "black",
                                    fill: "#fffffe",
                                    opacity: 0.5
                              });
                        } else if(state == "Mouse Move") {
                              if(this.#dragZoomSVG.isHolding) {
                                    this.updateDragRectanglePreview(this.#dragZoomSVG.relativeMouseXY);
                              }
                        } else if(state == "Mouse Up") {
                              this.updateDragRectanglePreview(this.#dragZoomSVG.relativeMouseXY);
                              this.finalizeDrawRectanglePreview();
                        }
                        break;
                  case "Circle Tool":
                        this.#dragZoomSVG.allowPanning = false;

                        if(state == "Mouse Down") {
                              this.#drawCircleMouseDownPos = {...this.#dragZoomSVG.relativeMouseXY};

                              this.#drawCirclePreview = new TSVGRectangle(this.#dragZoomSVG.svg.querySelector("#mainGcreatedByT"), {
                                    x: this.#drawCircleMouseDownPos.x,
                                    y: this.#drawCircleMouseDownPos.y,
                                    width: 0,
                                    height: 0,
                                    strokeWidth: (1 / this.#dragZoomSVG.scale),
                                    stroke: "black",
                                    fill: "#fffffe",
                                    opacity: 0.5
                              });
                        } else if(state == "Mouse Move") {
                              if(this.#dragZoomSVG.isHolding) {
                                    this.updateDragCirclePreview(this.#dragZoomSVG.relativeMouseXY);
                              }
                        } else if(state == "Mouse Up") {
                              this.updateDragCirclePreview(this.#dragZoomSVG.relativeMouseXY);
                              this.finalizeDrawCirclePreview();
                        }
                        break;
                  case "Grab Tool":
                        this.#dragZoomSVG.allowPanning = false;

                        if(state == "Mouse Down") {
                              let targetShape = event ? this.getContextTargetShape(event) : null;
                              if(targetShape) {
                                    this.beginGrabShape(targetShape);
                              }
                        } else if(state == "Mouse Move") {
                              if(this.#dragZoomSVG.isHolding) {
                                    this.updateGrabShape(this.#dragZoomSVG.relativeMouseXY);
                              }
                        } else if(state == "Mouse Up") {
                              this.updateGrabShape(this.#dragZoomSVG.relativeMouseXY);
                              this.finalizeGrabShape();
                        }
                        break;
                  case "Delete Tool":
                        this.deleteSelectedShapes();
                        break;

                  default:
                        this.#dragZoomSVG.allowPanning = true;
                        break;
            }
      }

      /**Overrides DragZoomSVG onMouseUpdate*/
      onMouseUpdate = (updateFrom, event) => {
            this.updateTools(updateFrom, event);
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

      getOverallSvgBounds() {
            if(!this.#dragZoomSVG?.svg) return null;
            let target = this.#dragZoomSVG.svg.querySelector("#pathGroup") || this.#dragZoomSVG.svgG || this.#dragZoomSVG.svg;
            if(!target?.getBBox) return null;
            try {
                  return target.getBBox();
            } catch(error) {
                  console.warn("Unable to get SVG bounds.", error);
                  return null;
            }
      }

      getCachedOriginalBounds(svgText) {
            if(!svgText) return null;
            try {
                  let svgElement = svg_makeFromString(svgText);
                  if(!svgElement) return null;
                  let widthMm = parseFloat(svgElement.getAttribute("data-original-width-mm"));
                  let heightMm = parseFloat(svgElement.getAttribute("data-original-height-mm"));
                  if(Number.isFinite(widthMm) && Number.isFinite(heightMm)) {
                        return {width: widthMm, height: heightMm};
                  }
            } catch(error) {
                  console.warn("Unable to parse SVG text for cached bounds.");
            }
            return null;
      }

      applyOriginalBoundsToSvgElement(svgElement) {
            if(!svgElement || !this.#originalBoundsMm) return;
            svgElement.setAttribute("data-original-width-mm", this.#originalBoundsMm.width);
            svgElement.setAttribute("data-original-height-mm", this.#originalBoundsMm.height);
      }

      cacheOriginalBounds() {
            if(this.#originalBoundsMm) return;
            let cachedBounds = this.getCachedOriginalBounds(this.#svgText);
            if(cachedBounds) {
                  this.#originalBoundsMm = {
                        width: cachedBounds.width,
                        height: cachedBounds.height
                  };
                  return;
            }
            let bounds = this.getOverallSvgBounds();
            if(!bounds || bounds.width <= 0 || bounds.height <= 0) return;
            this.#originalBoundsMm = {
                  width: svg_pixelToMM(bounds.width),
                  height: svg_pixelToMM(bounds.height)
            };
      }

      updateCalculatedScaleFields() {
            if(!this.#widthShouldBeField || !this.#heightShouldBeField || !this.#calculatedScaleText) return;
            if(!this.#originalBoundsMm) this.cacheOriginalBounds();
            let boundsWidthMm = this.#originalBoundsMm?.width;
            let boundsHeightMm = this.#originalBoundsMm?.height;
            if(!boundsWidthMm || !boundsHeightMm) {
                  this.#calculatedScaleText.innerText = "Calculated Scale: --";
                  this.#calculatedScaleValue = 1;
                  return;
            }

            let widthValue = parseFloat(this.#widthShouldBeField[1].value);
            let heightValue = parseFloat(this.#heightShouldBeField[1].value);

            let widthScale = Number.isFinite(widthValue) ? widthValue / boundsWidthMm : null;
            let heightScale = Number.isFinite(heightValue) ? heightValue / boundsHeightMm : null;

            if(Number.isFinite(widthScale) && Number.isFinite(heightScale)) {
                  this.#calculatedScaleValue = roundNumber((widthScale + heightScale) / 2, 6);
                  this.#calculatedScaleText.innerText = `Calculated Scale: ${this.#calculatedScaleValue} (W ${roundNumber(widthScale, 6)} / H ${roundNumber(heightScale, 6)})`;
                  return;
            }

            if(Number.isFinite(widthScale)) {
                  this.#calculatedScaleValue = roundNumber(widthScale, 6);
                  this.#calculatedScaleText.innerText = `Calculated Scale: ${this.#calculatedScaleValue}`;
                  return;
            }

            if(Number.isFinite(heightScale)) {
                  this.#calculatedScaleValue = roundNumber(heightScale, 6);
                  this.#calculatedScaleText.innerText = `Calculated Scale: ${this.#calculatedScaleValue}`;
                  return;
            }

            this.#calculatedScaleText.innerText = "Calculated Scale: --";
            this.#calculatedScaleValue = 1;
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
            let shapeAreaPolygonGroup = this.#dragZoomSVG?.svg?.querySelector("#shapeAreaPolygons");
            if(shapeAreaPolygonGroup) shapeAreaPolygonGroup.remove();
            this.scaleSvgPaths(scaleValue);
            if(this.#svgBaseSize && this.#dragZoomSVG?.svg) {
                  let width = roundNumber(this.#svgBaseSize.width * scaleValue, 6);
                  let height = roundNumber(this.#svgBaseSize.height * scaleValue, 6);
            }
            this.#dragZoomSVG.refreshElementStyles();
            this.refreshMeasurements();
            this.fitToSvgBounds();
            this.updateSavePulse();
            this.updateCalculatedScaleFields();
            this.saveControlSettings();
      }

      updateSavePulse() {
            if(!this.#f_saveSVG) return;
            if(this.#svgScale !== 1) {
                  this.#f_saveSVG.classList.add("urgentPulse");
                  return;
            }
            this.#f_saveSVG.classList.remove("urgentPulse");
      }

      cacheOriginalPathData() {
            if(!this.#dragZoomSVG) return;
            this.#dragZoomSVG.allPathElements.forEach((element) => {
                  if(!element.dataset.baseD) {
                        element.dataset.baseD = element.getAttribute("d") || "";
                  }
            });
      }

      normalizeSvgPathData(pathData) {
            if(!pathData) return null;
            let trimmedPathData = String(pathData).trim();
            if(!trimmedPathData || trimmedPathData.toLowerCase() === "z") return null;

            let normalizedPathData = trimmedPathData
                  .replace(/([Zz])(?:\s*[Zz])+/g, "$1")
                  .replace(/([Zz])\s*(?=[+-]?\d|\.)/g, "$1 M");

            if(!/^[Mm]/.test(normalizedPathData)) {
                  if(/^[+-]?\d|\./.test(normalizedPathData)) {
                        normalizedPathData = `M${normalizedPathData}`;
                  } else {
                        return null;
                  }
            }

            return normalizedPathData;
      }

      scaleSvgPaths(scaleValue) {
            this.cacheOriginalPathData();
            this.#dragZoomSVG.allPathElements.forEach((element) => {
                  let baseD = element.dataset.baseD;
                  if(!baseD) return;
                  let normalizedPathData = this.normalizeSvgPathData(baseD);
                  if(!normalizedPathData) return;
                  try {
                        let scaledPath = new SVGPathCommander(normalizedPathData)
                              .transform({scale: scaleValue})
                              .toString();
                        element.setAttribute("d", scaledPath);
                  } catch(error) {
                        console.warn("Unable to scale SVG path.", error);
                  }
            });
      }

      refreshMeasurements() {
            this.#dragZoomSVG.syncScaleFromTransform();
            if(this.#totalPathLength) {
                  $(this.#totalPathLength[1]).val(this.#dragZoomSVG.totalPathLengths).change();
            }

            let groupsToRemove = ["overallMeasures", "itemMeasures", "shapeAreas", "shapeAreaPolygons", "partAreas", "shapeBoundingRects", "itemPoints"];
            groupsToRemove.forEach((groupId) => {
                  let group = this.#dragZoomSVG.svg.querySelector(`#${groupId}`);
                  if(group) group.remove();
            });

            this.loadPathArea();
            this.loadBoundingRectAreas();

            if(this.#showOverallMeasures?.[1]?.checked) this.showOverallMeasures();
            if(this.#showIndividualMeasures?.[1]?.checked) this.showElementMeasures();
            if(this.#showIndividualAreas?.[1]?.checked) this.showPartAreas();
            if(this.#showShapeAreas?.[1]?.checked) this.showShapeAreas();
            if(this.#showShapeAreaPolygons?.[1]?.checked) this.showShapeAreaPolygons();
            if(this.#showShapeBoundingRect?.[1]?.checked) this.showShapeBoundingRect();
            if(this.#showPoints?.[1]?.checked) this.showElementPoints();
            this.#dragZoomSVG.syncScaleFromTransform();
      }

      fitToSvgBounds() {
            if(!this.#dragZoomSVG?.svg) return;
            this.#dragZoomSVG.centerAndFitSVGContent(this.#dragZoomSVG.svg, this.#dragZoomSVG.svgG, this.#dragZoomSVG.panZoomInstance);
      }

      scheduleInitialFitToSvgBounds() {
            let fitAttempts = [0, 40, 120];
            fitAttempts.forEach((delay) => {
                  setTimeout(() => {
                        if(!this.#dragZoomSVG?.svg || !this.#dragZoomSVG?.container?.isConnected) return;
                        let containerRect = this.#dragZoomSVG.container.getBoundingClientRect();
                        if(containerRect.width <= 0 || containerRect.height <= 0) return;
                        this.fitToSvgBounds();
                  }, delay);
            });
      }

      applySavedControlSettings() {
            let settings = this.getSavedControlSettings();
            this.#svgScale = settings.svgScale ?? 1;
            if(this.#svgScaleField?.[1]) {
                  this.#isUpdatingSvgScale = true;
                  this.#svgScaleField[1].value = this.#svgScale;
                  this.#isUpdatingSvgScale = false;
            }
            this.applySvgScale(this.#svgScale);
      }

      saveControlSettings() {
            ModalSVG.#lastControlSettings = {
                  svgScale: this.#svgScale
            };
      }

      getSavedControlSettings() {
            return ModalSVG.#lastControlSettings || {svgScale: 1};
      }

}
