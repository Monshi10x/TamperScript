
/**
 * Trivial coordinate class
 */
class Coord {
	constructor(x, y) {
		if(isNaN(x) || isNaN(y)) {
			throw new Error(`NaN encountered: ${x}/${y}`);
		}
		this.x = x;
		this.y = y;
	}
}

/**
 * Simple point curve Point class
 *   - plain points only have "main" set
 *   - bezier points have "left" and "right" set as control points
 * A bezier curve from p1 to p2 will consist of {p1, p1.right, p2.left, p2}
 */
class Point2 {
	constructor(x, y) {this.main = new Coord(x, y); this.left = null; this.right = null; this.isplain = true;}
	setLeft(x, y) {this.isplain = false; this.left = new Coord(x, y);}
	setRight(x, y) {this.isplain = false; this.right = new Coord(x, y);}
	isPlain() {return this.isplain;}
	getPoint() {return this.main;}
	getLeft() {return this.isplain ? this.main : this.left == null ? this.main : this.left;}
	getRight() {return this.isplain ? this.main : this.right == null ? this.main : this.right;}
}

function convertToAbsolute(path) {
	console.log(path.getPathData());
	var x0, y0, x1, y1, x2, y2, segs = path.getPathData();
	for(var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; ++i) {
		var seg = segs.getItem(i), c = seg.pathSegTypeAsLetter;
		if(/[MLHVCSQTA]/.test(c)) {
			if('x' in seg) x = seg.x;
			if('y' in seg) y = seg.y;
		} else {
			if('x1' in seg) x1 = x + seg.x1;
			if('x2' in seg) x2 = x + seg.x2;
			if('y1' in seg) y1 = y + seg.y1;
			if('y2' in seg) y2 = y + seg.y2;
			if('x' in seg) x += seg.x;
			if('y' in seg) y += seg.y;
			switch(c) {
				case 'm': segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i); break;
				case 'l': segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i); break;
				case 'h': segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i); break;
				case 'v': segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i); break;
				case 'c': segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i); break;
				case 's': segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i); break;
				case 'q': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i); break;
				case 't': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i); break;
				case 'a': segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i); break;
				case 'z': case 'Z': x = x0; y = y0; break;
			}
		}
		if(c == 'M' || c == 'm') x0 = x, y0 = y;
	}
	return [path, segs];
}

/**
 * A shape defined in terms of curve points
 */
class PointCurveShape {
	constructor() {this.points = [];}
	current() {return this.points.slice(-1)[0];}
	addPoint(x, y) {this.points.push(new Point2(x, y));}
	setLeft(x, y) {this.current().setLeft(x, y);}
	setRight(x, y) {this.current().setRight(x, y);}

	/**
	 * Convert the point curve to an SVG path string
	 * (bidirectional conversion? You better believe it).
	 * This code is very similar to the draw method,
	 * since it effectively does the same thing.
	 */
	toSVG() {
		// first vertex
		let points = this.points;
		let first = points[0].getPoint();
		let x = first.x;
		let y = first.y;
		let svg = "M" + x + (y < 0 ? y : " " + y);
		// rest of the shape
		for(let p = 1; p < points.length; p++) {
			// since we have to work with point pairs, get "prev" and "current"
			let prev = points[p - 1];
			let curr = points[p];
			// if both are plain, LineTo. Otherwise, Cubic bezier.
			if(curr.isPlain() && prev.isPlain()) {
				let lx = curr.getPoint().x; let ly = curr.getPoint().y;
				svg += "L" + lx + (ly < 0 ? ly : " " + ly);
			}
			else {
				let cx1 = prev.getRight().x; let cy1 = prev.getRight().y;
				let cx2 = curr.getLeft().x; let cy2 = curr.getLeft().y;
				let x2 = curr.getPoint().x; let y2 = curr.getPoint().y;
				svg += "C" + cx1 + (cy1 < 0 ? cy1 : " " + cy1) +
					(cx2 < 0 ? cx2 : " " + cx2) + (cy2 < 0 ? cy2 : " " + cy2) +
					(x2 < 0 ? x2 : " " + x2) + (y2 < 0 ? y2 : " " + y2);
			}
		}
		return svg + "Z";
	}
}

const MINX = 0;
const MINY = 1;
const MAXX = 2;
const MAXY = 3;

class Outline {
	constructor() {
		this.curveshapes = [];
		this.current = new PointCurveShape();
		this.bounds = false;
	}

	getShapes() {return this.curveshapes;}

	getShape(index) {return this.curveshapes[index];}

	/**
	 * Convert the point curve to an SVG path string (bidirectional conversion?
	 * You better believe it).
	 */
	toSVG() {
		let svg = "";
		this.curveshapes.forEach(s => svg += s.toSVG());
		return svg;
	}

	// start a shape group
	startGroup() {this.curveshapes = [];}

	// start a new shape in the group
	startShape() {this.current = new PointCurveShape();}

	// add an on-screen point
	addPoint(x, y) {
		this.current.addPoint(x, y);
		var bounds = this.bounds;
		if(!bounds) {bounds = this.bounds = [x, y, x, y];}
		if(x < bounds[MINX]) {bounds[MINX] = x;}
		if(x > bounds[MAXX]) {bounds[MAXX] = x;}
		if(y < bounds[MINY]) {bounds[MINY] = y;}
		if(y > bounds[MAXY]) {bounds[MAXY] = y;}
	}

	// set the x/y coordinates for the left/right control points
	setLeftControl(x, y) {
		this.current.setLeft(x, y);
	}

	setRightControl(x, y) {
		this.current.setRight(x, y);
	}

	// close the current shape
	closeShape() {
		this.curveshapes.push(this.current);
		this.current = null;
	}

	// close the group of shapes.
	closeGroup() {
		this.curveshapes.push(this.current);
		this.current = null;
	}
}

class SVGParser {
	constructor(receiver) {
		this.receiver = receiver;
	}

	getReceiver() {return receiver;}

	parse(path, xoffset, yoffset) {
		xoffset = xoffset || 0;
		yoffset = yoffset || 0;

		// normalize the path
		path = path.replace(/\s*([mlvhqczMLVHQCZ])\s*/g, "\n$1 ")
			.replace(/,/g, " ")
			.replace(/-/g, " -")
			.replace(/ +/g, " ");

		// step one: split the path in individual pathing instructions
		var strings = path.split("\n");
		let x = xoffset;
		let y = yoffset;

		// step two: process each instruction
		let receiver = this.receiver;
		receiver.startGroup();
		for(let s = 1; s < strings.length; s++) {
			let instruction = strings[s].trim();
			let op = instruction.substring(0, 1);
			let terms = (instruction.length > 1 ? instruction.substring(2).trim().split(" ") : []);

			// move instruction
			if(op === "m" || op === "M") {
				if(op === "m") {x += parseFloat(terms[0]); y += parseFloat(terms[1]);}
				else if(op === "M") {x = parseFloat(terms[0]) + xoffset; y = parseFloat(terms[1]) + yoffset;}
				// add a point only if the next operation is not another move operation, or a close operation
				if(s < strings.length - 1) {
					let nextstring = strings[s + 1].trim();
					let nextop = nextstring.substring(0, 1);
					if(!(nextop === "m" || nextop === "M" || nextop === "z" || nextop === "Z")) {
						if(s > 1) {receiver.closeShape();}
						receiver.startShape();
						receiver.addPoint(x, y);
					}
				}
			}

			// line instructions
			else if(op === "l" || op === "L") {
				// this operation take a series of [x2 y2] coordinates
				for(let t = 0; t < terms.length; t += 2) {
					if(op === "l") {x += parseFloat(terms[t + 0]); y += parseFloat(terms[t + 1]);}
					else if(op === "L") {x = parseFloat(terms[t + 0]) + xoffset; y = parseFloat(terms[t + 1]) + yoffset;}
					receiver.addPoint(x, y);
				}
			}

			// vertical line shorthand
			else if(op === "v" || op === "V") {
				terms.forEach(y2 => {
					if(op === "v") {y += parseFloat(y2);}
					else if(op === "V") {y = parseFloat(y2) + yoffset;}
					receiver.addPoint(x, y);
				});
			}


			// horizontal line shorthand
			else if(op === "h" || op === "H") {
				terms.forEach(x2 => {
					if(op === "h") {x += parseFloat(x2);}
					else if(op === "H") {x = parseFloat(x2) + yoffset;}
					receiver.addPoint(x, y);
				});
			}


			// quadratic curve instruction
			else if(op === "q" || op === "Q") {
				// this operation takes a series of [cx cy x2 y2] coordinates
				for(let q = 0; q < terms.length; q += 4) {
					let cx = 0; let cy = 0;
					if(op === "q") {cx = x + parseFloat(terms[q]); cy = y + parseFloat(terms[q + 1]);}
					else if(op === "Q") {cx = parseFloat(terms[q]) + xoffset; cy = parseFloat(terms[q + 1]) + yoffset;}

					// processing has no quadratic curves, so we have to derive the cubic control points
					let cx1 = (x + cx + cx) / 3;
					let cy1 = (y + cy + cy) / 3;

					// make start point bezier if it differs from the control point
					if(x != cx1 || y != cy1) {
						receiver.setRightControl(cx1, cy1);
					}

					// NOTE: the relative quadratic instruction does not count control points as "real"
					// points, so the curve's on-curve coordinate is relative to the last on-curve one.
					if(op === "q") {x += parseFloat(terms[q + 2]); y += parseFloat(terms[q + 3]);}
					else if(op === "Q") {x = parseFloat(terms[q + 2]) + xoffset; y = parseFloat(terms[q + 3]) + yoffset;}

					// derive cubic control point 2
					let cx2 = (x + cx + cx) / 3;
					let cy2 = (y + cy + cy) / 3;

					receiver.addPoint(x, y);
					if(x != cx2 || y != cy2) {receiver.setLeftControl(cx2, cy2);}
				}
			}

			// cubic curve instruction
			else if(op === "c" || op === "C") {
				// this operation takes a series of [cx1 cy1 cx2 cy2 x2 y2] coordinates
				for(let c = 0; c < terms.length; c += 6) {

					// get first control point
					let cx1 = 0; let cy1 = 0;
					if(op === "c") {cx1 = x + parseFloat(terms[c]); cy1 = y + parseFloat(terms[c + 1]);}
					else if(op === "C") {cx1 = parseFloat(terms[c]) + xoffset; cy1 = parseFloat(terms[c + 1]) + yoffset;}

					// make start point bezier if it differs from the control point
					if(x != cx1 || y != cy1) {
						receiver.setRightControl(cx1, cy1);
					}

					// get second control point. NOTE: this is not relative to the first control point, but
					// relative to the on-curve start coordinate
					let cx2 = 0; let cy2 = 0;
					if(op === "c") {cx2 = x + parseFloat(terms[c + 2]); cy2 = y + parseFloat(terms[c + 3]);}
					else if(op === "C") {cx2 = parseFloat(terms[c + 2]) + xoffset; cy2 = parseFloat(terms[c + 3]) + yoffset;}

					// NOTE: the relative cubic instruction does not count control points as "real"
					// points, so the curve's on-curve coordinate is relative to the last on-curve one.
					if(op === "c") {x += parseFloat(terms[c + 4]); y += parseFloat(terms[c + 5]);}
					else if(op === "C") {x = parseFloat(terms[c + 4]) + xoffset; y = parseFloat(terms[c + 5]) + yoffset;}

					// add end point, make bezier if the on-curve and control point differ
					receiver.addPoint(x, y);
					if(x != cx2 || y != cy2) {receiver.setLeftControl(cx2, cy2);}
				}
			}

			// close shape instruction
			else if(op === "z" || op === "Z") {receiver.closeGroup();}
		}
	}
}
/*
const API = {
	SVGParser, Outline, PointCurveShape, parse: function(pathString) {
		const outline = new API.Outline();
		const parser = new API.SVGParser(outline);
		parser.parse(pathString);
		return outline;
	}
};

return API;
*/


/**@see https://www.npmjs.com/package/svg-points
 * 
 */
!function(r, e) {"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(r.SVGPoints = {});}(this, function(r) {"use strict"; var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {return typeof r;} : function(r) {return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;}, t = Object.assign || function(r) {for(var e = 1; e < arguments.length; e++) {var t = arguments[e]; for(var u in t) Object.prototype.hasOwnProperty.call(t, u) && (r[u] = t[u]);} return r;}, u = function(r, e) {var t = {}; for(var u in r) e.indexOf(u) >= 0 || Object.prototype.hasOwnProperty.call(r, u) && (t[u] = r[u]); return t;}, n = function(r) {var e = r.type, t = u(r, ["type"]); switch(e) {case "circle": return y(t); case "ellipse": return p(t); case "line": return i(t); case "path": return v(t); case "polygon": return l(t); case "polyline": return d(t); case "rect": return m(t); case "g": return w(t); default: throw new Error("Not a valid shape type");}}, y = function(r) {var e = r.cx, t = r.cy, u = r.r; return [{x: e, y: t - u, moveTo: !0}, {x: e, y: t + u, curve: {type: "arc", rx: u, ry: u, sweepFlag: 1}}, {x: e, y: t - u, curve: {type: "arc", rx: u, ry: u, sweepFlag: 1}}];}, p = function(r) {var e = r.cx, t = r.cy, u = r.rx, n = r.ry; return [{x: e, y: t - n, moveTo: !0}, {x: e, y: t + n, curve: {type: "arc", rx: u, ry: n, sweepFlag: 1}}, {x: e, y: t - n, curve: {type: "arc", rx: u, ry: n, sweepFlag: 1}}];}, i = function(r) {var e = r.x1, t = r.x2; return [{x: e, y: r.y1, moveTo: !0}, {x: t, y: r.y2}];}, a = /[MmLlHhVvCcSsQqTtAaZz]/g, o = {A: 7, C: 6, H: 1, L: 2, M: 2, Q: 4, S: 4, T: 2, V: 1, Z: 0}, s = ["a", "c", "h", "l", "m", "q", "s", "t", "v"], c = function(r) {return -1 !== s.indexOf(r);}, x = ["xAxisRotation", "largeArcFlag", "sweepFlag"], h = function(r) {return r.match(a);}, f = function(r) {return r.split(a).map(function(r) {return r.replace(/[0-9]+-/g, function(r) {return r.slice(0, -1) + " -";});}).map(function(r) {return r.replace(/\.[0-9]+/g, function(r) {return r + " ";});}).map(function(r) {return r.trim();}).filter(function(r) {return r.length > 0;}).map(function(r) {return r.split(/[ ,]+/).map(parseFloat).filter(function(r) {return !isNaN(r);});});}, v = function(r) {for(var e = r.d, t = h(e), u = f(e), n = [], y = void 0, p = 0, i = t.length; p < i; p++) {var a = t[p], s = a.toUpperCase(), v = o[s], l = c(a); if(v > 0) for(var d = u.shift(), b = d.length / v, m = 0; m < b; m++) {var g = n[n.length - 1] || {x: 0, y: 0}; switch(s) {case "M": var q = (l ? g.x : 0) + d.shift(), w = (l ? g.y : 0) + d.shift(); 0 === m ? (y = {x: q, y: w}, n.push({x: q, y: w, moveTo: !0})) : n.push({x: q, y: w}); break; case "L": n.push({x: (l ? g.x : 0) + d.shift(), y: (l ? g.y : 0) + d.shift()}); break; case "H": n.push({x: (l ? g.x : 0) + d.shift(), y: g.y}); break; case "V": n.push({x: g.x, y: (l ? g.y : 0) + d.shift()}); break; case "A": n.push({curve: {type: "arc", rx: d.shift(), ry: d.shift(), xAxisRotation: d.shift(), largeArcFlag: d.shift(), sweepFlag: d.shift()}, x: (l ? g.x : 0) + d.shift(), y: (l ? g.y : 0) + d.shift()}); var A = !0, k = !1, F = void 0; try {for(var T, M = x[Symbol.iterator](); !(A = (T = M.next()).done); A = !0) {var S = T.value; 0 === n[n.length - 1].curve[S] && delete n[n.length - 1].curve[S];} } catch(r) {k = !0, F = r;} finally {try {!A && M.return && M.return();} finally {if(k) throw F;} } break; case "C": n.push({curve: {type: "cubic", x1: (l ? g.x : 0) + d.shift(), y1: (l ? g.y : 0) + d.shift(), x2: (l ? g.x : 0) + d.shift(), y2: (l ? g.y : 0) + d.shift()}, x: (l ? g.x : 0) + d.shift(), y: (l ? g.y : 0) + d.shift()}); break; case "S": var O = (l ? g.x : 0) + d.shift(), j = (l ? g.y : 0) + d.shift(), P = (l ? g.x : 0) + d.shift(), C = (l ? g.y : 0) + d.shift(), V = {}, H = void 0, L = void 0; g.curve && "cubic" === g.curve.type ? (V.x = Math.abs(g.x - g.curve.x2), V.y = Math.abs(g.y - g.curve.y2), H = g.x < g.curve.x2 ? g.x - V.x : g.x + V.x, L = g.y < g.curve.y2 ? g.y - V.y : g.y + V.y) : (V.x = Math.abs(P - O), V.y = Math.abs(C - j), H = g.x, L = g.y), n.push({curve: {type: "cubic", x1: H, y1: L, x2: O, y2: j}, x: P, y: C}); break; case "Q": n.push({curve: {type: "quadratic", x1: (l ? g.x : 0) + d.shift(), y1: (l ? g.y : 0) + d.shift()}, x: (l ? g.x : 0) + d.shift(), y: (l ? g.y : 0) + d.shift()}); break; case "T": var Q = (l ? g.x : 0) + d.shift(), Z = (l ? g.y : 0) + d.shift(), N = void 0, R = void 0; if(g.curve && "quadratic" === g.curve.type) {var _ = {x: Math.abs(g.x - g.curve.x1), y: Math.abs(g.y - g.curve.y1)}; N = g.x < g.curve.x1 ? g.x - _.x : g.x + _.x, R = g.y < g.curve.y1 ? g.y - _.y : g.y + _.y;} else N = g.x, R = g.y; n.push({curve: {type: "quadratic", x1: N, y1: R}, x: Q, y: Z});}} else {var z = n[n.length - 1] || {x: 0, y: 0}; z.x === y.x && z.y === y.y || n.push({x: y.x, y: y.y});} } return n;}, l = function(r) {var e = r.points; return b({closed: !0, points: e});}, d = function(r) {var e = r.points; return b({closed: !1, points: e});}, b = function(r) {var e = r.closed, u = r.points.split(/[\s,]+/).map(function(r) {return parseFloat(r);}).reduce(function(r, e, t) {return t % 2 == 0 ? r.push({x: e}) : r[(t - 1) / 2].y = e, r;}, []); return e && u.push(t({}, u[0])), u[0].moveTo = !0, u;}, m = function(r) {var e = r.height, t = r.rx, u = r.ry, n = r.width, y = r.x, p = r.y; return t || u ? q({height: e, rx: t || u, ry: u || t, width: n, x: y, y: p}) : g({height: e, width: n, x: y, y: p});}, g = function(r) {var e = r.height, t = r.width, u = r.x, n = r.y; return [{x: u, y: n, moveTo: !0}, {x: u + t, y: n}, {x: u + t, y: n + e}, {x: u, y: n + e}, {x: u, y: n}];}, q = function(r) {var e = r.height, t = r.rx, u = r.ry, n = r.width, y = r.x, p = r.y, i = {type: "arc", rx: t, ry: u, sweepFlag: 1}; return [{x: y + t, y: p, moveTo: !0}, {x: y + n - t, y: p}, {x: y + n, y: p + u, curve: i}, {x: y + n, y: p + e - u}, {x: y + n - t, y: p + e, curve: i}, {x: y + t, y: p + e}, {x: y, y: p + e - u, curve: i}, {x: y, y: p + u}, {x: y + t, y: p, curve: i}];}, w = function(r) {return r.shapes.map(function(r) {return n(r);});}, A = function(r) {var e = "", t = 0, u = void 0, n = !0, y = !1, p = void 0; try {for(var i, a = r[Symbol.iterator](); !(n = (i = a.next()).done); n = !0) {var o = i.value, s = o.curve, c = void 0 !== s && s, x = o.moveTo, h = o.x, f = o.y, v = 0 === t || x, l = t === r.length - 1 || r[t + 1].moveTo, d = 0 === t ? null : r[t - 1]; if(v) u = o, l || (e += "M" + h + "," + f); else if(c) {switch(c.type) {case "arc": var b = o.curve, m = b.largeArcFlag, g = void 0 === m ? 0 : m, q = b.rx, w = b.ry, A = b.sweepFlag, k = void 0 === A ? 0 : A, F = b.xAxisRotation; e += "A" + q + "," + w + "," + (void 0 === F ? 0 : F) + "," + g + "," + k + "," + h + "," + f; break; case "cubic": var T = o.curve; e += "C" + T.x1 + "," + T.y1 + "," + T.x2 + "," + T.y2 + "," + h + "," + f; break; case "quadratic": var M = o.curve; e += "Q" + M.x1 + "," + M.y1 + "," + h + "," + f;}l && h === u.x && f === u.y && (e += "Z");} else l && h === u.x && f === u.y ? e += "Z" : h !== d.x && f !== d.y ? e += "L" + h + "," + f : h !== d.x ? e += "H" + h : f !== d.y && (e += "V" + f); t++;} } catch(r) {y = !0, p = r;} finally {try {!n && a.return && a.return();} finally {if(y) throw p;} } return e;}, k = function r(t) {var u = []; if(F(t).map(function(r) {var n = r.match, y = r.prop, p = r.required, i = r.type; void 0 === t[y] ? p && u.push(y + " prop is required" + ("type" === y ? "" : " on a " + t.type)) : (void 0 !== i && ("array" === i ? Array.isArray(t[y]) || u.push(y + " prop must be of type array") : e(t[y]) !== i && u.push(y + " prop must be of type " + i)), Array.isArray(n) && -1 === n.indexOf(t[y]) && u.push(y + " prop must be one of " + n.join(", ")));}), "g" === t.type && Array.isArray(t.shapes)) {var n = t.shapes.map(function(e) {return r(e);}); return [].concat.apply(u, n);} return u;}, F = function(r) {var e = [{match: ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "g"], prop: "type", required: !0, type: "string"}]; switch(r.type) {case "circle": e.push({prop: "cx", required: !0, type: "number"}), e.push({prop: "cy", required: !0, type: "number"}), e.push({prop: "r", required: !0, type: "number"}); break; case "ellipse": e.push({prop: "cx", required: !0, type: "number"}), e.push({prop: "cy", required: !0, type: "number"}), e.push({prop: "rx", required: !0, type: "number"}), e.push({prop: "ry", required: !0, type: "number"}); break; case "line": e.push({prop: "x1", required: !0, type: "number"}), e.push({prop: "x2", required: !0, type: "number"}), e.push({prop: "y1", required: !0, type: "number"}), e.push({prop: "y2", required: !0, type: "number"}); break; case "path": e.push({prop: "d", required: !0, type: "string"}); break; case "polygon": case "polyline": e.push({prop: "points", required: !0, type: "string"}); break; case "rect": e.push({prop: "height", required: !0, type: "number"}), e.push({prop: "rx", type: "number"}), e.push({prop: "ry", type: "number"}), e.push({prop: "width", required: !0, type: "number"}), e.push({prop: "x", required: !0, type: "number"}), e.push({prop: "y", required: !0, type: "number"}); break; case "g": e.push({prop: "shapes", required: !0, type: "array"});}return e;}; r.toPath = function(r) {var e = Array.isArray(r), t = e ? Array.isArray(r[0]) : "g" === r.type, u = e ? r : t ? r.shapes.map(function(r) {return n(r);}) : n(r); return t ? u.map(function(r) {return A(r);}) : A(u);}, r.toPoints = n, r.valid = function(r) {var e = k(r); return {errors: e, valid: 0 === e.length};}, Object.defineProperty(r, "__esModule", {value: !0});});
//# sourceMappingURL=svg-points.min.js.map

/**@see https://github.com/colinmeinke/points?tab=readme-ov-file
 * 
 */
!function(r, e) {"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((r = r || self).Points = {});}(this, function(r) {"use strict"; function s(u) {for(var r = 1; r < arguments.length; r++)if(r % 2) {var c = null != arguments[r] ? arguments[r] : {}, e = Object.keys(c); "function" == typeof Object.getOwnPropertySymbols && (e = e.concat(Object.getOwnPropertySymbols(c).filter(function(r) {return Object.getOwnPropertyDescriptor(c, r).enumerable;}))), e.forEach(function(r) {var e, t, n; e = u, n = c[t = r], t in e ? Object.defineProperty(e, t, {value: n, enumerable: !0, configurable: !0, writable: !0}) : e[t] = n;});} else Object.defineProperties(u, Object.getOwnPropertyDescriptors(arguments[r])); return u;} function l(r, e) {return function(r) {if(Array.isArray(r)) return r;}(r) || function(r, e) {var t = [], n = !0, u = !1, c = void 0; try {for(var o, a = r[Symbol.iterator](); !(n = (o = a.next()).done) && (t.push(o.value), !e || t.length !== e); n = !0);} catch(r) {u = !0, c = r;} finally {try {n || null == a.return || a.return();} finally {if(u) throw c;} } return t;}(r, e) || function() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}();} function x(r) {return function(r) {if(Array.isArray(r)) {for(var e = 0, t = new Array(r.length); e < r.length; e++)t[e] = r[e]; return t;} }(r) || function(r) {if(Symbol.iterator in Object(r) || "[object Arguments]" === Object.prototype.toString.call(r)) return Array.from(r);}(r) || function() {throw new TypeError("Invalid attempt to spread non-iterable instance");}();} function k(r, e, t, n, u, c, o) {var a = r.x, i = r.y; return {x: n * (a *= e) - u * (i *= t) + c, y: u * a + n * i + o};} function N(r, e, t, n) {var u = r * t + e * n; return 1 < u && (u = 1), u < -1 && (u = -1), (r * n - e * t < 0 ? -1 : 1) * Math.acos(u);} function h(r) {var e = r.px, t = r.py, n = r.cx, u = r.cy, i = r.rx, y = r.ry, c = r.xAxisRotation, o = void 0 === c ? 0 : c, a = r.largeArcFlag, v = void 0 === a ? 0 : a, f = r.sweepFlag, x = void 0 === f ? 0 : f, p = []; if(0 === i || 0 === y) return []; var s = Math.sin(o * _ / 360), l = Math.cos(o * _ / 360), h = l * (e - n) / 2 + s * (t - u) / 2, b = -s * (e - n) / 2 + l * (t - u) / 2; if(0 == h && 0 == b) return []; i = Math.abs(i), y = Math.abs(y); var g = Math.pow(h, 2) / Math.pow(i, 2) + Math.pow(b, 2) / Math.pow(y, 2); 1 < g && (i *= Math.sqrt(g), y *= Math.sqrt(g)); var m = function(r, e, t, n, u, c, o, a, i, y, v, f) {var x = Math.pow(u, 2), p = Math.pow(c, 2), s = Math.pow(v, 2), l = Math.pow(f, 2), h = x * p - x * l - p * s; h < 0 && (h = 0), h /= x * l + p * s; var b = (h = Math.sqrt(h) * (o === a ? -1 : 1)) * u / c * f, g = h * -c / u * v, m = y * b - i * g + (r + t) / 2, d = i * b + y * g + (e + n) / 2, M = (v - b) / u, w = (f - g) / c, A = (-v - b) / u, I = (-f - g) / c, O = N(1, 0, M, w), j = N(M, w, A, I); return 0 === a && 0 < j && (j -= _), 1 === a && j < 0 && (j += _), [m, d, O, j];}(e, t, n, u, i, y, v, x, s, l, h, b), d = D(m, 4), M = d[0], w = d[1], A = d[2], I = d[3], O = Math.abs(I) / (_ / 4); Math.abs(1 - O) < 1e-7 && (O = 1); var j, P, T, S, q, E, L, F = Math.max(Math.ceil(O), 1); I /= F; for(var R = 0; R < F; R++)p.push((j = A, void 0, T = 1.5707963267948966 === (P = I) ? .551915024494 : -1.5707963267948966 === P ? -.551915024494 : 4 / 3 * Math.tan(P / 4), S = Math.cos(j), q = Math.sin(j), E = Math.cos(j + P), L = Math.sin(j + P), [{x: S - q * T, y: q + S * T}, {x: E + L * T, y: L - E * T}, {x: E, y: L}])), A += I; return p.map(function(r) {var e = k(r[0], i, y, l, s, M, w), t = e.x, n = e.y, u = k(r[1], i, y, l, s, M, w), c = u.x, o = u.y, a = k(r[2], i, y, l, s, M, w); return {x1: t, y1: n, x2: c, y2: o, x: a.x, y: a.y};});} function p(r, e, t) {return Math.acos((Math.pow(r, 2) + Math.pow(e, 2) - Math.pow(t, 2)) / (2 * r * e)) * (180 / Math.PI);} function b(e, r) {for(var t = arguments.length, n = new Array(2 < t ? t - 2 : 0), u = 2; u < t; u++)n[u - 2] = arguments[u]; return i(r) ? r.map(function(r) {return e.apply(void 0, [r].concat(n));}) : e.apply(void 0, [r].concat(n));} function g(r, e, t, n) {return Math.sqrt(Math.pow(r - t, 2) + Math.pow(e - n, 2));} function m(r, e, t) {var n = r === e ? 0 : Math.abs(e - r); return 0 === n ? r : r < e ? r + n * t : r - n * t;} function e(r) {for(var a = [], e = 0, t = r.length; e < t; e++) {var n = r[e]; if(n.curve && "cubic" !== n.curve.type) {var u = r[e - 1], c = u.x, o = u.y, i = n.x, y = n.y; if("arc" === n.curve.type) h({px: c, py: o, cx: i, cy: y, rx: n.curve.rx, ry: n.curve.ry, xAxisRotation: n.curve.xAxisRotation, largeArcFlag: n.curve.largeArcFlag, sweepFlag: n.curve.sweepFlag}).forEach(function(r) {var e = r.x1, t = r.y1, n = r.x2, u = r.y2, c = r.x, o = r.y; a.push({x: c, y: o, curve: {type: "cubic", x1: e, y1: t, x2: n, y2: u}});}); else if("quadratic" === n.curve.type) {var v = c + 2 / 3 * (n.curve.x1 - c), f = o + 2 / 3 * (n.curve.y1 - o), x = i + 2 / 3 * (n.curve.x1 - i), p = y + 2 / 3 * (n.curve.y1 - y); a.push({x: i, y: y, curve: {type: "cubic", x1: v, y1: f, x2: x, y2: p}});} } else a.push(n);} return a;} function t(r) {return b(e, r);} function d(r, e) {var t = e.curve, n = t.x1, u = t.y1, c = t.x2, o = t.y2, a = {x: r.x, y: r.y}, i = {x: n, y: u}, y = {x: c, y: o}, v = {x: e.x, y: e.y}, f = {x: m(a.x, i.x, .5), y: m(a.y, i.y, .5)}, x = {x: m(i.x, y.x, .5), y: m(i.y, y.y, .5)}, p = {x: m(y.x, v.x, .5), y: m(y.y, v.y, .5)}, s = {x: m(f.x, x.x, .5), y: m(f.y, x.y, .5)}, l = {x: m(x.x, p.x, .5), y: m(x.y, p.y, .5)}, h = {x: m(s.x, l.x, .5), y: m(s.y, l.y, .5)}; return [{x: h.x, y: h.y, curve: {type: "cubic", x1: f.x, y1: f.y, x2: s.x, y2: s.y}}, {x: v.x, y: v.y, curve: {type: "cubic", x1: l.x, y1: l.y, x2: p.x, y2: p.y}}];} function v(r, e) {return e.curve ? d(r, e) : function(r, e) {return [{x: m(r.x, e.x, .5), y: m(r.y, e.y, .5)}, e];}(r, e);} function M(r) {var e = l(r[0], 2), t = e[0], n = e[1], u = l(r[1], 2), c = u[0], o = u[1], a = l(r[2], 2), i = a[0], y = a[1], v = g(t, n, c, o), f = g(c, o, i, y), x = g(i, y, t, n); return p(v, f, x);} function w(r, e) {var n = 1 < arguments.length && void 0 !== e ? e : 1; if(!function(r) {return r.reduce(function(r, e) {return !!e.curve || r;}, !1);}(r)) return r; var u = t(r), c = []; return u.map(function(r, e) {if(r.curve) {var t = u[e - 1]; t.x === r.x && t.y === r.y || y(t, r, n).map(function(r) {return c.push(r);});} else c.push(r);}), c;} function A(r) {var n, u, c, o; return function(r) {return i(r) ? r : [r];}(r).map(function(r) {return w(r).map(function(r) {var e = r.x, t = r.y; ("number" != typeof n || n < t) && (n = t), ("number" != typeof u || e < u) && (u = e), ("number" != typeof c || c < e) && (c = e), ("number" != typeof o || t < o) && (o = t);});}), {bottom: n, center: {x: u + (c - u) / 2, y: o + (n - o) / 2}, left: u, right: c, top: o};} function I(r, e) {var i = w(r, e); return i.reduce(function(r, e, t) {var n = e.x, u = e.y; if(!e.moveTo) {var c = i[t - 1], o = c.x, a = c.y; r += g(o, a, n, u);} return r;}, 0);} function n(r, t, n) {return r.map(function(r) {var e = s({}, r); return e.x += t, e.y += n, e.curve && (e.curve = s({}, e.curve), "quadratic" !== e.curve.type && "cubic" !== e.curve.type || (e.curve.x1 += t, e.curve.y1 += n), "cubic" === e.curve.type && (e.curve.x2 += t, e.curve.y2 += n)), e;});} function a(r, e, t) {if(e.curve || t.curve) return !1; var n = (t.y - r.y) * (e.x - r.x) - (t.x - r.x) * (e.y - r.y); if(Math.abs(n) > Number.EPSILON) return !1; var u = (t.x - r.x) * (e.x - r.x) + (t.y - r.y) * (e.y - r.y); return !(u < 0) && !((e.x - r.x) * (e.x - r.x) + (e.y - r.y) * (e.y - r.y) < u);} function u(r) {for(var e = [], t = 0, n = r.length; t < n; t++) {var u = e[e.length - 1], c = r[t + 1], o = r[t]; u && c && o && a(u, c, o) || e.push(o);} return e;} function c(r) {var x, p; return r.reverse().map(function(r, e) {var t = r.x, n = r.y, u = r.moveTo, c = r.curve, o = {x: t, y: n}; if(p) {var a = p, i = a.x1, y = a.y1, v = a.x2, f = a.y2; o.curve = {type: "cubic", x1: v, y1: f, x2: i, y2: y};} return 0 !== e && !x || (o.moveTo = !0), x = u, p = c || null, o;});} function O(r, e, t, n, u) {var c = u.x, o = u.y, a = r - c, i = e - o; return [a * t - i * n + c, a * n + i * t + o];} function o(r, x, p) {return r.map(function(r) {var e = x * Math.PI / 180, t = Math.cos(e), n = Math.sin(e), u = l(O(r.x, r.y, t, n, p), 2), c = s({}, r, {x: u[0], y: u[1]}); if(c.curve) {if("quadratic" === c.curve.type || "cubic" === c.curve.type) {var o = l(O(c.curve.x1, c.curve.y1, t, n, p), 2), a = o[0], i = o[1]; c.curve = s({}, c.curve, {x1: a, y1: i});} if("cubic" === c.curve.type) {var y = l(O(c.curve.x2, c.curve.y2, t, n, p), 2), v = y[0], f = y[1]; c.curve = s({}, c.curve, {x2: v, y2: f});} } return c;});} var D = function(r, e) {if(Array.isArray(r)) return r; if(Symbol.iterator in Object(r)) return function(r, e) {var t = [], n = !0, u = !1, c = void 0; try {for(var o, a = r[Symbol.iterator](); !(n = (o = a.next()).done) && (t.push(o.value), !e || t.length !== e); n = !0);} catch(r) {u = !0, c = r;} finally {try {!n && a.return && a.return();} finally {if(u) throw c;} } return t;}(r, e); throw new TypeError("Invalid attempt to destructure non-iterable instance");}, _ = 2 * Math.PI, i = function(r) {return Array.isArray(r[0]);}, y = function r(e, t, n) {var u = e.x, c = e.y, o = t.x, a = t.y, i = t.curve; if(function(r, e, t, n, u, c, o, a, i) {var y = [[o, a], [r, e], [u, c]]; return M([[t, n], [u, c], [r, e]]) < i && M(y) < i;}(u, c, i.x1, i.y1, o, a, i.x2, i.y2, n)) return [t]; var y = l(d(e, t), 2), v = y[0], f = y[1]; return [].concat(x(r(e, v, n)), x(r(v, f, n)));}, f = function(r) {return r.length - (j(r) ? 1 : 0);}, j = function(r) {var e = r[0], t = r[r.length - 1]; return e.x === t.x && e.y === t.y;}, P = function(r, e) {var t = E(r), n = function(r) {return r.reduce(function(r, e) {return r + f(e);}, 0);}(t), u = (e % n + n) % n; if(!u) return r; var c = T(t, u), o = c.lineIndex, a = c.pointIndex, i = S(t, o), y = q(i[0], a), v = x(i).splice(1); return function(r) {return r.reduce(function(r, e) {return [].concat(x(r), x(e));}, []);}([y].concat(x(v)));}, T = function(r, e) {for(var t = 0, n = r.length; t < n; t++) {var u = f(r[t]); if(e <= u - 1) return {lineIndex: t, pointIndex: e}; e -= u;} }, S = function(r, e) {return x(r).splice(e).concat(x(r).splice(0, e));}, q = function(r, e) {if(!e) return r; var t = [{x: r[e].x, y: r[e].y, moveTo: !0}].concat(x(x(r).splice(e + 1))); return j(r) ? [].concat(x(t), x(x(r).splice(1, e))) : [].concat(x(t), x(x(r).splice(0, e + 1)));}, E = function(r) {return r.reduce(function(r, e) {return e.moveTo && r.push([]), r[r.length - 1].push(e), r;}, []);}, L = function(r, e) {var t = r[0], n = t.x, u = t.y, c = r[1], o = c.x, a = c.y, i = g(n, u, o, a); return {x1: n, y1: u, x2: o, y2: a, segmentInterval: e / i, segmentLength: i};}, F = function(r, e, t) {for(var n = 0, u = 0; u < e; u++) {if(!r[u].moveTo) {var c = r[u - 1], o = c.x, a = c.y, i = r[u], y = i.x, v = i.y, f = g(o, a, y, v); if(t <= n + f) return {x1: o, y1: a, x2: y, y2: v, segmentInterval: (t - n) / f, segmentLength: f}; n += f;} } }; r.add = function(r, e) {return function r(e, t) {if(isNaN(t)) throw Error("`add` function must be passed a number as the second argument"); for(var n = x(e), u = 1; u < n.length;) {if(n.length >= t) return n; var c = n[u]; if(c.moveTo) u++; else {var o = n[u - 1], a = l(v(o, c), 2), i = a[0], y = a[1]; n.splice(u, 1, i, y), u += 2;} } return r(n, t);}(t(r), e);}, r.boundingBox = A, r.cubify = t, r.length = I, r.moveIndex = function(r, e) {return b(P, r, e);}, r.offset = function(r, e, t) {return b(n, r, 1 < arguments.length && void 0 !== e ? e : 0, 2 < arguments.length && void 0 !== t ? t : 0);}, r.position = function(r, e, t) {var n = w(r, t), u = n.length, c = I(n), o = c * e, a = 1 < e ? function(r, e, t, n) {var u = r[e - 2], c = u.x, o = u.y, a = r[e - 1], i = a.x, y = a.y, v = g(c, o, i, y); return {x1: c, y1: o, x2: i, y2: y, segmentInterval: (n - t) / v + 1, segmentLength: v};}(n, u, c, o) : e < 0 ? L(n, o) : F(n, u, o), i = a.x1, y = a.y1, v = a.x2, f = a.y2, x = a.segmentInterval; return {angle: function(r, e, t, n, u) {if(r === t) return n <= e ? 0 : 180; var c = g(t, n, r, e - 100), o = p(u, 100, c); return r < t ? o : 360 - o;}(i, y, v, f, a.segmentLength), x: m(i, v, x), y: m(y, f, x)};}, r.remove = function(r) {return b(u, r);}, r.reverse = function(r) {return b(c, t(r));}, r.rotate = function(r, e) {var t = A(r).center; return b(o, r, e, t);}, r.scale = function(r, e, t) {var n = 2 < arguments.length && void 0 !== t ? t : "center", u = A(r), c = u.bottom, o = u.center, a = u.left, i = u.right, y = u.top, v = o.x, f = o.y; switch(n) {case "topLeft": v = a, f = y; break; case "topRight": v = i, f = y; break; case "bottomRight": v = i, f = c; break; case "bottomLeft": v = a, f = c;}return b(function(r) {return r.map(function(r) {return function(r, e, t, n) {var u = s({}, r); return u.x = t - (t - u.x) * e, u.y = n - (n - u.y) * e, r.curve && (u.curve = s({}, u.curve), "arc" === u.curve.type ? (u.curve.rx && (u.curve.rx = u.curve.rx * e), u.curve.ry && (u.curve.ry = u.curve.ry * e)) : (u.curve.x1 = t - (t - u.curve.x1) * e, u.curve.y1 = n - (n - u.curve.y1) * e, "cubic" === u.curve.type && (u.curve.x2 = t - (t - u.curve.x2) * e, u.curve.y2 = n - (n - u.curve.y2) * e))), u;}(r, e, v, f);});}, r);}, Object.defineProperty(r, "__esModule", {value: !0});});
