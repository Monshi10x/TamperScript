let svg3dViewerImportMapInjected = false;

const svg3dViewerClamp = (value, min, max) => Math.max(min, Math.min(max, value));

function svg3dViewerMakeTextSprite(THREE, opts) {
      const {
            text,
            px = 18,
            labelScale = 3,
            bgColor = "#0a2a7a",
            textColor = "#b9d2ff",
            borderColor = "#2f7bff"
      } = opts;

      const pad = Math.ceil(px * 0.65);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      ctx.font = `800 ${px}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
      const metrics = ctx.measureText(text);
      const textW = Math.ceil(metrics.width);
      const textH = Math.ceil(px * 1.25);

      const cssW = textW + pad * 2;
      const cssH = textH + pad;

      const scale = svg3dViewerClamp(Math.round(labelScale), 1, 6);
      canvas.width = cssW * scale;
      canvas.height = cssH * scale;

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.font = `800 ${px}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
      ctx.textBaseline = "middle";

      ctx.fillStyle = svg3dViewerHexToRgba(bgColor, 0.9);
      svg3dViewerRoundRect(ctx, 0, 0, cssW, cssH, 10);
      ctx.fill();

      ctx.strokeStyle = svg3dViewerHexToRgba(borderColor, 0.95);
      ctx.lineWidth = 2;
      svg3dViewerRoundRect(ctx, 1, 1, cssW - 2, cssH - 2, 10);
      ctx.stroke();

      ctx.fillStyle = svg3dViewerHexToRgba(textColor, 0.98);
      ctx.fillText(text, pad, cssH / 2);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;

      const mat = new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthTest: false,
            depthWrite: false
      });

      const sprite = new THREE.Sprite(mat);
      sprite.renderOrder = 10000;
      sprite.userData._labelCssAspect = cssH / cssW;

      return sprite;
}

function svg3dViewerAddDraftDimension({
      THREE,
      group,
      a,
      b,
      offsetDir,
      offset,
      extOver,
      arrowSize,
      labelText,
      labelPx,
      labelScale,
      worldTextSize,
      labelBgColor,
      labelTextColor,
      labelBorderColor,
      color = 0xffffff
}) {
      const lineMat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.9,
            depthTest: false,
            depthWrite: false
      });

      const aOff = a.clone().add(offsetDir.clone().multiplyScalar(offset));
      const bOff = b.clone().add(offsetDir.clone().multiplyScalar(offset));

      const extAEnd = aOff.clone().add(offsetDir.clone().multiplyScalar(extOver));
      const extBEnd = bOff.clone().add(offsetDir.clone().multiplyScalar(extOver));
      group.add(makeLine(THREE, lineMat, a, extAEnd));
      group.add(makeLine(THREE, lineMat, b, extBEnd));

      const dirAB = bOff.clone().sub(aOff).normalize();
      group.add(makeLine(THREE, lineMat, aOff, bOff));

      const dirOutA = dirAB.clone().negate();
      const dirOutB = dirAB.clone();

      const coneHeight = arrowSize;
      const coneRadius = arrowSize * 0.35;
      const halfH = coneHeight * 0.5;

      const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 12, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.95,
            depthTest: false,
            depthWrite: false
      });

      const coneA = new THREE.Mesh(coneGeo, coneMat);
      const coneB = new THREE.Mesh(coneGeo, coneMat);

      orientConeToDir(THREE, coneA, dirOutA);
      orientConeToDir(THREE, coneB, dirOutB);

      coneA.position.copy(aOff).add(dirOutA.clone().multiplyScalar(-halfH));
      coneB.position.copy(bOff).add(dirOutB.clone().multiplyScalar(-halfH));

      coneA.renderOrder = 9000;
      coneB.renderOrder = 9000;
      group.add(coneA);
      group.add(coneB);

      const mid = aOff.clone().lerp(bOff, 0.5);
      const label = svg3dViewerMakeTextSprite(THREE, {
            text: labelText,
            px: labelPx,
            labelScale,
            bgColor: labelBgColor,
            textColor: labelTextColor,
            borderColor: labelBorderColor
      });

      label.position.copy(mid).add(offsetDir.clone().multiplyScalar(arrowSize * 0.7));
      const aspect = label.userData._labelCssAspect || 0.5;
      label.scale.set(worldTextSize, worldTextSize * aspect, 1);
      group.add(label);

      function makeLine(THREE2, material, p1, p2) {
            const geo = new THREE2.BufferGeometry().setFromPoints([p1, p2]);
            const line = new THREE2.Line(geo, material);
            line.renderOrder = 8000;
            return line;
      }

      function orientConeToDir(THREE2, mesh, dir) {
            const up = new THREE2.Vector3(0, 1, 0);
            mesh.quaternion.copy(new THREE2.Quaternion().setFromUnitVectors(up, dir.clone().normalize()));
      }
}

function svg3dViewerRoundRect(ctx, x, y, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
}

function svg3dViewerHexToRgba(hex, alpha) {
      const value = (hex || "#000000").replace("#", "").trim();
      const hexValue = value.length === 3 ? value.split("").map((ch) => ch + ch).join("") : value;
      const num = parseInt(hexValue, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `rgba(${r},${g},${b},${alpha})`;
}

async function injectSvg3DViewerImportMap() {
      if(svg3dViewerImportMapInjected) return;
      if(document.querySelector('script[type="importmap"][data-threejs-tm="1"]')) {
            svg3dViewerImportMapInjected = true;
            return;
      }

      const script = document.createElement("script");
      script.type = "importmap";
      script.setAttribute("data-threejs-tm", "1");
      script.textContent = JSON.stringify({
            imports: {
                  "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
                  "three/examples/jsm/controls/OrbitControls.js":
                        "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js",
                  "three/examples/jsm/loaders/SVGLoader.js":
                        "https://unpkg.com/three@0.160.0/examples/jsm/loaders/SVGLoader.js",
                  "three/examples/jsm/exporters/GLTFExporter.js":
                        "https://unpkg.com/three@0.160.0/examples/jsm/exporters/GLTFExporter.js"
            }
      });
      document.head.appendChild(script);
      svg3dViewerImportMapInjected = true;
}

class ModalSVG3DViewer {
      #options;
      #button;
      #modal;
      #viewerContainer;
      #canvas;
      #renderer;
      #scene;
      #camera;
      #controls;
      #grid;
      #svgRoot;
      #svgUserGroup;
      #svgFixGroup;
      #mesh;
      #measureGroup;
      #resizeObserver;
      #initialized = false;
      #svgText;
      #settingsContainer;
      #settingsContent;
      #sidebar;
      #fpsElement;
      #fpsFrames = 0;
      #fpsLastTime = 0;
      #fpsLastReport = 0;

      #THREE;
      #OrbitControls;
      #SVGLoader;
      #GLTFExporter;
      #settings;

      constructor(parentToAppendTo, options = {}) {
            this.#options = {
                  title: "3D SVG Viewer",
                  buttonLabel: "3D Viewer",
                  buttonStyle: "margin:5px;min-height:40px;width:calc(50% - 10px);box-sizing:border-box;",
                  modalWidth: 900,
                  modalHeight: 650,
                  backgroundColor: "#0a0a0c",
                  svgTextProvider: null,
                  startHidden: true
            };
            Object.assign(this.#options, options);

            this.#button = createButton(this.#options.buttonLabel, this.#options.buttonStyle, () => {
                  this.open();
            }, parentToAppendTo);

            if(this.#options.startHidden) this.setButtonVisible(false);

            this.#settings = {
                  scale: 1,
                  depth: 10,
                  curveSegments: 12,
                  flipX: false,
                  flipY: false,
                  flipZ: false,
                  wireframe: false,
                  doubleSided: true,
                  showGrid: true,
                  bgColor: this.#options.backgroundColor,
                  showFPS: false,
                  measuresEnabled: false,
                  measuresW: true,
                  measuresH: true,
                  measuresD: true,
                  measureDecimals: 2,
                  measureTextPx: 18,
                  measureLabelScale: 3,
                  measureOffset: 25,
                  measureExtOver: 8,
                  measureArrowSize: 8,
                  measureLabelBgColor: "#0a2a7a",
                  measureLabelTextColor: "#b9d2ff",
                  measureLabelBorderColor: "#2f7bff",
                  mmPerUnit: 1
            };
      }

      setButtonVisible(isVisible) {
            if(!this.#button) return;
            this.#button.style.display = isVisible ? "block" : "none";
      }

      setSvgText(svgText) {
            this.#svgText = svgText;
      }

      getSvgText() {
            if(this.#options.svgTextProvider) return this.#options.svgTextProvider();
            return this.#svgText;
      }

      async open() {
            const svgText = this.getSvgText();
            if(!svgText) return;

            if(!this.#modal) this.#createModal();
            this.#modal.show();
            await this.#ensureInitialized();
            this.loadSvgText(svgText);
            this.#fitRendererToCanvas();
      }

      #createModal() {
            this.#modal = new Modal(this.#options.title, () => { });
            this.#modal.setContainerSize(this.#options.modalWidth, this.#options.modalHeight);
            this.#modal.hide();

            const body = this.#modal.getBodyElement();
            body.style.overflow = "hidden";

            const layout = document.createElement("div");
            layout.style = "width:100%;height:100%;display:flex;flex-direction:row;gap:0px;";
            body.appendChild(layout);

            this.#viewerContainer = document.createElement("div");
            this.#viewerContainer.style = `flex:1;height:100%;background-color:${this.#options.backgroundColor};position:relative;`;
            layout.appendChild(this.#viewerContainer);

            this.#canvas = document.createElement("canvas");
            this.#canvas.style = "width:100%;height:100%;display:block;";
            this.#viewerContainer.appendChild(this.#canvas);

            this.#fpsElement = document.createElement("div");
            this.#fpsElement.style = "position:absolute;top:8px;left:8px;padding:4px 6px;background:rgba(0,0,0,0.6);color:#fff;font-size:12px;border-radius:4px;display:none;z-index:2;";
            this.#fpsElement.textContent = "FPS: --";
            this.#viewerContainer.appendChild(this.#fpsElement);

            this.#sidebar = document.createElement("div");
            this.#sidebar.style = "width:260px;height:100%;border-left:1px solid #ddd;background-color:#f9f9f9;box-sizing:border-box;padding:10px;overflow-y:auto;";
            layout.appendChild(this.#sidebar);

            this.#buildSidebar();

            this.#modal.addFooterElement(createButton("Close", "width:100px;float:right;margin:5px;", () => {
                  this.#modal.hide();
            }));
      }

      async #ensureInitialized() {
            if(this.#initialized) return;

            await injectSvg3DViewerImportMap();
            const THREE = await import("three");
            const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js");
            const {SVGLoader} = await import("three/examples/jsm/loaders/SVGLoader.js");
            const {GLTFExporter} = await import("three/examples/jsm/exporters/GLTFExporter.js");

            this.#THREE = THREE;
            this.#OrbitControls = OrbitControls;
            this.#SVGLoader = SVGLoader;
            this.#GLTFExporter = GLTFExporter;

            this.#buildScene();
            this.#startAnimation();
            this.#initialized = true;
      }

      #buildScene() {
            const THREE = this.#THREE;

            this.#renderer = new THREE.WebGLRenderer({
                  canvas: this.#canvas,
                  antialias: true,
                  alpha: false,
                  preserveDrawingBuffer: true
            });
            this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.#renderer.outputColorSpace = THREE.SRGBColorSpace;

            this.#scene = new THREE.Scene();
            this.#scene.background = new THREE.Color(this.#options.backgroundColor);

            const w = this.#canvas.clientWidth || 800;
            const h = this.#canvas.clientHeight || 500;

            this.#camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200000);
            this.#camera.position.set(0, 250, 500);

            this.#controls = new this.#OrbitControls(this.#camera, this.#canvas);
            this.#controls.enableDamping = true;
            this.#controls.dampingFactor = 0.08;
            this.#controls.screenSpacePanning = true;
            this.#controls.target.set(0, 60, 0);

            const ambient = new THREE.AmbientLight(0xffffff, 0.75);
            this.#scene.add(ambient);

            const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
            dir1.position.set(300, 600, 450);
            this.#scene.add(dir1);

            const dir2 = new THREE.DirectionalLight(0xffffff, 0.65);
            dir2.position.set(-350, 400, -250);
            this.#scene.add(dir2);

            this.#grid = new THREE.GridHelper(2000, 40, 0x4a4a4a, 0x2a2a2a);
            this.#grid.position.y = 0;
            this.#grid.visible = !!this.#settings.showGrid;
            this.#scene.add(this.#grid);

            this.#svgRoot = new THREE.Group();
            this.#scene.add(this.#svgRoot);

            this.#measureGroup = new THREE.Group();
            this.#scene.add(this.#measureGroup);

            this.#fitRendererToCanvas();

            this.#setFpsVisible(this.#settings.showFPS);

            this.#resizeObserver = new ResizeObserver(() => this.#fitRendererToCanvas());
            this.#resizeObserver.observe(this.#viewerContainer);
            window.addEventListener("resize", () => this.#fitRendererToCanvas(), {passive: true});
      }

      #startAnimation() {
            const renderLoop = () => {
                  this.#updateFpsCounter();
                  this.#controls?.update();
                  this.#renderer?.render(this.#scene, this.#camera);
                  requestAnimationFrame(renderLoop);
            };
            renderLoop();
      }

      #fitRendererToCanvas() {
            if(!this.#renderer || !this.#camera || !this.#canvas) return;
            const w = this.#canvas.clientWidth || this.#viewerContainer.clientWidth || 1;
            const h = this.#canvas.clientHeight || this.#viewerContainer.clientHeight || 1;
            this.#renderer.setSize(w, h, false);
            this.#camera.aspect = w / h;
            this.#camera.updateProjectionMatrix();
      }

      loadSvgText(svgText) {
            this.#svgText = svgText;
            this.#rebuildExtrude();
      }

      #buildSidebar() {
            const makeSectionTitle = (text) => {
                  const title = document.createElement("div");
                  title.textContent = text;
                  title.style = "font-weight:bold;font-size:13px;margin:10px 0 6px 0;color:#333;";
                  return title;
            };

            const makeRow = () => {
                  const row = document.createElement("div");
                  row.style = "display:flex;align-items:center;gap:6px;margin:6px 0;";
                  return row;
            };

            const makeLabel = (text) => {
                  const label = document.createElement("label");
                  label.textContent = text;
                  label.style = "font-size:12px;color:#444;flex:1;";
                  return label;
            };

            const makeRange = (min, max, step, value) => {
                  const input = document.createElement("input");
                  input.type = "range";
                  input.min = String(min);
                  input.max = String(max);
                  input.step = String(step);
                  input.value = String(value);
                  input.style = "flex:1;";
                  return input;
            };

            const makeNumber = (min, max, step, value) => {
                  const input = document.createElement("input");
                  input.type = "number";
                  input.min = String(min);
                  input.max = String(max);
                  input.step = String(step);
                  input.value = String(value);
                  input.style = "width:80px;";
                  return input;
            };

            const makeCheckbox = (checked) => {
                  const input = document.createElement("input");
                  input.type = "checkbox";
                  input.checked = !!checked;
                  return input;
            };

            const makeButton = (label, onClick) => {
                  return createButton(label, "width:100%;margin:4px 0;float:none;display:block;", onClick, null);
            };

            const actionSection = document.createElement("div");
            actionSection.appendChild(makeSectionTitle("Actions"));
            actionSection.appendChild(makeButton("Reset View", () => this.#resetView()));
            actionSection.appendChild(makeButton("Clear", () => this.#clearSvg()));
            this.#sidebar.appendChild(actionSection);

            const settingsSection = document.createElement("div");
            settingsSection.appendChild(makeSectionTitle("Settings"));
            this.#settingsContainer = settingsSection;
            this.#settingsContent = document.createElement("div");

            const scaleRow = makeRow();
            scaleRow.appendChild(makeLabel("Scale"));
            const scaleRange = makeRange(0, 10, 0.01, this.#settings.scale);
            const scaleNumber = makeNumber(0, 10, 0.01, this.#settings.scale);
            scaleRow.appendChild(scaleRange);
            scaleRow.appendChild(scaleNumber);
            this.#settingsContent.appendChild(scaleRow);

            const depthRow = makeRow();
            depthRow.appendChild(makeLabel("Depth"));
            const depthRange = makeRange(0, 500, 0.1, this.#settings.depth);
            const depthNumber = makeNumber(0, 500, 0.1, this.#settings.depth);
            depthRow.appendChild(depthRange);
            depthRow.appendChild(depthNumber);
            this.#settingsContent.appendChild(depthRow);

            const curveRow = makeRow();
            curveRow.appendChild(makeLabel("Curve Segments"));
            const curveRange = makeRange(1, 64, 1, this.#settings.curveSegments);
            const curveNumber = makeNumber(1, 64, 1, this.#settings.curveSegments);
            curveRow.appendChild(curveRange);
            curveRow.appendChild(curveNumber);
            this.#settingsContent.appendChild(curveRow);

            const flipRow = makeRow();
            flipRow.appendChild(makeLabel("Flip Axes"));
            const flipX = makeCheckbox(this.#settings.flipX);
            const flipY = makeCheckbox(this.#settings.flipY);
            const flipZ = makeCheckbox(this.#settings.flipZ);
            const flipWrap = document.createElement("div");
            flipWrap.style = "display:flex;gap:4px;";
            flipWrap.appendChild(flipX);
            flipWrap.appendChild(document.createTextNode("X"));
            flipWrap.appendChild(flipY);
            flipWrap.appendChild(document.createTextNode("Y"));
            flipWrap.appendChild(flipZ);
            flipWrap.appendChild(document.createTextNode("Z"));
            flipRow.appendChild(flipWrap);
            this.#settingsContent.appendChild(flipRow);

            const renderRow = makeRow();
            renderRow.appendChild(makeLabel("Render"));
            const wireframe = makeCheckbox(this.#settings.wireframe);
            const doubleSided = makeCheckbox(this.#settings.doubleSided);
            const renderWrap = document.createElement("div");
            renderWrap.style = "display:flex;gap:4px;align-items:center;";
            renderWrap.appendChild(wireframe);
            renderWrap.appendChild(document.createTextNode("Wireframe"));
            renderWrap.appendChild(doubleSided);
            renderWrap.appendChild(document.createTextNode("Double-sided"));
            renderRow.appendChild(renderWrap);
            this.#settingsContent.appendChild(renderRow);

            const worldRow = makeRow();
            worldRow.appendChild(makeLabel("Grid"));
            const showGrid = makeCheckbox(this.#settings.showGrid);
            worldRow.appendChild(showGrid);
            const bgColor = document.createElement("input");
            bgColor.type = "color";
            bgColor.value = this.#settings.bgColor;
            worldRow.appendChild(bgColor);
            this.#settingsContent.appendChild(worldRow);

            const fpsRow = makeRow();
            fpsRow.appendChild(makeLabel("FPS"));
            const showFPS = makeCheckbox(this.#settings.showFPS);
            fpsRow.appendChild(showFPS);
            this.#settingsContent.appendChild(fpsRow);

            const mmRow = makeRow();
            mmRow.appendChild(makeLabel("mm per unit"));
            const mmPerUnit = makeNumber(0, 100000, 0.001, this.#settings.mmPerUnit);
            mmRow.appendChild(mmPerUnit);
            this.#settingsContent.appendChild(mmRow);

            const measureSection = document.createElement("div");
            measureSection.appendChild(makeSectionTitle("Measurements"));

            const measureToggleRow = makeRow();
            measureToggleRow.appendChild(makeLabel("Enable"));
            const measuresEnabled = makeCheckbox(this.#settings.measuresEnabled);
            measureToggleRow.appendChild(measuresEnabled);
            measureSection.appendChild(measureToggleRow);

            const measureAxesRow = makeRow();
            measureAxesRow.appendChild(makeLabel("Show W/H/D"));
            const measuresW = makeCheckbox(this.#settings.measuresW);
            const measuresH = makeCheckbox(this.#settings.measuresH);
            const measuresD = makeCheckbox(this.#settings.measuresD);
            const measuresWrap = document.createElement("div");
            measuresWrap.style = "display:flex;gap:4px;";
            measuresWrap.appendChild(measuresW);
            measuresWrap.appendChild(document.createTextNode("W"));
            measuresWrap.appendChild(measuresH);
            measuresWrap.appendChild(document.createTextNode("H"));
            measuresWrap.appendChild(measuresD);
            measuresWrap.appendChild(document.createTextNode("D"));
            measureAxesRow.appendChild(measuresWrap);
            measureSection.appendChild(measureAxesRow);

            const decimalsRow = makeRow();
            decimalsRow.appendChild(makeLabel("Decimals"));
            const measureDecimals = makeNumber(0, 4, 1, this.#settings.measureDecimals);
            decimalsRow.appendChild(measureDecimals);
            measureSection.appendChild(decimalsRow);

            const textPxRow = makeRow();
            textPxRow.appendChild(makeLabel("Label px"));
            const measureTextPx = makeNumber(8, 64, 1, this.#settings.measureTextPx);
            textPxRow.appendChild(measureTextPx);
            measureSection.appendChild(textPxRow);

            const labelScaleRow = makeRow();
            labelScaleRow.appendChild(makeLabel("Label scale"));
            const measureLabelScale = makeNumber(1, 6, 1, this.#settings.measureLabelScale);
            labelScaleRow.appendChild(measureLabelScale);
            measureSection.appendChild(labelScaleRow);

            const offsetRow = makeRow();
            offsetRow.appendChild(makeLabel("Offset"));
            const measureOffset = makeNumber(0, 2000, 0.5, this.#settings.measureOffset);
            offsetRow.appendChild(measureOffset);
            measureSection.appendChild(offsetRow);

            const extOverRow = makeRow();
            extOverRow.appendChild(makeLabel("Extension"));
            const measureExtOver = makeNumber(0, 2000, 0.5, this.#settings.measureExtOver);
            extOverRow.appendChild(measureExtOver);
            measureSection.appendChild(extOverRow);

            const arrowRow = makeRow();
            arrowRow.appendChild(makeLabel("Arrow size"));
            const measureArrowSize = makeNumber(0, 2000, 0.5, this.#settings.measureArrowSize);
            arrowRow.appendChild(measureArrowSize);
            measureSection.appendChild(arrowRow);

            const labelColorRow = makeRow();
            labelColorRow.appendChild(makeLabel("Label colors"));
            const labelBgColor = document.createElement("input");
            labelBgColor.type = "color";
            labelBgColor.value = this.#settings.measureLabelBgColor;
            const labelTextColor = document.createElement("input");
            labelTextColor.type = "color";
            labelTextColor.value = this.#settings.measureLabelTextColor;
            const labelBorderColor = document.createElement("input");
            labelBorderColor.type = "color";
            labelBorderColor.value = this.#settings.measureLabelBorderColor;
            labelColorRow.appendChild(labelBgColor);
            labelColorRow.appendChild(labelTextColor);
            labelColorRow.appendChild(labelBorderColor);
            measureSection.appendChild(labelColorRow);

            this.#settingsContent.appendChild(measureSection);

            settingsSection.appendChild(this.#settingsContent);
            this.#sidebar.appendChild(settingsSection);

            const exportSection = document.createElement("div");
            exportSection.appendChild(makeSectionTitle("Export"));
            exportSection.appendChild(makeButton("Current view → PNG", async () => {
                  await this.#exportViewToPNG();
            }));
            exportSection.appendChild(makeButton("Model → GLB (binary)", async () => {
                  await this.#exportToGLB({what: "model"});
            }));
            exportSection.appendChild(makeButton("Model → glTF (JSON)", async () => {
                  await this.#exportToGLTF({what: "model"});
            }));
            exportSection.appendChild(makeButton("Scene → GLB (binary)", async () => {
                  await this.#exportToGLB({what: "scene"});
            }));
            exportSection.appendChild(makeButton("Scene → glTF (JSON)", async () => {
                  await this.#exportToGLTF({what: "scene"});
            }));
            this.#sidebar.appendChild(exportSection);

            const syncPair = (range, number, onChange) => {
                  const apply = (value) => {
                        range.value = value;
                        number.value = value;
                        onChange(value);
                  };
                  range.addEventListener("input", () => apply(range.value));
                  number.addEventListener("input", () => apply(number.value));
            };

            syncPair(scaleRange, scaleNumber, (value) => {
                  this.#settings.scale = Math.max(0, Math.min(10, Number(value)));
                  this.#applyUserTransforms();
            });
            syncPair(depthRange, depthNumber, (value) => {
                  this.#settings.depth = Math.max(0, Math.min(500, Number(value)));
                  this.#rebuildExtrude();
            });
            syncPair(curveRange, curveNumber, (value) => {
                  this.#settings.curveSegments = Math.max(1, Math.min(64, Math.round(Number(value))));
                  this.#rebuildExtrude();
            });

            flipX.addEventListener("change", () => {
                  this.#settings.flipX = flipX.checked;
                  this.#applyUserTransforms();
            });
            flipY.addEventListener("change", () => {
                  this.#settings.flipY = flipY.checked;
                  this.#applyUserTransforms();
            });
            flipZ.addEventListener("change", () => {
                  this.#settings.flipZ = flipZ.checked;
                  this.#applyUserTransforms();
            });

            wireframe.addEventListener("change", () => {
                  this.#settings.wireframe = wireframe.checked;
                  this.#applyMaterialFlags();
            });
            doubleSided.addEventListener("change", () => {
                  this.#settings.doubleSided = doubleSided.checked;
                  this.#applyMaterialFlags();
            });

            showGrid.addEventListener("change", () => {
                  this.#settings.showGrid = showGrid.checked;
                  if(this.#grid) this.#grid.visible = !!this.#settings.showGrid;
            });

            bgColor.addEventListener("input", () => {
                  this.#settings.bgColor = bgColor.value;
                  if(this.#scene?.background) this.#scene.background.set(this.#settings.bgColor);
            });

            showFPS.addEventListener("change", () => {
                  this.#settings.showFPS = showFPS.checked;
                  this.#setFpsVisible(this.#settings.showFPS);
            });

            mmPerUnit.addEventListener("input", () => {
                  this.#settings.mmPerUnit = Math.max(0, Number(mmPerUnit.value));
                  this.#updateMeasures();
            });

            measuresEnabled.addEventListener("change", () => {
                  this.#settings.measuresEnabled = measuresEnabled.checked;
                  this.#updateMeasures();
            });
            measuresW.addEventListener("change", () => {
                  this.#settings.measuresW = measuresW.checked;
                  this.#updateMeasures();
            });
            measuresH.addEventListener("change", () => {
                  this.#settings.measuresH = measuresH.checked;
                  this.#updateMeasures();
            });
            measuresD.addEventListener("change", () => {
                  this.#settings.measuresD = measuresD.checked;
                  this.#updateMeasures();
            });
            measureDecimals.addEventListener("input", () => {
                  this.#settings.measureDecimals = svg3dViewerClamp(Number(measureDecimals.value), 0, 4);
                  this.#updateMeasures();
            });
            measureTextPx.addEventListener("input", () => {
                  this.#settings.measureTextPx = svg3dViewerClamp(Number(measureTextPx.value), 8, 64);
                  this.#updateMeasures();
            });
            measureLabelScale.addEventListener("input", () => {
                  this.#settings.measureLabelScale = svg3dViewerClamp(Number(measureLabelScale.value), 1, 6);
                  this.#updateMeasures();
            });
            measureOffset.addEventListener("input", () => {
                  this.#settings.measureOffset = svg3dViewerClamp(Number(measureOffset.value), 0, 2000);
                  this.#updateMeasures();
            });
            measureExtOver.addEventListener("input", () => {
                  this.#settings.measureExtOver = svg3dViewerClamp(Number(measureExtOver.value), 0, 2000);
                  this.#updateMeasures();
            });
            measureArrowSize.addEventListener("input", () => {
                  this.#settings.measureArrowSize = svg3dViewerClamp(Number(measureArrowSize.value), 0, 2000);
                  this.#updateMeasures();
            });
            labelBgColor.addEventListener("input", () => {
                  this.#settings.measureLabelBgColor = labelBgColor.value;
                  this.#updateMeasures();
            });
            labelTextColor.addEventListener("input", () => {
                  this.#settings.measureLabelTextColor = labelTextColor.value;
                  this.#updateMeasures();
            });
            labelBorderColor.addEventListener("input", () => {
                  this.#settings.measureLabelBorderColor = labelBorderColor.value;
                  this.#updateMeasures();
            });
      }

      #clearSvg() {
            if(this.#svgUserGroup) {
                  this.#svgRoot.remove(this.#svgUserGroup);
            }

            if(this.#mesh) {
                  this.#mesh.geometry?.dispose?.();
                  this.#mesh.material?.dispose?.();
            }

            this.#mesh = null;
            this.#svgUserGroup = null;
            this.#svgFixGroup = null;
            this.#clearMeasures();
      }

      #setFpsVisible(isVisible) {
            if(!this.#fpsElement) return;
            this.#fpsElement.style.display = isVisible ? "block" : "none";
            if(isVisible) {
                  this.#fpsLastTime = performance.now();
                  this.#fpsLastReport = this.#fpsLastTime;
                  this.#fpsFrames = 0;
            }
      }

      #updateFpsCounter() {
            if(!this.#settings.showFPS || !this.#fpsElement) return;
            const now = performance.now();
            if(this.#fpsLastTime === 0) {
                  this.#fpsLastTime = now;
                  this.#fpsLastReport = now;
            }
            this.#fpsFrames += 1;
            const delta = now - this.#fpsLastReport;
            if(delta >= 500) {
                  const fps = (this.#fpsFrames / delta) * 1000;
                  this.#fpsElement.textContent = `FPS: ${fps.toFixed(1)}`;
                  this.#fpsFrames = 0;
                  this.#fpsLastReport = now;
            }
      }

      #resetView() {
            if(!this.#camera || !this.#controls) return;
            this.#camera.position.set(0, 250, 500);
            this.#controls.target.set(0, 60, 0);
            this.#controls.update();
      }

      #applyUserTransforms() {
            if(!this.#svgUserGroup) return;

            const s = this.#settings.scale;
            const fx = this.#settings.flipX ? -1 : 1;
            const fy = this.#settings.flipY ? -1 : 1;
            const fz = this.#settings.flipZ ? -1 : 1;

            this.#svgUserGroup.scale.set(s * fx, s * fy, s * fz);
            this.#updateMeasures();
      }

      #applyMaterialFlags() {
            if(!this.#mesh?.material) return;
            this.#mesh.material.wireframe = !!this.#settings.wireframe;
            this.#mesh.material.side = this.#settings.doubleSided ? this.#THREE.DoubleSide : this.#THREE.FrontSide;
            this.#mesh.material.needsUpdate = true;
      }

      #fitCameraToObject(box, {padding = 1.25} = {}) {
            const THREE = this.#THREE;
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            const radius = maxDim * 0.5;
            if(!Number.isFinite(radius) || radius <= 0) return;

            const fov = (this.#camera.fov * Math.PI) / 180;
            const aspect = this.#camera.aspect || 1;

            const fitHeightDist = radius / Math.tan(fov / 2);
            const fitWidthDist = radius / (Math.tan(fov / 2) * aspect);
            let dist = Math.max(fitHeightDist, fitWidthDist) * padding;
            dist = Math.min(Math.max(dist, 10), 15000);

            const dir = new THREE.Vector3();
            dir.copy(this.#camera.position).sub(this.#controls.target).normalize();
            if(!Number.isFinite(dir.x)) dir.set(0.4, 0.35, 0.75).normalize();

            this.#controls.target.copy(center);
            this.#camera.position.copy(center).add(dir.multiplyScalar(dist));
            this.#controls.update();
      }

      #clearMeasures() {
            if(!this.#measureGroup) return;
            while(this.#measureGroup.children.length) {
                  const child = this.#measureGroup.children.pop();
                  this.#measureGroup.remove(child);
                  if(child.material?.map) {
                        child.material.map.dispose?.();
                  }
                  child.geometry?.dispose?.();
                  child.material?.dispose?.();
            }
      }

      #updateMeasures() {
            this.#clearMeasures();
            if(!this.#settings.measuresEnabled) return;
            if(!this.#svgUserGroup || !this.#measureGroup) return;

            const THREE = this.#THREE;
            const box = new THREE.Box3().setFromObject(this.#svgUserGroup);

            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            if(!Number.isFinite(size.x) || (size.x === 0 && size.y === 0 && size.z === 0)) return;

            const mmPerUnit = this.#settings.mmPerUnit;
            const dec = this.#settings.measureDecimals;

            const wMM = size.x * mmPerUnit;
            const hMM = size.y * mmPerUnit;
            const dMM = size.z * mmPerUnit;

            const base = Math.max(size.x, size.y, size.z);
            const offset = this.#settings.measureOffset;
            const extOver = this.#settings.measureExtOver;
            const arrowSize = this.#settings.measureArrowSize;

            const worldTextSize = svg3dViewerClamp(base * 0.12, 30, 260);

            const offW = new THREE.Vector3(0, 1, 0).normalize();
            const offH = new THREE.Vector3(1, 0, 0).normalize();
            const offD = new THREE.Vector3(-1, 0, 0).normalize();

            const yW = box.max.y;
            const zW = center.z;
            const wA = new THREE.Vector3(box.min.x, yW, zW);
            const wB = new THREE.Vector3(box.max.x, yW, zW);

            const xH = box.max.x;
            const zH = center.z;
            const hA = new THREE.Vector3(xH, box.min.y, zH);
            const hB = new THREE.Vector3(xH, box.max.y, zH);

            const xD = box.min.x;
            const yD = center.y;
            const dA = new THREE.Vector3(xD, yD, box.min.z);
            const dB = new THREE.Vector3(xD, yD, box.max.z);

            const baseOpts = {
                  THREE,
                  group: this.#measureGroup,
                  offset,
                  extOver,
                  arrowSize,
                  labelPx: this.#settings.measureTextPx,
                  labelScale: this.#settings.measureLabelScale,
                  worldTextSize,
                  labelBgColor: this.#settings.measureLabelBgColor,
                  labelTextColor: this.#settings.measureLabelTextColor,
                  labelBorderColor: this.#settings.measureLabelBorderColor,
                  color: 0xffffff
            };

            if(this.#settings.measuresW) {
                  svg3dViewerAddDraftDimension({
                        ...baseOpts,
                        a: wA,
                        b: wB,
                        offsetDir: offW,
                        labelText: `W: ${wMM.toFixed(dec)} mm`
                  });
            }

            if(this.#settings.measuresH) {
                  svg3dViewerAddDraftDimension({
                        ...baseOpts,
                        a: hA,
                        b: hB,
                        offsetDir: offH,
                        labelText: `H: ${hMM.toFixed(dec)} mm`
                  });
            }

            if(this.#settings.measuresD) {
                  svg3dViewerAddDraftDimension({
                        ...baseOpts,
                        a: dA,
                        b: dB,
                        offsetDir: offD,
                        labelText: `D: ${dMM.toFixed(dec)} mm`
                  });
            }
      }

      #rebuildExtrude() {
            if(!this.#svgText) return;

            const THREE = this.#THREE;
            const SVGLoader = this.#SVGLoader;

            this.#clearSvg();

            let data;
            try {
                  const loader = new SVGLoader();
                  data = loader.parse(this.#svgText);
            } catch(err) {
                  console.error("SVG parse failed:", err);
                  alert("SVG parse failed. Try a simpler SVG (filled paths/shapes) or re-save it.");
                  return;
            }

            const paths = data.paths || [];
            if(!paths.length) {
                  alert("No paths found in SVG.");
                  return;
            }

            const shapes = [];
            for(const path of paths) {
                  const to = SVGLoader.createShapes(path);
                  for(const shape of to) shapes.push(shape);
            }
            if(!shapes.length) {
                  alert("No shapes created from SVG paths. Stroke-only SVGs often won’t extrude cleanly.");
                  return;
            }

            const extrudeSettings = {
                  depth: this.#settings.depth,
                  bevelEnabled: false,
                  bevelThickness: 0,
                  bevelSize: 0,
                  bevelSegments: 0,
                  curveSegments: this.#settings.curveSegments
            };

            const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                  color: 0xeaeaea,
                  metalness: 0.15,
                  roughness: 0.45,
                  wireframe: !!this.#settings.wireframe,
                  side: this.#settings.doubleSided ? THREE.DoubleSide : THREE.FrontSide
            });

            this.#mesh = new THREE.Mesh(geometry, material);

            const bb = geometry.boundingBox;
            const center = new THREE.Vector3();
            bb.getCenter(center);
            this.#mesh.position.set(-center.x, -center.y, -center.z);

            this.#svgUserGroup = new THREE.Group();
            this.#svgFixGroup = new THREE.Group();

            this.#svgFixGroup.scale.set(1, -1, 1);
            this.#svgFixGroup.add(this.#mesh);

            this.#svgUserGroup.add(this.#svgFixGroup);
            this.#svgUserGroup.position.y = 1;

            this.#applyUserTransforms();
            this.#svgRoot.add(this.#svgUserGroup);

            const newBox = new THREE.Box3().setFromObject(this.#svgUserGroup);
            this.#fitCameraToObject(newBox);
            this.#updateMeasures();
      }

      async #exportViewToPNG() {
            if(!this.#renderer) return;
            const dataUrl = this.#renderer.domElement.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "svg-viewer.png";
            document.body.appendChild(link);
            link.click();
            link.remove();
      }

      async #exportToGLB({what = "model"} = {}) {
            const THREE = this.#THREE;
            const exporter = new this.#GLTFExporter();
            const target = what === "scene" ? this.#scene : this.#svgUserGroup;
            if(!target) return;

            return new Promise((resolve) => {
                  exporter.parse(target, (result) => {
                        if(!(result instanceof ArrayBuffer)) return resolve();
                        const blob = new Blob([result], {type: "model/gltf-binary"});
                        this.#downloadBlob(blob, `${what}-export.glb`);
                        resolve();
                  }, {binary: true});
            });
      }

      async #exportToGLTF({what = "model"} = {}) {
            const exporter = new this.#GLTFExporter();
            const target = what === "scene" ? this.#scene : this.#svgUserGroup;
            if(!target) return;

            return new Promise((resolve) => {
                  exporter.parse(target, (result) => {
                        if(!result) return resolve();
                        const json = JSON.stringify(result, null, 2);
                        const blob = new Blob([json], {type: "application/json"});
                        this.#downloadBlob(blob, `${what}-export.gltf`);
                        resolve();
                  });
            });
      }

      #downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
      }
}
