const VEHICLE_HANDLE_TYPES = ['topleft', 'top', 'topright', 'right', 'bottomright', 'bottom', 'bottomleft', 'left', 'center'];

function vehicle_createSvgElement(type, attributes = {}) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type);
      Object.entries(attributes).forEach(([key, value]) => {
            if(value !== undefined && value !== null) {
                  el.setAttribute(key, value);
            }
      });
      return el;
}

function vehicle_pointInPolygon(numCorners, vertsX, vertsY, x, y) {
      let i, j = 0;
      let c = false;
      for(i = 0, j = numCorners - 1; i < numCorners; j = i++) {
            if(((vertsY[i] > y) !== (vertsY[j] > y)) && (x < (vertsX[j] - vertsX[i]) * (y - vertsY[i]) / (vertsY[j] - vertsY[i]) + vertsX[i])) {
                  c = !c;
            }
      }
      return c;
}

function vehicle_cloneRect(rect) {
      return JSON.parse(JSON.stringify(rect));
}

var VehicleMenu_Template;
var VehicleMenu_MenuContainer;
let VehicleMenu_Production;
let VehicleMenu_TotalQuantity;
let VehicleMenu_Install;
let VehicleMenu_Artwork;

class Point {
      constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
      }
}

class TextCoord {
      constructor(u = 0, v = 0) {
            this.u = u;
            this.v = v;
      }
}

class Triangle {
      constructor(p0, p1, p2, t0, t1, t2) {
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.t0 = t0;
            this.t1 = t1;
            this.t2 = t2;
      }
}

class VehicleMenu extends LHSMenuWindow {
      #dragZoomSVG;
      #svgLayers = {};
      #defs;
      #state = {
            activeRectIndex: null,
            activeRectHandle: null,
            activeImageIndex: null,
            activeImageHandle: null,
            dragStartMouse: null,
            dragStartRect: null,
            dragStartImage: null,
            dragStartImageOffset: null
      };
      #images = [];
      #copiedImage = null;

      #canvasWidth = 1000;
      #canvasHeight = 600;

      #showMeasures = false;
      #showQuantity = true;
      #showDescription = true;

      constructor(width, height, ID, windowTitle) {
            super(width, height, ID, windowTitle);
            this.addPages(2);
            this.doesTick = false;
      }

      show() {
            super.show();
            super.clearPages();
            super.clearFooter();
            this.createContent();
      }

      hide() {
            this.#images = [];
            this.#state = {
                  activeRectIndex: null,
                  activeRectHandle: null,
                  activeImageIndex: null,
                  activeImageHandle: null,
                  dragStartMouse: null,
                  dragStartRect: null,
                  dragStartImage: null,
                  dragStartImageOffset: null
            };

            super.hide();
      }

      createContent() {
            const page = this.getPage(0);
            const footer = this.footer;
            const infoPage = this.getPage(1);
            let thisClass = this;

            const container = document.createElement('div');
            container.style = "width:100%;height:100%;display:block;background-color:white;position: relative;";

            const menuContainer = document.createElement('div');
            menuContainer.style = "display:block; width:60px;background-color:" + COLOUR.Blue + ";height:80%;position:absolute;top:0px;right:0px;";
            menuContainer.onwheel = function(event) {event.preventDefault();};
            container.appendChild(menuContainer);
            VehicleMenu_MenuContainer = menuContainer;

            this.#initDragZoom(container);
            this.#initLayers();

            const imageSrcs = [];
            const addDefaultRect = (item) => {
                  this.#ensureRectDefaults(item);
                  thisClass.rects.push(item);
                  VehicleMenu_Template.addRow(item);
                  this.updateFromTemplateFields();
                  this.refresh();
            };

            const addItem = (imageSrc, text, overrideCss, overrideImageCss, callback) => {
                  const itemContainer = document.createElement('div');
                  itemContainer.style = "display:block;float:left;width:100%;height:70px;margin:0px;cursor:pointer;background-color:" + COLOUR.Blue + ";padding:0px;border-bottom:1px solid #00b;";
                  itemContainer.style.cssText += overrideCss || "";
                  itemContainer.onmouseover = function() {itemContainer.style.backgroundColor = "#333";};
                  itemContainer.onmouseout = function() {itemContainer.style.backgroundColor = COLOUR.Blue;};
                  itemContainer.onclick = function() {
                        if(callback) callback();
                        deselectSelectorBars(true);
                        selectorBar.style.backgroundColor = "red";
                  };

                  const selectorBar = document.createElement('div');
                  selectorBar.style = "display:block;float:left;width:5px;height:100%;";
                  selectorBar.id = "selectorBar2";
                  itemContainer.appendChild(selectorBar);

                  const image = document.createElement('img');
                  image.src = imageSrc;
                  image.style = "display:block;float:left;width:35px;height:25px;padding:7.5px 10px;filter:invert(100%);background-size:cover;";
                  image.style.cssText += overrideImageCss || "";
                  itemContainer.appendChild(image);

                  const itemText = document.createElement('p');
                  itemText.innerText = text;
                  itemText.style = "display:block;float:left;width:90%;height:15px;margin:0px;padding:0px;color:white;font-weight:bold;font-size:12px;text-align: center;";
                  itemContainer.appendChild(itemText);

                  menuContainer.appendChild(itemContainer);
            };

            const addFileItem = (imageSrc, text, overrideCss, callback) => {
                  const itemContainer = document.createElement('div');
                  itemContainer.style = "display:block;float:left;width:100%;height:70px;margin:0px;cursor:pointer;background-color:" + COLOUR.Blue + ";padding:0px;border-bottom:1px solid #00b;position:relative;";
                  itemContainer.style.cssText += overrideCss || "";
                  itemContainer.onmouseover = function() {itemContainer.style.backgroundColor = "#333";};
                  itemContainer.onmouseout = function() {itemContainer.style.backgroundColor = COLOUR.Blue;};
                  itemContainer.onclick = function(e) {
                        e.stopPropagation();
                        deselectSelectorBars(true);
                        selectorBar.style.backgroundColor = "red";
                        $(itemChooseBtn)[0].click();
                  };

                  const selectorBar = document.createElement('div');
                  selectorBar.style = "display:block;float:left;width:5px;height:100%;";
                  selectorBar.id = "selectorBar2";
                  itemContainer.appendChild(selectorBar);

                  const image = document.createElement('img');
                  image.src = imageSrc;
                  image.style = "display:block;float:left;width:35px;height:25px;padding:7.5px 10px;filter:invert(100%);background-size:cover;";
                  itemContainer.appendChild(image);

                  const itemText = document.createElement('div');
                  itemText.innerText = text;
                  itemText.style = "display:block;float:left;width:90%;height:15px;padding:0px;color:white;font-weight:bold;font-size:12px;text-align: center;";
                  itemContainer.appendChild(itemText);

                  const itemChooseBtn = document.createElement('input');
                  itemChooseBtn.style = "z-index:1000";
                  itemChooseBtn.type = "file";
                  itemChooseBtn.id = "itemChooseBtn";
                  itemChooseBtn.multiple = true;
                  itemChooseBtn.style = "display:none";
                  itemChooseBtn.accept = "image/jpeg, image/png, image/jpg, image/svg+xml";
                  itemContainer.appendChild(itemChooseBtn);

                  const itemChooseLabel = document.createElement('label');
                  itemChooseLabel.htmlFor = "itemChooseBtn";
                  itemChooseLabel.innerText = "Choose";
                  itemChooseLabel.style = "display:none;background-color: indigo;color: white;padding: 0.5rem;font - family: sans - serif;border - radius: 0.3rem;cursor: pointer;position:absolute;top:0px;left:0px";
                  itemContainer.appendChild(itemChooseLabel);

                  itemContainer.addEventListener("change", async (e) => {
                        imageSrcs.length = 0;
                        if(window.File && window.FileReader && window.FileList && window.Blob) {
                              const files = e.target.files;
                              for(let i = 0; i < files.length; i++) {
                                    if(!files[i].type.match("image")) {
                                          alert("Not supported format");
                                          continue;
                                    }
                                    const picReader = new FileReader();
                                    picReader.addEventListener("load", function(event) {
                                          const picFile = event.target;
                                          imageSrcs.push("" + picFile.result);
                                          if(i === files.length - 1 && callback) callback();
                                    });
                                    picReader.readAsDataURL(files[i]);
                              }
                        } else {
                              alert("Your browser does not support File API");
                        }
                  });

                  menuContainer.appendChild(itemContainer);
            };

            addItem(ICON.add, "Vinyl", null, null, function() {
                  addDefaultRect({
                        x: thisClass.#getCenterPosReal().x - 300,
                        y: thisClass.#getCenterPosReal().y - 300,
                        w: 600,
                        h: 600,
                        qty: 1,
                        vinyl: VinylLookup["Air Release"],
                        laminate: LaminateLookup["Gloss"],
                        appTape: AppTapeLookup["Medium Tack"],
                        description: "Vinyl",
                        colour: "#FF5A5A"
                  });
            });
            addItem(ICON.add, "Oneway", null, null, function() {
                  addDefaultRect({
                        x: thisClass.#getCenterPosReal().x - 300,
                        y: thisClass.#getCenterPosReal().y - 300,
                        w: 600,
                        h: 600,
                        qty: 1,
                        vinyl: VinylLookup["Oneway Vehicle"],
                        laminate: LaminateLookup["3m Gloss (Standard)"],
                        appTape: "None",
                        description: "Oneway",
                        colour: "#5EEF7D"
                  });
            });
            addItem(ICON.add, "Panel", null, null, function() {
                  addDefaultRect({
                        x: thisClass.#getCenterPosReal().x - 300,
                        y: thisClass.#getCenterPosReal().y - 300,
                        w: 600,
                        h: 600,
                        qty: 1,
                        isPanel: true,
                        vinyl: VinylLookup["Air Release"],
                        laminate: LaminateLookup["Gloss"],
                        appTape: "None",
                        description: "Panel",
                        colour: "#FF5CFF"
                  });
            });
            addItem(ICON.add, "Tray Back", null, null, function() {
                  addDefaultRect({
                        x: thisClass.#getCenterPosReal().x - 300,
                        y: thisClass.#getCenterPosReal().y - 300,
                        w: 1800,
                        h: 300,
                        qty: 1,
                        isPanel: true,
                        vinyl: VinylLookup["Air Release"],
                        laminate: LaminateLookup["Gloss"],
                        appTape: "None",
                        description: "Tray Back Panel",
                        colour: "#FF5CFF"
                  });
            });
            addItem(ICON.add, "Tray Sides", null, null, function() {
                  addDefaultRect({
                        x: thisClass.#getCenterPosReal().x - 300,
                        y: thisClass.#getCenterPosReal().y - 300,
                        w: 2500,
                        h: 300,
                        qty: 2,
                        isPanel: true,
                        vinyl: VinylLookup["Air Release"],
                        laminate: LaminateLookup["Gloss"],
                        appTape: "None",
                        description: "Tray Sides Panel",
                        colour: "#FF5CFF"
                  });
            });

            addFileItem(ICON.add, "Images", null, async () => {
                  await this.addSkewableImages(null, null, imageSrcs);
                  this.refresh();
            });

            addItem(ICON.convert, "SVG Convert", null, null, function() {window.open("https://cloudconvert.com/eps-to-svg", "_blank");});

            addItem(ICON.add, "Copy Template", null, null, function() {
                  Ordui.Alert("Template Copied to Clipboard");
                  saveToClipboard(JSON.stringify(thisClass.rects));
            });

            const createVehicleProduct = async () => {
                  thisClass.minimize();
                  await AddBlankProduct();
                  const productNo = getNumProducts();
                  let partNo = 0;
                  await setProductName(productNo, "Vehicle Graphics");
                  partNo = await VehicleMenu_Template.Create(productNo, partNo);
                  partNo = await VehicleMenu_Production.Create(productNo, partNo);
                  partNo = await VehicleMenu_Install.Create(productNo, partNo);
                  partNo = await VehicleMenu_Artwork.Create(productNo, partNo);
                  const pSummary = VehicleMenu_Template.Description() +
                        VehicleMenu_Production.Description() +
                        VehicleMenu_Artwork.Description() +
                        VehicleMenu_Install.Description();

                  await setProductSummary(productNo, pSummary);
                  Ordui.Alert("Done.");
            };

            const measuresCkb = createCheckbox_Infield("Show Measurements", this.#showMeasures, "width: 200px;", () => {this.#showMeasures = measuresCkb[1].checked; this.refresh();}, footer);
            const qtyCkb = createCheckbox_Infield("Show Quantity", this.#showQuantity, "width: 200px;", () => {this.#showQuantity = qtyCkb[1].checked; this.refresh();}, footer);
            const descriptionCkb = createCheckbox_Infield("Show Description", this.#showDescription, "width: 200px;", () => {this.#showDescription = descriptionCkb[1].checked; this.refresh();}, footer);

            VehicleMenu_TotalQuantity = new TotalQuantity(infoPage, this.#dragZoomSVG?.svgG, () => {this.updateFromTemplateFields();}, this.#dragZoomSVG);
            VehicleMenu_Template = new VehicleTemplate(infoPage, this.#dragZoomSVG?.svgG, () => {this.initRects(); this.refresh(); this.initBackground();}, () => {this.updateRectsFromFields();}, (rowNumber) => {this.deleteRect(rowNumber);});
            VehicleMenu_Production = new Production(infoPage, this.#dragZoomSVG?.svgG, () => { });
            VehicleMenu_Production.requiredName = "Production";
            VehicleMenu_Install = new Install(infoPage, this.#dragZoomSVG?.svgG, () => { });
            VehicleMenu_Artwork = new Artwork(infoPage, this.#dragZoomSVG?.svgG, () => { });

            page.appendChild(container);

            const fieldCreateProduct = createButton('Create Product', 'width:300px;height:35px;margin:0px;display:block;float:right', createVehicleProduct);
            footer.appendChild(fieldCreateProduct);

            this.initBackground();
            this.initRects();
            this.refresh();
      }

      #initDragZoom(container) {
            const svgTemplate = '<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="8000mm" height="6000mm" viewBox="0 0 8000 6000"><g id="mainGcreatedByT" transform="matrix(1 0 0 1 0 0)"></g></svg>';
            this.#dragZoomSVG = new DragZoomSVG("calc(100% - 60px)", this.#canvasHeight + "px", svgTemplate, container, {
                  convertShapesToPaths: false,
                  scaleStrokeOnScroll: false,
                  scaleFontOnScroll: true,
                  defaultStrokeWidth: 1,
                  defaultFontSize: 12,
                  overrideCssStyles: "float:left;"
            });

            const baseOnZoom = this.#dragZoomSVG.onZoom.bind(this.#dragZoomSVG);
            this.#dragZoomSVG.onZoom = () => {
                  baseOnZoom();
                  this.refresh();
            };

            this.#dragZoomSVG.onMouseUpdate = () => { };

            this.#dragZoomSVG.container.addEventListener('contextmenu', (event) => this.#handleContextMenu(event));
            this.#dragZoomSVG.container.addEventListener('click', () => {this.#clearSelections(); this.refresh();});
      }

      #initLayers() {
            this.#defs = vehicle_createSvgElement('defs');
            this.#dragZoomSVG.svg.insertBefore(this.#defs, this.#dragZoomSVG.svg.firstChild);
            this.#svgLayers.background = vehicle_createSvgElement('g', {id: 'vehicle-background-layer'});
            this.#svgLayers.images = vehicle_createSvgElement('g', {id: 'vehicle-images-layer'});
            this.#svgLayers.rects = vehicle_createSvgElement('g', {id: 'vehicle-rect-layer'});
            this.#svgLayers.handles = vehicle_createSvgElement('g', {id: 'vehicle-handle-layer'});
            this.#svgLayers.labels = vehicle_createSvgElement('g', {id: 'vehicle-label-layer'});
            this.#svgLayers.measures = vehicle_createSvgElement('g', {id: 'vehicle-measure-layer'});

            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.background);
            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.images);
            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.rects);
            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.measures);
            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.labels);
            this.#dragZoomSVG.svgG.appendChild(this.#svgLayers.handles);
      }

      get rects() {
            if(!this._rects) this._rects = [];
            return this._rects;
      }

      set rects(val) {this._rects = val;}

      initRects() {
            if(!VehicleMenu_Template.isStandardTemplate) {
                  this.rects = [];
                  VehicleMenu_Template.clearRows();
            } else {
                  this.rects = VehicleMenu_Template.selectedTemplateData.template_rects.map((rect) => ({
                        x: parseFloat(rect.x),
                        y: parseFloat(rect.y),
                        w: roundNumber(parseFloat(rect.w), 2),
                        h: roundNumber(parseFloat(rect.h), 2),
                        qty: parseFloat(rect.qty),
                        isPanel: rect.isPanel,
                        vinyl: rect.vinyl,
                        laminate: rect.laminate,
                        appTape: rect.appTape,
                        description: rect.description,
                        colour: rect.colour
                  }));
                  VehicleMenu_Template.clearRows();
                  this.rects.forEach((item) => VehicleMenu_Template.addRow(vehicle_cloneRect(item)));
                  this.updateFromTemplateFields();

                  VehicleMenu_Production.required = true;
                  VehicleMenu_Production.productionTime = VehicleMenu_Template.selectedTemplateData.production_time;
                  VehicleMenu_Production.productionTotalEach = VehicleMenu_Template.selectedTemplateData.production_TE;

                  VehicleMenu_Install.installRequired = true;
                  VehicleMenu_Install.installMinutes = VehicleMenu_Template.selectedTemplateData.install_time;
                  VehicleMenu_Install.installRate = VehicleMenu_Template.selectedTemplateData.install_rate;
                  VehicleMenu_Install.installTotalEach = VehicleMenu_Template.selectedTemplateData.install_TE;
            }
      }

      initBackground() {
            this.#svgLayers.background.innerHTML = "";
            this.#images = [];

            if(VehicleMenu_Template.isStandardTemplate) {
                  const img = new Image();
                  const tem = VehicleMenu_Template.templateData;
                  img.src = tem[1];
                  img.onload = () => {
                        const imageEl = vehicle_createSvgElement('image', {
                              href: img.src,
                              width: tem[2],
                              height: tem[3],
                              x: 0,
                              y: 0,
                              preserveAspectRatio: 'none'
                        });
                        this.#svgLayers.background.appendChild(imageEl);
                        this.#dragZoomSVG.centerAndFitSVGContent();
                  };
            }
      }

      refresh() {
            this.#defs.innerHTML = "";
            this.#svgLayers.images.innerHTML = "";
            this.#svgLayers.rects.innerHTML = "";
            this.#svgLayers.handles.innerHTML = "";
            this.#svgLayers.labels.innerHTML = "";
            this.#svgLayers.measures.innerHTML = "";

            this.#renderImages();
            this.#renderRects();
      }

      #renderRects() {
            const scale = this.#dragZoomSVG.scale || 1;
            const handleRadius = 8 / scale;
            const textSize = 14 / scale;

            this.rects.forEach((rect, index) => {
                  const rectEl = vehicle_createSvgElement('rect', {
                        x: rect.x,
                        y: rect.y,
                        width: rect.w,
                        height: rect.h,
                        fill: rect.colour,
                        'fill-opacity': 0.65,
                        stroke: COLOUR.Black,
                        'stroke-width': 1 / scale
                  });
                  rectEl.addEventListener('mousedown', (e) => this.#startRectDrag(e, index, 'center'));
                  rectEl.addEventListener('click', (e) => {e.stopPropagation(); this.#selectRect(index);});
                  rectEl.addEventListener('mouseenter', () => {
                        rectEl.setAttribute('stroke-width', 2 / scale);
                        this.#dragZoomSVG.svg.style.cursor = 'grab';
                  });
                  rectEl.addEventListener('mouseleave', () => {
                        rectEl.setAttribute('stroke-width', 1 / scale);
                        this.#dragZoomSVG.svg.style.cursor = 'auto';
                  });
                  this.#svgLayers.rects.appendChild(rectEl);

                  if(this.#showDescription && rect.description) {
                        const text = vehicle_createSvgElement('text', {
                              x: rect.x + rect.w / 2,
                              y: rect.y + rect.h / 2,
                              'text-anchor': 'middle',
                              'alignment-baseline': 'middle',
                              'font-size': `${textSize}px`,
                              fill: COLOUR.Black,
                              'pointer-events': 'none'
                        });
                        text.textContent = rect.description;
                        this.#svgLayers.labels.appendChild(text);
                  }

                  if(this.#showQuantity) {
                        const qtyText = vehicle_createSvgElement('text', {
                              x: rect.x + rect.w / 2,
                              y: rect.y,
                              'text-anchor': 'middle',
                              'alignment-baseline': 'hanging',
                              'font-size': `${textSize}px`,
                              fill: COLOUR.Black,
                              'pointer-events': 'none'
                        });
                        qtyText.textContent = `x${rect.qty}`;
                        this.#svgLayers.labels.appendChild(qtyText);
                  }

                  if(this.#showMeasures) {
                        new TSVGMeasurement(this.#svgLayers.measures, {
                              target: rectEl,
                              direction: 'both',
                              sides: ['top', 'left'],
                              autoLabel: true,
                              unit: 'mm',
                              scale: 1,
                              precision: 1,
                              arrowSize: 10 / scale,
                              textOffset: 15 / scale,
                              lineWidth: 0.5 / scale,
                              fontSize: `${14 / scale}px`,
                              tickLength: 15 / scale,
                              handleRadius: 6 / scale,
                              offsetY: 20 / scale,
                              offsetX: 20 / scale
                        });
                  }

                  if(this.#state.activeRectIndex === index) {
                        VEHICLE_HANDLE_TYPES.forEach((handleType) => {
                              const pos = this.#getHandlePosition(rect, handleType);
                              const isActive = this.#state.activeRectHandle === handleType;
                              const baseFill = isActive ? (COLOUR.DarkBlue || '#00008b') : COLOUR.Blue;
                              const baseRadius = isActive ? handleRadius * 1.3 : handleRadius;
                              const handle = vehicle_createSvgElement('circle', {
                                    cx: pos.x,
                                    cy: pos.y,
                                    r: baseRadius,
                                    fill: baseFill,
                                    'fill-opacity': 0.8,
                                    stroke: COLOUR.Black,
                                    'stroke-width': 1 / scale
                              });
                              handle.addEventListener('mousedown', (e) => this.#startRectDrag(e, index, handleType));
                              handle.addEventListener('mouseenter', () => {
                                    handle.setAttribute('fill', COLOUR.DarkBlue || '#0000aa');
                                    handle.setAttribute('r', handleRadius * 1.2);
                                    this.#dragZoomSVG.svg.style.cursor = 'grab';
                              });
                              handle.addEventListener('mouseleave', () => {
                                    handle.setAttribute('fill', baseFill);
                                    handle.setAttribute('r', baseRadius);
                                    this.#dragZoomSVG.svg.style.cursor = 'auto';
                              });
                              this.#svgLayers.handles.appendChild(handle);
                        });
                  }
            });
      }

      #renderImages() {
            const scale = this.#dragZoomSVG.scale || 1;
            const handleRadius = 8 / scale;

            this.#images.forEach((imageObj, imgIndex) => {
                  const imgEl = vehicle_createSvgElement('image', {
                        x: imageObj.x,
                        y: imageObj.y,
                        width: imageObj.w,
                        height: imageObj.h,
                        'preserveAspectRatio': 'none'
                  });
                  imgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageObj.src);
                  this.#svgLayers.images.appendChild(imgEl);

                  const outline = vehicle_createSvgElement('rect', {
                        x: imageObj.x,
                        y: imageObj.y,
                        width: imageObj.w,
                        height: imageObj.h,
                        fill: 'none',
                        stroke: COLOUR.Black,
                        'stroke-width': 1 / scale,
                        'stroke-dasharray': '6 4'
                  });
                  outline.addEventListener('mousedown', (e) => this.#startImageDrag(e, imgIndex, 'center'));
                  outline.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.#state.activeImageIndex = imgIndex;
                        this.#state.activeImageHandle = null;
                        this.#state.activeRectIndex = null;
                        this.refresh();
                  });
                  outline.addEventListener('mouseenter', () => {this.#dragZoomSVG.svg.style.cursor = 'grab';});
                  outline.addEventListener('mouseleave', () => {this.#dragZoomSVG.svg.style.cursor = 'auto';});
                  this.#svgLayers.images.appendChild(outline);

                  const overlay = vehicle_createSvgElement('rect', {
                        x: imageObj.x,
                        y: imageObj.y,
                        width: imageObj.w,
                        height: imageObj.h,
                        fill: 'transparent'
                  });
                  overlay.addEventListener('mousedown', (e) => this.#startImageDrag(e, imgIndex, 'grabbable'));
                  overlay.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.#state.activeImageIndex = imgIndex;
                        this.#state.activeImageHandle = null;
                        this.#state.activeRectIndex = null;
                        this.refresh();
                  });
                  overlay.addEventListener('mouseenter', () => {this.#dragZoomSVG.svg.style.cursor = 'grab';});
                  overlay.addEventListener('mouseleave', () => {this.#dragZoomSVG.svg.style.cursor = 'auto';});
                  this.#svgLayers.images.appendChild(overlay);

                  if(this.#state.activeImageIndex === imgIndex) {
                        VEHICLE_HANDLE_TYPES.forEach((handleType) => {
                              const pos = this.#getImageHandlePosition(imageObj, handleType);
                              const isActive = this.#state.activeImageHandle === handleType;
                              const baseFill = isActive ? (COLOUR.DarkBlue || '#00008b') : COLOUR.Blue;
                              const baseRadius = isActive ? handleRadius * 1.3 : handleRadius;
                              const handle = vehicle_createSvgElement('circle', {
                                    cx: pos.x,
                                    cy: pos.y,
                                    r: baseRadius,
                                    fill: baseFill,
                                    stroke: COLOUR.Black,
                                    'stroke-width': 1 / scale
                              });
                              handle.addEventListener('mousedown', (e) => this.#startImageDrag(e, imgIndex, handleType));
                              handle.addEventListener('mouseenter', () => {
                                    handle.setAttribute('fill', COLOUR.DarkBlue || '#0000aa');
                                    handle.setAttribute('r', handleRadius * 1.2);
                                    this.#dragZoomSVG.svg.style.cursor = 'grab';
                              });
                              handle.addEventListener('mouseleave', () => {
                                    handle.setAttribute('fill', baseFill);
                                    handle.setAttribute('r', baseRadius);
                                    this.#dragZoomSVG.svg.style.cursor = 'auto';
                              });
                              this.#svgLayers.handles.appendChild(handle);
                        });
                  }
            });
      }

      #startRectDrag(event, rectIndex, handleType) {
            event.preventDefault();
            event.stopPropagation();
            this.#dragZoomSVG.allowPanning = false;
            this.#dragZoomSVG.updateMouseXY(event);

            this.#selectRect(rectIndex);
            this.#state.activeImageIndex = null;
            this.#state.activeRectHandle = handleType;
            this.#state.dragStartMouse = {...this.#dragZoomSVG.relativeMouseXY};
            this.#state.dragStartRect = vehicle_cloneRect(this.rects[rectIndex]);
            this.#dragZoomSVG.svg.style.cursor = 'grabbing';

            const onMove = (e) => {
                  this.#dragZoomSVG.updateMouseXY(e);
                  this.#updateRectFromDrag(rectIndex);
                  this.updateFromTemplateFields();
                  this.refresh();
            };
            const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                  this.#dragZoomSVG.allowPanning = true;
                  this.#state.activeRectHandle = null;
                  this.#state.dragStartMouse = null;
                  this.#state.dragStartRect = null;
                  this.updateRectsFromFields();
                  this.refresh();
                  this.#dragZoomSVG.svg.style.cursor = 'auto';
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
      }

      #startImageDrag(event, imageIndex, cornerIndex) {
            event.preventDefault();
            event.stopPropagation();
            this.#dragZoomSVG.allowPanning = false;
            this.#dragZoomSVG.updateMouseXY(event);

            this.#state.activeRectIndex = null;
            this.#state.activeImageIndex = imageIndex;
            this.#state.activeImageHandle = cornerIndex;
            this.#state.dragStartMouse = {...this.#dragZoomSVG.relativeMouseXY};
            this.#state.dragStartImage = vehicle_cloneRect(this.#images[imageIndex]);
            this.#state.dragStartImageOffset = {
                  dx: this.#dragZoomSVG.relativeMouseXY.x - this.#images[imageIndex].x,
                  dy: this.#dragZoomSVG.relativeMouseXY.y - this.#images[imageIndex].y
            };
            this.#dragZoomSVG.svg.style.cursor = 'grabbing';

            const onMove = (e) => {
                  this.#dragZoomSVG.updateMouseXY(e);
                  this.#updateImageFromDrag(imageIndex);
                  this.refresh();
            };
            const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                  this.#dragZoomSVG.allowPanning = true;
                  this.#state.activeImageHandle = null;
                  this.#state.dragStartMouse = null;
                  this.#state.dragStartImage = null;
                  this.#state.dragStartImageOffset = null;
                  this.refresh();
                  this.#dragZoomSVG.svg.style.cursor = 'auto';
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
      }

      #updateRectFromDrag(index) {
            const rect = this.rects[index];
            const startRect = this.#state.dragStartRect;
            const mouse = this.#dragZoomSVG.relativeMouseXY;
            const dx = mouse.x - this.#state.dragStartMouse.x;
            const dy = mouse.y - this.#state.dragStartMouse.y;

            switch(this.#state.activeRectHandle) {
                  case 'topleft':
                        rect.x = startRect.x + dx;
                        rect.y = startRect.y + dy;
                        rect.w = startRect.w - dx;
                        rect.h = startRect.h - dy;
                        break;
                  case 'top':
                        rect.y = startRect.y + dy;
                        rect.h = startRect.h - dy;
                        break;
                  case 'topright':
                        rect.y = startRect.y + dy;
                        rect.w = startRect.w + dx;
                        rect.h = startRect.h - dy;
                        break;
                  case 'right':
                        rect.w = startRect.w + dx;
                        break;
                  case 'bottomright':
                        rect.w = startRect.w + dx;
                        rect.h = startRect.h + dy;
                        break;
                  case 'bottom':
                        rect.h = startRect.h + dy;
                        break;
                  case 'bottomleft':
                        rect.x = startRect.x + dx;
                        rect.w = startRect.w - dx;
                        rect.h = startRect.h + dy;
                        break;
                  case 'left':
                        rect.x = startRect.x + dx;
                        rect.w = startRect.w - dx;
                        break;
                  default:
                        rect.x = startRect.x + dx;
                        rect.y = startRect.y + dy;
                        break;
            }
            rect.w = Math.max(rect.w, 1);
            rect.h = Math.max(rect.h, 1);
      }

      #updateImageFromDrag(index) {
            const image = this.#images[index];
            const start = this.#state.dragStartImage;
            const mouse = this.#dragZoomSVG.relativeMouseXY;
            const dx = mouse.x - this.#state.dragStartMouse.x;
            const dy = mouse.y - this.#state.dragStartMouse.y;

            switch(this.#state.activeImageHandle) {
                  case 'grabbable':
                        image.x = mouse.x - this.#state.dragStartImageOffset.dx;
                        image.y = mouse.y - this.#state.dragStartImageOffset.dy;
                        break;
                  case 'topleft':
                        image.x = start.x + dx;
                        image.y = start.y + dy;
                        image.w = start.w - dx;
                        image.h = start.h - dy;
                        break;
                  case 'top':
                        image.y = start.y + dy;
                        image.h = start.h - dy;
                        break;
                  case 'topright':
                        image.y = start.y + dy;
                        image.w = start.w + dx;
                        image.h = start.h - dy;
                        break;
                  case 'right':
                        image.w = start.w + dx;
                        break;
                  case 'bottomright':
                        image.w = start.w + dx;
                        image.h = start.h + dy;
                        break;
                  case 'bottom':
                        image.h = start.h + dy;
                        break;
                  case 'bottomleft':
                        image.x = start.x + dx;
                        image.w = start.w - dx;
                        image.h = start.h + dy;
                        break;
                  case 'left':
                        image.x = start.x + dx;
                        image.w = start.w - dx;
                        break;
                  default:
                        image.x = start.x + dx;
                        image.y = start.y + dy;
                        break;
            }
            image.w = Math.max(image.w, 1);
            image.h = Math.max(image.h, 1);
      }

      #selectRect(index) {
            this.#state.activeRectIndex = index;
            this.#state.activeImageIndex = null;
      }

      #clearSelections() {
            this.#state.activeRectIndex = null;
            this.#state.activeRectHandle = null;
            this.#state.activeImageIndex = null;
            this.#state.activeImageHandle = null;
      }

      #getHandlePosition(rect, handleType) {
            switch(handleType) {
                  case 'topleft': return {x: rect.x, y: rect.y};
                  case 'top': return {x: rect.x + rect.w / 2, y: rect.y};
                  case 'topright': return {x: rect.x + rect.w, y: rect.y};
                  case 'right': return {x: rect.x + rect.w, y: rect.y + rect.h / 2};
                  case 'bottomright': return {x: rect.x + rect.w, y: rect.y + rect.h};
                  case 'bottom': return {x: rect.x + rect.w / 2, y: rect.y + rect.h};
                  case 'bottomleft': return {x: rect.x, y: rect.y + rect.h};
                  case 'left': return {x: rect.x, y: rect.y + rect.h / 2};
                  default: return {x: rect.x + rect.w / 2, y: rect.y + rect.h / 2};
            }
      }

      #getImageHandlePosition(img, handleType) {
            return this.#getHandlePosition({x: img.x, y: img.y, w: img.w, h: img.h}, handleType);
      }

      updateRectsFromFields() {
            for(let n = 0; n < this.rects.length; n++) {
                  const row = VehicleMenu_Template.contentContainer.querySelectorAll('#rowContainer')[n];
                  if(!row) continue;
                  this.rects[n].description = row.querySelector('#description').value;
                  this.rects[n].w = roundNumber(parseFloat(row.querySelector('#width').value), 2);
                  this.rects[n].h = roundNumber(parseFloat(row.querySelector('#height').value), 2);
                  this.rects[n].qty = parseFloat(row.querySelector('#quantity').value);
                  this.rects[n].appTape = row.querySelector('#tape').value;
                  this.rects[n].vinyl = row.querySelector('#vinyl').value;
                  this.rects[n].laminate = row.querySelector('#laminate').value;
            }
            this.refresh();
      }

      updateFromTemplateFields() {
            for(let n = 0; n < this.rects.length; n++) {
                  const row = VehicleMenu_Template.contentContainer.querySelectorAll('#rowContainer')[n];
                  if(!row) continue;
                  row.querySelector('#description').value = this.rects[n].description;
                  row.querySelector('#quantity').value = parseFloat(this.rects[n].qty);
                  row.querySelector('#width').value = roundNumber(parseFloat(this.rects[n].w), 2);
                  row.querySelector('#height').value = roundNumber(parseFloat(this.rects[n].h), 2);
                  row.querySelector('#tape').value = this.rects[n].appTape;
                  row.querySelector('#vinyl').value = this.rects[n].vinyl;
                  row.querySelector('#laminate').value = this.rects[n].laminate;
            }
      }

      deleteRect(rowNumber) {
            this.rects.splice(rowNumber, 1);
            this.refresh();
      }

      async addSkewableImages(xOffset, yOffset, srcArray, c1, c2, c3, c4) {
            for(let y = 0; y < srcArray.length; y++) {
                  const image = new Image();
                  image.src = srcArray[y];
                  await new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = reject;
                  });

                  const isSVG = srcArray[y].includes('image/svg+xml') || srcArray[y].includes('.svg');
                  const widthMM = pixelToMM(image.width);
                  const heightMM = pixelToMM(image.height);
                  const width = isSVG ? widthMM : image.width;
                  const height = isSVG ? heightMM : image.height;

                  const center = this.#getCenterPosReal();
                  const defaultX = (xOffset ?? center.x - width / 2);
                  const defaultY = (yOffset ?? center.y - height / 2);

                  this.#images.push({
                        image,
                        src: srcArray[y],
                        width,
                        height,
                        x: c1?.x ?? defaultX,
                        y: c1?.y ?? defaultY,
                        w: c2?.x ? (c2.x - (c1?.x ?? defaultX)) : width,
                        h: c4?.y ? (c4.y - (c1?.y ?? defaultY)) : height,
                        naturalW: width,
                        naturalH: height
                  });
            }
      }

      #getCenterPosReal() {
            const boundingRect = this.#dragZoomSVG.container.getBoundingClientRect();
            const width = boundingRect.right - boundingRect.left;
            const height = boundingRect.bottom - boundingRect.top;
            const transform = this.#dragZoomSVG.panZoomInstance ? this.#dragZoomSVG.panZoomInstance.getTransform() : {x: 0, y: 0, scale: this.#dragZoomSVG.scale || 1};
            const scale = transform.scale || this.#dragZoomSVG.scale || 1;
            return {
                  x: (width / 2 - transform.x) / scale,
                  y: (height / 2 - transform.y) / scale
            };
      }

      #ensureRectDefaults(item) {
            item.w = item.w || 100;
            item.h = item.h || 100;
            item.qty = item.qty || 1;
            item.description = item.description || "";
            item.colour = item.colour || COLOUR.Blue;
      }

      #handleContextMenu(event) {
            event.preventDefault();
            this.#dragZoomSVG.updateMouseXY(event);
            const pos = this.#dragZoomSVG.relativeMouseXY;

            const rectIndex = this.#getRectAtPosition(pos.x, pos.y);
            const imageIndex = this.#getSkewRectAtPosition(pos.x, pos.y);

            if(rectIndex === false && imageIndex === false) return;

            if(!customContextMenuContainer) initCustomContextMenu();
            setFieldHidden(false, customContextMenuContainer);
            customContextMenuContainer.style.left = event.pageX + "px";
            customContextMenuContainer.style.top = event.pageY + "px";

            removeAllChildrenFromParent(customContextMenuContainer);
            const closeBtn = createButton("X", "background-color:red;width:20px;height:20px;position:absolute;top:-21px;right:0;margin:0px;min-height:20px;border:0px;", closeCustomContextMenu);
            customContextMenuContainer.appendChild(closeBtn);

            const panel = document.createElement('div');
            panel.style = "padding:10px;display:flex;flex-direction:column;gap:6px;color:white;background-color:" + COLOUR.DarkGrey + ";min-width:260px;";

            if(rectIndex !== false && rectIndex !== null) {
                  const rect = this.rects[rectIndex];
                  const title = createText("Rectangle Options", "color:white;font-weight:bold;margin:0;");
                  panel.appendChild(title);

                  const desc = createInput_Infield("Description", rect.description, null, null, null, false)[1];
                  const qty = createInput_Infield("Qty", rect.qty, null, null, null, false, 1)[1];
                  const width = createInput_Infield("Width", rect.w, null, null, null, false, 1)[1];
                  const height = createInput_Infield("Height", rect.h, null, null, null, false, 1)[1];
                  const rta = createCheckbox_Infield("Is RTA", rect.appTape !== "None", null, null, null)[1];

                  [desc, qty, width, height, rta].forEach(el => {el.style.width = "100%";});

                  const scaleW = createInput_Infield("Target Width", rect.w, null, null, null, false, 1)[1];
                  const scaleH = createInput_Infield("Target Height", rect.h, null, null, null, false, 1)[1];
                  scaleW.style.width = "100%";
                  scaleH.style.width = "100%";

                  const applyBtn = createButton("Apply", "width:100%;", () => {
                        rect.description = desc.value;
                        rect.qty = parseFloat(qty.value || rect.qty);
                        rect.w = parseFloat(width.value || rect.w);
                        rect.h = parseFloat(height.value || rect.h);
                        rect.appTape = rta.checked ? AppTapeLookup["Medium Tack"] : "None";
                        this.refresh();
                        this.updateFromTemplateFields();
                  });

                  const scaleBtn = createButton("Calc Scale", "width:100%;", () => {
                        const targetW = parseFloat(scaleW.value || rect.w);
                        const targetH = parseFloat(scaleH.value || rect.h);
                        const scaleResultW = targetW / rect.w;
                        const scaleResultH = targetH / rect.h;
                        scaleW.value = targetW;
                        scaleH.value = targetH;
                        alert(`Width scale: ${scaleResultW.toFixed(3)} | Height scale: ${scaleResultH.toFixed(3)}`);
                  });

                  const deleteBtn = createButton("Delete", "width:100%;background-color:red;border-color:red;", () => {
                        this.deleteRect(rectIndex);
                        VehicleMenu_Template.deleteRow(rectIndex);
                        this.refresh();
                        closeCustomContextMenu();
                  });

                  panel.appendChild(desc.parentElement);
                  panel.appendChild(qty.parentElement);
                  panel.appendChild(width.parentElement);
                  panel.appendChild(height.parentElement);
                  panel.appendChild(rta.parentElement);
                  panel.appendChild(scaleW.parentElement);
                  panel.appendChild(scaleH.parentElement);
                  panel.appendChild(applyBtn);
                  panel.appendChild(scaleBtn);
                  panel.appendChild(deleteBtn);
            } else if(imageIndex !== false && imageIndex !== null) {
                  const img = this.#images[imageIndex];
                  const title = createText("Image Options", "color:white;font-weight:bold;margin:0;");
                  panel.appendChild(title);

                  const width = createInput_Infield("Width", img.w, null, null, null, false, 1)[1];
                  const height = createInput_Infield("Height", img.h, null, null, null, false, 1)[1];
                  [width, height].forEach(el => {el.style.width = "100%";});

                  const applyBtn = createButton("Apply Size", "width:100%;", () => {
                        img.w = parseFloat(width.value || img.w);
                        img.h = parseFloat(height.value || img.h);
                        this.refresh();
                  });

                  const deleteBtn = createButton("Delete", "width:100%;background-color:red;border-color:red;", () => {
                        this.#deleteSkewableRect(imageIndex);
                        closeCustomContextMenu();
                  });

                  const copyBtn = createButton("Copy", "width:100%;", () => {this.#copySkewableRect(imageIndex);});
                  const pasteBtn = createButton("Paste", "width:100%;", () => {this.#pasteSkewableRect(pos.x, pos.y); this.refresh();});
                  const resetBtn = createButton("Reset Size", "width:100%;", () => {this.#resetSkewableRect(imageIndex);});
                  const saveBtn = createButton("Save To File", "width:100%;", () => {this.#saveSkewableImageToFile(imageIndex);});

                  const fileInput = document.createElement('input');
                  fileInput.type = "file";
                  fileInput.accept = ".txt,text/plain";
                  fileInput.style.display = "none";
                  fileInput.addEventListener('change', (e) => {this.#openSkewableImageFromFile(e, pos.x, pos.y);});
                  const loadBtn = createButton("Open From File", "width:100%;", () => {fileInput.click();});

                  panel.appendChild(width.parentElement);
                  panel.appendChild(height.parentElement);
                  panel.appendChild(applyBtn);
                  panel.appendChild(copyBtn);
                  panel.appendChild(pasteBtn);
                  panel.appendChild(resetBtn);
                  panel.appendChild(saveBtn);
                  panel.appendChild(loadBtn);
                  panel.appendChild(fileInput);
                  panel.appendChild(deleteBtn);
            }

            customContextMenuContainer.appendChild(panel);
      }

      resetView() {
            const instance = this.#dragZoomSVG.panZoomInstance;
            if(instance) {
                  instance.moveTo(0, 0);
                  instance.zoomAbs(0, 0, 0.3);
            }
            this.#dragZoomSVG.onZoom();
            this.refresh();
      }

      #getRectAtPosition(xPos, yPos) {
            for(let s = 0; s < this.rects.length; s++) {
                  if(xPos >= this.rects[s].x && xPos <= this.rects[s].x + this.rects[s].w && yPos >= this.rects[s].y && yPos <= this.rects[s].y + this.rects[s].h) return s;
            }
            return false;
      }

      #getSkewRectAtPosition(xPos, yPos) {
            for(let s = 0; s < this.#images.length; s++) {
                  const img = this.#images[s];
                  if(xPos >= img.x && xPos <= img.x + img.w && yPos >= img.y && yPos <= img.y + img.h) return s;
            }
            return false;
      }

      #setQtyRect(shapeIndex) {
            const modal = new ModalSingleInput("Enter New Quantity", () => {
                  this.rects[shapeIndex].qty = parseFloat(modal.value);
                  this.refresh();
            });
            modal.setContainerSize(300, 300);
            $(modal.valField[1]).val(this.rects[shapeIndex].qty).change();
      }

      #setSizeRect(shapeIndex) {
            const modal = new ModalWidthHeight("Change Size", 100, () => {
                  this.rects[shapeIndex].w = parseFloat(modal.width);
                  this.rects[shapeIndex].h = parseFloat(modal.height);
                  this.refresh();
            });
            modal.setContainerSize(300, 300);
            $(modal.widthField[1]).val(this.rects[shapeIndex].w).change();
            $(modal.heightField[1]).val(this.rects[shapeIndex].h).change();
      }

      #setDescriptionRect(shapeIndex) {
            const modal = new ModalSingleInputText("Enter Description", () => {
                  this.rects[shapeIndex].description = modal.value;
                  this.refresh();
            });
            modal.setContainerSize(300, 300);
            $(modal.valField[1]).val(this.rects[shapeIndex].description).change();
      }

      #setIsRTARect(shapeIndex) {
            const modal = new ModalSingleInputCheckbox("Set Is RTA", () => {
                  modal.value === true ? this.rects[shapeIndex].appTape = AppTapeLookup["Medium Tack"] : this.rects[shapeIndex].appTape = "None";
                  this.refresh();
            });
            modal.setContainerSize(300, 300);
            $(modal.valField[1]).prop("checked", this.rects[shapeIndex].appTape === "None" ? false : true).change();
      }

      #getScaleRect(shapeIndex) {
            const rectWidth = this.rects[shapeIndex].w;
            const rectHeight = this.rects[shapeIndex].h;
            const modal = new ModalWidthHeightWithCalcResult("Reverse Engineer Scale", "Width should be", "Height should be", "New Width Scale", "New Height Scale", function() {
                  $(modal.calcWidthField[1]).val(modal.width / rectWidth).change();
            }, function() {
                  $(modal.calcHeightField[1]).val(modal.height / rectHeight).change();
            }, null);
            modal.setContainerSize(300, 300);
      }

      #deleteSkewableRect(shapeIndex) {
            if(shapeIndex !== null && shapeIndex !== false) {
                  this.#images.splice(shapeIndex, 1);
                  this.refresh();
            } else {
                  alert("cant delete SkewableRects");
            }
      }

      #scaleSkewableRect(shapeIndex) {
            const modal = new ModalWidthHeight("Apply Scale", 1, () => {
                  const scaleW = (modal.width || modal.width !== 0) ? modal.width - 1 : 0;
                  const scaleH = (modal.height || modal.height !== 0) ? modal.height - 1 : 0;
                  const img = this.#images[shapeIndex];
                  const centerCoord = {x: img.x + img.w / 2, y: img.y + img.h / 2};
                  img.x = centerCoord.x + (img.x - centerCoord.x) * (1 + scaleW);
                  img.y = centerCoord.y + (img.y - centerCoord.y) * (1 + scaleH);
                  img.w = img.w * (1 + scaleW);
                  img.h = img.h * (1 + scaleH);
                  this.refresh();
            });
            modal.setContainerSize(300, 300);
      }

      #copySkewableRect(shapeIndex) {
            const image = this.#images[shapeIndex];
            this.#copiedImage = vehicle_cloneRect(image);
      }

      async #pasteSkewableRect(xPos, yPos) {
            if(this.#copiedImage != null) {
                  await this.addSkewableImages(xPos, yPos, [this.#copiedImage.src]);
                  const newImage = this.#images[this.#images.length - 1];
                  newImage.x = this.#copiedImage.x;
                  newImage.y = this.#copiedImage.y;
                  newImage.w = this.#copiedImage.w;
                  newImage.h = this.#copiedImage.h;
                  this.refresh();
            }
      }

      #resetSkewableRect(shapeIndex) {
            const image = this.#images[shapeIndex];
            const isSVG = image.src.includes('image/svg+xml') || image.src.includes('.svg');
            const widthMM = pixelToMM(image.image.width);
            const heightMM = pixelToMM(image.image.height);
            const width = isSVG ? widthMM : image.image.width;
            const height = isSVG ? heightMM : image.image.height;

            image.w = width;
            image.h = height;
            this.refresh();
      }

      async #saveSkewableImageToFile(shapeIndex) {
            const content = JSON.stringify([
                  {x: this.#images[shapeIndex].x, y: this.#images[shapeIndex].y, w: this.#images[shapeIndex].w, h: this.#images[shapeIndex].h},
                  this.#images[shapeIndex].src
            ]);
            await downloadFileContent_Text_SingleFile(content);
      }

      async #openSkewableImageFromFile(event, xPos, yPos) {
            const content = await getFileContent_Text_SingleFile(event);
            const parsedContent = JSON.parse(content);
            const rect = parsedContent[0];
            await this.addSkewableImages(rect.x, rect.y, [parsedContent[1]]);
            this.refresh();
      }
}

class VehicleTemplate extends SubMenu {
      UNIQUEID = "VEHICLE_TEMPLATE-" + generateUniqueID();
      uniqueKeys = ["panel", "vinyl", "laminate"];
      appTapeIsSumOfAll = true;

      constructor(parentObject, ctx, updateFunction, fieldChangeUpdateFunction, fieldDeleteFunction) {
            super(parentObject, ctx, updateFunction, "Vehicle Template");

            this.createGUI(parentObject, updateFunction, fieldChangeUpdateFunction, fieldDeleteFunction);
      }

      blankTemplates = blankVehicleTemplates;
      predefinedTemplates = predefinedVehicleTemplates;

      createGUI(parentObject, updateFunction, fieldChangeFunction, fieldDeleteFunction) {
            this.rowID = 0;
            this.fieldChangeFunction = fieldChangeFunction;
            this.fieldDeleteFunction = fieldDeleteFunction;
            this.parentObject = parentObject;

            var tempThis = this;
            this.l_wordingSpecific = createCheckbox_Infield("Use Vinyl Specifics in wording", false, "width:300px;float:left;", () => {tempThis.useSpecificsInWording = tempThis.l_wordingSpecific[1].checked;}, this.contentContainer);

            createHeading_Numbered(1, "Choose Template", "width:97%", this.contentContainer);

            this.l_standardCustom = createDropdown_Infield("Standard or Custom", 0, "", [createDropdownOption("Standard", "Standard"), createDropdownOption("Custom", "Custom")], this.changeStandardCustom, this.contentContainer);
            var dropdownItems_types = [];
            for(var l = 0; l < this.predefinedTemplates.length; l++) {
                  dropdownItems_types.push(createDropdownOption(this.predefinedTemplates[l][0], this.predefinedTemplates[l][0]));
            }
            this.l_vehicleTypes = createDropdown_Infield("Vehicle Type", 0, "", dropdownItems_types, this.changeVehicleTypes, this.contentContainer);

            this.l_predefinedTemplate = createDropdown_Infield("Predefined Templates", 0, "", this.predefinedTemplateNames, this.callback, this.contentContainer);

            var dropdownItems = [];
            for(var t = 0; t < this.blankTemplates.length; t++) {
                  dropdownItems.push(createDropdownOption(this.blankTemplates[t][0], this.blankTemplates[t][0]));
            }

            this.l_customTemplate = createDropdown_Infield("Custom Template", 0, "margin-left:50px;margin-right:70%", dropdownItems, this.callback, this.contentContainer);
            setFieldDisabled(true, this.l_customTemplate[1], this.l_customTemplate[0]);
            setFieldHidden(true, this.l_customTemplate[1], this.l_customTemplate[0]);

            createHeading_Numbered(2, "Rows", "width:97%", this.contentContainer);

            this.l_itemsContainer = document.createElement("div");
            this.l_itemsContainer.style = "width:100%;min-height:50px;background-color:white;display:block;float:left;";
            this.contentContainer.appendChild(this.l_itemsContainer);
      }

      changeVehicleTypes = () => {
            $(this.l_predefinedTemplate[1]).empty();
            var newTemplates = this.predefinedTemplateNames;
            if(newTemplates != []) {
                  for(var x = 0; x < newTemplates.length; x++) {
                        this.l_predefinedTemplate[1].add(newTemplates[x]);
                  }
            }
            this.callback();
      };

      changeStandardCustom = () => {
            if(this.l_standardCustom[1].value == "Standard") {
                  setFieldDisabled(true, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldHidden(true, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldDisabled(false, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldHidden(false, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldDisabled(false, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  setFieldHidden(false, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  this.changeVehicleTypes();
            } else {
                  setFieldDisabled(false, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldHidden(false, this.l_customTemplate[1], this.l_customTemplate[0]);
                  setFieldDisabled(true, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldHidden(true, this.l_vehicleTypes[1], this.l_vehicleTypes[0]);
                  setFieldDisabled(true, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
                  setFieldHidden(true, this.l_predefinedTemplate[1], this.l_predefinedTemplate[0]);
            }
            this.callback();
      };

      get predefinedTemplateNames() {
            var items = [];
            var vehicleTypesIndex = this.l_vehicleTypes[1].selectedIndex;
            var numberPredefinedTemplates = this.predefinedTemplates[vehicleTypesIndex].length - 4;
            for(var a = 4; a < numberPredefinedTemplates + 4; a++) {
                  items.push(createDropdownOption(this.predefinedTemplates[vehicleTypesIndex][a].name, this.predefinedTemplates[vehicleTypesIndex][a].name));
            }
            return items;
      }

      get customTemplate() {
            return this.l_customTemplate;
      }

      get isStandardTemplate() {
            return this.l_standardCustom[1].value == "Standard";
      }

      get customTemplateChosen() {
            return this.customTemplate[1].value;
      }

      get templateData() {
            if(this.isStandardTemplate) {
                  var index = this.l_vehicleTypes[1].selectedIndex;
                  return this.predefinedTemplates[index];
            } else {
                  var index2 = this.customTemplate[1].selectedIndex;
                  return this.blankTemplates[index2];
            }
      }

      get selectedTemplateData() {
            if(this.isStandardTemplate) {
                  var vehicleTypeIndex = this.l_vehicleTypes[1].selectedIndex;
                  var chosenTemplateIndex = this.l_predefinedTemplate[1].selectedIndex;
                  return JSON.parse(JSON.stringify(this.predefinedTemplates[vehicleTypeIndex][chosenTemplateIndex + 4]));
            } else {
                  return false;
            }
      }

      addRow = (item) => {
            this.rowID++;
            var rowContainer = document.createElement('div');
            rowContainer.style = "width:100%;height:55px;display:block;float:left;background-color:#aaa;margin-top:10px;";
            rowContainer.id = "rowContainer";
            rowContainer.className = this.rowID;

            var description = createInput_Infield("Description", null, "width:100px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false);
            description[1].id = "description";
            var quantity = createInput_Infield("Qty", 1, "width:50px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 1);
            quantity[1].id = "quantity";
            var width = createInput_Infield("Width", 0, "width:120px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 50, {postfix: "mm"});
            width[1].id = "width";
            var height = createInput_Infield("Height", 0, "width:120px;height:40px;margin:5px;", () => {this.fieldChangeFunction();}, rowContainer, false, 50, {postfix: "mm"});
            height[1].id = "height";

            var tempThis = this;
            var deleteBtn = createButton("X", "width:40px;height:100%;margin:0px;margin-left:5px;margin-right:0px;background-color:red;border-color:red;float:right", () => {
                  var rows = tempThis.parentObject.querySelectorAll("#rowContainer");
                  var rowN = parseFloat(deleteBtn.id);
                  var actualIndex = 0;
                  for(var l = 0; l < rows.length; l++) {
                        if(rowN == parseFloat(rows[l].className)) actualIndex = l;
                  }
                  tempThis.deleteRow(actualIndex);
            }, rowContainer);
            deleteBtn.className = "deleteBtn";
            deleteBtn.id = this.rowID;

            var vinylParts = getPredefinedParts("Vinyl - ");
            var vinylDropdownElements = [];
            vinylDropdownElements.push(["None", "white"]);
            vinylParts.forEach((element) => {
                  let weightField = element.Weight;
                  if(weightField == "") vinylDropdownElements.push([element.Name, "white"]);
                  else {
                        let isStocked = false;
                        if(element.Weight.includes("Stocked:true")) isStocked = true;

                        if(isStocked) vinylDropdownElements.push([element.Name, "blue"]);
                  }
            });

            var vinyl = createDropdown_Infield_Icons_Search("Vinyl", 0, "width:200px;margin:5px;", 10, true, vinylDropdownElements, () => {this.fieldChangeFunction();}, rowContainer);
            vinyl[1].id = "vinyl";
            vinyl[6]();
            $(vinyl[1]).val(item ? item.vinyl : VinylLookup["Air Release"]).change();
            vinyl[7]();

            var laminateParts = getPredefinedParts("Laminate - ");
            var laminateDropdownElements = [];
            laminateDropdownElements.push(["None", "white"]);
            laminateParts.forEach((element) => {
                  let weightField = element.Weight;
                  if(weightField == "") laminateDropdownElements.push([element.Name, "white"]);
                  else {
                        let isStocked = false;
                        if(element.Weight.includes("Stocked:true")) isStocked = true;

                        if(isStocked) laminateDropdownElements.push([element.Name, "blue"]);
                  }
            });
            var laminate = createDropdown_Infield_Icons_Search("Laminate", 0, "width:200px;margin:5px;", 10, true, laminateDropdownElements, () => {this.fieldChangeFunction();}, rowContainer);
            laminate[1].id = "laminate";
            laminate[6]();
            $(laminate[1]).val(item ? item.laminate : LaminateLookup["Gloss"]).change();
            laminate[7]();

            if(item) {
                  if(item.isPanel == true) {
                        var panel = createCheckbox_Infield("Panel", true, "width:100px", () => {this.fieldChangeFunction();}, rowContainer);
                        panel[1].id = "panel";
                  }
                  if(item.description != "Oneway") {
                        var combo_3M = createButton("3M", "width:40px;height:45px;margin:5px;", () => {
                              dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["3M Vehicle"], false, true);
                              dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["3m Gloss (Standard)"], false, true);
                        });
                        rowContainer.appendChild(combo_3M);
                        var combo_Poly = createButton("Py", "width:40px;height:45px;margin:5px;", () => {
                              dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["Air Release"], false, true);
                              dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["Gloss"], false, true);
                        });
                        rowContainer.appendChild(combo_Poly);
                  }
            } else {
                  var combo_3M_2 = createButton("3M", "width:30px;height:45px;margin:5px;", () => {
                        dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["3M Vehicle"], false, true);
                        dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["3m Gloss (Standard)"], false, true);
                  });
                  rowContainer.appendChild(combo_3M_2);
                  var combo_Poly_2 = createButton("Py", "width:30px;height:45px;margin:5px;", () => {
                        dropdownInfieldIconsSearchSetSelected(vinyl, VinylLookup["Air Release"], false, true);
                        dropdownInfieldIconsSearchSetSelected(laminate, LaminateLookup["Gloss"], false, true);
                  });
                  rowContainer.appendChild(combo_Poly_2);
            }

            var tapeParts = getPredefinedParts("Tape - ");
            var tapeDropdownElements = [];
            tapeDropdownElements.push(["None", "white"]);
            tapeParts.forEach(element => tapeDropdownElements.push([element.Name, "white"]));
            var tape = createDropdown_Infield_Icons_Search("App Tape", 0, "width:200px;margin:5px;", 0, true, tapeDropdownElements, () => {this.fieldChangeFunction();}, rowContainer);
            tape[1].id = "tape";
            tape[6]();
            $(tape[1]).val(item ? item.appTape : AppTapeLookup["Medium Tack"]).change();
            tape[7]();

            this.l_itemsContainer.appendChild(rowContainer);
      };

      deleteRow = (rowN) => {
            var tempThis = this;
            var rows = tempThis.parentObject.querySelectorAll("#rowContainer");

            tempThis.fieldDeleteFunction(rowN);
            $(rows[rowN]).remove();
      };

      clearRows = () => {
            while(this.l_itemsContainer.childElementCount > 0) {
                  this.l_itemsContainer.removeChild(this.l_itemsContainer.lastChild);
            }
      };

      toggle = () => {
            if(!this.required) {
            } else {

            }
            this.callback();
      };

      Update() {}

      rowObjects = [];
      uniqueGroupsByKeys = [];
      async Create(productNo, partIndex) {
            this.rowObjects = [];
            this.uniqueGroupsByKeys = [];
            if(this.required) {
                  var rows = this.l_itemsContainer.querySelectorAll("#rowContainer");
                  for(let i = 0; i < rows.length; i++) {
                        var includesPanelYN = VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelectorAll("#panel").length > 0;
                        this.rowObjects.push({
                              description: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#description").value,
                              width: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#width").value,
                              height: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#height").value,
                              quantity: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#quantity").value,
                              vinyl: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#vinyl").value,
                              laminate: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#laminate").value,
                              appTape: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelector("#tape").value,
                              includesPanel: VehicleMenu_Template.container.contentContainer.querySelectorAll("#rowContainer")[i].querySelectorAll("#panel").length > 0,
                              panel: (includesPanelYN ? ACMLookup["Standard Primer"] : false)
                        });
                        var uniqueItem = {};
                        for(var key of this.uniqueKeys) {
                              uniqueItem[key] = this.rowObjects[i][key];
                        }

                        if(i == 0) {
                              this.uniqueGroupsByKeys.push(uniqueItem);
                        } else {
                              var isFound = this.uniqueGroupsByKeys.find(element => {
                                    for(var key of this.uniqueKeys) {
                                          if(element[key] !== this.rowObjects[i][key]) return false;
                                    }
                                    return true;
                              });

                              if(!isFound) {
                                    this.uniqueGroupsByKeys.push(uniqueItem);
                              }
                        }
                  }
                  for(let i = 0; i < this.uniqueGroupsByKeys.length; i++) {
                        let descriptionText = "";

                        let area = 0;
                        for(let row = 0; row < this.rowObjects.length; row++) {
                              var lastItem = row == this.rowObjects.length - 1;
                              var isInGroup = true;
                              for(var key of this.uniqueKeys) {
                                    if(this.rowObjects[row][key] !== this.uniqueGroupsByKeys[i][key]) {
                                          isInGroup = false;
                                    }
                              }
                              if(isInGroup) {
                                    descriptionText += "x" + this.rowObjects[row].quantity + " @ " +
                                          roundNumber(this.rowObjects[row].width, 2) + "mmW x " +
                                          roundNumber(this.rowObjects[row].height, 2) + "mmH (" +
                                          this.rowObjects[row].description + ")" + "\n";
                                    area += this.rowObjects[row].quantity * mmToM(this.rowObjects[row].width) * mmToM(this.rowObjects[row].height);
                              }

                              if(lastItem) {
                                    var squareSide = roundNumber(Math.sqrt(m2ToMM2(area)), 2);
                                    for(let value in this.uniqueGroupsByKeys[i]) {
                                          if(this.uniqueGroupsByKeys[i][value] === false || this.uniqueGroupsByKeys[i][value] === 'None') continue;
                                          partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, this.uniqueGroupsByKeys[i][value], 1, squareSide, squareSide, this.uniqueGroupsByKeys[i][value], descriptionText, true);
                                    }

                                    await GroupParts(productNo);

                              }
                        }

                  }
                  if(this.appTapeIsSumOfAll) {
                        let appText = "";
                        let area = 0;
                        for(let row = 0; row < this.rowObjects.length; row++) {
                              if(this.rowObjects[row].appTape != "None") {
                                    appText += "x" + this.rowObjects[row].quantity + " @ " +
                                          roundNumber(this.rowObjects[row].width, 2) + "mmW x " +
                                          roundNumber(this.rowObjects[row].height, 2) + "mmH (" +
                                          this.rowObjects[row].description + ")" + "\n";
                                    area += this.rowObjects[row].quantity * mmToM(this.rowObjects[row].width) * mmToM(this.rowObjects[row].height);
                              }
                        }
                        if(area != 0) {
                              var squareSide = roundNumber(Math.sqrt(m2ToMM2(area)), 2);
                              partIndex = await q_AddPart_DimensionWH(productNo, partIndex, true, AppTapeLookup["Medium Tack"], 1, squareSide, squareSide, "App Tape (for all)", appText, no);
                        }
                  }
                  console.log(this.uniqueGroupsByKeys);
            }
            return partIndex;
      }

      set useSpecificsInWording(value) {
            this.l_useSpecificsInWording = value;
      }

      get useSpecificsInWording() {
            return this.l_useSpecificsInWording;
      }

      Description() {
            let str = "";
            str += "High quality Vehicle Graphics" + "<br>" +
                  "Coverage Includes: " +
                  "<ul>";
            for(let row = 0; row < this.rowObjects.length; row++) {
                  str += "<li>" + this.rowObjects[row].description + "</li>";
            }
            str += "</ul>" + "<br>";
            if(this.useSpecificsInWording) {
                  str += "Specific Materials Used: " + "<ul>";
                  for(var i = 0; i < this.uniqueGroupsByKeys.length; i++) {
                        var value = this.uniqueGroupsByKeys[i];
                        str += "<li>" + "Group " + (i + 1) + "</li>";
                        str += "<ul>";
                        $.each(value, function(idx2, val2) {
                              if(val2 != false) {

                                    str += "<li>" + val2 + "</li>";

                              }
                        });
                        str += "</ul>";
                  }
                  str += "</ul>" + "<br>";
            }
            str += "Vehicles must be brought in clean where graphics are applied, or an additional cleaning charge of $95/h+gst will be applied" + "<br>" + "<br>";

            return str;
      }
}
