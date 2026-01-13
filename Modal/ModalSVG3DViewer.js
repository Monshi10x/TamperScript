let svg3dViewerImportMapInjected = false;

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
      #resizeObserver;
      #initialized = false;
      #svgText;
      #settingsContainer;
      #settingsContent;
      #sidebar;

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
                  bgColor: this.#options.backgroundColor
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

            this.#fitRendererToCanvas();

            this.#resizeObserver = new ResizeObserver(() => this.#fitRendererToCanvas());
            this.#resizeObserver.observe(this.#viewerContainer);
            window.addEventListener("resize", () => this.#fitRendererToCanvas(), {passive: true});
      }

      #startAnimation() {
            const renderLoop = () => {
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
