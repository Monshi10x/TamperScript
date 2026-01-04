// ==UserScript==
// @name         Corebridge Dashboard - Three.js SVG Import + OrbitControls + Extrude (Fit + Collapsible HUD + Export)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Three.js world overlay (or embed) on Corebridge dashboard. Import SVG, scale 0-10 (0.01), flip XYZ, extrude, grid toggle, background color, drafting dimensions (mm) with hi-res billboards + color pickers, auto fit-to-content, collapsible settings HUD, export image + export model (glTF/GLB). Adds axis gimbal toggle + axis labels toggle + optional FPS counter.
// @author       You
// @match        https://sar10686.corebridge.net/sales/dashboard*
// @grant        none
// ==/UserScript==

(() => {
      "use strict";

      // -----------------------------
      // Helpers
      // -----------------------------
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const safeNumber = (v, fallback) => (Number.isFinite(+v) ? +v : fallback);

      function downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
      }

      function downloadText(text, filename, mime = "application/json") {
            downloadBlob(new Blob([text], {type: mime}), filename);
      }

      // -----------------------------
      // Inject importmap (ESM)
      // -----------------------------
      async function injectImportMap() {
            if(document.querySelector('script[type="importmap"][data-threejs-tm="1"]')) return;

            const s = document.createElement("script");
            s.type = "importmap";
            s.setAttribute("data-threejs-tm", "1");
            s.textContent = JSON.stringify({
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
            document.head.appendChild(s);
      }

      // -----------------------------
      // UI
      // -----------------------------
      function createOverlayUI() {
            const root = document.createElement("div");
            root.id = "tm-threejs-overlay-root";
            root.innerHTML = `
      <div class="tm3js-wrap">
        <div class="tm3js-topbar">
          <div class="tm3js-title">3D SVG Import</div>
          <div class="tm3js-actions">
            <label class="tm3js-btn tm3js-btn-file" title="Choose SVG">
              <input class="tm3js-file" type="file" accept=".svg,image/svg+xml" />
              Open SVG
            </label>

            <button class="tm3js-btn" data-act="loadDemo" title="Loads a small demo SVG">Demo</button>
            <button class="tm3js-btn" data-act="clear" title="Remove imported model">Clear</button>
            <button class="tm3js-btn" data-act="resetView" title="Reset camera">Reset View</button>

            <div class="tm3js-menuWrap" data-menu="export">
              <button class="tm3js-btn" data-act="toggleExportMenu" title="Export options">Export ▾</button>
              <div class="tm3js-menu" data-open="0">
                <div class="tm3js-menuTitle">Export</div>
                <button class="tm3js-menuItem" data-act="exportImagePNG">Current view → PNG</button>
                <button class="tm3js-menuItem" data-act="exportModelGLB">Model → GLB (binary)</button>
                <button class="tm3js-menuItem" data-act="exportModelGLTF">Model → glTF (JSON)</button>
                <div class="tm3js-menuSep"></div>
                <button class="tm3js-menuItem" data-act="exportSceneGLB">Scene → GLB (binary)</button>
                <button class="tm3js-menuItem" data-act="exportSceneGLTF">Scene → glTF (JSON)</button>
              </div>
            </div>

            <button class="tm3js-btn tm3js-btn-primary" data-act="toggleSettings" title="Show/hide settings">Settings</button>
            <button class="tm3js-btn tm3js-btn-danger" data-act="close" title="Hide overlay">Close</button>
          </div>
        </div>

        <div class="tm3js-canvasHost">
          <canvas class="tm3js-canvas"></canvas>
          <div class="tm3js-fps" data-show="0">FPS: --</div>

          <div class="tm3js-drawer" data-open="0" aria-hidden="true">
            <div class="tm3js-drawerHeader">
              <div class="tm3js-drawerTitle">Settings</div>
              <button class="tm3js-btn tm3js-btn-mini" data-act="toggleSettings">✕</button>
            </div>

            <div class="tm3js-drawerBody">
              <details open class="tm3js-section">
                <summary>Model</summary>

                <div class="tm3js-field">
                  <label>Scale (0–10x)</label>
                  <input type="range" min="0" max="10" step="0.01" value="1" data-k="scale">
                  <div class="tm3js-inline">
                    <input type="number" min="0" max="10" step="0.01" value="1" data-k="scaleNum">
                    <button class="tm3js-btn tm3js-btn-mini" data-act="applyScale">Apply</button>
                  </div>
                </div>

                <div class="tm3js-field">
                  <label>SVG Units → mm</label>
                  <div class="tm3js-inline">
                    <span class="tm3js-pill">mm per SVG unit</span>
                    <input type="number" min="0" max="100000" step="0.001" value="1" data-k="mmPerUnit">
                  </div>
                </div>

                <div class="tm3js-field">
                  <label>Extrude Depth (SVG units)</label>
                  <input type="range" min="0" max="500" step="0.1" value="10" data-k="depth">
                  <input type="number" min="0" max="500" step="0.1" value="10" data-k="depthNum">
                </div>

                <div class="tm3js-field">
                  <label>Curve Segments</label>
                  <input type="range" min="1" max="64" step="1" value="12" data-k="curveSegments">
                  <input type="number" min="1" max="64" step="1" value="12" data-k="curveSegmentsNum">
                </div>

                <div class="tm3js-field">
                  <label>Flip Axes (world)</label>
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="flipX"><span>Flip X</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="flipY"><span>Flip Y</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="flipZ"><span>Flip Z</span></label>
                  </div>
                </div>

                <div class="tm3js-field">
                  <label>Bevel</label>
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="bevelEnabled"><span>Enable</span></label>
                    <span class="tm3js-pill">Size</span>
                    <input type="number" min="0" max="50" step="0.1" value="0.5" data-k="bevelSize">
                    <span class="tm3js-pill">Thickness</span>
                    <input type="number" min="0" max="50" step="0.1" value="0.5" data-k="bevelThickness">
                  </div>
                </div>

                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="wireframe"><span>Wireframe</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="doubleSided" checked><span>Double-sided</span></label>
                  </div>
                </div>

                <div class="tm3js-field">
                  <div class="tm3js-inline" style="justify-content: space-between;">
                    <button class="tm3js-btn tm3js-btn-primary" data-act="build">Rebuild Extrude</button>
                    <label class="tm3js-check" title="If a new import is much larger than your current view, auto-fit camera">
                      <input type="checkbox" data-k="autoFitOnLarge" checked>
                      <span>Auto-fit large imports</span>
                    </label>
                  </div>
                </div>
              </details>

              <details class="tm3js-section">
                <summary>World</summary>
                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="showGrid" checked><span>Show grid</span></label>
                    <span class="tm3js-pill">Background</span>
                    <input type="color" value="#0a0a0c" data-k="bgColor" />
                  </div>
                </div>

                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="showAxes" checked><span>Show XYZ gimbal</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="showAxisLabels" checked><span>Show axis labels</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="showFPS"><span>Show FPS</span></label>
                  </div>
                </div>
              </details>

              <details class="tm3js-section">
                <summary>Draft Dimensions (mm)</summary>

                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <label class="tm3js-check"><input type="checkbox" data-k="measuresEnabled"><span>Enable</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="measuresW" checked><span>W</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="measuresH" checked><span>H</span></label>
                    <label class="tm3js-check"><input type="checkbox" data-k="measuresD" checked><span>D</span></label>
                  </div>
                </div>

                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <span class="tm3js-pill">Decimals</span>
                    <input type="number" min="0" max="4" step="1" value="2" data-k="measureDecimals">
                    <span class="tm3js-pill">Text px</span>
                    <input type="number" min="8" max="64" step="1" value="18" data-k="measureTextPx">
                    <span class="tm3js-pill">Hi-res</span>
                    <input type="number" min="1" max="6" step="1" value="3" data-k="measureLabelScale">
                  </div>
                </div>

                <div class="tm3js-field">
                  <div class="tm3js-inline">
                    <span class="tm3js-pill">Dim offset</span>
                    <input type="number" min="0" max="2000" step="0.5" value="25" data-k="measureOffset">
                    <span class="tm3js-pill">Ext overshoot</span>
                    <input type="number" min="0" max="2000" step="0.5" value="8" data-k="measureExtOver">
                    <span class="tm3js-pill">Arrow size</span>
                    <input type="number" min="0" max="2000" step="0.5" value="8" data-k="measureArrowSize">
                  </div>
                </div>

                <div class="tm3js-field">
                  <label>Label Colours</label>
                  <div class="tm3js-inline">
                    <span class="tm3js-pill">Container</span>
                    <input type="color" value="#0a2a7a" data-k="measureLabelBgColor" />
                    <span class="tm3js-pill">Text</span>
                    <input type="color" value="#b9d2ff" data-k="measureLabelTextColor" />
                    <span class="tm3js-pill">Border</span>
                    <input type="color" value="#2f7bff" data-k="measureLabelBorderColor" />
                  </div>
                </div>

              </details>

              <div class="tm3js-hint" style="margin-top:10px;">
                Controls: Left=orbit • Right=pan • Wheel/Middle=zoom
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

            const style = document.createElement("style");
            style.textContent = `
      #tm-threejs-overlay-root { position: fixed; inset: 12px; z-index: 999999; pointer-events: none; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
      #tm-threejs-overlay-root .tm3js-wrap { height: 100%; width: 100%; background: rgba(10,10,12,0.82); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; backdrop-filter: blur(10px); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.45); pointer-events: auto; display: grid; grid-template-rows: auto 1fr; }

      #tm-threejs-overlay-root .tm3js-topbar { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.10); background: rgba(0,0,0,0.18); }
      #tm-threejs-overlay-root .tm3js-title { color: #fff; font-weight: 800; letter-spacing: 0.2px; }
      #tm-threejs-overlay-root .tm3js-actions { display:flex; gap:8px; flex-wrap: wrap; justify-content: flex-end; align-items: center; }

      #tm-threejs-overlay-root .tm3js-canvasHost { position: relative; width:100%; height:100%; }
      #tm-threejs-overlay-root canvas.tm3js-canvas { width: 100%; height: 100%; display:block; background: transparent; }

      #tm-threejs-overlay-root .tm3js-fps {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 4;
        padding: 6px 8px;
        border-radius: 10px;
        font-weight: 800;
        font-size: 12px;
        letter-spacing: 0.2px;
        color: rgba(255,255,255,0.92);
        background: rgba(0,0,0,0.45);
        border: 1px solid rgba(255,255,255,0.14);
        backdrop-filter: blur(10px);
        pointer-events: none;
        opacity: 0;
        transition: opacity 150ms ease;
      }
      #tm-threejs-overlay-root .tm3js-fps[data-show="1"] { opacity: 1; }

      #tm-threejs-overlay-root .tm3js-btn { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 8px 10px; font-weight: 650; cursor: pointer; }
      #tm-threejs-overlay-root .tm3js-btn:hover { background: rgba(255,255,255,0.13); }
      #tm-threejs-overlay-root .tm3js-btn:active { transform: translateY(1px); }
      #tm-threejs-overlay-root .tm3js-btn-primary { background: rgba(0, 160, 255, 0.22); border-color: rgba(0,160,255,0.4); }
      #tm-threejs-overlay-root .tm3js-btn-primary:hover { background: rgba(0, 160, 255, 0.30); }
      #tm-threejs-overlay-root .tm3js-btn-danger { background: rgba(255, 60, 60, 0.18); border-color: rgba(255, 60, 60, 0.35); }
      #tm-threejs-overlay-root .tm3js-btn-danger:hover { background: rgba(255, 60, 60, 0.25); }
      #tm-threejs-overlay-root .tm3js-btn-mini { padding: 6px 8px; border-radius: 10px; }

      #tm-threejs-overlay-root .tm3js-btn-file { position: relative; overflow:hidden; display: inline-flex; align-items:center; gap:8px; }
      #tm-threejs-overlay-root .tm3js-btn-file input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; }

      /* Export menu */
      #tm-threejs-overlay-root .tm3js-menuWrap { position: relative; pointer-events: auto; }
      #tm-threejs-overlay-root .tm3js-menu {
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        width: 240px;
        background: rgba(10,10,12,0.92);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.55);
        backdrop-filter: blur(12px);
        padding: 8px;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity 140ms ease, transform 140ms ease;
        pointer-events: none;
        z-index: 3;
      }
      #tm-threejs-overlay-root .tm3js-menu[data-open="1"] { opacity: 1; transform: translateY(0); pointer-events: auto; }
      #tm-threejs-overlay-root .tm3js-menuTitle { color: rgba(255,255,255,0.9); font-weight: 800; font-size: 12px; padding: 4px 6px 8px; }
      #tm-threejs-overlay-root .tm3js-menuItem {
        width: 100%;
        text-align: left;
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.92);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 10px;
        padding: 8px 10px;
        cursor: pointer;
        font-weight: 650;
        margin-bottom: 6px;
      }
      #tm-threejs-overlay-root .tm3js-menuItem:hover { background: rgba(255,255,255,0.11); }
      #tm-threejs-overlay-root .tm3js-menuSep { height: 1px; background: rgba(255,255,255,0.12); margin: 6px 4px; }

      /* Settings drawer */
      #tm-threejs-overlay-root .tm3js-drawer {
        position: absolute;
        top: 10px;
        right: 10px;
        width: min(420px, calc(100% - 20px));
        max-height: calc(100% - 20px);
        overflow: auto;
        background: rgba(10,10,12,0.88);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 14px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.55);
        backdrop-filter: blur(12px);
        transition: opacity 160ms ease;
        opacity: 0;
        pointer-events: none;
        z-index: 2;
      }
      #tm-threejs-overlay-root .tm3js-drawer[data-open="1"] { opacity: 1; pointer-events: auto; }
      #tm-threejs-overlay-root .tm3js-drawerHeader { display:flex; align-items:center; justify-content:space-between; padding: 10px 10px; border-bottom: 1px solid rgba(255,255,255,0.10); position: sticky; top: 0; background: rgba(10,10,12,0.95); }
      #tm-threejs-overlay-root .tm3js-drawerTitle { color: #fff; font-weight: 900; }
      #tm-threejs-overlay-root .tm3js-drawerBody { padding: 10px; }

      #tm-threejs-overlay-root details.tm3js-section { border: 1px solid rgba(255,255,255,0.10); border-radius: 12px; padding: 8px; margin-bottom: 10px; background: rgba(255,255,255,0.04); }
      #tm-threejs-overlay-root details.tm3js-section > summary { cursor:pointer; color: rgba(255,255,255,0.92); font-weight: 800; padding: 6px 6px; }
      #tm-threejs-overlay-root details.tm3js-section[open] > summary { margin-bottom: 8px; }

      #tm-threejs-overlay-root .tm3js-field { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); border-radius: 10px; padding: 10px; margin-bottom: 8px; }
      #tm-threejs-overlay-root .tm3js-field label { display:block; color: rgba(255,255,255,0.85); font-size: 12px; margin-bottom: 6px; }
      #tm-threejs-overlay-root input[type="range"] { width: 100%; }
      #tm-threejs-overlay-root input[type="number"] { width: 110px; background: rgba(0,0,0,0.35); color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 7px 9px; }
      #tm-threejs-overlay-root input[type="color"] { width: 48px; height: 34px; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; background: transparent; padding: 0; }
      #tm-threejs-overlay-root .tm3js-inline { display:flex; align-items:center; gap:10px; flex-wrap: wrap; }
      #tm-threejs-overlay-root .tm3js-check { display:flex; align-items:center; gap:6px; color: rgba(255,255,255,0.85); font-size: 12px; user-select:none; margin: 0; }
      #tm-threejs-overlay-root .tm3js-hint { color: rgba(255,255,255,0.72); font-size: 12px; }
      #tm-threejs-overlay-root .tm3js-pill { color: rgba(255,255,255,0.75); font-size: 12px; padding: 4px 8px; border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; background: rgba(0,0,0,0.20); }
    `;
            document.head.appendChild(style);
            document.body.appendChild(root);

            return root;
      }

      // -----------------------------
      // Hi-res label sprite (billboard)
      // -----------------------------
      function makeTextSprite(THREE, opts) {
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

            const scale = clamp(Math.round(labelScale), 1, 6);
            canvas.width = cssW * scale;
            canvas.height = cssH * scale;

            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            ctx.font = `800 ${px}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
            ctx.textBaseline = "middle";

            ctx.fillStyle = hexToRgba(bgColor, 0.90);
            roundRect(ctx, 0, 0, cssW, cssH, 10);
            ctx.fill();

            ctx.strokeStyle = hexToRgba(borderColor, 0.95);
            ctx.lineWidth = 2;
            roundRect(ctx, 1, 1, cssW - 2, cssH - 2, 10);
            ctx.stroke();

            ctx.fillStyle = hexToRgba(textColor, 0.98);
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

            function roundRect(ctx2, x, y, w, h, r) {
                  const rr = Math.min(r, w / 2, h / 2);
                  ctx2.beginPath();
                  ctx2.moveTo(x + rr, y);
                  ctx2.arcTo(x + w, y, x + w, y + h, rr);
                  ctx2.arcTo(x + w, y + h, x, y + h, rr);
                  ctx2.arcTo(x, y + h, x, y, rr);
                  ctx2.arcTo(x, y, x + w, y, rr);
                  ctx2.closePath();
            }

            function hexToRgba(hex, a) {
                  const c = (hex || "#000000").replace("#", "").trim();
                  const n = parseInt(c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c, 16);
                  const r = (n >> 16) & 255;
                  const g = (n >> 8) & 255;
                  const b = n & 255;
                  return `rgba(${r},${g},${b},${a})`;
            }
      }

      // -----------------------------
      // Dimension lines + arrows (FIXED to match your reference)
      // - Arrowheads point OUTWARD (rotated 180° vs prior)
      // - Main dimension line MEETS the arrow bases (no gap)
      // - Extension lines can still "overshoot" past the dim line using extOver
      // -----------------------------
      function addDraftDimension({
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

            // Extension lines (object -> dimension line, plus overshoot)
            const extAEnd = aOff.clone().add(offsetDir.clone().multiplyScalar(extOver));
            const extBEnd = bOff.clone().add(offsetDir.clone().multiplyScalar(extOver));
            group.add(makeLine(THREE, lineMat, a, extAEnd));
            group.add(makeLine(THREE, lineMat, b, extBEnd));

            const dirAB = bOff.clone().sub(aOff).normalize();

            // Dimension line MUST reach arrow bases:
            group.add(makeLine(THREE, lineMat, aOff, bOff));

            // Arrowheads OUTWARD:
            // Left end: points opposite dirAB
            // Right end: points along dirAB
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

            // Cone tip is at +Y local => orient +Y to our desired outward direction
            orientConeToDir(THREE, coneA, dirOutA);
            orientConeToDir(THREE, coneB, dirOutB);

            // Place cone so its BASE is exactly on the dimension line endpoint.
            // For a cone: base plane center = center - dir*(h/2). We want base at endpoint => center = endpoint + dir*(h/2).
            coneA.position.copy(aOff).add(dirOutA.clone().multiplyScalar(-halfH));
            coneB.position.copy(bOff).add(dirOutB.clone().multiplyScalar(-halfH));

            coneA.renderOrder = 9000;
            coneB.renderOrder = 9000;
            group.add(coneA);
            group.add(coneB);

            // Label
            const mid = aOff.clone().lerp(bOff, 0.5);
            const label = makeTextSprite(THREE, {
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
                  const g = new THREE2.BufferGeometry().setFromPoints([p1, p2]);
                  const line = new THREE2.Line(g, material);
                  line.renderOrder = 8000;
                  return line;
            }

            function orientConeToDir(THREE2, mesh, dir) {
                  const up = new THREE2.Vector3(0, 1, 0);
                  mesh.quaternion.copy(new THREE2.Quaternion().setFromUnitVectors(up, dir.clone().normalize()));
            }
      }

      // -----------------------------
      // Axis labels
      // -----------------------------
      function makeAxisLabelSprite(THREE, text, colorHex = "#ffffff") {
            return makeTextSprite(THREE, {
                  text,
                  px: 16,
                  labelScale: 3,
                  bgColor: "#000000",
                  textColor: colorHex,
                  borderColor: "#333333"
            });
      }

      // -----------------------------
      // Main App
      // -----------------------------
      class ThreeJSSVGWorld {
            constructor(opts) {
                  this.container = opts.container;
                  this.canvas = opts.canvas || this.container.querySelector("canvas") || null;
                  this.useOverlayUI = !!opts.useOverlayUI;

                  this.fileInput = this.useOverlayUI ? this.container.querySelector("input.tm3js-file") : null;
                  this.drawer = this.useOverlayUI ? this.container.querySelector(".tm3js-drawer") : null;
                  this.exportMenu = this.useOverlayUI
                        ? this.container.querySelector('.tm3js-menuWrap[data-menu="export"] .tm3js-menu')
                        : null;

                  this.fpsEl = this.useOverlayUI ? this.container.querySelector(".tm3js-fps") : null;
                  this._fpsFrames = 0;
                  this._fpsLastT = performance.now();
                  this._fpsLastReportT = performance.now();

                  this.settings = {
                        scale: 1,
                        mmPerUnit: 1,
                        depth: 10,
                        curveSegments: 12,
                        bevelEnabled: false,
                        bevelSize: 0.5,
                        bevelThickness: 0.5,
                        flipX: false,
                        flipY: false,
                        flipZ: false,
                        wireframe: false,
                        doubleSided: true,
                        autoFitOnLarge: true,

                        showGrid: true,
                        bgColor: "#0a0a0c",

                        showAxes: true,
                        showAxisLabels: true,
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
                        measureLabelBorderColor: "#2f7bff"
                  };

                  this.svgText = null;

                  this.svgUserGroup = null;
                  this.svgFixGroup = null;
                  this.mesh = null;

                  this.measureGroup = null;
                  this.grid = null;

                  this.axes = null;
                  this.axisLabelGroup = null;

                  this.lastFitRadius = null;

                  this._resizeObs = null;

                  this.init();
            }

            async init() {
                  await injectImportMap();
                  const THREE = await import("three");
                  const {OrbitControls} = await import("three/examples/jsm/controls/OrbitControls.js");
                  const {SVGLoader} = await import("three/examples/jsm/loaders/SVGLoader.js");
                  const {GLTFExporter} = await import("three/examples/jsm/exporters/GLTFExporter.js");

                  this.THREE = THREE;
                  this.OrbitControls = OrbitControls;
                  this.SVGLoader = SVGLoader;
                  this.GLTFExporter = GLTFExporter;

                  if(!this.canvas) {
                        this.canvas = document.createElement("canvas");
                        this.canvas.style.width = "100%";
                        this.canvas.style.height = "100%";
                        this.canvas.style.display = "block";
                        this.container.appendChild(this.canvas);
                  }

                  this.buildScene();
                  if(this.useOverlayUI) this.bindOverlayUI();

                  this.animate();

                  if(this.useOverlayUI) this.loadDemoSVG();
            }

            buildScene() {
                  const THREE = this.THREE;

                  this.renderer = new THREE.WebGLRenderer({
                        canvas: this.canvas,
                        antialias: true,
                        alpha: false,
                        preserveDrawingBuffer: true
                  });
                  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                  this.renderer.outputColorSpace = THREE.SRGBColorSpace;

                  this.scene = new THREE.Scene();
                  this.scene.background = new THREE.Color(this.settings.bgColor);

                  const w = this.canvas.clientWidth || 800;
                  const h = this.canvas.clientHeight || 500;

                  this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200000);
                  this.camera.position.set(0, 250, 500);

                  this.controls = new this.OrbitControls(this.camera, this.canvas);
                  this.controls.enableDamping = true;
                  this.controls.dampingFactor = 0.08;
                  this.controls.screenSpacePanning = true;
                  this.controls.target.set(0, 60, 0);

                  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
                  this.scene.add(ambient);

                  const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
                  dir1.position.set(300, 600, 450);
                  this.scene.add(dir1);

                  const dir2 = new THREE.DirectionalLight(0xffffff, 0.65);
                  dir2.position.set(-350, 400, -250);
                  this.scene.add(dir2);

                  this.grid = new THREE.GridHelper(2000, 40, 0x4a4a4a, 0x2a2a2a);
                  this.grid.position.y = 0;
                  this.grid.visible = !!this.settings.showGrid;
                  this.scene.add(this.grid);

                  this.axes = new THREE.AxesHelper(150);
                  this.axes.position.y = 0.1;
                  this.axes.visible = !!this.settings.showAxes;
                  this.scene.add(this.axes);

                  this.axisLabelGroup = new THREE.Group();
                  this.axisLabelGroup.visible = !!this.settings.showAxes && !!this.settings.showAxisLabels;
                  this.scene.add(this.axisLabelGroup);
                  this.buildAxisLabels();

                  this.svgRoot = new THREE.Group();
                  this.scene.add(this.svgRoot);

                  this.measureGroup = new THREE.Group();
                  this.scene.add(this.measureGroup);

                  this.fitRendererToCanvas();

                  this._resizeObs = new ResizeObserver(() => this.fitRendererToCanvas());
                  this._resizeObs.observe(this.container);
                  window.addEventListener("resize", () => this.fitRendererToCanvas(), {passive: true});

                  this.setFPSVisible(this.settings.showFPS);
            }

            setFPSVisible(on) {
                  if(!this.fpsEl) return;
                  this.fpsEl.setAttribute("data-show", on ? "1" : "0");
            }

            buildAxisLabels() {
                  if(!this.axisLabelGroup) return;
                  const THREE = this.THREE;

                  while(this.axisLabelGroup.children.length) {
                        const c = this.axisLabelGroup.children.pop();
                        this.axisLabelGroup.remove(c);
                        c.material?.map?.dispose?.();
                        c.material?.dispose?.();
                  }

                  const len = 150;

                  const AXIS_LABEL_SCALE = 2.5; // ← adjust if you want even larger

                  const xLab = makeAxisLabelSprite(THREE, "X", "#ff6b6b");
                  xLab.position.set(len + 25, 15, 0);
                  xLab.scale.multiplyScalar(AXIS_LABEL_SCALE);

                  const yLab = makeAxisLabelSprite(THREE, "Y", "#51cf66");
                  yLab.position.set(0, len + 25, 0);
                  yLab.scale.multiplyScalar(AXIS_LABEL_SCALE);

                  const zLab = makeAxisLabelSprite(THREE, "Z", "#4dabf7");
                  zLab.position.set(0, 15, len + 25);
                  zLab.scale.multiplyScalar(AXIS_LABEL_SCALE);


                  xLab.renderOrder = 11000;
                  yLab.renderOrder = 11000;
                  zLab.renderOrder = 11000;

                  this.axisLabelGroup.add(xLab, yLab, zLab);
            }

            fitRendererToCanvas() {
                  const w = this.canvas.clientWidth || this.container.clientWidth || 1;
                  const h = this.canvas.clientHeight || this.container.clientHeight || 1;
                  this.renderer.setSize(w, h, false);
                  this.camera.aspect = w / h;
                  this.camera.updateProjectionMatrix();
            }

            bindOverlayUI() {
                  document.addEventListener(
                        "pointerdown",
                        (e) => {
                              if(!this.container.contains(e.target)) return;
                              const wrap = e.target.closest('.tm3js-menuWrap[data-menu="export"]');
                              if(!wrap) this.setExportMenuOpen(false);
                        },
                        {passive: true}
                  );

                  this.container.addEventListener("click", async (e) => {
                        const btn = e.target.closest("[data-act]");
                        if(!btn) return;
                        const act = btn.getAttribute("data-act");

                        if(act === "close") this.container.remove();
                        if(act === "clear") this.clearSVG();
                        if(act === "resetView") this.resetView();
                        if(act === "build") this.rebuildExtrude({preserveCamera: true, allowAutoFit: true});
                        if(act === "loadDemo") this.loadDemoSVG();
                        if(act === "toggleSettings") this.toggleSettingsDrawer();
                        if(act === "applyScale") this.applyUserTransforms();

                        if(act === "toggleExportMenu") {
                              const open = this.exportMenu?.getAttribute("data-open") === "1";
                              this.setExportMenuOpen(!open);
                        }
                        if(act === "exportImagePNG") {
                              this.setExportMenuOpen(false);
                              await this.exportViewToPNG();
                        }
                        if(act === "exportModelGLB") {
                              this.setExportMenuOpen(false);
                              await this.exportToGLB({what: "model"});
                        }
                        if(act === "exportModelGLTF") {
                              this.setExportMenuOpen(false);
                              await this.exportToGLTF({what: "model"});
                        }
                        if(act === "exportSceneGLB") {
                              this.setExportMenuOpen(false);
                              await this.exportToGLB({what: "scene"});
                        }
                        if(act === "exportSceneGLTF") {
                              this.setExportMenuOpen(false);
                              await this.exportToGLTF({what: "scene"});
                        }
                  });

                  this.fileInput?.addEventListener("change", async () => {
                        const f = this.fileInput.files && this.fileInput.files[0];
                        if(!f) return;
                        this.svgText = await f.text();
                        this.rebuildExtrude({preserveCamera: true, allowAutoFit: true, isNewImport: true});
                  });

                  const hookPair = (rangeKey, numKey, settingKey, parseFn, onChange) => {
                        const rangeEl = this.container.querySelector(`input[data-k="${rangeKey}"]`);
                        const numEl = this.container.querySelector(`input[data-k="${numKey}"]`);
                        const apply = (val) => {
                              const v = parseFn(val);
                              this.settings[settingKey] = v;
                              if(rangeEl) rangeEl.value = String(v);
                              if(numEl) numEl.value = String(v);
                              onChange?.();
                        };
                        rangeEl?.addEventListener("input", () => apply(rangeEl.value));
                        numEl?.addEventListener("input", () => apply(numEl.value));
                  };

                  const hookCheckbox = (k, onChange) => {
                        const el = this.container.querySelector(`input[type="checkbox"][data-k="${k}"]`);
                        if(!el) return;
                        this.settings[k] = !!el.checked;
                        el.addEventListener("change", () => {
                              this.settings[k] = !!el.checked;
                              onChange?.();
                        });
                  };

                  const hookNumber = (k, min, max, fallback, onChange) => {
                        const el = this.container.querySelector(`input[type="number"][data-k="${k}"]`);
                        if(!el) return;
                        this.settings[k] = clamp(safeNumber(el.value, fallback), min, max);
                        el.addEventListener("input", () => {
                              this.settings[k] = clamp(safeNumber(el.value, fallback), min, max);
                              onChange?.();
                        });
                  };

                  const hookColor = (k, onChange) => {
                        const el = this.container.querySelector(`input[type="color"][data-k="${k}"]`);
                        if(!el) return;
                        this.settings[k] = el.value || this.settings[k];
                        el.addEventListener("input", () => {
                              this.settings[k] = el.value || this.settings[k];
                              onChange?.();
                        });
                  };

                  hookPair("scale", "scaleNum", "scale", (v) => clamp(safeNumber(v, 1), 0, 10), () => this.applyUserTransforms());
                  hookPair("depth", "depthNum", "depth", (v) => clamp(safeNumber(v, 10), 0, 500));
                  hookPair("curveSegments", "curveSegmentsNum", "curveSegments", (v) =>
                        Math.round(clamp(safeNumber(v, 12), 1, 64))
                  );

                  hookNumber("mmPerUnit", 0, 100000, 1, () => this.updateMeasures());

                  hookCheckbox("flipX", () => this.applyUserTransforms());
                  hookCheckbox("flipY", () => this.applyUserTransforms());
                  hookCheckbox("flipZ", () => this.applyUserTransforms());

                  hookCheckbox("bevelEnabled", () => this.rebuildExtrude({preserveCamera: true, allowAutoFit: false}));
                  hookNumber("bevelSize", 0, 50, 0.5);
                  hookNumber("bevelThickness", 0, 50, 0.5);

                  hookCheckbox("wireframe", () => this.applyMaterialFlags());
                  hookCheckbox("doubleSided", () => this.applyMaterialFlags());
                  hookCheckbox("autoFitOnLarge", () => { });

                  hookCheckbox("showGrid", () => {
                        if(this.grid) this.grid.visible = !!this.settings.showGrid;
                  });
                  hookColor("bgColor", () => {
                        if(this.scene?.background) this.scene.background.set(this.settings.bgColor);
                  });

                  hookCheckbox("showAxes", () => {
                        if(this.axes) this.axes.visible = !!this.settings.showAxes;
                        if(this.axisLabelGroup) this.axisLabelGroup.visible = !!this.settings.showAxes && !!this.settings.showAxisLabels;
                  });
                  hookCheckbox("showAxisLabels", () => {
                        if(this.axisLabelGroup) this.axisLabelGroup.visible = !!this.settings.showAxes && !!this.settings.showAxisLabels;
                  });

                  hookCheckbox("showFPS", () => {
                        this.setFPSVisible(!!this.settings.showFPS);
                  });

                  hookCheckbox("measuresEnabled", () => this.updateMeasures());
                  hookCheckbox("measuresW", () => this.updateMeasures());
                  hookCheckbox("measuresH", () => this.updateMeasures());
                  hookCheckbox("measuresD", () => this.updateMeasures());
                  hookNumber("measureDecimals", 0, 4, 2, () => this.updateMeasures());
                  hookNumber("measureTextPx", 8, 64, 18, () => this.updateMeasures());
                  hookNumber("measureLabelScale", 1, 6, 3, () => this.updateMeasures());
                  hookNumber("measureOffset", 0, 2000, 25, () => this.updateMeasures());
                  hookNumber("measureExtOver", 0, 2000, 8, () => this.updateMeasures());
                  hookNumber("measureArrowSize", 0, 2000, 8, () => this.updateMeasures());

                  hookColor("measureLabelBgColor", () => this.updateMeasures());
                  hookColor("measureLabelTextColor", () => this.updateMeasures());
                  hookColor("measureLabelBorderColor", () => this.updateMeasures());

                  this.setDrawerOpen(false);
                  this.setExportMenuOpen(false);
            }

            setExportMenuOpen(open) {
                  if(!this.exportMenu) return;
                  this.exportMenu.setAttribute("data-open", open ? "1" : "0");
            }

            toggleSettingsDrawer() {
                  if(!this.drawer) return;
                  const open = this.drawer.getAttribute("data-open") === "1";
                  this.setDrawerOpen(!open);
            }

            setDrawerOpen(open) {
                  if(!this.drawer) return;
                  this.drawer.setAttribute("data-open", open ? "1" : "0");
                  this.drawer.setAttribute("aria-hidden", open ? "false" : "true");
            }

            animate() {
                  const tick = (t) => {
                        requestAnimationFrame(tick);
                        this.controls.update();
                        this.renderer.render(this.scene, this.camera);

                        if(this.settings.showFPS && this.fpsEl) {
                              this._fpsFrames++;
                              const now = t || performance.now();
                              const elapsed = now - this._fpsLastReportT;
                              if(elapsed >= 250) {
                                    const total = now - this._fpsLastT;
                                    const fps = total > 0 ? (this._fpsFrames * 1000) / total : 0;
                                    this.fpsEl.textContent = `FPS: ${fps.toFixed(0)}`;
                                    this._fpsFrames = 0;
                                    this._fpsLastT = now;
                                    this._fpsLastReportT = now;
                              }
                        }
                  };
                  requestAnimationFrame(tick);
            }

            resetView() {
                  this.camera.position.set(0, 250, 500);
                  this.controls.target.set(0, 60, 0);
                  this.controls.update();
            }

            loadDemoSVG() {
                  this.svgText = `
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="140" viewBox="0 0 220 140">
          <path d="M20 20 h180 a20 20 0 0 1 20 20 v60 a20 20 0 0 1 -20 20 h-180 a20 20 0 0 1 -20 -20 v-60 a20 20 0 0 1 20 -20 z"
                fill="#ffffff"/>
          <path d="M110 40 a30 30 0 1 0 0.01 0" fill="#000000"/>
        </svg>
      `;
                  this.rebuildExtrude({preserveCamera: true, allowAutoFit: true, isNewImport: true});
            }

            clearSVG() {
                  if(this.svgUserGroup) {
                        this.svgRoot.remove(this.svgUserGroup);
                        this.disposeObject(this.svgUserGroup);
                        this.svgUserGroup = null;
                        this.svgFixGroup = null;
                        this.mesh = null;
                  }
                  this.clearMeasures();
            }

            clearMeasures() {
                  if(!this.measureGroup) return;
                  while(this.measureGroup.children.length) {
                        const c = this.measureGroup.children.pop();
                        this.measureGroup.remove(c);
                        this.disposeObject(c);
                  }
            }

            disposeObject(obj) {
                  obj.traverse?.((n) => {
                        if(n.geometry) n.geometry.dispose();
                        if(n.material) {
                              if(Array.isArray(n.material)) n.material.forEach((m) => m.dispose());
                              else n.material.dispose();
                        }
                        if(n.material?.map) n.material.map.dispose?.();
                  });
            }

            captureCameraState() {
                  return {
                        camPos: this.camera.position.clone(),
                        camQuat: this.camera.quaternion.clone(),
                        camFov: this.camera.fov,
                        camNear: this.camera.near,
                        camFar: this.camera.far,
                        target: this.controls.target.clone(),
                        zoom: this.camera.zoom
                  };
            }

            applyCameraState(state) {
                  this.camera.position.copy(state.camPos);
                  this.camera.quaternion.copy(state.camQuat);
                  this.camera.fov = state.camFov;
                  this.camera.near = state.camNear;
                  this.camera.far = state.camFar;
                  this.camera.zoom = state.zoom;
                  this.camera.updateProjectionMatrix();

                  this.controls.target.copy(state.target);
                  this.controls.update();
            }

            applyMaterialFlags() {
                  if(!this.mesh) return;
                  const THREE = this.THREE;
                  const m = this.mesh.material;
                  if(!m) return;
                  m.wireframe = !!this.settings.wireframe;
                  m.side = this.settings.doubleSided ? THREE.DoubleSide : THREE.FrontSide;
                  m.needsUpdate = true;
            }

            applyUserTransforms() {
                  if(!this.svgUserGroup) return;

                  const s = this.settings.scale;
                  const fx = this.settings.flipX ? -1 : 1;
                  const fy = this.settings.flipY ? -1 : 1;
                  const fz = this.settings.flipZ ? -1 : 1;

                  this.svgUserGroup.scale.set(s * fx, s * fy, s * fz);
                  this.updateMeasures();
            }

            fitCameraToObject(box, {padding = 1.2, setTarget = true} = {}) {
                  const THREE = this.THREE;
                  const size = new THREE.Vector3();
                  const center = new THREE.Vector3();
                  box.getSize(size);
                  box.getCenter(center);

                  const maxDim = Math.max(size.x, size.y, size.z);
                  const radius = maxDim * 0.5;
                  if(!Number.isFinite(radius) || radius <= 0) return {radius: 0};

                  const fov = (this.camera.fov * Math.PI) / 180;
                  const aspect = this.camera.aspect || 1;

                  const fitHeightDist = radius / Math.tan(fov / 2);
                  const fitWidthDist = radius / (Math.tan(fov / 2) * aspect);
                  let dist = Math.max(fitHeightDist, fitWidthDist) * padding;
                  dist = clamp(dist, 10, 15000);

                  const dir = new THREE.Vector3();
                  dir.copy(this.camera.position).sub(this.controls.target).normalize();
                  if(!Number.isFinite(dir.x)) dir.set(0.4, 0.35, 0.75).normalize();

                  if(setTarget) this.controls.target.copy(center);
                  this.camera.position.copy(center).add(dir.multiplyScalar(dist));
                  this.controls.update();

                  return {radius: radius * 2};
            }

            shouldAutoFit(newBox) {
                  if(!this.settings.autoFitOnLarge) return false;

                  const THREE = this.THREE;
                  const size = new THREE.Vector3();
                  newBox.getSize(size);
                  const newMax = Math.max(size.x, size.y, size.z);

                  if(!Number.isFinite(this.lastFitRadius) || this.lastFitRadius == null) return true;
                  return newMax > this.lastFitRadius * 1.5;
            }

            rebuildExtrude({preserveCamera = true, allowAutoFit = true, isNewImport = false} = {}) {
                  if(!this.svgText) return;

                  const camState = preserveCamera ? this.captureCameraState() : null;

                  const THREE = this.THREE;
                  const SVGLoader = this.SVGLoader;

                  this.clearSVG();

                  let data;
                  try {
                        const loader = new SVGLoader();
                        data = loader.parse(this.svgText);
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
                  for(const p of paths) {
                        const to = SVGLoader.createShapes(p);
                        for(const s of to) shapes.push(s);
                  }
                  if(!shapes.length) {
                        alert("No shapes created from SVG paths. Stroke-only SVGs often won’t extrude cleanly.");
                        return;
                  }

                  const extrudeSettings = {
                        depth: this.settings.depth,
                        bevelEnabled: !!this.settings.bevelEnabled,
                        bevelThickness: this.settings.bevelEnabled ? this.settings.bevelThickness : 0,
                        bevelSize: this.settings.bevelEnabled ? this.settings.bevelSize : 0,
                        bevelSegments: this.settings.bevelEnabled ? 3 : 0,
                        curveSegments: this.settings.curveSegments
                  };

                  const geo = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
                  geo.computeBoundingBox();
                  geo.computeVertexNormals();

                  const mat = new THREE.MeshStandardMaterial({
                        color: 0xeaeaea,
                        metalness: 0.15,
                        roughness: 0.45,
                        wireframe: !!this.settings.wireframe,
                        side: this.settings.doubleSided ? THREE.DoubleSide : THREE.FrontSide
                  });

                  this.mesh = new THREE.Mesh(geo, mat);

                  const bb = geo.boundingBox;
                  const center = new THREE.Vector3();
                  bb.getCenter(center);
                  this.mesh.position.set(-center.x, -center.y, -center.z);

                  this.svgUserGroup = new THREE.Group();
                  this.svgFixGroup = new THREE.Group();

                  this.svgFixGroup.scale.set(1, -1, 1);
                  this.svgFixGroup.add(this.mesh);

                  this.svgUserGroup.add(this.svgFixGroup);
                  this.svgUserGroup.position.y = 1;

                  this.applyUserTransforms();
                  this.svgRoot.add(this.svgUserGroup);

                  const newBox = new THREE.Box3().setFromObject(this.svgUserGroup);
                  const doFit = allowAutoFit && (isNewImport || this.shouldAutoFit(newBox));

                  if(doFit) {
                        const res = this.fitCameraToObject(newBox, {padding: 1.25, setTarget: true});
                        this.lastFitRadius = res.radius;
                  } else if(camState) {
                        this.applyCameraState(camState);
                  }

                  this.updateMeasures();
            }

            updateMeasures() {
                  this.clearMeasures();
                  if(!this.settings.measuresEnabled) return;
                  if(!this.svgUserGroup) return;

                  const THREE = this.THREE;
                  const box = new THREE.Box3().setFromObject(this.svgUserGroup);

                  const size = new THREE.Vector3();
                  const center = new THREE.Vector3();
                  box.getSize(size);
                  box.getCenter(center);

                  if(!Number.isFinite(size.x) || (size.x === 0 && size.y === 0 && size.z === 0)) return;

                  const mmPerUnit = this.settings.mmPerUnit;
                  const dec = this.settings.measureDecimals;

                  const wMM = size.x * mmPerUnit;
                  const hMM = size.y * mmPerUnit;
                  const dMM = size.z * mmPerUnit;

                  const base = Math.max(size.x, size.y, size.z);
                  const offset = this.settings.measureOffset;
                  const extOver = this.settings.measureExtOver;
                  const arrowSize = this.settings.measureArrowSize;

                  const worldTextSize = clamp(base * 0.12, 30, 260);

                  const offW = new THREE.Vector3(0, 1, 0).normalize();
                  const offH = new THREE.Vector3(1, 0, 0).normalize();
                  const offD = new THREE.Vector3(-1, 0, 0).normalize();

                  const yW = box.max.y;
                  const zW = center.z;
                  const aW = new THREE.Vector3(box.min.x, yW, zW);
                  const bW = new THREE.Vector3(box.max.x, yW, zW);

                  const xH = box.max.x;
                  const zH = center.z;
                  const aH = new THREE.Vector3(xH, box.min.y, zH);
                  const bH = new THREE.Vector3(xH, box.max.y, zH);

                  const xD = box.min.x;
                  const yD = center.y;
                  const aD = new THREE.Vector3(xD, yD, box.min.z);
                  const bD = new THREE.Vector3(xD, yD, box.max.z);

                  const color = 0xffffff;

                  const labelCommon = {
                        labelPx: this.settings.measureTextPx,
                        labelScale: this.settings.measureLabelScale,
                        labelBgColor: this.settings.measureLabelBgColor,
                        labelTextColor: this.settings.measureLabelTextColor,
                        labelBorderColor: this.settings.measureLabelBorderColor
                  };

                  if(this.settings.measuresW) {
                        addDraftDimension({
                              THREE,
                              group: this.measureGroup,
                              a: aW,
                              b: bW,
                              offsetDir: offW,
                              offset,
                              extOver,
                              arrowSize,
                              labelText: `W: ${wMM.toFixed(dec)} mm`,
                              worldTextSize,
                              color,
                              ...labelCommon
                        });
                  }

                  if(this.settings.measuresH) {
                        addDraftDimension({
                              THREE,
                              group: this.measureGroup,
                              a: aH,
                              b: bH,
                              offsetDir: offH,
                              offset,
                              extOver,
                              arrowSize,
                              labelText: `H: ${hMM.toFixed(dec)} mm`,
                              worldTextSize,
                              color,
                              ...labelCommon
                        });
                  }

                  if(this.settings.measuresD) {
                        addDraftDimension({
                              THREE,
                              group: this.measureGroup,
                              a: aD,
                              b: bD,
                              offsetDir: offD,
                              offset,
                              extOver,
                              arrowSize,
                              labelText: `D: ${dMM.toFixed(dec)} mm`,
                              worldTextSize,
                              color,
                              ...labelCommon
                        });
                  }
            }

            async exportViewToPNG() {
                  this.renderer.render(this.scene, this.camera);
                  const canvas = this.renderer.domElement;
                  if(!canvas) return;

                  await new Promise((resolve) => {
                        canvas.toBlob(
                              (blob) => {
                                    if(!blob) {
                                          alert("Export failed: could not create PNG blob.");
                                          resolve();
                                          return;
                                    }
                                    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
                                    downloadBlob(blob, `threejs-view-${stamp}.png`);
                                    resolve();
                              },
                              "image/png",
                              1.0
                        );
                  });
            }

            getExportRoot(what) {
                  if(what === "scene") return this.scene;
                  return this.svgUserGroup || this.scene;
            }

            async exportToGLB({what = "model"} = {}) {
                  const root = this.getExportRoot(what);
                  if(!root) return;

                  if(what === "model" && !this.svgUserGroup) {
                        alert("No model to export. Import an SVG first.");
                        return;
                  }

                  const exporter = new this.GLTFExporter();
                  const options = {binary: true, onlyVisible: true, truncateDrawRange: true};

                  await new Promise((resolve) => {
                        exporter.parse(
                              root,
                              (result) => {
                                    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
                                    const fname = what === "scene" ? `threejs-scene-${stamp}.glb` : `threejs-model-${stamp}.glb`;

                                    if(result instanceof ArrayBuffer) {
                                          downloadBlob(new Blob([result], {type: "model/gltf-binary"}), fname);
                                    } else {
                                          downloadText(JSON.stringify(result, null, 2), fname.replace(/\.glb$/i, ".gltf"));
                                    }
                                    resolve();
                              },
                              (err) => {
                                    console.error("GLB export error:", err);
                                    alert("GLB export failed. Check console for details.");
                                    resolve();
                              },
                              options
                        );
                  });
            }

            async exportToGLTF({what = "model"} = {}) {
                  const root = this.getExportRoot(what);
                  if(!root) return;

                  if(what === "model" && !this.svgUserGroup) {
                        alert("No model to export. Import an SVG first.");
                        return;
                  }

                  const exporter = new this.GLTFExporter();
                  const options = {binary: false, onlyVisible: true, truncateDrawRange: true};

                  await new Promise((resolve) => {
                        exporter.parse(
                              root,
                              (result) => {
                                    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
                                    const fname = what === "scene" ? `threejs-scene-${stamp}.gltf` : `threejs-model-${stamp}.gltf`;
                                    downloadText(JSON.stringify(result, null, 2), fname);
                                    resolve();
                              },
                              (err) => {
                                    console.error("glTF export error:", err);
                                    alert("glTF export failed. Check console for details.");
                                    resolve();
                              },
                              options
                        );
                  });
            }
      }

      // -----------------------------
      // Boot
      // -----------------------------
      function boot() {
            if(document.getElementById("tm-threejs-overlay-root")) return;

            const ui = createOverlayUI();
            new ThreeJSSVGWorld({
                  container: ui,
                  canvas: ui.querySelector("canvas.tm3js-canvas"),
                  useOverlayUI: true
            });
      }

      if(document.readyState === "complete" || document.readyState === "interactive") boot();
      else window.addEventListener("DOMContentLoaded", boot, {once: true});
})();
