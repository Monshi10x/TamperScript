// ==UserScript==
// @name         Three.js + OrbitControls (Editable Live with Importmap Injection)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Three.js + OrbitControls, fully editable live, with working importmap injection to fix module specifiers
// @author       You
// @match        https://sar10686.corebridge.net/sales/dashboard
// @grant        none
// ==/UserScript==
var camera;
(function() {
      'use strict';

      function injectImportmap() {
            const importMap = document.createElement('script');
            importMap.type = 'importmap';
            importMap.textContent = JSON.stringify({
                  imports: {
                        "three": "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",
                        "three/examples/": "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"
                  }
            });
            document.head.appendChild(importMap);
      }


      function runScene() {
            (async () => {
                  const THREE = await import('three');
                  const {OrbitControls} = await import('three/examples/controls/OrbitControls.js');

                  const container = document.createElement('div');
                  container.style.position = 'fixed';
                  container.style.top = '0';
                  container.style.left = '0';
                  container.style.width = '100vw';
                  container.style.height = '100vh';
                  container.style.zIndex = '99999';
                  container.style.pointerEvents = 'auto';
                  document.body.appendChild(container);

                  const scene = new THREE.Scene();
                  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
                  renderer.setSize(window.innerWidth, window.innerHeight);
                  container.appendChild(renderer.domElement);

                  const controls = new OrbitControls(camera, renderer.domElement);
                  controls.enableDamping = true;
                  controls.dampingFactor = 0.1;
                  controls.screenSpacePanning = false;

                  const geometry = new THREE.BoxGeometry();
                  const material = new THREE.MeshNormalMaterial();
                  const cube = new THREE.Mesh(geometry, material);
                  scene.add(cube);

                  camera.position.z = 5;
                  window.camera = camera;

                  window.addEventListener('resize', () => {
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight);
                  });

                  function animate() {
                        requestAnimationFrame(animate);
                        cube.rotation.x += 0.01;
                        cube.rotation.y += 0.01;
                        controls.update();
                        renderer.render(scene, camera);
                  }
                  animate();
            })();
      }

      window.addEventListener('load', () => {
            injectImportmap(); // <-- Importmap must be injected FIRST
            window.runScene = runScene; // <-- Expose globally

            console.log('%c[Three.js Userscript] Type runScene() in the console to launch or re-launch.', 'color: lime; font-weight: bold;');
      });
})();
