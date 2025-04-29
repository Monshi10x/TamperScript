// ==UserScript==
// @name         Three.js + OrbitControls (Editable Live with Importmap Injection)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Three.js + PointerLockControls with proper user gesture and working importmap
// @author       You
// @match        https://sar10686.corebridge.net/sales/dashboard
// @grant        none
// ==/UserScript==

(function() {
      'use strict';

      class ThreeJSPointerLockScene {
            constructor(parentToAppendTo) {
                  this.parent = parentToAppendTo || document.body;
                  this.init();
            }

            async init() {
                  await this.injectImportmap();
                  const THREE = await import('three');
                  const {PointerLockControls} = await import('three/examples/controls/PointerLockControls.js');

                  this.THREE = THREE;
                  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
                  this.camera.position.y = 10;

                  this.scene = new THREE.Scene();
                  this.scene.background = new THREE.Color(0xffffff);
                  this.scene.fog = new THREE.Fog(0xffffff, 0, 750);

                  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
                  light.position.set(0.5, 1, 0.75);
                  this.scene.add(light);

                  this.controls = new PointerLockControls(this.camera, document.body);
                  this.objects = [];
                  this.velocity = new THREE.Vector3();
                  this.direction = new THREE.Vector3();
                  this.prevTime = performance.now();
                  this.moveForward = false;
                  this.moveBackward = false;
                  this.moveLeft = false;
                  this.moveRight = false;
                  this.canJump = false;
                  this.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

                  this.setupOverlay();
                  this.setupListeners();
                  this.setupScene();
                  this.setupRenderer();
                  this.addCrosshair();
                  window.addEventListener('resize', () => this.onWindowResize());
            }

            async injectImportmap() {
                  const importMap = document.createElement('script');
                  importMap.type = 'importmap';
                  importMap.textContent = JSON.stringify({
                        imports: {
                              "three": "https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js",
                              "three/examples/": "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/jsm/"
                        }
                  });
                  document.head.appendChild(importMap);
                  await new Promise(resolve => setTimeout(resolve, 50));
            }

            setupOverlay() {
                  this.blocker = document.createElement('div');
                  Object.assign(this.blocker.style, {
                        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer'
                  });
                  this.blocker.innerHTML = 'Click to start';
                  this.blocker.addEventListener('click', () => this.controls.lock());
                  document.body.appendChild(this.blocker);

                  this.controls.addEventListener('lock', () => {this.blocker.style.display = 'none';});
                  this.controls.addEventListener('unlock', () => {this.blocker.style.display = 'flex';});
            }

            setupListeners() {
                  document.addEventListener('keydown', e => this.onKeyDown(e));
                  document.addEventListener('keyup', e => this.onKeyUp(e));
            }

            onKeyDown(event) {
                  switch(event.code) {
                        case 'KeyW': this.moveForward = true; break;
                        case 'KeyA': this.moveLeft = true; break;
                        case 'KeyS': this.moveBackward = true; break;
                        case 'KeyD': this.moveRight = true; break;
                        case 'Space':
                              if(this.canJump === true) this.velocity.y += 350;
                              this.canJump = false;
                              break;
                  }
            }

            onKeyUp(event) {
                  switch(event.code) {
                        case 'KeyW': this.moveForward = false; break;
                        case 'KeyA': this.moveLeft = false; break;
                        case 'KeyS': this.moveBackward = false; break;
                        case 'KeyD': this.moveRight = false; break;
                  }
            }

            setupScene() {
                  const {THREE} = this;

                  // Ground
                  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
                  floorGeometry.rotateX(-Math.PI / 2);

                  let position = floorGeometry.attributes.position;
                  const vertex = new THREE.Vector3();
                  const color = new THREE.Color();

                  for(let i = 0, l = position.count; i < l; i++) {
                        vertex.fromBufferAttribute(position, i);
                        vertex.x += Math.random() * 20 - 10;
                        vertex.y += Math.random() * 2;
                        vertex.z += Math.random() * 20 - 10;
                        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
                  }

                  floorGeometry = floorGeometry.toNonIndexed();
                  position = floorGeometry.attributes.position;
                  const colors = [];
                  for(let i = 0, l = position.count; i < l; i++) {
                        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                        colors.push(color.r, color.g, color.b);
                  }

                  floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                  const material = new THREE.MeshBasicMaterial({vertexColors: true});
                  const mesh = new THREE.Mesh(floorGeometry, material);
                  this.scene.add(mesh);

                  // Boxes
                  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
                  position = boxGeometry.attributes.position;
                  const boxColors = [];
                  for(let i = 0, l = position.count; i < l; i++) {
                        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                        boxColors.push(color.r, color.g, color.b);
                  }
                  boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(boxColors, 3));

                  for(let i = 0; i < 500; i++) {
                        const boxMaterial = new THREE.MeshPhongMaterial({specular: 0xffffff, flatShading: true, vertexColors: true});
                        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                        const box = new THREE.Mesh(boxGeometry, boxMaterial);
                        box.position.set(
                              Math.floor(Math.random() * 20 - 10) * 20,
                              Math.floor(Math.random() * 20) * 20 + 10,
                              Math.floor(Math.random() * 20 - 10) * 20
                        );
                        this.scene.add(box);
                        this.objects.push(box);
                  }
            }

            setupRenderer() {
                  this.renderer = new this.THREE.WebGLRenderer({antialias: true});
                  this.renderer.setPixelRatio(window.devicePixelRatio);
                  this.renderer.setSize(window.innerWidth, window.innerHeight);
                  this.renderer.setAnimationLoop(() => this.animate());
                  this.parent.appendChild(this.renderer.domElement);
            }

            addCrosshair() {
                  const crosshair = document.createElement('div');
                  Object.assign(crosshair.style, {
                        position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px',
                        marginLeft: '-5px', marginTop: '-5px',
                        backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '50%', zIndex: 10
                  });
                  document.body.appendChild(crosshair);
            }

            onWindowResize() {
                  this.camera.aspect = window.innerWidth / window.innerHeight;
                  this.camera.updateProjectionMatrix();
                  this.renderer.setSize(window.innerWidth, window.innerHeight);
            }

            animate() {
                  const time = performance.now();
                  if(this.controls.isLocked) {
                        this.raycaster.ray.origin.copy(this.controls.object.position);
                        this.raycaster.ray.origin.y -= 10;
                        const intersections = this.raycaster.intersectObjects(this.objects, false);
                        const onObject = intersections.length > 0;
                        const delta = (time - this.prevTime) / 1000;

                        this.velocity.x -= this.velocity.x * 10.0 * delta;
                        this.velocity.z -= this.velocity.z * 10.0 * delta;
                        this.velocity.y -= 9.8 * 100.0 * delta;

                        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
                        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
                        this.direction.normalize();

                        if(this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
                        if(this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

                        if(onObject === true) {
                              this.velocity.y = Math.max(0, this.velocity.y);
                              this.canJump = true;
                        }

                        this.controls.moveRight(-this.velocity.x * delta);
                        this.controls.moveForward(-this.velocity.z * delta);
                        this.controls.object.position.y += (this.velocity.y * delta);

                        if(this.controls.object.position.y < 10) {
                              this.velocity.y = 0;
                              this.controls.object.position.y = 10;
                              this.canJump = true;
                        }
                  }

                  this.prevTime = time;
                  this.renderer.render(this.scene, this.camera);
            }
      }
      const scene = new ThreeJSPointerLockScene(document.body);
})();
