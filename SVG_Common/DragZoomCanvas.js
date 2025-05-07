class DragZoomCanvas {

      #xOffset = 100;
      #yOffset = 100;

      #scale = 0.1;
      get scale() {return this.#scale;}
      set scale(value) {this.#scale = value; this.UpdateFromFields();}

      #scrollSpeed = 0.2;

      #ctxLineWidth = 3;

      #holding;

      #constrainGrabToCanvasBounds = false;

      #mouseXY = {x: 0, y: 0};

      #originToMouseOffset = {x: 0, y: 0};

      #canvas;
      get canvas() {return this.#canvas;}

      #canvasCtx;
      get canvasCtx() {this.#canvasCtx = this.canvas.getContext("2d"); return this.#canvasCtx;}

      set canvasWidth(width) {this.#canvas.width = width;}
      set canvasHeight(height) {this.#canvas.height = height;}

      #drawFunction = null;

      moveFunctionRef;
      mouseupFunctionRef;

      constructor(canvasWidth, canvasHeight, drawFunction, parentToAppendTo) {
            this.#canvas = document.createElement('canvas');
            this.#canvas.style = "z-index:2000; outline: 2px solid #000;outline-offset:-2px;display:block;box-sizing: border-box;max-width: 100%;background-color:white;";

            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.#drawFunction = drawFunction;
            parentToAppendTo.appendChild(this.#canvas);

            let self = this;
            self.moveFunctionRef = function(e) {self.onMouseMove(e);};//necessary for removeEventListener
            self.mouseupFunctionRef = function(e) {self.onMouseUp(e);};//necessary for removeEventListener

            window.addEventListener('mousemove', self.moveFunctionRef);
            $(this.#canvas).mousedown((e) => {this.onMouseDown(e);});
            window.addEventListener('mouseup', self.mouseupFunctionRef);
            this.#canvas.onwheel = (e) => this.onWheel(e);
            this.#canvas.onmouseover = (e) => this.onHoverEnter(e);
            this.#canvas.onmouseout = (e) => this.onHoverExit(e);
      }

      Close() {
            window.removeEventListener('mousemove', this.moveFunctionRef);
            window.removeEventListener('mouseup', this.mouseupFunctionRef);
      }

      onHoverEnter(e) {
            this.#canvas.style.outlineColor = COLOUR.Blue;
      }

      onHoverExit(e) {
            this.#canvas.style.outlineColor = COLOUR.Black;
      }

      onMouseMove(e) {
            this.updateMouseXY(e);

            if(this.#holding) {
                  this.resetCanvasOrigins();

                  this.#xOffset = (this.#mouseXY.x - this.#originToMouseOffset.x);
                  this.#yOffset = (this.#mouseXY.y - this.#originToMouseOffset.y);

                  this.#canvasCtx.translate(this.#xOffset, this.#yOffset);
                  this.#canvasCtx.scale(this.#scale, this.#scale);

                  this.draw();
            }
      }

      updateMouseXY(e) {
            if(this.#constrainGrabToCanvasBounds) {
                  this.#mouseXY = {
                        x: clamp(e.clientX - this.canvas.getBoundingClientRect().x, 0, this.#canvas.width),
                        y: clamp(e.clientY - this.canvas.getBoundingClientRect().y, 0, this.#canvas.height),
                  };
            } else {
                  this.#mouseXY = {
                        x: e.clientX - this.canvas.getBoundingClientRect().x,
                        y: e.clientY - this.canvas.getBoundingClientRect().y,
                  };
            }
            return this.#mouseXY;
      }

      updateOriginToMouseOffset(e) {
            if(this.#constrainGrabToCanvasBounds) {
                  this.#originToMouseOffset = {
                        x: (clamp(e.clientX - this.canvas.getBoundingClientRect().x, 0, this.#canvas.width) - this.#xOffset),
                        y: (clamp(e.clientY - this.canvas.getBoundingClientRect().y, 0, this.#canvas.height) - this.#yOffset)
                  };
            } else {
                  this.#originToMouseOffset = {
                        x: ((e.clientX - this.canvas.getBoundingClientRect().x) - this.#xOffset),
                        y: ((e.clientY - this.canvas.getBoundingClientRect().y) - this.#yOffset)
                  };
            }
            return this.#originToMouseOffset;
      }

      onMouseDown(e) {
            e.preventDefault();
            this.#canvas.style.cursor = "grabbing";
            this.#holding = true;
            this.updateMouseXY(e);
            this.updateOriginToMouseOffset(e);
      }

      onMouseUp(e) {
            this.#canvas.style.cursor = "auto";
            this.#holding = false;
      }

      onWheel(e) {
            e.preventDefault();
            this.resetCanvasOrigins();
            this.updateMouseXY(e);

            const boundingRect = this.#canvas.getBoundingClientRect();

            const xNode = (e.pageX - boundingRect.left);
            const yNode = (e.pageY - boundingRect.top);

            const oldScale = this.#scale;
            const newScale = oldScale * Math.exp(-Math.sign(e.deltaY) * this.#scrollSpeed);

            const scaleFactor = (newScale) / oldScale;

            this.#xOffset = xNode - scaleFactor * (xNode - this.#xOffset);
            this.#yOffset = yNode - scaleFactor * (yNode - this.#yOffset);
            this.#scale = newScale;

            this.updateOriginToMouseOffset(e);

            this.#xOffset = (this.#mouseXY.x - this.#originToMouseOffset.x);
            this.#yOffset = (this.#mouseXY.y - this.#originToMouseOffset.y);

            this.#canvasCtx.translate(this.#xOffset, this.#yOffset);
            this.#canvasCtx.scale(newScale, newScale);
            this.updateOriginToMouseOffset(e);

            this.draw();
      }

      resetCanvasOrigins() {
            this.canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.canvasCtx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.canvasCtx.lineWidth = this.#ctxLineWidth;
      };

      UpdateFromFields() {
            this.resetCanvasOrigins();

            this.canvasCtx.translate(this.#xOffset, this.#yOffset);
            this.canvasCtx.scale(this.#scale, this.#scale);

            this.draw();
      }

      draw() {
            if(this.#drawFunction != null) {
                  this.#drawFunction();
            } else {
                  console.log("no draw function provided");
            }
      }

}