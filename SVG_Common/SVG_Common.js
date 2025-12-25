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

/*(function svg_convertShapesToPaths(svgElement) {
      let svgElements = svgElement.getElementsByTagName("*");
      console.log(svgElements);

      for(let i = 0; i < svgElements.length; i++) {
            if(svgElements[i].nodeName != "g" && svgElements[i].nodeName != "path" && svgElements[i].nodeName != "defs" && svgElements[i].nodeName != "style") {
                  let newShape = SVGPathCommander.shapeToPath(svgElements[i], true);
            }
      }
      return svgElement;
}*/

function svg_getTotalPathLengths(svgElement) {
      let totalPathLength = 0;
      svg_convertShapesToPaths(svgElement);
      let svgElements = svgElement.getElementsByTagName("*");

      for(let i = 0; i < svgElements.length; i++) {
            if(svgElements[i].nodeName == "g" || svgElements[i].nodeName == "defs" || svgElements[i].nodeName == "style" || svgElements[i].nodeName == "text") continue;

            totalPathLength += svg_getPathLength_mm(svgElements[i]);
      }
      console.log(totalPathLength);
      return totalPathLength;
}

function svg_makeFromString(svgString) {
      let empty = document.createElement("div");
      empty.innerHTML += svgString;

      let svgElement = empty.querySelector("svg");

      let g = document.createElementNS('http://www.w3.org/2000/svg', "g");
      g.id = "mainGcreatedByT";
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

var TOL = Math.pow(10, -9); // Floating point error is likely to be above 1 epsilon

function _almostEqual(a, b, tolerance) {
      if(!tolerance) {
            tolerance = TOL;
      }
      return Math.abs(a - b) < tolerance;
}

// returns true if p lies on the line segment defined by AB, but not at any endpoints
// may need work!
function _onSegment(A, B, p, tolerance) {
      if(!tolerance) {
            tolerance = TOL;
      }

      // vertical line
      if(_almostEqual(A.x, B.x, tolerance) && _almostEqual(p.x, A.x, tolerance)) {
            if(!_almostEqual(p.y, B.y, tolerance) && !_almostEqual(p.y, A.y, tolerance) && p.y < Math.max(B.y, A.y, tolerance) && p.y > Math.min(B.y, A.y, tolerance)) {
                  return true;
            }
            else {
                  return false;
            }
      }

      // horizontal line
      if(_almostEqual(A.y, B.y, tolerance) && _almostEqual(p.y, A.y, tolerance)) {
            if(!_almostEqual(p.x, B.x, tolerance) && !_almostEqual(p.x, A.x, tolerance) && p.x < Math.max(B.x, A.x) && p.x > Math.min(B.x, A.x)) {
                  return true;
            }
            else {
                  return false;
            }
      }

      //range check
      if((p.x < A.x && p.x < B.x) || (p.x > A.x && p.x > B.x) || (p.y < A.y && p.y < B.y) || (p.y > A.y && p.y > B.y)) {
            return false;
      }


      // exclude end points
      if((_almostEqual(p.x, A.x, tolerance) && _almostEqual(p.y, A.y, tolerance)) || (_almostEqual(p.x, B.x, tolerance) && _almostEqual(p.y, B.y, tolerance))) {
            return false;
      }

      var cross = (p.y - A.y) * (B.x - A.x) - (p.x - A.x) * (B.y - A.y);

      if(Math.abs(cross) > tolerance) {
            return false;
      }

      var dot = (p.x - A.x) * (B.x - A.x) + (p.y - A.y) * (B.y - A.y);



      if(dot < 0 || _almostEqual(dot, 0, tolerance)) {
            return false;
      }

      var len2 = (B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y);



      if(dot > len2 || _almostEqual(dot, len2, tolerance)) {
            return false;
      }

      return true;
}

// return true if point is in the polygon, false if outside, and null if exactly on a point or edge
/**
 * 
 * @param {*} point {x,y}
 * @param {*} polygon [{x,y}, {x,y}, ...] 
 * @param {*} tolerance 
 * @see https://github.com/Jack000/SVGnest
 * @returns 
 */
function svgNest_pointInPolygon(point, polygon, tolerance) {
      if(!polygon || polygon.length < 3) {
            return null;
      }

      if(!tolerance) {
            tolerance = TOL;
      }

      var inside = false;
      var offsetx = polygon.offsetx || 0;
      var offsety = polygon.offsety || 0;

      for(var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i].x + offsetx;
            var yi = polygon[i].y + offsety;
            var xj = polygon[j].x + offsetx;
            var yj = polygon[j].y + offsety;

            if(_almostEqual(xi, point.x, tolerance) && _almostEqual(yi, point.y, tolerance)) {
                  return null; // no result
            }

            if(_onSegment({x: xi, y: yi}, {x: xj, y: yj}, point, tolerance)) {
                  return null; // exactly on the segment
            }

            if(_almostEqual(xi, xj, tolerance) && _almostEqual(yi, yj, tolerance)) { // ignore very small lines
                  continue;
            }

            var intersect = ((yi > point.y) != (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if(intersect) inside = !inside;
      }

      return inside;
}

/**
 * 
 * @param {*} point {x,y}
 * @param {*} precomputedPolygon - use precomputePolygon(polygon) function cached in a variable
 * @returns true or false 
 */
function gpt_isPointInPolygon(point, precomputedPolygon) {
      let {x, y} = point;
      const {polygon, constants, multiples} = precomputedPolygon;
      let inside = false;

      for(let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const yi = polygon[i].y;
            const yj = polygon[j].y;

            if((yi > y) !== (yj > y)) {
                  const xIntersect = multiples[i] * (y - yi) + polygon[i].x;
                  if(x < xIntersect) inside = !inside;
            }
      }

      return inside;
}

/**
 * 
 * @param {*} polygon [{x,y}, {x,y}, ...]
 * @returns cached polygon and calculations to avoid re-calculations, thus improving speed
 */
function gpt_precomputePolygon(polygon) {
      const constants = [];
      const multiples = [];

      for(let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const yi = polygon[i].y;
            const yj = polygon[j].y;
            const xi = polygon[i].x;
            const xj = polygon[j].x;

            if(yi === yj) {
                  constants.push(xi);
                  multiples.push(0);
            } else {
                  const c = (xi - (yi * (xj - xi)) / (yj - yi));
                  const m = (xj - xi) / (yj - yi);
                  constants.push(c);
                  multiples.push(m);
            }
      }

      return {polygon, constants, multiples};
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

async function svg_getTotalPathArea_m2(svgStringOrObject, useShallowCopy = true) {
      let svg;

      if(useShallowCopy == true && typeof (svgStringOrObject) == "string") {
            svg = svg_makeFromString(svgStringOrObject);
            svg_convertShapesToPaths(svg);
            svg_formatCompoundPaths(svg);
      } else if(useShallowCopy == false) {
            svg = svgStringOrObject;
      } else {
            console.error("cannot use parameters");
      }

      let mainGroup = svg.querySelector("#mainGcreatedByT");
      let svgElements = mainGroup.getElementsByTagName("path");

      let totalArea = 0;

      if(typeof (Worker) !== "undefined") {

            let webWorker = new Worker(GM_getResourceURL("SVGWebWorker"));
            let webWorkerFinished = false;

            let elementDs = [];
            let innerPathElements = [];
            for(let i = 0; i < svgElements.length; i++) {
                  elementDs.push(svgElements[i].getAttribute("d"));
                  innerPathElements.push(svgElements[i].classList.contains("innerPath"));
            }

            webWorker.postMessage({
                  elementDs: elementDs,
                  innerPathElements: innerPathElements
            });
            webWorker.onmessage = async function(event) {
                  if(event.data.totalArea) totalArea = event.data.totalArea;
                  if(event.data.shapeAreas) {

                        for(let i = 0; i < svgElements.length; i++) {
                              svgElements[i].setAttribute("data-area", event.data.shapeAreas[i]);
                        }

                  }
                  console.log("%cWEB WORKER DATA AREAS", "background-color:yellow; color:black;");
                  console.log(event.data);
                  webWorker.terminate();
                  webWorkerFinished = true;
            };

            await LoopUntil(() => {if(webWorkerFinished == true) return true; else return false;});
            return totalArea;
      } else {
            console.error("window disabled worker :(");
      }
}

function svg_getTotalSize(svgStringOrObject, useShallowCopy = true) {
      let newSvg;
      if(useShallowCopy == true && typeof (svgStringOrObject) == "string") {
            newSvg = svg_makeFromString(svgStringOrObject);

            svg_convertShapesToPaths(newSvg);
            svg_formatCompoundPaths(newSvg);

            document.body.appendChild(newSvg);
            newSvg.style = "display:block;visibility:hidden";

            svgStringOrObject = newSvg.querySelector("#pathGroup").querySelectorAll(".outerPath");
      } else {
            newSvg = svgStringOrObject;
      }

      let pathGroup = newSvg.querySelector("#pathGroup");

      let totalSize = {width: 0, height: 0};
      if(pathGroup) totalSize = {width: svg_pixelToMM(pathGroup.getBBox().width), height: svg_pixelToMM(pathGroup.getBBox().height)};

      if(newSvg) deleteElement(newSvg);

      return totalSize;
}

function svg_getTotalBoundingRectAreas_m2(svgStringOrObject, useShallowCopy = true) {
      let newSvg;
      if(useShallowCopy == true && typeof (svgStringOrObject) == "string") {
            newSvg = svg_makeFromString(svgStringOrObject);

            svg_convertShapesToPaths(newSvg);
            svg_formatCompoundPaths(newSvg);

            document.body.appendChild(newSvg);
            newSvg.style = "display:block;visibility:hidden";

            svgStringOrObject = newSvg.querySelector("#pathGroup").querySelectorAll(".outerPath");
      } else {
            newSvg = svgStringOrObject;
      }

      let totalArea = 0;

      for(let i = 0; i < svgStringOrObject.length; i++) {
            if(svgStringOrObject[i].nodeName == "g" || svgStringOrObject[i].nodeName == "defs" || svgStringOrObject[i].nodeName == "style" || svgStringOrObject[i].nodeName == "text") continue;

            let element = svgStringOrObject[i];

            let boundingBox = element.getBBox();

            let elementWidth_mm = svg_pixelToMM(boundingBox.width);
            let elementHeight_mm = svg_pixelToMM(boundingBox.height);

            totalArea += elementWidth_mm * elementHeight_mm;
      }

      totalArea /= 1000000;

      console.log(newSvg);
      // if(newSvg) deleteElement(newSvg);

      return totalArea;
}

function svg_getPathQty(svgStringOrObject) {
      let newSvg;
      let useShallowCopy = true;
      if(useShallowCopy == true && typeof (svgStringOrObject) == "string") {
            newSvg = svg_makeFromString(svgStringOrObject);

            svg_convertShapesToPaths(newSvg);
            svg_formatCompoundPaths(newSvg);

            document.body.appendChild(newSvg);
            newSvg.style = "display:block;visibility:hidden";

            svgStringOrObject = newSvg.querySelector("#pathGroup").getElementsByTagNameNS("http://www.w3.org/2000/svg", "path");
      } else {
            newSvg = svgStringOrObject;
      }

      let returnObject = {
            totalQty: 0,
            innerPaths: 0,
            outerPaths: 0
      };

      for(let i = 0; i < svgStringOrObject.length; i++) {
            if(svgStringOrObject[i].nodeName == "g" || svgStringOrObject[i].nodeName == "defs" || svgStringOrObject[i].nodeName == "style" || svgStringOrObject[i].nodeName == "text") continue;

            let element = svgStringOrObject[i];

            if(element.className.baseVal.includes("outerPath")) returnObject.outerPaths++;
            if(element.className.baseVal.includes("innerPath")) returnObject.innerPaths++;

            returnObject.totalQty++;
      }

      if(newSvg) deleteElement(newSvg);

      return returnObject;
}

function svg_convertShapesToPaths(svgObject) {
      let svgElements = svgObject.getElementsByTagName("*");
      let supportedTypes = ['rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'];

      for(let i = 0; i < svgElements.length; i++) {
            if(!supportedTypes.includes(svgElements[i].nodeName)) continue;

            let newShape = SVGPathCommander.shapeToPath(svgElements[i], /*transferAllAttributes*/true);
      }

      return svgObject;
}

function svg_formatCompoundPaths(svgObject) {

      let mainGroup = svgObject.querySelector("#mainGcreatedByT");
      let pathGroup = svgObject.querySelector("#pathGroup");

      if(!pathGroup) {
            pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            pathGroup.id = "pathGroup";
            mainGroup.appendChild(pathGroup);
      }

      let svgElements = Array.from(mainGroup.getElementsByTagName("path"));

      //format outer/inner paths
      for(let i = svgElements.length - 1; i >= 0; i--) {

            let pathClass = svgElements[i].classList;

            if(pathClass.contains("innerPath") || pathClass.contains("outerPath")) continue;

            let pathString = svgElements[i].getAttribute("d");
            let pathStringSplitOverZ = pathString.split("Z");

            //Shape Group:
            let newPathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            newPathGroup.id = "newPathGroup";
            pathGroup.appendChild(newPathGroup);

            let outerPathParent_id;
            for(let j = 0; j < pathStringSplitOverZ.length; j++) {
                  if(pathStringSplitOverZ[j] == "") continue;

                  //Outer Compound
                  if(j == 0 && !pathClass.contains("innerPath")) {
                        let outerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        outerPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                        outerPathElement.style = "stroke:green;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:#eee;";
                        outerPathElement.className.baseVal = "outerPath";
                        outerPathParent_id = generateUniqueID("outerPath-");
                        outerPathElement.id = outerPathParent_id;
                        newPathGroup.appendChild(outerPathElement);
                  }
                  //if has Inner compound paths
                  else {
                        let innerPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        innerPathElement.setAttribute("d", pathStringSplitOverZ[j] + "Z");
                        innerPathElement.style = "stroke:red;stroke-width:" + (2 / this.scale) + ";" + "opacity:1;fill:#fff;";
                        innerPathElement.className.baseVal = "innerPath";
                        innerPathElement.setAttribute("data-outerPathParent", outerPathParent_id);
                        newPathGroup.appendChild(innerPathElement);
                  }
            }

            //remove previous unformatted elements
            deleteElement(svgElements[i]);
            svgElements.splice(i, 1);
      }

      //Delete Un-used <g>
      mainGroup.querySelectorAll('g:not([id])').forEach(group => {
            deleteElement(group);
      });

      return svgObject;
}

const SummarizePathString = (function() {
      const
            regSplit = /([\+\-.0-9]+)|\s*[\s,]\s*/
            , isLowerCase = str => /^[a-z]*$/.test(str)
            , codPath =
            {
                  M: ['x', 'y']
                  , L: ['x', 'y']
                  , H: ['x']
                  , V: ['y']
                  , Z: []
                  , C: ['x1', 'y1', 'x2', 'y2', 'x', 'y']
                  , S: ['x2', 'y2', 'x', 'y']
                  , Q: ['x1', 'y1', 'x', 'y']
                  , T: ['x', 'y']
                  , A: ['rX', 'rY', 'rotation', 'arc', 'sweep', 'x', 'y']
            };
      return function(pathStr) {
            let
                  res = []
                  , arr = pathStr.split(regSplit).filter(Boolean)
                  , relativ = false
                  ;
            for(let i = 0; i < arr.length;) {
                  let cmd = isNaN(arr[i]) ? arr[i++] : relativ ? 'l' : 'L';
                  relativ = isLowerCase(cmd);
                  res.push(codPath[cmd.toUpperCase()].reduce((a, c) => {a[c] = Number(arr[i++]); return a;}, {cmd}));
            }
            return res;
      };
})();

class TSVGRectangle {

      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            this.patternId = `pattern-${Math.random().toString(36).substr(2, 8)}`;

            this.options = {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 50,
                  rx: 0,
                  ry: 0,
                  miter: 40,
                  miterSides: [],
                  fill: 'blue',
                  stroke: 'black',
                  strokeWidth: 1,
                  origin: 'top-left',
                  usePattern: false,
                  patternType: 'hatch45',// Available patternType values: 'hatch45', 'hatchHorizontal', 'hatchVertical', 'soil'
                  hatchFill: 'none',
                  hatchLineColor: 'black',
                  hatchLineWidth: 4,
                  hatchSpacing: 20,
                  ...options
            };

            if(this.options.usePattern) {
                  const fillColor = this.options.hatchFill === 'none'
                        ? this.options.fill
                        : this.options.hatchFill;
                  this.ensurePattern(fillColor);
                  this.options.fill = `url(#${this.patternId})`;
            }

            this.rect = this.createRectangle();
      }

      camelToKebab(str) {
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      }

      ensurePattern(hatchFill) {
            const svgNS = 'http://www.w3.org/2000/svg';
            this.defs = document.createElementNS(svgNS, 'defs');

            let pattern;
            switch(this.options.patternType) {
                  case 'hatchHorizontal':
                        pattern = this.createHatchHorizontalPattern(svgNS, hatchFill);
                        break;
                  case 'hatchVertical':
                        pattern = this.createHatchVerticalPattern(svgNS, hatchFill);
                        break;
                  case 'soil':
                        pattern = this.createSoilPattern(svgNS, hatchFill);
                        break;
                  case 'hatch45':
                  default:
                        pattern = this.createHatch45Pattern(svgNS, hatchFill);
            }

            this.defs.appendChild(pattern);
            const svg = this.parentToAppendTo.closest('svg');
            if(svg) svg.insertBefore(this.defs, svg.firstChild);
      }

      createHatch45Pattern(svgNS, hatchFill) {
            const spacing = this.options.hatchSpacing;
            const pattern = document.createElementNS(svgNS, 'pattern');
            pattern.setAttribute('id', this.patternId);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', spacing);
            pattern.setAttribute('height', spacing);
            pattern.setAttribute('patternTransform', 'rotate(45)');

            const background = document.createElementNS(svgNS, 'rect');
            background.setAttribute('width', spacing);
            background.setAttribute('height', spacing);
            background.setAttribute('fill', hatchFill);
            pattern.appendChild(background);

            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', '0');
            line.setAttribute('y2', spacing);
            line.setAttribute('stroke', this.options.hatchLineColor);
            line.setAttribute('stroke-width', this.options.hatchLineWidth);
            pattern.appendChild(line);

            return pattern;
      }

      createHatchHorizontalPattern(svgNS, hatchFill) {
            const spacing = this.options.hatchSpacing;
            const pattern = document.createElementNS(svgNS, 'pattern');
            pattern.setAttribute('id', this.patternId);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', spacing);
            pattern.setAttribute('height', spacing);

            const background = document.createElementNS(svgNS, 'rect');
            background.setAttribute('width', spacing);
            background.setAttribute('height', spacing);
            background.setAttribute('fill', hatchFill);
            pattern.appendChild(background);

            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', spacing);
            line.setAttribute('y2', '0');
            line.setAttribute('stroke', this.options.hatchLineColor);
            line.setAttribute('stroke-width', this.options.hatchLineWidth);
            pattern.appendChild(line);

            return pattern;
      }

      createHatchVerticalPattern(svgNS, hatchFill) {
            const spacing = this.options.hatchSpacing;
            const pattern = document.createElementNS(svgNS, 'pattern');
            pattern.setAttribute('id', this.patternId);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', spacing);
            pattern.setAttribute('height', spacing);

            const background = document.createElementNS(svgNS, 'rect');
            background.setAttribute('width', spacing);
            background.setAttribute('height', spacing);
            background.setAttribute('fill', hatchFill);
            pattern.appendChild(background);

            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', '0');
            line.setAttribute('y2', spacing);
            line.setAttribute('stroke', this.options.hatchLineColor);
            line.setAttribute('stroke-width', this.options.hatchLineWidth);
            pattern.appendChild(line);

            return pattern;
      }

      createSoilPattern(svgNS, hatchFill) {
            const patternSize = 240;
            const pattern = document.createElementNS(svgNS, 'pattern');
            pattern.setAttribute('id', this.patternId);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', patternSize);
            pattern.setAttribute('height', patternSize);

            const background = document.createElementNS(svgNS, 'rect');
            background.setAttribute('width', patternSize);
            background.setAttribute('height', patternSize);
            background.setAttribute('fill', hatchFill);
            pattern.appendChild(background);

            const specks = [
                  {cx: 36, cy: 60, r: 9.6},
                  {cx: 180, cy: 84, r: 12},
                  {cx: 120, cy: 180, r: 7.2},
                  {cx: 72, cy: 132, r: 8.4},
                  {cx: 216, cy: 216, r: 6}
            ];
            specks.forEach(s => {
                  const dot = document.createElementNS(svgNS, 'circle');
                  dot.setAttribute('cx', s.cx);
                  dot.setAttribute('cy', s.cy);
                  dot.setAttribute('r', s.r);
                  dot.setAttribute('fill', this.options.hatchLineColor);
                  pattern.appendChild(dot);
            });

            return pattern;
      }

      adjustCoordinatesForOrigin(x, y, width, height, origin) {
            switch(origin) {
                  case 'TL': case 'top-left': return {x, y};
                  case 'T': case 'top-middle': return {x: x - width / 2, y};
                  case 'TR': case 'top-right': return {x: x - width, y};
                  case 'L': case 'center-left': return {x, y: y - height / 2};
                  case 'M': case 'center': return {x: x - width / 2, y: y - height / 2};
                  case 'R': case 'center-right': return {x: x - width, y: y - height / 2};
                  case 'BL': case 'bottom-left': return {x, y: y - height};
                  case 'B': case 'bottom-middle': return {x: x - width / 2, y: y - height};
                  case 'BR': case 'bottom-right': return {x: x - width, y: y - height};
                  default: return {x, y};
            }
      }

      createRectangle() {
            const svgNS = 'http://www.w3.org/2000/svg';
            let rect = document.createElementNS(svgNS, 'rect');
            if(this.options.miter && this.options.miterSides.length > 0) {
                  rect = document.createElementNS(svgNS, 'polygon');
            }

            const {x, y, width, height, origin, ...attrs} = this.options;
            const adjusted = this.adjustCoordinatesForOrigin(x, y, width, height, origin);
            const has = side => this.options.miterSides.includes(side);
            const miter = this.options.miter;
            const points = [];

            if(has('top-left')) {
                  points.push([adjusted.x, adjusted.y + miter]);
                  points.push([adjusted.x + miter, adjusted.y]);
            } else {
                  points.push([adjusted.x, adjusted.y]);
            }
            if(has('top-right')) {
                  points.push([adjusted.x + width - miter, adjusted.y]);
                  points.push([adjusted.x + width, adjusted.y + miter]);
            } else {
                  points.push([adjusted.x + width, adjusted.y]);
            }
            if(has('bottom-right')) {
                  points.push([adjusted.x + width, adjusted.y + height - miter]);
                  points.push([adjusted.x + width - miter, adjusted.y + height]);
            } else {
                  points.push([adjusted.x + width, adjusted.y + height]);
            }
            if(has('bottom-left')) {
                  points.push([adjusted.x + miter, adjusted.y + height]);
                  points.push([adjusted.x, adjusted.y + height - miter]);
            } else {
                  points.push([adjusted.x, adjusted.y + height]);
            }

            if(rect.tagName === 'polygon') {
                  rect.setAttribute('points', points.map(p => p.join(',')).join(' '));
            } else {
                  rect.setAttribute('x', adjusted.x);
                  rect.setAttribute('y', adjusted.y);
                  rect.setAttribute('width', width);
                  rect.setAttribute('height', height);
            }

            for(const key in attrs) {
                  if(key !== 'origin') {
                        rect.setAttribute(this.camelToKebab(key), attrs[key]);
                  }
            }

            this.parentToAppendTo.appendChild(rect);
            return rect;
      }

      updateAttributes(newOptions = {}) {
            Object.assign(this.options, newOptions);
            if(this.options.usePattern) {
                  const fillColor = this.options.hatchFill === 'none'
                        ? this.options.fill
                        : this.options.hatchFill;
                  this.ensurePattern(fillColor);
                  this.options.fill = `url(#${this.patternId})`;
            }

            const {x, y, width, height, origin} = this.options;
            const adjusted = this.adjustCoordinatesForOrigin(x, y, width, height, origin);
            const has = side => this.options.miterSides.includes(side);
            const miter = this.options.miter;
            const points = [];

            if(has('top-left')) {
                  points.push([adjusted.x, adjusted.y + miter]);
                  points.push([adjusted.x + miter, adjusted.y]);
            } else {
                  points.push([adjusted.x, adjusted.y]);
            }
            if(has('top-right')) {
                  points.push([adjusted.x + width - miter, adjusted.y]);
                  points.push([adjusted.x + width, adjusted.y + miter]);
            } else {
                  points.push([adjusted.x + width, adjusted.y]);
            }
            if(has('bottom-right')) {
                  points.push([adjusted.x + width, adjusted.y + height - miter]);
                  points.push([adjusted.x + width - miter, adjusted.y + height]);
            } else {
                  points.push([adjusted.x + width, adjusted.y + height]);
            }
            if(has('bottom-left')) {
                  points.push([adjusted.x + miter, adjusted.y + height]);
                  points.push([adjusted.x, adjusted.y + height - miter]);
            } else {
                  points.push([adjusted.x, adjusted.y + height]);
            }

            if(this.rect.tagName === 'polygon') {
                  this.rect.setAttribute('points', points.map(p => p.join(',')).join(' '));
            } else {
                  this.rect.setAttribute('x', adjusted.x);
                  this.rect.setAttribute('y', adjusted.y);
                  this.rect.setAttribute('width', width);
                  this.rect.setAttribute('height', height);
            }

            for(const key in newOptions) {
                  if(!['x', 'y', 'width', 'height', 'origin'].includes(key)) {
                        this.rect.setAttribute(this.camelToKebab(key), newOptions[key]);
                  }
            }
      }

      getAttribute(attr) {
            return this.rect.getAttribute(attr);
      }

      setAttribute(attr, value) {
            this.options[attr] = value;
            if(['x', 'y', 'width', 'height', 'origin', 'miter', 'miterSides', 'usePattern', 'hatchFill', 'hatchLineColor', 'hatchLineWidth', 'hatchSpacing', 'patternType'].includes(attr)) {
                  this.updateAttributes({});
            } else {
                  this.rect.setAttribute(this.camelToKebab(attr), value);
            }
      }

      Delete() {
            if(this.rect?.parentNode) {
                  this.rect.parentNode.removeChild(this.rect);
            }
            if(this.defs?.parentNode) {
                  this.defs.parentNode.removeChild(this.defs);
            }
      }
}






class TSVGLine {
      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            this.options = {
                  x1: 0,
                  y1: 0,
                  x2: 100,
                  y2: 100,
                  stroke: 'black',
                  strokeWidth: 2,
                  ...options // Override defaults with user options
            };
            if(this.options.width) this.options.x2 += this.options.width;
            if(this.options.height) this.options.y2 += this.options.height;

            this.line = this.createLine();
      }

      createLine() {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

            for(const key in this.options) {
                  line.setAttribute(key, this.options[key]);
            }

            this.parentToAppendTo.appendChild(line);
            return line;
      }

      updateAttributes(newOptions = {}) {
            Object.assign(this.options, newOptions);
            for(const key in newOptions) {
                  this.line.setAttribute(key, newOptions[key]);
            }
      }

      getAttribute(attr) {
            return this.line.getAttribute(attr);
      }

      setAttribute(attr, value) {
            this.options[attr] = value;
            this.line.setAttribute(attr, value);
      }

      Delete() {
            deleteElement(this.line);
      }
}

class TSVGCircle {
      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            this.hatchId = `hatch45-${Math.random().toString(36).substr(2, 8)}`; // Unique hatch ID

            this.options = {
                  cx: 50,
                  cy: 50,
                  r: 25,
                  stroke: 'black',
                  strokeWidth: 2,
                  fill: 'blue',
                  origin: 'center',
                  usePattern: false,
                  hatchFill: 'none',
                  hatchLineColor: 'black',
                  hatchLineWidth: 4,
                  hatchSpacing: 20,
                  ...options
            };

            if(this.options.usePattern) {
                  this.ensureHatchPattern(this.options.hatchFill === 'none' ? this.options.fill : this.options.hatchFill);
                  this.options.fill = `url(#${this.hatchId})`;
            }

            this.circle = this.createCircle();
      }

      ensureHatchPattern(hatchFill) {
            const spacing = this.options.hatchSpacing || 10;
            const svgNS = 'http://www.w3.org/2000/svg';
            this.defs = document.createElementNS(svgNS, 'defs');
            const pattern = document.createElementNS(svgNS, 'pattern');
            pattern.setAttribute('id', this.hatchId);
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');
            pattern.setAttribute('width', spacing);
            pattern.setAttribute('height', spacing);
            pattern.setAttribute('patternTransform', 'rotate(45)');

            const background = document.createElementNS(svgNS, 'rect');
            background.setAttribute('width', spacing);
            background.setAttribute('height', spacing);
            background.setAttribute('fill', hatchFill || 'none');

            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', '0');
            line.setAttribute('x2', '0');
            line.setAttribute('y2', spacing);
            line.setAttribute('stroke', this.options.hatchLineColor);
            line.setAttribute('stroke-width', this.options.hatchLineWidth);

            pattern.appendChild(background);
            pattern.appendChild(line);
            this.defs.appendChild(pattern);

            const svg = this.parentToAppendTo.closest('svg');
            if(svg) svg.insertBefore(this.defs, svg.firstChild);
      }

      adjustCoordinatesForOrigin(cx, cy, origin) {
            switch(origin) {
                  case "TL": case 'top-left': return {cx, cy};
                  case "T": case 'top-middle': return {cx, cy};
                  case "TR": case 'top-right': return {cx, cy};
                  case "L": case 'center-left': return {cx, cy};
                  case "M": case 'center': return {cx, cy};
                  case "R": case 'center-right': return {cx, cy};
                  case "BL": case 'bottom-left': return {cx, cy};
                  case "B": case 'bottom-middle': return {cx, cy};
                  case "BR": case 'bottom-right': return {cx, cy};
                  default: return {cx, cy};
            }
      }

      createCircle() {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const {cx, cy, origin, ...attrs} = this.options;
            const adjusted = this.adjustCoordinatesForOrigin(cx, cy, origin);

            circle.setAttribute('cx', adjusted.cx);
            circle.setAttribute('cy', adjusted.cy);

            for(const key in attrs) {
                  if(key !== 'origin') circle.setAttribute(key, attrs[key]);
            }

            this.parentToAppendTo.appendChild(circle);
            return circle;
      }

      updateAttributes(newOptions = {}) {
            Object.assign(this.options, newOptions);

            if(this.options.usePattern) {
                  this.ensureHatchPattern(this.options.hatchFill === 'none' ? this.options.fill : this.options.hatchFill);
                  this.options.fill = `url(#${this.hatchId})`;
            }

            const {cx, cy, origin} = this.options;
            const adjusted = this.adjustCoordinatesForOrigin(cx, cy, origin);

            this.circle.setAttribute('cx', adjusted.cx);
            this.circle.setAttribute('cy', adjusted.cy);

            for(const key in this.options) {
                  if(!['cx', 'cy', 'origin'].includes(key)) {
                        this.circle.setAttribute(key, this.options[key]);
                  }
            }
      }

      getAttribute(attr) {
            return this.circle.getAttribute(attr);
      }

      setAttribute(attr, value) {
            this.options[attr] = value;
            if(['cx', 'cy', 'origin', 'usePattern', 'hatchFill', 'hatchLineColor', 'hatchLineWidth', 'hatchSpacing'].includes(attr)) {
                  this.updateAttributes({});
            } else {
                  this.circle.setAttribute(attr, value);
            }
      }

      Delete() {
            if(this.circle?.parentNode) {
                  this.circle.parentNode.removeChild(this.circle);
            }
            if(this.defs?.parentNode) {
                  this.defs.parentNode.removeChild(this.defs);
            }
      }
}


class TSVGEllipse {
      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            this.options = {
                  cx: 50,
                  cy: 50,
                  rx: 40,
                  ry: 20,
                  fill: 'blue',
                  stroke: 'black',
                  strokeWidth: 2,
                  ...options // Override defaults with user options
            };

            this.ellipse = this.createEllipse();
      }

      createEllipse() {
            const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');

            for(const key in this.options) {
                  ellipse.setAttribute(key, this.options[key]);
            }

            this.parentToAppendTo.appendChild(ellipse);
            return ellipse;
      }

      updateAttributes(newOptions = {}) {
            Object.assign(this.options, newOptions);
            for(const key in newOptions) {
                  this.ellipse.setAttribute(key, newOptions[key]);
            }
      }

      getAttribute(attr) {
            return this.ellipse.getAttribute(attr);
      }

      setAttribute(attr, value) {
            this.options[attr] = value;
            this.ellipse.setAttribute(attr, value);
      }

      Delete() {
            deleteElement(this.ellipse);
      }
}

class TSVGPolygon {
      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            this.options = {
                  points: [], // Array of {x, y} objects
                  fill: 'blue',
                  stroke: 'black',
                  strokeWidth: 2,
                  ...options // Override defaults with user options
            };
            this.polygon = this.createPolygon();
      }

      createPolygon() {
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            this.updateAttributes(this.options);
            this.parentToAppendTo.appendChild(polygon);
            return polygon;
      }

      updateAttributes(newOptions = {}) {
            if(newOptions.points) {
                  newOptions.points = newOptions.points.map(point => `${point.x},${point.y}`).join(" ");
            }
            Object.assign(this.options, newOptions);
            for(const key in newOptions) {
                  this.polygon.setAttribute(key, newOptions[key]);
            }
      }

      getAttribute(attr) {
            if(attr === 'points') {
                  return this.options.points.split(" ").map(point => {
                        const [x, y] = point.split(",").map(Number);
                        return {x, y};
                  });
            }
            return this.polygon.getAttribute(attr);
      }

      setAttribute(attr, value) {
            if(attr === 'points') {
                  value = value.map(point => `${point.x},${point.y}`).join(" ");
            }
            this.options[attr] = value;
            this.polygon.setAttribute(attr, value);
      }

      Delete() {
            deleteElement(this.polygon);
      }
}

class TSVGText {
      constructor(parentToAppendTo, options = {}) {
            this.parentToAppendTo = parentToAppendTo;
            // Updated default options. The "anchor" option now drives both horizontal and vertical alignment.
            this.options = {
                  x: 0,
                  y: 0,
                  text: '',
                  fontSize: '16px',
                  fill: 'black',
                  anchor: "middle", // Default anchor set to center middle
                  ...options // Override defaults with user options
            };
            this.textElement = this.createText();
            // If an anchor is provided, update the text element accordingly.
            if(this.options.anchor) {
                  this.setAnchor(this.options.anchor);
            }
      }

      createText() {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            // Set basic attributes first.
            this.updateAttributes(this.options);
            text.textContent = this.options.text;
            this.parentToAppendTo.appendChild(text);
            return text;
      }

      updateAttributes(newOptions = {}) {
            Object.assign(this.options, newOptions);
            for(const key in newOptions) {
                  this.textElement.setAttribute(key, newOptions[key]);
            }
      }

      getAttribute(attr) {
            return this.textElement.getAttribute(attr);
      }

      setAttribute(attr, value) {
            this.options[attr] = value;
            this.textElement.setAttribute(attr, value);
      }

      /**
       * setAnchor(anchor)
       * Allows the user to set the text anchor using strings such as "top", "left", "bottom", "right",
       * or compound strings like "top left", "bottom right", etc.
       */
      setAnchor(anchor) {
            this.options.anchor = anchor;
            // Split the input into words and standardize to lowercase.
            const words = anchor.toLowerCase().split(" ");
            let horizontal = null;
            let vertical = null;

            if(words.length === 1) {
                  // If only one word is provided, decide based on the word:
                  if(["left", "right", "center"].includes(words[0])) {
                        horizontal = words[0];
                        vertical = "middle"; // default vertical alignment
                  } else if(["top", "bottom"].includes(words[0])) {
                        vertical = words[0];
                        horizontal = "center"; // default horizontal alignment
                  } else {
                        // Fallback to center if unrecognized.
                        horizontal = "center";
                        vertical = "middle";
                  }
            } else {
                  // If two words are provided, check for a vertical word.
                  if(["top", "bottom"].includes(words[0])) {
                        vertical = words[0];
                        horizontal = words[1];
                  } else {
                        horizontal = words[0];
                        vertical = words[1];
                  }
            }

            // Map horizontal alignment to SVG text-anchor values.
            let textAnchorValue;
            switch(horizontal) {
                  case "left":
                        textAnchorValue = "start";
                        break;
                  case "right":
                        textAnchorValue = "end";
                        break;
                  default:
                        textAnchorValue = "middle";
            }

            // Map vertical alignment to SVG dominant-baseline values.
            let dominantBaselineValue;
            switch(vertical) {
                  case "top":
                        dominantBaselineValue = "hanging";
                        break;
                  case "bottom":
                        dominantBaselineValue = "baseline";
                        break;
                  default:
                        dominantBaselineValue = "middle";
            }

            // Update the text element with the computed anchor values.
            this.setAttribute("text-anchor", textAnchorValue);
            this.setAttribute("dominant-baseline", dominantBaselineValue);
      }
}

function getRandomPointsInPath(pathElement, numberOfPoints) {
      if(!(pathElement instanceof SVGPathElement)) {
            throw new Error("Expected an SVGPathElement");
      }

      const bbox = pathElement.getBBox();
      const pathLength = pathElement.getTotalLength();
      const points = [];

      const canvas = document.createElement("canvas");
      canvas.width = bbox.width;
      canvas.height = bbox.height;
      const ctx = canvas.getContext("2d");

      // Convert SVG path to canvas path
      const path2d = new Path2D(pathElement.getAttribute("d"));

      let attempts = 0;
      const maxAttempts = numberOfPoints * 100;

      while(points.length < numberOfPoints && attempts < maxAttempts) {
            const x = bbox.x + Math.random() * bbox.width;
            const y = bbox.y + Math.random() * bbox.height;
            if(ctx.isPointInPath(path2d, x, y)) {
                  points.push({x, y});
            }
            attempts++;
      }

      if(points.length < numberOfPoints) {
            console.warn(`Only found ${points.length} points after ${attempts} attempts`);
      }

      return points;
}

class TSVGMeasurement {
      static idCounter = 0;

      constructor(svgElement, options = {}) {
            if(!(svgElement instanceof SVGElement)) {
                  throw new Error("First argument must be an SVG element.");
            }

            this.svgElement = svgElement;
            this.subMeasures = [];

            const {
                  x1, y1, x2, y2,
                  target,
                  direction = "both",
                  sides = [],
                  autoLabel = false,
                  unit = "mm",
                  scale = 1,
                  precision = 0,
                  arrowSize = 30,
                  textOffset = 100,
                  stroke = "#000",
                  lineWidth = 1,
                  fontSize = "12px",
                  tickLength = 100,
                  handleRadius = 8,
                  offsetX = 0,
                  offsetY = 0,
                  sideHint = null
            } = options;

            this.sideHint = sideHint;

            if(target instanceof SVGGraphicsElement) {
                  const bbox = target.getBBox();

                  const apply = (cond, x1, y1, x2, y2, sideHint) => {
                        if(cond) {
                              this.subMeasures.push(new TSVGMeasurement(svgElement, {
                                    x1, y1, x2, y2,
                                    autoLabel, unit, scale, precision,
                                    arrowSize, textOffset, stroke, fontSize,
                                    tickLength, handleRadius, lineWidth,
                                    sideHint
                              }));
                        }
                  };

                  const useSides = sides.length > 0;
                  const doWidth = direction === "width" || direction === "both";
                  const doHeight = direction === "height" || direction === "both";

                  apply(useSides ? sides.includes("top") : doWidth,
                        bbox.x, bbox.y - offsetY, bbox.x + bbox.width, bbox.y - offsetY, 'top');

                  apply(useSides ? sides.includes("bottom") : doWidth,
                        bbox.x, bbox.y + bbox.height + offsetY, bbox.x + bbox.width, bbox.y + bbox.height + offsetY, 'bottom');

                  apply(useSides ? sides.includes("left") : doHeight,
                        bbox.x - offsetX, bbox.y, bbox.x - offsetX, bbox.y + bbox.height, 'left');

                  apply(useSides ? sides.includes("right") : doHeight,
                        bbox.x + bbox.width + offsetX, bbox.y, bbox.x + bbox.width + offsetX, bbox.y + bbox.height, 'right');

                  return;
            }

            this.x1 = x1 + offsetX;
            this.y1 = y1 + offsetY;
            this.x2 = x2 + offsetX;
            this.y2 = y2 + offsetY;
            this.text = options.text ?? null;

            this.autoLabel = autoLabel;
            this.unit = unit;
            this.scale = scale;
            this.precision = precision;
            this.arrowSize = arrowSize;
            this.textOffset = textOffset;
            this.stroke = stroke;
            this.lineWidth = lineWidth;
            this.fontSize = fontSize;
            this.tickLength = tickLength;
            this.handleRadius = handleRadius;

            this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");

            this.createElements();
            this.svgElement.appendChild(this.group);
            this.update();
      }

      createSVGElement(type, attributes = {}) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", type);
            for(const [key, value] of Object.entries(attributes)) {
                  el.setAttribute(key, value);
            }
            return el;
      }

      createElements() {
            this.line = this.createSVGElement("line", {
                  stroke: this.stroke,
                  "stroke-width": this.lineWidth
            });

            this.arrowHead1 = this.createSVGElement("path", {fill: this.stroke});
            this.arrowHead2 = this.createSVGElement("path", {fill: this.stroke});

            this.tick1 = this.createSVGElement("line", {stroke: this.stroke, "stroke-width": this.lineWidth});
            this.tick2 = this.createSVGElement("line", {stroke: this.stroke, "stroke-width": this.lineWidth});

            this.label = this.createSVGElement("text", {
                  fill: this.stroke,
                  "font-size": this.fontSize,
                  "text-anchor": this.getTextAnchor(),
                  "alignment-baseline": this.getAlignmentBaseline(),
            });

            this.group.append(this.line, this.arrowHead1, this.arrowHead2, this.tick1, this.tick2, this.label);
      }

      getTextAnchor() {
            return 'middle';
      }

      getAlignmentBaseline() {
            switch(this.sideHint) {
                  case 'top': return 'baseline';
                  case 'bottom': return 'hanging';
                  default: return 'baseline';
            }
      }

      getSmartOffset(dx, dy) {
            const length = Math.sqrt(dx * dx + dy * dy);
            if(length === 0) return [0, 0];
            const px = -dy / length;
            const py = dx / length;

            switch(this.sideHint) {
                  case 'top': return [-px * this.textOffset, -py * this.textOffset];
                  case 'bottom': return [px * this.textOffset, py * this.textOffset];
                  case 'left': return [px * this.textOffset, py * this.textOffset];
                  case 'right': return [-px * this.textOffset, -py * this.textOffset];
                  default: return [-px * this.textOffset, -py * this.textOffset];
            }
      }

      setArrowhead(pathElement, x, y, dx, dy, direction = 1) {
            const len = Math.sqrt(dx * dx + dy * dy);
            if(len === 0) return;

            const ux = dx / len;
            const uy = dy / len;
            const size = this.arrowSize;
            const px = -uy;
            const py = ux;

            const baseX = x + direction * ux * size;
            const baseY = y + direction * uy * size;

            const leftX = baseX + px * size * 0.5;
            const leftY = baseY + py * size * 0.5;

            const rightX = baseX - px * size * 0.5;
            const rightY = baseY - py * size * 0.5;

            const d = `M ${x} ${y} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;
            pathElement.setAttribute("d", d);
      }

      update() {
            const dx = this.x2 - this.x1;
            const dy = this.y2 - this.y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;

            const tickInset = this.tickLength / 2 + 1;
            const adjX1 = this.x1 + ux * tickInset;
            const adjY1 = this.y1 + uy * tickInset;
            const adjX2 = this.x2 - ux * tickInset;
            const adjY2 = this.y2 - uy * tickInset;

            this.line.setAttribute("x1", this.x1);
            this.line.setAttribute("y1", this.y1);
            this.line.setAttribute("x2", this.x2);
            this.line.setAttribute("y2", this.y2);

            const px = -dy / length;
            const py = dx / length;
            const tx = px * this.tickLength / 2;
            const ty = py * this.tickLength / 2;

            this.tick1.setAttribute("x1", this.x1 - tx);
            this.tick1.setAttribute("y1", this.y1 - ty);
            this.tick1.setAttribute("x2", this.x1 + tx);
            this.tick1.setAttribute("y2", this.y1 + ty);

            this.tick2.setAttribute("x1", this.x2 - tx);
            this.tick2.setAttribute("y1", this.y2 - ty);
            this.tick2.setAttribute("x2", this.x2 + tx);
            this.tick2.setAttribute("y2", this.y2 + ty);

            const midX = (this.x1 + this.x2) / 2;
            const midY = (this.y1 + this.y2) / 2;
            const [offsetX, offsetY] = this.getSmartOffset(dx, dy);

            const labelX = midX + offsetX;
            const labelY = midY + offsetY;

            let angle = Math.atan2(dy, dx) * (180 / Math.PI);
            if(angle > 90 || angle < -90 || this.sideHint === 'left') {
                  angle += 180;
            }

            const scaledLength = length * this.scale;
            let formattedLength = scaledLength.toFixed(this.precision);
            if(this.precision > 0 && parseFloat(formattedLength) % 1 === 0) {
                  formattedLength = parseFloat(formattedLength).toFixed(0);
            }

            this.label.setAttribute("x", labelX);
            this.label.setAttribute("y", labelY);
            this.label.setAttribute("transform", `rotate(${angle} ${labelX} ${labelY})`);
            this.label.setAttribute("text-anchor", this.getTextAnchor());
            this.label.setAttribute("alignment-baseline", this.getAlignmentBaseline());
            this.label.textContent = this.autoLabel ? `${formattedLength} ${this.unit}` : this.text;

            this.setArrowhead(this.arrowHead1, this.x1, this.y1, dx, dy, 1);
            this.setArrowhead(this.arrowHead2, this.x2, this.y2, dx, dy, -1);
      }

      Delete = () => {
            if(this.group && this.group.parentNode) {
                  this.group.parentNode.removeChild(this.group);
            }

            if(this.subMeasures.length > 0) {
                  for(let i = 0; i < this.subMeasures.length; i++) {
                        this.subMeasures[i].Delete();
                  }
            }
      };
}