window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    "use strict";
    var __importDefault = this && this.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : {
        default: mod
      };
    };
    const simplex_noise_js_1 = __importDefault(require("./simplex-noise.js"));
    simplex_noise_js_1.default["SimplexNoise"] = simplex_noise_js_1.default;
    module.exports = simplex_noise_js_1.default;
  }, {
    "./simplex-noise.js": 2
  } ],
  2: [ function(require, module, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.buildPermutationTable = exports.SimplexNoise = void 0;
    const F2 = .5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const F3 = 1 / 3;
    const G3 = 1 / 6;
    const F4 = (Math.sqrt(5) - 1) / 4;
    const G4 = (5 - Math.sqrt(5)) / 20;
    const grad3 = new Float32Array([ 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1 ]);
    const grad4 = new Float32Array([ 0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0 ]);
    class SimplexNoise {
      constructor(randomOrSeed = Math.random) {
        const random = "function" == typeof randomOrSeed ? randomOrSeed : alea(randomOrSeed);
        this.p = buildPermutationTable(random);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 512; i++) {
          this.perm[i] = this.p[255 & i];
          this.permMod12[i] = this.perm[i] % 12;
        }
      }
      noise2D(x, y) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0 = 0;
        let n1 = 0;
        let n2 = 0;
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        let i1, j1;
        if (x0 > y0) {
          i1 = 1;
          j1 = 0;
        } else {
          i1 = 0;
          j1 = 1;
        }
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;
        const ii = 255 & i;
        const jj = 255 & j;
        let t0 = .5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          const gi0 = 3 * permMod12[ii + perm[jj]];
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
        }
        let t1 = .5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          const gi1 = 3 * permMod12[ii + i1 + perm[jj + j1]];
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        let t2 = .5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          const gi2 = 3 * permMod12[ii + 1 + perm[jj + 1]];
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        return 70 * (n0 + n1 + n2);
      }
      noise3D(x, y, z) {
        const permMod12 = this.permMod12;
        const perm = this.perm;
        let n0, n1, n2, n3;
        const s = (x + y + z) * F3;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        let i1, j1, k1;
        let i2, j2, k2;
        if (x0 >= y0) if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } else if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        }
        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2 * G3;
        const y2 = y0 - j2 + 2 * G3;
        const z2 = z0 - k2 + 2 * G3;
        const x3 = x0 - 1 + 3 * G3;
        const y3 = y0 - 1 + 3 * G3;
        const z3 = z0 - 1 + 3 * G3;
        const ii = 255 & i;
        const jj = 255 & j;
        const kk = 255 & k;
        let t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0; else {
          const gi0 = 3 * permMod12[ii + perm[jj + perm[kk]]];
          t0 *= t0;
          n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
        }
        let t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0; else {
          const gi1 = 3 * permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
          t1 *= t1;
          n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
        }
        let t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0; else {
          const gi2 = 3 * permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
          t2 *= t2;
          n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
        }
        let t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0; else {
          const gi3 = 3 * permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
          t3 *= t3;
          n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
        }
        return 32 * (n0 + n1 + n2 + n3);
      }
      noise4D(x, y, z, w) {
        const perm = this.perm;
        let n0, n1, n2, n3, n4;
        const s = (x + y + z + w) * F4;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);
        const l = Math.floor(w + s);
        const t = (i + j + k + l) * G4;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const W0 = l - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;
        const w0 = w - W0;
        let rankx = 0;
        let ranky = 0;
        let rankz = 0;
        let rankw = 0;
        x0 > y0 ? rankx++ : ranky++;
        x0 > z0 ? rankx++ : rankz++;
        x0 > w0 ? rankx++ : rankw++;
        y0 > z0 ? ranky++ : rankz++;
        y0 > w0 ? ranky++ : rankw++;
        z0 > w0 ? rankz++ : rankw++;
        const i1 = rankx >= 3 ? 1 : 0;
        const j1 = ranky >= 3 ? 1 : 0;
        const k1 = rankz >= 3 ? 1 : 0;
        const l1 = rankw >= 3 ? 1 : 0;
        const i2 = rankx >= 2 ? 1 : 0;
        const j2 = ranky >= 2 ? 1 : 0;
        const k2 = rankz >= 2 ? 1 : 0;
        const l2 = rankw >= 2 ? 1 : 0;
        const i3 = rankx >= 1 ? 1 : 0;
        const j3 = ranky >= 1 ? 1 : 0;
        const k3 = rankz >= 1 ? 1 : 0;
        const l3 = rankw >= 1 ? 1 : 0;
        const x1 = x0 - i1 + G4;
        const y1 = y0 - j1 + G4;
        const z1 = z0 - k1 + G4;
        const w1 = w0 - l1 + G4;
        const x2 = x0 - i2 + 2 * G4;
        const y2 = y0 - j2 + 2 * G4;
        const z2 = z0 - k2 + 2 * G4;
        const w2 = w0 - l2 + 2 * G4;
        const x3 = x0 - i3 + 3 * G4;
        const y3 = y0 - j3 + 3 * G4;
        const z3 = z0 - k3 + 3 * G4;
        const w3 = w0 - l3 + 3 * G4;
        const x4 = x0 - 1 + 4 * G4;
        const y4 = y0 - 1 + 4 * G4;
        const z4 = z0 - 1 + 4 * G4;
        const w4 = w0 - 1 + 4 * G4;
        const ii = 255 & i;
        const jj = 255 & j;
        const kk = 255 & k;
        const ll = 255 & l;
        let t0 = .6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
        if (t0 < 0) n0 = 0; else {
          const gi0 = perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32 * 4;
          t0 *= t0;
          n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
        }
        let t1 = .6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
        if (t1 < 0) n1 = 0; else {
          const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32 * 4;
          t1 *= t1;
          n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
        }
        let t2 = .6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
        if (t2 < 0) n2 = 0; else {
          const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32 * 4;
          t2 *= t2;
          n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
        }
        let t3 = .6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
        if (t3 < 0) n3 = 0; else {
          const gi3 = perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32 * 4;
          t3 *= t3;
          n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
        }
        let t4 = .6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
        if (t4 < 0) n4 = 0; else {
          const gi4 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32 * 4;
          t4 *= t4;
          n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
        }
        return 27 * (n0 + n1 + n2 + n3 + n4);
      }
    }
    exports.SimplexNoise = SimplexNoise;
    exports.default = SimplexNoise;
    function buildPermutationTable(random) {
      const p = new Uint8Array(256);
      for (let i = 0; i < 256; i++) p[i] = i;
      for (let i = 0; i < 255; i++) {
        const r = i + ~~(random() * (256 - i));
        const aux = p[i];
        p[i] = p[r];
        p[r] = aux;
      }
      return p;
    }
    exports.buildPermutationTable = buildPermutationTable;
    function alea(seed) {
      let s0 = 0;
      let s1 = 0;
      let s2 = 0;
      let c = 1;
      const mash = masher();
      s0 = mash(" ");
      s1 = mash(" ");
      s2 = mash(" ");
      s0 -= mash(seed);
      s0 < 0 && (s0 += 1);
      s1 -= mash(seed);
      s1 < 0 && (s1 += 1);
      s2 -= mash(seed);
      s2 < 0 && (s2 += 1);
      return function() {
        const t = 2091639 * s0 + 2.3283064365386963e-10 * c;
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = 0 | t);
      };
    }
    function masher() {
      let n = 4022871197;
      return function(data) {
        data = data.toString();
        for (let i = 0; i < data.length; i++) {
          n += data.charCodeAt(i);
          let h = .02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += 4294967296 * h;
        }
        return 2.3283064365386963e-10 * (n >>> 0);
      };
    }
  }, {} ],
  3: [ function(require, module, exports) {
    "use strict";
    var tweenFunctions = {
      linear: function(t, b, _c, d) {
        var c = _c - b;
        return c * t / d + b;
      },
      easeInQuad: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t + b;
      },
      easeOutQuad: function(t, b, _c, d) {
        var c = _c - b;
        return -c * (t /= d) * (t - 2) + b;
      },
      easeInOutQuad: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
      },
      easeInCubic: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t + b;
      },
      easeOutCubic: function(t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
      easeInOutCubic: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;
      },
      easeInQuart: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t + b;
      },
      easeOutQuart: function(t, b, _c, d) {
        var c = _c - b;
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
      },
      easeInOutQuart: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      },
      easeInQuint: function(t, b, _c, d) {
        var c = _c - b;
        return c * (t /= d) * t * t * t * t + b;
      },
      easeOutQuint: function(t, b, _c, d) {
        var c = _c - b;
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
      },
      easeInOutQuint: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      },
      easeInSine: function(t, b, _c, d) {
        var c = _c - b;
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
      },
      easeOutSine: function(t, b, _c, d) {
        var c = _c - b;
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
      },
      easeInOutSine: function(t, b, _c, d) {
        var c = _c - b;
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
      },
      easeInExpo: function(t, b, _c, d) {
        var c = _c - b;
        return 0 == t ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
      },
      easeOutExpo: function(t, b, _c, d) {
        var c = _c - b;
        return t == d ? b + c : c * (1 - Math.pow(2, -10 * t / d)) + b;
      },
      easeInOutExpo: function(t, b, _c, d) {
        var c = _c - b;
        if (0 === t) return b;
        if (t === d) return b + c;
        return (t /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (2 - Math.pow(2, -10 * --t)) + b;
      },
      easeInCirc: function(t, b, _c, d) {
        var c = _c - b;
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
      },
      easeOutCirc: function(t, b, _c, d) {
        var c = _c - b;
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
      },
      easeInOutCirc: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - t * t) - 1) + b : c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      },
      easeInElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (1 === (t /= d)) return b + c;
        p || (p = .3 * d);
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return -a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) + b;
      },
      easeOutElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (1 === (t /= d)) return b + c;
        p || (p = .3 * d);
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
      },
      easeInOutElastic: function(t, b, _c, d) {
        var c = _c - b;
        var a, p, s;
        s = 1.70158;
        p = 0;
        a = c;
        if (0 === t) return b;
        if (2 === (t /= d / 2)) return b + c;
        p || (p = d * (.3 * 1.5));
        if (a < Math.abs(c)) {
          a = c;
          s = p / 4;
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        return t < 1 ? a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * -.5 + b : a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      },
      easeInBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
      },
      easeOutBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
      },
      easeInOutBack: function(t, b, _c, d, s) {
        var c = _c - b;
        void 0 === s && (s = 1.70158);
        return (t /= d / 2) < 1 ? c / 2 * (t * t * ((1 + (s *= 1.525)) * t - s)) + b : c / 2 * ((t -= 2) * t * ((1 + (s *= 1.525)) * t + s) + 2) + b;
      },
      easeInBounce: function(t, b, _c, d) {
        var c = _c - b;
        var v;
        v = tweenFunctions.easeOutBounce(d - t, 0, c, d);
        return c - v + b;
      },
      easeOutBounce: function(t, b, _c, d) {
        var c = _c - b;
        return (t /= d) < 1 / 2.75 ? c * (7.5625 * t * t) + b : t < 2 / 2.75 ? c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b : t < 2.5 / 2.75 ? c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      },
      easeInOutBounce: function(t, b, _c, d) {
        var c = _c - b;
        var v;
        if (t < d / 2) {
          v = tweenFunctions.easeInBounce(2 * t, 0, c, d);
          return .5 * v + b;
        }
        v = tweenFunctions.easeOutBounce(2 * t - d, 0, c, d);
        return .5 * v + .5 * c + b;
      }
    };
    module.exports = tweenFunctions;
  }, {} ],
  BagBoosterItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "522aaV68pdPjKN16YogApeQ", "BagBoosterItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.button.on("click", this.onClicked, this);
      },
      loadData: function loadData(data, onItemClicked) {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.data = data;
        this.onItemClicked = onItemClicked;
        this.icon.spriteFrame = this[data.id];
        this.quantityLabel.string = "x" + (data.amount || 0);
      },
      updateNumber: function updateNumber(number) {
        this.quantityLabel.string = "x" + (0 | number);
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {} ],
  BagSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "813cbcI64NCwrG5dM76T4yo", "BagSubscene");
    "use strict";
    var _constants = _interopRequireDefault(require("../../constants"));
    var _userState = _interopRequireDefault(require("../../userState"));
    var _yard = _interopRequireDefault(require("../../staticData/yard"));
    var _supplyModel = _interopRequireDefault(require("../../models/supplyModel"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DEBUG = _constants["default"].DEBUG, TIME_SPAN = _constants["default"].TIME_SPAN;
    var ONE_SECOND = DEBUG.FEEDING_ENVIRONMENT ? 20 : TIME_SPAN.ONE_SECOND;
    var ITEM_WIDTH = 480;
    var BOOSTER_ITEM_HEIGHT = 640;
    var SUPPLY_ITEM_HEIGHT = 500;
    var BOTTOM_SPACE = 162;
    var LIST_SPACING = 50;
    var GLOWING_SPEED = .7;
    cc.Class({
      extends: cc.Component,
      properties: {
        BoosterItem: {
          default: null,
          type: cc.Prefab
        },
        SupplyItem: {
          default: null,
          type: cc.Prefab
        },
        GlowItem: {
          default: null,
          type: cc.Prefab
        },
        material_glow: {
          default: null,
          type: cc.Material
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.wallpaper = this.node.getChildByName("wallpaper");
        this.topFrame = this.node.getChildByName("topFrame");
        this.topBar = this.topFrame.getChildByName("top");
        this.topBg = this.topFrame.getChildByName("bg");
        this.boostersTab = this.topFrame.getChildByName("boostersTab");
        this.suppliesTab = this.topFrame.getChildByName("suppliesTab");
        this.bottomFrame = this.node.getChildByName("bottomFrame");
        this.bottomFramePlace = this.bottomFrame.getChildByName("frame");
        this.bottomFrameEmpty = this.bottomFrame.getChildByName("placeNotification");
        this.placeButton = this.bottomFramePlace.getChildByName("placeButton").getComponent(cc.Button);
        this.bottomFramePlace.active = false;
        this.bottomFrameEmpty.active = true;
        this.placeButton.node.on("click", this.onPlaceButtonClicked, this);
        this.boostersScrollView = this.node.getChildByName("boostersScrollview");
        this.boostersScrollFrame = this.boostersScrollView.getChildByName("view").getChildByName("content");
        this.suppliesScrollView = this.node.getChildByName("suppliesScrollview");
        this.suppliesScrollFrame = this.suppliesScrollView.getChildByName("view").getChildByName("content");
        this.glowLayer = this.suppliesScrollFrame.getChildByName("GlowLayer");
        this.glowLayer.zIndex = 2;
        this.topBg.zIndex = -2;
        this.boostersTab.on("click", this.onBoostersTabClicked, this);
        this.suppliesTab.on("click", this.onSuppliesTabClicked, this);
        this.selectTab("boosters");
        this.app.boostersRefreshRequest = true;
        this.app.suppliesRefreshRequest = true;
        this.boosterItems = {};
        this.supplyItems = {};
        this.glowItems = {};
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
      },
      onEnable: function onEnable() {
        if (this.app.boostersRefreshRequest) {
          this.loadBoosterItems();
          this.app.boostersRefreshRequest = false;
        }
        if (this.app.suppliesRefreshRequest) {
          this.loadSupplyItems();
          this.app.suppliesRefreshRequest = false;
        }
        this.clearGlowingSupplies();
      },
      onOpened: function onOpened(opts) {
        opts && opts.tab && this.selectTab(opts.tab);
      },
      update: function update(dt) {
        if (this.selectingSuppliesCount) {
          this.glowTimer += dt * GLOWING_SPEED;
          this.material_glow.setProperty("hl_timer", this.glowTimer);
        }
      },
      loadBoosterItems: function loadBoosterItems() {
        for (var key in this.boosterItems) {
          var boosterItem = this.boosterItems[key];
          boosterItem.node.destroy();
        }
        this.boosterItems = {};
        var boostersData = _userState["default"].getBoosters();
        var boosterCounter = 0;
        for (var _key in boostersData) {
          var item = boostersData[_key];
          if (item.amount) {
            var goItem = cc.instantiate(this.BoosterItem).getComponent("BagBoosterItem");
            goItem.node.setParent(this.boostersScrollFrame);
            goItem.node.x = boosterCounter % 2 ? .5 * ITEM_WIDTH : .5 * -ITEM_WIDTH;
            goItem.node.y = -LIST_SPACING - Math.floor(.5 * boosterCounter) * BOOSTER_ITEM_HEIGHT;
            goItem.loadData(_extends({
              id: _key
            }, item), this.onBoosterItemClicked.bind(this));
            this.boosterItems[_key] = goItem;
            boosterCounter++;
          }
        }
        this.boostersScrollFrame.height = BOOSTER_ITEM_HEIGHT * Math.ceil(.5 * boosterCounter) + 2 * LIST_SPACING;
      },
      loadSupplyItems: function loadSupplyItems() {
        for (var key in this.supplyItems) {
          var supplyItem = this.supplyItems[key];
          supplyItem.node.destroy();
        }
        for (var _key2 in this.glowItems) {
          var glowItem = this.glowItems[_key2];
          glowItem.node.destroy();
        }
        this.supplyItems = {};
        this.glowItems = {};
        var supplies = _supplyModel["default"].getStarData().items;
        var yardData = _userState["default"].getYard();
        var supplyCounter = 0;
        for (var _key3 in _yard["default"].items) {
          var goItem = cc.instantiate(this.SupplyItem).getComponent("BagSupplyItem");
          goItem.node.setParent(this.suppliesScrollFrame);
          goItem.node.x = supplyCounter % 2 ? .5 * ITEM_WIDTH : .5 * -ITEM_WIDTH;
          goItem.node.y = -LIST_SPACING - Math.floor(.5 * supplyCounter) * SUPPLY_ITEM_HEIGHT;
          supplies.includes(_key3) ? goItem.loadData({
            id: _key3,
            isPlaced: !!yardData[_key3]
          }, this.onSupplyItemClicked.bind(this)) : goItem.loadData(null, null);
          this.supplyItems[_key3] = goItem;
          supplyCounter++;
          if (goItem.data) {
            var glowGOItem = cc.instantiate(this.GlowItem).getComponent("YardGlow");
            glowGOItem.node.setParent(this.glowLayer);
            glowGOItem.node.x = goItem.node.x + goItem.icon.node.x;
            glowGOItem.node.y = goItem.node.y + goItem.icon.node.y + goItem.icon.node.height * goItem.icon.node.scale * .5;
            glowGOItem.node.scale = goItem.node.scale * goItem.icon.node.scale;
            this.glowItems[_key3] = glowGOItem;
            glowGOItem.setGlowShape(goItem.data.id);
            glowGOItem.node.active = false;
          }
        }
        this.suppliesScrollFrame.height = SUPPLY_ITEM_HEIGHT * Math.ceil(.5 * supplyCounter) + 2 * LIST_SPACING + this.bottomFrame.height * this.bottomFrame.scale;
      },
      selectTab: function selectTab(tab) {
        if (this.selectingTab === tab) return;
        this.selectingTab = tab;
        if ("boosters" === tab) {
          this.boostersTab.getChildByName("selected").active = true;
          this.boostersTab.getChildByName("unselected").active = false;
          this.suppliesTab.getChildByName("selected").active = false;
          this.suppliesTab.getChildByName("unselected").active = true;
          this.boostersTab.zIndex = 1;
          this.suppliesTab.zIndex = -1;
          this.boostersScrollView.active = true;
          this.suppliesScrollView.active = false;
          this.bottomFrame.active = false;
        } else if ("supplies" === tab) {
          this.boostersTab.getChildByName("selected").active = false;
          this.boostersTab.getChildByName("unselected").active = true;
          this.suppliesTab.getChildByName("selected").active = true;
          this.suppliesTab.getChildByName("unselected").active = false;
          this.boostersTab.zIndex = -1;
          this.suppliesTab.zIndex = 1;
          this.boostersScrollView.active = false;
          this.suppliesScrollView.active = true;
          this.bottomFrame.active = true;
          this.clearGlowingSupplies();
        }
      },
      clearGlowingSupplies: function clearGlowingSupplies() {
        this.bottomFramePlace.active = false;
        this.bottomFrameEmpty.active = true;
        this.selectingSuppliesCount = 0;
        this.glowTimer = 0;
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          glowItem.node.active = false;
        }
      },
      onBoostersTabClicked: function onBoostersTabClicked() {
        this.selectTab("boosters");
      },
      onSuppliesTabClicked: function onSuppliesTabClicked() {
        this.selectTab("supplies");
      },
      onBoosterItemClicked: function onBoosterItemClicked(id) {
        this.subsceneController.switchScene("shop", {
          id: id
        });
      },
      onSupplyItemClicked: function onSupplyItemClicked(id) {
        if (this.supplyItems[id].isPlaced) return;
        if (this.glowItems[id].node.active) {
          this.glowItems[id].node.active = false;
          this.selectingSuppliesCount--;
        } else {
          this.glowItems[id].node.active = true;
          this.selectingSuppliesCount++;
          this.glowTimer = 0;
        }
        this.bottomFramePlace.active = this.selectingSuppliesCount > 0;
        this.bottomFrameEmpty.active = 0 === this.selectingSuppliesCount;
      },
      onPlaceButtonClicked: function onPlaceButtonClicked() {
        var yardData = _userState["default"].getYard();
        for (var key in this.glowItems) {
          var glowItem = this.glowItems[key];
          var supplyItem = this.supplyItems[key];
          if (glowItem.node.active) {
            yardData[key] || (yardData[key] = {
              playingCat: null,
              nextUpdate: Date.now() + _yard["default"].items[key].interval * ONE_SECOND,
              x: -1,
              y: -1
            });
            supplyItem.setPlaced();
            glowItem.node.active = false;
          }
        }
        _userState["default"].saveYard();
        this.app.yardViewRefreshRequest = true;
        this.clearGlowingSupplies();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.wallpaper.height = this.node.height;
        this.topFrame.y = .5 * this.node.height;
        this.topFrame.scale = uiScale;
        this.topBar.width = this.node.width / uiScale;
        this.topBg.scale = this.node.scale / uiScale;
        var bottomSpace = BOTTOM_SPACE * uiScale;
        this.bottomFrame.scale = uiScale;
        this.bottomFrame.y = .5 * -this.node.height + bottomSpace + .5 * this.bottomFrame.height * uiScale;
        var topSpace = this.topFrame.height * uiScale;
        this.boostersScrollView.height = this.node.height - bottomSpace - topSpace;
        this.boostersScrollView.y = .5 * (bottomSpace - topSpace);
        this.suppliesScrollView.height = this.node.height - bottomSpace - topSpace;
        this.suppliesScrollView.y = .5 * (bottomSpace - topSpace);
      }
    });
    cc._RF.pop();
  }, {
    "../../constants": "constants",
    "../../models/supplyModel": "supplyModel",
    "../../staticData/yard": "yard",
    "../../userState": "userState"
  } ],
  BagSupplyItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73969qcc6xIXYVDwfzZPHIG", "BagSupplyItem");
    "use strict";
    var MAX_ICON_SIZE = 400;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.placedIcon = this.node.getChildByName("placed-icon");
        this.materialNormal = this.icon.getMaterial(0);
        this.node.on("click", this.onClicked, this);
      },
      loadData: function loadData(data, onItemClicked) {
        this.data = data;
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        if (data) {
          var maxSize = Math.max(this.icon.node.width, this.icon.node.height, MAX_ICON_SIZE);
          this.icon.node.scale = MAX_ICON_SIZE / maxSize;
          this.onItemClicked = onItemClicked;
          this.icon.spriteFrame = this[data.id];
          data.isPlaced && this.setPlaced();
        } else {
          this.placedIcon = this.node.getChildByName("placed-icon");
          this.icon.node.active = false;
          this.placedIcon.active = false;
        }
      },
      setPlaced: function setPlaced() {
        this.isPlaced = true;
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.placedIcon = this.node.getChildByName("placed-icon");
        this.icon.node.active = false;
        this.placedIcon.active = true;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {} ],
  BoosterController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73f37xT8fJBY4i4PELSjVmR", "BoosterController");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ITEM_SIZE = 160;
    var ITEM_SPACING = 30;
    var ITEM_FIRST_POSITION = [ 0, 20 ];
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    cc.Class({
      extends: cc.Component,
      properties: {
        BoosterItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.container = this.node.getChildByName("container");
        this.overlay = this.container.getChildByName("overlay");
        this.contentFrame = this.overlay.getChildByName("content");
        this.boostersFrame = this.contentFrame.getChildByName("boosters");
        var fx = this.contentFrame.getChildByName("effect");
        this.lightstar = fx.getChildByName("lightstar");
        this.starFx1 = fx.getChildByName("star1").getComponent(cc.ParticleSystem);
        this.starFx2 = fx.getChildByName("star2").getComponent(cc.ParticleSystem);
        this.overlay.zIndex = 1;
        this.overlay.active = false;
        this.isActive = false;
        this.selectingType = null;
        this.lockedUserInteraction = false;
        this.animating = false;
        this.starFx1.node.active = false;
        this.starFx2.node.active = false;
        this.selectedSubcolor = "basic1";
        this.paintbrushFrame = this.boostersFrame.getChildByName("paintbrush");
        this.paintbrushFrame.getChildByName("basic1").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic2").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic3").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic4").on("click", this.onColorSelelected, this);
        this.paintbrushFrame.getChildByName("basic5").on("click", this.onColorSelelected, this);
        this.selectedColorCursor = this.paintbrushFrame.getChildByName("selected");
        this.selectedColorCursor.position = this.paintbrushFrame.getChildByName(this.selectedSubcolor).position;
      },
      getPaintbrushTargetType: function getPaintbrushTargetType() {
        return this.selectedSubcolor;
      },
      init: function init(opts) {
        this.gameBoard = opts.gameBoard;
        this.tutorialController = opts.tutorialController;
        this.isActive = false;
        this.data = _userState["default"].getBoosters();
        this.items = {};
        this.lockedUserInteraction = false;
        this.container = this.node.getChildByName("container");
        var firstPositionX = ITEM_FIRST_POSITION[0] - (_userState["default"].getSelectedBoosterCount() - 1) * (ITEM_SPACING + ITEM_SIZE) * .5;
        var i = 0;
        for (var type in _boosters["default"]) if (this.data[type] && this.data[type].selected) {
          var boosterItem = {};
          var number = this.data[type].amount;
          boosterItem = cc.instantiate(this.BoosterItem).getComponent("BoosterItem");
          this.items[type] = boosterItem;
          boosterItem.node.parent = this.container;
          boosterItem.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          boosterItem.node.y = ITEM_FIRST_POSITION[1] + .5 * this.node.height;
          boosterItem.node.scale = ITEM_SIZE / boosterItem.node.width;
          boosterItem.loadBooster({
            type: type,
            number: number
          }, this.onItemClicked.bind(this));
          i++;
        }
      },
      update: function update(dt) {
        if (this.lightstar && this.app) {
          this.lightstar.angle += 20 * dt;
          this.lightstar.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
        }
      },
      onItemClicked: function onItemClicked(type) {
        if (this.animating) return;
        if (this.lockedUserInteraction) return;
        if (this.tutorialController.isTutorialShowing) return;
        if (this.isActive) {
          this.cancelBoosterMode();
          return;
        }
        if (!this.gameBoard.isIdle) return;
        if (0 === this.data[type].amount) return;
        this.enterBoosterMode(type);
      },
      onCancelButtonClicked: function onCancelButtonClicked() {
        this.cancelBoosterMode();
      },
      onColorSelelected: function onColorSelelected(e) {
        this.selectedSubcolor = e.node.name;
        this.selectedColorCursor.position = this.paintbrushFrame.getChildByName(this.selectedSubcolor).position;
      },
      lockUserInteraction: function lockUserInteraction() {
        this.lockedUserInteraction = true;
        this.cancelBoosterMode();
      },
      unlockUserInteraction: function unlockUserInteraction() {
        this.lockedUserInteraction = false;
      },
      enterBoosterMode: function enterBoosterMode(type) {
        var _this = this;
        this.isActive = true;
        this.selectingType = type;
        this.gameBoard.enterBoosterMode(type);
        this.items[type].node.zIndex = 2;
        this.items[type].setSelected(true);
        this.boostersFrame.children.forEach(function(boosterFrame) {
          boosterFrame.active = boosterFrame.name === type;
        });
        this.starFx1.resetSystem();
        this.starFx2.resetSystem();
        this.animating = true;
        this.overlay.active = true;
        this.overlay.opacity = 0;
        cc.tween(this.overlay).to(.3, {
          opacity: 255
        }, {
          easing: "quadOut"
        }).call(function() {
          _this.starFx1.resetSystem();
          _this.starFx2.resetSystem();
          _this.starFx1.node.active = true;
          _this.starFx2.node.active = true;
          _this.animating = false;
        }).start();
      },
      exitBoosterMode: function exitBoosterMode(isBoosterActivated, type) {
        var _this2 = this;
        if (!this.isActive) return;
        this.isActive = false;
        this.selectingType && (this.items[this.selectingType].node.zIndex = 0);
        this.selectingType && this.items[this.selectingType].setSelected(false);
        this.selectingType = null;
        this.overlay.active = false;
        isBoosterActivated && this.reduceType(type);
        this.starFx1.node.active = false;
        this.starFx2.node.active = false;
        this.animating = true;
        this.overlay.active = true;
        this.overlay.opacity = 255;
        cc.tween(this.overlay).to(.3, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.overlay.active = false;
          _this2.animating = false;
        }).start();
      },
      cancelBoosterMode: function cancelBoosterMode() {
        this.exitBoosterMode(false);
        this.gameBoard.cancelBoosterMode();
      },
      reduceType: function reduceType(type) {
        this.data[type].amount = Math.max(this.data[type].amount - 1, 0);
        _userState["default"].saveBoostersState();
        this.items[type].updateNumber(this.data[type].amount);
      }
    });
    cc._RF.pop();
  }, {
    "../staticData/boosters": "boosters",
    "../userState": "userState"
  } ],
  BoosterItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f92beGPJNOEZqDiRsEd+7l", "BoosterItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.frame = this.node.getChildByName("frame");
        this.frameSelected = this.node.getChildByName("frame_selected");
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.numberLabel = this.node.getChildByName("number").getComponent(cc.Label);
        this.redPoint = this.node.getChildByName("redpoint");
        this.lockIcon = this.node.getChildByName("lockIcon");
        this.frameSelected.active = false;
        this.node.on("click", this.onClicked, this);
      },
      loadBooster: function loadBooster(data, onItemClicked) {
        void 0 === onItemClicked && (onItemClicked = null);
        this.onItemClicked = onItemClicked;
        this.type = data.type;
        this.icon.spriteFrame = this[data.type];
        this.numberLabel.string = 0 | data.number;
        this.icon.node.active = true;
        this.redPoint.active = true;
        this.numberLabel.node.active = true;
        this.lockIcon.active = false;
      },
      setLocked: function setLocked() {
        this.icon.node.active = false;
        this.redPoint.active = false;
        this.numberLabel.node.active = false;
        this.lockIcon.active = true;
      },
      setSelected: function setSelected(selected) {
        this.frame.active = !selected;
        this.frameSelected.active = selected;
      },
      updateNumber: function updateNumber(number) {
        this.numberLabel.string = 0 | number;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.type);
      }
    });
    cc._RF.pop();
  }, {} ],
  BottomUIButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f724adbdLVFYYWo/SCy2BYs", "BottomUIButton");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.animating = false;
      },
      setSelected: function setSelected(selected, animate) {
        void 0 === animate && (animate = false);
        this.selectedBacker = this.node.getChildByName("choosebg");
        this.selectedIconBacker = this.node.getChildByName("choose-iconBg");
        this.normalIconBacker = this.node.getChildByName("iconBg");
        this.icon = this.node.getChildByName("icon");
        this.label = this.node.getChildByName("label");
        if (animate) {
          this.animating = true;
          if (selected) {
            this.selectedBacker.active = true;
            this.selectedIconBacker.active = true;
            this.label.active = true;
            cc.tween(this.selectedBacker).to(ANIMATION_DURATION, {
              opacity: 255
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.selectedIconBacker).to(ANIMATION_DURATION, {
              opacity: 255,
              y: 50
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.normalIconBacker).to(.5 * ANIMATION_DURATION, {
              opacity: 0,
              y: 52
            }, {
              easing: "quadOut"
            }).call(this.normalIconBacker.active = false).start();
            cc.tween(this.label).to(ANIMATION_DURATION, {
              opacity: 255,
              y: -56
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.icon).to(ANIMATION_DURATION, {
              scale: 1,
              y: 56
            }, {
              easing: "quadOut"
            }).call(this.animating = false).start();
          } else {
            this.normalIconBacker.active = true;
            cc.tween(this.selectedBacker).to(ANIMATION_DURATION, {
              opacity: 0
            }, {
              easing: "quadOut"
            }).call(this.selectedBacker.active = false).start();
            cc.tween(this.selectedIconBacker).to(ANIMATION_DURATION, {
              opacity: 0,
              y: 0
            }, {
              easing: "quadOut"
            }).call(this.selectedIconBacker.active = false).start();
            cc.tween(this.normalIconBacker).to(ANIMATION_DURATION, {
              opacity: 255,
              y: 0
            }, {
              easing: "quadOut"
            }).start();
            cc.tween(this.label).to(ANIMATION_DURATION, {
              opacity: 0,
              y: -106
            }, {
              easing: "quadOut"
            }).call(this.label.active = false).start();
            cc.tween(this.icon).to(ANIMATION_DURATION, {
              scale: .9,
              y: -4
            }, {
              easing: "quadOut"
            }).call(this.animating = false).start();
          }
        } else {
          this.selectedBacker.active = selected;
          this.selectedIconBacker.active = selected;
          this.normalIconBacker.active = !selected;
          this.label.active = selected;
          this.selectedBacker.opacity = selected ? 255 : 0;
          this.selectedIconBacker.y = selected ? 50 : 0;
          this.selectedIconBacker.opacity = selected ? 255 : 0;
          this.normalIconBacker.opacity = selected ? 0 : 255;
          this.normalIconBacker.y = selected ? 52 : 0;
          this.label.opacity = selected ? 255 : 0;
          this.label.y = selected ? -56 : -106;
          this.icon.y = selected ? 56 : -4;
          this.icon.scale = selected ? 1 : .9;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  BottomUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d81bVhjMFBDJtD02dDq0ze", "BottomUI");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.homeButton = this.node.getChildByName("HomeButton").getComponent("BottomUIButton");
        this.shopButton = this.node.getChildByName("ShopButton").getComponent("BottomUIButton");
        this.catButton = this.node.getChildByName("CatButton").getComponent("BottomUIButton");
        this.bagButton = this.node.getChildByName("BagButton").getComponent("BottomUIButton");
        this.settingsButton = this.node.getChildByName("SettingsButton").getComponent("BottomUIButton");
        this.homeButton.node.on("click", this.onButtonClicked, this);
        this.shopButton.node.on("click", this.onButtonClicked, this);
        this.catButton.node.on("click", this.onButtonClicked, this);
        this.bagButton.node.on("click", this.onButtonClicked, this);
        this.settingsButton.node.on("click", this.onButtonClicked, this);
        this.buttonMap = {
          home: this.homeButton,
          shop: this.shopButton,
          cat: this.catButton,
          bag: this.bagButton,
          settings: this.settingsButton
        };
        this.selectedId = false;
        this.homeButton.setSelected(false);
        this.shopButton.setSelected(false);
        this.catButton.setSelected(false);
        this.bagButton.setSelected(false);
        this.settingsButton.setSelected(false);
      },
      onButtonClicked: function onButtonClicked(event) {
        if (this.isButtonAnimating()) return;
        var id = null;
        for (var key in this.buttonMap) if (this.buttonMap[key].node === event.node) {
          id = key;
          break;
        }
        id && this.selectedId !== id && this.node.emit("buttonClicked", id);
      },
      selectButton: function selectButton(id, animate) {
        void 0 === animate && (animate = false);
        var currentButton = this.buttonMap[this.selectedId];
        var targetButton = this.buttonMap[id];
        this.selectedId && currentButton.setSelected(false, animate);
        targetButton.setSelected(true, animate);
        this.selectedId = id;
      },
      isButtonAnimating: function isButtonAnimating() {
        return this.homeButton.animating || this.shopButton.animating || this.catButton.animating || this.bagButton.animating || this.settingsButton.animating;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
        var botUIbacker = this.node.getChildByName("backer");
        botUIbacker.width = this.node.width / uiScale * Math.max(1, frame.ratio);
      }
    });
    cc._RF.pop();
  }, {} ],
  CatCommands: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "724e2Ntk2BA9b92owQ+pVr/", "CatCommands");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function feed(catId, number) {
      var cat = _catModels["default"].getCat(catId);
      var fishes = _userState["default"].getFish();
      var addableNumber = Math.min(fishes, number, cat.config.feedablePerDay - cat.data.dailyFed, cat.intimacyCap - cat.data.fishFed);
      var result = {
        dailyFeedChanged: false,
        intimacyChanged: false
      };
      if (!addableNumber) return result;
      var prevLevel = cat.getIntimacyLevel();
      result.dailyFeedChanged = true;
      cat.data.dailyFed += addableNumber;
      cat.data.fishFed += addableNumber;
      _userState["default"].updateFish(-addableNumber);
      _userState["default"].saveCats();
      var level = cat.getIntimacyLevel();
      result.intimacyChanged = level !== prevLevel;
      return result;
    }
    var _default = {
      feed: feed
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../models/catModels": "catModels",
    "../userState": "userState"
  } ],
  CatSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c554SOoSBPrrxCAZVTgPLw", "CatSubscene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        var wallpaper = this.node.getChildByName("wallpaper");
        wallpaper.height = this.node.height;
      }
    });
    cc._RF.pop();
  }, {} ],
  CatView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c9e1L16tlFoY74Ty0CinZy", "CatView");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bella: {
          default: null,
          type: cc.SpriteFrame
        },
        bob: {
          default: null,
          type: cc.SpriteFrame
        },
        dora: {
          default: null,
          type: cc.SpriteFrame
        },
        leo: {
          default: null,
          type: cc.SpriteFrame
        },
        lily: {
          default: null,
          type: cc.SpriteFrame
        },
        luna: {
          default: null,
          type: cc.SpriteFrame
        },
        max: {
          default: null,
          type: cc.SpriteFrame
        },
        milo: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      loadCat: function loadCat(cat) {
        this.node.getComponent(cc.Sprite).spriteFrame = this[cat] || null;
      }
    });
    cc._RF.pop();
  }, {} ],
  ConfirmationController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb639vxdeZL+LoDGmNo9NYm", "ConfirmationController");
    "use strict";
    var POPUP_DURATION = .4;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.backer = this.node.getChildByName("backer");
        this.popup = this.node.getChildByName("popup");
        this.text = this.popup.getChildByName("text").getComponent(cc.Label);
        this.yesButton = this.popup.getChildByName("yesButton").getComponent(cc.Button);
        this.noButton = this.popup.getChildByName("noButton").getComponent(cc.Button);
        this.animating = false;
        this.yesButton.node.on("click", this.onYesButtonClicked, this);
        this.noButton.node.on("click", this.onNoButtonClicked, this);
        this.hide();
      },
      hide: function hide(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        return new Promise(function(resolve) {
          if (!animate) {
            _this.node.active = false;
            resolve();
            return;
          }
          _this.animating = true;
          _this.popup.scale = 1;
          _this.popup.opacity = 255;
          _this.backer.opacity = 200;
          cc.tween(_this.backer).to(.3, {
            opacity: 0
          }, {
            easing: "sineOut"
          }).start();
          cc.tween(_this.popup).to(POPUP_DURATION, {
            scale: 0,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.animating = false;
            _this.node.active = false;
            resolve();
          }).start();
        });
      },
      show: function show(text, callback, animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.text.string = text;
        this.callback = callback;
        return new Promise(function(resolve) {
          _this2.node.active = true;
          if (!animate) {
            resolve();
            return;
          }
          _this2.animating = true;
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          _this2.backer.opacity = 0;
          cc.tween(_this2.backer).to(.3, {
            opacity: 200
          }, {
            easing: "quadOut"
          }).start();
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          cc.tween(_this2.popup).to(POPUP_DURATION, {
            scale: 1,
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.animating = false;
          }).start();
        });
      },
      updateScreenSize: function updateScreenSize() {
        var parent = this.node.parent;
        this.node.width = parent.width;
        this.node.height = parent.height;
        var backer = this.node.getChildByName("backer");
        backer.height = this.node.height;
      },
      onYesButtonClicked: function onYesButtonClicked() {
        var _this3 = this;
        this.animating || this.hide(true).then(function() {
          return _this3.callback && _this3.callback();
        });
      },
      onNoButtonClicked: function onNoButtonClicked() {
        this.animating || this.hide(true);
      }
    });
    cc._RF.pop();
  }, {} ],
  Debugger: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee21a3k8GhHzbMAz/l30mL6", "Debugger");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  GameBoard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85de1ItBUxA9JPr2s2uGZBY", "GameBoard");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _bumper = _interopRequireDefault(require("./GameItem/bumper.js"));
    var _cabinet = _interopRequireDefault(require("./GameItem/cabinet.js"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _GameItem = _interopRequireDefault(require("./GameItem/GameItem.js"));
    var _helpers = _interopRequireDefault(require("../helpers.js"));
    var _Rnd = _interopRequireDefault(require("./Rnd.js"));
    var _simpleCrate = _interopRequireDefault(require("./GameItem/simpleCrate.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE, BOOSTER_SCALE = _constants$GAMEPLAY.BOOSTER_SCALE, GRAVITY = _constants$GAMEPLAY.GRAVITY, LOGIC_UPDATE_INTERVAL = _constants$GAMEPLAY.LOGIC_UPDATE_INTERVAL, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, GROUP_TYPE_PRIORITY = _constants$GAMEPLAY.GROUP_TYPE_PRIORITY, GROUP_TYPE_POWERUP = _constants$GAMEPLAY.GROUP_TYPE_POWERUP, BOMB_EXPLOSION_DURATION = _constants$GAMEPLAY.BOMB_EXPLOSION_DURATION, BOMB_RADIUS = _constants$GAMEPLAY.BOMB_RADIUS, MISSILE_VELOCITY = _constants$GAMEPLAY.MISSILE_VELOCITY, BOOSTER_PROJECTILE_VELOCITY = _constants$GAMEPLAY.BOOSTER_PROJECTILE_VELOCITY, DISCOBALL_DELAY_BETWEEN_ITEMS = _constants$GAMEPLAY.DISCOBALL_DELAY_BETWEEN_ITEMS, SNIPER_SPEED = _constants$GAMEPLAY.SNIPER_SPEED, SNIPER_ROTATION_SPEED = _constants$GAMEPLAY.SNIPER_ROTATION_SPEED, SNIPER_EXPLOSION_DURATION = _constants$GAMEPLAY.SNIPER_EXPLOSION_DURATION, SNIPER_TAKE_OFF_DURATION = _constants$GAMEPLAY.SNIPER_TAKE_OFF_DURATION, ITEM_TRANSFORM_DURATION = _constants$GAMEPLAY.ITEM_TRANSFORM_DURATION, ITEM_EXPLODE_DURATION = _constants$GAMEPLAY.ITEM_EXPLODE_DURATION, DYNAMIC_USER_INTERACTION = _constants$GAMEPLAY.DYNAMIC_USER_INTERACTION, NO_MOVE_DETECTION_DELAY = _constants$GAMEPLAY.NO_MOVE_DETECTION_DELAY, NO_MOVE_FIX_DURATION = _constants$GAMEPLAY.NO_MOVE_FIX_DURATION, SPINE_NAMES = _constants$GAMEPLAY.SPINE_NAMES, RAY_OF_LIGHT_SCALE = _constants$GAMEPLAY.RAY_OF_LIGHT_SCALE;
    var AROUND = [ {
      x: -1,
      y: 0
    }, {
      x: 1,
      y: 0
    }, {
      x: 0,
      y: -1
    }, {
      x: 0,
      y: 1
    } ];
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    function debugLog() {}
    var GameBoard = function() {
      function GameBoard(options) {
        var _this = this;
        var app = options.app;
        var pattern = _helpers["default"].deepCopy(options.pattern);
        var spawnPattern = _helpers["default"].deepCopy(options.spawnPattern);
        var underlayPattern = options.underlayPattern;
        var view = options.view;
        var GameTile = options.GameTile;
        var GameItem = options.GameItem;
        var GameItemSpawner = options.GameItemSpawner;
        var boosterController = options.boosterController;
        var tutorialController = options.tutorialController;
        var spriteCollection = options.spriteCollection;
        var onGameItemDestroy = options.onGameItemDestroy || EMPTY_METHOD;
        var onIdle = options.onIdle || EMPTY_METHOD;
        var onMoveTriggered = options.onMoveTriggered || EMPTY_METHOD;
        var onBoosterModeEnd = options.onBoosterModeEnd || EMPTY_METHOD;
        var onCombo = options.onCombo || EMPTY_METHOD;
        var onPowerUpSpawn = options.onPowerUpSpawn || EMPTY_METHOD;
        var onPowerUpTrigger = options.onPowerUpTrigger || EMPTY_METHOD;
        this.app = app;
        this.view = view;
        this.GameItem = GameItem;
        this.spriteCollection = spriteCollection;
        this.boosterController = boosterController;
        this.tutorialController = tutorialController;
        this.onGameItemDestroy = onGameItemDestroy;
        this.onIdle = onIdle;
        this.onMoveTriggered = onMoveTriggered;
        this.onBoosterModeEnd = onBoosterModeEnd;
        this.onCombo = onCombo;
        this.onPowerUpSpawn = onPowerUpSpawn;
        this.onPowerUpTrigger = onPowerUpTrigger;
        this.validatePattern(pattern, spawnPattern);
        this.rnd = new _Rnd["default"]();
        console.log("Rnd seed:", this.rnd.getSeed());
        this.width = pattern[0].length;
        this.height = pattern.length + 1;
        this.background = [];
        this.board = [];
        this.previous = [];
        this.next = [];
        this["final"] = [];
        this.spawnBlindSpot = [];
        this.spawners = [];
        this.underlay = [];
        this.isCascading = false;
        this.startCascadeRequest = false;
        this.checkMatchesRequest = false;
        this.updateSpawnBlindSpotRequest = false;
        this.checkRespawnRequest = false;
        this.movingSprites = [];
        this.explodingDiscoBalls = [];
        this.sniperTargets = {};
        this.borders = [];
        this.isBeingDestroyed = false;
        this.itemsWaitingForDisappear = 0;
        this.switchingCount = 0;
        this.isIdle = this.app.now;
        this.booster = null;
        this.lockedUserInteractionReasons = {};
        this.lockedUserInteraction = false;
        this.comboReport = {};
        this.dragging = {
          gameItem: null,
          startX: null,
          startY: null
        };
        this.highlightTimer = 0;
        this.matchGroupUid = 0;
        this.isMoveAvailableNow = null;
        for (var boardY = 0; boardY < this.height; boardY++) {
          this.previous[boardY] = [];
          this.next[boardY] = [];
          this["final"][boardY] = [];
          this.spawnBlindSpot[boardY] = [];
          for (var boardX = 0; boardX < this.width; boardX++) {
            this.previous[boardY][boardX] = null;
            this.next[boardY][boardX] = null;
            this["final"][boardY][boardX] = null;
            this.spawnBlindSpot[boardY][boardX] = null;
          }
        }
        for (var _boardY = 0; _boardY < this.height; _boardY++) {
          this.background[_boardY] = [];
          if (0 === _boardY) continue;
          for (var _boardX = 0; _boardX < this.width; _boardX++) {
            var gameTile = null;
            if (pattern[_boardY - 1][_boardX]) {
              gameTile = cc.instantiate(GameTile).getComponent("GameTile");
              gameTile.boardX = _boardX;
              gameTile.boardY = _boardY;
              gameTile.setBg((_boardY * this.width + _boardX) % 2);
              gameTile.node.x = this.boardXToViewX(_boardX);
              gameTile.node.y = this.boardYToViewY(_boardY);
              view.addChild(gameTile.node);
            }
            this.background[_boardY][_boardX] = gameTile;
          }
        }
        for (var _boardY2 = 0; _boardY2 < this.height; _boardY2++) {
          this.underlay[_boardY2] = [];
          if (0 === _boardY2) continue;
          for (var _boardX2 = 0; _boardX2 < this.width; _boardX2++) {
            var gameItem = null;
            var blueprint = underlayPattern && underlayPattern[_boardY2 - 1][_boardX2];
            blueprint && (gameItem = this.getNewGameItemFromBlueprint({
              blueprint: blueprint,
              view: view,
              boardX: _boardX2,
              boardY: _boardY2,
              x: this.background[_boardY2][_boardX2].node.x,
              y: this.background[_boardY2][_boardX2].node.y
            }));
            this.underlay[_boardY2][_boardX2] = gameItem;
          }
        }
        _GameItem["default"].preParsePattern(this, pattern);
        for (var _boardY3 = 0; _boardY3 < this.height; _boardY3++) {
          this.board[_boardY3] = [];
          if (0 === _boardY3) continue;
          for (var _boardX3 = 0; _boardX3 < this.width; _boardX3++) {
            var _gameItem = null;
            var _blueprint = pattern[_boardY3 - 1][_boardX3];
            _blueprint && (_gameItem = this.getNewGameItemFromBlueprint({
              blueprint: _blueprint,
              view: view,
              boardX: _boardX3,
              boardY: _boardY3,
              x: this.background[_boardY3][_boardX3].node.x,
              y: this.background[_boardY3][_boardX3].node.y
            }));
            this.board[_boardY3][_boardX3] = _gameItem;
          }
        }
        for (var _boardX4 = 0; _boardX4 < this.width; _boardX4++) {
          var spawnerBoardY = null;
          for (var _boardY4 = 1; _boardY4 < this.height; _boardY4++) if (this.background[_boardY4][_boardX4] && (0 === _boardY4 || !this.background[_boardY4 - 1][_boardX4])) {
            spawnerBoardY = _boardY4 - 1;
            break;
          }
          if (null === spawnerBoardY) {
            this.spawners.push(null);
            continue;
          }
          var spawner = cc.instantiate(GameItemSpawner);
          spawner.boardX = _boardX4;
          spawner.boardY = spawnerBoardY;
          spawner.x = 0;
          spawner.y = 0;
          spawner.anchorX = this.width / 2 - _boardX4;
          spawner.anchorY = -this.height / 2 + spawnerBoardY + .5;
          spawner.zIndex = Z_INDEX.ITEM;
          spawner.blueprint = spawnPattern[_boardX4];
          view.addChild(spawner);
          this.spawners.push(spawner);
        }
        var b = this.background;
        for (var x = 0; x <= this.width; x++) for (var y = 1; y <= this.height; y++) {
          var topLeft = !(y < 2 || x < 1 || !b[y - 1][x - 1]);
          var topRight = !(y < 2 || x >= this.width || !b[y - 1][x]);
          var bottomLeft = !(y >= this.height || x < 1 || !b[y][x - 1]);
          var bottomRight = !(y >= this.height || x >= this.width || !b[y][x]);
          var borderType = null;
          var angle = 0;
          if (!topLeft && !topRight && bottomLeft && bottomRight) borderType = 1; else if (!topLeft && topRight && !bottomLeft && bottomRight) {
            borderType = 1;
            angle = 90;
          } else if (topLeft && !topRight && bottomLeft && !bottomRight) {
            borderType = 1;
            angle = 270;
          } else if (topLeft && topRight && !bottomLeft && !bottomRight) {
            borderType = 1;
            angle = 180;
          } else if (topLeft || topRight || bottomLeft || !bottomRight) if (topLeft || topRight || !bottomLeft || bottomRight) if (!topLeft || topRight || bottomLeft || bottomRight) if (topLeft || !topRight || bottomLeft || bottomRight) {
            if (!topLeft && topRight && bottomLeft && bottomRight) borderType = 3; else if (topLeft && !topRight && bottomLeft && bottomRight) {
              borderType = 3;
              angle = 270;
            } else if (topLeft && topRight && !bottomLeft && bottomRight) {
              borderType = 3;
              angle = 90;
            } else if (topLeft && topRight && bottomLeft && !bottomRight) {
              borderType = 3;
              angle = 180;
            }
          } else {
            borderType = 2;
            angle = 90;
          } else {
            borderType = 2;
            angle = 180;
          } else {
            borderType = 2;
            angle = 270;
          } else borderType = 2;
          if (borderType) {
            var node = _helpers["default"].createSprite({
              spriteFrame: this.spriteCollection["border" + borderType],
              view: view,
              zIndex: Z_INDEX.BORDER,
              x: this.boardXToViewX(x) - TILE_SIZE / 2,
              y: this.boardYToViewY(y) + TILE_SIZE / 2,
              width: TILE_SIZE,
              height: TILE_SIZE,
              angle: angle
            });
            this.borders.push(node);
          }
        }
        this.updateSpawnBlindSpot(true);
        this.updateInterval = setInterval(function() {
          _this.updateSpawnBlindSpot();
          _this.checkRespawn();
          _this.processMatches();
          _this.startCascade();
          _this.updateIdleState();
        }, LOGIC_UPDATE_INTERVAL);
        this.app.IS_DEVELOPMENT && (globalThis.gameBoard = this);
      }
      var _proto = GameBoard.prototype;
      _proto.update = function update(dt) {
        if (this.isBeingDestroyed) return;
        this.isCascading && this.update_cascade(dt);
        this.movingSprites.length && this.updateMovingSprites(dt);
        this.highlightTimer += dt;
        this.dragging.gameItem && this.spriteCollection.material_highlight.setProperty("hl_timer", this.highlightTimer);
      };
      _proto.updateMovingSprites = function updateMovingSprites(dt) {
        var itemData;
        for (var i = this.movingSprites.length - 1; i >= 0; i--) {
          itemData = this.movingSprites[i];
          itemData.onTick(itemData, dt);
        }
      };
      _proto.updateIdleState = function updateIdleState() {
        var wasIdle = this.isIdle;
        if (this.itemsWaitingForDisappear) return this._notIdle();
        if (this.isCascading) return this._notIdle();
        if (this.switchingCount) return this._notIdle();
        if (this.checkRespawnRequest) return this._notIdle();
        if (this.startCascadeRequest) return this._notIdle();
        if (this.checkMatchesRequest) return this._notIdle();
        if (this.updateSpawnBlindSpotRequest) return this._notIdle();
        if (this.movingSprites.length) return this._notIdle();
        this.isIdle = wasIdle || this.app.now;
        if (wasIdle) {
          if (!this.isMoveAvailableNow) {
            var timeSinceIdle = this.app.now - wasIdle;
            if (timeSinceIdle > NO_MOVE_DETECTION_DELAY) {
              this.isMoveAvailableNow = this.isMoveAvailable();
              if (false === this.isMoveAvailableNow) {
                this.fixNoMoveAvailable();
                this.isMoveAvailableNow = true;
              }
            }
          }
        } else this.onIdle();
      };
      _proto._notIdle = function _notIdle() {
        this.isIdle = false;
        this.isMoveAvailableNow = null;
      };
      _proto.processMatches = function processMatches() {
        if (!this.checkMatchesRequest) return;
        this.checkMatchesRequest = false;
        var _this$getMatchable = this.getMatchable(), matched = _this$getMatchable.matched, matchGroups = _this$getMatchable.matchGroups;
        if (!Object.keys(matched).length) return;
        for (var key in matchGroups) {
          var matchGroup = matchGroups[key];
          var groupType = matchGroup.groupType;
          var newPowerUp = GROUP_TYPE_POWERUP[groupType];
          if (!matchGroup.gameItems.length) continue;
          var comboId = matchGroup.gameItems[0].uid;
          this.comboReportStart(comboId);
          for (var i = 0; i < matchGroup.gameItems.length; i++) {
            var gameItem = matchGroup.gameItems[i];
            var shouldSpawnPowerUp = gameItem.boardX === matchGroup.targetPosition.boardX && gameItem.boardY === matchGroup.targetPosition.boardY;
            var powerUp = shouldSpawnPowerUp ? newPowerUp : null;
            this.hitUnderlay(gameItem.boardX, gameItem.boardY, "match");
            this.hitGameItem(gameItem, {
              type: "match",
              uid: comboId
            }, newPowerUp ? matchGroup.targetPosition : null, powerUp);
            this.comboReportAdd(comboId, gameItem);
          }
          this.comboReportEnd(comboId, "match");
        }
      };
      _proto.hitGameItem = function hitGameItem(gameItem, reason, targetPosition, replaceWithPowerUpType) {
        var _this2 = this;
        this.dragging.gameItem === gameItem && this.resetDrag();
        if ("bomb" === gameItem.type) return this.triggerBomb(gameItem);
        if ("sniper" === gameItem.type) return this.triggerSniper(gameItem);
        if ("missiles1" === gameItem.type || "missiles2" === gameItem.type) return this.triggerMissile(gameItem);
        if ("discoball" === gameItem.type) return this.triggerDiscoball(gameItem);
        var x = gameItem.boardX;
        var y = gameItem.boardY;
        var powerUpItem = null;
        if (replaceWithPowerUpType) {
          powerUpItem = cc.instantiate(this.GameItem).getComponent("GameItem");
          this.view.addChild(powerUpItem.node);
          powerUpItem.init({
            app: this.app,
            onDestroyCb: this.onGameItemDestroy,
            type: replaceWithPowerUpType
          });
          powerUpItem.node.x = this.boardXToViewX(targetPosition.boardX);
          powerUpItem.node.y = this.boardYToViewY(targetPosition.boardY);
          powerUpItem.boardX = targetPosition.boardX;
          powerUpItem.boardY = targetPosition.boardY;
          this.onPowerUpSpawn(replaceWithPowerUpType);
        }
        if ("match" === reason.type) for (var i = 0; i < 4; i++) {
          var xi = x + AROUND[i].x;
          var yi = y + AROUND[i].y;
          if (!this.isValidCoordinate(xi, yi)) continue;
          var gi = this.board[yi][xi];
          if (!gi) continue;
          if (!gi.isSensitive) continue;
          if (!gi.isIdle()) continue;
          this.hitGameItem(gi, {
            type: "sensitive:" + gameItem.type,
            uid: reason.uid
          });
        }
        if (targetPosition) {
          var targetX = this.boardXToViewX(targetPosition.boardX);
          var targetY = this.boardYToViewY(targetPosition.boardY);
          if (powerUpItem) {
            this.itemsWaitingForDisappear++;
            return Promise.all([ gameItem.explodeForPowerUp(targetX, targetY), powerUpItem.spawnPowerUp().then(function() {
              _this2.board[y][x] = powerUpItem;
            }) ]).then(function() {
              _this2.itemsWaitingForDisappear--;
              _this2.gameItemDisappearanceFinished(gameItem);
            });
          }
          this.itemsWaitingForDisappear++;
          return gameItem.explodeForPowerUp(targetX, targetY).then(function() {
            _this2.itemsWaitingForDisappear--;
            _this2.board[y][x] = null;
            _this2.gameItemDisappearanceFinished(gameItem);
          });
        }
        this.itemsWaitingForDisappear++;
        return gameItem.gotHit(reason).then(function() {
          _this2.itemsWaitingForDisappear--;
          if (0 === gameItem.lifePoints) {
            _this2.board[y][x] === gameItem ? _this2.board[y][x] = null : null !== _this2.board[y][x] && console.error(new Error("a game item is not in the board anymore when trying to remove it"));
            if (gameItem.linkedGamesItems) {
              var linkedGamesItems = gameItem.linkedGamesItems;
              gameItem.linkedGamesItems = null;
              for (var _iterator = _createForOfIteratorHelperLoose(linkedGamesItems), _step; !(_step = _iterator()).done; ) {
                var _gi = _step.value;
                if (_gi === gameItem) continue;
                _this2.board[_gi.boardY][_gi.boardX] === _gi ? _this2.board[_gi.boardY][_gi.boardX] = null : null !== _this2.board[_gi.boardY][_gi.boardX] && console.error(new Error("a game item is not in the board anymore when trying to remove it"));
                _gi.linkedGamesItems = null;
              }
            }
            _this2.gameItemDisappearanceFinished(gameItem);
          }
        });
      };
      _proto.hitGameItemCoordinate = function hitGameItemCoordinate(gameItem, reason) {
        var boardX = gameItem.boardX, boardY = gameItem.boardY;
        var underlayItem = this.underlay[boardY][boardX];
        var overlayItem = this.board[boardY][boardX];
        underlayItem && underlayItem.isDying && (underlayItem = null);
        overlayItem && overlayItem.isDying && (overlayItem = null);
        if (!underlayItem && !overlayItem) return false;
        underlayItem && this.hitUnderlay(boardX, boardY, reason);
        overlayItem && this.hitGameItem(overlayItem, reason);
        return true;
      };
      _proto.hitUnderlay = function hitUnderlay(x, y, reason) {
        var _this3 = this;
        var gameItem = this.board[y][x];
        if (gameItem && gameItem.isBlockingCascade && !gameItem.isDying) return;
        var underlayItem = this.underlay[y][x];
        if (!underlayItem) return;
        if (underlayItem.isDying) return;
        this.itemsWaitingForDisappear++;
        underlayItem.gotHit(reason).then(function() {
          _this3.itemsWaitingForDisappear--;
          0 === underlayItem.lifePoints && (_this3.underlay[y][x] = null);
        });
      };
      _proto.gameItemDisappearanceFinished = function gameItemDisappearanceFinished(gameItem) {
        this.updateSpawnBlindSpotRequest = true;
        this.checkRespawnRequest = true;
        this.startCascadeRequest = true;
      };
      _proto.getMatchable = function getMatchable(replacementMap) {
        void 0 === replacementMap && (replacementMap = null);
        var matched = {};
        var matchGroups = {};
        var notStableEnoughItems = {};
        var candidates = [];
        var type = null;
        var x, y;
        for (y = 1; y < this.height; y++) {
          candidates.length = 0;
          type = null;
          for (x = 0; x <= this.width; x++) {
            var result = this._getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "line");
            type = result.type;
          }
        }
        for (x = 0; x < this.width; x++) {
          candidates.length = 0;
          type = null;
          for (y = 1; y <= this.height; y++) {
            var _result = this._getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "column");
            type = _result.type;
          }
        }
        if (GROUP_TYPE_POWERUP.square) for (y = 1; y < this.height - 1; y++) for (x = 0; x < this.width - 1; x++) {
          candidates.length = 0;
          type = null;
          for (var subY = y; subY <= y + 1; subY++) for (var subX = x; subX <= x + 1; subX++) {
            var _result2 = this._getMatchable(subX, subY, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "square");
            type = _result2.type;
          }
          this._getMatchable(-1, -1, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, "square");
        }
        var matchGroupsToDelete = {};
        for (var gameItemId in matched) notStableEnoughItems[gameItemId] && (matchGroupsToDelete[matched[gameItemId].matchGroupId] = true);
        for (var matchGroupId in matchGroupsToDelete) {
          for (var i = 0; i < matchGroups[matchGroupId].gameItems.length; i++) delete matched[matchGroups[matchGroupId].gameItems[i].uid];
          delete matchGroups[matchGroupId];
        }
        return {
          matched: matched,
          matchGroups: matchGroups
        };
      };
      _proto._getMatchable = function _getMatchable(x, y, replacementMap, candidates, matchGroups, matched, type, notStableEnoughItems, matchType) {
        var gameItem = y >= 1 && y < this.height && x >= 0 && x < this.width ? this.board[y][x] || this.next[y][x] : null;
        replacementMap && void 0 !== replacementMap[x + "_" + y] && (gameItem = replacementMap[x + "_" + y]);
        if (!gameItem || gameItem.type !== type || !gameItem.isMatchable) {
          var toReach = "square" === matchType ? 4 : 3;
          if (candidates.length >= toReach) {
            var isStable = true;
            for (var i = 0; i < candidates.length; i++) {
              if (notStableEnoughItems[candidates[i].uid]) {
                isStable = false;
                break;
              }
              isStable = isStable && this.isGameItemStableForMatch(candidates[i]);
              if (!isStable) break;
            }
            if (isStable) {
              var bestTargetPosition = this.getMostRecentlySwitchedItem(candidates);
              if (!bestTargetPosition) {
                var c = candidates[Math.floor(candidates.length / 2)];
                bestTargetPosition = {
                  boardX: c.boardX,
                  boardY: c.boardY
                };
              }
              var matchGroupUid = null;
              var gameItemIdsAlreadyInOtherGroups = null;
              var groupType = "square" === matchType ? "square" : 3 === candidates.length ? "three" : 4 === candidates.length ? "line" === matchType ? "four_h" : "four_v" : "five";
              var alreadyInMatchGroups = null;
              for (var _i = 0; _i < candidates.length; _i++) {
                if (!matched[candidates[_i].uid]) continue;
                gameItemIdsAlreadyInOtherGroups || (gameItemIdsAlreadyInOtherGroups = {});
                gameItemIdsAlreadyInOtherGroups[candidates[_i].uid] = true;
                var groupId = matched[candidates[_i].uid].matchGroupId;
                alreadyInMatchGroups || (alreadyInMatchGroups = {});
                alreadyInMatchGroups[groupId] = true;
                "square" !== matchType && (bestTargetPosition = {
                  boardX: candidates[_i].boardX,
                  boardY: candidates[_i].boardY
                });
              }
              if (alreadyInMatchGroups) {
                var bestMatchType = groupType;
                "square" !== matchType && GROUP_TYPE_PRIORITY["cross"] > GROUP_TYPE_PRIORITY[bestMatchType] && (bestMatchType = "cross");
                for (var evaluatedMatchGroupId in alreadyInMatchGroups) {
                  var evaluatedMatchGroupType = matchGroups[evaluatedMatchGroupId].groupType;
                  if (GROUP_TYPE_PRIORITY[evaluatedMatchGroupType] > GROUP_TYPE_PRIORITY[bestMatchType]) {
                    bestMatchType = evaluatedMatchGroupType;
                    bestTargetPosition = matchGroups[evaluatedMatchGroupId].targetPosition;
                  }
                }
                for (var _groupId in alreadyInMatchGroups) {
                  for (var j = 0; j < matchGroups[_groupId].gameItems.length; j++) {
                    var item = matchGroups[_groupId].gameItems[j];
                    gameItemIdsAlreadyInOtherGroups[item.uid] || candidates.push(item);
                    delete matched[item.uid];
                  }
                  delete matchGroups[_groupId];
                }
                groupType = bestMatchType;
              }
              this.matchGroupUid++;
              matchGroupUid = this.matchGroupUid;
              matchGroups[matchGroupUid] = {
                groupType: groupType,
                gameItems: [],
                targetPosition: {
                  boardX: bestTargetPosition.boardX,
                  boardY: bestTargetPosition.boardY
                }
              };
              for (var _i2 = 0; _i2 < candidates.length; _i2++) if (matched[candidates[_i2].uid]) console.warn("a game item already had a matched entry"); else {
                matched[candidates[_i2].uid] = {
                  matchGroupId: matchGroupUid,
                  gameItem: candidates[_i2]
                };
                matchGroups[matchGroupUid].gameItems.push(candidates[_i2]);
              }
            } else for (var _i3 = 0; _i3 < candidates.length; _i3++) notStableEnoughItems[candidates[_i3].uid] = true;
          }
          candidates.length = 0;
        }
        gameItem && gameItem.type && gameItem.isMatchable && candidates.push(gameItem);
        type = gameItem ? gameItem.type : null;
        return {
          x: x,
          y: y,
          replacementMap: replacementMap,
          candidates: candidates,
          matchGroups: matchGroups,
          matched: matched,
          type: type
        };
      };
      _proto.isGameItemStableForMatch = function isGameItemStableForMatch(gameItem) {
        if (!gameItem.isIdle()) return false;
        var leftStable = !this.next[gameItem.boardY][gameItem.boardX - 1];
        var rightStable = !this.next[gameItem.boardY][gameItem.boardX + 1];
        var topStable = !this.next[gameItem.boardY - 1] || !this.next[gameItem.boardY - 1][gameItem.boardX];
        var bottomStable = !this.next[gameItem.boardY + 1] || !this.next[gameItem.boardY + 1][gameItem.boardX];
        return leftStable && rightStable && topStable && bottomStable;
      };
      _proto.updateSpawnBlindSpot = function updateSpawnBlindSpot(forceImmediate) {
        void 0 === forceImmediate && (forceImmediate = false);
        if (!this.updateSpawnBlindSpotRequest && !forceImmediate) return;
        this.updateSpawnBlindSpotRequest = false;
        var blockedColumns = [];
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          if (blockedColumns[x]) {
            this.spawnBlindSpot[y][x] = true;
            continue;
          }
          var gameItem = this.board[y][x];
          gameItem && gameItem.isBlockingCascade && (blockedColumns[x] = true);
          this.spawnBlindSpot[y][x] = blockedColumns[x];
        }
      };
      _proto.startCascade = function startCascade() {
        if (!this.startCascadeRequest) return;
        this.startCascadeRequest = false;
        for (var y = this.height - 2; y >= 1; y--) for (var d = 0; d < 2; d++) {
          var diagonals = !!d;
          for (var x = 0; x < this.width; x++) {
            var gameItem = this.board[y][x];
            if (!gameItem) continue;
            if (gameItem.isBlockingCascade) continue;
            if (!gameItem.isIdle()) continue;
            var cascading = this.getCascadingTarget(x, y, diagonals);
            if (!cascading) continue;
            this.isCascading = true;
            debugLog(x + " x " + y + ": cascading to ", cascading);
            this._startCascadeItemTo(gameItem, cascading);
            this.checkRespawnRequest = true;
          }
        }
      };
      _proto._startCascadeItemTo = function _startCascadeItemTo(gameItem, cascading) {
        this.dragging.gameItem === gameItem && this.resetDrag();
        var alreadyCascading = gameItem.cascade.isCascading;
        if (alreadyCascading) {
          this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = null;
          this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = null;
          this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = null;
        } else this.board[gameItem.boardY][gameItem.boardX] = null;
        gameItem.lastSwitch = null;
        gameItem.cascade.previous = {
          boardX: alreadyCascading ? gameItem.cascade.next.boardX : gameItem.boardX,
          boardY: alreadyCascading ? gameItem.cascade.next.boardY : gameItem.boardY
        };
        gameItem.cascade["final"] = {
          boardX: cascading["final"].boardX,
          boardY: cascading["final"].boardY
        };
        gameItem.cascade.next = {
          boardX: cascading.next.boardX,
          boardY: cascading.next.boardY
        };
        if (this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX]) {
          console.error("There is already an item in this.previous[" + gameItem.cascade.previous.boardY + "][" + gameItem.cascade.previous.boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        if (this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX]) {
          console.error("There is already an item in this.next[" + gameItem.cascade.next.boardY + "][" + gameItem.cascade.next.boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        if (this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX]) {
          console.error("There is already an item in this.final[" + gameItem.cascade["final"].boardY + "][" + gameItem.cascade["final"].boardX + "]");
          if (this.app.IS_DEVELOPMENT) debugger;
        }
        this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = gameItem;
        this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = gameItem;
        this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = gameItem;
        if (!alreadyCascading) {
          gameItem.cascade.isCascading = true;
          gameItem.boardX = null;
          gameItem.boardY = null;
        }
      };
      _proto.update_cascade = function update_cascade(dt) {
        if (!this.isCascading) return;
        var now = this.app.now;
        var stillCascading = false;
        var FRAME_ID = performance.now();
        for (var y = this.height - 1; y >= 1; y--) {
          var handled = {};
          for (var d = 0; d < 2; d++) {
            var diagonals = !!d;
            for (var x = 0; x < this.width; x++) {
              var gameItem = this.next[y][x];
              if (!gameItem) continue;
              if (handled[gameItem.uid]) continue;
              if (gameItem.cascade.delayUntil > now) {
                stillCascading = true;
                continue;
              }
              var velocity = gameItem.velocity + GRAVITY * dt * TILE_SIZE;
              var nextY = gameItem.node.y - velocity;
              var itemBelow = this.previous[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX];
              if (itemBelow && nextY - TILE_SIZE / 2 <= itemBelow.node.y + TILE_SIZE / 2) {
                if (gameItem.cascade.traveled) if (itemBelow.velocity && itemBelow.cascade.traveled) {
                  gameItem.velocity = (itemBelow.velocity + gameItem.velocity) / 2;
                  itemBelow.velocity = gameItem.velocity;
                } else gameItem.velocity = itemBelow.velocity; else {
                  gameItem.cascade.delayUntil = now + 50;
                  if (0 !== gameItem.velocity) {
                    console.error("an item did not travel but its velocity is above 0");
                    gameItem.velocity = 0;
                  }
                }
                velocity = Math.max(0, Math.min(gameItem.velocity, gameItem.node.y - itemBelow.node.y - TILE_SIZE));
                nextY = gameItem.node.y - velocity;
              }
              var nextX = gameItem.node.x + velocity * (gameItem.cascade.next.boardX - gameItem.cascade.previous.boardX);
              if (nextY <= this.boardYToViewY(gameItem.cascade.next.boardY)) {
                debugLog("[" + FRAME_ID + "] " + gameItem.cascade.next.boardX + " x " + gameItem.cascade.next.boardY + ") reached...");
                if (gameItem.isSpawning) {
                  gameItem.isSpawning = false;
                  gameItem.node.parent.removeChild(gameItem.node);
                  this.view.addChild(gameItem.node);
                }
                this.startCascadeRequest = true;
                if (gameItem.shouldExplode) {
                  handled[gameItem.uid] = true;
                  debugLog("[" + FRAME_ID + "] ... now stopping for explosion");
                  this._itemStopCascading(gameItem);
                  this.hitGameItem(gameItem, gameItem.shouldExplodeReason);
                  continue;
                }
                if (!diagonals) {
                  var _cascading = this.getCascadingTarget(x, y, false, gameItem.uid);
                  if (!_cascading) {
                    debugLog("[" + FRAME_ID + "] ... cannot continue drop vertically, will retry with diagonals");
                    continue;
                  }
                  handled[gameItem.uid] = true;
                  stillCascading = true;
                  gameItem.velocity = velocity;
                  this._weCanCascade(gameItem, _cascading, nextY);
                  this.checkRespawnRequest = true;
                  debugLog("[" + FRAME_ID + "] ... now heading to:", _cascading);
                  continue;
                }
                handled[gameItem.uid] = true;
                var cascading = this.getCascadingTarget(x, y, true, gameItem.uid);
                if (!cascading) {
                  debugLog("[" + FRAME_ID + "] ... now stopping");
                  this.checkRespawnRequest = true;
                  this._itemStopCascading(gameItem);
                  continue;
                }
                stillCascading = true;
                gameItem.velocity = velocity;
                this._weCanCascade(gameItem, cascading, nextY);
                this.checkRespawnRequest = true;
                debugLog("[" + FRAME_ID + "] ... now heading to:", cascading);
                continue;
              }
              gameItem.node.x = nextX;
              gameItem.node.y = nextY;
              gameItem.cascade.traveled = true;
              handled[gameItem.uid] = true;
              gameItem.velocity = velocity;
              stillCascading = true;
            }
          }
        }
        this.isCascading = stillCascading;
      };
      _proto._weCanCascade = function _weCanCascade(gameItem, cascading, nextY) {
        var reachedFinal = gameItem.cascade["final"].boardX === gameItem.cascade.next.boardX && gameItem.cascade["final"].boardY === gameItem.cascade.next.boardY;
        reachedFinal || gameItem.cascade["final"].boardX === cascading["final"].boardX && gameItem.cascade["final"].boardY === cascading["final"].boardY || console.warn("Final tile changed during the drop");
        this._startCascadeItemTo(gameItem, cascading);
        gameItem.node.y = nextY;
        var deltaY = this.boardYToViewY(gameItem.cascade.previous.boardY) - gameItem.node.y;
        gameItem.node.x = this.boardXToViewX(gameItem.cascade.previous.boardX) + deltaY * (gameItem.cascade.next.boardX - gameItem.cascade.previous.boardX);
      };
      _proto._itemStopCascading = function _itemStopCascading(gameItem) {
        gameItem.node.x = this.boardXToViewX(gameItem.cascade.next.boardX);
        gameItem.node.y = this.boardYToViewY(gameItem.cascade.next.boardY);
        gameItem.boardX = gameItem.cascade.next.boardX;
        gameItem.boardY = gameItem.cascade.next.boardY;
        this.board[gameItem.boardY][gameItem.boardX] = gameItem;
        this.previous[gameItem.cascade.previous.boardY][gameItem.cascade.previous.boardX] = null;
        this.next[gameItem.cascade.next.boardY][gameItem.cascade.next.boardX] = null;
        this["final"][gameItem.cascade["final"].boardY][gameItem.cascade["final"].boardX] = null;
        gameItem.cascade.next = null;
        gameItem.cascade["final"] = null;
        gameItem.cascade.previous = null;
        gameItem.cascade.delayUntil = null;
        gameItem.cascade.traveled = false;
        gameItem.cascade.isCascading = false;
        gameItem.velocity = 0;
        this.checkMatchesRequest = true;
      };
      _proto.getCascadingTarget = function getCascadingTarget(boardX, boardY, checkDiagonals, ignoreItemUid) {
        void 0 === checkDiagonals && (checkDiagonals = false);
        void 0 === ignoreItemUid && (ignoreItemUid = -1);
        if (boardY === this.height - 1) return null;
        if (boardX < 0 || boardX > this.width - 1) return null;
        if (checkDiagonals) {
          var droppedVerticallyFirst = false;
          for (var _y = boardY; _y < this.height - 1; _y++) {
            if (this.spawnBlindSpot[_y][boardX - 1]) {
              var leftBelowFreeSpace = this.getCascadingTarget(boardX - 1, _y, false, ignoreItemUid);
              if (leftBelowFreeSpace) return {
                next: {
                  boardX: boardX - (droppedVerticallyFirst ? 0 : 1),
                  boardY: boardY + 1
                },
                final: {
                  boardX: leftBelowFreeSpace["final"].boardX,
                  boardY: leftBelowFreeSpace["final"].boardY
                }
              };
            }
            if (this.spawnBlindSpot[_y][boardX + 1]) {
              var rightBelowFreeSpace = this.getCascadingTarget(boardX + 1, _y, false, ignoreItemUid);
              if (rightBelowFreeSpace) return {
                next: {
                  boardX: boardX + (droppedVerticallyFirst ? 0 : 1),
                  boardY: boardY + 1
                },
                final: {
                  boardX: rightBelowFreeSpace["final"].boardX,
                  boardY: rightBelowFreeSpace["final"].boardY
                }
              };
            }
            if (this.background[_y + 1][boardX] || this.board[_y + 1][boardX] || this.next[_y + 1][boardX] && this.next[_y + 1][boardX].uid !== ignoreItemUid || this["final"][_y + 1][boardX] && this["final"][_y + 1][boardX].uid !== ignoreItemUid) break;
            droppedVerticallyFirst = true;
          }
        } else for (var y = boardY + 1; y < this.height; y++) {
          if (this.board[y][boardX]) return null;
          var next = this.next[y][boardX];
          if (next && next.uid !== ignoreItemUid) return null;
          var _final = this["final"][y][boardX];
          if (_final && _final.uid !== ignoreItemUid) return null;
          if (this.background[y][boardX]) return {
            next: {
              boardX: boardX,
              boardY: boardY + 1
            },
            final: {
              boardX: boardX,
              boardY: y
            }
          };
        }
        return null;
      };
      _proto.lockUserInteraction = function lockUserInteraction(reason) {
        if (!reason) {
          console.warn("Please provide a reason when locking user interaction");
          reason = "unknown";
        }
        this.lockedUserInteractionReasons[reason] && console.warn('GameBoard is already locked for reason "' + reason + '"');
        this.lockedUserInteractionReasons[reason] = true;
        this.lockedUserInteraction = true;
      };
      _proto.unlockUserInteraction = function unlockUserInteraction(reason) {
        if (!reason) {
          console.warn("Please provide a reason when unlocking user interaction");
          reason = "unknown";
        }
        this.lockedUserInteractionReasons[reason] || console.error('GameBoard is not locked for reason "' + reason + '"');
        this.lockedUserInteractionReasons[reason] = false;
        for (reason in this.lockedUserInteractionReasons) if (this.lockedUserInteractionReasons[reason]) {
          this.lockedUserInteraction = true;
          return;
        }
        this.lockedUserInteraction = false;
      };
      _proto.onTouchStart = function onTouchStart(e) {
        if (this.lockedUserInteraction) return;
        if (this.booster) return;
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        if (!DYNAMIC_USER_INTERACTION && !this.isIdle) return this.resetDrag();
        this.resetDrag();
        var location = e.getLocation();
        var _this$view$convertToN = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN.x, y = _this$view$convertToN.y;
        var gameItem = this.gameItemFromTouchEvent(e);
        if (!gameItem) return;
        if (gameItem.isBlockingCascade) return;
        if (!gameItem.isIdle()) return;
        this.dragging.gameItem = gameItem;
        this.dragging.startX = x;
        this.dragging.startY = y;
        var material = this.spriteCollection.material_highlight;
        this.highlightTimer = 0;
        material.setProperty("hl_timer", this.highlightTimer);
        gameItem.highlight(material);
      };
      _proto.onTouchMove = function onTouchMove(e) {
        var _this4 = this;
        if (this.lockedUserInteraction) return this.resetDrag();
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        if (!this.dragging.gameItem) return;
        var gameItem = this.dragging.gameItem;
        var location = e.getLocation();
        var _this$view$convertToN2 = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN2.x, y = _this$view$convertToN2.y;
        var deltaX = this.dragging.startX - x;
        var deltaY = this.dragging.startY - y;
        var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < .5 * TILE_SIZE) return;
        var target = null;
        Math.abs(deltaX) >= Math.abs(2 * deltaY) ? target = {
          boardX: deltaX > 0 ? gameItem.boardX - 1 : gameItem.boardX + 1,
          boardY: gameItem.boardY
        } : Math.abs(deltaY) >= Math.abs(2 * deltaX) && (target = {
          boardX: gameItem.boardX,
          boardY: deltaY > 0 ? gameItem.boardY + 1 : gameItem.boardY - 1
        });
        if (!this.tutorialController.validateMove("swap", gameItem, target)) return;
        var isValid = true;
        var targetItem = null;
        var lockedGameItems = null;
        var srcWillMatch = false;
        var targetWillMatch = false;
        var containsPowerup = false;
        target ? target.boardX > this.width - 1 ? isValid = false : target.boardX < 0 ? isValid = false : target.boardY > this.height - 1 ? isValid = false : target.boardY < 1 && (isValid = false) : isValid = false;
        if (isValid) {
          targetItem = this.board[target.boardY][target.boardX];
          if (targetItem) !targetItem.isBlockingCascade && targetItem.isIdle() || (isValid = false); else {
            this.next[target.boardY][target.boardX] && (isValid = false);
            this["final"][target.boardY][target.boardX] && (isValid = false);
          }
        }
        if (isValid) {
          "bomb" === gameItem.type && (containsPowerup = true);
          "sniper" === gameItem.type && (containsPowerup = true);
          "discoball" === gameItem.type && (containsPowerup = true);
          "missiles1" === gameItem.type && (containsPowerup = true);
          "missiles2" === gameItem.type && (containsPowerup = true);
          if (targetItem) {
            "bomb" === targetItem.type && (containsPowerup = true);
            "sniper" === targetItem.type && (containsPowerup = true);
            "discoball" === targetItem.type && (containsPowerup = true);
            "missiles1" === targetItem.type && (containsPowerup = true);
            "missiles2" === targetItem.type && (containsPowerup = true);
          }
        }
        if (!containsPowerup && isValid) {
          var replacementMap = {};
          replacementMap[gameItem.boardX + "_" + gameItem.boardY] = targetItem;
          replacementMap[target.boardX + "_" + target.boardY] = gameItem;
          var _this$getMatchable2 = this.getMatchable(replacementMap), matched = _this$getMatchable2.matched, matchGroups = _this$getMatchable2.matchGroups;
          if (matched[gameItem.uid] || targetItem && matched[targetItem.uid]) {
            lockedGameItems = [];
            var matchGroup1Id = matched[gameItem.uid] && matched[gameItem.uid].matchGroupId;
            var matchGroup2Id;
            targetItem && (matchGroup2Id = matched[targetItem.uid] && matched[targetItem.uid].matchGroupId);
            if (matchGroup1Id) {
              srcWillMatch = true;
              for (var i = 0; i < matchGroups[matchGroup1Id].gameItems.length; i++) {
                matchGroups[matchGroup1Id].gameItems[i].locksForUpcomingMatch++;
                lockedGameItems.push(matchGroups[matchGroup1Id].gameItems[i]);
              }
            }
            if (matchGroup2Id) {
              targetWillMatch = true;
              for (var _i4 = 0; _i4 < matchGroups[matchGroup2Id].gameItems.length; _i4++) {
                matchGroups[matchGroup2Id].gameItems[_i4].locksForUpcomingMatch++;
                lockedGameItems.push(matchGroups[matchGroup2Id].gameItems[_i4]);
              }
            }
          } else isValid = false;
        }
        if (!isValid) {
          this.resetDrag();
          return;
        }
        var tmpX = gameItem.boardX;
        var tmpY = gameItem.boardY;
        gameItem.boardX = target.boardX;
        gameItem.boardY = target.boardY;
        if (targetItem) {
          targetItem.boardX = tmpX;
          targetItem.boardY = tmpY;
        }
        this.board[gameItem.boardY][gameItem.boardX] = gameItem;
        this.board[targetItem ? targetItem.boardY : tmpY][targetItem ? targetItem.boardX : tmpX] = targetItem;
        this.resetDrag();
        var promisesCollection = [];
        promisesCollection.push(gameItem.switchSpriteTo(this.boardXToViewX(gameItem.boardX), this.boardYToViewY(gameItem.boardY), srcWillMatch));
        targetItem && promisesCollection.push(targetItem.switchSpriteTo(this.boardXToViewX(targetItem.boardX), this.boardYToViewY(targetItem.boardY), targetWillMatch));
        this.switchingCount++;
        this.onMoveTriggered();
        Promise.all(promisesCollection).then(function() {
          if (lockedGameItems) for (var _i5 = 0; _i5 < lockedGameItems.length; _i5++) {
            lockedGameItems[_i5] && lockedGameItems[_i5].locksForUpcomingMatch || console.warn("an item locked for upcoming match had his status changed");
            lockedGameItems[_i5].locksForUpcomingMatch--;
          }
          "sniper" === gameItem.type && _this4.triggerSniper(gameItem);
          "bomb" === gameItem.type && _this4.triggerBomb(gameItem);
          "discoball" === gameItem.type && _this4.triggerDiscoball(gameItem, targetItem);
          "missiles1" !== gameItem.type && "missiles2" !== gameItem.type || _this4.triggerMissile(gameItem);
          if (targetItem) {
            "sniper" === targetItem.type && _this4.triggerSniper(targetItem);
            "bomb" === targetItem.type && _this4.triggerBomb(targetItem);
            "discoball" === targetItem.type && _this4.triggerDiscoball(targetItem, gameItem);
            "missiles1" !== targetItem.type && "missiles2" !== targetItem.type || _this4.triggerMissile(targetItem);
          }
          _this4.checkMatchesRequest = true;
          _this4.switchingCount--;
          _this4.tutorialController.stepUp("swap");
        });
      };
      _proto.onTouchEnd = function onTouchEnd(e) {
        if (this.booster) {
          var _gameItem2 = this.gameItemFromTouchEvent(e);
          if (!_gameItem2) return;
          if (!this.isValidForBoosterActivation(_gameItem2)) return;
          this.exitBoosterMode(this.activateBooster(_gameItem2));
        }
        if (this.lockedUserInteraction) return this.resetDrag();
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        var gameItem = this.dragging.gameItem;
        if (!this.tutorialController.validateMove("tap", gameItem)) return this.resetDrag();
        if (gameItem && !gameItem.isSwitching) {
          var isValidMove;
          isValidMove = "bomb" === gameItem.type ? this.triggerBomb(gameItem) : "sniper" === gameItem.type ? this.triggerSniper(gameItem) : "missiles1" === gameItem.type || "missiles2" === gameItem.type ? this.triggerMissile(gameItem) : "discoball" === gameItem.type && this.triggerDiscoball(gameItem);
          if (isValidMove) {
            this.tutorialController.stepUp("tap");
            this.onMoveTriggered();
          }
        }
        this.resetDrag();
      };
      _proto.onTouchCancel = function onTouchCancel(e) {
        if (this.explodingDiscoBalls.length > 0) return this.resetDrag();
        this.onTouchEnd(e);
      };
      _proto.resetDrag = function resetDrag() {
        this.dragging.gameItem && this.dragging.gameItem.unHighlight();
        this.dragging = {
          gameItem: null,
          startX: null,
          startY: null
        };
      };
      _proto.gameItemFromTouchEvent = function gameItemFromTouchEvent(e) {
        var location = e.getLocation();
        var _this$view$convertToN3 = this.view.convertToNodeSpaceAR(location), x = _this$view$convertToN3.x, y = _this$view$convertToN3.y;
        var boardX = this.viewXToBoardX(x);
        var boardY = this.viewYToBoardY(y);
        if (!this.isValidCoordinate(boardX, boardY)) return null;
        return this.board[boardY][boardX] || this.underlay[boardY][boardX];
      };
      _proto.enterBoosterMode = function enterBoosterMode(type) {
        this.booster = type;
      };
      _proto.exitBoosterMode = function exitBoosterMode(boosterActivated) {
        this.onBoosterModeEnd(boosterActivated, this.booster);
        this.booster = null;
      };
      _proto.cancelBoosterMode = function cancelBoosterMode() {
        this.booster = null;
      };
      _proto.isValidForBoosterActivation = function isValidForBoosterActivation(gameItem) {
        switch (this.booster) {
         case "paintbrush":
          return gameItem.isBasicType() && gameItem.type !== this.boosterController.getPaintbrushTargetType();

         case "fairystick":
          return gameItem.isBasicType();

         default:
          return true;
        }
      };
      _proto.activateBooster = function activateBooster(gameItem) {
        if (!this.booster) return false;
        if (this.lockedUserInteraction) return false;
        if (this.explodingDiscoBalls.length > 0) return false;
        if (!DYNAMIC_USER_INTERACTION && !this.isIdle) return false;
        if (!gameItem) return false;
        if (!gameItem.isIdle()) return false;
        this.resetDrag();
        switch (this.booster) {
         case "airplane":
          return this.triggerAirplane(gameItem);

         case "rocket":
          return this.triggerRocket(gameItem);

         case "paintbrush":
          return this.triggerPaintbrush(gameItem);

         case "fairystick":
          return this.triggerFairystick(gameItem);

         case "wheel":
          return this.triggerWheel();

         case "hammer":
         default:
          return this.triggerHammer(gameItem);
        }
      };
      _proto.triggerHammer = function triggerHammer(gameItem) {
        return this.hitGameItemCoordinate(gameItem, {
          type: "booster",
          uid: Math.random()
        });
      };
      _proto.triggerAirplane = function triggerAirplane(gameItem) {
        if (!gameItem.isIdle()) return false;
        var _gameItem$node = gameItem.node, x = _gameItem$node.x, y = _gameItem$node.y;
        var node = this._createFlame(this.boardXToViewX(-1), y, 0, .2);
        var projectile = {
          node: node,
          direction: AROUND[1],
          onTick: this._moveMissile.bind(this),
          velocity: BOOSTER_PROJECTILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: {},
          reason: {
            type: "booster",
            uid: node.uuid
          }
        };
        _helpers["default"].createSprite({
          spriteFrame: this.spriteCollection.airplane,
          view: projectile.node,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          scale: {
            x: -BOOSTER_SCALE,
            y: BOOSTER_SCALE
          },
          x: 80,
          y: 20
        });
        projectile.previousPosition = {
          boardX: 0,
          boardY: gameItem.boardY
        };
        this.movingSprites.push(projectile);
        return true;
      };
      _proto.triggerRocket = function triggerRocket(gameItem) {
        if (!gameItem.isIdle()) return false;
        var _gameItem$node2 = gameItem.node, x = _gameItem$node2.x, y = _gameItem$node2.y;
        var node = this._createFlame(x, this.boardYToViewY(this.height), 90, .2);
        var projectile = {
          node: node,
          direction: AROUND[3],
          onTick: this._moveMissile.bind(this),
          velocity: BOOSTER_PROJECTILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: {},
          reason: {
            type: "booster",
            uid: node.uuid
          }
        };
        _helpers["default"].createSprite({
          spriteFrame: this.spriteCollection.rocket,
          view: projectile.node,
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          scale: {
            x: BOOSTER_SCALE,
            y: BOOSTER_SCALE
          },
          angle: 240,
          x: 80
        });
        projectile.previousPosition = {
          boardX: gameItem.boardX,
          boardY: this.height - 1
        };
        this.movingSprites.push(projectile);
        return true;
      };
      _proto.triggerPaintbrush = function triggerPaintbrush(gameItem) {
        var _this5 = this;
        this.itemsWaitingForDisappear++;
        var transformedOpts = _extends({}, gameItem.options);
        transformedOpts.type = this.boosterController.getPaintbrushTargetType();
        this.transformItem(gameItem, transformedOpts).then(function() {
          _this5.itemsWaitingForDisappear--;
          _this5.checkMatchesRequest = true;
        });
        return true;
      };
      _proto.triggerFairystick = function triggerFairystick(gameItem) {
        if (!gameItem.isIdle()) return false;
        this.movingSprites.push({
          targetType: gameItem.type,
          selectedItem: gameItem,
          pool: [],
          nextUpdate: this.app.now + DISCOBALL_DELAY_BETWEEN_ITEMS,
          onTick: this._animateFairystick.bind(this),
          firstItemPushed: false,
          uid: gameItem.uid
        });
        this.explodingDiscoBalls.push(gameItem.type);
        return true;
      };
      _proto.triggerWheel = function triggerWheel() {
        var _this6 = this;
        var items = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isBasicType() && !gameItem.isPowerUpType()) continue;
          items.push(gameItem);
        }
        if (items.length <= 1) return false;
        var replacementMap = {};
        var shuffledItems = [].concat(items);
        _helpers["default"].shuffleArray(shuffledItems);
        for (var i = 0; i < items.length; i++) replacementMap[items[i].boardX + "_" + items[i].boardY] = shuffledItems[i];
        this._switchPlaces(replacementMap).then(function() {
          _this6.checkMatchesRequest = true;
        });
        return true;
      };
      _proto.triggerFullTypeWheel = function triggerFullTypeWheel() {
        var _this7 = this;
        if (!this.app.IS_DEVELOPMENT) return;
        var gameItems = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          gameItems.push(gameItem);
        }
        var shuffledItemOptions = gameItems.map(function(e) {
          return e.options;
        });
        _helpers["default"].shuffleArray(shuffledItemOptions);
        var promiseCollection = [];
        for (var i = 0; i < gameItems.length; i++) promiseCollection.push(this.transformItem(gameItems[i], _extends({}, shuffledItemOptions[i])));
        this.itemsWaitingForDisappear++;
        Promise.all(promiseCollection).then(function() {
          _this7.itemsWaitingForDisappear--;
          _this7.checkMatchesRequest = true;
        });
        return false;
      };
      _proto._animateFairystick = function _animateFairystick(data, dt) {
        var pool = data.pool, nextUpdate = data.nextUpdate, targetType = data.targetType, selectedItem = data.selectedItem, firstItemPushed = data.firstItemPushed, uid = data.uid;
        var now = this.app.now;
        var delta = now - nextUpdate;
        if (delta < 0) return;
        var newPool = this._discoballGetAllByType(targetType);
        if (!newPool.length) {
          var comboId = uid;
          this.comboReportStart(comboId);
          for (var _iterator2 = _createForOfIteratorHelperLoose(pool), _step2; !(_step2 = _iterator2()).done; ) {
            var _gameItem3 = _step2.value;
            if (!_gameItem3 || _gameItem3.isDying) continue;
            _gameItem3.unhighlightDisco();
            this.hitUnderlay(_gameItem3.boardX, _gameItem3.boardY, "booster");
            this.hitGameItem(_gameItem3, {
              type: "booster",
              uid: comboId
            });
            this.comboReportAdd(comboId, _gameItem3);
          }
          this.comboReportEnd(comboId, "booster");
          _helpers["default"].removeFromArray(targetType, this.explodingDiscoBalls);
          _helpers["default"].removeFromArray(data, this.movingSprites);
          return;
        }
        var gameItem;
        if (firstItemPushed) gameItem = newPool[Math.floor(this.rnd.random() * newPool.length)]; else {
          gameItem = selectedItem;
          data.firstItemPushed = true;
        }
        pool.push(gameItem);
        gameItem.highlightDisco();
        gameItem.lockedForDiscoball = true;
        data.nextUpdate = now + DISCOBALL_DELAY_BETWEEN_ITEMS - delta;
      };
      _proto.triggerBomb = function triggerBomb(gameItem) {
        var RADIUS = BOMB_RADIUS;
        var DURATION = BOMB_EXPLOSION_DURATION;
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        gameItem.node.zIndex = Z_INDEX.EXPLODING_BOMB;
        var fromX = Math.max(0, gameItem.boardX - RADIUS);
        var toX = Math.min(this.width - 1, gameItem.boardX + RADIUS);
        var fromY = Math.max(1, gameItem.boardY - RADIUS);
        var toY = Math.min(this.height - 1, gameItem.boardY + RADIUS);
        var now = this.app.now;
        var shorterItemExplosionDelay = DURATION / 2;
        var comboId = gameItem.uid;
        this.comboReportStart(comboId);
        var gi;
        var reason = {
          type: "powerup",
          uid: gameItem.node.uuid
        };
        this.comboReportAdd(comboId, gameItem);
        for (var _b = 0; _b <= 1; _b++) for (var y = fromY; y <= toY; y++) for (var x = fromX; x <= toX; x++) {
          _b && this.hitUnderlay(x, y, reason);
          gi = (_b ? this.board : this.next)[y][x];
          if (!gi) continue;
          if (gi.isDying) continue;
          if (gi.shouldExplode) continue;
          this.comboReportAdd(comboId, gi);
          if (_b) this.hitGameItem(gi, reason); else {
            gi.shouldExplode = true;
            gi.shouldExplodeReason = reason;
          }
        }
        this.comboReportEnd(comboId, "powerup");
        gameItem.zIndex = Z_INDEX.EXPLODING_BOMB;
        var bombAnim = gameItem.layers.spine.getComponent(sp.Skeleton);
        bombAnim.setAnimation(0, "boom", false);
        bombAnim.setCompleteListener(function() {
          gameItem.destroyFromBoard();
        });
        this.board[gameItem.boardY][gameItem.boardX] = null;
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerMissile = function triggerMissile(gameItem) {
        var _affectedTargets;
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var _gameItem$node3 = gameItem.node, x = _gameItem$node3.x, y = _gameItem$node3.y;
        var missile1, missile2;
        var defaultOptions = {
          onTick: this._moveMissile.bind(this),
          velocity: MISSILE_VELOCITY,
          startedRemovalAt: 0,
          previousPosition: null,
          affectedTargets: (_affectedTargets = {}, _affectedTargets[gameItem.boardX + "_*"] = true, 
          _affectedTargets),
          srcUid: gameItem.uid,
          reason: {
            type: "powerup",
            uid: gameItem.node.uuid
          }
        };
        if ("missiles1" === gameItem.type) {
          missile1 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinLeft, x, y),
            direction: AROUND[0]
          }, defaultOptions);
          missile2 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinRight, x, y),
            direction: AROUND[1]
          }, defaultOptions);
        } else {
          missile1 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinUp, x, y),
            direction: AROUND[3]
          }, defaultOptions);
          missile2 = _extends({
            node: this._createMissile(SPINE_NAMES.rocketSkinDown, x, y),
            direction: AROUND[2]
          }, defaultOptions);
        }
        missile1.previousPosition = {
          boardX: gameItem.boardX,
          boardY: gameItem.boardY
        };
        missile2.previousPosition = {
          boardX: gameItem.boardX,
          boardY: gameItem.boardY
        };
        this.movingSprites.push(missile1, missile2);
        this.board[gameItem.boardY][gameItem.boardX] = null;
        gameItem.destroyFromBoard();
        this.gameItemDisappearanceFinished(gameItem);
        var comboId = gameItem.uid;
        this.comboReportStart(comboId);
        this.comboReportAdd(comboId, gameItem);
        this.comboReportEnd(comboId, "powerup");
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerDiscoball = function triggerDiscoball(gameItem, targetItem) {
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var invalidTypes = {};
        for (var _iterator3 = _createForOfIteratorHelperLoose(this.explodingDiscoBalls), _step3; !(_step3 = _iterator3()).done; ) {
          var invalidType = _step3.value;
          invalidTypes[invalidType] = true;
        }
        var targetType = "basic1";
        if (targetItem && targetItem.isMatchable && !invalidTypes[targetItem.type]) targetType = targetItem.type; else {
          var typesCount = {};
          for (var y = 1; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
            var _gameItem4 = this.board[y][x] || this.next[y][x];
            if (!_gameItem4) continue;
            if (!_gameItem4.isMatchable) continue;
            if (_gameItem4.isDying) continue;
            if (_gameItem4.lockedForDiscoball) continue;
            if (invalidTypes[_gameItem4.type]) continue;
            typesCount[_gameItem4.type] || (typesCount[_gameItem4.type] = 0);
            typesCount[_gameItem4.type]++;
          }
          for (var type in typesCount) (!typesCount[targetType] || typesCount[type] > typesCount[targetType]) && (targetType = type);
        }
        gameItem.node.zIndex = Z_INDEX.DISCOBALL_ROTATING;
        gameItem.layers.spine.active = true;
        gameItem.layers["default"].active = false;
        gameItem.currentLayerId = "spine";
        var skeleton = gameItem.layers.spine.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "start", false);
        skeleton.setCompleteListener(function() {
          skeleton.setCompleteListener(null);
          skeleton.setAnimation(0, "idle", true);
        });
        this.movingSprites.push({
          discoBall: gameItem,
          targetType: targetType,
          pool: [],
          nextUpdate: this.app.now + DISCOBALL_DELAY_BETWEEN_ITEMS,
          onTick: this._animateDiscoBall.bind(this),
          raysOfLightFinished: 0
        });
        this.explodingDiscoBalls.push(targetType);
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto.triggerSniper = function triggerSniper(gameItem) {
        if (gameItem.isDying) return false;
        gameItem.isDying = true;
        var target = this._getSniperTarget();
        target && (this.sniperTargets[target.uid] = true);
        gameItem.node.zIndex = Z_INDEX.FLYING_SNIPER;
        var initialAngle;
        if (target) {
          var targetVector = {
            x: target.node.x - gameItem.node.x,
            y: target.node.y - gameItem.node.y
          };
          var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
          initialAngle = targetAngle + 55 * (this.rnd.random() > .5 ? -1 : 1);
        } else {
          initialAngle = gameItem.boardX <= this.width / 2 ? 45 : -45;
          gameItem.boardY <= this.height / 2 && (initialAngle > 0 ? initialAngle += 90 : initialAngle -= 90);
        }
        gameItem.layers.spine.active = true;
        gameItem.layers["default"].active = false;
        gameItem.currentLayerId = "spine";
        var skeleton = gameItem.layers.spine.getComponent(sp.Skeleton);
        skeleton.setAnimation(0, "start", false);
        skeleton.setCompleteListener(function() {
          skeleton.setCompleteListener(null);
          skeleton.setAnimation(0, "frisbee", true);
        });
        this.itemsWaitingForDisappear++;
        this.movingSprites.push({
          startTime: this.app.now,
          gameItem: gameItem,
          target: target,
          targetBoardX: target && target.boardX,
          targetBoardY: target && target.boardY,
          directionAngle: initialAngle,
          nextTargetEvaluation: null,
          onTick: this._animateSniper.bind(this),
          landingStartedAt: null
        });
        this.onPowerUpTrigger(gameItem.type);
        return true;
      };
      _proto._animateSniper = function _animateSniper(sniperData, dt) {
        var gameItem = sniperData.gameItem, target = sniperData.target, targetBoardX = sniperData.targetBoardX, targetBoardY = sniperData.targetBoardY, landingStartedAt = sniperData.landingStartedAt;
        if (sniperData.startTime && (this.app.now - sniperData.startTime > SNIPER_TAKE_OFF_DURATION || sniperData.landingStartedAt)) {
          this.itemsWaitingForDisappear--;
          this.board[gameItem.boardY][gameItem.boardX] = null;
          this.gameItemDisappearanceFinished(gameItem);
          sniperData.startTime = null;
        }
        if (sniperData.landingStartedAt) {
          gameItem.node.x = .9 * gameItem.node.x + .1 * this.boardXToViewX(targetBoardX);
          gameItem.node.y = .9 * gameItem.node.y + .1 * this.boardYToViewY(targetBoardY);
          gameItem.node.scale = .9 * gameItem.node.scale + .1 * ITEM_SCALE * .1;
          gameItem.node.opacity *= .98;
          if (this.app.now > sniperData.landingStartedAt + SNIPER_EXPLOSION_DURATION) {
            gameItem.destroyFromBoard();
            _helpers["default"].removeFromArray(sniperData, this.movingSprites);
          }
          return;
        }
        gameItem.node.scale = .98 * gameItem.node.scale + 1.5 * ITEM_SCALE * .02;
        var isTargetValid = this._isValidSniperTarget(target);
        !isTargetValid || target.boardX === targetBoardX && target.boardY === targetBoardY || (isTargetValid = false);
        if (!isTargetValid) {
          target && delete this.sniperTargets[target.uid];
          target = null;
          if (!sniperData.nextTargetEvaluation || this.app.now >= sniperData.nextTargetEvaluation) {
            var newTarget = this._getSniperTarget();
            if (newTarget) {
              this.sniperTargets[newTarget.uid] = true;
              sniperData.target = newTarget;
              sniperData.targetBoardX = newTarget.boardX;
              sniperData.targetBoardY = newTarget.boardY;
              sniperData.nextTargetEvaluation = null;
              target = newTarget;
            } else sniperData.nextTargetEvaluation = this.app.now + LOGIC_UPDATE_INTERVAL;
          }
        }
        var newAngle = sniperData.directionAngle;
        if (target) {
          var deltaX = target.node.x - gameItem.node.x;
          var deltaY = target.node.y - gameItem.node.y;
          var targetVector = {
            x: deltaX,
            y: deltaY
          };
          var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
          var distanceToTarget = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
          var rotationSpeed = SNIPER_ROTATION_SPEED + Math.pow(1 / distanceToTarget * 1e4, 1.7);
          var minusDifference = (sniperData.directionAngle - targetAngle) % 360;
          minusDifference < 0 && (minusDifference += 360);
          newAngle = minusDifference < 180 ? (sniperData.directionAngle - rotationSpeed * dt + 360) % 360 : (sniperData.directionAngle + rotationSpeed * dt + 360) % 360;
        } else newAngle = (sniperData.directionAngle + SNIPER_ROTATION_SPEED * dt + 360) % 360;
        sniperData.directionAngle = newAngle;
        var distance = SNIPER_SPEED * dt;
        var currentVector = _helpers["default"].getVectorFromAngleAndLength(sniperData.directionAngle, distance);
        gameItem.node.x += currentVector.x;
        gameItem.node.y += currentVector.y;
        var boardX = this.viewXToBoardX(gameItem.node.x);
        var boardY = this.viewYToBoardY(gameItem.node.y);
        if (target && boardX === target.boardX && boardY === target.boardY) {
          this.hitGameItemCoordinate(target, {
            type: "powerup",
            uid: gameItem.node.uuid
          });
          delete this.sniperTargets[target.uid];
          sniperData.landingStartedAt = this.app.now;
          var comboId = gameItem.uid;
          this.comboReportStart(comboId);
          this.comboReportAdd(comboId, gameItem);
          this.comboReportAdd(comboId, target);
          this.comboReportEnd(comboId, "powerup");
        }
      };
      _proto._getSniperTarget = function _getSniperTarget() {
        var bestScore = 0;
        var bestItems = null;
        for (var y = 1; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
          var score = 0;
          var underlayItem = this.underlay[y][x];
          this._isValidSniperTarget(underlayItem) && (this.sniperTargets[underlayItem.uid] || (score = Math.max(100, score)));
          var gameItem = this.board[y][x] || underlayItem;
          if (!this._isValidSniperTarget(gameItem)) continue;
          if (this.sniperTargets[gameItem.uid]) continue;
          var type = gameItem.type;
          score = _simpleCrate["default"].is(type) || _bumper["default"].is(type) || _cabinet["default"].is(type) || "movableDestructible1" === type ? Math.max(100, score) : "bomb" === type || "sniper" === type || "discoball" === type || "missiles1" === type || "missiles2" === type ? Math.max(1, score - 1) : "basic5" === type ? Math.max(11, score) : Math.max(10, score);
          if (score > bestScore) {
            bestScore = score;
            bestItems = [];
          }
          score === bestScore && bestItems.push(gameItem);
        }
        if (!bestItems) return null;
        return bestItems[Math.floor(this.rnd.random() * bestItems.length)];
      };
      _proto._isValidSniperTarget = function _isValidSniperTarget(gameItem) {
        if (!gameItem) return false;
        if (!gameItem.isIdle()) return false;
        return true;
      };
      _proto._discoballGetAllByType = function _discoballGetAllByType(type) {
        var pool = [];
        for (var y = 0; y < this.height; y++) for (var x = 0; x <= this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isIdle()) continue;
          if (gameItem.type !== type) continue;
          pool.push(gameItem);
        }
        return pool;
      };
      _proto._animateDiscoBall = function _animateDiscoBall(discoBallData, dt) {
        var _this8 = this;
        var pool = discoBallData.pool, nextUpdate = discoBallData.nextUpdate, discoBall = discoBallData.discoBall, targetType = discoBallData.targetType;
        var now = this.app.now;
        var delta = now - nextUpdate;
        if (delta < 0) return;
        discoBallData.nextUpdate = now + DISCOBALL_DELAY_BETWEEN_ITEMS - delta;
        var newPool = this._discoballGetAllByType(targetType);
        if (!newPool.length) {
          if (discoBallData.raysOfLightFinished < pool.length) return;
          var comboId = discoBall.uid;
          this.comboReportStart(comboId);
          this.comboReportAdd(comboId, discoBall);
          for (var _iterator4 = _createForOfIteratorHelperLoose(pool), _step4; !(_step4 = _iterator4()).done; ) {
            var _gameItem5 = _step4.value;
            if (!_gameItem5 || _gameItem5.isDying) continue;
            _gameItem5.unhighlightDisco();
            this.hitUnderlay(_gameItem5.boardX, _gameItem5.boardY, "powerup");
            this.hitGameItem(_gameItem5, {
              type: "powerup",
              uid: comboId
            });
            this.comboReportAdd(comboId, _gameItem5);
          }
          this.itemsWaitingForDisappear++;
          discoBall.gotHit({
            type: "selfdestruction",
            uid: comboId
          }).then(function() {
            _this8.itemsWaitingForDisappear--;
            _this8.board[discoBall.boardY][discoBall.boardX] = null;
            _this8.gameItemDisappearanceFinished(discoBall);
          });
          this.hitUnderlay(discoBall.boardX, discoBall.boardY, "selfdestruction");
          this.comboReportEnd(comboId, "powerup");
          _helpers["default"].removeFromArray(targetType, this.explodingDiscoBalls);
          _helpers["default"].removeFromArray(discoBallData, this.movingSprites);
          return;
        }
        var gameItem = newPool[Math.floor(this.rnd.random() * newPool.length)];
        pool.push(gameItem);
        gameItem.lockedForDiscoball = true;
        var distance = Math.sqrt(Math.pow(gameItem.boardX - discoBall.boardX, 2) + Math.pow(gameItem.boardY - discoBall.boardY, 2));
        var targetVector = {
          x: gameItem.node.x - discoBall.node.x,
          y: gameItem.node.y - discoBall.node.y
        };
        var targetAngle = _helpers["default"].getAngleFromVector(targetVector.x, targetVector.y);
        var node = cc.instantiate(this.spriteCollection.rayOfLight);
        var anim = node.getComponent(sp.Skeleton);
        node.scaleX = distance * RAY_OF_LIGHT_SCALE;
        node.angle = 360 - targetAngle + 90;
        this.view.addChild(node);
        anim.setAnimation(0, "ray", false);
        anim.setCompleteListener(function() {
          discoBallData.raysOfLightFinished++;
          cc.tween(node).to(.5, {
            opacity: 0
          }, {
            easing: "sineIn"
          }).call(function() {
            node.destroy();
          }).start();
        });
        this.app.scheduler.setTimeout(function() {
          gameItem.highlightDisco();
        }, 200);
        node.zIndex = Z_INDEX.DISOBALL_RAY_OF_LIGHT;
        node.x = discoBall.node.x;
        node.y = discoBall.node.y;
      };
      _proto._moveMissile = function _moveMissile(missileData, dt) {
        missileData.startTime || (missileData.startTime = this.app.now);
        var node = missileData.node, direction = missileData.direction, velocity = missileData.velocity, previousPosition = missileData.previousPosition, affectedTargets = missileData.affectedTargets, reason = missileData.reason, startTime = missileData.startTime;
        node.x += direction.x * dt * velocity;
        node.y += direction.y * dt * velocity;
        if (missileData.startedRemovalAt) {
          var DISPARITION_DURATION = 1e3;
          node.opacity = 255 * Math.max(0, missileData.startedRemovalAt + DISPARITION_DURATION - this.app.now) / DISPARITION_DURATION;
          if (0 === node.opacity) {
            node.parent.removeChild(node);
            node.destroy();
            _helpers["default"].removeFromArray(missileData, this.movingSprites);
          }
          return;
        }
        var boardX = this.viewXToBoardX(node.x + direction.x * TILE_SIZE);
        var boardY = this.viewYToBoardY(node.y + direction.y * TILE_SIZE);
        var now = this.app.now;
        if (!this.isValidCoordinate(boardX, boardY)) {
          missileData.startedRemovalAt = now;
          return;
        }
        var comboId = missileData.srcUid;
        this.comboReportStart(comboId);
        var fromX = Math.min(previousPosition.boardX, boardX);
        var fromY = Math.min(previousPosition.boardY, boardY);
        var toX = Math.max(previousPosition.boardX, boardX);
        var toY = Math.max(previousPosition.boardY, boardY);
        for (var bx = fromX; bx <= toX; bx++) for (var by = fromY; by <= toY; by++) for (var _b2 = 0; _b2 <= 1; _b2++) {
          if (_b2) {
            var underlayItem = this.underlay[by][bx];
            if (underlayItem && !underlayItem.isDying && !affectedTargets[underlayItem.uid] && !affectedTargets["u_" + bx + "_" + by]) {
              affectedTargets[underlayItem.uid] = true;
              affectedTargets["u_" + bx + "_" + by] = true;
              this.hitUnderlay(bx, by, reason);
            }
          }
          var gameItem = (_b2 ? this.board : this.next)[by][bx];
          if (!gameItem) continue;
          if (affectedTargets[gameItem.uid]) continue;
          if (direction.x && affectedTargets[bx + "_*"]) continue;
          if (gameItem.creationTime >= startTime) continue;
          if (gameItem.isDying) continue;
          if (gameItem.lockedForDiscoball) continue;
          if (gameItem.shouldExplode) continue;
          gameItem.explosionDuration = ITEM_EXPLODE_DURATION / 2;
          affectedTargets[gameItem.uid] = true;
          direction.x && (affectedTargets[bx + "_*"] = true);
          if (_b2) this.hitGameItem(gameItem, reason); else {
            gameItem.shouldExplode = true;
            gameItem.shouldExplodeReason = reason;
          }
          this.comboReportAdd(comboId, gameItem);
        }
        this.comboReportEnd(comboId, reason);
        missileData.previousPosition.boardX = boardX;
        missileData.previousPosition.boardY = boardY;
      };
      _proto._createMissile = function _createMissile(skinId, x, y) {
        var node = cc.instantiate(this.spriteCollection.missileAnim);
        var anim = node.getComponent(sp.Skeleton);
        this.view.addChild(node);
        anim.setSkin(skinId);
        anim.setAnimation(0, "rocket", false);
        node.zIndex = Z_INDEX.FLYING_MISSILE;
        node.x = x;
        node.y = y;
        skinId === SPINE_NAMES.rocketSkinLeft ? node.angle = 180 : skinId === SPINE_NAMES.rocketSkinUp ? node.angle = 90 : skinId === SPINE_NAMES.rocketSkinDown && (node.angle = 270);
        return node;
      };
      _proto._createFlame = function _createFlame(x, y, angle, startAt) {
        var node = cc.instantiate(this.spriteCollection.flameAnim);
        this.view.addChild(node);
        var anim = node.getComponent(sp.Skeleton);
        anim.getCurrent(0).trackTime = startAt || 0;
        node.zIndex = Z_INDEX.BOOSTER_PROJECTILE;
        node.x = x;
        node.y = y;
        node.angle = angle;
        return node;
      };
      _proto.comboReportStart = function comboReportStart(comboId) {
        this.comboReport[comboId] = {};
      };
      _proto.comboReportAdd = function comboReportAdd(comboId, gameItem) {
        this.comboReport[comboId][gameItem.uid] = gameItem.type;
      };
      _proto.comboReportEnd = function comboReportEnd(comboId, comboType) {
        var report = [];
        var comboReport = this.comboReport[comboId];
        for (var gameItemUid in comboReport) report.push(comboReport[gameItemUid]);
        report.length && this.onCombo({
          type: comboType,
          items: report
        });
        delete this.comboReport[comboId];
      };
      _proto.isMoveAvailable = function isMoveAvailable() {
        if (!this.isIdle) return null;
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (gameItem.isPowerUpType()) return true;
        }
        for (var _y2 = 1; _y2 < this.height; _y2++) for (var _x = 0; _x < this.width; _x++) {
          var _gameItem6 = this.board[_y2][_x];
          if (!_gameItem6) continue;
          if (!_gameItem6.isBasicType()) continue;
          if (this.isValidCoordinate(_x - 1, _y2)) {
            var giLeft = this.board[_y2][_x - 1];
            if (giLeft && !giLeft.isBlockingCascade) {
              var replacementMap = {};
              replacementMap[giLeft.boardX + "_" + giLeft.boardY] = _gameItem6;
              replacementMap[_gameItem6.boardX + "_" + _gameItem6.boardY] = giLeft;
              var _this$getMatchable3 = this.getMatchable(replacementMap), matched = _this$getMatchable3.matched, matchGroups = _this$getMatchable3.matchGroups;
              if (Object.keys(matchGroups).length) return true;
            }
          }
          if (this.isValidCoordinate(_x, _y2 - 1)) {
            var giUp = this.board[_y2 - 1][_x];
            if (giUp && !giUp.isBlockingCascade) {
              var _replacementMap = {};
              _replacementMap[giUp.boardX + "_" + giUp.boardY] = _gameItem6;
              _replacementMap[_gameItem6.boardX + "_" + _gameItem6.boardY] = giUp;
              var _this$getMatchable4 = this.getMatchable(_replacementMap), _matched = _this$getMatchable4.matched, _matchGroups = _this$getMatchable4.matchGroups;
              if (Object.keys(_matchGroups).length) return true;
            }
          }
        }
        return false;
      };
      _proto.fixNoMoveAvailable = function fixNoMoveAvailable() {
        var gameItemsByType = {};
        var gameItemsById = {};
        var coordinatesPool = [];
        var coordinatesPoolMap = {};
        for (var y = 1; y < this.height; y++) for (var x = 0; x < this.width; x++) {
          var gameItem = this.board[y][x];
          if (!gameItem) continue;
          if (!gameItem.isBasicType()) continue;
          gameItemsByType[gameItem.type] || (gameItemsByType[gameItem.type] = []);
          gameItemsByType[gameItem.type].push(gameItem);
          gameItemsById[gameItem.uid] = gameItem;
          coordinatesPool.push({
            x: x,
            y: y
          });
          coordinatesPoolMap[x + "_" + y] = true;
        }
        for (var type in gameItemsByType) gameItemsByType[type].length < 3 && delete gameItemsByType[type];
        var typeCandidates = Object.keys(gameItemsByType);
        if (!typeCandidates.length) return this._fixNoMoveAvailableReplaceAll(gameItemsById);
        var selectedType = typeCandidates[Math.floor(this.rnd.random() * typeCandidates.length)];
        var candidates = gameItemsByType[selectedType];
        _helpers["default"].shuffleArray(candidates);
        var travelers = [ candidates[0], candidates[1], candidates[2] ];
        var destinationCandidates = [];
        var iv = this.isValidCoordinate;
        var tb = this.board;
        var cpm = coordinatesPoolMap;
        var x1, y1, x2, y2, x3, y3, checkHorizontal, checkVertical;
        for (var _y3 = 1; _y3 < this.height; _y3++) for (var _x2 = 0; _x2 < this.width; _x2++) {
          checkHorizontal = true;
          iv(_x2, _y3) && iv(_x2 + 1, _y3) && iv(_x2 + 2, _y3) || (checkHorizontal = false);
          checkHorizontal && tb[_y3][_x2] && tb[_y3][_x2 + 1] && tb[_y3][_x2 + 2] || (checkHorizontal = false);
          (!checkHorizontal || tb[_y3][_x2].isBlockingCascade || tb[_y3][_x2 + 1].isBlockingCascade || tb[_y3][_x2 + 2].isBlockingCascade) && (checkHorizontal = false);
          if (checkHorizontal) {
            x1 = _x2 - 1;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3 - 1;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3 + 1;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 - 1;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 + 1;
            x3 = _x2 + 2;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 3;
            y3 = _y3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3 - 1;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3;
            x3 = _x2 + 2;
            y3 = _y3 + 1;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
          }
          checkVertical = true;
          iv(_x2, _y3) && iv(_x2, _y3 + 1) && iv(_x2, _y3 + 2) || (checkVertical = false);
          checkVertical && tb[_y3][_x2] && tb[_y3 + 1] && tb[_y3 + 1][_x2] && tb[_y3 + 2] && tb[_y3 + 2][_x2] || (checkVertical = false);
          (!checkVertical || tb[_y3][_x2].isBlockingCascade || tb[_y3 + 1][_x2].isBlockingCascade || tb[_y3 + 2][_x2].isBlockingCascade) && (checkVertical = false);
          if (checkVertical) {
            x1 = _x2;
            y1 = _y3 - 1;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2 - 1;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2 + 1;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 - 1;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2 + 1;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2;
            y3 = _y3 + 3;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2 - 1;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
            x1 = _x2;
            y1 = _y3;
            x2 = _x2;
            y2 = _y3 + 1;
            x3 = _x2 + 1;
            y3 = _y3 + 2;
            cpm[x1 + "_" + y1] && cpm[x2 + "_" + y2] && cpm[x3 + "_" + y3] && destinationCandidates.push([ {
              x: x1,
              y: y1
            }, {
              x: x2,
              y: y2
            }, {
              x: x3,
              y: y3
            } ]);
          }
        }
        _helpers["default"].shuffleArray(destinationCandidates);
        for (var destinationIndex = 0; destinationIndex < destinationCandidates.length; destinationIndex++) for (var shuffleAttempts = 0; shuffleAttempts < 10; shuffleAttempts++) {
          var destination = destinationCandidates[destinationIndex];
          _helpers["default"].shuffleArray(travelers);
          _helpers["default"].shuffleArray(coordinatesPool);
          var replacementMap = {};
          var coordinatesPoolIndex = 0;
          for (var gameItemUid in gameItemsById) {
            var _gameItem7 = gameItemsById[gameItemUid];
            var travelerIndex = travelers.indexOf(_gameItem7);
            if (-1 !== travelerIndex) replacementMap[destination[travelerIndex].x + "_" + destination[travelerIndex].y] = _gameItem7; else {
              var c = coordinatesPool[coordinatesPoolIndex];
              while (c.x === destination[0].x && c.y === destination[0].y || c.x === destination[1].x && c.y === destination[1].y || c.x === destination[2].x && c.y === destination[2].y) {
                coordinatesPoolIndex++;
                c = coordinatesPool[coordinatesPoolIndex];
              }
              replacementMap[c.x + "_" + c.y] = _gameItem7;
              coordinatesPoolIndex++;
            }
          }
          var _this$getMatchable5 = this.getMatchable(replacementMap), matched = _this$getMatchable5.matched, matchGroups = _this$getMatchable5.matchGroups;
          if (Object.keys(matchGroups).length) continue;
          return this._switchPlaces(replacementMap);
        }
        this._fixNoMoveAvailableReplaceAll(gameItemsById);
      };
      _proto._switchPlaces = function _switchPlaces(replacementMap) {
        var _this9 = this;
        this.switchingCount++;
        var promiseCollection = [];
        var _loop = function _loop(coordId) {
          var gameItem = replacementMap[coordId];
          var coords = coordId.split("_");
          var x = Number(coords[0]);
          var y = Number(coords[1]);
          promiseCollection.push(gameItem.moveSpriteTo(_this9.boardXToViewX(x), _this9.boardYToViewY(y), NO_MOVE_FIX_DURATION).then(function() {
            gameItem.boardX = x;
            gameItem.boardY = y;
            _this9.board[y][x] = gameItem;
          }));
        };
        for (var coordId in replacementMap) _loop(coordId);
        this.lockUserInteraction("_fixNoMoveAvailableMoveAround");
        return Promise.all(promiseCollection).then(function() {
          _this9.unlockUserInteraction("_fixNoMoveAvailableMoveAround");
          _this9.switchingCount--;
        });
      };
      _proto._fixNoMoveAvailableReplaceAll = function _fixNoMoveAvailableReplaceAll(gameItemsById) {
        var reason = {
          type: "noMoveAvailable",
          uid: Math.random()
        };
        for (var gameItemUid in gameItemsById) {
          var gameItem = gameItemsById[gameItemUid];
          this.hitGameItem(gameItem, reason);
        }
      };
      _proto.boardXToViewX = function boardXToViewX(boardX) {
        return boardX * TILE_SIZE - this.width * TILE_SIZE / 2 + TILE_SIZE / 2;
      };
      _proto.boardYToViewY = function boardYToViewY(boardY) {
        return -(boardY * TILE_SIZE - this.height * TILE_SIZE / 2);
      };
      _proto.viewXToBoardX = function viewXToBoardX(viewX) {
        return Math.floor((viewX + this.width * TILE_SIZE / 2) / TILE_SIZE);
      };
      _proto.viewYToBoardY = function viewYToBoardY(viewY) {
        return Math.round((-viewY + this.height * TILE_SIZE / 2) / TILE_SIZE);
      };
      _proto.isValidCoordinate = function isValidCoordinate(boardX, boardY) {
        if (boardX < 0) return false;
        if (boardY < 1) return false;
        if (boardX > this.width - 1) return false;
        if (boardY > this.height - 1) return false;
        return true;
      };
      _proto.validatePattern = function validatePattern(pattern, spawnPattern) {
        var width = spawnPattern.length;
        for (var y = 0; y < pattern.length; y++) pattern[y].length !== width && console.error("GameBoard - pattern has an inconsistent length");
      };
      _proto.getMostRecentlySwitchedItem = function getMostRecentlySwitchedItem(gameItems) {
        var latest = 0;
        var toReturn = null;
        for (var i = 0; i < gameItems.length; i++) if (gameItems[i].lastSwitch && gameItems[i].lastSwitch > latest) {
          latest = gameItems[i].lastSwitch;
          toReturn = gameItems[i];
        }
        return toReturn;
      };
      _proto.transformItem = function transformItem(gameItem, newOptions) {
        var _this10 = this;
        var boardX = gameItem.boardX, boardY = gameItem.boardY;
        var _gameItem$node4 = gameItem.node, x = _gameItem$node4.x, y = _gameItem$node4.y, opacity = _gameItem$node4.opacity, scale = _gameItem$node4.scale;
        var transformingItem = cc.instantiate(this.GameItem).getComponent("GameItem");
        this.view.addChild(transformingItem.node);
        transformingItem.init(newOptions);
        transformingItem.node.x = x;
        transformingItem.node.y = y;
        transformingItem.boardX = boardX;
        transformingItem.boardY = boardY;
        transformingItem.node.scale = .25 * scale;
        transformingItem.node.opacity = 0;
        return new Promise(function(resolve) {
          cc.tween(gameItem.node).to(ITEM_TRANSFORM_DURATION, {
            scale: .25 * scale,
            opacity: 0
          }, {
            easing: "sineIn"
          }).start();
          cc.tween(transformingItem.node).delay(ITEM_TRANSFORM_DURATION).to(ITEM_TRANSFORM_DURATION, {
            scale: scale,
            opacity: opacity
          }, {
            easing: "backOut"
          }).delay(.1).call(function() {
            _this10.board[boardY][boardX] = transformingItem;
            gameItem.destroy();
            resolve();
          }).start();
        });
      };
      _proto.getNewGameItemFromBlueprint = function getNewGameItemFromBlueprint(options) {
        var blueprint = options.blueprint, view = options.view, boardX = options.boardX, boardY = options.boardY, x = options.x, y = options.y;
        if (!blueprint) return null;
        var type = blueprint;
        "Array" === type.constructor.name && (type = type[Math.floor(Math.random() * type.length)]);
        var gameItem = cc.instantiate(this.GameItem).getComponent("GameItem");
        view.addChild(gameItem.node);
        gameItem.init({
          app: this.app,
          onDestroyCb: this.onGameItemDestroy,
          type: type,
          gameBoard: this,
          boardX: boardX,
          boardY: boardY,
          viewX: x,
          viewY: y
        });
        return gameItem;
      };
      _proto.checkRespawn = function checkRespawn() {
        if (!this.checkRespawnRequest) return;
        this.checkRespawnRequest = false;
        for (var x = 0; x < this.width; x++) {
          var spawner = this.spawners[x];
          if (this.board[spawner.boardY + 1][x]) continue;
          if (this.next[spawner.boardY + 1][x]) continue;
          if (this["final"][spawner.boardY + 1][x]) continue;
          var blueprint = void 0;
          if ("Object" === spawner.blueprint.constructor.name && spawner.blueprint.sequence) if (1 === spawner.blueprint.sequence.length) {
            spawner.blueprint = spawner.blueprint.sequence[0];
            blueprint = spawner.blueprint;
          } else blueprint = spawner.blueprint.sequence.shift(); else blueprint = spawner.blueprint;
          var spawningItem = this.getNewGameItemFromBlueprint({
            blueprint: blueprint,
            view: spawner,
            boardX: spawner.boardX,
            boardY: spawner.boardY,
            x: this.boardXToViewX(spawner.boardX),
            y: this.boardYToViewY(spawner.boardY)
          });
          spawningItem.isSpawning = true;
          this._startCascadeItemTo(spawningItem, {
            next: {
              boardX: spawner.boardX,
              boardY: spawner.boardY + 1
            },
            final: {
              boardX: spawner.boardX,
              boardY: spawner.boardY + 1
            }
          });
          var belowItem = this.previous[spawningItem.cascade.next.boardY][spawningItem.cascade.next.boardX];
          if (belowItem) {
            spawningItem.velocity = belowItem.velocity;
            spawningItem.cascade.traveled = true;
          }
          this.isCascading = true;
        }
      };
      _proto.gameFinished = function gameFinished() {
        if (!this.updateInterval) return;
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      };
      _proto.destroy = function destroy() {
        this.gameFinished();
        this.isBeingDestroyed = true;
      };
      return GameBoard;
    }();
    exports["default"] = GameBoard;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../helpers.js": "helpers",
    "./GameItem/GameItem.js": "GameItem",
    "./GameItem/bumper.js": "bumper",
    "./GameItem/cabinet.js": "cabinet",
    "./GameItem/simpleCrate.js": "simpleCrate",
    "./Rnd.js": "Rnd"
  } ],
  GameItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb0165kpG9GX5niWjNvxe4O", "GameItem");
    "use strict";
    var _bumper = _interopRequireDefault(require("./bumper.js"));
    var _cabinet = _interopRequireDefault(require("./cabinet.js"));
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    var _simpleCrate = _interopRequireDefault(require("./simpleCrate.js"));
    var _underlay = _interopRequireDefault(require("./underlay.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, ITEM_SWITCH_DURATION = _constants$GAMEPLAY.ITEM_SWITCH_DURATION, ITEM_EXPLODE_DURATION = _constants$GAMEPLAY.ITEM_EXPLODE_DURATION, POWERUP_SPAWN_DURATION = _constants$GAMEPLAY.POWERUP_SPAWN_DURATION, GAME_ITEM_TYPE = _constants$GAMEPLAY.GAME_ITEM_TYPE, ITEM_SHATTER_COLOR = _constants$GAMEPLAY.ITEM_SHATTER_COLOR, ITEMS_GATHERING_DURATION = _constants$GAMEPLAY.ITEMS_GATHERING_DURATION, DISCO_PULSE_SPEED = _constants$GAMEPLAY.DISCO_PULSE_SPEED, DISCO_PULSE_SCALE = _constants$GAMEPLAY.DISCO_PULSE_SCALE, DISCO_GLOW_APPEARANCE_DURATION = _constants$GAMEPLAY.DISCO_GLOW_APPEARANCE_DURATION;
    var UID = 0;
    cc.Class({
      extends: cc.Component,
      properties: _extends({
        basic1: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5: {
          default: null,
          type: cc.SpriteFrame
        },
        basic1glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4glow: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5glow: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles1: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles2: {
          default: null,
          type: cc.SpriteFrame
        },
        discoball: {
          default: null,
          type: cc.SpriteFrame
        },
        sniper: {
          default: null,
          type: cc.SpriteFrame
        },
        bomb: {
          default: null,
          type: cc.SpriteFrame
        },
        material_normal: {
          default: null,
          type: cc.Material
        },
        shatterFX: {
          default: null,
          type: cc.Prefab
        },
        bombFX: {
          default: null,
          type: cc.Prefab
        },
        sniperFX: {
          default: null,
          type: cc.Prefab
        },
        discoballFX: {
          default: null,
          type: cc.Prefab
        },
        lightBallFX: {
          default: null,
          type: cc.Prefab
        },
        movableDestructible1: {
          default: null,
          type: cc.SpriteFrame
        }
      }, _simpleCrate["default"].properties, _underlay["default"].properties, _bumper["default"].properties, _cabinet["default"].properties),
      statics: {
        preParsePattern: function preParsePattern(gameBoard, pattern) {
          _cabinet["default"].preParsePattern(gameBoard, pattern);
        }
      },
      ctor: function ctor() {
        this.app = null;
        this.gameBoard = null;
        this.type = null;
        this.boardX = null;
        this.boardY = null;
        this.onDestroyCb = null;
        this.isDying = false;
        this.isSpawning = false;
        this.cascade = {
          isCascading: false,
          previous: null,
          next: null,
          final: null,
          delayUntil: null,
          traveled: false
        };
        this.velocity = 0;
        this.isBlockingCascade = false;
        this.isMatchable = false;
        this.isSwitching = false;
        this.locksForUpcomingMatch = 0;
        this.lockedForDiscoball = false;
        this.shouldExplode = false;
        this.shouldExplodeReason = null;
        this.lastSwitch = null;
        this.explosionDuration = ITEM_EXPLODE_DURATION;
        this.lifePoints = 1;
        this.creationTime = null;
        this.linkedGamesItems = null;
        this.uid = ++UID;
        this.options = null;
        this.isSensitive = false;
        this.layers = {};
        this.currentLayerId = null;
        this.onUpdate = null;
      },
      init: function init(options) {
        this.options = options;
        var app = options.app, onDestroyCb = options.onDestroyCb, type = options.type, gameBoard = options.gameBoard;
        this.app = app;
        this.gameBoard = gameBoard;
        this.onDestroyCb = onDestroyCb;
        void 0 !== options.boardX && (this.boardX = options.boardX);
        void 0 !== options.boardY && (this.boardY = options.boardY);
        void 0 !== options.viewX && (this.node.x = options.viewX);
        void 0 !== options.viewY && (this.node.y = options.viewY);
        this.type = type;
        this.creationTime = this.app.now;
        var spine;
        switch (type) {
         case "basic1":
         case "basic2":
         case "basic3":
         case "basic4":
         case "basic5":
          this.isMatchable = true;
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "missiles1":
         case "missiles2":
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "sniper":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.sniperFX);
          this._addLayers({
            spine: spine
          });
          this.layers.spine.active = false;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "discoball":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.discoballFX);
          this._addLayers({
            spine: spine
          });
          this.layers.spine.active = false;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          break;

         case "bomb":
          this.node.zIndex = Z_INDEX.ITEM;
          spine = cc.instantiate(this.bombFX);
          this._addLayers({
            spine: spine
          });
          this.currentLayerId = "spine";
          var skeleton = spine.getComponent(sp.Skeleton);
          skeleton.setAnimation(0, "idle", true);
          break;

         case "movableDestructible1":
          this.node.zIndex = Z_INDEX.ITEM;
          this._addLayers({
            default: this[type]
          });
          this.currentLayerId = "default";
          this.isSensitive = true;
          break;

         default:
          if (_simpleCrate["default"].is(type)) _simpleCrate["default"].init(this, options); else if (_underlay["default"].is(type)) _underlay["default"].init(this, options); else if (_bumper["default"].is(type)) _bumper["default"].init(this, options); else {
            if (!_cabinet["default"].is(type)) return console.error(type + " is not a valid item type");
            _cabinet["default"].init(this, options);
          }
        }
        this.node.scale = ITEM_SCALE;
      },
      update: function update(dt) {
        if (!this.onUpdate) return;
        for (var key in this.onUpdate) this.onUpdate[key].update(dt, this.onUpdate[key].data);
      },
      gotHit: function gotHit(reason) {
        var _this = this;
        return new Promise(function(resolve) {
          if (_simpleCrate["default"].is(_this.type)) return _simpleCrate["default"].gotHit(_this, reason, resolve);
          if (_underlay["default"].is(_this.type)) return _underlay["default"].gotHit(_this, reason, resolve);
          if (_bumper["default"].is(_this.type)) return _bumper["default"].gotHit(_this, reason, resolve);
          if (_cabinet["default"].is(_this.type)) return _cabinet["default"].gotHit(_this, reason, resolve);
          _this.lifePoints--;
          _this._checkLifePoints();
          if (0 === _this.lifePoints) return _this._defaultExplode(reason, resolve);
          return resolve();
        });
      },
      _defaultExplode: function _defaultExplode(reason, resolve) {
        var _this2 = this;
        this.isDying = true;
        var shatterNode = cc.instantiate(this.shatterFX);
        this.node.parent.addChild(shatterNode);
        shatterNode.position = this.node.position;
        shatterNode.x += (.2 * Math.random() - .1) * TILE_SIZE;
        shatterNode.y += (.2 * Math.random() - .1) * TILE_SIZE;
        shatterNode.zIndex = Z_INDEX.ITEM_SHATTER;
        shatterNode.scale = ITEM_SCALE * (.9 + .2 * Math.random());
        shatterNode.angle = 360 * Math.random();
        var shatterAnim = shatterNode.getComponent(sp.Skeleton);
        shatterAnim.setSkin(ITEM_SHATTER_COLOR[this.type] || "default");
        shatterAnim.setAnimation(0, "boom", false);
        shatterAnim.setCompleteListener(function() {
          shatterNode.destroy();
          _this2.app.scheduler.setTimeout(function() {
            _this2.destroyFromBoard();
          }, 0);
          if (!resolve) return;
          _this2._onDestroyCb();
          resolve();
          resolve = null;
        });
        cc.tween(this.node).to(this.explosionDuration, {
          opacity: 0
        }, {
          easing: "linear"
        }).call(function() {
          if (!resolve) return;
          _this2._onDestroyCb();
          resolve();
          resolve = null;
        }).start();
      },
      explodeForPowerUp: function explodeForPowerUp(x, y) {
        var _this3 = this;
        return new Promise(function(resolve) {
          _this3.isDying = true;
          cc.tween(_this3.node).to(ITEMS_GATHERING_DURATION, {
            x: x,
            y: y
          }, {
            easing: "linear"
          }).call(function() {
            _this3._onDestroyCb();
            _this3.app.scheduler.setTimeout(function() {
              _this3.destroyFromBoard();
            }, 0);
            resolve();
          }).start();
        });
      },
      switchSpriteTo: function switchSpriteTo(x, y, willMatch) {
        var _this4 = this;
        this.lastSwitch = willMatch ? this.app.now : null;
        this.isSwitching = true;
        return new Promise(function(resolve) {
          cc.tween(_this4.node).to(ITEM_SWITCH_DURATION, {
            x: x,
            y: y
          }, {
            easing: "quadOut"
          }).call(function() {
            _this4.isSwitching = false;
            resolve();
          }).start();
        });
      },
      moveSpriteTo: function moveSpriteTo(x, y, duration) {
        var _this5 = this;
        return new Promise(function(resolve) {
          cc.tween(_this5.node).to(duration, {
            x: x,
            y: y
          }, {
            easing: "quadInOut"
          }).call(resolve).start();
        });
      },
      spawnPowerUp: function spawnPowerUp() {
        var _this6 = this;
        this.node.opacity = 0;
        this.node.scale = 1.5 * ITEM_SCALE;
        return new Promise(function(resolve) {
          cc.tween(_this6.node).to(POWERUP_SPAWN_DURATION, {
            opacity: 255,
            scale: ITEM_SCALE
          }, {
            easing: "linear"
          }).call(function() {
            resolve();
          }).start();
        });
      },
      highlight: function highlight(material) {
        var currentLayer = this.layers[this.currentLayerId];
        var element = currentLayer.getComponent(cc.Sprite);
        if (element) {
          element.setMaterial(0, material);
          return;
        }
        element = currentLayer.getComponent(sp.Skeleton);
        element;
      },
      unHighlight: function unHighlight() {
        var currentLayer = this.layers[this.currentLayerId];
        var element = currentLayer.getComponent(cc.Sprite);
        if (element) {
          element.setMaterial(0, this.material_normal);
          return;
        }
        element = currentLayer.getComponent(sp.Skeleton);
        element;
      },
      highlightDisco: function highlightDisco() {
        this._addLayers({
          discoHighlight: this[this.type + "glow"]
        });
        this.layers.discoHighlight.zIndex = -2;
        this.layers.discoHighlight.width = 1.15 * ITEM_SIZE;
        this.layers.discoHighlight.height = 1.15 * ITEM_SIZE;
        this.layers.discoHighlight.opacity = 0;
        var spine = cc.instantiate(this.lightBallFX);
        this._addLayers({
          spine: spine
        });
        spine.zIndex = -1;
        this.layers.spine.opacity = 0;
        this.onUpdate = this.onUpdate || {};
        this.onUpdate.discoPulse = {
          update: this._highlightDiscoUpdate.bind(this),
          data: {
            start: this.app.now
          }
        };
      },
      _highlightDiscoUpdate: function _highlightDiscoUpdate(dt, data) {
        var scale = DISCO_PULSE_SCALE;
        var delta = this.app.now - data.start;
        if (delta < DISCO_GLOW_APPEARANCE_DURATION) {
          var progress = delta / DISCO_GLOW_APPEARANCE_DURATION;
          this.layers["default"].opacity = 170 + 85 * progress;
          this.layers.spine.opacity = 255 * progress;
          this.layers.discoHighlight.opacity = 255 * progress;
          scale *= progress;
        }
        this.node.scale = (Math.cos((this.app.now - data.start) / DISCO_PULSE_SPEED) / 200 * scale + .01 * (100 - scale)) * ITEM_SCALE;
      },
      unhighlightDisco: function unhighlightDisco() {
        this.layers.discoHighlight.destroy();
        delete this.layers.discoHighlight;
        this.layers["default"].opacity = 255;
        delete this.onUpdate.discoPulse;
        this._onUpdateCleanup();
      },
      destroyFromBoard: function destroyFromBoard() {
        this.node.parent.removeChild(this.node);
        this.node.destroy();
      },
      isBasicType: function isBasicType() {
        return this.type === GAME_ITEM_TYPE.basic1 || this.type === GAME_ITEM_TYPE.basic2 || this.type === GAME_ITEM_TYPE.basic3 || this.type === GAME_ITEM_TYPE.basic4 || this.type === GAME_ITEM_TYPE.basic5;
      },
      isPowerUpType: function isPowerUpType() {
        return this.type === GAME_ITEM_TYPE.missiles1 || this.type === GAME_ITEM_TYPE.missiles2 || this.type === GAME_ITEM_TYPE.discoball || this.type === GAME_ITEM_TYPE.sniper || this.type === GAME_ITEM_TYPE.bomb;
      },
      isIdle: function isIdle() {
        if (this.isDying) return false;
        if (this.isSwitching) return false;
        if (this.lockedForDiscoball) return false;
        if (this.locksForUpcomingMatch) return false;
        if (this.shouldExplode) return false;
        if (this.cascade && this.cascade.isCascading) return false;
        return true;
      },
      _addLayers: function _addLayers(layers) {
        for (var layerId in layers) {
          this.layers[layerId] && console.error("GameItem: a layer id " + layerId + " already exists");
          var elementToAdd = layers[layerId];
          if (elementToAdd instanceof cc.SpriteFrame) this.layers[layerId] = _helpers["default"].createSprite({
            spriteFrame: elementToAdd,
            width: this.node.width,
            height: this.node.height,
            view: this.node
          }); else if (elementToAdd instanceof cc.Node) {
            this.layers[layerId] = elementToAdd;
            this.node.addChild(elementToAdd);
          } else console.error("Impossible to add the following as a GameItem layer:", elementToAdd);
        }
      },
      _checkLifePoints: function _checkLifePoints() {
        if (this.lifePoints < 0) {
          console.error("an item reached negative life points");
          this.lifePoints = 0;
        }
      },
      _onUpdateCleanup: function _onUpdateCleanup() {
        Object.keys(this.onUpdate).length || (this.onUpdate = null);
      },
      _onDestroyCb: function _onDestroyCb() {
        this.onDestroyCb && this.type && this.onDestroyCb(this.type);
      }
    });
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers",
    "./bumper.js": "bumper",
    "./cabinet.js": "cabinet",
    "./simpleCrate.js": "simpleCrate",
    "./underlay.js": "underlay"
  } ],
  GameTile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "383a9hlWQJBd4i5TQ4psKXx", "GameTile");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        oddBg: {
          default: null,
          type: cc.SpriteFrame
        },
        evenBg: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      ctor: function ctor() {
        this.boardX = null;
        this.boardY = null;
      },
      setBg: function setBg(isOdd) {
        this.node.getComponent(cc.Sprite).spriteFrame = isOdd ? this.oddBg : this.evenBg;
      }
    });
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34330nubVdEFoykqwfo2QXI", "Game");
    "use strict";
    var _cats = _interopRequireDefault(require("../staticData/cats.js"));
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _GameBoard = _interopRequireDefault(require("../gameplay/GameBoard.js"));
    var _levelModel = _interopRequireDefault(require("../models/levelModel.js"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel.js"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var IPAD_RATIO = _constants["default"].IPAD_RATIO, DEBUG = _constants["default"].DEBUG;
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE;
    var TOP_AREA_HEIGHT = 320;
    var BOT_AREA_HEIGHT = 226;
    var TOPBG_TOP_MARGIN = 30;
    var TOPBG_BOT_MARGIN = 20;
    var MIN_UI_SCALE = .7;
    var CAT_APPEAR_X = 300;
    var CAT_EXCITED_COMBO = 16;
    cc.Class({
      extends: cc.Component,
      properties: {
        GameTile: {
          default: null,
          type: cc.Prefab
        },
        GameItem: {
          default: null,
          type: cc.Prefab
        },
        GameItemSpawner: {
          default: null,
          type: cc.Prefab
        },
        SpriteCollection: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        var _this = this;
        this.app = cc.find("app").getComponent("app");
        this.app.info("Game.js - onLoad");
        this.app.IS_DEVELOPMENT && (globalThis.game = this);
        var currentLevel = _userState["default"].getProgression();
        this.turns = 0;
        this.isGameEnded = false;
        this.isGameWon = false;
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.gameBoardContainer = this.scaleContainer.getChildByName("gameBoardContainer");
        this.spriteCollection = cc.instantiate(this.SpriteCollection).getComponent("SpriteCollection");
        this.topUI = this.scaleContainer.getChildByName("top");
        this.cat = this.topUI.getChildByName("cat").getComponent(sp.Skeleton);
        this.catBoardAttachment = this.cat.findSlot("Cat_Bella/top").attachment;
        this.bottomUI = this.scaleContainer.getChildByName("bottom");
        this.boosterFrame = this.bottomUI.getChildByName("boosterFrame");
        this.boosterController = this.boosterFrame.getComponent("BoosterController");
        this.boosterOverlay = this.boosterFrame.getChildByName("container").getChildByName("overlay");
        this.boosterContent = this.boosterOverlay.getChildByName("content");
        var levelLabel = this.topUI.getChildByName("levelLabel").getComponent(cc.Label);
        this.objectiveController = this.topUI.getChildByName("objectiveFrame").getComponent("ObjectiveController");
        this.tutorialController = this.scaleContainer.getChildByName("Tutorial").getComponent("TutorialController");
        this.result = this.scaleContainer.getChildByName("Result").getComponent("ResultController");
        this.confirmation = this.scaleContainer.getChildByName("Confirmation").getComponent("ConfirmationController");
        this.selectionPopup = this.scaleContainer.getChildByName("SelectionPopup").getComponent("StartSelectionPopup");
        this.pausePopup = this.scaleContainer.getChildByName("PausePopup").getComponent("PausePopup");
        this.pauseButton = this.topUI.getChildByName("pauseButton").getComponent(cc.Button);
        this.gameBoard = null;
        this.levelData = _levelModel["default"].getLevel(DEBUG.TEST_LEVEL || currentLevel);
        if (!this.levelData) {
          console.error("No level data found");
          return;
        }
        this.createBoard(this.levelData);
        this.turns = this.levelData.turns || 0;
        this.result.node.active = true;
        this.confirmation.node.active = true;
        this.selectionPopup.node.active = true;
        this.pausePopup.node.active = true;
        this.tutorialController.node.active = true;
        this.catBoardAttachment.relativeX = this.catBoardAttachment.x + this.cat.node.x;
        this.cat.state = "IDLE";
        this.cat.isExcited = false;
        this.cat.idleTimer = 0;
        this.catWatchingCombo = 0;
        this.lastCombo = 0;
        this.cat.setMix("Cat_idle", "Cat_excited", .5);
        this.cat.setMix("Cat_nervous", "Cat_excited", .5);
        this.objectiveController.loadObjectives(this.levelData.objectives, this.onObjectiveCompleted.bind(this));
        levelLabel.string = "LEVEL " + this.levelData.id;
        this.result.init({
          onHome: this.loadHome.bind(this),
          onTryAgain: this.reloadGame.bind(this),
          onNextLevel: this.reloadGame.bind(this)
        });
        this.pausePopup.init({
          onHome: this.loadHome.bind(this),
          onRestart: this.reloadGame.bind(this)
        });
        this.tutorialController.init(DEBUG.TEST_LEVEL || currentLevel, {
          gameBoard: this.gameBoard,
          topUI: this.topUI
        });
        if (DEBUG.SKIP_SELECTION_POPUP) {
          this.onStartSelectionClosed();
          this.selectionPopup.node.active = false;
        } else {
          this.selectionPopup.init(this.onStartSelectionClosed.bind(this));
          this.cat.node.x -= CAT_APPEAR_X;
          this.catBoardAttachment.x = this.catBoardAttachment.relativeX - this.cat.node.x;
          this.catBoardAttachment.updateOffset();
          setTimeout(function() {
            _this.selectionPopup.show(_this.levelData);
          }, 200);
        }
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_START, this.gameBoard.onTouchStart, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_MOVE, this.gameBoard.onTouchMove, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_END, this.gameBoard.onTouchEnd, this.gameBoard);
        this.gameBoardContainer.on(cc.Node.EventType.TOUCH_CANCEL, this.gameBoard.onTouchCancel, this.gameBoard);
        this.pauseButton.node.on("click", this.onPauseClicked, this);
        this.app.setSceneVisible(this);
      },
      onDestroy: function onDestroy() {
        this.app.info("Game.js - onDestroy");
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_START, this.gameBoard.onTouchStart, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_MOVE, this.gameBoard.onTouchMove, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_END, this.gameBoard.onTouchEnd, this.gameBoard);
        this.gameBoardContainer.off(cc.Node.EventType.TOUCH_CANCEL, this.gameBoard.onTouchCancel, this.gameBoard);
        this.app.setSceneHidden(this);
      },
      endGame: function endGame(isWon) {
        this.isGameEnded = true;
        this.isGameWon = isWon;
        this.boosterController.lockUserInteraction();
        this.gameBoard.lockUserInteraction("endGame");
        this.gameBoard.updateIdleState();
        this.gameBoard.isIdle && this.showResult();
      },
      onMoveTriggered: function onMoveTriggered() {
        this.turns = Math.max(0, this.turns - 1);
        this.turns <= 5 && (this.cat.state = "NERVOUS");
        this.turnNumLabel.string = this.turns;
        0 === this.turns && this.endGame(false);
      },
      onBoardIdle: function onBoardIdle() {
        this.catWatchingCombo = 0;
        this.tutorialController.triggerTutorial();
        this.isGameEnded && this.showResult();
        this.lastCombo = 0;
      },
      onCombo: function onCombo(comboInfo) {
        this.catWatchingCombo += comboInfo.items.length;
        if (this.catWatchingCombo >= CAT_EXCITED_COMBO && !this.cat.isExcited) {
          this.cat.isExcited = true;
          this.catWatchingCombo = 0;
        }
        this.lastCombo++;
      },
      showResult: function showResult() {
        if (!this.result.isShowing) {
          var _this$levelData$rewar, _this$levelData$rewar2;
          this.result.setNextButtonState(this.levelData.id === DEBUG.TEST_LEVEL || _levelModel["default"].hasNextLevel(this.levelData.id));
          var rewardedCoin = (null == (_this$levelData$rewar = this.levelData.rewards) ? void 0 : _this$levelData$rewar.coin) || 0;
          var gotCoinBonus1 = this.turns / this.levelData.turns >= .2;
          var gotCoinBonus2 = this.lastCombo >= 3;
          var gotCoinBonus3 = gotCoinBonus1 && gotCoinBonus2;
          var coinBonus1 = Math.round(rewardedCoin * (gotCoinBonus1 ? .2 : 0));
          var coinBonus2 = Math.round(rewardedCoin * (gotCoinBonus2 ? .2 : 0));
          var coinBonus3 = Math.round(rewardedCoin * (gotCoinBonus3 ? .2 : 0));
          rewardedCoin += coinBonus1 + coinBonus2 + coinBonus3;
          var rewardedStar = (null == (_this$levelData$rewar2 = this.levelData.rewards) ? void 0 : _this$levelData$rewar2.star) || 0;
          var unlockedData = null;
          if (this.isGameWon) {
            unlockedData = _supplyModel["default"].addStar(rewardedStar);
            _userState["default"].updateCoin(rewardedCoin);
          }
          this.pausePopup.isShowing && this.pausePopup.hide(true);
          var performance = {
            isWon: this.isGameWon,
            star: rewardedStar,
            coin: rewardedCoin,
            gotCoinBonus1: gotCoinBonus1,
            gotCoinBonus2: gotCoinBonus2,
            gotCoinBonus3: gotCoinBonus3,
            unlockedData: unlockedData
          };
          this.result.show(performance, this.levelData, true);
          this.gameBoard.gameFinished();
        }
      },
      onGameItemDestroy: function onGameItemDestroy(type) {
        this.objectiveController.reduceType(type);
      },
      onObjectiveCompleted: function onObjectiveCompleted() {
        _userState["default"].stepProgression(1);
        this.endGame(true);
      },
      createBoard: function createBoard(levelData) {
        var _this2 = this;
        var spawnPattern = levelData.spawnPattern, pattern = levelData.pattern, underlayPattern = levelData.underlayPattern;
        this.gameBoard = new _GameBoard["default"]({
          spawnPattern: spawnPattern,
          pattern: pattern,
          underlayPattern: underlayPattern,
          view: this.gameBoardContainer,
          GameTile: this.GameTile,
          GameItem: this.GameItem,
          GameItemSpawner: this.GameItemSpawner,
          spriteCollection: this.spriteCollection,
          boosterController: this.boosterController,
          tutorialController: this.tutorialController,
          app: this.app,
          onGameItemDestroy: this.onGameItemDestroy.bind(this),
          onIdle: this.onBoardIdle.bind(this),
          onMoveTriggered: this.onMoveTriggered.bind(this),
          onBoosterModeEnd: this.boosterController.exitBoosterMode.bind(this.boosterController),
          onCombo: function onCombo(comboInfo) {
            _this2.onCombo(comboInfo);
          }
        });
      },
      update: function update(dt) {
        if (!this.gameBoard) return;
        this.gameBoard.update(dt);
        if (this.cat.isExcited) {
          if ("Cat_excited" !== this.cat.animation) this.cat.setAnimation(0, "Cat_excited", false); else if (this.cat.getCurrent(0).isComplete()) {
            this.cat.isExcited = false;
            this.cat.idleTimer = 0;
          }
        } else {
          this.cat.idleTimer -= dt;
          if (this.cat.getCurrent(0).isComplete() && this.cat.idleTimer < 0) {
            this.cat.idleTimer = this.cat.getCurrent(0).animation.duration + Math.random();
            this.cat.setAnimation(0, "NERVOUS" === this.cat.state ? "Cat_nervous" : "Cat_idle", false);
          }
        }
      },
      updateScreenSize: function updateScreenSize(frame) {
        if (frame.ratio > IPAD_RATIO) {
          this.scaleContainer.height = 1024 / IPAD_RATIO;
          this.scaleContainer.scale = frame.height / this.scaleContainer.height;
        } else {
          this.scaleContainer.scale = frame.width / 1024;
          this.scaleContainer.height = frame.height / this.scaleContainer.scale;
        }
        var topBg = this.scaleContainer.getChildByName("topBg");
        var uiTotalHeight = BOT_AREA_HEIGHT + TOP_AREA_HEIGHT + this.topUI.height - TOPBG_TOP_MARGIN - TOPBG_BOT_MARGIN;
        var uiScale = 1;
        var gameBoardMaxWidth = 1013.76;
        var gameBoardMaxHeight = this.scaleContainer.height - uiTotalHeight;
        var gameBoardMaxSide;
        if (gameBoardMaxHeight >= gameBoardMaxWidth) gameBoardMaxSide = gameBoardMaxWidth; else {
          uiScale = Math.max(gameBoardMaxHeight / gameBoardMaxWidth, MIN_UI_SCALE);
          gameBoardMaxSide = this.scaleContainer.height - uiTotalHeight * uiScale;
        }
        topBg.y = .5 * this.scaleContainer.height;
        var turnFrame = topBg.getChildByName("turnFrame");
        turnFrame.x = 512;
        turnFrame.y = 0;
        turnFrame.scale = uiScale;
        this.turnNumLabel = turnFrame.getChildByName("turnLabel").getComponent(cc.Label);
        this.turnNumLabel.string = this.turns;
        this.topUI.scale = uiScale;
        this.topUI.width = 1049 / uiScale;
        this.topUI.y = this.scaleContainer.height / 2 - (TOP_AREA_HEIGHT - TOPBG_TOP_MARGIN) * uiScale;
        this.pauseButton.node.x = 512 - 80 * uiScale;
        this.catBoardAttachment.width = this.topUI.width;
        this.catBoardAttachment.updateOffset();
        var wallpaper = this.scaleContainer.getChildByName("wallpaper");
        wallpaper.y = -this.scaleContainer.height / 2;
        wallpaper.height = this.scaleContainer.height - TOP_AREA_HEIGHT * uiScale;
        var MAX_SIZE_OF_BOARD = 9;
        this.gameBoardContainer.scale = gameBoardMaxSide / (TILE_SIZE * MAX_SIZE_OF_BOARD);
        this.gameBoardContainer.width = TILE_SIZE * MAX_SIZE_OF_BOARD;
        this.gameBoardContainer.height = TILE_SIZE * MAX_SIZE_OF_BOARD;
        this.gameBoardContainer.y = (BOT_AREA_HEIGHT - TOP_AREA_HEIGHT - this.topUI.height + TOPBG_TOP_MARGIN + TOPBG_BOT_MARGIN) * uiScale * .5;
        this.bottomUI.y = -this.scaleContainer.height / 2;
        this.boosterFrame.scale = uiScale;
        this.boosterOverlay.height = (this.scaleContainer.height + 300) / uiScale;
        this.boosterOverlay.width = this.scaleContainer.width / uiScale;
        this.boosterContent.y = this.boosterOverlay.height - .5 * this.boosterContent.height - 300 / uiScale;
        this.tutorialController.node.width = this.scaleContainer.width;
        this.tutorialController.node.height = this.scaleContainer.height;
        this.tutorialController.updateScreenSize(frame, uiScale);
        this.result.updateScreenSize(frame);
        this.confirmation.updateScreenSize();
      },
      loadHome: function loadHome() {
        this.gameBoard.destroy();
        this.app.changeScene(this, "Home");
      },
      reloadGame: function reloadGame() {
        this.gameBoard.destroy();
        this.app.reloadScene();
      },
      onEnable: function onEnable() {
        this.app.info("Game.js - onEnable");
      },
      start: function start() {
        this.app.info("Game.js - start");
      },
      onDisable: function onDisable() {
        this.app.info("Game.js - onDisable");
      },
      onStartSelectionClosed: function onStartSelectionClosed() {
        var _this3 = this;
        var catId = _userState["default"].getSelectedCat();
        catId && this.cat.setSkin("Cat_" + _cats["default"][catId].name);
        this.boosterController.init({
          gameBoard: this.gameBoard,
          tutorialController: this.tutorialController
        });
        cc.tween(this.cat.node).by(.8, {
          x: CAT_APPEAR_X
        }, {
          easing: "quintOut",
          progress: function progress(start, end, current, ratio) {
            var value = start + (end - start) * ratio;
            _this3.catBoardAttachment.x = _this3.catBoardAttachment.relativeX - value;
            _this3.catBoardAttachment.updateOffset();
            return value;
          }
        }).start();
        var boosterFrameOriginY = this.boosterFrame.y;
        this.boosterFrame.y -= 300;
        cc.tween(this.boosterFrame).to(.5, {
          y: boosterFrameOriginY
        }, {
          easing: "quadOut"
        }).start();
        setTimeout(function() {
          _this3.gameBoard.checkMatchesRequest = true;
          _this3.tutorialController.triggerTutorial();
        }, 400);
      },
      onPauseClicked: function onPauseClicked() {
        if (this.tutorialController.isTutorialShowing) return;
        this.pausePopup.show(true);
      }
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../gameplay/GameBoard.js": "GameBoard",
    "../models/levelModel.js": "levelModel",
    "../models/supplyModel.js": "supplyModel",
    "../staticData/cats.js": "cats",
    "../userState": "userState"
  } ],
  HomeSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6578s1vlpFybbpFit9Cmm+", "HomeSubscene");
    "use strict";
    var _levelModel = _interopRequireDefault(require("../../models/levelModel.js"));
    var _userState = _interopRequireDefault(require("../../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var PROGRESS_FRAME_OFFSET = 26;
    var START_BUTTON_OFFSET = 320;
    var ANIMATION_DURATION = .4;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.progressFrame = this.node.getChildByName("ProgressFrame").getComponent("ProgressFrame");
        this.yardView = this.node.getChildByName("YardView").getComponent("YardView");
        this.startButton = this.node.getChildByName("startButton").getComponent(cc.Button);
        this.levelLabel = this.startButton.node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        this.editModeFrame = this.node.getChildByName("EditMode");
        this.editBottomframe = this.editModeFrame.getChildByName("bottomFrame");
        this.editBottomframeNormal = this.editBottomframe.getChildByName("frame");
        this.editBottomframeDrag = this.editBottomframe.getChildByName("dragNotification");
        this.saveButton = this.editBottomframeNormal.getChildByName("saveButton").getComponent(cc.Button);
        this.bagButton = this.editBottomframeNormal.getChildByName("bagButton").getComponent(cc.Button);
        this.homeButton = this.editModeFrame.getChildByName("homeButton").getComponent(cc.Button);
        this.editBottomframeDrag.active = false;
        this.startButton.node.on("click", this.loadGame, this);
        this.saveButton.node.on("click", this.saveClicked, this);
        this.homeButton.node.on("click", this.homeClicked, this);
        this.bagButton.node.on("click", this.bagClicked, this);
        this.app.yardViewRefreshRequest = true;
      },
      onEnable: function onEnable() {
        var updateResult = _userState["default"].updateDailyState();
        if (this.app.yardViewRefreshRequest || updateResult) {
          this.yardView.loadItems();
          this.progressFrame.updateValues();
          this.app.yardViewRefreshRequest = false;
        }
      },
      start: function start() {
        this.updateUI();
        this.exitEditMode();
      },
      updateUI: function updateUI() {
        var currentLevel = _userState["default"].getProgression();
        this.levelLabel.string = "LEVEL " + _levelModel["default"].getLevel(currentLevel).id;
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.yardView.updateScreenSize(frame, uiScale);
        this.yardView.node.scale = this.node.height / this.yardView.node.height;
        this.progressFrame.originY = .5 * this.node.height - PROGRESS_FRAME_OFFSET * uiScale;
        this.progressFrame.node.y = this.progressFrame.originY;
        this.progressFrame.node.scale = uiScale;
        this.progressFrame.updateScreenSize(frame, uiScale);
        this.startButton.originY = .5 * -this.node.height + START_BUTTON_OFFSET * uiScale;
        this.startButton.node.y = this.startButton.originY;
        this.startButton.node.scale = uiScale;
        this.editModeFrame.width = this.node.width;
        this.editModeFrame.height = this.node.height;
        this.editBottomframe.scale = uiScale;
      },
      loadGame: function loadGame() {
        var homeNode = cc.find("Canvas").getComponent("Home");
        this.app.changeScene(homeNode, "Game");
      },
      saveClicked: function saveClicked() {
        this.yardView.saveYardState();
        this.exitEditMode(true);
      },
      homeClicked: function homeClicked() {
        this.yardView.loadItems();
        this.exitEditMode(true);
      },
      bagClicked: function bagClicked() {
        this.yardView.saveYardState();
        this.exitEditMode(false);
        this.subsceneController.switchScene("bag", {
          tab: "supplies"
        }, true);
      },
      enterEditMode: function enterEditMode(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.subsceneController.topUI.hide(animate);
        this.subsceneController.bottomUI.hide(animate);
        this.yardView.enterEditMode(animate);
        if (animate) {
          cc.tween(this.progressFrame.node).to(ANIMATION_DURATION, {
            y: this.progressFrame.originY + this.progressFrame.node.height,
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.progressFrame.node.active = false;
          }).start();
          cc.tween(this.startButton.node).to(ANIMATION_DURATION, {
            y: this.startButton.originY - this.startButton.node.height,
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.startButton.node.active = false;
          }).start();
          this.editModeFrame.active = true;
          this.editModeFrame.opacity = 0;
          cc.tween(this.editModeFrame).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        } else {
          this.progressFrame.node.active = false;
          this.startButton.node.active = false;
          this.editModeFrame.active = true;
          this.editModeFrame.opacity = 255;
        }
      },
      exitEditMode: function exitEditMode(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.subsceneController.topUI.show(animate);
        this.subsceneController.bottomUI.show(animate);
        this.yardView.exitEditMode(animate);
        if (animate) {
          this.progressFrame.node.active = true;
          cc.tween(this.progressFrame.node).delay(.1).to(ANIMATION_DURATION, {
            y: this.progressFrame.originY,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          this.startButton.node.active = true;
          cc.tween(this.startButton.node).delay(.1).to(ANIMATION_DURATION, {
            y: this.startButton.originY,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          cc.tween(this.editModeFrame).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.editModeFrame.active = false;
          }).start();
        } else {
          this.progressFrame.node.opacity = 255;
          this.progressFrame.node.y = this.progressFrame.originY;
          this.progressFrame.node.active = true;
          this.startButton.node.opacity = 255;
          this.startButton.node.y = this.startButton.originY;
          this.startButton.node.active = true;
          this.editModeFrame.active = false;
        }
      },
      editModeDragNotification: function editModeDragNotification(enable) {
        void 0 === enable && (enable = true);
        this.editBottomframeDrag.active = enable;
        this.editBottomframeNormal.active = !enable;
      }
    });
    cc._RF.pop();
  }, {
    "../../models/levelModel.js": "levelModel",
    "../../userState": "userState"
  } ],
  Home: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b2e01mOmRJNKD1ngSLfNrH", "Home");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var IPAD_RATIO = _constants["default"].IPAD_RATIO, DEBUG = _constants["default"].DEBUG;
    var CENTER_HEIGHT = 1600;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.app.info("Home.js - onLoad");
        this.app.IS_DEVELOPMENT && (globalThis.home = this);
        this.subsceneController = this.node.getComponent("SubsceneController");
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.settingsPopup = this.scaleContainer.getChildByName("SettingsPopup").getComponent("SettingsPopup");
        this.qaPanel = this.scaleContainer.getChildByName("QAPanel").getComponent("QAPanel");
        this.topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        this.app.setSceneVisible(this);
        if (DEBUG.TEST_LEVEL && !globalThis.notFirstTime) {
          globalThis.notFirstTime = true;
          var homeNode = cc.find("Canvas").getComponent("Home");
          this.app.changeScene(homeNode, "Game");
        }
      },
      onDestroy: function onDestroy() {
        this.app.info("Home.js - onDestroy");
        this.app.setSceneHidden(this);
      },
      updateScreenSize: function updateScreenSize(frame) {
        if (frame.ratio > IPAD_RATIO) {
          this.scaleContainer.height = 1024 / IPAD_RATIO;
          this.scaleContainer.scale = frame.height / this.scaleContainer.height;
        } else {
          this.scaleContainer.scale = frame.width / 1024;
          this.scaleContainer.height = frame.height / this.scaleContainer.scale;
        }
        var uiScale = 1;
        var topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        var botUI = this.scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        var uiTotalHeight = topUI.node.height + botUI.node.height;
        var currentCenterHeight = this.scaleContainer.height - uiTotalHeight;
        currentCenterHeight < CENTER_HEIGHT && (uiScale = currentCenterHeight / CENTER_HEIGHT);
        topUI.node.y = .5 * this.scaleContainer.height;
        topUI.updateScreenSize(frame, uiScale);
        botUI.node.y = .5 * -this.scaleContainer.height;
        botUI.updateScreenSize(frame, uiScale);
        this.settingsPopup.updateScreenSize(frame);
        this.qaPanel.updateScreenSize(frame, uiScale);
        this.subsceneController.updateScreenSize(frame, uiScale);
      },
      showQAPanel: function showQAPanel() {
        this.app.IS_DEVELOPMENT && this.qaPanel.show(true);
      },
      onEnable: function onEnable() {
        this.app.info("Home.js - onEnable");
      },
      start: function start() {
        this.app.info("Home.js - start");
        this.subsceneController.switchScene("home");
        this.settingsPopup.hide();
        this.qaPanel.hide();
      },
      onDisable: function onDisable() {
        this.app.info("Home.js - onDisable");
      }
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants"
  } ],
  ObjectiveController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b2892ucVxpKq6Eqgn/OGHRl", "ObjectiveController");
    "use strict";
    var ITEM_SIZE = 94;
    var ITEM_SPACING = 36;
    var ITEM_FIRST_POSITION = [ 0, 0 ];
    cc.Class({
      extends: cc.Component,
      properties: {
        ObjectiveItem: {
          default: null,
          type: cc.Prefab
        }
      },
      loadObjectives: function loadObjectives(objectivesData, onObjectiveCompleted) {
        var _this = this;
        this.onObjectiveCompleted = onObjectiveCompleted;
        this.items = {};
        this.typeMap = [];
        this.isCompletedCache = false;
        this.node.width = Math.max(ITEM_SIZE * objectivesData.length + ITEM_SPACING * (objectivesData.length + 3), 100);
        this.node.height = ITEM_SIZE + 2 * ITEM_SPACING;
        var firstPositionX = ITEM_FIRST_POSITION[0] - (objectivesData.length - 1) * (ITEM_SPACING + ITEM_SIZE) * .5;
        var i = 0;
        objectivesData.forEach(function(data) {
          var objectiveItem = {};
          objectiveItem.gameObject = cc.instantiate(_this.ObjectiveItem).getComponent("ObjectiveItem");
          objectiveItem.type = data.type;
          objectiveItem.amount = data.amount;
          _this.items[data.type] = objectiveItem;
          _this.typeMap.push(data.type);
          objectiveItem.gameObject.node.parent = _this.node;
          objectiveItem.gameObject.node.x = firstPositionX + (ITEM_SPACING + ITEM_SIZE) * i;
          objectiveItem.gameObject.node.y = ITEM_FIRST_POSITION[1] + .5 * _this.node.height;
          objectiveItem.gameObject.node.scale = ITEM_SIZE / objectiveItem.gameObject.node.width;
          objectiveItem.gameObject.loadObjective(data);
          i++;
        });
      },
      reduceType: function reduceType(type) {
        if (!this.items[type]) return;
        this.items[type].amount = Math.max(0, this.items[type].amount - 1);
        this.items[type].gameObject.numberLabel.string = this.items[type].amount;
        0 === this.items[type].amount && !this.isCompletedCache && this.isCompleted() && this.onObjectiveCompleted && this.onObjectiveCompleted();
      },
      isCompleted: function isCompleted() {
        var _this2 = this;
        if (this.isCompletedCache) return this.isCompletedCache;
        var result = true;
        this.typeMap.forEach(function(type) {
          if (_this2.items[type].amount > 0) {
            result = false;
            return false;
          }
        });
        this.isCompletedCache = result;
        return result;
      }
    });
    cc._RF.pop();
  }, {} ],
  ObjectiveItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a5d93C5C1GibhrUOEScpzR", "ObjectiveItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        basic1: {
          default: null,
          type: cc.SpriteFrame
        },
        basic2: {
          default: null,
          type: cc.SpriteFrame
        },
        basic3: {
          default: null,
          type: cc.SpriteFrame
        },
        basic4: {
          default: null,
          type: cc.SpriteFrame
        },
        basic5: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue1: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick1: {
          default: null,
          type: cc.SpriteFrame
        },
        shrub1: {
          default: null,
          type: cc.SpriteFrame
        },
        mouseDoor: {
          default: null,
          type: cc.SpriteFrame
        },
        movableDestructible1: {
          default: null,
          type: cc.SpriteFrame
        },
        bomb: {
          default: null,
          type: cc.SpriteFrame
        },
        discoball: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles1: {
          default: null,
          type: cc.SpriteFrame
        },
        missiles2: {
          default: null,
          type: cc.SpriteFrame
        },
        sniper: {
          default: null,
          type: cc.SpriteFrame
        },
        milkBottle: {
          default: null,
          type: cc.SpriteFrame
        },
        jam1: {
          default: null,
          type: cc.SpriteFrame
        },
        jam2: {
          default: null,
          type: cc.SpriteFrame
        },
        jam3: {
          default: null,
          type: cc.SpriteFrame
        },
        jam4: {
          default: null,
          type: cc.SpriteFrame
        },
        jam5: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.numberLabel = this.node.getChildByName("number").getComponent(cc.Label);
      },
      loadObjective: function loadObjective(data) {
        this.data = data;
        this.node.getComponent(cc.Sprite).spriteFrame = this[data.type];
        var textureSize = this[this.data.type].getOriginalSize();
        var ratioW = this.node.width / textureSize.width;
        var ratioH = this.node.height / textureSize.height;
        var ratio = Math.min(ratioW, ratioH);
        this.node.width = textureSize.width * ratio;
        this.node.height = textureSize.height * ratio;
        this.numberLabel.string = 0 | data.amount;
      }
    });
    cc._RF.pop();
  }, {} ],
  PausePopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb7f8TDrj1N878CcvbpZ0ee", "PausePopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var QAButton = this.popup.getChildByName("QAButton").getComponent("cc.Button");
        var closeButton = this.popup.getChildByName("closeButton").getComponent("cc.Button");
        var content = this.popup.getChildByName("content");
        this.musicSlider = content.getChildByName("musicSlider");
        this.sfxSlider = content.getChildByName("sfxSlider");
        var backButton = content.getChildByName("backButton").getComponent("cc.Button");
        var restartButton = content.getChildByName("restartButton").getComponent("cc.Button");
        var homeButton = content.getChildByName("homeButton").getComponent("cc.Button");
        closeButton.node.on("click", this.onCloseClicked, this);
        backButton.node.on("click", this.onCloseClicked, this);
        restartButton.node.on("click", this.onRestartClicked, this);
        homeButton.node.on("click", this.onHomeClicked, this);
        this.node.active = false;
      },
      init: function init(options) {
        this.onHomeCb = options.onHome || EMPTY_METHOD;
        this.onRestartCb = options.onRestart || EMPTY_METHOD;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.popup = this.node.getChildByName("popup");
        var settings = _userState["default"].getSettings();
        this.isShowing = true;
        this.node.active = true;
        this.musicSlider.getComponent("cc.Slider").progress = settings.music;
        this.sfxSlider.getComponent("cc.Slider").progress = settings.sfx;
        this.musicSlider.getComponent("Slider").onValueChanged();
        this.sfxSlider.getComponent("Slider").onValueChanged();
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        this.isShowing = false;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onCloseClicked: function onCloseClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
        var settings = _userState["default"].getSettings();
        settings.music = this.musicSlider.getComponent("cc.Slider").progress;
        settings.sfx = this.sfxSlider.getComponent("cc.Slider").progress;
        _userState["default"].saveSettings();
      },
      onRestartClicked: function onRestartClicked() {
        if (this.animating) return;
        this.hide(true);
        this.onRestartCb();
      },
      onHomeClicked: function onHomeClicked() {
        if (this.animating) return;
        this.hide(true);
        this.onHomeCb();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {}
    });
    cc._RF.pop();
  }, {
    "../userState": "userState"
  } ],
  ProgressFrame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4cb9a+bv9N0KTzW4rfXiVG", "ProgressFrame");
    "use strict";
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel.js"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {},
      onEnable: function onEnable() {
        this.updateValues();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        var progressBacker = this.node.getChildByName("backer");
        var progressBar = this.node.getChildByName("progressBar");
        progressBacker.width = this.node.width / uiScale;
        progressBar.scale = 1 / uiScale;
      },
      updateValues: function updateValues() {
        this.label = this.node.getChildByName("label").getComponent(cc.Label);
        this.progressBar = this.node.getChildByName("progressBar").getComponent(cc.ProgressBar);
        this.progressLabel = this.progressBar.node.getChildByName("progressLabel").getComponent(cc.Label);
        var starData = _supplyModel["default"].getStarData();
        if (starData.nextItem) {
          this.label.string = "Next: " + _yard["default"].items[starData.nextItem].name;
          this.progressLabel.string = starData.star + "\\" + _yard["default"].items[starData.nextItem].star;
          this.progressBar.progress = starData.star / _yard["default"].items[starData.nextItem].star;
        } else {
          this.label.string = "All supplies unlocked!";
          this.progressLabel.string = "" + starData.star;
          this.progressBar.progress = 1;
        }
      }
    });
    cc._RF.pop();
  }, {
    "../models/supplyModel.js": "supplyModel",
    "../staticData/yard": "yard"
  } ],
  QAPanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5199dPtNs9JjrSwZMWdw3L8", "QAPanel");
    "use strict";
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    var _constants = _interopRequireDefault(require("../constants"));
    var _supplyModel = _interopRequireDefault(require("../models/supplyModel"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var MAX_BOOSTER_SELECTION = _constants["default"].MAX_BOOSTER_SELECTION;
    var ANIMATION_DURATION = .3;
    var MAX_BOOSTER_AMOUNT = 10;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.subsceneController = cc.find("Canvas").getComponent("SubsceneController");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var frame = this.popup.getChildByName("frame");
        var innerFrame = frame.getChildByName("innerFrame");
        var scrollView = innerFrame.getChildByName("scrollview").getComponent(cc.ScrollView);
        var scrollFrame = scrollView.content;
        var dayResetButton = scrollFrame.getChildByName("dayResetButton");
        var resetButton = scrollFrame.getChildByName("resetButton");
        this.propertyLines = {};
        this.propertyLines["level"] = this.setupPropertyLine(scrollFrame.getChildByName("level"), "level");
        this.propertyLines["coin"] = this.setupPropertyLine(scrollFrame.getChildByName("coin"), "coin");
        this.propertyLines["star"] = this.setupPropertyLine(scrollFrame.getChildByName("star"), "star");
        this.propertyLines["fish"] = this.setupPropertyLine(scrollFrame.getChildByName("fish"), "fish");
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type] = this.setupPropertyLine(scrollFrame.getChildByName("booster_" + type), "booster", type);
        dayResetButton.on("click", this.onDayResetClicked, this);
        resetButton.on("click", this.onResetClicked, this);
      },
      onEnable: function onEnable() {
        this.loadData();
      },
      setupPropertyLine: function setupPropertyLine(lineNode, type, subType) {
        void 0 === subType && (subType = "");
        var leftButtonNode = lineNode.getChildByName("leftButton");
        var rightButtonNode = lineNode.getChildByName("rightButton");
        var numberNode = lineNode.getChildByName("number");
        var toggleNode = lineNode.getChildByName("toggle");
        if ("booster" === type) {
          var label = lineNode.getChildByName("label").getComponent(cc.Label);
          label.string = _boosters["default"][subType].name;
        }
        var propertyLine = {
          type: type,
          subType: subType
        };
        propertyLine.number = numberNode.getComponent(cc.Label);
        if (toggleNode) {
          propertyLine.toggle = toggleNode.getComponent(cc.Toggle);
          toggleNode.on("toggle", this.onPropertyToggle, this, propertyLine);
        }
        leftButtonNode && leftButtonNode.on("click", this.onLeftPropertyClicked, this);
        rightButtonNode && rightButtonNode.on("click", this.onRightPropertyClicked, this);
        return propertyLine;
      },
      loadData: function loadData() {
        this.loadLevel();
        this.loadCoin();
        this.loadStar();
        this.loadFish();
        this.loadBoosterSelection();
        this.loadBoosterAmount();
      },
      loadLevel: function loadLevel() {
        this.propertyLines["level"].number.string = _userState["default"].getProgression();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        homeSubscene && homeSubscene.updateUI();
      },
      loadCoin: function loadCoin() {
        this.propertyLines["coin"].number.string = _userState["default"].getCoin();
        this.home.topUI.updateLabels();
        var shopSubscene = this.subsceneController.subsceneMap["shop"].object;
        shopSubscene && shopSubscene.updateCoin();
      },
      loadStar: function loadStar() {
        this.propertyLines["star"].number.string = _userState["default"].getStar();
        _supplyModel["default"].updateStarData();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        homeSubscene && homeSubscene.progressFrame.updateValues();
        this.app.suppliesRefreshRequest = true;
        this.app.yardViewRefreshRequest = true;
        this.app.catRefreshRequest = true;
      },
      loadFish: function loadFish() {
        this.propertyLines["fish"].number.string = _userState["default"].getFish();
        this.home.topUI.updateLabels();
      },
      loadBoosterSelection: function loadBoosterSelection() {
        var boosters = _userState["default"].getBoosters();
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type].toggle.isChecked = boosters[type].selected;
      },
      loadBoosterAmount: function loadBoosterAmount() {
        var boosters = _userState["default"].getBoosters();
        for (var type in _boosters["default"]) this.propertyLines["booster_" + type].number.string = boosters[type].amount;
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onHideClicked: function onHideClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
      },
      onLeftPropertyClicked: function onLeftPropertyClicked(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        if ("level" === type) {
          _userState["default"].stepProgression(-1);
          this.loadLevel();
        } else if ("coin" === type) {
          _userState["default"].updateCoin(-1e3);
          this.loadCoin();
        } else if ("star" === type) ; else if ("fish" === type) {
          _userState["default"].updateFish(-1e3);
          this.loadFish();
        } else if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          boosters[subType].amount = Math.max(boosters[subType].amount - 1, 0);
          _userState["default"].saveBoostersState();
          this.loadBoosterAmount();
          this.app.boostersRefreshRequest = true;
        }
      },
      onRightPropertyClicked: function onRightPropertyClicked(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        if ("level" === type) {
          _userState["default"].stepProgression(1);
          this.loadLevel();
        } else if ("coin" === type) {
          _userState["default"].updateCoin(1e3);
          this.loadCoin();
        } else if ("star" === type) {
          _supplyModel["default"].addStar(5);
          this.loadStar();
        } else if ("fish" === type) {
          _userState["default"].updateFish(1e3);
          this.loadFish();
        } else if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          boosters[subType].amount = Math.min(boosters[subType].amount + 1, MAX_BOOSTER_AMOUNT);
          boosters[subType].unlocked = true;
          _userState["default"].saveBoostersState();
          this.loadBoosterAmount();
          this.app.boostersRefreshRequest = true;
        }
      },
      onPropertyToggle: function onPropertyToggle(event) {
        var nodeKey = event.node.parent.name;
        var propertyLine = this.propertyLines[nodeKey];
        var type = propertyLine.type, subType = propertyLine.subType;
        var checkValue = event.isChecked;
        if ("booster" === type) {
          var boosters = _userState["default"].getBoosters();
          if (checkValue && (_userState["default"].getSelectedBoosterCount() >= MAX_BOOSTER_SELECTION || !boosters[subType].unlocked)) {
            event.isChecked = false;
            return;
          }
          boosters[subType].selected = checkValue;
          _userState["default"].saveBoostersState();
          this.loadBoosterSelection();
          this.app.boostersRefreshRequest = true;
        }
      },
      onDayResetClicked: function onDayResetClicked(event) {
        _userState["default"].getStates().dailyUpdate = 0;
        _userState["default"].saveStates();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        if (homeSubscene) {
          _userState["default"].updateDailyState();
          homeSubscene.yardView.loadItems();
          homeSubscene.progressFrame.updateValues();
        } else this.app.yardViewRefreshRequest = true;
      },
      onResetClicked: function onResetClicked(event) {
        _userState["default"].clear();
        this.loadData();
        var homeSubscene = this.subsceneController.subsceneMap["home"].object;
        if (homeSubscene) {
          homeSubscene.yardView.loadItems();
          homeSubscene.progressFrame.updateValues();
        } else this.app.yardViewRefreshRequest = true;
        this.app.boostersRefreshRequest = true;
        this.app.suppliesRefreshRequest = true;
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.popup = this.node.getChildByName("popup");
        this.popup.height = Math.min(1100, frame.height / frame.ratio * .8);
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../models/supplyModel": "supplyModel",
    "../staticData/boosters": "boosters",
    "../userState": "userState"
  } ],
  ResultController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9cc922XOqxKxZQ+UNAiGlw2", "ResultController");
    "use strict";
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var EMPTY_METHOD = function EMPTY_METHOD() {};
    var PROGRESS_FRAME_OFFSET = 26;
    var CONGRAT_SPACING = 50;
    var CAT_SPACING = 10;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bella: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bob: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_dora: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_leo: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_lily: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_luna: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_max: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_milo: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.backer = this.node.getChildByName("resultBacker");
        this.cat = this.node.getChildByName("cat").getComponent(sp.Skeleton);
        this.topUI = this.node.getChildByName("TopUI").getComponent("TopUI");
        this.progressFrame = this.node.getChildByName("ProgressFrame").getComponent("ProgressFrame");
        this.loseHeartFrame = this.node.getChildByName("LoseHeartFrame");
        this.popup = this.node.getChildByName("resultPopup");
        this.homeButton = this.popup.getChildByName("homeButton").getComponent(cc.Button);
        this.winFrame = this.popup.getChildByName("winFrame");
        this.rewardCoinLabel = this.winFrame.getChildByName("coinLabel").getComponent(cc.Label);
        this.rewardStarLabel = this.winFrame.getChildByName("starLabel").getComponent(cc.Label);
        this.nextButton = this.winFrame.getChildByName("nextButton").getComponent(cc.Button);
        this.loseFrame = this.popup.getChildByName("loseFrame");
        this.confetti = this.node.getChildByName("confetti");
        this.congrat = this.node.getChildByName("congratulations");
        this.unlockItemFrame = this.node.getChildByName("unlockItemFrame");
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var putInBagButton = bottomContent.getChildByName("putInBagButton");
        this.originButtonY = putInBagButton.y;
        this.nextAction = EMPTY_METHOD;
        this.animating = false;
        this.isShowing = true;
        this.isThumpUpAnimating = false;
        this.thumpUpTimer = 0;
        this.uiScale = 1;
        this.unlockItemFrame.active = false;
        this.hide();
      },
      update: function update(dt) {
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        if (lightstar.active) {
          var lightstar1 = lightstar.getChildByName("lightstar1");
          var lightstar2 = lightstar.getChildByName("lightstar2");
          lightstar1.angle += 20 * dt;
          lightstar2.angle += 20 * dt;
          lightstar1.scale = .9 + .05 * Math.sin(this.app.now / 1e3 * 4);
          lightstar2.scale = .9 + .1 * Math.cos((this.app.now + 1e3) / 1e3 * 5);
        }
        if (this.isThumpUpAnimating) {
          this.thumpUpTimer -= dt;
          this.cat.getCurrent(0).isComplete() && (this.thumpUpTimer < 0 ? this.setCatThumpUpAnimation() : this.cat.addAnimation(0, "Cat_idle", false));
        }
      },
      init: function init(options) {
        this.onHomeCb = options.onHome || EMPTY_METHOD;
        this.onTryAgainCb = options.onTryAgain || EMPTY_METHOD;
        this.onNextLevelCb = options.onNextLevel || EMPTY_METHOD;
      },
      hide: function hide(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.isShowing = false;
        return new Promise(function(resolve) {
          if (!animate) {
            _this.node.active = false;
            resolve();
            return;
          }
          _this.animating = true;
          var POPUP_DURATION = .5;
          var POPUP_DELAY = _this.congrat.active ? .2 : 0;
          var COMPONENT_DELAY = POPUP_DELAY + POPUP_DURATION - .2;
          var TOP_DELAY = POPUP_DELAY + 1.5 * (POPUP_DURATION - .2);
          _this.congrat.active && cc.tween(_this.congrat).to(.4, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.congrat.active = false;
          }).start();
          _this.loseHeartFrame.active && cc.tween(_this.loseHeartFrame).delay(COMPONENT_DELAY).to(POPUP_DURATION, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.loseHeartFrame.active = false;
          }).start();
          _this.progressFrame.node.active && cc.tween(_this.progressFrame.node).delay(COMPONENT_DELAY).to(POPUP_DURATION / 2, {
            y: _this.node.height / 2 + _this.progressFrame.node.height * _this.uiScale
          }, {
            easing: "sineIn"
          }).call(function() {
            _this.progressFrame.node.active = false;
          }).start();
          _this.topUI.node.active && cc.tween(_this.topUI.node).delay(TOP_DELAY).to(POPUP_DURATION / 2, {
            y: _this.node.height / 2 + _this.topUI.node.height * _this.uiScale
          }, {
            easing: "sineIn"
          }).call(function() {
            _this.topUI.node.active = false;
          }).start();
          cc.tween(_this.popup).delay(POPUP_DELAY).to(POPUP_DURATION, {
            scale: 0,
            opacity: 255
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.popup.active = false;
          }).start();
          cc.tween(_this.cat.node).delay(COMPONENT_DELAY).to(POPUP_DURATION, {
            y: -_this.node.height / 2 - _this.cat.node.height,
            opacity: 0
          }, {
            easing: "sineOut"
          }).call(function() {
            _this.cat.node.active = false;
          }).start();
          setTimeout(function() {
            _this.animating = false;
            _this.node.active = false;
            resolve();
          }, 1e3 * (COMPONENT_DELAY + POPUP_DURATION + .1));
        });
      },
      show: function show(performance, data, animate) {
        var _this$performance$unl, _this$performance$unl2, _this2 = this;
        void 0 === animate && (animate = false);
        this.levelData = data;
        this.performance = performance;
        this.nextUnlockItems = [].concat((null == (_this$performance$unl = this.performance.unlockedData) ? void 0 : _this$performance$unl.items) || []);
        this.nextUnlockCats = [].concat((null == (_this$performance$unl2 = this.performance.unlockedData) ? void 0 : _this$performance$unl2.cats) || []);
        this.cat.setSkin(performance.isWon ? "whietcat" : "orangecat");
        this.cat.setAnimation(0, performance.isWon ? "Cat_idle" : "Cat_cry", true);
        this.cat.getCurrent(0).timeScale = 0;
        return new Promise(function(resolve) {
          _this2.isShowing = true;
          _this2.node.active = true;
          _this2.loseHeartFrame.active = !performance.isWon;
          _this2.topUI.node.active = performance.isWon;
          _this2.progressFrame.node.active = performance.isWon;
          _this2.winFrame.active = performance.isWon;
          _this2.loseFrame.active = !performance.isWon;
          _this2.congrat.active = performance.isWon;
          _this2.confetti.active = performance.isWon;
          _this2.rewardCoinLabel.string = "+" + performance.coin;
          _this2.rewardStarLabel.string = "+" + performance.star;
          if (!animate) {
            resolve();
            return;
          }
          _this2.animating = true;
          var CONGRAT_DELAY = performance.isWon ? .2 : 0;
          var POPUP_DELAY = CONGRAT_DELAY + .2;
          var POPUP_DURATION = performance.isWon ? .3 : .4;
          _this2.backer.active = true;
          _this2.backer.opacity = 0;
          cc.tween(_this2.backer).to(.3, {
            opacity: 200
          }, {
            easing: "quadOut"
          }).start();
          if (performance.isWon) {
            _this2.congrat.active = true;
            _this2.congrat.scale = 0;
            cc.tween(_this2.congrat).delay(CONGRAT_DELAY).to(.4, {
              scale: _this2.uiScale
            }, {
              easing: "backOut"
            }).start();
            _this2.topUI.node.active = true;
            _this2.topUI.node.y = _this2.node.height / 2 + _this2.topUI.node.height * _this2.uiScale;
            cc.tween(_this2.topUI.node).delay(.9 + CONGRAT_DELAY).to(.5, {
              y: _this2.node.height / 2
            }, {
              easing: "backOut"
            }).start();
            _this2.progressFrame.node.active = true;
            _this2.progressFrame.node.y = _this2.node.height / 2 + _this2.progressFrame.node.height * _this2.uiScale;
            cc.tween(_this2.progressFrame.node).delay(1.3 + CONGRAT_DELAY).to(.5, {
              y: .5 * _this2.node.height - PROGRESS_FRAME_OFFSET * _this2.uiScale
            }, {
              easing: "backOut"
            }).start();
          } else {
            _this2.loseHeartFrame.active = true;
            _this2.loseHeartFrame.scale = 0;
            _this2.loseHeartFrame.opacity = 0;
            cc.tween(_this2.loseHeartFrame).delay(.9 + CONGRAT_DELAY).to(.5, {
              scale: _this2.uiScale,
              opacity: 255
            }, {
              easing: "backOut"
            }).start();
          }
          _this2.popup.active = true;
          _this2.popup.scale = 0;
          _this2.popup.opacity = 0;
          cc.tween(_this2.popup).delay(POPUP_DELAY).to(POPUP_DURATION, {
            scale: _this2.uiScale,
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
          _this2.cat.node.active = true;
          _this2.cat.node.y = -_this2.node.height / 2 - _this2.cat.node.height * _this2.uiScale;
          _this2.cat.node.opacity = -255;
          cc.tween(_this2.cat.node).delay(.8 + CONGRAT_DELAY).to(.6, {
            y: -_this2.node.height / 2 + 10,
            opacity: 255
          }, {
            easing: "cubicOut"
          }).call(function() {
            _this2.cat.getCurrent(0).timeScale = 1;
            if (performance.isWon) {
              _this2.isThumpUpAnimating = true;
              _this2.setCatThumpUpAnimation();
            }
          }).start();
          performance.isWon && _this2.confetti.children.forEach(function(paper) {
            var time = .8 + .4 * Math.random();
            var movementY = 400 + 100 * Math.random();
            var movementX = .5 * paper.x + .5 * paper.x * Math.random();
            var rotation = 90 * Math.random();
            paper.x -= movementX;
            paper.y -= movementY;
            paper.opacity = 0;
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.8 * time, {
              x: movementX
            }, {
              easing: "cubicOut"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).to(.1 * time, {
              opacity: 255
            }).delay(.6 * time).to(.3 * time, {
              opacity: 0
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(time, {
              angle: rotation
            }, {
              easing: "linear"
            }).start();
            cc.tween(paper).delay(.1 + CONGRAT_DELAY).by(.4 * time, {
              y: movementY
            }, {
              easing: "cubicOut"
            }).delay(.05).by(.8 * time, {
              y: -movementY
            }, {
              easing: "quadIn"
            }).start();
          });
          setTimeout(function() {
            _this2.animating = false;
          }, 1e3 * (POPUP_DURATION + POPUP_DELAY));
        });
      },
      hideUnlockItem: function hideUnlockItem() {
        var _this3 = this;
        var FIRST_DELAY = .1;
        var COMPONENT_DELAY = FIRST_DELAY + .2;
        var SECOND_COMPONENT_DELAY = COMPONENT_DELAY + .1;
        var ANIM_DURATION = .3;
        this.animating = true;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        var halowhite = this.unlockItemFrame.getChildByName("halowhite");
        var haloblue = this.unlockItemFrame.getChildByName("haloblue");
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        var star1 = this.unlockItemFrame.getChildByName("star1").getComponent(cc.ParticleSystem);
        var star2 = this.unlockItemFrame.getChildByName("star2").getComponent(cc.ParticleSystem);
        var unlockedItemSprite = this.unlockItemFrame.getChildByName("unlockedItem").getComponent(cc.Sprite);
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var unlockLabel = bottomContent.getChildByName("label").getComponent(cc.Label);
        var itemName = bottomContent.getChildByName("itemName").getComponent(cc.Label);
        var placeItNowButton = bottomContent.getChildByName("placeItNowButton").getComponent(cc.Button);
        var putInBagButton = bottomContent.getChildByName("putInBagButton").getComponent(cc.Button);
        var catOkButton = bottomContent.getChildByName("okButton").getComponent(cc.Button);
        star1.stopSystem();
        star2.stopSystem();
        cc.tween(congrat).delay(FIRST_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(halowhite).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(haloblue).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(lightstar).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(unlockedItemSprite.node).delay(COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(unlockLabel.node).delay(SECOND_COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(itemName.node).delay(SECOND_COMPONENT_DELAY).to(ANIM_DURATION, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(placeItNowButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(catOkButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(putInBagButton.node).delay(FIRST_DELAY).to(ANIM_DURATION, {
          opacity: 0,
          y: this.originButtonY - 200
        }, {
          easing: "quadOut"
        }).start();
        return new Promise(function(resolve) {
          setTimeout(function() {
            _this3.animating = false;
            _this3.node.active = false;
            resolve();
          }, 1e3 * (SECOND_COMPONENT_DELAY + ANIM_DURATION + .1));
        });
      },
      nextSceneStage: function nextSceneStage() {
        var unlockedItem = null;
        var type = null;
        if (this.nextUnlockItems.length) {
          unlockedItem = this.nextUnlockItems.splice(0, 1);
          type = "item";
        } else {
          if (!this.nextUnlockCats.length) {
            this.nextAction();
            return;
          }
          unlockedItem = this.nextUnlockCats.splice(0, 1);
          type = "cat";
        }
        this.showUnlockItem(unlockedItem, type);
      },
      showUnlockItem: function showUnlockItem(id, type) {
        var _this4 = this;
        var MAX_UNLOCKED_ITEM_SIZE = 540;
        var CONGRAT_DELAY = .2;
        var COMPONENT_DELAY = CONGRAT_DELAY + .2;
        this.animating = true;
        this.node.active = true;
        this.unlockItemFrame.active = true;
        this.unlockedItem = id;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        var halowhite = this.unlockItemFrame.getChildByName("halowhite");
        var haloblue = this.unlockItemFrame.getChildByName("haloblue");
        var lightstar = this.unlockItemFrame.getChildByName("lightstar");
        var star1 = this.unlockItemFrame.getChildByName("star1").getComponent(cc.ParticleSystem);
        var star2 = this.unlockItemFrame.getChildByName("star2").getComponent(cc.ParticleSystem);
        var unlockedItemSprite = this.unlockItemFrame.getChildByName("unlockedItem").getComponent(cc.Sprite);
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var unlockLabel = bottomContent.getChildByName("label").getComponent(cc.Label);
        var itemName = bottomContent.getChildByName("itemName").getComponent(cc.Label);
        var placeItNowButton = bottomContent.getChildByName("placeItNowButton").getComponent(cc.Button);
        var putInBagButton = bottomContent.getChildByName("putInBagButton").getComponent(cc.Button);
        var catOkButton = bottomContent.getChildByName("okButton").getComponent(cc.Button);
        var unlockedItemRatio = Math.max(unlockedItemSprite.node.width / MAX_UNLOCKED_ITEM_SIZE, unlockedItemSprite.node.height / MAX_UNLOCKED_ITEM_SIZE);
        unlockedItemSprite.node.width /= unlockedItemRatio;
        unlockedItemSprite.node.height /= unlockedItemRatio;
        unlockLabel.string = "Unlock new " + type;
        unlockedItemSprite.spriteFrame = "item" === type ? this[id] : this["cat_" + id];
        catOkButton.node.active = "cat" === type;
        placeItNowButton.node.active = "item" === type;
        putInBagButton.node.active = "item" === type;
        itemName.string = "item" === type ? _yard["default"].items[id].name : _cats["default"][id].name;
        congrat.scale = 0;
        cc.tween(congrat).delay(CONGRAT_DELAY).to(.4, {
          scale: this.uiScale
        }, {
          easing: "backOut"
        }).start();
        halowhite.scale = 0;
        haloblue.scale = 0;
        lightstar.scale = 0;
        unlockedItemSprite.node.scale = 0;
        unlockLabel.node.scale = 0;
        itemName.node.scale = 0;
        placeItNowButton.node.opacity = 0;
        putInBagButton.node.opacity = 0;
        catOkButton.node.opacity = 0;
        placeItNowButton.node.y = this.originButtonY - 200;
        putInBagButton.node.y = this.originButtonY - 200;
        catOkButton.node.y = this.originButtonY - 200;
        star1.node.active = false;
        star2.node.active = false;
        cc.tween(halowhite).delay(COMPONENT_DELAY).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(haloblue).delay(COMPONENT_DELAY).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(lightstar).delay(COMPONENT_DELAY + .1).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(unlockedItemSprite.node).delay(COMPONENT_DELAY + .1).to(.4, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        cc.tween(unlockLabel.node).delay(COMPONENT_DELAY + .2).to(.4, {
          scale: 1
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(itemName.node).delay(COMPONENT_DELAY + .3).to(.5, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        setTimeout(function() {
          star1.node.active = true;
          star2.node.active = true;
          star1.resetSystem();
          star2.resetSystem();
        }, 1e3 * (COMPONENT_DELAY + .2));
        cc.tween(placeItNowButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(catOkButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(putInBagButton.node).delay(COMPONENT_DELAY + .8).to(.4, {
          opacity: 255,
          y: this.originButtonY
        }, {
          easing: "quadOut"
        }).start();
        setTimeout(function() {
          _this4.animating = false;
        }, 1e3 * (COMPONENT_DELAY + 1.2));
      },
      updateScreenSize: function updateScreenSize(frame) {
        var parent = this.node.parent;
        this.node.width = parent.width;
        this.node.height = parent.height;
        this.backer.height = this.node.height;
        var uiTotalHeight = this.progressFrame.node.height + PROGRESS_FRAME_OFFSET;
        uiTotalHeight += 2 * CONGRAT_SPACING + this.congrat.height;
        uiTotalHeight += this.popup.height;
        uiTotalHeight += CAT_SPACING + this.cat.node.height;
        this.uiScale = 1;
        parent.height < uiTotalHeight && (this.uiScale = parent.height / uiTotalHeight);
        this.cat.node.y = -this.node.height / 2;
        this.cat.node.scale = this.uiScale;
        this.topUI.node.y = .5 * this.node.height;
        this.topUI.updateScreenSize(frame, this.uiScale);
        this.progressFrame.node.y = .5 * this.node.height - PROGRESS_FRAME_OFFSET * this.uiScale;
        this.progressFrame.node.scale = this.uiScale;
        this.progressFrame.updateScreenSize(frame, this.uiScale);
        this.loseHeartFrame.scale = this.uiScale;
        this.loseHeartFrame.y = this.topUI.node.y - .5 * this.topUI.node.height * this.uiScale;
        var precalculatedCongratY = this.progressFrame.node.y - (this.progressFrame.node.height + CONGRAT_SPACING + .5 * this.congrat.height) * this.uiScale;
        this.popup.scale = this.uiScale;
        var popupTopAnchor = precalculatedCongratY - (.5 * this.congrat.height + CONGRAT_SPACING) * this.uiScale;
        var popupBotAnchor = this.cat.node.y + this.cat.node.height * this.uiScale;
        this.popup.y = .5 * (popupTopAnchor + popupBotAnchor);
        var recalculatedCongratY = this.popup.y + (.5 * this.popup.height + CONGRAT_SPACING + .5 * this.congrat.height) * this.uiScale;
        this.congrat.y = .5 * (precalculatedCongratY + recalculatedCongratY);
        this.congrat.scale = this.uiScale;
        this.confetti.scale = this.uiScale;
        this.confetti.y = this.congrat.y;
        this.unlockItemFrame.y = .05 * this.node.height;
        var congrat = this.unlockItemFrame.getChildByName("congratulations");
        congrat.y = .35 * this.node.height;
        congrat.scale = this.uiScale;
        var bottomContent = this.unlockItemFrame.getChildByName("bottomContent");
        var bottomContentToleranceY = 406 + bottomContent.height;
        var bottomContentMaxY = .5 * this.node.height;
        bottomContent.y = -Math.min(bottomContentMaxY, .5 * (bottomContentMaxY - bottomContentToleranceY) + bottomContentToleranceY);
      },
      setNextButtonState: function setNextButtonState(enabled) {
        this.nextButton.node.active = enabled;
        this.homeButton.node.x = enabled ? this.homeButton.node.x : 0;
      },
      setCatThumpUpAnimation: function setCatThumpUpAnimation() {
        this.cat.addAnimation(0, "Cat_thumb", false);
        this.thumpUpTimer = this.cat.getCurrent(0).animation.duration + 1 + Math.random();
      },
      onTryAgainClicked: function onTryAgainClicked() {
        var _this5 = this;
        this.animating || this.hide(true).then(function() {
          return _this5.onTryAgainCb();
        });
      },
      onNextClicked: function onNextClicked() {
        var _this6 = this;
        if (!this.animating) {
          this.nextAction = this.onNextLevelCb;
          this.hide(true).then(function() {
            return _this6.nextSceneStage();
          });
        }
      },
      onHomeClicked: function onHomeClicked() {
        var _this7 = this;
        if (!this.animating) {
          this.nextAction = this.onHomeCb;
          this.hide(true).then(function() {
            return _this7.nextSceneStage();
          });
        }
      },
      onPlaceItNowClicked: function onPlaceItNowClicked() {
        var _this8 = this;
        if (!this.animating && this.unlockedItem) {
          var yardData = _userState["default"].getYard();
          yardData[this.unlockedItem] || (yardData[this.unlockedItem] = {
            x: -1,
            y: -1
          });
          _userState["default"].saveYard(yardData);
          this.hideUnlockItem().then(function() {
            return _this8.nextSceneStage();
          });
        }
      },
      onPutInBagClicked: function onPutInBagClicked() {
        var _this9 = this;
        this.animating || this.hideUnlockItem().then(function() {
          return _this9.nextSceneStage();
        });
      },
      onCatOkClicked: function onCatOkClicked() {
        var _this10 = this;
        this.animating || this.hideUnlockItem().then(function() {
          return _this10.nextSceneStage();
        });
      }
    });
    cc._RF.pop();
  }, {
    "../staticData/cats": "cats",
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  Rnd: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e2920RCqHhF3ZR1qFh+5ZZN", "Rnd");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var Rnd = function() {
      function Rnd(seed) {
        this.m_z = null;
        this.m_w = null;
        this.mask = 4294967295;
        this.setSeed(seed);
      }
      var _proto = Rnd.prototype;
      _proto.setSeed = function setSeed(seed) {
        this.seed = isNaN(seed) ? Date.now() : Number(seed);
        this.m_w = 987654321 + this.seed;
        this.m_z = 123456789 - this.seed;
      };
      _proto.getSeed = function getSeed() {
        return this.seed;
      };
      _proto.random = function random() {
        this.m_z = 36969 * (65535 & this.m_z) + (this.m_z >> 16) & this.mask;
        this.m_w = 18e3 * (65535 & this.m_w) + (this.m_w >> 16) & this.mask;
        var result = (this.m_z << 16) + this.m_w & this.mask;
        result /= 4294967296;
        return result + .5;
      };
      return Rnd;
    }();
    exports["default"] = Rnd;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  Scheduler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ba77waTxxJnYTaiZIXxf5P", "Scheduler");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var Scheduler = function() {
      function Scheduler(app) {
        this.app = app;
        this._nextUid = 0;
        this.active = false;
        this.registered = {};
        this.registeredCount = 0;
      }
      var _proto = Scheduler.prototype;
      _proto.setTimeout = function setTimeout(method, delay) {
        var timerId = ++this._nextUid;
        this.registered[timerId] = {
          timerId: timerId,
          method: method,
          updateAfter: this.app.now + delay
        };
        this.registeredCount++;
        this.active = true;
        return timerId;
      };
      _proto.clearTimeout = function clearTimeout(timerId) {
        if (!this.registered[timerId]) return;
        delete this.registered[timerId];
        this.registeredCount--;
        0 === this.registeredCount && (this.active = false);
      };
      _proto.onUpdate = function onUpdate() {
        for (var timerId in this.registered) {
          var entry = this.registered[timerId];
          if (entry.updateAfter <= this.app.now) {
            delete this.registered[timerId];
            this.registeredCount--;
            entry.method();
          }
        }
        0 === this.registeredCount && (this.active = false);
      };
      return Scheduler;
    }();
    exports["default"] = Scheduler;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  SettingsPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dae3dWTqFpHd66ekGC8OnEu", "SettingsPopup");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.popup = this.node.getChildByName("popup");
        var QAButton = this.popup.getChildByName("QAButton").getComponent("cc.Button");
        var closeButton = this.popup.getChildByName("closeButton").getComponent("cc.Button");
        var content = this.popup.getChildByName("content");
        this.musicSlider = content.getChildByName("musicSlider");
        this.sfxSlider = content.getChildByName("sfxSlider");
        QAButton.node.active = this.app.IS_DEVELOPMENT;
        QAButton.node.on("click", this.onQAButtonClicked, this);
        closeButton.node.on("click", this.onCloseClicked, this);
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.popup = this.node.getChildByName("popup");
        var settings = _userState["default"].getSettings();
        this.node.active = true;
        this.musicSlider.getComponent("cc.Slider").progress = settings.music;
        this.sfxSlider.getComponent("cc.Slider").progress = settings.sfx;
        this.musicSlider.getComponent("Slider").onValueChanged();
        this.sfxSlider.getComponent("Slider").onValueChanged();
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      onQAButtonClicked: function onQAButtonClicked() {
        var _this3 = this;
        if (this.app.IS_DEVELOPMENT) {
          this.hide(true);
          setTimeout(function() {
            _this3.home.showQAPanel();
          }, ANIMATION_DURATION);
        }
      },
      onCloseClicked: function onCloseClicked(animate) {
        void 0 === animate && (animate = false);
        if (this.animating) return;
        this.hide(true);
        var settings = _userState["default"].getSettings();
        settings.music = this.musicSlider.getComponent("cc.Slider").progress;
        settings.sfx = this.sfxSlider.getComponent("cc.Slider").progress;
        _userState["default"].saveSettings();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {}
    });
    cc._RF.pop();
  }, {
    "../userState": "userState"
  } ],
  ShopCommands: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c787lQU21J+pMIP85tVoEo", "ShopCommands");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _shop = _interopRequireDefault(require("../staticData/shop"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function buy(itemId, number) {
      var coins = _userState["default"].getCoin();
      var booseterData = _userState["default"].getBoosters();
      var itemData = _shop["default"][itemId];
      var totalPrice = itemData.price * number;
      if (totalPrice > coins) return false;
      switch (itemId) {
       case "fish":
        _userState["default"].updateFish(1);
        break;

       case "fish5":
        _userState["default"].updateFish(5);
        break;

       case "fish10":
        _userState["default"].updateFish(10);
        break;

       case "hammer":
       case "airplane":
       case "rocket":
       case "paintbrush":
       case "fairystick":
       case "wheel":
        booseterData[itemId].amount++;
        booseterData[itemId].unlocked = true;
        _userState["default"].saveBoostersState();
      }
      _userState["default"].updateCoin(-totalPrice);
      return true;
    }
    var _default = {
      buy: buy
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/shop": "shop",
    "../userState": "userState"
  } ],
  ShopConfirmPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8cc95TY3NdPCac3A0X4+Iip", "ShopConfirmPopup");
    "use strict";
    var _ShopCommands = _interopRequireDefault(require("../commands/ShopCommands"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    var SHOP_MAX_NUMBER = 99;
    cc.Class({
      extends: cc.Component,
      properties: {
        fish: {
          default: null,
          type: cc.SpriteFrame
        },
        fish5: {
          default: null,
          type: cc.SpriteFrame
        },
        fish10: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.popup = this.node.getChildByName("popup");
        this.notEnoughCoinFrame = this.node.getChildByName("notEnoughCoin");
        var buyButton = this.popup.getChildByName("buyButton");
        var closeButton = this.popup.getChildByName("closeButton");
        var frame = this.popup.getChildByName("frame");
        this.nameLabel = frame.getChildByName("nameLabel").getComponent(cc.Label);
        this.icon = frame.getChildByName("icon").getComponent(cc.Sprite);
        this.numberLabel = frame.getChildByName("numberLabel").getComponent(cc.Label);
        this.descriptionLabel = frame.getChildByName("descriptionLabel").getComponent(cc.Label);
        this.buttonLabel = buyButton.getChildByName("Label").getComponent(cc.Label);
        var plusButton = frame.getChildByName("plusButton");
        var minusButton = frame.getChildByName("minusButton");
        this.selectingNumber = 1;
        plusButton.on("click", this.onPlusClicked, this);
        minusButton.on("click", this.onMinusClicked, this);
        buyButton.on("click", this.onBuyClicked, this);
        closeButton.on("click", this.onCloseClicked, this);
      },
      start: function start() {},
      loadData: function loadData(data) {
        this.data = data;
        this.selectingNumber = 1;
        this.nameLabel.string = data.name;
        this.icon.spriteFrame = this[data.id];
        this.descriptionLabel.string = data.description || "";
        this.buttonLabel.string = this.data.price * this.selectingNumber;
        this.numberLabel.string = this.selectingNumber;
      },
      show: function show(data, animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        this.loadData(data);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      showNotEnoughCoin: function showNotEnoughCoin() {
        var _this3 = this;
        this.notEnoughCoinFrame.active = true;
        this.animating = true;
        var backer = this.notEnoughCoinFrame.getChildByName("backer");
        var cat = this.notEnoughCoinFrame.getChildByName("cat");
        var bubble = this.notEnoughCoinFrame.getChildByName("bubble");
        backer.opacity = 0;
        cc.tween(backer).to(.5, {
          opacity: 190
        }, {
          easing: "quadOut"
        }).start();
        cat.x = .5 * -this.node.width - cat.width;
        cc.tween(cat).delay(.1).to(.3, {
          x: .5 * -this.node.width
        }, {
          easing: "quadOut"
        }).start();
        bubble.scale = 0;
        cc.tween(bubble).delay(.3).to(.4, {
          scale: 1
        }, {
          easing: "backOut"
        }).start();
        setTimeout(function() {
          _this3.hideNotEnoughCoin();
        }, 1200);
      },
      hideNotEnoughCoin: function hideNotEnoughCoin() {
        var _this4 = this;
        var backer = this.notEnoughCoinFrame.getChildByName("backer");
        var cat = this.notEnoughCoinFrame.getChildByName("cat");
        var bubble = this.notEnoughCoinFrame.getChildByName("bubble");
        cc.tween(bubble).to(.35, {
          scale: 0
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(cat).delay(.2).to(.3, {
          x: .5 * -this.node.width - cat.width
        }, {
          easing: "quadOut"
        }).start();
        cc.tween(backer).delay(.2).to(.5, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this4.animating = false;
          _this4.notEnoughCoinFrame.active = false;
        }).start();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {},
      onPlusClicked: function onPlusClicked() {
        this.selectingNumber = Math.min(this.selectingNumber + 1, SHOP_MAX_NUMBER);
        this.numberLabel.string = this.selectingNumber;
        this.buttonLabel.string = this.data.price * this.selectingNumber;
      },
      onMinusClicked: function onMinusClicked() {
        this.selectingNumber = Math.max(this.selectingNumber - 1, 1);
        this.numberLabel.string = this.selectingNumber;
        this.buttonLabel.string = this.data.price * this.selectingNumber;
      },
      onBuyClicked: function onBuyClicked() {
        if (_ShopCommands["default"].buy(this.data.id, this.selectingNumber)) {
          this.app.boostersRefreshRequest = true;
          this.parentScene.updateCoin();
          this.hide(true);
        } else this.showNotEnoughCoin();
      },
      onCloseClicked: function onCloseClicked() {
        this.hide(true);
      }
    });
    cc._RF.pop();
  }, {
    "../commands/ShopCommands": "ShopCommands"
  } ],
  ShopItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf04aLV959CJ7oCDIIqWbgp", "ShopItem");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        fish: {
          default: null,
          type: cc.SpriteFrame
        },
        fish5: {
          default: null,
          type: cc.SpriteFrame
        },
        fish10: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        wheel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.quantityLabel = this.node.getChildByName("quantity").getComponent(cc.Label);
        this.button = this.node.getChildByName("button");
        this.buttonLabel = this.button.getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        this.button.on("click", this.onClicked, this);
      },
      loadData: function loadData(data, onItemClicked) {
        this.data = data;
        this.onItemClicked = onItemClicked;
        this.icon.spriteFrame = this[data.id];
        this.quantityLabel.string = "x" + (data.quantity || 0);
        this.buttonLabel.string = data.price;
      },
      updateNumber: function updateNumber(number) {
        this.quantityLabel.string = "x" + (0 | number);
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.onItemClicked(this.data.id);
      }
    });
    cc._RF.pop();
  }, {} ],
  ShopSubscene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc475m2pV1IVIwyYY66R/3j", "ShopSubscene");
    "use strict";
    var _shop = _interopRequireDefault(require("../../staticData/shop"));
    var _userState = _interopRequireDefault(require("../../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var LIST_SPACING = 100;
    var ITEM_HEIGHT = 500;
    cc.Class({
      extends: cc.Component,
      properties: {
        ShopItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.shopConfirmPopup = this.node.getChildByName("ShopConfirmPopup").getComponent("ShopConfirmPopup");
        this.shopConfirmPopup.parentScene = this;
        this.scrollView = this.node.getChildByName("scrollview").getComponent(cc.ScrollView);
        this.scrollFrame = this.scrollView.content;
        var topUI = this.node.getChildByName("topUI");
        var coinFrame = topUI.getChildByName("coinFrame");
        this.coinLabel = coinFrame.getChildByName("coinLabel").getComponent(cc.Label);
        this.shopItems = {};
        var shopCounter = 0;
        for (var key in _shop["default"]) {
          var shopItem = cc.instantiate(this.ShopItem).getComponent("ShopItem");
          shopItem.node.setParent(this.scrollFrame);
          shopItem.node.x = shopCounter % 2 ? 200 : -200;
          shopItem.node.y = -LIST_SPACING - Math.floor(.5 * shopCounter) * ITEM_HEIGHT;
          shopItem.loadData(_extends({
            id: key
          }, _shop["default"][key]), this.onItemClicked.bind(this));
          this.shopItems[key] = shopItem;
          shopCounter++;
        }
        this.scrollFrame.height = ITEM_HEIGHT * Math.ceil(.5 * shopCounter) + 2 * LIST_SPACING;
      },
      onEnable: function onEnable() {
        this.shopConfirmPopup.hide();
        this.updateCoin();
      },
      onOpened: function onOpened(opts) {
        if (opts && opts.id && this.shopItems[opts.id]) {
          var itemY = -this.shopItems[opts.id].node.y + .5 * ITEM_HEIGHT;
          var topCap = this.scrollFrame.height - .5 * this.scrollView.node.height;
          this.scrollFrame.y = Math.min(Math.max(0, itemY), topCap);
        }
      },
      updateCoin: function updateCoin() {
        this.coinLabel.string = _userState["default"].getCoin();
      },
      onItemClicked: function onItemClicked(id) {
        this.shopConfirmPopup.show(_extends({
          id: id
        }, _shop["default"][id]), true);
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        var wallpaper = this.node.getChildByName("wallpaper");
        wallpaper.height = this.node.height;
        var topUI = this.node.getChildByName("topUI");
        topUI.y = .5 * this.node.height;
        topUI.scale = uiScale;
        var shelter = topUI.getChildByName("shelter");
        shelter.width = this.node.width / uiScale;
        var backer = topUI.getChildByName("backer");
        backer.width = this.node.width / uiScale;
        var coinFrame = topUI.getChildByName("coinFrame");
        coinFrame.x = .33 * -backer.width;
        this.shopConfirmPopup.updateScreenSize(frame, uiScale);
      }
    });
    cc._RF.pop();
  }, {
    "../../staticData/shop": "shop",
    "../../userState": "userState"
  } ],
  Slider: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8ac23lCB2xKhZ1lBn7KpAT4", "Slider");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.slider = this.node.getComponent(cc.Slider);
        this.mask = this.node.getChildByName("Mask");
        this.slider.node.on("slide", this.onValueChanged, this);
      },
      onValueChanged: function onValueChanged() {
        this.mask.width = this.node.width * this.slider.progress;
      }
    });
    cc._RF.pop();
  }, {} ],
  SpriteCollection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ddfeeBQralOx5laFJGHa65b", "SpriteCollection");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        missileRight: {
          default: null,
          type: cc.SpriteFrame
        },
        missileLeft: {
          default: null,
          type: cc.SpriteFrame
        },
        missileTop: {
          default: null,
          type: cc.SpriteFrame
        },
        missileBottom: {
          default: null,
          type: cc.SpriteFrame
        },
        border1: {
          default: null,
          type: cc.SpriteFrame
        },
        border2: {
          default: null,
          type: cc.SpriteFrame
        },
        border3: {
          default: null,
          type: cc.SpriteFrame
        },
        material_highlight: {
          default: null,
          type: cc.Material
        },
        rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        missileAnim: {
          default: null,
          type: cc.Prefab
        },
        flameAnim: {
          default: null,
          type: cc.Prefab
        },
        rayOfLight: {
          default: null,
          type: cc.Prefab
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  StartSelectionItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f6e4MZLENPTZWesyV9JJ20", "StartSelectionItem");
    "use strict";
    var MAX_ICON_SIZE = 112;
    cc.Class({
      extends: cc.Component,
      properties: {
        booster_airplane: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_fairystick: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_hammer: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_paintbrush: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_rocket: {
          default: null,
          type: cc.SpriteFrame
        },
        booster_wheel: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bella: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_bob: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_dora: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_leo: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_lily: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_luna: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_max: {
          default: null,
          type: cc.SpriteFrame
        },
        cat_milo: {
          default: null,
          type: cc.SpriteFrame
        },
        lockIcon: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.node.on("click", this.onClicked, this);
      },
      start: function start() {},
      loadItem: function loadItem(type, data) {
        this.type = type;
        this.data = data;
        this.selectingBorder = this.node.getChildByName("selectingBorder");
        this.icon = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this.checkSlot = this.node.getChildByName("checkSlot");
        this.checkMark = this.node.getChildByName("checkMark");
        this.quantity = this.node.getChildByName("quantity").getComponent(cc.Label);
        if (!data.unlocked) {
          this.setLocked();
          return;
        }
        this.setSelected(data.selected);
        this.updateIcon(this[type + "_" + data.id], "booster" === type ? 1.1 : 1);
        if ("booster" === type) {
          this.quantity.node.active = true;
          this.quantity.string = data.amount;
        } else "cat" === type && (this.quantity.node.active = false);
      },
      setLocked: function setLocked() {
        this.updateIcon(this.lockIcon);
        this.selectingBorder.active = false;
        this.checkSlot.active = false;
        this.checkMark.active = false;
        this.quantity.node.active = false;
      },
      setSelected: function setSelected(value) {
        this.selectingBorder.active = value;
        this.checkMark.active = value;
        this.data.selected = value;
      },
      updateIcon: function updateIcon(spriteFrame, multiplier) {
        void 0 === multiplier && (multiplier = 1);
        this.icon.spriteFrame = spriteFrame;
        var maxSize = Math.max(this.icon.node.width, this.icon.node.height, MAX_ICON_SIZE);
        this.icon.node.scale = MAX_ICON_SIZE / maxSize * multiplier;
      },
      onClicked: function onClicked() {
        this.onItemClicked && this.data.unlocked && this.onItemClicked(this);
      }
    });
    cc._RF.pop();
  }, {} ],
  StartSelectionPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ade0ZPCXRDEb+onzIEqhOC", "StartSelectionPopup");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants"));
    var _userState = _interopRequireDefault(require("../userState"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _boosters = _interopRequireDefault(require("../staticData/boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var MAX_BOOSTER_SELECTION = _constants["default"].MAX_BOOSTER_SELECTION;
    var OBJECTIVE_ITEM_SIZE = 94;
    var OBJECTIVE_ITEM_SPACING = 36;
    var SELECTION_ITEM_SIZE = 128;
    var SELECTION_ITEM_SPACING = 48;
    var SELECTION_COLUMN = 4;
    cc.Class({
      extends: cc.Component,
      properties: {
        ObjectiveItem: {
          default: null,
          type: cc.Prefab
        },
        StartSelectionItem: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.backer = this.node.getChildByName("backer");
        this.popup = this.node.getChildByName("popup");
        var frame = this.popup.getChildByName("frame");
        this.levelLabel = frame.getChildByName("label").getComponent(cc.Label);
        this.innerFrame = frame.getChildByName("innerFrame");
        var goalBacker = this.innerFrame.getChildByName("goalBacker");
        this.objectivesFrame = goalBacker.getChildByName("ObjectivesFrame");
        this.catView = this.innerFrame.getChildByName("CatView").getComponent("CatView");
        this.changeCatButton = this.innerFrame.getChildByName("changeCatButton");
        this.changeBoosterButton = this.innerFrame.getChildByName("changeBoosterButton");
        this.startButton = this.popup.getChildByName("startButton");
        this.catSelectionPopup = this.node.getChildByName("catSelection");
        this.catSelectionFrame = this.catSelectionPopup.getChildByName("frame");
        this.catSelectionConfirmButton = this.catSelectionPopup.getChildByName("confirmButton");
        this.boosterSelectionPopup = this.node.getChildByName("boosterSelection");
        this.boosterSelectionFrame = this.boosterSelectionPopup.getChildByName("frame");
        this.boosterSelectionConfirmButton = this.boosterSelectionPopup.getChildByName("confirmButton");
        this.backer.zIndex = -1;
        this.catSelectionPopup.zIndex = 2;
        this.boosterSelectionPopup.zIndex = 2;
        this.catSelectionPopup.active = false;
        this.boosterSelectionPopup.active = false;
        this.node.active = false;
        this.changeCatButton.on("click", this.onCatChangeClicked, this);
        this.changeBoosterButton.on("click", this.onBoosterChangeClicked, this);
        this.catSelectionConfirmButton.on("click", this.onCatConfirmClicked, this);
        this.boosterSelectionConfirmButton.on("click", this.onBoosterConfirmClicked, this);
        this.startButton.on("click", this.hide, this);
      },
      init: function init(onClosed) {
        this.onClosed = onClosed;
      },
      show: function show(levelData) {
        var _this = this;
        this.node.active = true;
        this.animating = true;
        this.backer.active = true;
        this.backer.opacity = 0;
        cc.tween(this.backer).to(.3, {
          opacity: 200
        }, {
          easing: "quadOut"
        }).start();
        this.popup.active = true;
        this.popup.scale = 0;
        this.popup.opacity = 0;
        cc.tween(this.popup).delay(.2).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this.animating = false;
        }).start();
        this.levelLabel.string = "LEVEL " + levelData.id;
        var firstPositionX = -(levelData.objectives.length - 1) * (OBJECTIVE_ITEM_SPACING + OBJECTIVE_ITEM_SIZE) * .5;
        var i = 0;
        levelData.objectives.forEach(function(objective) {
          var go = cc.instantiate(_this.ObjectiveItem).getComponent("ObjectiveItem");
          go.node.parent = _this.objectivesFrame;
          go.node.x = firstPositionX + (OBJECTIVE_ITEM_SPACING + OBJECTIVE_ITEM_SIZE) * i;
          go.node.y = 0;
          go.node.scale = OBJECTIVE_ITEM_SIZE / go.node.width;
          go.loadObjective(objective);
          i++;
        });
        this.reloadBoosters();
        this.reloadCat();
        var startX = .5 * -((SELECTION_COLUMN - 1) * SELECTION_ITEM_SIZE + (SELECTION_COLUMN - 1) * SELECTION_ITEM_SPACING);
        var cats = _userState["default"].getCats();
        this.catSelectionList = {};
        var catRowNumber = Math.ceil(Object.keys(_cats["default"]).length / SELECTION_COLUMN);
        this.catSelectionFrame.height = catRowNumber * SELECTION_ITEM_SIZE + (catRowNumber + 1) * SELECTION_ITEM_SPACING;
        var catStartY = this.catSelectionFrame.height - SELECTION_ITEM_SPACING - .5 * SELECTION_ITEM_SIZE;
        i = 0;
        for (var type in _cats["default"]) {
          var item = cc.instantiate(this.StartSelectionItem).getComponent("StartSelectionItem");
          item.node.parent = this.catSelectionFrame;
          item.node.x = startX + i % SELECTION_COLUMN * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          item.node.y = catStartY - Math.floor(i / SELECTION_COLUMN) * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          item.loadItem("cat", _extends({
            id: type
          }, _cats["default"][type], cats[type], {
            selected: _userState["default"].getSelectedCat() === type
          }));
          item.onItemClicked = this.onSelectionItemClicked.bind(this);
          this.catSelectionList[type] = item;
          i++;
        }
        var boosters = _userState["default"].getBoosters();
        this.boosterSelectionList = {};
        this.boosterSelectionQueue = [];
        var boosterRowNumber = Math.ceil(Object.keys(_boosters["default"]).length / SELECTION_COLUMN);
        this.boosterSelectionFrame.height = boosterRowNumber * SELECTION_ITEM_SIZE + (boosterRowNumber + 1) * SELECTION_ITEM_SPACING;
        var boosterStartY = this.boosterSelectionFrame.height - SELECTION_ITEM_SPACING - .5 * SELECTION_ITEM_SIZE;
        i = 0;
        for (var _type in _boosters["default"]) {
          var _item = cc.instantiate(this.StartSelectionItem).getComponent("StartSelectionItem");
          _item.node.parent = this.boosterSelectionFrame;
          _item.node.x = startX + i % SELECTION_COLUMN * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          _item.node.y = boosterStartY - Math.floor(i / SELECTION_COLUMN) * (SELECTION_ITEM_SPACING + SELECTION_ITEM_SIZE);
          _item.loadItem("booster", _extends({
            id: _type
          }, _boosters["default"][_type], boosters[_type]));
          _item.onItemClicked = this.onSelectionItemClicked.bind(this);
          this.boosterSelectionList[_type] = _item;
          boosters[_type].selected && this.boosterSelectionQueue.push(_type);
          i++;
        }
      },
      hide: function hide() {
        var _this2 = this;
        if (this.animating) return;
        this.animating = true;
        cc.tween(this.backer).to(.4, {
          opacity: 0
        }, {
          easing: "sineOut"
        }).start();
        cc.tween(this.popup).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this2.animating = false;
          _this2.node.active = false;
          _this2.onClosed && _this2.onClosed();
        }).start();
      },
      reloadBoosters: function reloadBoosters() {
        var boosters = _userState["default"].getBoosters();
        var i = 0;
        for (var type in boosters) {
          if (i === MAX_BOOSTER_SELECTION) break;
          var booster = boosters[type];
          if (booster.selected) {
            i++;
            var boosterItemGO = this.innerFrame.getChildByName("BoosterItem_" + i).getComponent("BoosterItem");
            boosterItemGO.loadBooster({
              type: type,
              number: booster.amount
            });
          }
        }
        while (i < MAX_BOOSTER_SELECTION) {
          i++;
          var _boosterItemGO = this.innerFrame.getChildByName("BoosterItem_" + i).getComponent("BoosterItem");
          _boosterItemGO.setLocked();
        }
      },
      reloadCat: function reloadCat() {
        this.catView.loadCat(_userState["default"].getSelectedCat());
      },
      onCatChangeClicked: function onCatChangeClicked() {
        var _this3 = this;
        if (this.animating) return;
        this.animating = true;
        this.catSelectionPopup.active = true;
        this.catSelectionConfirmButton.active = true;
        this.backer.zIndex = 1;
        this.catSelectionFrame.opacity = 0;
        this.catSelectionFrame.scale = 0;
        cc.tween(this.catSelectionFrame).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this3.animating = false;
        }).start();
      },
      onBoosterChangeClicked: function onBoosterChangeClicked() {
        var _this4 = this;
        if (this.animating) return;
        this.animating = true;
        this.boosterSelectionPopup.active = true;
        this.boosterSelectionConfirmButton.active = true;
        this.backer.zIndex = 1;
        this.boosterSelectionFrame.opacity = 0;
        this.boosterSelectionFrame.scale = 0;
        cc.tween(this.boosterSelectionFrame).to(.3, {
          scale: 1,
          opacity: 255
        }, {
          easing: "backOut"
        }).call(function() {
          _this4.animating = false;
        }).start();
      },
      onCatConfirmClicked: function onCatConfirmClicked() {
        var _this5 = this;
        if (this.animating) return;
        this.animating = true;
        this.backer.zIndex = -1;
        this.catSelectionConfirmButton.active = false;
        this.reloadCat();
        cc.tween(this.catSelectionFrame).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "cubicOut"
        }).call(function() {
          _this5.catSelectionPopup.active = false;
          _this5.animating = false;
        }).start();
      },
      onBoosterConfirmClicked: function onBoosterConfirmClicked() {
        var _this6 = this;
        if (this.animating) return;
        this.animating = true;
        this.backer.zIndex = -1;
        this.boosterSelectionConfirmButton.active = false;
        this.reloadBoosters();
        cc.tween(this.boosterSelectionFrame).to(.4, {
          scale: 0,
          opacity: 0
        }, {
          easing: "cubicOut"
        }).call(function() {
          _this6.boosterSelectionPopup.active = false;
          _this6.animating = false;
        }).start();
      },
      onSelectionItemClicked: function onSelectionItemClicked(item) {
        if (this.animating) return;
        if ("cat" === item.type) {
          var _this$catSelectionLis;
          item.setSelected(!item.data.selected);
          item.data.selected && (null == (_this$catSelectionLis = this.catSelectionList[_userState["default"].getSelectedCat()]) ? void 0 : _this$catSelectionLis.setSelected(false));
          _userState["default"].updateSelectedCat(item.data.selected ? item.data.id : null);
        } else if ("booster" === item.type) {
          var boosters = _userState["default"].getBoosters();
          if (item.data.selected) {
            item.setSelected(false);
            boosters[item.data.id].selected = false;
            this.boosterSelectionQueue.splice(this.boosterSelectionQueue.indexOf(item.data.id), 1);
          } else {
            if (this.boosterSelectionQueue.length >= MAX_BOOSTER_SELECTION) {
              var firstSelectedItem = this.boosterSelectionQueue[0];
              this.boosterSelectionQueue.splice(0, 1);
              this.boosterSelectionList[firstSelectedItem].setSelected(false);
              boosters[firstSelectedItem].selected = false;
            }
            item.setSelected(true);
            boosters[item.data.id].selected = true;
            this.boosterSelectionQueue.push(item.data.id);
          }
          _userState["default"].saveBoostersState();
        }
      }
    });
    cc._RF.pop();
  }, {
    "../constants": "constants",
    "../staticData/boosters": "boosters",
    "../staticData/cats": "cats",
    "../userState": "userState"
  } ],
  SubsceneController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aa749nrC1VOrIpHfytA/mmC", "SubsceneController");
    "use strict";
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {
        HomePrefab: {
          default: null,
          type: cc.Prefab
        },
        ShopPrefab: {
          default: null,
          type: cc.Prefab
        },
        CatPrefab: {
          default: null,
          type: cc.Prefab
        },
        BagPrefab: {
          default: null,
          type: cc.Prefab
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.scaleContainer = this.node.getChildByName("scaleContainer");
        this.subsceneContainer = this.scaleContainer.getChildByName("Subscenes");
        this.topUI = this.scaleContainer.getChildByName("TopUI").getComponent("TopUI");
        this.bottomUI = this.scaleContainer.getChildByName("BotUI").getComponent("BottomUI");
        this.settingsPopup = this.scaleContainer.getChildByName("SettingsPopup").getComponent("SettingsPopup");
        this.subsceneMap = {
          home: {
            prefab: this.HomePrefab,
            component: "HomeSubscene",
            object: null,
            showTopUI: true
          },
          shop: {
            prefab: this.ShopPrefab,
            component: "ShopSubscene",
            object: null,
            showTopUI: false
          },
          cat: {
            prefab: this.CatPrefab,
            component: "CatSubscene",
            object: null,
            showTopUI: true
          },
          bag: {
            prefab: this.BagPrefab,
            component: "BagSubscene",
            object: null,
            showTopUI: false
          }
        };
        this.bottomUI.node.on("buttonClicked", this.onButtonUIClicked.bind(this));
        this.animating = false;
      },
      switchScene: function switchScene(sceneId, opts, animate) {
        var _this = this;
        void 0 === opts && (opts = null);
        void 0 === animate && (animate = false);
        var targetSubscene = this.subsceneMap[sceneId];
        if (targetSubscene && targetSubscene.prefab && targetSubscene.component) {
          if (this.currentId) {
            var object = this.subsceneMap[this.currentId].object;
            object.node.zIndex = 0;
            if (animate) {
              this.animating = true;
              cc.tween(object.node).to(ANIMATION_DURATION, {
                opacity: 0
              }, {
                easing: "quadOut"
              }).call(function() {
                object.node.active = false;
                _this.animating = false;
              }).start();
            } else object.node.active = false;
            "shop" === this.currentId || "bag" === this.currentId ? this.topUI.show(animate) : "shop" !== sceneId && "bag" !== sceneId || this.topUI.hide(animate);
            if (this.subsceneMap[sceneId].showTopUI !== this.subsceneMap[this.currentId]) {
              this.subsceneMap[sceneId].showTopUI && this.topUI.show(animate);
              this.subsceneMap[sceneId].showTopUI || this.topUI.hide(animate);
            }
          }
          if (!targetSubscene.object) {
            var _object = cc.instantiate(targetSubscene.prefab).getComponent(targetSubscene.component);
            _object.node.setParent(this.subsceneContainer);
            targetSubscene.object = _object;
          }
          targetSubscene.object.node.active = true;
          targetSubscene.object.node.zIndex = -1;
          targetSubscene.object.node.opacity = 255;
          targetSubscene.object.onOpened && targetSubscene.object.onOpened(opts);
          this.currentId = sceneId;
          this.bottomUI.selectButton(sceneId, animate);
          this.updateScreenSize(this.app.FRAME, this.cachedUIScale);
        }
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.cachedUIScale = uiScale || 1;
        if (this.currentId && this.subsceneMap[this.currentId].object) {
          var object = this.subsceneMap[this.currentId].object;
          object.node.width = this.scaleContainer.width;
          object.node.height = this.scaleContainer.height;
          object.updateScreenSize(frame, this.cachedUIScale);
        }
      },
      onButtonUIClicked: function onButtonUIClicked(id) {
        if (this.animating) return;
        if ("settings" === id) {
          this.settingsPopup.show(true);
          return;
        }
        this.switchScene(id, null, true);
      }
    });
    cc._RF.pop();
  }, {} ],
  TopUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8435f+OPBNDjqSGt1PzG2MK", "TopUI");
    "use strict";
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var content = this.node.getChildByName("content");
        this.coinLabel = content.getChildByName("coinLabel").getComponent(cc.Label);
        this.fishLabel = content.getChildByName("fishLabel").getComponent(cc.Label);
        this.heartLabel = content.getChildByName("heartLabel").getComponent(cc.Label);
      },
      onEnable: function onEnable() {
        this.updateLabels();
      },
      show: function show(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.node.active = true;
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            _this.animating = false;
          }).start();
        } else this.node.opacity = 255;
      },
      hide: function hide(animate) {
        var _this2 = this;
        void 0 === animate && (animate = false);
        if (animate) {
          this.animating = true;
          cc.tween(this.node).to(ANIMATION_DURATION, {
            opacity: 0
          }, {
            easing: "quadOut"
          }).call(function() {
            _this2.node.active = false;
            _this2.animating = false;
          }).start();
        } else {
          this.node.active = false;
          this.node.opacity = 0;
        }
      },
      updateLabels: function updateLabels() {
        this.fishLabel.string = _userState["default"].getFish();
        this.coinLabel.string = _userState["default"].getCoin();
        this.heartLabel.string = 0;
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.scale = uiScale;
        var topUIbacker = this.node.getChildByName("backer");
        topUIbacker.width = this.node.width / uiScale;
        var topUIContent = this.node.getChildByName("content");
        topUIContent.scale = .6 + 1 / uiScale * .4;
      }
    });
    cc._RF.pop();
  }, {
    "../userState": "userState"
  } ],
  TutorialController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d55e8YdBvpJAJFvXizqFVvb", "TutorialController");
    "use strict";
    var _constants = _interopRequireDefault(require("../constants.js"));
    var _tutorials = _interopRequireDefault(require("../staticData/tutorials.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var TILE_SIZE = _constants["default"].GAMEPLAY.TILE_SIZE;
    var ANIMATION_DURATION = .3;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.boardAnchor = this.node.getChildByName("BoardAnchor");
        this.verticalMask = this.boardAnchor.getChildByName("Mask");
        this.horizontalMask = this.verticalMask.getChildByName("Mask");
        this.cover = this.horizontalMask.getChildByName("Cover");
        this.paw = this.boardAnchor.getChildByName("Paw");
        this.labelFrame = this.boardAnchor.getChildByName("LabelFrame");
        this.label = this.labelFrame.getChildByName("label").getComponent(cc.Label);
        this.objectiveFrame = this.node.getChildByName("ObjectiveFrame");
        this.objectiveCover = this.objectiveFrame.getChildByName("Cover");
        this.objectiveArrow = this.objectiveFrame.getChildByName("Arrow");
        this.objectiveLabelFrame = this.objectiveFrame.getChildByName("LabelFrame");
        this.objectiveArrow.zIndex = 1;
        this.objectiveLabelFrame.zIndex = 2;
        this.objectiveCover.on("click", this.onObjectiveCoverTapped, this);
        this.pawOriginScale = 1;
        this.objectiveArrowTween = null;
        this.pawTween = null;
      },
      init: function init(level, opts) {
        this.boardAnchor.active = false;
        this.objectiveFrame.active = false;
        this.gameBoard = opts.gameBoard;
        this.topUI = opts.topUI;
        this.topObjectiveIcon = this.topUI.getChildByName("objectiveIcon");
        this.topObjectiveFrame = this.topUI.getChildByName("objectiveFrame");
        this.topObjectiveIconOriginY = this.topObjectiveIcon.y;
        this.topObjectiveFrameOriginY = this.topObjectiveFrame.y;
        if (_tutorials["default"][level]) {
          this.level = level;
          this.config = _tutorials["default"][level];
          this.hasTutorial = true;
          this.isTutorialShowing = false;
          this.step = 0;
          this.gameBoard.lockUserInteraction("tutorial");
        } else this.hasTutorial = false;
      },
      triggerTutorial: function triggerTutorial() {
        var _this = this;
        if (!this.hasTutorial) return;
        if (this.isTutorialShowing) return;
        this.isTutorialShowing = true;
        this.gameBoard.unlockUserInteraction("tutorial");
        var stepConfig = this.config[this.step];
        if ("objective" === stepConfig.type) {
          this.objectiveFrame.active = true;
          this.topObjectiveIcon.parent = this.objectiveFrame;
          this.topObjectiveFrame.parent = this.objectiveFrame;
          this.topObjectiveIcon.y += this.topUI.y;
          this.topObjectiveFrame.y += this.topUI.y;
          this.objectiveArrow.y = this.topObjectiveFrame.y - .5 * this.topObjectiveIcon.height - 120;
          this.objectiveLabelFrame.y = this.objectiveArrow.y - this.objectiveArrow.height - 100;
          this.objectiveFrame.opacity = 0;
          cc.tween(this.objectiveFrame).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            var currentArrowY = _this.objectiveArrow.y;
            _this.objectiveArrowTween = cc.tween(_this.objectiveArrow).repeatForever(cc.tween().to(.4, {
              y: currentArrowY + 80,
              scaleY: .8,
              scaleX: 1.2
            }, {
              easing: "quadOut"
            }).to(.3, {
              y: currentArrowY,
              scaleY: 1,
              scaleX: 1
            }, {
              easing: "linear"
            })).start();
          }).start();
        } else {
          this.boardAnchor.active = true;
          this.verticalMask.width = 0;
          this.verticalMask.height = 0;
          this.horizontalMask.width = 0;
          this.horizontalMask.height = 0;
          if (stepConfig.mask) {
            if (stepConfig.mask.vertical) {
              this.verticalMask.width = stepConfig.mask.vertical.square ? TILE_SIZE * stepConfig.mask.vertical.size : TILE_SIZE;
              this.verticalMask.height = TILE_SIZE * stepConfig.mask.vertical.size;
              this.verticalMask.x = this.gameBoard.boardXToViewX(stepConfig.mask.vertical.x) - .5 * TILE_SIZE + .5 * this.verticalMask.width;
              this.verticalMask.y = this.gameBoard.boardYToViewY(stepConfig.mask.vertical.y) + .5 * TILE_SIZE - .5 * this.verticalMask.height;
            }
            if (stepConfig.mask.horizontal) {
              this.horizontalMask.width = TILE_SIZE * stepConfig.mask.horizontal.size;
              this.horizontalMask.height = stepConfig.mask.horizontal.square ? TILE_SIZE * stepConfig.mask.horizontal.size : TILE_SIZE;
              this.horizontalMask.x = this.gameBoard.boardXToViewX(stepConfig.mask.horizontal.x) - .5 * TILE_SIZE + .5 * this.horizontalMask.width;
              this.horizontalMask.y = this.gameBoard.boardYToViewY(stepConfig.mask.horizontal.y) + .5 * TILE_SIZE - .5 * this.horizontalMask.height;
            }
          }
          this.labelFrame.active = false;
          if (stepConfig.label) {
            this.labelFrame.active = true;
            this.label.string = stepConfig.label.text || "";
            this.labelFrame.x = stepConfig.label.x || 0;
            this.labelFrame.y = stepConfig.label.y || 0;
            this.labelFrame.width = stepConfig.label.width || 780;
          }
          this.horizontalMask.x -= this.verticalMask.x;
          this.horizontalMask.y -= this.verticalMask.y;
          this.boardAnchor.opacity = 0;
          this.paw.active = false;
          cc.tween(this.boardAnchor).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).call(function() {
            if (stepConfig.move) if ("swap" === stepConfig.type) {
              _this.paw.active = true;
              var fromPos = [ _this.gameBoard.boardXToViewX(stepConfig.move.from.x), _this.gameBoard.boardYToViewY(stepConfig.move.from.y) ];
              var toPos = [ _this.gameBoard.boardXToViewX(stepConfig.move.to.x), _this.gameBoard.boardYToViewY(stepConfig.move.to.y) ];
              _this.paw.x = fromPos[0] + 300;
              _this.paw.y = fromPos[1] - 500;
              _this.paw.opacity = 0;
              _this.pawTween = cc.tween(_this.paw).to(.5, {
                x: fromPos[0],
                y: fromPos[1],
                opacity: 255
              }, {
                easing: "sineOut"
              }).delay(.1).repeatForever(cc.tween().to(.3, {
                x: toPos[0],
                y: toPos[1]
              }, {
                easing: "quadOut"
              }).delay(.2).to(.4, {
                x: fromPos[0],
                y: fromPos[1]
              }, {
                easing: "linear"
              }).delay(.2)).start();
            } else if ("tap" === stepConfig.type) {
              _this.paw.active = true;
              var pos = [ _this.gameBoard.boardXToViewX(stepConfig.move.from.x), _this.gameBoard.boardYToViewY(stepConfig.move.from.y) ];
              _this.paw.x = pos[0] + 300;
              _this.paw.y = pos[1] - 500;
              _this.paw.opacity = 0;
              _this.pawTween = cc.tween(_this.paw).to(.5, {
                x: pos[0],
                y: pos[1],
                opacity: 255
              }, {
                easing: "sineOut"
              }).delay(.1).repeatForever(cc.tween().to(.2, {
                x: pos[0] - 30,
                y: pos[1] + 30,
                scale: 1.1 * _this.pawOriginScale
              }, {
                easing: "quadOut"
              }).delay(.1).to(.3, {
                x: pos[0],
                y: pos[1],
                scale: _this.pawOriginScale
              }, {
                easing: "linear"
              }).delay(.1)).start();
            }
          }).start();
        }
        this.updateScreenSize();
      },
      validateMove: function validateMove(type, item, target) {
        if (!this.hasTutorial) return true;
        if (!this.isTutorialShowing) return true;
        if (!item) return false;
        var stepConfig = this.config[this.step];
        if (stepConfig.type !== type) return false;
        if ("tap" === type) {
          if (item.boardX === stepConfig.move.from.x && item.boardY === stepConfig.move.from.y) return true;
        } else if ("swap" === type) {
          if (!target) return false;
          if (item.boardX === stepConfig.move.from.x && item.boardY === stepConfig.move.from.y && target.boardX === stepConfig.move.to.x && target.boardY === stepConfig.move.to.y) return true;
          if (item.boardX === stepConfig.move.to.x && item.boardY === stepConfig.move.to.y && target.boardX === stepConfig.move.from.x && target.boardY === stepConfig.move.from.y) return true;
        }
        return false;
      },
      stepUp: function stepUp(type) {
        var _this$objectiveArrowT, _this$pawTween;
        if (!this.hasTutorial) return;
        if (!this.isTutorialShowing) return;
        var stepConfig = this.config[this.step];
        if (stepConfig.type !== type) return;
        if ("objective" === stepConfig.type) {
          this.topObjectiveIcon.parent = this.topUI;
          this.topObjectiveFrame.parent = this.topUI;
          this.topObjectiveIcon.y = this.topObjectiveIconOriginY;
          this.topObjectiveFrame.y = this.topObjectiveFrameOriginY;
        }
        null == (_this$objectiveArrowT = this.objectiveArrowTween) ? void 0 : _this$objectiveArrowT.stop();
        null == (_this$pawTween = this.pawTween) ? void 0 : _this$pawTween.stop();
        var fadingFrame = "objective" === stepConfig.type ? this.objectiveFrame : this.boardAnchor;
        cc.tween(fadingFrame).to(ANIMATION_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          fadingFrame.active = false;
          fadingFrame.opacity = 255;
        }).start();
        this.step++;
        this.isTutorialShowing = false;
        this.gameBoard.lockUserInteraction("tutorial");
        if (this.step >= this.config.length) {
          this.hasTutorial = false;
          this.gameBoard.unlockUserInteraction("tutorial");
        }
      },
      onObjectiveCoverTapped: function onObjectiveCoverTapped() {
        this.stepUp("objective");
      },
      updateScreenSize: function updateScreenSize() {
        this.boardAnchor.scale = this.gameBoard.view.scale;
        this.boardAnchor.width = this.gameBoard.view.width;
        this.boardAnchor.height = this.gameBoard.view.height;
        this.boardAnchor.y = this.gameBoard.view.y;
        this.labelFrame.scale = 1 / this.boardAnchor.scale;
        this.paw.scale = 1 / this.boardAnchor.scale;
        this.pawOriginScale = this.paw.scale;
        this.cover.width = this.node.width;
        this.cover.height = this.node.height;
        this.cover.x = 0;
        this.cover.y = -this.boardAnchor.y / this.boardAnchor.scale;
        this.cover.scale = 1 / this.boardAnchor.scale;
        this.objectiveCover.width = this.node.width;
        this.objectiveCover.height = this.node.height;
        this.cover.x -= this.horizontalMask.x;
        this.cover.y -= this.horizontalMask.y;
        this.cover.x -= this.verticalMask.x;
        this.cover.y -= this.verticalMask.y;
      }
    });
    cc._RF.pop();
  }, {
    "../constants.js": "constants",
    "../staticData/tutorials.js": "tutorials"
  } ],
  YardGlow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0eb78QXX3hOEI8byyLLimCa", "YardGlow");
    "use strict";
    var HIGHLIGHT_SPEED = .7;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      setGlowShape: function setGlowShape(id) {
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.image.spriteFrame = this[id];
      }
    });
    cc._RF.pop();
  }, {} ],
  YardItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d5b0vf9HpKDoge/BCGmito", "YardItem");
    "use strict";
    var _CatCommands = _interopRequireDefault(require("../commands/CatCommands"));
    var _catModels = _interopRequireDefault(require("../models/catModels"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    var _constants = _interopRequireDefault(require("../constants"));
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var DEBUG = _constants["default"].DEBUG, TIME_SPAN = _constants["default"].TIME_SPAN;
    var UPDATE_INTERVAL = .4;
    var ONE_SECOND = DEBUG.FEEDING_ENVIRONMENT ? 20 : TIME_SPAN.ONE_SECOND;
    cc.Class({
      extends: cc.Component,
      properties: {
        bed: {
          default: null,
          type: cc.SpriteFrame
        },
        cushion: {
          default: null,
          type: cc.SpriteFrame
        },
        featherToy: {
          default: null,
          type: cc.SpriteFrame
        },
        hamburgerCushion: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag1: {
          default: null,
          type: cc.SpriteFrame
        },
        paperBag2: {
          default: null,
          type: cc.SpriteFrame
        },
        plushDoll: {
          default: null,
          type: cc.SpriteFrame
        },
        pot: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRainbow: {
          default: null,
          type: cc.SpriteFrame
        },
        rubberBallRed: {
          default: null,
          type: cc.SpriteFrame
        },
        stretchingBoard: {
          default: null,
          type: cc.SpriteFrame
        },
        swimRing: {
          default: null,
          type: cc.SpriteFrame
        },
        swing: {
          default: null,
          type: cc.SpriteFrame
        },
        tent: {
          default: null,
          type: cc.SpriteFrame
        },
        tower: {
          default: null,
          type: cc.SpriteFrame
        },
        tunnel: {
          default: null,
          type: cc.SpriteFrame
        },
        heart_effect: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.cat = this.node.getChildByName("cat").getComponent("CatView");
        this.bubble = this.node.getChildByName("bubble");
        this.bubbleLabel = this.bubble.getChildByName("label").getComponent(cc.Label);
        this.heartContainer = this.node.getChildByName("heartContainer");
        this.timelabel = this.node.getChildByName("timeLabel").getComponent(cc.Label);
        this.deletebutton = this.node.getChildByName("closeButton").getComponent(cc.Button);
        this.image.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.deletebutton.node.on("click", this.onDeleteClicked, this);
        this.cat.node.on(cc.Node.EventType.TOUCH_END, this.onCatTouchEnd, this);
        this.x = -1;
        this.y = -1;
      },
      update: function update(dt) {
        this.elapsedTime -= dt;
        if (this.elapsedTime < 0) {
          this.updateDataState();
          this.elapsedTime = UPDATE_INTERVAL;
        }
        this.heartElapsedTime -= dt;
        if (this.heartElapsedTime < 0 && this.state.playingCat) {
          if (this.state.playingCat && !this.editMode) {
            var cat = _catModels["default"].getCat(this.state.playingCat);
            cat.isFull() && this.playSingleHeartEffect(2);
          }
          this.heartElapsedTime = .6 * Math.random();
        }
      },
      refreshFeedingInfo: function refreshFeedingInfo() {
        if (!this.state.playingCat) return;
        var cat = _catModels["default"].getCat(this.state.playingCat);
        cat.isMaxed() ? this.bubbleLabel.string = "MAXED!" : this.bubbleLabel.string = (cat.data.dailyFed || 0) + "/" + cat.config.feedablePerDay;
      },
      updateDataState: function updateDataState() {
        this.state.playingCat = this.state.playingCat || null;
        this.state.nextUpdate = this.state.nextUpdate || Date.now() + this.config.interval * ONE_SECOND;
        this.cat.node.active = this.state.playingCat && !this.editMode;
        if (this.state.nextUpdate - Date.now() < 0) if (this.state.playingCat) this.state.nextUpdate - Date.now() < -this.config.interval * ONE_SECOND ? this.state.nextUpdate = Date.now() + _cats["default"][this.state.playingCat].playTime * ONE_SECOND : this.setYardIdle(); else {
          var attractedCats = _extends({}, this.config.attract);
          for (var key in _userState["default"].getYard()) attractedCats[_userState["default"].getYard()[key].playingCat] && delete attractedCats[_userState["default"].getYard()[key].playingCat];
          if (0 === Object.keys(attractedCats).length) {
            console.warn("no Free cat");
            this.setYardIdle();
          } else {
            var playingCat = null;
            var randomWeight = 0;
            for (var _key in attractedCats) randomWeight += attractedCats[_key];
            var random = Math.random() * randomWeight;
            for (var _key2 in attractedCats) {
              if (random < attractedCats[_key2]) {
                playingCat = _key2;
                break;
              }
              random -= attractedCats[_key2];
            }
            if (playingCat) {
              this.state.playingCat = playingCat;
              this.state.nextUpdate = Date.now() + _cats["default"][playingCat].playTime * ONE_SECOND;
              this.cat.node.active = !this.editMode;
              this.bubble.active = !this.editMode;
              this.cat.loadCat(playingCat);
            } else this.setYardIdle();
            this.refreshFeedingInfo();
          }
        }
        this.timelabel.string = _helpers["default"].formatTimeString(Math.max(this.state.nextUpdate - Date.now(), 0));
      },
      setYardIdle: function setYardIdle() {
        this.state.playingCat = null;
        this.state.nextUpdate = Date.now() + this.config.interval * ONE_SECOND;
        this.cat.node.active = false;
        this.bubble.active = false;
      },
      playSingleHeartEffect: function playSingleHeartEffect(duration) {
        void 0 === duration && (duration = 1);
        var heartNode = new cc.Node();
        heartNode.addComponent(cc.Sprite).spriteFrame = this.heart_effect;
        heartNode.x = 128 * Math.random() - 64;
        heartNode.y = 90 * Math.random() - 30;
        heartNode.scale = .3 * Math.random() + .7;
        this.heartContainer.addChild(heartNode);
        cc.tween(heartNode).to(Math.random() * duration * .3 + .7 * duration, {
          opacity: 30,
          y: heartNode.y + 30 * Math.random() + 60,
          x: heartNode.x - 5 + 5 * Math.random()
        }, {
          easing: "sineOut"
        }).call(function() {
          heartNode.destroy();
        }).start();
      },
      setConfig: function setConfig(config) {
        this.id = config.id;
        this.config = config;
        this.config.size = this.config.size || {
          x: 1,
          y: 1
        };
        this.config.offset = this.config.offset || {
          x: 0,
          y: 0
        };
        this.config.buttonOffset = this.config.buttonOffset || {
          x: 0,
          y: 0
        };
        this.config.catOffset = this.config.catOffset || {
          x: 0,
          y: 0
        };
        this.config.labelOffset = this.config.labelOffset || {
          x: 0,
          y: 0
        };
        this.state = _userState["default"].getYard()[this.id];
        this.app = cc.find("app").getComponent("app");
        this.home = cc.find("Canvas").getComponent("Home");
        this.image = this.node.getChildByName("image").getComponent(cc.Sprite);
        this.deletebutton = this.node.getChildByName("closeButton").getComponent(cc.Button);
        this.cat = this.node.getChildByName("cat").getComponent("CatView");
        this.bubble = this.node.getChildByName("bubble");
        this.bubbleLabel = this.bubble.getChildByName("label").getComponent(cc.Label);
        this.heartContainer = this.node.getChildByName("heartContainer");
        this.timelabel = this.node.getChildByName("timeLabel").getComponent(cc.Label);
        this.image.spriteFrame = this[config.id];
        this.deletebutton.node.x = .5 * this.image.node.width + this.config.buttonOffset.x;
        this.deletebutton.node.y = .5 * this.image.node.height + this.config.buttonOffset.y;
        this.cat.node.x = this.config.catOffset.x;
        this.cat.node.y = this.config.catOffset.y;
        this.timelabel.node.x = this.config.labelOffset.x;
        this.timelabel.node.y = this.config.labelOffset.y;
        this.bubble.x = this.config.catOffset.x + 140;
        this.bubble.y = this.config.catOffset.y + 120;
        this.heartContainer.x = this.config.catOffset.x;
        this.heartContainer.y = this.config.catOffset.y;
        this.cat.loadCat(this.state.playingCat);
        this.timelabel.node.active = true;
        this.deletebutton.node.active = false;
        this.bubble.active = null !== this.state.playingCat;
        this.elapsedTime = 0;
        this.heartElapsedTime = 0;
        this.editMode = false;
        this.refreshFeedingInfo();
      },
      exitEditMode: function exitEditMode() {
        this.editMode = false;
        this.deletebutton.node.active = false;
        this.cat.node.active = this.state.playingCat;
        this.bubble.active = this.state.playingCat;
        this.timelabel.node.active = true;
      },
      enterEditMode: function enterEditMode() {
        this.editMode = true;
        this.deletebutton.node.active = true;
        this.cat.node.active = false;
        this.bubble.active = false;
        this.timelabel.node.active = false;
      },
      onTouchStart: function onTouchStart(e) {
        var location = e.getLocation();
        var offset = this.image.node.convertToNodeSpaceAR(location);
        offset.x += .5 * this.image.node.width;
        offset.y += .5 * this.image.node.height;
        this.onItemTouched && this.onItemTouched(e, this, offset);
        e.stopPropagation();
      },
      onDeleteClicked: function onDeleteClicked(e) {
        this.onItemDeleted && this.onItemDeleted(this);
      },
      onCatTouchEnd: function onCatTouchEnd(e) {
        if (!this.editMode && this.state.playingCat) {
          var result = _CatCommands["default"].feed(this.state.playingCat, DEBUG.FEEDING_ENVIRONMENT ? 10 : 1);
          if (result.dailyFeedChanged) {
            this.playSingleHeartEffect();
            this.refreshFeedingInfo();
            this.home.topUI.updateLabels();
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    "../commands/CatCommands": "CatCommands",
    "../constants": "constants",
    "../helpers": "helpers",
    "../models/catModels": "catModels",
    "../staticData/cats": "cats",
    "../userState": "userState"
  } ],
  YardView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51fc0tBq/FAQZ6SB7dAaYfD", "YardView");
    "use strict";
    var _helpers = _interopRequireDefault(require("../helpers"));
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var PRESS_DURATION = .5;
    var PRESS_MOVE_SQR_TOLERANCE = 10;
    var SCROLL_SPEED = 8;
    var SCROLL_DISTANCE_MODIFIER = 2.2;
    var SCROLL_THRESHOLD_WITH_ITEM = 160;
    var SCROLL_SPPED_WITH_ITEM = .3;
    var INITIAL_X = -690;
    var ANIMATION_DURATION = .4;
    var GLOWING_SPEED = .7;
    var WIREFRAME_CELL_SIZE = 200;
    var WIREFRAME_Y_OFFSET = 800;
    var UPDATE_INTERVAL = 3;
    cc.Class({
      extends: cc.Component,
      properties: {
        WireframeCell: {
          default: null,
          type: cc.SpriteFrame
        },
        YardItem: {
          default: null,
          type: cc.Prefab
        },
        material_glow: {
          default: null,
          type: cc.Material
        }
      },
      onLoad: function onLoad() {
        this.app = cc.find("app").getComponent("app");
        this.home = this.node.parent.getComponent("HomeSubscene");
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._destX = this.node.x;
        this._prevTouchX = 0;
        this._screenX = 0;
        this._viewPos = {};
        this.glowTimer = 0;
        this.pressingTime = 0;
        this.isPressing = false;
        this.editMode = false;
        this.selectingItem = null;
        this.isDragging = false;
        this.draggingOffset = null;
        this.scrollView = this.node.getChildByName("scrollView");
        this.yardItemGlow = this.scrollView.getChildByName("YardGlow").getComponent("YardGlow");
        this.wireframe = this.scrollView.getChildByName("wireframe");
        this.wireframe.x = .5 * -this.scrollView.width;
        this.wireframe.y = .5 * this.scrollView.height - WIREFRAME_Y_OFFSET;
        this.loadWireframe();
        this.wireframe.active = false;
        this.scrollView.x = INITIAL_X;
        this._destX = INITIAL_X;
        this.yardItemGlow.node.zIndex = _yard["default"].patternSize.x * _yard["default"].patternSize.y;
        this.yardItemGlow.node.active = false;
      },
      onEnable: function onEnable() {
        if (this.app.yardViewRefreshRequest) {
          this.loadItems();
          this.app.yardViewRefreshRequest = false;
        }
        this.elapsedTime = UPDATE_INTERVAL;
      },
      update: function update(dt) {
        if (this.isDragging) {
          var screenWidth = this.app.FRAME.width;
          var screenX = this._screenX - .5 * (1024 - screenWidth);
          var scrollThreshold = SCROLL_THRESHOLD_WITH_ITEM / 1024 * screenWidth;
          screenX < scrollThreshold ? this._destX += (scrollThreshold - screenX) * SCROLL_SPPED_WITH_ITEM : screenX > screenWidth - scrollThreshold && (this._destX -= (scrollThreshold - (screenWidth - screenX)) * SCROLL_SPPED_WITH_ITEM);
        }
        this.scrollView.x = _helpers["default"].lerp(this.scrollView.x, this._destX, dt * SCROLL_SPEED);
        var widthLimit = .5 * (this.scrollView.width - this.node.width / this.node.scale);
        var clampX = Math.max(Math.min(this.scrollView.x, widthLimit), -widthLimit);
        this._destX = clampX !== this.scrollView.x ? this.scrollView.x : this._destX;
        this.scrollView.x = clampX;
        this.isPressing && (this.pressingTime += dt);
        if (this.isPressing && this.pressingTime > PRESS_DURATION) {
          this.isPressing = false;
          this.editMode || this.home.enterEditMode(true);
        }
        if (this.editMode && this.isDragging && this.selectingItem) {
          var touchCoord = this.convertToWireframeCoord(this._viewPos, this.draggingOffset);
          this.isCoordValid(touchCoord, this.selectingItem.config, this.selectingItem) && this.placeItem(this.selectingItem, touchCoord);
        }
        if (this.editMode && this.yardItemGlow.node.active && this.selectingItem) {
          this.yardItemGlow.node.x = this.selectingItem.node.x;
          this.yardItemGlow.node.y = this.selectingItem.node.y;
        }
        if (this.yardItemGlow.node.active) {
          this.glowTimer += dt * GLOWING_SPEED;
          this.material_glow.setProperty("hl_timer", this.glowTimer);
        }
        this.elapsedTime -= dt;
        if (this.elapsedTime < 0) {
          this.updateDataState();
          this.elapsedTime = UPDATE_INTERVAL;
        }
      },
      updateDataState: function updateDataState() {
        _userState["default"].saveYard();
      },
      loadWireframe: function loadWireframe() {
        this.wireFrameCells = [];
        var pattern = _yard["default"].pattern;
        for (var y = 0; y < pattern.length; y++) {
          this.wireFrameCells[y] = [];
          for (var x = 0; x < pattern[y].length; x++) {
            var newCell = new cc.Node();
            newCell.addComponent(cc.Sprite);
            newCell.getComponent(cc.Sprite).spriteFrame = this.WireframeCell;
            newCell.x = x * WIREFRAME_CELL_SIZE + .5 * WIREFRAME_CELL_SIZE;
            newCell.y = -y * WIREFRAME_CELL_SIZE - .5 * WIREFRAME_CELL_SIZE;
            newCell.width = WIREFRAME_CELL_SIZE;
            newCell.height = WIREFRAME_CELL_SIZE;
            newCell.color = _yard["default"].colors[pattern[y][x]].color;
            newCell.opacity = _yard["default"].colors[pattern[y][x]].opacity;
            this.wireframe.addChild(newCell);
            this.wireFrameCells[y][x] = {
              tile: newCell,
              type: pattern[y][x],
              occupiedBy: null
            };
          }
        }
      },
      loadItems: function loadItems() {
        this.data = _userState["default"].getYard();
        var pattern = _yard["default"].pattern;
        for (var y = 0; y < pattern.length; y++) for (var x = 0; x < pattern[y].length; x++) this.wireFrameCells[y][x].occupiedBy = null;
        if (this.yardItems) for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.node.destroy();
        }
        this.yardItems = {};
        for (var _key in this.data) {
          var item = this.data[_key];
          var itemConfig = _yard["default"].items[_key];
          if (!itemConfig || !this.isCoordValid(item, itemConfig)) continue;
          var newYardItem = cc.instantiate(this.YardItem).getComponent("YardItem");
          newYardItem.setConfig(_extends({
            id: _key
          }, itemConfig));
          newYardItem.onItemTouched = this.onItemTouched.bind(this);
          newYardItem.onItemDeleted = this.onItemDeleted.bind(this);
          this.scrollView.addChild(newYardItem.node);
          this.yardItems[_key] = newYardItem;
          this.placeItem(newYardItem, item);
        }
        var willSave = false;
        for (var _key2 in this.data) {
          var _item = this.data[_key2];
          if (-1 === _item.x && -1 === _item.y) {
            willSave = true;
            var coord = this.findValidRandomCoord(_key2);
            if (!coord) {
              delete this.data[_key2];
              this.app.suppliesRefreshRequest = true;
              continue;
            }
            this.data[_key2].x = coord.x;
            this.data[_key2].y = coord.y;
            var _itemConfig = _yard["default"].items[_key2];
            var _newYardItem = cc.instantiate(this.YardItem).getComponent("YardItem");
            _newYardItem.setConfig(_extends({
              id: _key2
            }, _itemConfig));
            _newYardItem.onItemTouched = this.onItemTouched.bind(this);
            _newYardItem.onItemDeleted = this.onItemDeleted.bind(this);
            this.scrollView.addChild(_newYardItem.node);
            this.yardItems[_key2] = _newYardItem;
            this.placeItem(_newYardItem, coord);
          }
        }
        willSave && _userState["default"].saveYard();
      },
      saveYardState: function saveYardState() {
        _userState["default"].saveYard();
        this.app.suppliesRefreshRequest = true;
      },
      enterEditMode: function enterEditMode(animate) {
        void 0 === animate && (animate = false);
        this.editMode = true;
        this.wireframe.active = true;
        if (animate) {
          this.wireframe.opacity = 0;
          cc.tween(this.wireframe).to(ANIMATION_DURATION, {
            opacity: 255
          }, {
            easing: "quadOut"
          }).start();
        } else this.wireframe.opacity = 255;
        for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.enterEditMode();
        }
        if (this.selectingItem) {
          this.yardItemGlow.node.active = true;
          this.glowTimer = 0;
        }
      },
      exitEditMode: function exitEditMode(animate) {
        var _this = this;
        void 0 === animate && (animate = false);
        this.editMode = false;
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
        animate ? cc.tween(this.wireframe).to(ANIMATION_DURATION, {
          opacity: 0
        }, {
          easing: "quadOut"
        }).call(function() {
          _this.wireframe.active = false;
        }).start() : this.wireframe.active = false;
        for (var key in this.yardItems) {
          var yardItem = this.yardItems[key];
          yardItem.exitEditMode();
        }
      },
      isCoordValid: function isCoordValid(coord, config, target) {
        void 0 === target && (target = null);
        for (var y = 0; y < config.size.y; y++) for (var x = 0; x < config.size.x; x++) {
          if (coord.y - y < 0) return false;
          if (coord.x + x >= _yard["default"].patternSize.x) return false;
          var checkingCell = this.wireFrameCells[coord.y - y][coord.x + x];
          if (checkingCell.occupiedBy && checkingCell.occupiedBy !== target) return false;
          if ("none" === checkingCell.type) return false;
          if (checkingCell.type !== config.type) return false;
        }
        return true;
      },
      findValidRandomCoord: function findValidRandomCoord(key) {
        var itemConfig = _yard["default"].items[key];
        var validCoords = [];
        for (var y = 0; y < _yard["default"].patternSize.y; y++) for (var x = 0; x < _yard["default"].patternSize.x; x++) {
          var coord = {
            x: x,
            y: y
          };
          this.isCoordValid(coord, itemConfig) && validCoords.push(coord);
        }
        return 0 === validCoords.length ? null : validCoords[Math.floor(Math.random() * validCoords.length)];
      },
      freeUpSpace: function freeUpSpace(yardItem) {
        if (yardItem.x >= 0 != null && yardItem.y >= 0) for (var y = 0; y < yardItem.config.size.y && yardItem.y - y >= 0; y++) for (var x = 0; x < yardItem.config.size.x && yardItem.x + x < _yard["default"].patternSize.x; x++) this.wireFrameCells[yardItem.y - y][yardItem.x + x].occupiedBy = null;
      },
      placeItem: function placeItem(yardItem, coord) {
        this.freeUpSpace(yardItem);
        coord.y -= yardItem.config.size.y - 1;
        var itemPosition = this.coordToPosition(coord);
        yardItem.node.x = itemPosition.x + yardItem.config.size.x * WIREFRAME_CELL_SIZE * .5 + yardItem.config.offset.x;
        yardItem.node.y = itemPosition.y - yardItem.config.size.y * WIREFRAME_CELL_SIZE * .5 + yardItem.config.offset.y;
        yardItem.node.zIndex = coord.y * _yard["default"].patternSize.x + (_yard["default"].patternSize.x - coord.x);
        yardItem.x = coord.x;
        yardItem.y = coord.y;
        for (var y = 0; y < yardItem.config.size.y && yardItem.y - y >= 0; y++) for (var x = 0; x < yardItem.config.size.x && yardItem.x + x < _yard["default"].patternSize.x; x++) this.wireFrameCells[yardItem.y - y][yardItem.x + x].occupiedBy = yardItem;
        this.data[yardItem.config.id].x = coord.x;
        this.data[yardItem.config.id].y = coord.y;
      },
      convertToWireframeCoord: function convertToWireframeCoord(viewPos, offset) {
        offset = offset || new cc.Vec2();
        var coord = {
          x: Math.floor((viewPos.x - this.scrollView.x + .5 * this.scrollView.width) / WIREFRAME_CELL_SIZE),
          y: Math.floor(-(viewPos.y - this.wireframe.y) / WIREFRAME_CELL_SIZE)
        };
        var offsetCoord = {
          x: Math.floor(offset.x / WIREFRAME_CELL_SIZE),
          y: Math.floor(offset.y / WIREFRAME_CELL_SIZE)
        };
        return {
          x: Math.max(0, Math.min(coord.x - offsetCoord.x, _yard["default"].patternSize.x - 1)),
          y: Math.max(0, Math.min(coord.y + offsetCoord.y, _yard["default"].patternSize.y - 1))
        };
      },
      coordToPosition: function coordToPosition(coord) {
        return {
          x: this.wireframe.x + WIREFRAME_CELL_SIZE * coord.x,
          y: this.wireframe.y - WIREFRAME_CELL_SIZE * coord.y
        };
      },
      selectItem: function selectItem(item, offset) {
        this.selectingItem = item;
        this.yardItemGlow.setGlowShape(this.selectingItem.config.id);
        this.home.editModeDragNotification(true);
        if (this.editMode) {
          this.yardItemGlow.node.active = true;
          this.glowTimer = 0;
        }
        this.draggingOffset = offset;
      },
      onItemTouched: function onItemTouched(e, item, offset) {
        this.onTouchStart(e, item, offset);
      },
      onTouchStart: function onTouchStart(e, item, offset) {
        var location = e.getLocation();
        this._viewPos = this.node.convertToNodeSpaceAR(location);
        this._prevTouchX = this._viewPos.x;
        this._screenX = e.getLocationInView().x;
        this.isPressing = true;
        this.pressingTime = 0;
        if (item) {
          this.isDragging = true;
          this.selectItem(item, offset);
        }
      },
      onTouchMove: function onTouchMove(e) {
        var location = e.getLocation();
        this._viewPos = this.node.convertToNodeSpaceAR(location);
        this.isDragging && this.editMode || (this._destX += (this._viewPos.x - this._prevTouchX) * SCROLL_DISTANCE_MODIFIER);
        this._prevTouchX = this._viewPos.x;
        this._screenX = e.getLocationInView().x;
        e.getDelta().magSqr() > PRESS_MOVE_SQR_TOLERANCE && (this.isPressing = false);
      },
      onTouchEnd: function onTouchEnd(e) {
        this.isPressing = false;
        this.isDragging = false;
        this.draggingOffset = null;
        this.home.editModeDragNotification(false);
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
      },
      onTouchCancel: function onTouchCancel(e) {
        this.isPressing = false;
        this.isDragging = false;
        this.draggingOffset = null;
        this.home.editModeDragNotification(false);
        this.selectingItem = null;
        this.yardItemGlow.node.active = false;
      },
      onItemDeleted: function onItemDeleted(item) {
        if (this.selectingItem === item) {
          this.yardItemGlow.node.active = false;
          this.home.editModeDragNotification(false);
          this.selectingItem = null;
        }
        delete this.data[item.config.id];
        delete this.yardItems[item.config.id];
        item.node.destroy();
      },
      updateScreenSize: function updateScreenSize(frame, uiScale) {
        this.node.width = this.node.parent.width;
      }
    });
    cc._RF.pop();
  }, {
    "../helpers": "helpers",
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  app: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "967d1HZ3u1MqZOZ0TlE2/L0", "app");
    "use strict";
    var _simplexNoise = _interopRequireDefault(require("simplex-noise"));
    var _Scheduler = _interopRequireDefault(require("./Scheduler.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var _this = this;
        this.IS_DEVELOPMENT = cc.debug.isDisplayStats();
        if (this.initDone) return console.error("app.js - already initiated");
        this.info("app.js - onLoad");
        if (this.IS_DEVELOPMENT) {
          console.log("DEBUG MODE");
          globalThis.app = this;
        }
        cc.game.addPersistRootNode(this.node);
        this.initDone = true;
        this.screenLocker = null;
        this.visibleScenes = [];
        this.CANVAS = {
          width: null,
          height: null
        };
        this.FRAME = {
          width: null,
          height: null,
          ratio: null
        };
        this.screenLocker = cc.find("screenLocker");
        this.spinner = this.screenLocker.getChildByName("spinnerFrame");
        cc.game.addPersistRootNode(this.screenLocker);
        this.screenLocker.active = false;
        this.screenLocker.zIndex = 999;
        cc.view.setResizeCallback(function() {
          _this.updateScreenSize();
        });
        var CANVAS = cc.find("Canvas");
        this.CANVAS.width = CANVAS.width;
        this.CANVAS.height = CANVAS.height;
        this.now = 0;
        this.noise = new _simplexNoise["default"]();
        this.scheduler = new _Scheduler["default"](this);
        this.yardViewRefreshRequest = false;
        this.boostersRefreshRequest = false;
        this.suppliesRefreshRequest = false;
        this.catRefreshRequest = false;
      },
      onEnable: function onEnable() {
        this.info("app.js - onEnable");
      },
      start: function start() {
        this.info("app.js - start");
      },
      update: function update(dt) {
        this.now += 1e3 * dt;
        this.scheduler.active && this.scheduler.onUpdate();
      },
      onDisable: function onDisable() {
        this.info("app.js - onDisable");
      },
      onDestroy: function onDestroy() {
        this.info("app.js - onDestroy");
      },
      info: function info() {
        if (!this.IS_DEVELOPMENT) return;
        console.info.apply(this, arguments);
      },
      lockScreen: function lockScreen(showSpinner) {
        void 0 === showSpinner && (showSpinner = false);
        this.screenLocker.active = true;
        this.spinner.active = showSpinner;
      },
      unlockScreen: function unlockScreen() {
        this.screenLocker.active = false;
        this.spinner.active = false;
      },
      updateScreenSize: function updateScreenSize() {
        this.info("---- updateScreenSize");
        var frameSize = cc.view.getFrameSize();
        this.FRAME.ratio = frameSize.width / frameSize.height;
        if (this.FRAME.ratio > 1) {
          this.FRAME.width = this.CANVAS.width;
          this.FRAME.height = Math.ceil(this.CANVAS.height / this.FRAME.ratio);
        } else {
          this.FRAME.width = Math.ceil(this.CANVAS.height * this.FRAME.ratio);
          this.FRAME.height = this.CANVAS.height;
        }
        console.log("--- FRAME", this.FRAME);
        for (var i = 0; i < this.visibleScenes.length; i++) {
          var scene = this.visibleScenes[i];
          scene.updateScreenSize && scene.updateScreenSize(this.FRAME);
        }
      },
      setSceneVisible: function setSceneVisible(scene) {
        if (-1 !== this.visibleScenes.indexOf(scene)) return console.error("scene is already registered as visible");
        this.visibleScenes.push(scene);
        this.updateScreenSize();
      },
      setSceneHidden: function setSceneHidden(scene) {
        var index = this.visibleScenes.indexOf(scene);
        if (-1 === index) return console.error("scene is not registered as visible");
        this.visibleScenes.splice(index, 1);
      },
      changeScene: function changeScene(from, to) {
        var _this2 = this;
        cc.game.addPersistRootNode(from.node);
        this.lockScreen(true);
        cc.director.loadScene(to, function() {
          cc.tween(from.node).to(.5, {
            opacity: 0
          }, {
            easing: "quadInOut"
          }).call(function() {
            cc.game.removePersistRootNode(from.node);
            from.node.destroy();
            _this2.unlockScreen();
          }).start();
        });
      },
      reloadScene: function reloadScene(cb) {
        var _this3 = this;
        var from = cc.director.getScene().getChildByName("Canvas");
        var fromName = cc.director.getScene().name;
        cc.game.addPersistRootNode(from);
        this.lockScreen(true);
        cc.director.loadScene("Empty", function() {
          cc.game.removePersistRootNode(from);
          from.destroy();
          from = cc.director.getScene().getChildByName("Canvas");
          cc.game.addPersistRootNode(from);
          cc.director.loadScene(fromName, function() {
            cc.game.removePersistRootNode(from);
            from.destroy();
            _this3.unlockScreen();
            cb && cb();
          });
        });
      }
    });
    cc._RF.pop();
  }, {
    "./Scheduler.js": "Scheduler",
    "simplex-noise": 1
  } ],
  boosters: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b54bSTPD9NaIaWU/c9bH/9", "boosters");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      hammer: {
        name: "Hammer",
        description: "Pops one Cube or obstacle of your choice"
      },
      airplane: {
        name: "Airplane",
        description: "Pops the row of the selected Cube"
      },
      rocket: {
        name: "Rocket",
        description: "Pops the column of the selected Cube"
      },
      fairystick: {
        name: "Fairystick",
        description: "Clears all Cubes with the same color as the selected Cube."
      },
      paintbrush: {
        name: "Paintbrush",
        description: "Changes the color of the selected Cube to the selected color"
      },
      wheel: {
        name: "Wheel",
        description: "Shuffles all of the cubes on the screen"
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  bumper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f4bfdkpMhCc4mclTjIwv/I", "bumper");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    var _tweenFunctions = _interopRequireDefault(require("tween-functions"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE;
    var DOOR_OPENING_DURATION = 200;
    var DOOR_CLOSING_DURATION = 300;
    var DOOR_REMAINS_OPEN_DURATION = 500;
    var MOUSE_APPEAR_DURATION = 100;
    var MOUSE_DISAPPEAR_AFTER = 800;
    var MOUSE_DISAPPEAR_DURATION = 250;
    var MOUSE_BACK_MOVEMENT_DURATION = 325;
    var MOUSE_SPEED = 7e3;
    var MOUSE_ANIMATION_STEP = {
      OPEN: "open",
      MOUSE: "mouse",
      CLOSE: "close"
    };
    var bumper = {
      properties: {
        doorClosed: {
          default: null,
          type: cc.SpriteFrame
        },
        doorOpened: {
          default: null,
          type: cc.SpriteFrame
        },
        mouse: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      is: function is(type) {
        return "mouseDoor" === type;
      },
      init: function init(that, options) {
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        switch (type) {
         case "mouseDoor":
          that._addLayers({
            doorOpened: that.doorOpened
          });
          that._addLayers({
            doorClosed: that.doorClosed
          });
        }
        that.layers.doorOpened.active = false;
        that.currentLayerId = "doorClosed";
      },
      gotHit: function gotHit(that, reason, resolve) {
        bumper["gotHit_" + that.type](that, reason, resolve);
      },
      gotHit_mouseDoor: function gotHit_mouseDoor(that, reason, resolve) {
        that.onUpdate || (that.onUpdate = {});
        var newResolve = function newResolve() {
          that.onDestroyCb && that.onDestroyCb(that.type);
          resolve();
        };
        if (that.onUpdate.hitInProgress) {
          var _data = that.onUpdate.hitInProgress.data;
          _data.mousesRemaining++;
          if (_data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
            _data.animationStep = MOUSE_ANIMATION_STEP.OPEN;
            _data.nextAnimationStep = that.app.now + DOOR_OPENING_DURATION / 100 * (100 - _data.doorOpeningPercentage);
          } else _data.animationStep === MOUSE_ANIMATION_STEP.MOUSE && (_data.nextAnimationStep = Math.min(that.app.now + 200, _data.nextAnimationStep));
          _data.resolveList.push(newResolve);
          return;
        }
        that.layers.doorOpened.active = true;
        var data = {
          doorOpeningPercentage: 0,
          animationStep: MOUSE_ANIMATION_STEP.OPEN,
          mousesRemaining: 1,
          animationStart: that.app.now,
          nextAnimationStep: that.app.now + DOOR_OPENING_DURATION,
          resolveList: [ newResolve ]
        };
        var update = function update(dt, data) {
          if (that.app.now >= data.nextAnimationStep) {
            if (data.animationStep === MOUSE_ANIMATION_STEP.OPEN) {
              that.layers.doorClosed.opacity = 0;
              data.animationStep = MOUSE_ANIMATION_STEP.MOUSE;
            } else if (data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
              that.layers.doorClosed.opacity = 255;
              that.layers.doorOpened.active = false;
              delete that.onUpdate.hitInProgress;
              that._onUpdateCleanup();
              return;
            }
            if (data.animationStep === MOUSE_ANIMATION_STEP.MOUSE) if (data.mousesRemaining < 1) {
              data.animationStep = MOUSE_ANIMATION_STEP.CLOSE;
              data.nextAnimationStep = that.app.now + DOOR_CLOSING_DURATION;
              data.animationStart = that.app.now;
            } else {
              bumper.createMouse(that, data.resolveList.shift(1));
              data.mousesRemaining--;
              data.mousesRemaining > 0 ? data.nextAnimationStep = that.app.now + 200 : data.nextAnimationStep = that.app.now + DOOR_REMAINS_OPEN_DURATION;
            }
          }
          if (data.animationStep === MOUSE_ANIMATION_STEP.OPEN || data.animationStep === MOUSE_ANIMATION_STEP.CLOSE) {
            data.doorOpeningPercentage = Math.min(1, (that.app.now - data.animationStart) / (data.nextAnimationStep - data.animationStart));
            var opacity = data.animationStep === MOUSE_ANIMATION_STEP.OPEN ? 1 - data.doorOpeningPercentage : data.doorOpeningPercentage;
            that.layers.doorClosed.opacity = 255 * opacity;
          }
        };
        that.onUpdate.hitInProgress = {
          data: data,
          update: update
        };
      },
      createMouse: function createMouse(that, resolve) {
        var gameBoard = that.gameBoard;
        var startX = gameBoard.boardXToViewX(that.boardX);
        var node = _helpers["default"].createSprite({
          spriteFrame: that.mouse,
          view: gameBoard.view,
          zIndex: Z_INDEX.FLYING_MISSILE,
          x: startX,
          y: gameBoard.boardYToViewY(that.boardY) - .09 * TILE_SIZE,
          width: .8 * TILE_SIZE,
          height: .8 * TILE_SIZE
        });
        node.opacity = 0;
        gameBoard.movingSprites.push({
          onTick: function onTick(data, dt) {
            var progress = gameBoard.app.now - data.startTime;
            node.opacity = progress < MOUSE_APPEAR_DURATION ? progress / MOUSE_APPEAR_DURATION * 255 : 255;
            var maxDeltaX = dt * MOUSE_SPEED;
            var tweenDeltax = data.startX + _tweenFunctions["default"].easeInBack(progress, 0, 3 * TILE_SIZE, MOUSE_BACK_MOVEMENT_DURATION) - node.x;
            node.x += Math.min(maxDeltaX, tweenDeltax);
            if (progress > MOUSE_DISAPPEAR_AFTER) {
              node.opacity = Math.max(0, MOUSE_DISAPPEAR_AFTER + MOUSE_DISAPPEAR_DURATION - progress) / MOUSE_DISAPPEAR_DURATION * 255;
              if (0 === node.opacity) {
                node.parent.removeChild(node);
                node.destroy();
                _helpers["default"].removeFromArray(data, gameBoard.movingSprites);
                data.resolve();
              }
            }
          },
          startTime: gameBoard.app.now,
          startX: startX,
          resolve: resolve
        });
      }
    };
    var _default = bumper;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers",
    "tween-functions": 3
  } ],
  cabinet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bf7eaiu7/VPmrBW1i8BCg9G", "cabinet");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    var _helpers = _interopRequireDefault(require("../../helpers.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it;
      if ("undefined" === typeof Symbol || null == o[Symbol.iterator]) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && "number" === typeof o.length) {
          it && (o = it);
          var i = 0;
          return function() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      it = o[Symbol.iterator]();
      return it.next.bind(it);
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if ("string" === typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      (null == len || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _constants$GAMEPLAY = _constants["default"].GAMEPLAY, Z_INDEX = _constants$GAMEPLAY.Z_INDEX, TILE_SIZE = _constants$GAMEPLAY.TILE_SIZE, ITEM_SIZE = _constants$GAMEPLAY.ITEM_SIZE, ITEM_SCALE = _constants$GAMEPLAY.ITEM_SCALE;
    var MASTER_TYPE = {
      milkCabinet: "milkCabinet:bottomLeft",
      milkShelf: "milkShelf:1",
      jamCabinet: "jamCabinet:topLeft"
    };
    var MASTER_RELATIVE_COORDINATES = {
      "milkCabinet:topLeft": {
        x: 0,
        y: 1
      },
      "milkCabinet:topRight": {
        x: -1,
        y: 1
      },
      "milkCabinet:bottomLeft": {
        x: 0,
        y: 0
      },
      "milkCabinet:bottomRight": {
        x: -1,
        y: 0
      },
      "milkShelf:1": {
        x: 0,
        y: 0
      },
      "milkShelf:2": {
        x: -1,
        y: 0
      },
      "milkShelf:3": {
        x: -2,
        y: 0
      },
      "milkShelf:4": {
        x: -3,
        y: 0
      },
      "milkShelf:5": {
        x: -4,
        y: 0
      },
      "milkShelf:6": {
        x: -5,
        y: 0
      },
      "milkShelf:7": {
        x: -6,
        y: 0
      },
      "milkShelf:8": {
        x: -7,
        y: 0
      },
      "milkShelf:9": {
        x: -8,
        y: 0
      },
      "milkShelf:2right": {
        x: -1,
        y: 0
      },
      "milkShelf:3right": {
        x: -2,
        y: 0
      },
      "milkShelf:4right": {
        x: -3,
        y: 0
      },
      "milkShelf:5right": {
        x: -4,
        y: 0
      },
      "milkShelf:6right": {
        x: -5,
        y: 0
      },
      "milkShelf:7right": {
        x: -6,
        y: 0
      },
      "milkShelf:8right": {
        x: -7,
        y: 0
      },
      "milkShelf:9right": {
        x: -8,
        y: 0
      },
      "jamCabinet:topLeft": {
        x: 0,
        y: 0
      },
      "jamCabinet:topRight": {
        x: -1,
        y: 0
      },
      "jamCabinet:bottomLeft": {
        x: 0,
        y: -1
      },
      "jamCabinet:bottomRight": {
        x: -1,
        y: -1
      }
    };
    var cabinet = {
      properties: {
        woodenCabinet: {
          default: null,
          type: cc.SpriteFrame
        },
        milkBottle: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfLeft: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfCenter: {
          default: null,
          type: cc.SpriteFrame
        },
        milkShelfRight: {
          default: null,
          type: cc.SpriteFrame
        },
        jam1: {
          default: null,
          type: cc.SpriteFrame
        },
        jam2: {
          default: null,
          type: cc.SpriteFrame
        },
        jam3: {
          default: null,
          type: cc.SpriteFrame
        },
        jam4: {
          default: null,
          type: cc.SpriteFrame
        },
        jam5: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      preParsePattern: function preParsePattern(gameBoard, pattern) {
        for (var boardY = 0; boardY < gameBoard.height; boardY++) {
          if (0 === boardY) continue;
          for (var boardX = 0; boardX < gameBoard.width; boardX++) {
            var blueprint = pattern[boardY - 1][boardX];
            if (!blueprint) continue;
            if ("milkCabinet" === blueprint) {
              var validRight = "milkCabinet" === pattern[boardY - 1][boardX + 1];
              var validBottom = "milkCabinet" === pattern[boardY - 1 + 1][boardX];
              var validDiagonal = "milkCabinet" === pattern[boardY - 1 + 1][boardX + 1];
              if (!validRight || !validBottom || !validDiagonal) throw new Error("Invalid milkCabinet pattern: must be a 2x2 square");
              pattern[boardY - 1][boardX] = "milkCabinet:topLeft";
              pattern[boardY - 1][boardX + 1] = "milkCabinet:topRight";
              pattern[boardY - 1 + 1][boardX] = "milkCabinet:bottomLeft";
              pattern[boardY - 1 + 1][boardX + 1] = "milkCabinet:bottomRight";
            } else if ("milkShelfLeft" === blueprint) for (var i = 1; i <= 9; i++) {
              var original = pattern[boardY - 1][boardX + i - 1];
              pattern[boardY - 1][boardX + i - 1] = "milkShelf:" + i;
              if ("milkShelfRight" === original) {
                pattern[boardY - 1][boardX + i - 1] += "right";
                break;
              }
            } else if ("string" === typeof blueprint && "jamCabinet" === blueprint.substr(0, 10) && "jamCabinet:" !== blueprint.substr(0, 11)) {
              var _validRight = "jamCabinet" === pattern[boardY - 1][boardX + 1].substr(0, 10);
              var _validBottom = "jamCabinet" === pattern[boardY - 1 + 1][boardX].substr(0, 10);
              var _validDiagonal = "jamCabinet" === pattern[boardY - 1 + 1][boardX + 1].substr(0, 10);
              if (!_validRight || !_validBottom || !_validDiagonal) throw new Error("Invalid jamCabinet pattern: must be a 2x2 square");
              pattern[boardY - 1][boardX] = "jamCabinet:topLeft:" + pattern[boardY - 1][boardX].substr(-1);
              pattern[boardY - 1][boardX + 1] = "jamCabinet:topRight:" + pattern[boardY - 1][boardX + 1].substr(-1);
              pattern[boardY - 1 + 1][boardX] = "jamCabinet:bottomLeft:" + pattern[boardY - 1 + 1][boardX].substr(-1);
              pattern[boardY - 1 + 1][boardX + 1] = "jamCabinet:bottomRight:" + pattern[boardY - 1 + 1][boardX + 1].substr(-1);
            }
          }
        }
      },
      is: function is(type) {
        return !!MASTER_TYPE[type] || !!MASTER_RELATIVE_COORDINATES[type] || "jamCabinet:" === type.substr(0, 11);
      },
      init: function init(that, options) {
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        that.cabinetData = {
          master: null,
          isMaster: null,
          bottles: null,
          gotHitBy: null,
          mainType: null,
          subType: null,
          color: null,
          prevHitResolve: null
        };
        var types = type.split(":");
        that.cabinetData.mainType = types[0];
        that.cabinetData.subType = types[1];
        if ("jamCabinet" === that.cabinetData.mainType) {
          that.cabinetData.color = types[2];
          that.type = type = options.type = types[0] + ":" + types[1];
        }
        that.cabinetData.isMaster = type === MASTER_TYPE[that.cabinetData.mainType];
        if (that.cabinetData.isMaster) {
          that.cabinetData.master = that;
          that.cabinetData.gotHitBy = {};
          that.linkedGamesItems = [ that ];
          if ("milkCabinet" === that.cabinetData.mainType) {
            that._addLayers({
              woodenCabinet: that.woodenCabinet
            });
            that.layers["woodenCabinet"].width = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].height = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].x = ITEM_SIZE / 2 * ITEM_SCALE;
            that.layers["woodenCabinet"].y = ITEM_SIZE / 2 * ITEM_SCALE;
            that.currentLayerId = "woodenCabinet";
            var s = that.milkBottle.getOriginalSize();
            var h = 1.05 * ITEM_SIZE;
            var w = h / s.height * s.width;
            var defaultOptions = {
              spriteFrame: that.milkBottle,
              width: w,
              height: h,
              view: that.gameBoard.view,
              zIndex: Z_INDEX.FLYING_MISSILE
            };
            var vx = that.gameBoard.boardXToViewX(that.boardX) + TILE_SIZE / 2;
            var vy = that.gameBoard.boardYToViewY(that.boardY) + TILE_SIZE / 2;
            var dx = .57 * TILE_SIZE;
            var dy = .48 * TILE_SIZE;
            var tx = .02 * TILE_SIZE;
            var ty = .02 * TILE_SIZE;
            that.cabinetData.bottles = [];
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx - dx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + dx + tx,
              y: vy + dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx - dx + tx,
              y: vy - dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + tx,
              y: vy - dy + ty
            })));
            that.cabinetData.bottles.push(_helpers["default"].createSprite(_extends({}, defaultOptions, {
              x: vx + dx + tx,
              y: vy - dy + ty
            })));
          } else if ("jamCabinet" === that.cabinetData.mainType) {
            that._addLayers({
              woodenCabinet: that.woodenCabinet
            });
            that.layers["woodenCabinet"].width = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].height = 2 * TILE_SIZE;
            that.layers["woodenCabinet"].x = ITEM_SIZE / 2 * ITEM_SCALE;
            that.layers["woodenCabinet"].y = -ITEM_SIZE / 2 * ITEM_SCALE;
            that.currentLayerId = "woodenCabinet";
          }
          for (var childCoordinateIndex in MASTER_RELATIVE_COORDINATES) {
            if (0 !== childCoordinateIndex.indexOf(that.cabinetData.mainType + ":")) continue;
            var x = -MASTER_RELATIVE_COORDINATES[childCoordinateIndex].x;
            var y = -MASTER_RELATIVE_COORDINATES[childCoordinateIndex].y;
            if (0 === x && 0 === y) continue;
            x += that.boardX;
            y += that.boardY;
            var gameItem = that.gameBoard.board[y] && that.gameBoard.board[y][x];
            if (!gameItem) continue;
            if (!gameItem.cabinetData) continue;
            if (gameItem.type !== childCoordinateIndex) continue;
            cabinet.addChildToMaster(that, gameItem);
          }
        } else {
          var _x = that.boardX + MASTER_RELATIVE_COORDINATES[that.type].x;
          var _y = that.boardY + MASTER_RELATIVE_COORDINATES[that.type].y;
          var master = that.gameBoard.board[_y] && that.gameBoard.board[_y][_x];
          if (!master) return;
          if (master.type !== MASTER_TYPE[that.cabinetData.mainType]) throw new Error("A cabinet master does not have the right type);");
          cabinet.addChildToMaster(master, that);
        }
        if ("milkShelf" === that.cabinetData.mainType) {
          if ("milkShelf:1" === type) {
            var _that$_addLayers;
            that._addLayers((_that$_addLayers = {}, _that$_addLayers[type] = that.milkShelfLeft, 
            _that$_addLayers));
          } else if ("right" === type.substr(-5)) {
            var _that$_addLayers2;
            that._addLayers((_that$_addLayers2 = {}, _that$_addLayers2[type] = that.milkShelfRight, 
            _that$_addLayers2));
          } else {
            var _that$_addLayers3;
            that._addLayers((_that$_addLayers3 = {}, _that$_addLayers3[type] = that.milkShelfCenter, 
            _that$_addLayers3));
          }
          that.layers[type].width = TILE_SIZE;
          that.layers[type].height = TILE_SIZE;
          var _master = that.cabinetData.master;
          _master.cabinetData.bottles || (_master.cabinetData.bottles = []);
          var _s = that.milkBottle.getOriginalSize();
          var _h = 1.05 * ITEM_SIZE;
          var _w = _h / _s.height * _s.width;
          _master.cabinetData.bottles.push(_helpers["default"].createSprite({
            spriteFrame: that.milkBottle,
            width: _w,
            height: _h,
            view: that.gameBoard.view,
            zIndex: Z_INDEX.FLYING_MISSILE,
            x: that.gameBoard.boardXToViewX(that.boardX),
            y: that.gameBoard.boardYToViewY(that.boardY)
          }));
        }
        if ("jamCabinet" === that.cabinetData.mainType) {
          var _master2 = that.cabinetData.master;
          _master2.cabinetData.bottles || (_master2.cabinetData.bottles = []);
          var textureName = "jam" + that.cabinetData.color;
          var _s2 = that[textureName].getOriginalSize();
          var _h2 = 1.05 * ITEM_SIZE;
          var _w2 = _h2 / _s2.height * _s2.width;
          var _vx = that.gameBoard.boardXToViewX(that.boardX) + TILE_SIZE / 2;
          var _vy = that.gameBoard.boardYToViewY(that.boardY) + TILE_SIZE / 2;
          var _dx = .57 * TILE_SIZE;
          var _dy = .48 * TILE_SIZE;
          var _tx = .02 * TILE_SIZE;
          var _ty = .02 * TILE_SIZE;
          var bottle = _helpers["default"].createSprite({
            spriteFrame: that[textureName],
            width: _w2,
            height: _h2,
            view: that.gameBoard.view,
            zIndex: Z_INDEX.FLYING_MISSILE,
            x: that.gameBoard.boardXToViewX(that.boardX),
            y: that.gameBoard.boardYToViewY(that.boardY)
          });
          bottle.jamColor = that.cabinetData.color;
          _master2.cabinetData.bottles.push(bottle);
        }
      },
      gotHit: function gotHit(that, reason, resolve) {
        if (!that.cabinetData.isMaster) {
          if (!that.cabinetData.master) {
            console.error("unable to forward a cabinet gotHit to its master");
            return resolve();
          }
          return cabinet.gotHit(that.cabinetData.master, reason, resolve);
        }
        if (that.cabinetData.gotHitBy[reason.uid]) return resolve();
        that.cabinetData.gotHitBy[reason.uid] = true;
        if (that.isDying) return resolve();
        var bottleType = "milkBottle";
        var bottleIndex = null;
        if ("jamCabinet" === that.cabinetData.mainType) {
          var color = reason.type.substr(-1);
          var master = that.cabinetData.master;
          if (0 === reason.type.indexOf("sensitive:")) {
            for (var i = 0; i < master.cabinetData.bottles.length; i++) {
              var _bottle = master.cabinetData.bottles[i];
              if (_bottle.jamColor === color) {
                bottleIndex = i;
                break;
              }
            }
            if (null === bottleIndex) return resolve();
          } else bottleIndex = Math.floor(Math.random() * master.cabinetData.bottles.length);
          bottleType = "jam" + master.cabinetData.bottles[bottleIndex].jamColor;
        }
        null === bottleIndex && (bottleIndex = 0);
        if (that.cabinetData.prevHitResolve) {
          var previousResolve = that.cabinetData.prevHitResolve.resolve;
          that.cabinetData.prevHitResolve = null;
          previousResolve();
        }
        var comboId = Math.random() + "_" + Date.now();
        var resolveCount = 0;
        var subResolve = function subResolve() {
          if (!that.cabinetData.prevHitResolve || that.cabinetData.prevHitResolve.comboId !== comboId) return;
          resolveCount--;
          if (0 === resolveCount) {
            that.cabinetData.prevHitResolve = null;
            resolve();
          }
        };
        that.cabinetData.prevHitResolve = {
          subResolve: subResolve,
          resolve: resolve,
          comboId: comboId
        };
        var bottle = that.cabinetData.bottles.splice(bottleIndex, 1)[0];
        that.lifePoints = that.cabinetData.bottles.length;
        if (that.lifePoints) {
          resolveCount++;
          cabinet.animateMilkBottleDestroy(that.gameBoard, bottle, subResolve);
        } else {
          that.isDying = true;
          for (var _iterator = _createForOfIteratorHelperLoose(that.linkedGamesItems), _step; !(_step = _iterator()).done; ) {
            var child = _step.value;
            if (child === that) continue;
            if (child.isDying) continue;
            child.lifePoints = 0;
            child.isDying = true;
            resolveCount++;
            child._defaultExplode(reason, subResolve);
          }
          cabinet.animateMilkBottleDestroy(that.gameBoard, bottle);
          resolveCount++;
          that._defaultExplode(reason, subResolve);
        }
        that.onDestroyCb && that.onDestroyCb(bottleType);
      },
      addChildToMaster: function addChildToMaster(master, child) {
        child.cabinetData.master = master;
        master.linkedGamesItems.push(child);
        for (var _iterator2 = _createForOfIteratorHelperLoose(master.linkedGamesItems), _step2; !(_step2 = _iterator2()).done; ) {
          var gi = _step2.value;
          if (gi === master) continue;
          gi.linkedGamesItems = master.linkedGamesItems;
        }
      },
      animateMilkBottleDestroy: function animateMilkBottleDestroy(gameBoard, bottle, resolve) {
        gameBoard.movingSprites.push({
          onTick: function onTick(data, dt) {
            data.velocityY -= 17e3 * dt;
            bottle.x += dt * data.velocityX;
            bottle.y += dt * data.velocityY;
            bottle.angle += data.r * dt;
            if (bottle.y < -1024 || bottle.x > 1024 || bottle.x < -1024) {
              bottle.opacity = Math.max(0, bottle.opacity -= 512 * dt);
              if (!bottle.opacity) {
                bottle.parent.removeChild(bottle);
                bottle.destroy();
                _helpers["default"].removeFromArray(data, gameBoard.movingSprites);
                data.resolve && data.resolve();
              }
            }
          },
          velocityX: (700 * Math.random() + 700) * (Math.random() > .5 ? -1 : 1),
          velocityY: 3e3 * Math.random() + 3e3,
          r: (800 * Math.random() + 800) * (Math.random() > .5 ? -1 : 1),
          resolve: resolve
        });
      }
    };
    var _default = cabinet;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants",
    "../../helpers.js": "helpers"
  } ],
  catModels: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "434d1JeWHtFTIsvLaqHTwsK", "catModels");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _userState = _interopRequireDefault(require("../userState"));
    var _cats = _interopRequireDefault(require("../staticData/cats"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var catPool = {};
    function getCat(catID) {
      catPool.catID || (catPool[catID] = new Cat(catID));
      return catPool[catID];
    }
    var Cat = function() {
      function Cat(id) {
        this.data = _userState["default"].getCats()[id];
        this.config = _cats["default"][id];
        this.intimacyCap = this.config.feedLevels[3];
      }
      var _proto = Cat.prototype;
      _proto.getIntimacyLevel = function getIntimacyLevel() {
        var fishes = this.data.fishFed;
        var level = 0;
        for (var i = 1; i <= 3; i++) {
          if (fishes < this.config.feedLevels[i]) return level;
          level = i;
        }
        return 3;
      };
      _proto.isFull = function isFull() {
        return this.data.dailyFed >= this.config.feedablePerDay;
      };
      _proto.isMaxed = function isMaxed() {
        return 3 === this.getIntimacyLevel();
      };
      return Cat;
    }();
    var _default = {
      getCat: getCat
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/cats": "cats",
    "../userState": "userState"
  } ],
  cats: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cbcddRbkZRO5bc8eg13jjFA", "cats");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      bella: {
        name: "Bella",
        playTime: 600,
        feedablePerDay: 100,
        feedLevels: {
          1: 200,
          2: 500,
          3: 900
        }
      },
      milo: {
        name: "Milo",
        playTime: 720,
        feedablePerDay: 100,
        feedLevels: {
          1: 200,
          2: 500,
          3: 900
        }
      },
      dora: {
        name: "Dora",
        playTime: 660,
        feedablePerDay: 100,
        feedLevels: {
          1: 200,
          2: 500,
          3: 900
        }
      },
      lily: {
        name: "Lily",
        playTime: 780,
        feedablePerDay: 150,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        }
      },
      leo: {
        name: "Leo",
        playTime: 660,
        feedablePerDay: 150,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        }
      },
      max: {
        name: "Max",
        feedablePerDay: 150,
        playTime: 540,
        feedLevels: {
          1: 400,
          2: 1e3,
          3: 1800
        }
      },
      luna: {
        name: "Luna",
        playTime: 360,
        feedablePerDay: 200,
        feedLevels: {
          1: 600,
          2: 1500,
          3: 2700
        }
      },
      bob: {
        name: "Bob",
        playTime: 840,
        feedablePerDay: 200,
        feedLevels: {
          1: 600,
          2: 1500,
          3: 2700
        }
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  constants: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9ff9AXm9hFEpdxsArFgTnl", "constants");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var TILE_SIZE = 256;
    var BOOSTER_SIZE = 256;
    var ITEM_SIZE = 200;
    var SLOW_MOTION = 0;
    var ONE_SECOND = 1e3;
    var ONE_MINUTE = 60 * ONE_SECOND;
    var ONE_HOUR = 60 * ONE_MINUTE;
    var ONE_DAY = 24 * ONE_HOUR;
    var TEST_LEVEL = null;
    var SKIP_SELECTION_POPUP = false;
    var FEEDING_ENVIRONMENT = true;
    var DYNAMIC_USER_INTERACTION = true;
    var DEBUG = {
      TEST_LEVEL: TEST_LEVEL,
      SKIP_SELECTION_POPUP: SKIP_SELECTION_POPUP,
      FEEDING_ENVIRONMENT: FEEDING_ENVIRONMENT
    };
    var _default = {
      DEBUG: DEBUG,
      IPAD_RATIO: .75,
      MAX_BOOSTER_SELECTION: 3,
      TIME_SPAN: {
        ONE_SECOND: ONE_SECOND,
        ONE_MINUTE: ONE_MINUTE,
        ONE_HOUR: ONE_HOUR,
        ONE_DAY: ONE_DAY
      },
      GAMEPLAY: {
        TILE_SIZE: TILE_SIZE,
        ITEM_SIZE: ITEM_SIZE,
        DYNAMIC_USER_INTERACTION: DYNAMIC_USER_INTERACTION,
        ITEM_SCALE: TILE_SIZE / ITEM_SIZE * .9,
        BOOSTER_SCALE: 2,
        NO_MOVE_DETECTION_DELAY: 2e3,
        NO_MOVE_FIX_DURATION: 1.5,
        GRAVITY: 9.80665 / 20 * 2 / (50 * SLOW_MOTION + 1),
        LOGIC_UPDATE_INTERVAL: 25,
        ITEM_SWITCH_DURATION: .1 * (10 * SLOW_MOTION + 1),
        ITEM_EXPLODE_DURATION: .03 * (10 * SLOW_MOTION + 1),
        ITEM_TRANSFORM_DURATION: .4 * (10 * SLOW_MOTION + 1),
        ITEMS_GATHERING_DURATION: .2 * (10 * SLOW_MOTION + 1),
        POWERUP_SPAWN_DURATION: .3 * (10 * SLOW_MOTION + 1),
        BOMB_EXPLOSION_DURATION: .4 * (10 * SLOW_MOTION + 1),
        BOMB_RADIUS: 2,
        MISSILE_VELOCITY: 6e3 / (50 * SLOW_MOTION + 1),
        BOOSTER_PROJECTILE_VELOCITY: 3e3 / (50 * SLOW_MOTION + 1),
        DISCOBALL_DELAY_BETWEEN_ITEMS: 75 * (5 * SLOW_MOTION + 1),
        SNIPER_SPEED: 2e3 / (10 * SLOW_MOTION + 1),
        SNIPER_ROTATION_SPEED: 100,
        SNIPER_EXPLOSION_DURATION: 200 * (10 * SLOW_MOTION + 1),
        SNIPER_TAKE_OFF_DURATION: 150 * (10 * SLOW_MOTION + 1),
        DISCO_PULSE_SPEED: 200,
        DISCO_PULSE_SCALE: 5,
        DISCO_GLOW_APPEARANCE_DURATION: 200,
        RAY_OF_LIGHT_SCALE: 1 / 6,
        GROUP_TYPE_PRIORITY: {
          three: 1,
          four_v: 2,
          four_h: 2,
          square: 3,
          cross: 4,
          five: 5
        },
        GROUP_TYPE_POWERUP: {
          four_v: "missiles1",
          four_h: "missiles2",
          square: "sniper",
          cross: "bomb",
          five: "discoball"
        },
        GAME_ITEM_TYPE: {
          basic1: "basic1",
          basic2: "basic2",
          basic3: "basic3",
          basic4: "basic4",
          basic5: "basic5",
          missiles1: "missiles1",
          missiles2: "missiles2",
          discoball: "discoball",
          sniper: "sniper",
          bomb: "bomb"
        },
        ITEM_SHATTER_COLOR: {
          basic1: "red",
          basic2: "yellow",
          basic3: "green",
          basic4: "blue",
          basic5: "purple",
          blocker1a: "purple",
          blocker1b: "purple",
          missiles1: "purple",
          missiles2: "purple",
          discoball: "purple",
          sniper: "purple",
          bomb: "blue"
        },
        Z_INDEX: {
          BACKGROUND: 0,
          UNDERLAY_ITEM1: 1,
          UNDERLAY_ITEM2: 2,
          UNDERLAY_ITEM3: 3,
          UNDERLAY_ITEM4: 4,
          UNDERLAY_ITEM5: 5,
          BLOCKER_ITEM: 6,
          ITEM: 7,
          BORDER: 8,
          FLYING_MISSILE: 9,
          DISCOBALL_ROTATING: 10,
          DISOBALL_RAY_OF_LIGHT: 11,
          FLYING_SNIPER: 12,
          ITEM_SHATTER: 13,
          EXPLODING_BOMB: 14,
          BOOSTER_PROJECTILE: 15
        },
        SPINE_NAMES: {
          rocketSkinRight: "Rocket_Right",
          rocketSkinLeft: "Rocket_Left",
          rocketSkinUp: "Rocket_Up",
          rocketSkinDown: "Rocket_Down"
        }
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  development: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0a38deU6XNDLInbRruXSMO0", "development");
    "use strict";
    exports.__esModule = true;
    exports.levelsOrder = exports["default"] = void 0;
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var O = _types["default"].O, r = _types["default"].r, y = _types["default"].y, g = _types["default"].g, b = _types["default"].b, p = _types["default"].p, R = _types["default"].R, A = _types["default"].A, B = _types["default"].B, D = _types["default"].D, M = _types["default"].M, m = _types["default"].m, s = _types["default"].s, x = _types["default"].x, X = _types["default"].X, z = _types["default"].z, a = _types["default"].a, c = _types["default"].c, d = _types["default"].d, e = _types["default"].e, f = _types["default"].f, h = _types["default"].h, i = _types["default"].i, j = _types["default"].j, k = _types["default"].k, l = _types["default"].l, n = _types["default"].n, o = _types["default"].o, q = _types["default"].q, u = _types["default"].u, v = _types["default"].v, w = _types["default"].w, C = _types["default"].C, E = _types["default"].E, F = _types["default"].F, G = _types["default"].G, H = _types["default"].H, t = _types["default"].t, I = _types["default"].I, J = _types["default"].J, K = _types["default"].K, L = _types["default"].L, N = _types["default"].N, P = _types["default"].P, Q = _types["default"].Q, S = _types["default"].S, \u00d2 = _types["default"].\u00d2, \u00d3 = _types["default"].\u00d3, \u00d4 = _types["default"].\u00d4, \u00d5 = _types["default"].\u00d5, \u00d6 = _types["default"].\u00d6;
    var levelsOrder = [ "d14", "d15", "d16", "d17", "d18", "d19", "d20" ];
    exports.levelsOrder = levelsOrder;
    var levels = {
      d1: {
        objectives: [ {
          type: x,
          amount: 15
        }, {
          type: t,
          amount: 9
        } ],
        rewards: {
          supply: "bed"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, z, R, R, R, R, R, z, O ], [ z, z, R, R, R, R, R, z, z ], [ R, R, R, R, R, R, R, R, R ], [ O, R, R, R, z, R, R, R, O ], [ O, R, R, R, R, R, R, R, O ], [ R, R, R, R, R, R, R, R, R ], [ R, R, z, z, R, z, z, R, R ], [ t, t, t, t, t, t, t, t, t ], [ O, R, z, z, R, z, z, R, O ] ]
      },
      d2: {
        objectives: [ {
          type: x,
          amount: 42
        } ],
        rewards: {
          supply: "swing"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, O, O, O, z, z, z ], [ z, z, z, z, z, z, z, z, z ], [ z, z, z, z, z, z, z, z, z ] ]
      },
      d3: {
        objectives: [ {
          type: B,
          amount: 10
        }, {
          type: s,
          amount: 10
        }, {
          type: D,
          amount: 5
        } ],
        rewards: {
          supply: "tent"
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ], [ R, R, R, R, R, R, R, R, R ] ]
      },
      d4: {
        objectives: [ {
          type: b,
          amount: 40
        }, {
          type: y,
          amount: 40
        } ],
        rewards: {
          supply: "pot"
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, y, g, b, y, b, g, y, r ], [ y, g, b, y, g, y, b, r, g ], [ g, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, g, r, b, r ], [ b, y, b, g, g, r, g, y, g ], [ r, r, y, g, y, b, y, r, r ], [ g, y, g, b, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ], [ r, y, r, b, r, r, y, g, b ] ]
      },
      d5: {
        objectives: [ {
          type: p,
          amount: 8
        }, {
          type: r,
          amount: 20
        } ],
        rewards: {
          supply: "cushionBlue"
        },
        turns: 22,
        spawnPattern: [ p, p, R, R, R, R, R, p, p ],
        pattern: [ [ p, p, O, O, O, O, O, p, p ], [ p, O, O, O, O, O, O, O, p ], [ O, O, g, b, r, r, b, O, O ], [ O, O, b, y, y, g, y, O, O ], [ O, O, b, b, s, r, b, O, O ], [ O, O, r, y, r, y, g, O, O ], [ O, O, r, r, g, b, b, O, O ], [ p, O, O, O, O, O, O, O, p ], [ p, p, O, O, O, O, O, p, p ] ]
      },
      d14: {
        isDebug: true,
        objectives: [ {
          type: a,
          amount: 9
        }, {
          type: i,
          amount: 9
        }, {
          type: l,
          amount: 9
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ a, e, q, b, r, y, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, b, r, D, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, D, r, y, l, i, x ], [ c, f, u, y, g, b, n, j, X ], [ c, f, u, b, r, y, n, j, X ], [ d, h, v, y, g, b, o, k, z ], [ d, h, v, b, r, y, o, k, z ] ]
      },
      d15: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 15
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, g, b, y, b, g, O, O ], [ O, g, b, y, g, y, b, r, O ], [ C, g, y, b, r, g, y, g, C ], [ C, b, y, r, y, g, r, b, C ], [ C, y, b, g, g, r, g, y, C ], [ C, C, C, C, C, C, C, C, C ], [ g, y, g, b, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ] ]
      },
      d16: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 9
        }, {
          type: E,
          amount: 63
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ b, y, g, b, y, y, g, y, b ], [ g, g, b, g, y, b, y, y, g ], [ C, C, C, C, C, C, C, C, C ], [ y, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, m, r, b, b ], [ b, y, b, g, M, r, g, y, g ], [ b, y, g, b, y, b, g, y, b ], [ g, g, b, y, B, y, B, r, g ], [ M, g, y, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ] ]
      },
      d17: {
        isDebug: true,
        objectives: [ {
          type: G,
          amount: 100
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ G, y, g, b, y, s, g, y, G ], [ G, g, b, y, g, y, b, y, G ], [ G, g, y, b, r, g, y, g, G ], [ r, b, y, m, y, g, r, b, r ], [ g, y, b, m, g, s, g, y, g ], [ r, b, y, m, y, g, r, b, r ], [ g, y, g, m, r, y, b, r, b ], [ b, b, g, y, b, g, y, g, y ], [ G, G, G, G, G, G, G, G, G ] ]
      },
      d18: {
        isDebug: true,
        objectives: [ {
          type: y,
          amount: 20
        }, {
          type: I,
          amount: 24
        }, {
          type: x,
          amount: 1
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, y, b ], [ g, g, y, b, x, g, y, g, y ], [ r, b, y, r, y, g, r, b, r ], [ g, H, H, g, b, y, b, y, g ], [ r, H, H, b, y, y, b, y, y ], [ g, H, H, b, H, H, H, H, b ], [ b, H, H, g, H, H, H, H, y ], [ g, g, y, b, r, g, y, g, y ] ]
      },
      d19: {
        isDebug: true,
        objectives: [ {
          type: \u00d2,
          amount: 5
        }, {
          type: \u00d3,
          amount: 5
        }, {
          type: \u00d4,
          amount: 5
        }, {
          type: \u00d5,
          amount: 5
        }, {
          type: \u00d6,
          amount: 4
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, g, b ], [ y, y, g, b, y, b, g, y, g ], [ r, N, N, r, b, g, Q, Q, r ], [ y, N, N, b, y, y, Q, Q, g ], [ b, L, P, y, g, y, L, L, b ], [ b, L, P, y, g, b, P, P, b ], [ g, N, Q, b, x, g, S, S, y ], [ g, P, L, b, r, g, S, S, y ] ]
      },
      d20: {
        isDebug: true,
        objectives: [ {
          type: I,
          amount: 21
        }, {
          type: E,
          amount: 13
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, y, g, y, g ], [ b, g, b, y, g, y, b, y, b ], [ g, J, K, J, J, J, K, g, y ], [ r, b, y, r, y, g, r, b, r ], [ g, J, J, J, J, J, J, K, g ], [ y, J, K, b, y, H, H, y, g ], [ b, g, b, y, g, H, H, y, b ], [ g, b, g, b, b, g, y, g, y ], [ g, b, g, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, F, F, F, F, F, F, F, O ], [ O, F, F, O, O, F, F, O, O ], [ O, O, O, O, O, F, F, O, O ], [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ] ]
      },
      d999991: {
        isDebug: true,
        objectives: [ {
          type: a,
          amount: 9
        }, {
          type: i,
          amount: 9
        }, {
          type: l,
          amount: 9
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A, A, A, A ],
        pattern: [ [ a, e, q, b, r, y, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, b, r, D, l, i, x ], [ a, e, q, y, g, b, l, i, x ], [ a, e, q, D, r, y, l, i, x ], [ c, f, u, y, g, b, n, j, X ], [ c, f, u, b, r, y, n, j, X ], [ d, h, v, y, g, b, o, k, z ], [ d, h, v, b, r, y, o, k, z ] ]
      },
      d999992: {
        isDebug: true,
        objectives: [ {
          type: r,
          amount: 9999
        }, {
          type: y,
          amount: 9999
        }, {
          type: g,
          amount: 9999
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A ],
        pattern: [ [ A, A, A, A, A, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, z, z, z, z, A ], [ A, A, A, A, A, A ] ]
      },
      d999993: {
        isDebug: true,
        objectives: [ {
          type: r,
          amount: 9999
        }, {
          type: y,
          amount: 9999
        }, {
          type: g,
          amount: 9999
        } ],
        turns: 999,
        spawnPattern: [ A, A, A, A, A, A ],
        pattern: [ [ A, A, A, A, A, A ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ], [ z, z, z, z, z, z ] ]
      },
      d999994: {
        isDebug: true,
        objectives: [ {
          type: w,
          amount: 9
        }, {
          type: E,
          amount: 63
        } ],
        turns: 35,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ b, y, g, b, y, y, g, y, b ], [ g, g, b, g, y, b, y, y, g ], [ C, C, C, C, C, C, C, C, C ], [ y, g, y, b, r, g, y, g, y ], [ r, b, y, r, y, m, r, b, b ], [ b, y, b, g, M, r, g, y, g ], [ b, y, g, b, y, b, g, y, b ], [ g, g, b, y, B, y, B, r, g ], [ M, g, y, b, r, g, y, g, y ] ],
        underlayPattern: [ [ O, O, O, O, O, O, O, O, O ], [ O, O, O, O, O, O, O, O, O ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ], [ F, F, F, F, F, F, F, F, F ] ]
      },
      d999995: {
        isDebug: true,
        objectives: [ {
          type: g,
          amount: 500
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, r, g, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ], [ g, y, g, b, y, r, g, y, g ], [ g, C, C, C, C, C, C, C, b ], [ r, r, r, b, r, b, g, g, g ], [ y, y, g, b, y, r, M, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ] ]
      },
      d999990: {
        isDebug: true,
        objectives: [ {
          type: g,
          amount: 500
        } ],
        turns: 999,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ y, y, g, b, y, r, g, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ], [ g, y, g, b, y, r, g, y, g ], [ g, C, C, C, C, C, C, C, b ], [ r, r, r, b, r, b, g, g, g ], [ y, y, g, b, y, r, M, y, g ], [ b, g, r, y, g, y, b, r, b ], [ r, r, g, b, r, b, g, y, g ] ]
      }
    };
    var _default = levels;
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./types.js": "types"
  } ],
  helpers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b60edYhHv5Jr7wV/brGUH7+", "helpers");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("./constants"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var TIME_SPAN = _constants["default"].TIME_SPAN;
    var _default = {
      removeFromArray: function removeFromArray(element, array) {
        var index = array.indexOf(element);
        -1 === index && console.error("removeFromArray: element is not part of array", element, array);
        array.splice(index, 1);
      },
      getAngleFromVector: function getAngleFromVector(x, y) {
        var angle = Math.atan2(-y, x);
        var degrees = 180 * angle / Math.PI;
        return (450 + Math.round(degrees)) % 360;
      },
      getVectorFromAngleAndLength: function getVectorFromAngleAndLength(angle, length) {
        angle = angle * Math.PI / 180;
        return {
          x: length * Math.sin(angle),
          y: length * Math.cos(angle)
        };
      },
      createSprite: function createSprite(options) {
        var spriteFrame = options.spriteFrame, view = options.view, width = options.width, height = options.height, scale = options.scale, x = options.x, y = options.y, zIndex = options.zIndex, angle = options.angle;
        var node = new cc.Node();
        var spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        void 0 !== view && view.addChild(node);
        void 0 !== zIndex && (node.zIndex = zIndex);
        void 0 !== width && (node.width = width);
        void 0 !== height && (node.height = height);
        void 0 !== scale && (node.scale = scale);
        void 0 !== x && (node.x = x);
        void 0 !== y && (node.y = y);
        void 0 !== angle && (node.angle = angle);
        return node;
      },
      shuffleArray: function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var _ref = [ array[j], array[i] ];
          array[i] = _ref[0];
          array[j] = _ref[1];
        }
      },
      generatePatternWithoutMatch: function generatePatternWithoutMatch(width, height) {
        var board = [];
        for (var y = 0; y < height; y++) {
          board[y] = [];
          for (var x = 0; x < height; x++) {
            var candidates = {
              r: true,
              y: true,
              g: true,
              b: true
            };
            x > 1 && board[y][x - 2] === board[y][x - 1] && delete candidates[board[y][x - 2]];
            y > 1 && board[y - 2][x] === board[y - 2][x] && delete candidates[board[y - 2][x]];
            var pool = Object.keys(candidates);
            var color = pool[Math.floor(Math.random() * pool.length)];
            board[y][x] = color;
          }
        }
        return board;
      },
      lerp: function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
      },
      deepCopy: function deepCopy(object) {
        try {
          return JSON.parse(JSON.stringify(object));
        } catch (error) {
          console.error("Unable to deep copy item", object, error);
          return null;
        }
      },
      formatTimeString: function formatTimeString(timestamp) {
        var hour = Math.floor(timestamp / TIME_SPAN.ONE_HOUR);
        var timeRemaining = timestamp - hour * TIME_SPAN.ONE_HOUR;
        var minute = Math.floor(timeRemaining / TIME_SPAN.ONE_MINUTE);
        timeRemaining = timestamp - minute * TIME_SPAN.ONE_MINUTE;
        var second = Math.floor(timeRemaining / TIME_SPAN.ONE_SECOND);
        var zeroPad = function zeroPad(num) {
          return String(num).padStart(2, "0");
        };
        return zeroPad(hour) + ":" + zeroPad(minute) + ":" + zeroPad(second);
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./constants": "constants"
  } ],
  levelModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14851boWtxHeookXTtppg2M", "levelModel");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _levels = _interopRequireWildcard(require("../staticData/levels/levels"));
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _data;
    function getLevel(levelID) {
      _data = _data || {};
      _data[levelID] = _data[levelID] || parseLevel(levelID, _levels["default"][levelID]);
      return _data[levelID];
    }
    function getLevelMap() {
      return _levels.levelsOrder;
    }
    function hasNextLevel(levelId) {
      var map = getLevelMap();
      var mappedId = map.indexOf(levelId);
      return mappedId >= 0 && mappedId < map.length - 1;
    }
    function parseLevel(levelID, rawLevelData) {
      if (!rawLevelData) return null;
      var data = _extends({}, rawLevelData, {
        id: levelID
      });
      patchPattern(data);
      return data;
    }
    function patchPattern(levelData) {
      var maxPatternLength = Math.max.apply(Math, levelData.pattern.map(function(pl) {
        return pl.length;
      }));
      while (levelData.spawnPattern.length < maxPatternLength) levelData.spawnPattern.push([ "basic1", "basic2", "basic3", "basic4" ]);
    }
    var _default = {
      getLevel: getLevel,
      getLevelMap: getLevelMap,
      hasNextLevel: hasNextLevel
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/levels/levels": "levels"
  } ],
  levels: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e14e8nGZn5OSbJDuo5kV6Sr", "levels");
    "use strict";
    exports.__esModule = true;
    exports.levelsOrder = exports["default"] = void 0;
    var _main = _interopRequireWildcard(require("./main.js"));
    var _development = _interopRequireWildcard(require("./development.js"));
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _getRequireWildcardCache() {
      if ("function" !== typeof WeakMap) return null;
      var cache = new WeakMap();
      _getRequireWildcardCache = function _getRequireWildcardCache() {
        return cache;
      };
      return cache;
    }
    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) return obj;
      if (null === obj || "object" !== typeof obj && "function" !== typeof obj) return {
        default: obj
      };
      var cache = _getRequireWildcardCache();
      if (cache && cache.has(obj)) return cache.get(obj);
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        desc && (desc.get || desc.set) ? Object.defineProperty(newObj, key, desc) : newObj[key] = obj[key];
      }
      newObj["default"] = obj;
      cache && cache.set(obj, newObj);
      return newObj;
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var levelsOrder = [].concat(_main.levelsOrder, _development.levelsOrder);
    exports.levelsOrder = levelsOrder;
    var _default = _extends({}, _main["default"], _development["default"]);
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./development.js": "development",
    "./main.js": "main",
    "./types.js": "types"
  } ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e97aiUaPNNZLM6thB+34SV", "main");
    "use strict";
    exports.__esModule = true;
    exports.levelsOrder = exports["default"] = void 0;
    var _types = _interopRequireDefault(require("./types.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var O = _types["default"].O, r = _types["default"].r, y = _types["default"].y, g = _types["default"].g, b = _types["default"].b, p = _types["default"].p, R = _types["default"].R, A = _types["default"].A, B = _types["default"].B, D = _types["default"].D, M = _types["default"].M, m = _types["default"].m, s = _types["default"].s, x = _types["default"].x, X = _types["default"].X, z = _types["default"].z, a = _types["default"].a, c = _types["default"].c, d = _types["default"].d, e = _types["default"].e, f = _types["default"].f, h = _types["default"].h, i = _types["default"].i, j = _types["default"].j, k = _types["default"].k, l = _types["default"].l, n = _types["default"].n, o = _types["default"].o, q = _types["default"].q, u = _types["default"].u, v = _types["default"].v, w = _types["default"].w, C = _types["default"].C, E = _types["default"].E, F = _types["default"].F, G = _types["default"].G, H = _types["default"].H, t = _types["default"].t, I = _types["default"].I, J = _types["default"].J, K = _types["default"].K, L = _types["default"].L, N = _types["default"].N, P = _types["default"].P, Q = _types["default"].Q, S = _types["default"].S, \u00d2 = _types["default"].\u00d2, \u00d3 = _types["default"].\u00d3, \u00d4 = _types["default"].\u00d4, \u00d5 = _types["default"].\u00d5, \u00d6 = _types["default"].\u00d6;
    var levelsOrder = [ "t1", "t2", "t3", "t4", "t5", "1", "2", "3", "4", "5", "6", "7", "8" ];
    exports.levelsOrder = levelsOrder;
    var levels = {
      t1: {
        objectives: [ {
          type: y,
          amount: 15
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R ],
        pattern: [ [ y, r, y, r, b, g, r ], [ r, y, g, b, y, g, b ], [ r, b, r, y, g, r, y ], [ g, r, b, y, g, y, r ], [ y, g, r, g, r, b, g ], [ b, y, b, r, b, g, y ], [ y, b, g, y, y, r, r ] ]
      },
      t2: {
        objectives: [ {
          type: b,
          amount: 18
        }, {
          type: r,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 20,
        spawnPattern: [ R, R, {
          sequence: [ b, g, r, y, r, b, g, y, b, R ]
        }, R, {
          sequence: [ r, R ]
        }, {
          sequence: [ y, R ]
        }, {
          sequence: [ y, b, g, R ]
        }, R ],
        pattern: [ [ y, r, y, y, b, r, r, y ], [ r, g, g, r, r, g, b, g ], [ g, y, b, y, g, b, g, r ], [ y, r, y, g, y, y, r, g ], [ g, b, r, b, r, g, g, b ], [ g, y, b, g, y, b, g, y ], [ b, g, r, b, g, y, y, b ], [ b, r, b, y, b, r, g, y ] ]
      },
      t3: {
        objectives: [ {
          type: y,
          amount: 30
        }, {
          type: b,
          amount: 20
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 20,
        spawnPattern: [ R, R, {
          sequence: [ y, g, g, y, b, R ]
        }, {
          sequence: [ b, r, b, r, b, y, R ]
        }, {
          sequence: [ r, b, r, y, b, r, g, y, R ]
        }, {
          sequence: [ g, r, r, y, r, y, g, b, g, g, R ]
        }, {
          sequence: [ b, r, y, r, g, r, g, R ]
        }, R, R ],
        pattern: [ [ y, g, g, r, b, g, g, y, g ], [ r, b, g, r, y, r, b, r, b ], [ b, y, r, g, b, g, y, b, r ], [ y, b, b, y, r, g, y, b, y ], [ g, r, b, g, g, r, g, r, b ], [ y, y, g, r, r, y, r, y, y ], [ b, r, g, g, y, g, b, g, b ], [ g, b, b, r, b, y, g, y, r ], [ y, r, y, b, g, g, r, b, b ] ]
      },
      t4: {
        objectives: [ {
          type: p,
          amount: 5
        }, {
          type: g,
          amount: 15
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 20,
        spawnPattern: [ p, p, R, {
          sequence: [ r, g, r, R ]
        }, {
          sequence: [ y, g, y, R ]
        }, {
          sequence: [ r, g, R ]
        }, R, p, p ],
        pattern: [ [ p, p, O, O, O, O, O, p, p ], [ p, O, O, O, O, O, O, O, p ], [ O, O, y, b, r, r, b, O, O ], [ O, O, b, y, g, y, r, O, O ], [ O, O, b, y, y, g, b, O, O ], [ O, O, r, b, g, y, r, O, O ], [ O, O, r, r, g, g, b, O, O ], [ p, O, O, O, O, O, O, O, p ], [ p, p, O, O, O, O, O, p, p ] ]
      },
      t5: {
        objectives: [ {
          type: r,
          amount: 60
        }, {
          type: b,
          amount: 30
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, r, b, r, y, y, O, O ], [ O, r, g, y, y, g, r, b, O ], [ r, b, r, b, r, g, y, g, y ], [ b, y, g, r, y, b, g, r, b ], [ y, r, y, y, g, y, y, r, y ], [ r, g, r, r, g, r, g, y, b ], [ b, g, b, y, r, y, r, b, g ], [ O, y, y, g, b, y, r, y, O ], [ O, O, b, y, g, r, b, O, O ] ]
      },
      1: {
        objectives: [ {
          type: x,
          amount: 35
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ g, b, g, b, r, r, O, O, O ], [ g, r, r, g, b, b, O, O, O ], [ r, g, b, r, r, g, O, O, O ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ], [ O, O, O, y, b, g, b, r, x ], [ O, O, O, y, g, r, g, r, x ], [ O, O, O, x, x, x, x, x, x ] ]
      },
      2: {
        objectives: [ {
          type: t,
          amount: 44
        }, {
          type: x,
          amount: 36
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, B, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ], [ X, X, t, t, t, t, t, X, X ] ]
      },
      3: {
        objectives: [ {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 25,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ z, r, b, y, g, r, y, r, z ], [ z, y, y, r, O, y, b, y, z ], [ z, g, y, b, O, y, b, y, z ], [ z, r, b, b, O, g, r, g, z ], [ z, r, r, g, O, r, b, b, z ], [ z, g, y, g, O, y, g, y, z ], [ z, b, r, r, O, b, g, r, z ], [ z, r, b, b, O, b, r, r, z ], [ z, r, g, b, O, y, r, y, z ] ]
      },
      4: {
        objectives: [ {
          type: t,
          amount: 27
        }, {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 22,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, b, r, X, X, X, y, g, y ], [ b, r, r, X, X, X, g, y, b ], [ y, s, b, X, X, X, g, s, y ], [ r, y, r, X, X, X, r, b, r ], [ O, O, O, X, X, X, O, O, O ], [ O, O, O, X, X, X, O, O, O ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ], [ t, t, t, t, t, t, t, t, t ] ]
      },
      5: {
        objectives: [ {
          type: t,
          amount: 8
        }, {
          type: x,
          amount: 9
        } ],
        rewards: {
          star: 1,
          coin: 100
        },
        turns: 15,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, O, O, t, O, O, O, O ], [ O, O, O, y, t, y, O, O, O ], [ O, O, g, g, t, b, b, O, O ], [ O, y, r, g, t, b, r, r, O ], [ z, b, g, r, t, y, b, r, z ], [ O, z, g, g, t, r, b, z, O ], [ O, O, z, g, t, b, z, O, O ], [ O, O, O, z, t, z, O, O, O ], [ O, O, O, O, z, O, O, O, O ] ]
      },
      6: {
        objectives: [ {
          type: t,
          amount: 10
        }, {
          type: x,
          amount: 18
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ r, y, g, b, O, b, g, y, r ], [ y, g, b, y, O, y, b, r, g ], [ t, y, g, g, O, b, b, y, t ], [ t, y, r, g, O, b, r, r, t ], [ t, b, g, r, t, y, b, r, t ], [ t, b, g, g, t, r, b, y, t ], [ O, O, O, O, O, O, O, O, O ], [ x, x, x, x, x, x, x, x, x ], [ x, x, x, x, x, x, x, x, x ] ]
      },
      7: {
        objectives: [ {
          type: x,
          amount: 32
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 30,
        spawnPattern: [ R, R, R, R, R, R, R, R ],
        pattern: [ [ y, r, g, b, X, X, X, X ], [ b, y, y, b, X, X, X, X ], [ g, r, b, r, X, X, X, X ], [ y, b, r, y, X, X, X, X ], [ z, z, z, z, r, r, b, r ], [ z, z, z, z, y, b, y, b ], [ z, z, z, z, g, y, g, y ], [ z, z, z, z, b, g, y, y ] ]
      },
      8: {
        objectives: [ {
          type: t,
          amount: 6
        }, {
          type: x,
          amount: 12
        } ],
        rewards: {
          star: 2,
          coin: 120
        },
        turns: 20,
        spawnPattern: [ R, R, R, R, R, R, R, R, R ],
        pattern: [ [ O, O, X, O, t, O, X, O, O ], [ O, O, X, O, t, O, X, O, O ], [ O, r, X, g, t, b, X, g, O ], [ O, y, X, g, t, b, X, r, O ], [ O, b, X, r, t, y, X, r, O ], [ O, g, X, g, t, r, X, b, O ], [ O, O, O, O, O, O, O, O, O ], [ y, r, y, r, r, y, b, r, b ], [ O, b, r, g, g, b, r, b, O ] ]
      }
    };
    var _default = levels;
    exports["default"] = _default;
    cc._RF.pop();
  }, {
    "./types.js": "types"
  } ],
  shop: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5d3etgZOlFU7ShfHXc6QKS", "shop");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _boosters = _interopRequireDefault(require("./boosters"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var _default = {
      fish: {
        name: "Fish",
        quantity: 1,
        price: 1,
        description: "A single fish"
      },
      fish5: {
        name: "Fish x5",
        quantity: 5,
        price: 5,
        description: "A pack of fish"
      },
      fish10: {
        name: "Fish x10",
        quantity: 10,
        price: 10,
        description: "A plenty of fish"
      },
      hammer: {
        name: _boosters["default"].hammer.name,
        quantity: 1,
        price: 50,
        description: _boosters["default"].hammer.description
      },
      airplane: {
        name: _boosters["default"].airplane.name,
        quantity: 1,
        price: 50,
        description: _boosters["default"].airplane.description
      },
      rocket: {
        name: _boosters["default"].rocket.name,
        quantity: 1,
        price: 50,
        description: _boosters["default"].rocket.description
      },
      fairystick: {
        name: _boosters["default"].fairystick.name,
        quantity: 1,
        price: 150,
        description: _boosters["default"].fairystick.description
      },
      paintbrush: {
        name: _boosters["default"].paintbrush.name,
        quantity: 1,
        price: 180,
        description: _boosters["default"].paintbrush.description
      },
      wheel: {
        name: _boosters["default"].wheel.name,
        quantity: 1,
        price: 240,
        description: _boosters["default"].wheel.description
      }
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./boosters": "boosters"
  } ],
  simpleCrate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa738Oak3FPYJNDVjkJX82x", "simpleCrate");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Z_INDEX = _constants["default"].GAMEPLAY.Z_INDEX;
    var SHAKE_DURATION = 300;
    var COLOR_SENSITIVITY = {
      Red: ":basic1",
      Yellow: ":basic2",
      Green: ":basic3",
      Blue: ":basic4",
      Purple: ":basic5",
      Brick: null
    };
    var simpleCrate = {
      properties: {
        crateBrown1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrown3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateRed3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateYellow3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateGreen3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue2: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBlue3: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple1: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple2: {
          default: null,
          type: cc.SpriteFrame
        },
        cratePurple3: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick1: {
          default: null,
          type: cc.SpriteFrame
        },
        crateBrick2: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      is: function is(type) {
        return "crateBrown1" === type || "crateBrown2" === type || "crateBrown3" === type || "crateRed1" === type || "crateRed2" === type || "crateRed3" === type || "crateYellow1" === type || "crateYellow2" === type || "crateYellow3" === type || "crateGreen1" === type || "crateGreen2" === type || "crateGreen3" === type || "crateBlue1" === type || "crateBlue2" === type || "crateBlue3" === type || "cratePurple1" === type || "cratePurple2" === type || "cratePurple3" === type || "crateBrick1" === type || "crateBrick2" === type;
      },
      init: function init(that, options) {
        that.isBlockingCascade = true;
        that.isSensitive = true;
        that.node.zIndex = Z_INDEX.BLOCKER_ITEM;
        var type = options.type;
        var color = type.substring(5, type.length - 1);
        that.simpleCrateData = {
          color: color
        };
        switch (type) {
         case "crate" + color + "1":
          that._addLayers({
            1: that["crate" + color + "1"]
          });
          that.currentLayerId = "1";
          break;

         case "crate" + color + "2":
          that.lifePoints = 2;
          that._addLayers({
            1: that["crate" + color + "1"],
            2: that["crate" + color + "2"]
          });
          that.layers["1"].active = false;
          that.currentLayerId = "2";
          break;

         case "crate" + color + "3":
          that.lifePoints = 3;
          that._addLayers({
            1: that["crate" + color + "1"],
            2: that["crate" + color + "2"],
            3: that["crate" + color + "3"]
          });
          that.layers["1"].active = false;
          that.layers["2"].active = false;
          that.currentLayerId = "3";
        }
      },
      gotHit: function gotHit(that, reason, resolve) {
        var color = that.simpleCrateData.color;
        if (void 0 !== COLOR_SENSITIVITY[color] && "sensitive:" === reason.type.slice(0, 10) && reason.type.slice(-7) !== COLOR_SENSITIVITY[color]) return resolve();
        that.onUpdate && that.onUpdate.shaking && that.onUpdate.shaking.data.resolve();
        that.lifePoints--;
        that._checkLifePoints();
        if (0 === that.lifePoints) return that._defaultExplode(reason, resolve);
        that.type = "crate" + color + that.lifePoints;
        that.currentLayerId = that.lifePoints;
        that.layers[that.currentLayerId].active = true;
        that.onUpdate || (that.onUpdate = {});
        that.onUpdate.shaking = {
          data: {
            shakeUntil: that.app.now + SHAKE_DURATION,
            resolve: function resolve() {
              that.node.angle = 0;
              var hp = that.lifePoints;
              that.layers[hp].x = that.layers[hp + 1].x = 0;
              that.layers[hp].y = that.layers[hp + 1].y = 0;
              that.layers[hp + 1].destroy();
              delete that.layers[hp + 1];
              delete that.onUpdate.shaking;
              that._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (that.app.now >= data.shakeUntil) return data.resolve();
            var hp = that.lifePoints;
            that.node.angle = 7 * that.app.noise.noise2D(that.app.now / 100, 10 * that.uid);
            that.layers[hp + 1].x = that.layers[hp].x = 7 * that.app.noise.noise2D(that.app.now / 100, 20 * that.uid);
            that.layers[hp + 1].y = that.layers[hp].y = 7 * that.app.noise.noise2D(that.app.now / 100, 30 * that.uid);
            that.layers[hp + 1].opacity = (data.shakeUntil - that.app.now) / SHAKE_DURATION * 256;
          }
        };
        resolve();
      }
    };
    var _default = simpleCrate;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants"
  } ],
  spinner: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85526iF82RACoOXl7Iqvj1Z", "spinner");
    "use strict";
    var SPEED = 50;
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.spinnerSprite = this.node.getChildByName("icon");
      },
      start: function start() {},
      update: function update(dt) {
        this.spinnerSprite.angle -= dt * SPEED;
      }
    });
    cc._RF.pop();
  }, {} ],
  supplyModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "075cezDWiNKQ4WaqOv7yR66", "supplyModel");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _yard = _interopRequireDefault(require("../staticData/yard"));
    var _userState = _interopRequireDefault(require("../userState"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var _starData;
    function getStarData() {
      if (_starData) return _starData;
      _starData = {
        nextItem: null,
        items: [],
        star: _userState["default"].getStar()
      };
      for (var key in _yard["default"].items) {
        var item = _yard["default"].items[key];
        if (_starData.star < item.star) {
          _starData.nextItem = key;
          break;
        }
        _starData.star -= item.star;
        _starData.items.includes(key) || _starData.items.push(key);
      }
      return _starData;
    }
    function updateStarData() {
      _starData = null;
      getStarData();
    }
    function addStar(value) {
      var oldData = _extends({}, getStarData());
      _userState["default"].updateStar(value);
      updateStarData();
      var unlockedItems = _starData.items.filter(function(item) {
        return oldData.items.indexOf(item) < 0;
      });
      var catData = _userState["default"].getCats();
      var unlockedCats = [];
      unlockedItems.forEach(function(item) {
        var _yardConfig$items$ite;
        var itemUnlockedCats = (null == (_yardConfig$items$ite = _yard["default"].items[item]) ? void 0 : _yardConfig$items$ite.unlock) || [];
        itemUnlockedCats.forEach(function(cat) {
          unlockedCats.push(cat);
          catData[cat].unlocked = true;
        });
      });
      unlockedCats.length && _userState["default"].saveCats();
      return {
        items: unlockedItems,
        cats: unlockedCats
      };
    }
    var _default = {
      getStarData: getStarData,
      updateStarData: updateStarData,
      addStar: addStar
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../staticData/yard": "yard",
    "../userState": "userState"
  } ],
  tutorials: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "199a1JrxjdM/JavlPlJf1px", "tutorials");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _default = {
      t1: [ {
        type: "swap",
        mask: {
          vertical: {
            x: 3,
            y: 2,
            size: 3
          },
          horizontal: {
            x: 3,
            y: 2,
            size: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 2
          },
          to: {
            x: 4,
            y: 2
          }
        },
        label: {
          text: "Match 3 same colored items to collect them!",
          y: 1e3
        }
      }, {
        type: "objective"
      } ],
      t2: [ {
        type: "swap",
        mask: {
          vertical: {
            x: 3,
            y: 3,
            size: 2
          },
          horizontal: {
            x: 2,
            y: 4,
            size: 4
          }
        },
        move: {
          from: {
            x: 3,
            y: 3
          },
          to: {
            x: 3,
            y: 4
          }
        },
        label: {
          text: "Match 4 same colored items to create a ROCKET!",
          y: 800
        }
      }, {
        type: "swap",
        mask: {
          horizontal: {
            x: 2,
            y: 4,
            size: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 4
          },
          to: {
            x: 2,
            y: 4
          }
        },
        label: {
          text: "Fantastic! Swipe the Rocket to see what it does",
          y: 600,
          x: -300,
          width: 700
        }
      }, {
        type: "swap",
        mask: {
          vertical: {
            x: 6,
            y: 3,
            size: 4
          },
          horizontal: {
            x: 6,
            y: 4,
            size: 2
          }
        },
        move: {
          from: {
            x: 6,
            y: 4
          },
          to: {
            x: 7,
            y: 4
          }
        },
        label: {
          text: "Great! Let's create another ROCKET!",
          y: 0,
          x: -300,
          width: 620
        }
      }, {
        type: "tap",
        mask: {
          vertical: {
            x: 6,
            y: 6,
            size: 1
          }
        },
        move: {
          from: {
            x: 6,
            y: 6
          }
        },
        label: {
          text: "Now tap on the ROCKET to use it!",
          y: -400,
          x: -300,
          width: 600
        }
      } ],
      t3: [ {
        type: "swap",
        mask: {
          vertical: {
            x: 5,
            y: 3,
            size: 3
          },
          horizontal: {
            x: 3,
            y: 5,
            size: 4
          }
        },
        move: {
          from: {
            x: 5,
            y: 5
          },
          to: {
            x: 6,
            y: 5
          }
        },
        label: {
          text: "Make L-shape match to create a BOMB!",
          y: 960
        }
      }, {
        type: "swap",
        mask: {
          horizontal: {
            x: 4,
            y: 5,
            size: 2
          }
        },
        move: {
          from: {
            x: 5,
            y: 5
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Nice! Swap the BOMB to see what it does!",
          y: 420
        }
      }, {
        type: "swap",
        mask: {
          vertical: {
            x: 5,
            y: 3,
            size: 4
          },
          horizontal: {
            x: 4,
            y: 4,
            size: 3
          }
        },
        move: {
          from: {
            x: 5,
            y: 3
          },
          to: {
            x: 5,
            y: 4
          }
        },
        label: {
          text: "Awesome! Let's create another BOMB by matching items in T-shape!",
          y: -800
        }
      }, {
        type: "tap",
        mask: {
          vertical: {
            x: 5,
            y: 6,
            size: 1
          }
        },
        move: {
          from: {
            x: 5,
            y: 6
          }
        },
        label: {
          text: "Now tap on the BOMB to use it!",
          y: 160
        }
      } ],
      t4: [ {
        type: "swap",
        mask: {
          vertical: {
            x: 3,
            y: 4,
            size: 2,
            square: true
          },
          horizontal: {
            x: 3,
            y: 4,
            size: 3
          }
        },
        move: {
          from: {
            x: 5,
            y: 4
          },
          to: {
            x: 4,
            y: 4
          }
        },
        label: {
          text: "Match 4 items in a square to create a FRISBEE!",
          y: 700
        }
      }, {
        type: "swap",
        mask: {
          horizontal: {
            x: 3,
            y: 5,
            size: 2
          }
        },
        move: {
          from: {
            x: 3,
            y: 5
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Perfect! Swipe the FRISBEE to see what it does!",
          y: 420
        }
      }, {
        type: "swap",
        mask: {
          vertical: {
            x: 5,
            y: 5,
            size: 3
          },
          horizontal: {
            x: 4,
            y: 6,
            size: 2,
            square: true
          }
        },
        move: {
          from: {
            x: 5,
            y: 5
          },
          to: {
            x: 5,
            y: 6
          }
        },
        label: {
          text: "Amazing! Let's create another FRISBEE!",
          y: 480
        }
      }, {
        type: "tap",
        mask: {
          vertical: {
            x: 5,
            y: 7,
            size: 1
          }
        },
        move: {
          from: {
            x: 5,
            y: 7
          }
        },
        label: {
          text: "Now tap on the FRISBEE to use it!",
          y: 260
        }
      } ],
      t5: [ {
        type: "swap",
        mask: {
          vertical: {
            x: 4,
            y: 4,
            size: 2
          },
          horizontal: {
            x: 2,
            y: 5,
            size: 5
          }
        },
        move: {
          from: {
            x: 4,
            y: 4
          },
          to: {
            x: 4,
            y: 5
          }
        },
        label: {
          text: "Match 5 items in a line to create a WIND WHEEL!",
          y: 700
        }
      }, {
        type: "swap",
        mask: {
          horizontal: {
            x: 4,
            y: 5,
            size: 2
          }
        },
        move: {
          from: {
            x: 4,
            y: 5
          },
          to: {
            x: 5,
            y: 5
          }
        },
        label: {
          text: "Nice! Swap the WIND WHEEL with a item to collect the items of that color!",
          y: 480
        }
      } ]
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  types: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71e73R4nDpOO4DemLj8xY54", "types");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var O = null;
    var r = "basic1";
    var y = "basic2";
    var g = "basic3";
    var b = "basic4";
    var p = "basic5";
    var R = [ r, y, g, b ];
    var A = [ r, y, g, b, p ];
    var B = "bomb";
    var D = "discoball";
    var M = "missiles1";
    var m = "missiles2";
    var s = "sniper";
    var x = "crateBrown1";
    var X = "crateBrown2";
    var z = "crateBrown3";
    var a = "crateRed1";
    var c = "crateRed2";
    var d = "crateRed3";
    var e = "crateYellow1";
    var f = "crateYellow2";
    var h = "crateYellow3";
    var i = "crateGreen1";
    var j = "crateGreen2";
    var k = "crateGreen3";
    var l = "crateBlue1";
    var n = "crateBlue2";
    var o = "crateBlue3";
    var q = "cratePurple1";
    var u = "cratePurple2";
    var v = "cratePurple3";
    var w = "crateBrick1";
    var C = "crateBrick2";
    var t = "movableDestructible1";
    var E = "shrub1";
    var F = "shrub2";
    var G = "mouseDoor";
    var H = "milkCabinet";
    var J = "milkShelfLeft";
    var K = "milkShelfRight";
    var L = "jamCabinet1";
    var N = "jamCabinet2";
    var P = "jamCabinet3";
    var Q = "jamCabinet4";
    var S = "jamCabinet5";
    var I = "milkBottle";
    var \u00d2 = "jam1";
    var \u00d3 = "jam2";
    var \u00d4 = "jam3";
    var \u00d5 = "jam4";
    var \u00d6 = "jam5";
    var _default = {
      O: O,
      r: r,
      y: y,
      g: g,
      b: b,
      p: p,
      R: R,
      A: A,
      B: B,
      D: D,
      M: M,
      m: m,
      s: s,
      x: x,
      X: X,
      z: z,
      a: a,
      c: c,
      d: d,
      e: e,
      f: f,
      h: h,
      i: i,
      j: j,
      k: k,
      l: l,
      n: n,
      o: o,
      q: q,
      u: u,
      v: v,
      w: w,
      C: C,
      E: E,
      F: F,
      G: G,
      H: H,
      t: t,
      I: I,
      J: J,
      K: K,
      L: L,
      N: N,
      P: P,
      Q: Q,
      S: S,
      "\xd2": \u00d2,
      "\xd3": \u00d3,
      "\xd4": \u00d4,
      "\xd5": \u00d5,
      "\xd6": \u00d6
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  underlay: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c3d9dNyxtdLaqpqhO+C2BgA", "underlay");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _constants = _interopRequireDefault(require("../../constants.js"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Z_INDEX = _constants["default"].GAMEPLAY.Z_INDEX;
    var UNDERLAY_TILE_SIZE = 270;
    var SHAKE_DURATION = 300;
    var underlay = {
      properties: {
        shrub1: {
          default: null,
          type: cc.SpriteFrame
        },
        shrub2: {
          default: null,
          type: cc.SpriteFrame
        }
      },
      is: function is(type) {
        return "shrub1" === type || "shrub2" === type;
      },
      init: function init(that, options) {
        that.node.zIndex = Z_INDEX["UNDERLAY_ITEM" + (Math.floor(5 * Math.random()) + 1)];
        var type = options.type;
        var subType = type.substring(0, type.length - 1);
        that.underlayData = {
          subType: subType
        };
        switch (type) {
         case subType + "1":
          that._addLayers({
            1: that[subType + "1"]
          });
          that.currentLayerId = "1";
          break;

         case subType + "2":
          that.lifePoints = 2;
          that._addLayers({
            1: that[subType + "1"],
            2: that[subType + "2"]
          });
          that.layers["1"].active = false;
          that.currentLayerId = "2";
        }
        for (var i = 1; i <= 2; i++) {
          if (!that.layers[i]) continue;
          that.layers[i].width = UNDERLAY_TILE_SIZE;
          that.layers[i].height = UNDERLAY_TILE_SIZE;
          that.layers[i].angle = 90 * Math.floor(4 * Math.random());
        }
      },
      gotHit: function gotHit(that, reason, resolve) {
        that.onUpdate && that.onUpdate.shaking && that.onUpdate.shaking.data.resolve();
        that.lifePoints--;
        that._checkLifePoints();
        if (0 === that.lifePoints) return that._defaultExplode(reason, resolve);
        that.type = "" + that.underlayData.subType + that.lifePoints;
        that.currentLayerId = that.lifePoints;
        that.layers[that.currentLayerId].active = true;
        that.onUpdate || (that.onUpdate = {});
        that.onUpdate.shaking = {
          data: {
            shakeUntil: that.app.now + SHAKE_DURATION,
            resolve: function resolve() {
              that.node.angle = 0;
              var hp = that.lifePoints;
              that.layers[hp].x = that.layers[hp + 1].x = 0;
              that.layers[hp].y = that.layers[hp + 1].y = 0;
              that.layers[hp + 1].destroy();
              delete that.layers[hp + 1];
              delete that.onUpdate.shaking;
              that._onUpdateCleanup();
            }
          },
          update: function update(dt, data) {
            if (that.app.now >= data.shakeUntil) return data.resolve();
            var hp = that.lifePoints;
            that.node.angle = 7 * that.app.noise.noise2D(that.app.now / 100, 10 * that.uid);
            that.layers[hp + 1].x = that.layers[hp].x = 7 * that.app.noise.noise2D(that.app.now / 100, 20 * that.uid);
            that.layers[hp + 1].y = that.layers[hp].y = 7 * that.app.noise.noise2D(that.app.now / 100, 30 * that.uid);
            that.layers[hp + 1].opacity = (data.shakeUntil - that.app.now) / SHAKE_DURATION * 256;
          }
        };
        resolve();
      }
    };
    var _default = underlay;
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../../constants.js": "constants"
  } ],
  userState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cdc8d8RhNRBCLNThbisByEb", "userState");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _boosters = _interopRequireDefault(require("./staticData/boosters"));
    var _constants = _interopRequireDefault(require("./constants"));
    var _levelModel = _interopRequireDefault(require("./models/levelModel"));
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function _extends() {
      _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
      };
      return _extends.apply(this, arguments);
    }
    var TIME_SPAN = _constants["default"].TIME_SPAN;
    var states = null;
    var boosters = null;
    var cats = null;
    var settings = null;
    var yard = null;
    var defaultStates = {
      coin: 0,
      fish: 0,
      star: 0,
      selectedCat: null,
      level: null,
      dailyUpdate: 0
    };
    function getStates() {
      if (!states) {
        var rawData = localStorage.getItem("userStates");
        if (rawData) states = JSON.parse(rawData); else {
          states = _extends({}, defaultStates);
          saveStates();
        }
      }
      return states;
    }
    function saveStates() {
      localStorage.setItem("userStates", JSON.stringify(states));
    }
    function getCoin() {
      return getStates().coin;
    }
    function updateCoin(value) {
      getStates().coin = Math.max(getStates().coin + value, 0);
      saveStates();
    }
    function getFish() {
      return getStates().fish;
    }
    function updateFish(value) {
      getStates().fish = Math.max(getStates().fish + value, 0);
      saveStates();
    }
    function getStar() {
      return getStates().star;
    }
    function updateStar(value) {
      getStates().star = Math.max(getStates().star + value, 0);
      saveStates();
    }
    function getSelectedCat() {
      return getStates().selectedCat;
    }
    function updateSelectedCat(value) {
      getStates().selectedCat = value;
      saveStates();
    }
    function updateDailyState() {
      var dailyUpdate = getStates().dailyUpdate || 0;
      if (Date.now() - dailyUpdate > TIME_SPAN.ONE_DAY) {
        console.warn("refresh daily state");
        var _cats = getCats();
        for (var id in _cats) _cats[id].dailyFed = 0;
        saveCats();
        getStates().dailyUpdate = Math.round(Date.now() / TIME_SPAN.ONE_DAY) * TIME_SPAN.ONE_DAY;
        saveStates();
        return true;
      }
      return false;
    }
    function getProgression() {
      var map = _levelModel["default"].getLevelMap();
      if (null === getStates().level) {
        getStates().level = map[0];
        saveStates();
      }
      return getStates().level;
    }
    function stepProgression(step) {
      var map = _levelModel["default"].getLevelMap();
      var currentProgress = getProgression();
      var progressId = map.indexOf(currentProgress);
      if (progressId < 0) return;
      progressId = Math.min(Math.max(progressId + step, 0), map.length - 1);
      getStates().level = map[progressId];
      saveStates();
    }
    var defaultBoosters = {
      hammer: {
        amount: 3,
        selected: true,
        unlocked: true
      },
      airplane: {
        amount: 3,
        selected: true,
        unlocked: true
      },
      rocket: {
        amount: 3,
        selected: false,
        unlocked: true
      },
      fairystick: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      paintbrush: {
        amount: 0,
        selected: false,
        unlocked: false
      },
      wheel: {
        amount: 0,
        selected: false,
        unlocked: false
      }
    };
    function getBoosters() {
      if (!boosters) {
        var rawData = localStorage.getItem("boosters");
        if (rawData) boosters = JSON.parse(rawData); else {
          boosters = _extends({}, defaultBoosters);
          saveBoostersState();
        }
      }
      return boosters;
    }
    function getSelectedBoosterCount() {
      var count = 0;
      if (boosters) for (var type in _boosters["default"]) boosters[type] && boosters[type].selected && count++;
      return count;
    }
    function saveBoostersState() {
      localStorage.setItem("boosters", JSON.stringify(boosters));
    }
    var defaultCats = {
      bella: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      bob: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      dora: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      leo: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      lily: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      luna: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      max: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      },
      milo: {
        unlocked: false,
        fishFed: 0,
        dailyFed: 0
      }
    };
    function getCats() {
      if (!cats) {
        var rawData = localStorage.getItem("cats");
        if (rawData) cats = JSON.parse(rawData); else {
          cats = _extends({}, defaultCats);
          saveCats();
        }
      }
      return cats;
    }
    function saveCats() {
      localStorage.setItem("cats", JSON.stringify(cats));
    }
    var defaultSettings = {
      music: .5,
      sfx: .5
    };
    function getSettings() {
      if (!settings) {
        var rawData = localStorage.getItem("settings");
        if (rawData) settings = JSON.parse(rawData); else {
          settings = _extends({}, defaultSettings);
          saveSettings();
        }
      }
      return settings;
    }
    function saveSettings() {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
    var defaultYardPlacements = {};
    function getYard() {
      if (!yard) {
        var rawData = localStorage.getItem("yardPlacements");
        if (rawData) yard = JSON.parse(rawData); else {
          yard = {};
          saveYard();
        }
      }
      return yard;
    }
    function saveYard() {
      localStorage.setItem("yardPlacements", JSON.stringify(yard));
    }
    function clear() {
      states = null;
      boosters = null;
      cats = null;
      settings = null;
      yard = null;
      localStorage.clear();
    }
    var _default = {
      getStates: getStates,
      saveStates: saveStates,
      updateDailyState: updateDailyState,
      getSettings: getSettings,
      saveSettings: saveSettings,
      getCoin: getCoin,
      updateCoin: updateCoin,
      getFish: getFish,
      updateFish: updateFish,
      getStar: getStar,
      updateStar: updateStar,
      getSelectedCat: getSelectedCat,
      updateSelectedCat: updateSelectedCat,
      getProgression: getProgression,
      stepProgression: stepProgression,
      getBoosters: getBoosters,
      getSelectedBoosterCount: getSelectedBoosterCount,
      saveBoostersState: saveBoostersState,
      getCats: getCats,
      saveCats: saveCats,
      getYard: getYard,
      saveYard: saveYard,
      clear: clear
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "./constants": "constants",
    "./models/levelModel": "levelModel",
    "./staticData/boosters": "boosters"
  } ],
  yardModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a10e4uDHl5GI53INdE66dty", "yardModel");
    "use strict";
    cc._RF.pop();
  }, {} ],
  yard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d18035ArTRGVoA19C73IMkX", "yard");
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var O = "none";
    var n = "normal";
    var w = "water";
    var t = "tree";
    var color_none = new cc.Color(0, 0, 0);
    var color_normal = new cc.Color(0, 0, 0);
    var color_water = new cc.Color(0, 0, 220);
    var color_tree = new cc.Color(255, 0, 0);
    var colors = {
      none: {
        color: color_none,
        opacity: 128
      },
      normal: {
        color: color_normal,
        opacity: 28
      },
      water: {
        color: color_water,
        opacity: 66
      },
      tree: {
        color: color_tree,
        opacity: 128
      }
    };
    var pattern = [ [ O, O, O, n, n, n, O, O, n, n, n, t, O, O, O, n, n, n, n, n ], [ O, O, n, n, n, O, O, n, n, n, n, n, n, O, O, O, n, n, n, n ], [ O, O, O, n, O, O, n, n, n, n, n, n, w, w, w, w, O, n, n, O ], [ O, O, O, O, O, O, n, n, n, n, n, n, w, w, w, w, n, n, n, n ] ];
    var patternSize = {
      x: pattern[0].length,
      y: pattern.length
    };
    var items = {
      rubberBallRed: {
        name: "Red Ball",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: -40
        },
        catOffset: {
          x: -81,
          y: 57
        },
        labelOffset: {
          x: 0,
          y: -72
        },
        star: 1,
        interval: 900,
        unlock: [ "bella" ],
        attract: {
          bella: 100
        }
      },
      pot: {
        name: "Pot",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: 25
        },
        buttonOffset: {
          x: -30,
          y: -50
        },
        catOffset: {
          x: 0,
          y: 70
        },
        labelOffset: {
          x: 0,
          y: -109
        },
        star: 4,
        interval: 900,
        unlock: [ "milo" ],
        attract: {
          bella: 80,
          milo: 20
        }
      },
      stretchingBoard: {
        name: "Stretching Board",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        offset: {
          x: 0,
          y: -20
        },
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: 0,
          y: 90
        },
        labelOffset: {
          x: 0,
          y: -73
        },
        star: 4,
        interval: 780,
        attract: {
          bella: 50,
          milo: 50
        }
      },
      bed: {
        name: "Bed",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: 0,
          y: 90
        },
        labelOffset: {
          x: 0,
          y: -73
        },
        star: 7,
        interval: 780,
        unlock: [ "dora", "luna" ],
        attract: {
          dora: 80,
          luna: 20
        }
      },
      swing: {
        name: "Swing",
        type: t,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: 247
        },
        buttonOffset: {
          x: -20,
          y: -235
        },
        catOffset: {
          x: 0,
          y: -60
        },
        labelOffset: {
          x: 0,
          y: -220
        },
        star: 8,
        interval: 780,
        attract: {
          dora: 50,
          milo: 50
        }
      },
      paperBag1: {
        name: "Paper Bag 1",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: 0,
          y: -11.5
        },
        labelOffset: {
          x: 0,
          y: -106.5
        },
        star: 8,
        interval: 600,
        unlock: [ "lily" ],
        attract: {
          lily: 100
        }
      },
      paperBag2: {
        name: "Paper Bag 2",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: 0,
          y: 97
        },
        labelOffset: {
          x: 0,
          y: -95
        },
        star: 8,
        interval: 600,
        attract: {
          lily: 80,
          luna: 20
        }
      },
      cushion: {
        name: "Cushion",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: -40
        },
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: 0,
          y: 20
        },
        labelOffset: {
          x: 0,
          y: -106.5
        },
        star: 8,
        interval: 600,
        unlock: [ "leo" ],
        attract: {
          leo: 100
        }
      },
      rubberBallRainbow: {
        name: "Rainbow Ball",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -20,
          y: -20
        },
        catOffset: {
          x: 90,
          y: 33
        },
        labelOffset: {
          x: 0,
          y: -95.5
        },
        star: 11,
        interval: 480,
        attract: {
          leo: 80,
          luna: 20
        }
      },
      swimRing: {
        name: "Swim Ring",
        type: w,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -35,
          y: -35
        },
        catOffset: {
          x: 8,
          y: 72
        },
        labelOffset: {
          x: 0,
          y: -125
        },
        star: 12,
        interval: 480,
        attract: {
          leo: 50,
          milo: 50
        }
      },
      hamburgerCushion: {
        name: "Hamburger Cushion",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        buttonOffset: {
          x: -25,
          y: -25
        },
        catOffset: {
          x: 0,
          y: 128
        },
        labelOffset: {
          x: 0,
          y: -115
        },
        star: 12,
        interval: 480,
        unlock: [ "max" ],
        attract: {
          max: 100
        }
      },
      tower: {
        name: "Tower",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        offset: {
          x: 0,
          y: 112
        },
        buttonOffset: {
          x: -45,
          y: -45
        },
        catOffset: {
          x: 80,
          y: 198
        },
        labelOffset: {
          x: 0,
          y: -215
        },
        star: 12,
        interval: 360,
        attract: {
          max: 40,
          lily: 40,
          luna: 20
        }
      },
      plushDoll: {
        name: "Plush Doll",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: 0,
          y: -40
        },
        catOffset: {
          x: -96,
          y: 39
        },
        labelOffset: {
          x: 0,
          y: -70
        },
        star: 12,
        interval: 360,
        attract: {
          lily: 33,
          bella: 67
        }
      },
      tent: {
        name: "Tent",
        type: n,
        size: {
          x: 2,
          y: 1
        },
        offset: {
          x: 0,
          y: 120
        },
        buttonOffset: {
          x: -100,
          y: -160
        },
        catOffset: {
          x: 62,
          y: 3
        },
        labelOffset: {
          x: 0,
          y: -246
        },
        star: 12,
        interval: 360,
        unlock: [ "bob" ],
        attract: {
          bob: 100
        }
      },
      featherToy: {
        name: "Feather Toy",
        type: n,
        size: {
          x: 1,
          y: 1
        },
        offset: {
          x: -20,
          y: 100
        },
        buttonOffset: {
          x: -20,
          y: -10
        },
        catOffset: {
          x: -53,
          y: -59
        },
        labelOffset: {
          x: 0,
          y: -190
        },
        star: 12,
        interval: 360,
        attract: {
          bob: 67,
          luna: 33
        }
      },
      tunnel: {
        name: "Tunnel",
        type: n,
        size: {
          x: 3,
          y: 1
        },
        buttonOffset: {
          x: -30,
          y: -15
        },
        catOffset: {
          x: 0,
          y: 131
        },
        labelOffset: {
          x: 0,
          y: -113
        },
        star: 13,
        interval: 360,
        attract: {
          bob: 40,
          max: 40,
          luna: 20
        }
      }
    };
    var _default = {
      pattern: pattern,
      patternSize: patternSize,
      colors: colors,
      items: items
    };
    exports["default"] = _default;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ]
}, {}, [ "Scheduler", "app", "CatCommands", "ShopCommands", "constants", "BagBoosterItem", "BagSupplyItem", "BoosterController", "BoosterItem", "BottomUI", "BottomUIButton", "CatView", "ConfirmationController", "ObjectiveController", "ObjectiveItem", "PausePopup", "ProgressFrame", "QAPanel", "ResultController", "SettingsPopup", "ShopConfirmPopup", "ShopItem", "Slider", "StartSelectionItem", "StartSelectionPopup", "SubsceneController", "TopUI", "TutorialController", "YardGlow", "YardItem", "YardView", "spinner", "BagSubscene", "CatSubscene", "HomeSubscene", "ShopSubscene", "Debugger", "GameBoard", "GameItem", "bumper", "cabinet", "simpleCrate", "underlay", "GameTile", "Rnd", "SpriteCollection", "helpers", "catModels", "levelModel", "supplyModel", "yardModel", "Game", "Home", "boosters", "cats", "development", "levels", "main", "types", "shop", "tutorials", "yard", "userState" ]);