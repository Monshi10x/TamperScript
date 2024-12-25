


function getSvgElsArea(svg) {
      //query only geometry elements
      let els = svg.querySelectorAll('path, circle, ellipse, rect, polygon');
      let area = 0;
      els.forEach(el => {
            area += getShapeArea(el);
      });
      return area;
}


function getShapeArea(el, decimals = 0) {
      let totalArea = 0;
      let polyPoints = [];
      let type = el.nodeName.toLowerCase();
      switch(type) {
            // 1. paths
            case "path":
                  let pathData = el.getPathData({
                        normalize: true
                  });

                  //check subpaths
                  let subPathsData = splitSubpaths(pathData);
                  let isCompoundPath = subPathsData.length > 1 ? true : false;
                  let counterShapes = [];

                  // check intersections for compund paths
                  if(isCompoundPath) {
                        let bboxArr = getSubPathBBoxes(subPathsData);
                        bboxArr.forEach(function(bb, b) {
                              //let path1 = path;
                              for(let i = 0; i < bboxArr.length; i++) {
                                    let bb2 = bboxArr[i];
                                    if(bb != bb2) {
                                          let intersects = checkBBoxIntersections(bb, bb2);
                                          if(intersects) {
                                                counterShapes.push(i);
                                          }
                                    }
                              }
                        });
                  }

                  subPathsData.forEach(function(pathData, d) {
                        //reset polygon points for each segment
                        polyPoints = [];
                        let bezierArea = 0;
                        let pathArea = 0;
                        let multiplier = 1;

                        pathData.forEach(function(com, i) {
                              let [type, values] = [com.type, com.values];
                              if(values.length) {
                                    let prevC = i > 0 ? pathData[i - 1] : pathData[0];
                                    let prevCVals = prevC.values;
                                    let prevCValsL = prevCVals.length;
                                    let [x0, y0] = [
                                          prevCVals[prevCValsL - 2],
                                          prevCVals[prevCValsL - 1]
                                    ];
                                    // C commands
                                    if(values.length == 6) {
                                          let area = getBezierArea([
                                                x0,
                                                y0,
                                                values[0],
                                                values[1],
                                                values[2],
                                                values[3],
                                                values[4],
                                                values[5]
                                          ]);
                                          //push points to calculate inner/remaining polygon area
                                          polyPoints.push([x0, y0], [values[4], values[5]]);
                                          bezierArea += area;
                                    }
                                    // L commands
                                    else {
                                          polyPoints.push([x0, y0], [values[0], values[1]]);
                                    }
                              }
                        });

                        //get area of remaining polygon
                        let areaPoly = polygonArea(polyPoints, false);

                        //subtract area by negative multiplier
                        if(counterShapes.indexOf(d) !== -1) {
                              multiplier = -1;
                        }

                        //values have the same sign - subtract polygon area
                        if(
                              (areaPoly < 0 && bezierArea < 0) ||
                              (areaPoly > 0 && bezierArea > 0)
                        ) {
                              pathArea = (Math.abs(bezierArea) - Math.abs(areaPoly)) * multiplier;
                        } else {
                              pathArea = (Math.abs(bezierArea) + Math.abs(areaPoly)) * multiplier;
                        }

                        totalArea += pathArea;
                  });
                  break;

            // 2. primitives:
            // 2.1 circle an ellipse primitives
            case "circle":
            case "ellipse":
                  totalArea = getEllipseArea(el);
                  break;

            // 2.2 polygons
            case "polygon":
            case "polyline":
                  totalArea = getPolygonArea(el);
                  break;

            // 2.3 rectancle primitives
            case "rect":
                  totalArea = getRectArea(el);
                  break;
      }
      if(decimals > 0) {
            totalArea = +totalArea.toFixed(decimals);
      }
      return totalArea;
}

/*
function getPathArea(pathData) {
      let totalArea = 0;
      let polyPoints = [];
      pathData.forEach(function(com, i) {
            let [type, values] = [com.type, com.values];
            if(values.length) {
                  let prevC = i > 0 ? pathData[i - 1] : pathData[0];
                  let prevCVals = prevC.values;
                  let prevCValsL = prevCVals.length;
                  let [x0, y0] = [prevCVals[prevCValsL - 2], prevCVals[prevCValsL - 1]];
                  // C commands
                  if(values.length == 6) {
                        let area = getBezierArea([
                              x0,
                              y0,
                              values[0],
                              values[1],
                              values[2],
                              values[3],
                              values[4],
                              values[5]
                        ]);
                        //push points to calculate inner/remaining polygon area
                        polyPoints.push([x0, y0], [values[4], values[5]]);
                        totalArea += area;
                  }
                  // L commands
                  else {
                        polyPoints.push([x0, y0], [values[0], values[1]]);
                  }
            }
      });
      let areaPoly = polygonArea(polyPoints);
      totalArea = Math.abs(areaPoly) + Math.abs(totalArea);
      return totalArea;
}*

/**
 * James Godfrey-Kittle/@jamesgk : https://github.com/Pomax/BezierInfo-2/issues/238
 */
function getBezierArea(coords) {
      let x0 = coords[0];
      let y0 = coords[1];
      //if is cubic command
      if(coords.length == 8) {
            let x1 = coords[2];
            let y1 = coords[3];
            let x2 = coords[4];
            let y2 = coords[5];
            let x3 = coords[6];
            let y3 = coords[7];
            let area =
                  ((x0 * (-2 * y1 - y2 + 3 * y3) +
                        x1 * (2 * y0 - y2 - y3) +
                        x2 * (y0 + y1 - 2 * y3) +
                        x3 * (-3 * y0 + y1 + 2 * y2)) *
                        3) / 20;


            return area;
      } else {
            return 0;
      }
}

function polygonArea(points, absolute = true) {
      let area = 0;
      for(let i = 0; i < points.length; i++) {
            const addX = points[i][0];
            const addY = points[i === points.length - 1 ? 0 : i + 1][1];
            const subX = points[i === points.length - 1 ? 0 : i + 1][0];
            const subY = points[i][1];
            area += addX * addY * 0.5 - subX * subY * 0.5;
      }
      if(absolute) {
            area = Math.abs(area);
      }
      return area;
}

function getPolygonArea(el) {
      // convert point string to arra of numbers
      let points = el
            .getAttribute("points")
            .split(/,| /)
            .filter(Boolean)
            .map((val) => {
                  return parseFloat(val);
            });
      let polyPoints = [];
      for(let i = 0; i < points.length; i += 2) {
            polyPoints.push([points[i], points[i + 1]]);
      }
      let area = polygonArea(polyPoints);
      return area;
}


function getRectArea(el) {
      let width = el.width.baseVal.value;
      let height = el.height.baseVal.value;

      //if rounded corner – take radius
      let rx = el.getAttribute("rx");
      let ry = el.getAttribute("ry");
      rx = rx ? el.rx.baseVal.value : 0;
      ry = ry ? el.ry.baseVal.value : 0;

      let area = width * height - (4 - Math.PI) * rx * ry;

      return area;
}

function getEllipseArea(el) {
      // if is circle
      let r = el.getAttribute("r") ? el.r.baseVal.value : '';
      let rx = el.getAttribute("rx");
      let ry = el.getAttribute("ry");
      //if circle – take radius
      rx = rx ? el.rx.baseVal.value : r;
      ry = ry ? el.ry.baseVal.value : r;
      let area = Math.PI * rx * ry;
      return area;
}

//path data helpers
function splitSubpaths(pathData) {
      let pathDataL = pathData.length;
      let subPathArr = [];
      let subPathMindex = [];
      pathData.forEach(function(com, i) {
            let [type, values] = [com["type"], com["values"]];
            if(type == "M") {
                  subPathMindex.push(i);
            }
      });
      //split subPaths
      subPathMindex.forEach(function(index, i) {
            let end = subPathMindex[i + 1];
            let thisSeg = pathData.slice(index, end);
            subPathArr.push(thisSeg);
      });
      return subPathArr;
}

function getSubPathBBoxes(subPaths) {
      let ns = "http://www.w3.org/2000/svg";
      let svgTmp = document.createElementNS(ns, "svg");
      svgTmp.setAttribute("style", "position:absolute; width:0; height:0;");
      document.body.appendChild(svgTmp);
      let bboxArr = [];
      subPaths.forEach(function(pathData) {
            let pathTmp = document.createElementNS(ns, "path");
            svgTmp.appendChild(pathTmp);
            pathTmp.setPathData(pathData);
            let bb = pathTmp.getBBox();
            bboxArr.push(bb);
      });
      svgTmp.remove();
      return bboxArr;
}

function checkBBoxIntersections(bb, bb1) {
      let [x, y, width, height, right, bottom] = [
            bb.x,
            bb.y,
            bb.width,
            bb.height,
            bb.x + bb.width,
            bb.y + bb.height
      ];
      let [x1, y1, width1, height1, right1, bottom1] = [
            bb1.x,
            bb1.y,
            bb1.width,
            bb1.height,
            bb1.x + bb1.width,
            bb1.y + bb1.height
      ];
      let intersects = false;
      if(width * height != width1 * height1) {
            if(width * height > width1 * height1) {
                  if(x < x1 && right > right1 && y < y1 && bottom > bottom1) {
                        intersects = true;
                  }
            }
      }
      return intersects;
};