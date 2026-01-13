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
                        "https://unpkg.com/three@0.160.0/examples/jsm/loaders/SVGLoader.js"
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
      #svgRoot;
      #svgUserGroup;
      #svgFixGroup;
      #mesh;
      #resizeObserver;
      #initialized = false;
      #svgText;

      #THREE;
      #OrbitControls;
      #SVGLoader;

      constructor(parentToAppendTo, options = {}) {
            this.#options = {
                  title: "3D SVG Viewer",
                  buttonLabel: "3D Viewer",
                  buttonStyle: "margin:5px;min-height:40px;width:calc(50% - 10px);box-sizing:border-box;",
                  modalWidth: 900,
                  modalHeight: 650,
                  depth: 10,
                  scale: 1,
                  flipX: false,
                  flipY: false,
                  flipZ: false,
                  backgroundColor: "#0a0a0c",
                  showGrid: true,
                  curveSegments: 12,
                  svgTextProvider: null,
                  startHidden: true
            };
            Object.assign(this.#options, options);

            this.#button = createButton(this.#options.buttonLabel, this.#options.buttonStyle, () => {
                  this.open();
            }, parentToAppendTo);

            if(this.#options.startHidden) this.setButtonVisible(false);
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

            this.#viewerContainer = document.createElement("div");
            this.#viewerContainer.style = `width:100%;height:100%;background-color:${this.#options.backgroundColor};position:relative;`;
            body.appendChild(this.#viewerContainer);

            this.#canvas = document.createElement("canvas");
            this.#canvas.style = "width:100%;height:100%;display:block;";
            this.#viewerContainer.appendChild(this.#canvas);

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

            this.#THREE = THREE;
            this.#OrbitControls = OrbitControls;
            this.#SVGLoader = SVGLoader;

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

            if(this.#options.showGrid) {
                  const grid = new THREE.GridHelper(2000, 40, 0x4a4a4a, 0x2a2a2a);
                  grid.position.y = 0;
                  this.#scene.add(grid);
            }

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

      #applyUserTransforms() {
            if(!this.#svgUserGroup) return;

            const s = this.#options.scale;
            const fx = this.#options.flipX ? -1 : 1;
            const fy = this.#options.flipY ? -1 : 1;
            const fz = this.#options.flipZ ? -1 : 1;

            this.#svgUserGroup.scale.set(s * fx, s * fy, s * fz);
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
                  depth: this.#options.depth,
                  bevelEnabled: false,
                  bevelThickness: 0,
                  bevelSize: 0,
                  bevelSegments: 0,
                  curveSegments: this.#options.curveSegments
            };

            const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();

            const material = new THREE.MeshStandardMaterial({
                  color: 0xeaeaea,
                  metalness: 0.15,
                  roughness: 0.45,
                  side: THREE.DoubleSide
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
}
