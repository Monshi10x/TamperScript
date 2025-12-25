class TNode {
      static svg;
      static baseLine;
      static pulseLine;
      static activeNode = null;

      constructor(parentToAppendTo, options = {}) {
            if(!parentToAppendTo) throw new Error("TNode: parentToAppendTo is required");

            const {
                  overrideCssStyle = {},
                  nodeType = "alpha",
                  canAcceptNodes = false,
                  icon = TNode.DEFAULT_ICON,
                  onAcceptEnter = null,
                  onAcceptLeave = null,
                  onAcceptDrop = null,
            } = options;

            this.parent = parentToAppendTo;
            this.nodeType = nodeType;
            this.canAcceptNodes = !!canAcceptNodes;

            this.snapRadius = 30;

            this.callbacks = {
                  onAcceptEnter,
                  onAcceptLeave,
                  onAcceptDrop
            };

            this.isDragging = false;
            this.hoveredAccept = null;
            this.snappedAccept = null;
            this.snappedPoint = null;

            // element
            this.el = document.createElement("div");
            this.el.className = "TNode";
            this.el.dataset.tnodeType = this.nodeType;
            this.el.style.backgroundImage = `url(${icon})`;
            Object.assign(this.el.style, overrideCssStyle);

            if(this.canAcceptNodes) this.el.classList.add("TNodeAccept");

            this.parent.appendChild(this.el);

            TNode.initSharedOverlay();
            this.bindEvents();
      }

      setCallbacks({onAcceptEnter, onAcceptLeave, onAcceptDrop} = {}) {
            if(typeof onAcceptEnter === "function") this.callbacks.onAcceptEnter = onAcceptEnter;
            if(typeof onAcceptLeave === "function") this.callbacks.onAcceptLeave = onAcceptLeave;
            if(typeof onAcceptDrop === "function") this.callbacks.onAcceptDrop = onAcceptDrop;
            return this;
      }

      static initSharedOverlay() {
            if(TNode.svg) return;

            const ns = "http://www.w3.org/2000/svg";
            TNode.svg = document.createElementNS(ns, "svg");
            TNode.svg.classList.add("TNodeLineOverlay");
            TNode.svg.setAttribute("width", "100%");
            TNode.svg.setAttribute("height", "100%");
            TNode.svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);

            // base line
            TNode.baseLine = document.createElementNS(ns, "line");
            TNode.baseLine.classList.add("TNodeLineBase");
            TNode.baseLine.style.display = "none";

            // pulse line
            TNode.pulseLine = document.createElementNS(ns, "line");
            TNode.pulseLine.classList.add("TNodeLinePulse");
            TNode.pulseLine.style.display = "none";

            // Dash pattern: "dash length gap length"
            // This creates “pulses” along the line. Tune these numbers as you like.
            TNode.pulseLine.setAttribute("stroke-dasharray", "12 18");

            TNode.svg.appendChild(TNode.baseLine);
            TNode.svg.appendChild(TNode.pulseLine);
            document.documentElement.appendChild(TNode.svg);

            window.addEventListener("resize", () => {
                  TNode.svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);
            });
      }

      bindEvents() {
            this.el.addEventListener("mousedown", e => {
                  if(e.button !== 0) return;
                  e.preventDefault();
                  this.startDrag(e);
            });
      }

      startDrag(e) {
            if(TNode.activeNode) return;

            TNode.activeNode = this;
            this.isDragging = true;
            document.body.classList.add("TNode--dragging");

            const {x, y} = this.getCenter();
            this.startX = x;
            this.startY = y;

            // Show lines
            TNode.baseLine.style.display = "block";
            TNode.pulseLine.style.display = "block";
            TNode.pulseLine.classList.add("TNodePulseActive");

            // Evaluate snap/hover immediately and draw instantly (fix for stale endpoint)
            this.updateTargets(e.clientX, e.clientY);
            const end = this.snappedPoint || {x: e.clientX, y: e.clientY};
            this.updateLines(end.x, end.y);

            this.moveHandler = this.onMove.bind(this);
            this.upHandler = this.endDrag.bind(this);

            window.addEventListener("mousemove", this.moveHandler, true);
            window.addEventListener("mouseup", this.upHandler, true);
            window.addEventListener("blur", this.upHandler, true);
      }

      onMove(e) {
            if(!this.isDragging) return;

            this.updateTargets(e.clientX, e.clientY);
            const end = this.snappedPoint || {x: e.clientX, y: e.clientY};
            this.updateLines(end.x, end.y);
      }

      endDrag() {
            if(!this.isDragging) return;

            const target = this.getActiveDropTarget();
            if(target) {
                  console.log(target);
                  this.callbacks.onAcceptDrop?.({node: this, target});
            }

            this.isDragging = false;
            TNode.activeNode = null;
            document.body.classList.remove("TNode--dragging");

            // Hide lines
            TNode.baseLine.style.display = "none";
            TNode.pulseLine.style.display = "none";
            TNode.pulseLine.classList.remove("TNodePulseActive");

            this.clearHover();
            this.clearSnap();

            window.removeEventListener("mousemove", this.moveHandler, true);
            window.removeEventListener("mouseup", this.upHandler, true);
            window.removeEventListener("blur", this.upHandler, true);
      }

      /* ======================
         Target logic
      ====================== */

      updateTargets(x, y) {
            const el = document.elementFromPoint(x, y);
            let hover = el?.closest(".TNodeAccept") || null;
            if(hover === this.el) hover = null; // prevent self-drop

            this.setHover(hover);

            const snap = this.findSnapCandidate(x, y);
            this.setSnap(snap?.target || null, snap?.point || null);
      }

      findSnapCandidate(x, y) {
            let best = null;
            document.querySelectorAll(".TNodeAccept").forEach(target => {
                  if(target === this.el) return;
                  if(!this.targetAcceptsNode(target)) return;

                  const r = target.getBoundingClientRect();
                  const p = TNode.closestPointOnRect(r, x, y);
                  const d = Math.hypot(x - p.x, y - p.y);

                  if(d <= this.snapRadius && (!best || d < best.dist)) {
                        best = {target, point: p, dist: d};
                  }
            });
            return best;
      }

      getActiveDropTarget() {
            return this.snappedAccept || this.hoveredAccept || null;
      }

      targetAcceptsNode(target) {
            const list = (target.dataset.acceptTypes || "").trim();
            if(!list) return true;
            return list.split(",").map(s => s.trim()).includes(this.nodeType);
      }

      setHover(target) {
            if(target === this.hoveredAccept) return;

            if(this.hoveredAccept) {
                  this.hoveredAccept.classList.remove("TNodeAccept--hover");
                  this.callbacks.onAcceptLeave?.({node: this, target: this.hoveredAccept});
            }

            this.hoveredAccept = target;

            if(this.hoveredAccept) {
                  this.hoveredAccept.classList.add("TNodeAccept--hover");
                  this.callbacks.onAcceptEnter?.({node: this, target: this.hoveredAccept});
            }
      }

      clearHover() {
            if(!this.hoveredAccept) return;
            this.hoveredAccept.classList.remove("TNodeAccept--hover");
            this.hoveredAccept = null;
      }

      setSnap(target, point) {
            if(target !== this.snappedAccept) {
                  this.snappedAccept?.classList.remove("TNodeAccept--snap");
                  this.snappedAccept = target;
            }

            if(this.snappedAccept) {
                  this.snappedAccept.classList.add("TNodeAccept--snap");
                  this.snappedPoint = point;
            } else {
                  this.snappedPoint = null;
            }
      }

      clearSnap() {
            if(!this.snappedAccept) return;
            this.snappedAccept.classList.remove("TNodeAccept--snap");
            this.snappedAccept = null;
            this.snappedPoint = null;
      }

      /* ======================
         Geometry + line helpers
      ====================== */

      getCenter() {
            const r = this.el.getBoundingClientRect();
            return {x: r.left + r.width / 2, y: r.top + r.height / 2};
      }

      updateLines(x, y) {
            // set both lines (base + pulse) to same endpoints
            const x1 = this.startX, y1 = this.startY, x2 = x, y2 = y;

            TNode.baseLine.setAttribute("x1", x1);
            TNode.baseLine.setAttribute("y1", y1);
            TNode.baseLine.setAttribute("x2", x2);
            TNode.baseLine.setAttribute("y2", y2);

            TNode.pulseLine.setAttribute("x1", x1);
            TNode.pulseLine.setAttribute("y1", y1);
            TNode.pulseLine.setAttribute("x2", x2);
            TNode.pulseLine.setAttribute("y2", y2);
      }

      static closestPointOnRect(r, x, y) {
            return {
                  x: Math.max(r.left, Math.min(x, r.right)),
                  y: Math.max(r.top, Math.min(y, r.bottom))
            };
      }
};

/* ======================
   Default icon (your image)
   Note: replace with your full base64 if you want exact fidelity.
====================== */
TNode.DEFAULT_ICON =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAA...";