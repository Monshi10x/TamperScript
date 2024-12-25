var applyCtxScale = false;
function drawRect(ctx, xOffset, yOffset, width, height, originPoint, colour, lineWidth) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  alert("error");
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = colour;
      ctx.lineWidth = lineWidth;
      ctx.rect(localXOffset, localYOffset, width, height);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
}

function drawFillRect(ctx, xOffset, yOffset, width, height, originPoint, colour, transparency) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = transparency;
      ctx.fillStyle = colour;
      ctx.fillRect(localXOffset, localYOffset, width, height);
      //reset back to default colour, stroke, transparency
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'black';
      ctx.stroke();
}

function drawText(ctx, xOffset, yOffset, height, originPoint, text, colour) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;

      var initialFont = ctx.font;
      var intialFillColour = ctx.fillStyle;
      ctx.font = height + "px Arial Bold";
      ctx.fillStyle = colour;
      ctx.textBaseline = "hanging";
      var width = ctx.measureText(text).width;

      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (width / 2);
                  break;
            case "TR":
                  localXOffset -= width;
                  break;
            case "R":
                  localXOffset -= width;
                  localYOffset -= (height / 2);
                  break;
            case "BR":
                  localXOffset -= width;
                  localYOffset -= height;
                  break;
            case "B":
                  localXOffset -= (width / 2);
                  localYOffset -= height;
                  break;
            case "BL":
                  localYOffset -= height;
                  break;
            case "L":
                  localYOffset -= (height / 2);
                  break;
            case "M":
                  localXOffset -= (width / 2);
                  localYOffset -= (height / 2);
                  break;
            default:
                  alert("error");
                  break;
      }
      ctx.beginPath();
      ctx.fillText(text, localXOffset, localYOffset);
      ctx.stroke();
      ctx.font = initialFont;
      ctx.fillStyle = intialFillColour;
}

function drawMeasurement(ctx, xOffset, yOffset, width, height, text, isTopBottom, textOriginPoint) {
      ctx.beginPath();
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();
      if(isTopBottom) {
            ctx.moveTo(xOffset, yOffset - 50);
            ctx.lineTo(xOffset, yOffset + 50);
            ctx.stroke();
            ctx.moveTo(xOffset + 20, yOffset - 30);
            ctx.lineTo(xOffset - 20, yOffset + 30);
            ctx.stroke();
            ctx.moveTo(xOffset + width, yOffset - 50);
            ctx.lineTo(xOffset + width, yOffset + 50);
            ctx.stroke();
            ctx.moveTo(xOffset + width + 20, yOffset - 30);
            ctx.lineTo(xOffset + width - 20, yOffset + 30);
            ctx.stroke();
      }
      else {
            ctx.moveTo(xOffset - 50, yOffset);
            ctx.lineTo(xOffset + 50, yOffset);
            ctx.stroke();
            ctx.moveTo(xOffset - 30, yOffset + 20);
            ctx.lineTo(xOffset + 30, yOffset - 20);
            ctx.stroke();
            ctx.moveTo(xOffset - 50, yOffset + height);
            ctx.lineTo(xOffset + 50, yOffset + height);
            ctx.stroke();
            ctx.moveTo(xOffset - 30, yOffset + height + 20);
            ctx.lineTo(xOffset + 30, yOffset + height - 20);
            ctx.stroke();
      }

      var widthOffset = (width == 0 ? 0 : width / 2);
      var heightOffset = (height == 0 ? 0 : height / 2);
      drawText(ctx, xOffset + widthOffset, yOffset + heightOffset, 80, textOriginPoint, text, 'black');
      // ctx.font = "80px Arial";
      //ctx.fillText(parseFloat(leg.legWidth*2+frame.frameWidth_SideA-tframeOffsetX*2)+"mm", xOffset+(leg.legWidth*2+frame.frameWidth_SideA)/2+measurementTextOffset+tframeOffsetX, yOffset+measurementOffset-measurementTextOffset+minYOffset);


}

function drawMeasurement_Verbose(ctx, xOffset, yOffset, width, height, measurementOrigin, text, textSize, colour, lineWidth, crossScale, offsetFromShape, isTopBottom, textOriginPoint, scalesWithCanvas = false, canvasScale = 1) {

      if(scalesWithCanvas === false) {
            textSize = textSize / canvasScale;
            lineWidth = lineWidth / canvasScale;
            crossScale = crossScale / canvasScale;
            offsetFromShape = offsetFromShape / canvasScale;
      }

      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = colour;
      ctx.lineWidth = lineWidth;

      var widthOffset; //= (width == 0 ? offsetFromShape : width / 2);
      var heightOffset; //= (height == 0 ? offsetFromShape : height / 2);

      switch(measurementOrigin) {
            case "T":
                  xOffset += 0;
                  yOffset -= offsetFromShape;
                  break;
            case "L":
                  xOffset -= offsetFromShape;
                  yOffset += 0;
                  break;
            case "B":
                  xOffset += 0;
                  yOffset += offsetFromShape;
                  break;
            case "R":
                  xOffset += offsetFromShape;
                  yOffset += 0;
                  break;
      }



      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();

      if(isTopBottom) {
            ctx.moveTo(xOffset, yOffset - 50 * crossScale);
            ctx.lineTo(xOffset, yOffset + 50 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + 20 * crossScale, yOffset - 30 * crossScale);
            ctx.lineTo(xOffset - 20 * crossScale, yOffset + 30 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + width, yOffset - 50 * crossScale);
            ctx.lineTo(xOffset + width, yOffset + 50 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset + width + 20 * crossScale, yOffset - 30 * crossScale);
            ctx.lineTo(xOffset + width - 20 * crossScale, yOffset + 30 * crossScale);
            ctx.stroke();
      }
      else {
            ctx.moveTo(xOffset - 50 * crossScale, yOffset);
            ctx.lineTo(xOffset + 50 * crossScale, yOffset);
            ctx.stroke();
            ctx.moveTo(xOffset - 30 * crossScale, yOffset + 20 * crossScale);
            ctx.lineTo(xOffset + 30 * crossScale, yOffset - 20 * crossScale);
            ctx.stroke();
            ctx.moveTo(xOffset - 50 * crossScale, yOffset + height);
            ctx.lineTo(xOffset + 50 * crossScale, yOffset + height);
            ctx.stroke();
            ctx.moveTo(xOffset - 30 * crossScale, yOffset + height + 20 * crossScale);
            ctx.lineTo(xOffset + 30 * crossScale, yOffset + height - 20 * crossScale);
            ctx.stroke();
      }

      var widthOffset = (width == 0 ? 0 : width / 2);
      var heightOffset = (height == 0 ? 0 : height / 2);
      drawText(ctx, xOffset + widthOffset, yOffset + heightOffset, textSize, textOriginPoint, text, colour);
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
}

function drawFillCircle(ctx, xOffset, yOffset, radius, originPoint, colour, transparency) {
      var localXOffset = xOffset;
      var localYOffset = yOffset;
      if(!originPoint) originPoint = "TL";
      switch(originPoint) {
            case "TL":
                  //do nothing
                  break;
            case "T":
                  localXOffset -= (radius / 2);
                  break;
            case "TR":
                  localXOffset -= radius;
                  break;
            case "R":
                  localXOffset -= radius;
                  localYOffset -= (radius / 2);
                  break;
            case "BR":
                  localXOffset -= radius;
                  localYOffset -= radius;
                  break;
            case "B":
                  localXOffset -= (radius / 2);
                  localYOffset -= radius;
                  break;
            case "BL":
                  localYOffset -= radius;
                  break;
            case "L":
                  localYOffset -= (radius / 2);
                  break;
            case "M":
                  //localXOffset -= (radius / 2);
                  //localYOffset -= (radius / 2);
                  break;
            default:
                  break;
      }
      ctx.beginPath();
      ctx.globalAlpha = transparency;
      ctx.lineWidth = 0.1;
      ctx.fillStyle = colour;

      ctx.arc(localXOffset, localYOffset, radius, 0, 2 * Math.PI, false);
      ctx.fill();
      //reset back to default colour, stroke, transparency
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = 'black';
      ctx.stroke();
}

function drawLine_WH(ctx, xOffset, yOffset, width, height, colour, thickness, transparency, options = {stroke: null/*[5, 15]*/}) {
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.globalAlpha = transparency;
      ctx.strokeStyle = colour;
      if(options.stroke) {
            ctx.setLineDash(options.stroke);
      }
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(xOffset + width, yOffset + height);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
      if(options.stroke) {
            ctx.setLineDash([]);
      }
}

function drawLine_To(ctx, xOffset, yOffset, newPosX, newPosY, colour, thickness, transparency) {
      ctx.beginPath();
      ctx.lineWidth = thickness;
      ctx.globalAlpha = transparency;
      ctx.strokeStyle = colour;
      ctx.moveTo(xOffset, yOffset);
      ctx.lineTo(newPosX, newPosY);
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.1;
}

function drawDashGrid(ctx, xo, yo, w, h) {
      var spaceY = 50;
      w = parseFloat(w);
      h = parseFloat(h);
      var num = h / spaceY;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(xo, yo, w, h);
      ctx.globalAlpha = 1.0;
      ctx.stroke();
      for(var i = 0; i < num; i++) {
            ctx.beginPath();
            ctx.moveTo(xo, yo + i * spaceY);
            ctx.lineTo(xo + w, yo + (i + 1) * spaceY);
            ctx.stroke();
      }
}

var svg_DPI = 72;
function svg_mmToPixel(mm) {
      return (mm * svg_DPI) / 25.4;
}
function svg_pixelToMM(pixels) {
      return (pixels * 25.4) / svg_DPI;
}

function svg_getTotalPathLength_pixels(svgElement) {
      let totalPathLength = 0;
      for(let i = 0; i < svgElement.childNodes.length; i++) {
            totalPathLength += svgElement.childNodes[i].getTotalLength();
      }
      return totalPathLength;
}

function svg_getTotalPathLength_mm(svgElement) {
      let totalPathLength = 0;
      for(let i = 0; i < svgElement.childNodes.length; i++) {
            totalPathLength += svgElement.childNodes[i].getTotalLength();
      }
      return svg_pixelToMM(totalPathLength);
}

function svg_getPathLength_mm(svgElement) {
      return svg_pixelToMM(svgElement.getTotalLength());
}

function svg_getRectLength_mm(svgElement) {
      return svg_pixelToMM(svgElement.getTotalLength());
}


function addScrollToSVG(svg) {
      svg.onwheel = function(event) {
            event.preventDefault();

            // set the scaling factor (and make sure it's at least 10%)
            let scale = event.deltaY / 1000;
            scale = Math.abs(scale) < .1 ? .1 * event.deltaY / Math.abs(event.deltaY) : scale;

            // get point in SVG space
            let pt = new DOMPoint(event.clientX, event.clientY);
            pt = pt.matrixTransform(svg.getScreenCTM().inverse());

            // get viewbox transform
            let [x, y, width, height] = svg.getAttribute('viewBox').split(' ').map(Number);

            // get pt.x as a proportion of width and pt.y as proportion of height
            let [xPropW, yPropH] = [(pt.x - x) / width, (pt.y - y) / height];

            // calc new width and height, new x2, y2 (using proportions and new width and height)
            let [width2, height2] = [width + width * scale, height + height * scale];
            let x2 = pt.x - xPropW * width2;
            let y2 = pt.y - yPropH * height2;

            svg.setAttribute('viewBox', `${x2} ${y2} ${width2} ${height2}`);
      };
}

function svg_convertShapesToPaths(svgElement) {
      let svgElements = svgElement.getElementsByTagName("*");

      for(let i = 0; i < svgElements.length; i++) {
            if(svgElements[i].nodeName != "g" && svgElements[i].nodeName != "path") {
                  let newShape = SVGPathCommander.shapeToPath(svgElements[i], true);
            }
      }
      return svgElement;
}

function svg_getTotalPathLengths(svgElement) {
      let totalPathLength = 0;
      svg_convertShapesToPaths(svgElement);
      let svgElements = svgElement.getElementsByTagName("*");

      for(let i = 0; i < svgElements.length; i++) {
            if(svgElements[i].nodeName == "g") continue;

            totalPathLength += svg_getPathLength_mm(svgElements[i]);
      }
      console.log(totalPathLength);
      return totalPathLength;
}

function svg_makeElementFromString(svgString) {
      let empty = document.createElement("div");
      empty.innerHTML += svgString;

      let svgElement = empty.querySelector("svg");

      let g = document.createElementNS('http://www.w3.org/2000/svg', "g");
      g.id = "main G created by T";
      let numChildren = svgElement.children.length;

      for(let i = 0; i < numChildren; i++) {
            g.appendChild(svgElement.children[0]);
      }
      svgElement.appendChild(g);

      return svgElement;
}

function calculateAreaOfPolygon(vertices) {
      var total = 0;

      for(var i = 0, l = vertices.length; i < l; i++) {
            var addX = vertices[i].x;
            var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
            var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
            var subY = vertices[i].y;

            total += (addX * addY * 0.5);
            total -= (subX * subY * 0.5);
      }

      return Math.abs(total);
}

function convertPathToPolygon(pathElement, numberStepsPerPoint = 1) {
      var pathLen = pathElement.getTotalLength();
      //var numSteps = Math.floor(pathLen * 2);
      var numSteps = Math.floor(pathLen * numberStepsPerPoint);
      console.log("num of steps: " + numSteps);
      var points = [];
      for(var i = 0; i < numSteps; i++) {
            var p = pathElement.getPointAtLength(i * pathLen / numSteps);
            points.push(p);
      }
      console.log(points);
      return points;
}

function createPolygonFromPoints(points) {
      let newPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      let pointsStr = "";
      for(let i = 0; i < points.length; i++) {
            pointsStr += points[i].x + "," + points[i].y + " ";
      }
      newPolygon.setAttribute("points", pointsStr);
      newPolygon.style = "stroke:purple;stroke-width:0.1;fill:grey;opacity:0.3;";
      return newPolygon;
}

// returns the rectangular bounding box of the given polygon
function getPolygonBounds(polygon) {
      if(!polygon || polygon.length < 3) {
            return null;
      }

      var xmin = polygon[0].x;
      var xmax = polygon[0].x;
      var ymin = polygon[0].y;
      var ymax = polygon[0].y;

      for(var i = 1; i < polygon.length; i++) {
            if(polygon[i].x > xmax) {
                  xmax = polygon[i].x;
            }
            else if(polygon[i].x < xmin) {
                  xmin = polygon[i].x;
            }

            if(polygon[i].y > ymax) {
                  ymax = polygon[i].y;
            }
            else if(polygon[i].y < ymin) {
                  ymin = polygon[i].y;
            }
      }

      return {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin
      };
}

// return true if point is in the polygon, false if outside, and null if exactly on a point or edge
function pointInPolygon(point, polygon) {
      if(!polygon || polygon.length < 3) {
            return null;
      }

      var inside = false;
      var offsetx = polygon.offsetx || 0;
      var offsety = polygon.offsety || 0;

      for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i].x + offsetx;
            var yi = polygon[i].y + offsety;
            var xj = polygon[j].x + offsetx;
            var yj = polygon[j].y + offsety;

            if(_almostEqual(xi, point.x) && _almostEqual(yi, point.y)) {
                  return null; // no result
            }

            if(_onSegment({x: xi, y: yi}, {x: xj, y: yj}, point)) {
                  return null; // exactly on the segment
            }

            if(_almostEqual(xi, xj) && _almostEqual(yi, yj)) { // ignore very small lines
                  continue;
            }

            var intersect = ((yi > point.y) != (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if(intersect) inside = !inside;
      }

      return inside;
}

class TSVGRect {
      #x;
      set x(value) {
            this.#x = value;
            this.#element.setAttribute('x', value);
      }
      get x() {return this.#x;}

      #y;
      set y(value) {
            this.#y = value;
            this.#element.setAttribute('y', value);
      }
      get y() {return this.#y;}

      #width;
      set width(value) {
            this.#width = value;
            this.#element.setAttribute('width', value);
      }

      #height;
      set height(value) {
            this.#height = value;
            this.#element.setAttribute('height', value);
      }

      #rx;
      #ry;
      #parentToAppendTo;
      #overrideCssStyles;

      #element;
      get element() {return this.#element;}

      constructor(parentToAppendTo, overrideCssStyles, x = 0, y = 0, width = 0, height = 0, rx = 0, ry = 0) {
            this.#parentToAppendTo = parentToAppendTo;
            this.#overrideCssStyles = overrideCssStyles;
            this.#x = x;
            this.#y = y;
            this.#width = width;
            this.#height = height;
            this.#rx = rx;
            this.#ry = ry;

            this.createElement();
      }

      createElement() {
            this.#element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            this.#element.setAttribute('x', this.#x);
            this.#element.setAttribute('y', this.#y);
            this.#element.setAttribute('width', this.#width);
            this.#element.setAttribute('height', this.#height);
            this.#element.setAttribute('rx', this.#rx);
            this.#element.setAttribute('ry', this.#ry);
            this.#element.style = STYLE.SVGRect;

            if(this.#overrideCssStyles) this.#element.style.cssText += this.#overrideCssStyles;
            if(this.#parentToAppendTo) this.#parentToAppendTo.appendChild(this.#element);
      }

      Delete() {
            deleteElement(this.element);
      }
}

