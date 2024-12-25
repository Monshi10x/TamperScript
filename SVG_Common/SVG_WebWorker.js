self.addEventListener("message", function(e) {

      var svg_DPI = 72;
      function svg_mmToPixel(mm) {
            return (mm * svg_DPI) / 25.4;
      }
      function svg_pixelToMM(pixels) {
            return (pixels * 25.4) / svg_DPI;
      }

      function convertPathToPolygon(pathDString, numberStepsPerPoint = 1) {
            let path = new svgPathProperties.svgPathProperties(pathDString);
            var pathLen = path.getTotalLength();
            var numSteps = Math.floor(pathLen * numberStepsPerPoint);

            var points = [];
            for(var i = 0; i < numSteps; i++) {
                  var p = path.getPointAtLength(i * pathLen / numSteps);
                  points.push(p);
            }

            return points;
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

      let totalArea = 0;
      let shapeAreas = [];
      let shapeAreaPolygons = [];

      for(let i = 0; i < e.data.elementDs.length; i++) {

            let pathPointsArray = convertPathToPolygon(e.data.elementDs[i]);
            shapeAreaPolygons.push(pathPointsArray);

            let shapeArea = (svg_pixelToMM(svg_pixelToMM(calculateAreaOfPolygon(pathPointsArray))) / 1000000);
            if(e.data.isElementInnerPath[i] == true) shapeArea *= -1;

            shapeAreas.push(shapeArea);

            totalArea += shapeArea;
      }

      self.postMessage({
            shapeAreas: shapeAreas,
            shapeAreaPolygons: shapeAreaPolygons,
            totalArea: totalArea
      });
}, false);

!function(t, n) {"object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ? define(["exports"], n) : n((t = "undefined" != typeof globalThis ? globalThis : t || self).svgPathProperties = {});}(this, (function(t) {"use strict"; function n(t, n) {for(var e = 0; e < n.length; e++) {var i = n[e]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, s(i.key), i);} } function e(t, e, i) {return e && n(t.prototype, e), i && n(t, i), Object.defineProperty(t, "prototype", {writable: !1}), t;} function i(t, n, e) {return (n = s(n)) in t ? Object.defineProperty(t, n, {value: e, enumerable: !0, configurable: !0, writable: !0}) : t[n] = e, t;} function r(t) {return function(t) {if(Array.isArray(t)) return h(t);}(t) || function(t) {if("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t);}(t) || function(t, n) {if(!t) return; if("string" == typeof t) return h(t, n); var e = Object.prototype.toString.call(t).slice(8, -1); "Object" === e && t.constructor && (e = t.constructor.name); if("Map" === e || "Set" === e) return Array.from(t); if("Arguments" === e || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)) return h(t, n);}(t) || function() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}();} function h(t, n) {(null == n || n > t.length) && (n = t.length); for(var e = 0, i = new Array(n); e < n; e++)i[e] = t[e]; return i;} function s(t) {var n = function(t, n) {if("object" != typeof t || null === t) return t; var e = t[Symbol.toPrimitive]; if(void 0 !== e) {var i = e.call(t, n || "default"); if("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value.");} return ("string" === n ? String : Number)(t);}(t, "string"); return "symbol" == typeof n ? n : String(n);} var a = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}, o = /([astvzqmhlc])([^astvzqmhlc]*)/gi, g = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi, u = function(t) {var n = t.match(g); return n ? n.map(Number) : [];}, l = e((function(t, n, e, r) {var h = this; i(this, "x0", void 0), i(this, "x1", void 0), i(this, "y0", void 0), i(this, "y1", void 0), i(this, "getTotalLength", (function() {return Math.sqrt(Math.pow(h.x0 - h.x1, 2) + Math.pow(h.y0 - h.y1, 2));})), i(this, "getPointAtLength", (function(t) {var n = t / Math.sqrt(Math.pow(h.x0 - h.x1, 2) + Math.pow(h.y0 - h.y1, 2)); n = Number.isNaN(n) ? 1 : n; var e = (h.x1 - h.x0) * n, i = (h.y1 - h.y0) * n; return {x: h.x0 + e, y: h.y0 + i};})), i(this, "getTangentAtLength", (function(t) {var n = Math.sqrt((h.x1 - h.x0) * (h.x1 - h.x0) + (h.y1 - h.y0) * (h.y1 - h.y0)); return {x: (h.x1 - h.x0) / n, y: (h.y1 - h.y0) / n};})), i(this, "getPropertiesAtLength", (function(t) {var n = h.getPointAtLength(t), e = h.getTangentAtLength(t); return {x: n.x, y: n.y, tangentX: e.x, tangentY: e.y};})), this.x0 = t, this.x1 = n, this.y0 = e, this.y1 = r;})), c = e((function(t, n, e, r, h, s, a, o, g) {var u = this; i(this, "x0", void 0), i(this, "y0", void 0), i(this, "rx", void 0), i(this, "ry", void 0), i(this, "xAxisRotate", void 0), i(this, "LargeArcFlag", void 0), i(this, "SweepFlag", void 0), i(this, "x1", void 0), i(this, "y1", void 0), i(this, "length", void 0), i(this, "getTotalLength", (function() {return u.length;})), i(this, "getPointAtLength", (function(t) {t < 0 ? t = 0 : t > u.length && (t = u.length); var n = f({x: u.x0, y: u.y0}, u.rx, u.ry, u.xAxisRotate, u.LargeArcFlag, u.SweepFlag, {x: u.x1, y: u.y1}, t / u.length); return {x: n.x, y: n.y};})), i(this, "getTangentAtLength", (function(t) {t < 0 ? t = 0 : t > u.length && (t = u.length); var n, e = .05, i = u.getPointAtLength(t); t < 0 ? t = 0 : t > u.length && (t = u.length); var r = (n = t < u.length - e ? u.getPointAtLength(t + e) : u.getPointAtLength(t - e)).x - i.x, h = n.y - i.y, s = Math.sqrt(r * r + h * h); return t < u.length - e ? {x: -r / s, y: -h / s} : {x: r / s, y: h / s};})), i(this, "getPropertiesAtLength", (function(t) {var n = u.getTangentAtLength(t), e = u.getPointAtLength(t); return {x: e.x, y: e.y, tangentX: n.x, tangentY: n.y};})), this.x0 = t, this.y0 = n, this.rx = e, this.ry = r, this.xAxisRotate = h, this.LargeArcFlag = s, this.SweepFlag = a, this.x1 = o, this.y1 = g; var l = y(300, (function(i) {return f({x: t, y: n}, e, r, h, s, a, {x: o, y: g}, i);})); this.length = l.arcLength;})), f = function(t, n, e, i, r, h, s, a) {n = Math.abs(n), e = Math.abs(e), i = p(i, 360); var o = x(i); if(t.x === s.x && t.y === s.y) return {x: t.x, y: t.y, ellipticalArcAngle: 0}; if(0 === n || 0 === e) return {x: 0, y: 0, ellipticalArcAngle: 0}; var g = (t.x - s.x) / 2, u = (t.y - s.y) / 2, l = {x: Math.cos(o) * g + Math.sin(o) * u, y: -Math.sin(o) * g + Math.cos(o) * u}, c = Math.pow(l.x, 2) / Math.pow(n, 2) + Math.pow(l.y, 2) / Math.pow(e, 2); c > 1 && (n = Math.sqrt(c) * n, e = Math.sqrt(c) * e); var f = (Math.pow(n, 2) * Math.pow(e, 2) - Math.pow(n, 2) * Math.pow(l.y, 2) - Math.pow(e, 2) * Math.pow(l.x, 2)) / (Math.pow(n, 2) * Math.pow(l.y, 2) + Math.pow(e, 2) * Math.pow(l.x, 2)); f = f < 0 ? 0 : f; var y = (r !== h ? 1 : -1) * Math.sqrt(f), v = y * (n * l.y / e), M = y * (-e * l.x / n), L = {x: Math.cos(o) * v - Math.sin(o) * M + (t.x + s.x) / 2, y: Math.sin(o) * v + Math.cos(o) * M + (t.y + s.y) / 2}, d = {x: (l.x - v) / n, y: (l.y - M) / e}, A = w({x: 1, y: 0}, d), b = w(d, {x: (-l.x - v) / n, y: (-l.y - M) / e}); !h && b > 0 ? b -= 2 * Math.PI : h && b < 0 && (b += 2 * Math.PI); var P = A + (b %= 2 * Math.PI) * a, m = n * Math.cos(P), T = e * Math.sin(P); return {x: Math.cos(o) * m - Math.sin(o) * T + L.x, y: Math.sin(o) * m + Math.cos(o) * T + L.y, ellipticalArcStartAngle: A, ellipticalArcEndAngle: A + b, ellipticalArcAngle: P, ellipticalArcCenter: L, resultantRx: n, resultantRy: e};}, y = function(t, n) {t = t || 500; for(var e, i = 0, r = [], h = [], s = n(0), a = 0; a < t; a++) {var o = M(a * (1 / t), 0, 1); e = n(o), i += v(s, e), h.push([s, e]), r.push({t: o, arcLength: i}), s = e;} return e = n(1), h.push([s, e]), i += v(s, e), r.push({t: 1, arcLength: i}), {arcLength: i, arcLengthMap: r, approximationLines: h};}, p = function(t, n) {return (t % n + n) % n;}, x = function(t) {return t * (Math.PI / 180);}, v = function(t, n) {return Math.sqrt(Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2));}, M = function(t, n, e) {return Math.min(Math.max(t, n), e);}, w = function(t, n) {var e = t.x * n.x + t.y * n.y, i = Math.sqrt((Math.pow(t.x, 2) + Math.pow(t.y, 2)) * (Math.pow(n.x, 2) + Math.pow(n.y, 2))); return (t.x * n.y - t.y * n.x < 0 ? -1 : 1) * Math.acos(e / i);}, L = [[], [], [-.5773502691896257, .5773502691896257], [0, -.7745966692414834, .7745966692414834], [-.33998104358485626, .33998104358485626, -.8611363115940526, .8611363115940526], [0, -.5384693101056831, .5384693101056831, -.906179845938664, .906179845938664], [.6612093864662645, -.6612093864662645, -.2386191860831969, .2386191860831969, -.932469514203152, .932469514203152], [0, .4058451513773972, -.4058451513773972, -.7415311855993945, .7415311855993945, -.9491079123427585, .9491079123427585], [-.1834346424956498, .1834346424956498, -.525532409916329, .525532409916329, -.7966664774136267, .7966664774136267, -.9602898564975363, .9602898564975363], [0, -.8360311073266358, .8360311073266358, -.9681602395076261, .9681602395076261, -.3242534234038089, .3242534234038089, -.6133714327005904, .6133714327005904], [-.14887433898163122, .14887433898163122, -.4333953941292472, .4333953941292472, -.6794095682990244, .6794095682990244, -.8650633666889845, .8650633666889845, -.9739065285171717, .9739065285171717], [0, -.26954315595234496, .26954315595234496, -.5190961292068118, .5190961292068118, -.7301520055740494, .7301520055740494, -.8870625997680953, .8870625997680953, -.978228658146057, .978228658146057], [-.1252334085114689, .1252334085114689, -.3678314989981802, .3678314989981802, -.5873179542866175, .5873179542866175, -.7699026741943047, .7699026741943047, -.9041172563704749, .9041172563704749, -.9815606342467192, .9815606342467192], [0, -.2304583159551348, .2304583159551348, -.44849275103644687, .44849275103644687, -.6423493394403402, .6423493394403402, -.8015780907333099, .8015780907333099, -.9175983992229779, .9175983992229779, -.9841830547185881, .9841830547185881], [-.10805494870734367, .10805494870734367, -.31911236892788974, .31911236892788974, -.5152486363581541, .5152486363581541, -.6872929048116855, .6872929048116855, -.827201315069765, .827201315069765, -.9284348836635735, .9284348836635735, -.9862838086968123, .9862838086968123], [0, -.20119409399743451, .20119409399743451, -.3941513470775634, .3941513470775634, -.5709721726085388, .5709721726085388, -.7244177313601701, .7244177313601701, -.8482065834104272, .8482065834104272, -.937273392400706, .937273392400706, -.9879925180204854, .9879925180204854], [-.09501250983763744, .09501250983763744, -.2816035507792589, .2816035507792589, -.45801677765722737, .45801677765722737, -.6178762444026438, .6178762444026438, -.755404408355003, .755404408355003, -.8656312023878318, .8656312023878318, -.9445750230732326, .9445750230732326, -.9894009349916499, .9894009349916499], [0, -.17848418149584785, .17848418149584785, -.3512317634538763, .3512317634538763, -.5126905370864769, .5126905370864769, -.6576711592166907, .6576711592166907, -.7815140038968014, .7815140038968014, -.8802391537269859, .8802391537269859, -.9506755217687678, .9506755217687678, -.9905754753144174, .9905754753144174], [-.0847750130417353, .0847750130417353, -.2518862256915055, .2518862256915055, -.41175116146284263, .41175116146284263, -.5597708310739475, .5597708310739475, -.6916870430603532, .6916870430603532, -.8037049589725231, .8037049589725231, -.8926024664975557, .8926024664975557, -.9558239495713977, .9558239495713977, -.9915651684209309, .9915651684209309], [0, -.16035864564022537, .16035864564022537, -.31656409996362983, .31656409996362983, -.46457074137596094, .46457074137596094, -.600545304661681, .600545304661681, -.7209661773352294, .7209661773352294, -.8227146565371428, .8227146565371428, -.9031559036148179, .9031559036148179, -.96020815213483, .96020815213483, -.9924068438435844, .9924068438435844], [-.07652652113349734, .07652652113349734, -.22778585114164507, .22778585114164507, -.37370608871541955, .37370608871541955, -.5108670019508271, .5108670019508271, -.636053680726515, .636053680726515, -.7463319064601508, .7463319064601508, -.8391169718222188, .8391169718222188, -.912234428251326, .912234428251326, -.9639719272779138, .9639719272779138, -.9931285991850949, .9931285991850949], [0, -.1455618541608951, .1455618541608951, -.2880213168024011, .2880213168024011, -.4243421202074388, .4243421202074388, -.5516188358872198, .5516188358872198, -.6671388041974123, .6671388041974123, -.7684399634756779, .7684399634756779, -.8533633645833173, .8533633645833173, -.9200993341504008, .9200993341504008, -.9672268385663063, .9672268385663063, -.9937521706203895, .9937521706203895], [-.06973927331972223, .06973927331972223, -.20786042668822127, .20786042668822127, -.34193582089208424, .34193582089208424, -.469355837986757, .469355837986757, -.5876404035069116, .5876404035069116, -.6944872631866827, .6944872631866827, -.7878168059792081, .7878168059792081, -.8658125777203002, .8658125777203002, -.926956772187174, .926956772187174, -.9700604978354287, .9700604978354287, -.9942945854823992, .9942945854823992], [0, -.1332568242984661, .1332568242984661, -.26413568097034495, .26413568097034495, -.3903010380302908, .3903010380302908, -.5095014778460075, .5095014778460075, -.6196098757636461, .6196098757636461, -.7186613631319502, .7186613631319502, -.8048884016188399, .8048884016188399, -.8767523582704416, .8767523582704416, -.9329710868260161, .9329710868260161, -.9725424712181152, .9725424712181152, -.9947693349975522, .9947693349975522], [-.06405689286260563, .06405689286260563, -.1911188674736163, .1911188674736163, -.3150426796961634, .3150426796961634, -.4337935076260451, .4337935076260451, -.5454214713888396, .5454214713888396, -.6480936519369755, .6480936519369755, -.7401241915785544, .7401241915785544, -.820001985973903, .820001985973903, -.8864155270044011, .8864155270044011, -.9382745520027328, .9382745520027328, -.9747285559713095, .9747285559713095, -.9951872199970213, .9951872199970213]], d = [[], [], [1, 1], [.8888888888888888, .5555555555555556, .5555555555555556], [.6521451548625461, .6521451548625461, .34785484513745385, .34785484513745385], [.5688888888888889, .47862867049936647, .47862867049936647, .23692688505618908, .23692688505618908], [.3607615730481386, .3607615730481386, .46791393457269104, .46791393457269104, .17132449237917036, .17132449237917036], [.4179591836734694, .3818300505051189, .3818300505051189, .27970539148927664, .27970539148927664, .1294849661688697, .1294849661688697], [.362683783378362, .362683783378362, .31370664587788727, .31370664587788727, .22238103445337448, .22238103445337448, .10122853629037626, .10122853629037626], [.3302393550012598, .1806481606948574, .1806481606948574, .08127438836157441, .08127438836157441, .31234707704000286, .31234707704000286, .26061069640293544, .26061069640293544], [.29552422471475287, .29552422471475287, .26926671930999635, .26926671930999635, .21908636251598204, .21908636251598204, .1494513491505806, .1494513491505806, .06667134430868814, .06667134430868814], [.2729250867779006, .26280454451024665, .26280454451024665, .23319376459199048, .23319376459199048, .18629021092773426, .18629021092773426, .1255803694649046, .1255803694649046, .05566856711617366, .05566856711617366], [.24914704581340277, .24914704581340277, .2334925365383548, .2334925365383548, .20316742672306592, .20316742672306592, .16007832854334622, .16007832854334622, .10693932599531843, .10693932599531843, .04717533638651183, .04717533638651183], [.2325515532308739, .22628318026289723, .22628318026289723, .2078160475368885, .2078160475368885, .17814598076194574, .17814598076194574, .13887351021978725, .13887351021978725, .09212149983772845, .09212149983772845, .04048400476531588, .04048400476531588], [.2152638534631578, .2152638534631578, .2051984637212956, .2051984637212956, .18553839747793782, .18553839747793782, .15720316715819355, .15720316715819355, .12151857068790319, .12151857068790319, .08015808715976021, .08015808715976021, .03511946033175186, .03511946033175186], [.2025782419255613, .19843148532711158, .19843148532711158, .1861610000155622, .1861610000155622, .16626920581699392, .16626920581699392, .13957067792615432, .13957067792615432, .10715922046717194, .10715922046717194, .07036604748810812, .07036604748810812, .03075324199611727, .03075324199611727], [.1894506104550685, .1894506104550685, .18260341504492358, .18260341504492358, .16915651939500254, .16915651939500254, .14959598881657674, .14959598881657674, .12462897125553388, .12462897125553388, .09515851168249279, .09515851168249279, .062253523938647894, .062253523938647894, .027152459411754096, .027152459411754096], [.17944647035620653, .17656270536699264, .17656270536699264, .16800410215645004, .16800410215645004, .15404576107681028, .15404576107681028, .13513636846852548, .13513636846852548, .11188384719340397, .11188384719340397, .08503614831717918, .08503614831717918, .0554595293739872, .0554595293739872, .02414830286854793, .02414830286854793], [.1691423829631436, .1691423829631436, .16427648374583273, .16427648374583273, .15468467512626524, .15468467512626524, .14064291467065065, .14064291467065065, .12255520671147846, .12255520671147846, .10094204410628717, .10094204410628717, .07642573025488905, .07642573025488905, .0497145488949698, .0497145488949698, .02161601352648331, .02161601352648331], [.1610544498487837, .15896884339395434, .15896884339395434, .15276604206585967, .15276604206585967, .1426067021736066, .1426067021736066, .12875396253933621, .12875396253933621, .11156664554733399, .11156664554733399, .09149002162245, .09149002162245, .06904454273764123, .06904454273764123, .0448142267656996, .0448142267656996, .019461788229726478, .019461788229726478], [.15275338713072584, .15275338713072584, .14917298647260374, .14917298647260374, .14209610931838204, .14209610931838204, .13168863844917664, .13168863844917664, .11819453196151841, .11819453196151841, .10193011981724044, .10193011981724044, .08327674157670475, .08327674157670475, .06267204833410907, .06267204833410907, .04060142980038694, .04060142980038694, .017614007139152118, .017614007139152118], [.14608113364969041, .14452440398997005, .14452440398997005, .13988739479107315, .13988739479107315, .13226893863333747, .13226893863333747, .12183141605372853, .12183141605372853, .10879729916714838, .10879729916714838, .09344442345603386, .09344442345603386, .0761001136283793, .0761001136283793, .057134425426857205, .057134425426857205, .036953789770852494, .036953789770852494, .016017228257774335, .016017228257774335], [.13925187285563198, .13925187285563198, .13654149834601517, .13654149834601517, .13117350478706238, .13117350478706238, .12325237681051242, .12325237681051242, .11293229608053922, .11293229608053922, .10041414444288096, .10041414444288096, .08594160621706773, .08594160621706773, .06979646842452049, .06979646842452049, .052293335152683286, .052293335152683286, .03377490158481415, .03377490158481415, .0146279952982722, .0146279952982722], [.13365457218610619, .1324620394046966, .1324620394046966, .12890572218808216, .12890572218808216, .12304908430672953, .12304908430672953, .11499664022241136, .11499664022241136, .10489209146454141, .10489209146454141, .09291576606003515, .09291576606003515, .07928141177671895, .07928141177671895, .06423242140852585, .06423242140852585, .04803767173108467, .04803767173108467, .030988005856979445, .030988005856979445, .013411859487141771, .013411859487141771], [.12793819534675216, .12793819534675216, .1258374563468283, .1258374563468283, .12167047292780339, .12167047292780339, .1155056680537256, .1155056680537256, .10744427011596563, .10744427011596563, .09761865210411388, .09761865210411388, .08619016153195327, .08619016153195327, .0733464814110803, .0733464814110803, .05929858491543678, .05929858491543678, .04427743881741981, .04427743881741981, .028531388628933663, .028531388628933663, .0123412297999872, .0123412297999872]], A = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]], b = function(t, n, e) {return {x: (1 - e) * (1 - e) * (1 - e) * t[0] + 3 * (1 - e) * (1 - e) * e * t[1] + 3 * (1 - e) * e * e * t[2] + e * e * e * t[3], y: (1 - e) * (1 - e) * (1 - e) * n[0] + 3 * (1 - e) * (1 - e) * e * n[1] + 3 * (1 - e) * e * e * n[2] + e * e * e * n[3]};}, P = function(t, n, e) {return T([3 * (t[1] - t[0]), 3 * (t[2] - t[1]), 3 * (t[3] - t[2])], [3 * (n[1] - n[0]), 3 * (n[2] - n[1]), 3 * (n[3] - n[2])], e);}, m = function(t, n, e) {var i, r, h; i = e / 2, r = 0; for(var s = 0; s < 20; s++)h = i * L[20][s] + i, r += d[20][s] * S(t, n, h); return i * r;}, T = function(t, n, e) {return {x: (1 - e) * (1 - e) * t[0] + 2 * (1 - e) * e * t[1] + e * e * t[2], y: (1 - e) * (1 - e) * n[0] + 2 * (1 - e) * e * n[1] + e * e * n[2]};}, q = function(t, n, e) {void 0 === e && (e = 1); var i = t[0] - 2 * t[1] + t[2], r = n[0] - 2 * n[1] + n[2], h = 2 * t[1] - 2 * t[0], s = 2 * n[1] - 2 * n[0], a = 4 * (i * i + r * r), o = 4 * (i * h + r * s), g = h * h + s * s; if(0 === a) return e * Math.sqrt(Math.pow(t[2] - t[0], 2) + Math.pow(n[2] - n[0], 2)); var u = o / (2 * a), l = e + u, c = g / a - u * u, f = l * l + c > 0 ? Math.sqrt(l * l + c) : 0, y = u * u + c > 0 ? Math.sqrt(u * u + c) : 0, p = u + Math.sqrt(u * u + c) !== 0 && (l + f) / (u + y) != 0 ? c * Math.log(Math.abs((l + f) / (u + y))) : 0; return Math.sqrt(a) / 2 * (l * f - u * y + p);}, _ = function(t, n, e) {return {x: 2 * (1 - e) * (t[1] - t[0]) + 2 * e * (t[2] - t[1]), y: 2 * (1 - e) * (n[1] - n[0]) + 2 * e * (n[2] - n[1])};}; function S(t, n, e) {var i = N(1, e, t), r = N(1, e, n), h = i * i + r * r; return Math.sqrt(h);} var N = function t(n, e, i) {var r, h, s = i.length - 1; if(0 === s) return 0; if(0 === n) {h = 0; for(var a = 0; a <= s; a++)h += A[s][a] * Math.pow(1 - e, s - a) * Math.pow(e, a) * i[a]; return h;} r = new Array(s); for(var o = 0; o < s; o++)r[o] = s * (i[o + 1] - i[o]); return t(n - 1, e, r);}, C = function(t, n, e) {for(var i = 1, r = t / n, h = (t - e(r)) / n, s = 0; i > .001;) {var a = e(r + h), o = Math.abs(t - a) / n; if(o < i) i = o, r += h; else {var g = e(r - h), u = Math.abs(t - g) / n; u < i ? (i = u, r -= h) : h /= 2;} if(++s > 500) break;} return r;}, j = e((function(t, n, e, r, h, s, a, o) {var g = this; i(this, "a", void 0), i(this, "b", void 0), i(this, "c", void 0), i(this, "d", void 0), i(this, "length", void 0), i(this, "getArcLength", void 0), i(this, "getPoint", void 0), i(this, "getDerivative", void 0), i(this, "getTotalLength", (function() {return g.length;})), i(this, "getPointAtLength", (function(t) {var n = [g.a.x, g.b.x, g.c.x, g.d.x], e = [g.a.y, g.b.y, g.c.y, g.d.y], i = C(t, g.length, (function(t) {return g.getArcLength(n, e, t);})); return g.getPoint(n, e, i);})), i(this, "getTangentAtLength", (function(t) {var n = [g.a.x, g.b.x, g.c.x, g.d.x], e = [g.a.y, g.b.y, g.c.y, g.d.y], i = C(t, g.length, (function(t) {return g.getArcLength(n, e, t);})), r = g.getDerivative(n, e, i), h = Math.sqrt(r.x * r.x + r.y * r.y); return h > 0 ? {x: r.x / h, y: r.y / h} : {x: 0, y: 0};})), i(this, "getPropertiesAtLength", (function(t) {var n, e = [g.a.x, g.b.x, g.c.x, g.d.x], i = [g.a.y, g.b.y, g.c.y, g.d.y], r = C(t, g.length, (function(t) {return g.getArcLength(e, i, t);})), h = g.getDerivative(e, i, r), s = Math.sqrt(h.x * h.x + h.y * h.y); n = s > 0 ? {x: h.x / s, y: h.y / s} : {x: 0, y: 0}; var a = g.getPoint(e, i, r); return {x: a.x, y: a.y, tangentX: n.x, tangentY: n.y};})), i(this, "getC", (function() {return g.c;})), i(this, "getD", (function() {return g.d;})), this.a = {x: t, y: n}, this.b = {x: e, y: r}, this.c = {x: h, y: s}, void 0 !== a && void 0 !== o ? (this.getArcLength = m, this.getPoint = b, this.getDerivative = P, this.d = {x: a, y: o}) : (this.getArcLength = q, this.getPoint = T, this.getDerivative = _, this.d = {x: 0, y: 0}), this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], 1);})), O = e((function(t) {var n = this; i(this, "length", 0), i(this, "partial_lengths", []), i(this, "functions", []), i(this, "initial_point", null), i(this, "getPartAtLength", (function(t) {t < 0 ? t = 0 : t > n.length && (t = n.length); for(var e = n.partial_lengths.length - 1; n.partial_lengths[e] >= t && e > 0;)e--; return e++, {fraction: t - n.partial_lengths[e - 1], i: e};})), i(this, "getTotalLength", (function() {return n.length;})), i(this, "getPointAtLength", (function(t) {var e = n.getPartAtLength(t), i = n.functions[e.i]; if(i) return i.getPointAtLength(e.fraction); if(n.initial_point) return n.initial_point; throw new Error("Wrong function at this part.");})), i(this, "getTangentAtLength", (function(t) {var e = n.getPartAtLength(t), i = n.functions[e.i]; if(i) return i.getTangentAtLength(e.fraction); if(n.initial_point) return {x: 0, y: 0}; throw new Error("Wrong function at this part.");})), i(this, "getPropertiesAtLength", (function(t) {var e = n.getPartAtLength(t), i = n.functions[e.i]; if(i) return i.getPropertiesAtLength(e.fraction); if(n.initial_point) return {x: n.initial_point.x, y: n.initial_point.y, tangentX: 0, tangentY: 0}; throw new Error("Wrong function at this part.");})), i(this, "getParts", (function() {for(var t = [], e = 0; e < n.functions.length; e++)if(null !== n.functions[e]) {n.functions[e] = n.functions[e]; var i = {start: n.functions[e].getPointAtLength(0), end: n.functions[e].getPointAtLength(n.partial_lengths[e] - n.partial_lengths[e - 1]), length: n.partial_lengths[e] - n.partial_lengths[e - 1], getPointAtLength: n.functions[e].getPointAtLength, getTangentAtLength: n.functions[e].getTangentAtLength, getPropertiesAtLength: n.functions[e].getPropertiesAtLength}; t.push(i);} return t;})); for(var e, h = Array.isArray(t) ? t : function(t) {var n = (t && t.length > 0 ? t : "M0,0").match(o); if(!n) throw new Error("No path elements found in string ".concat(t)); return n.reduce((function(t, n) {var e = n.charAt(0), i = e.toLowerCase(), h = u(n.substring(1)); if("m" === i && h.length > 2 && (t.push([e].concat(r(h.splice(0, 2)))), i = "l", e = "m" === e ? "l" : "L"), "a" === i.toLowerCase() && (5 === h.length || 6 === h.length)) {var s = n.substring(1).trim().split(" "); h = [Number(s[0]), Number(s[1]), Number(s[2]), Number(s[3].charAt(0)), Number(s[3].charAt(1)), Number(s[3].substring(2)), Number(s[4])];} for(; h.length >= 0;) {if(h.length === a[i]) {t.push([e].concat(r(h.splice(0, a[i])))); break;} if(h.length < a[i]) throw new Error('Malformed path data: "'.concat(e, '" must have ').concat(a[i], " elements and has ").concat(h.length, ": ").concat(n)); t.push([e].concat(r(h.splice(0, a[i]))));} return t;}), []);}(t), s = [0, 0], g = [0, 0], f = [0, 0], y = 0; y < h.length; y++) {if("M" === h[y][0]) f = [(s = [h[y][1], h[y][2]])[0], s[1]], this.functions.push(null), 0 === y && (this.initial_point = {x: h[y][1], y: h[y][2]}); else if("m" === h[y][0]) f = [(s = [h[y][1] + s[0], h[y][2] + s[1]])[0], s[1]], this.functions.push(null); else if("L" === h[y][0]) this.length += Math.sqrt(Math.pow(s[0] - h[y][1], 2) + Math.pow(s[1] - h[y][2], 2)), this.functions.push(new l(s[0], h[y][1], s[1], h[y][2])), s = [h[y][1], h[y][2]]; else if("l" === h[y][0]) this.length += Math.sqrt(Math.pow(h[y][1], 2) + Math.pow(h[y][2], 2)), this.functions.push(new l(s[0], h[y][1] + s[0], s[1], h[y][2] + s[1])), s = [h[y][1] + s[0], h[y][2] + s[1]]; else if("H" === h[y][0]) this.length += Math.abs(s[0] - h[y][1]), this.functions.push(new l(s[0], h[y][1], s[1], s[1])), s[0] = h[y][1]; else if("h" === h[y][0]) this.length += Math.abs(h[y][1]), this.functions.push(new l(s[0], s[0] + h[y][1], s[1], s[1])), s[0] = h[y][1] + s[0]; else if("V" === h[y][0]) this.length += Math.abs(s[1] - h[y][1]), this.functions.push(new l(s[0], s[0], s[1], h[y][1])), s[1] = h[y][1]; else if("v" === h[y][0]) this.length += Math.abs(h[y][1]), this.functions.push(new l(s[0], s[0], s[1], s[1] + h[y][1])), s[1] = h[y][1] + s[1]; else if("z" === h[y][0] || "Z" === h[y][0]) this.length += Math.sqrt(Math.pow(f[0] - s[0], 2) + Math.pow(f[1] - s[1], 2)), this.functions.push(new l(s[0], f[0], s[1], f[1])), s = [f[0], f[1]]; else if("C" === h[y][0]) e = new j(s[0], s[1], h[y][1], h[y][2], h[y][3], h[y][4], h[y][5], h[y][6]), this.length += e.getTotalLength(), s = [h[y][5], h[y][6]], this.functions.push(e); else if("c" === h[y][0]) (e = new j(s[0], s[1], s[0] + h[y][1], s[1] + h[y][2], s[0] + h[y][3], s[1] + h[y][4], s[0] + h[y][5], s[1] + h[y][6])).getTotalLength() > 0 ? (this.length += e.getTotalLength(), this.functions.push(e), s = [h[y][5] + s[0], h[y][6] + s[1]]) : this.functions.push(new l(s[0], s[0], s[1], s[1])); else if("S" === h[y][0]) {if(y > 0 && ["C", "c", "S", "s"].indexOf(h[y - 1][0]) > -1) {if(e) {var p = e.getC(); e = new j(s[0], s[1], 2 * s[0] - p.x, 2 * s[1] - p.y, h[y][1], h[y][2], h[y][3], h[y][4]);} } else e = new j(s[0], s[1], s[0], s[1], h[y][1], h[y][2], h[y][3], h[y][4]); e && (this.length += e.getTotalLength(), s = [h[y][3], h[y][4]], this.functions.push(e));} else if("s" === h[y][0]) {if(y > 0 && ["C", "c", "S", "s"].indexOf(h[y - 1][0]) > -1) {if(e) {var x = e.getC(), v = e.getD(); e = new j(s[0], s[1], s[0] + v.x - x.x, s[1] + v.y - x.y, s[0] + h[y][1], s[1] + h[y][2], s[0] + h[y][3], s[1] + h[y][4]);} } else e = new j(s[0], s[1], s[0], s[1], s[0] + h[y][1], s[1] + h[y][2], s[0] + h[y][3], s[1] + h[y][4]); e && (this.length += e.getTotalLength(), s = [h[y][3] + s[0], h[y][4] + s[1]], this.functions.push(e));} else if("Q" === h[y][0]) {if(s[0] == h[y][1] && s[1] == h[y][2]) {var M = new l(h[y][1], h[y][3], h[y][2], h[y][4]); this.length += M.getTotalLength(), this.functions.push(M);} else e = new j(s[0], s[1], h[y][1], h[y][2], h[y][3], h[y][4], void 0, void 0), this.length += e.getTotalLength(), this.functions.push(e); s = [h[y][3], h[y][4]], g = [h[y][1], h[y][2]];} else if("q" === h[y][0]) {if(0 != h[y][1] || 0 != h[y][2]) e = new j(s[0], s[1], s[0] + h[y][1], s[1] + h[y][2], s[0] + h[y][3], s[1] + h[y][4], void 0, void 0), this.length += e.getTotalLength(), this.functions.push(e); else {var w = new l(s[0] + h[y][1], s[0] + h[y][3], s[1] + h[y][2], s[1] + h[y][4]); this.length += w.getTotalLength(), this.functions.push(w);} g = [s[0] + h[y][1], s[1] + h[y][2]], s = [h[y][3] + s[0], h[y][4] + s[1]];} else if("T" === h[y][0]) {if(y > 0 && ["Q", "q", "T", "t"].indexOf(h[y - 1][0]) > -1) e = new j(s[0], s[1], 2 * s[0] - g[0], 2 * s[1] - g[1], h[y][1], h[y][2], void 0, void 0), this.functions.push(e), this.length += e.getTotalLength(); else {var L = new l(s[0], h[y][1], s[1], h[y][2]); this.functions.push(L), this.length += L.getTotalLength();} g = [2 * s[0] - g[0], 2 * s[1] - g[1]], s = [h[y][1], h[y][2]];} else if("t" === h[y][0]) {if(y > 0 && ["Q", "q", "T", "t"].indexOf(h[y - 1][0]) > -1) e = new j(s[0], s[1], 2 * s[0] - g[0], 2 * s[1] - g[1], s[0] + h[y][1], s[1] + h[y][2], void 0, void 0), this.length += e.getTotalLength(), this.functions.push(e); else {var d = new l(s[0], s[0] + h[y][1], s[1], s[1] + h[y][2]); this.length += d.getTotalLength(), this.functions.push(d);} g = [2 * s[0] - g[0], 2 * s[1] - g[1]], s = [h[y][1] + s[0], h[y][2] + s[1]];} else if("A" === h[y][0]) {var A = new c(s[0], s[1], h[y][1], h[y][2], h[y][3], 1 === h[y][4], 1 === h[y][5], h[y][6], h[y][7]); this.length += A.getTotalLength(), s = [h[y][6], h[y][7]], this.functions.push(A);} else if("a" === h[y][0]) {var b = new c(s[0], s[1], h[y][1], h[y][2], h[y][3], 1 === h[y][4], 1 === h[y][5], s[0] + h[y][6], s[1] + h[y][7]); this.length += b.getTotalLength(), s = [s[0] + h[y][6], s[1] + h[y][7]], this.functions.push(b);} this.partial_lengths.push(this.length);} })), E = e((function(t) {var n = this; if(i(this, "inst", void 0), i(this, "getTotalLength", (function() {return n.inst.getTotalLength();})), i(this, "getPointAtLength", (function(t) {return n.inst.getPointAtLength(t);})), i(this, "getTangentAtLength", (function(t) {return n.inst.getTangentAtLength(t);})), i(this, "getPropertiesAtLength", (function(t) {return n.inst.getPropertiesAtLength(t);})), i(this, "getParts", (function() {return n.inst.getParts();})), this.inst = new O(t), !(this instanceof E)) return new E(t);})); t.svgPathProperties = E;}));
