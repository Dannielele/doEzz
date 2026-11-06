/* Codificador de códigos QR (modo byte, corrección M, versiones 1-20). Sin dependencias. */
(function () {
  "use strict";
  var ECC = [10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28];
  var BLK = [1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49];
  var MAXV = 20; /* versión máxima verificada (≈ 666 bytes): suficiente para enlaces y textos, y fácil de escanear */
  function raw(v) { var r = (16 * v + 128) * v + 64; if (v >= 2) { var n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; }
  function cap(v) { return (raw(v) >> 3) - ECC[v - 1] * BLK[v - 1]; }
  function mul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; }
  function divisor(d) {
    var r = [], i, j, root = 1; for (i = 0; i < d - 1; i++) r.push(0); r.push(1);
    for (i = 0; i < d; i++) { for (j = 0; j < d; j++) { r[j] = mul(r[j], root); if (j + 1 < d) r[j] ^= r[j + 1]; } root = mul(root, 2); }
    return r;
  }
  function rem(data, div) {
    var r = div.map(function () { return 0; });
    data.forEach(function (b) { var f = b ^ r.shift(); r.push(0); div.forEach(function (c, i) { r[i] ^= mul(c, f); }); });
    return r;
  }
  function penalty(m, n) {
    var p = 0, a, b, run, cur, prev, dark = 0, x, y, c, k;
    for (var pass = 0; pass < 2; pass++) for (a = 0; a < n; a++) {
      run = 1;
      for (b = 1; b < n; b++) {
        cur = pass ? m[b][a] : m[a][b]; prev = pass ? m[b - 1][a] : m[a][b - 1];
        if (cur === prev) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1;
      }
    }
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      c = m[y][x]; if (c) dark++;
      if (x < n - 1 && y < n - 1 && c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
    }
    var P1 = [1,0,1,1,1,0,1,0,0,0,0], P2 = [0,0,0,0,1,0,1,1,1,0,1];
    function hit(g, w) { var t = 0, q = 0; for (; q < 11; q++) if (g(q) !== (w[q] === 1)) break; return q === 11; }
    for (a = 0; a < n; a++) for (b = 0; b <= n - 11; b++) {
      (function (A, B) {
        [P1, P2].forEach(function (w) {
          if (hit(function (q) { return m[A][B + q]; }, w)) p += 40;
          if (hit(function (q) { return m[B + q][A]; }, w)) p += 40;
        });
      })(a, b);
    }
    k = Math.ceil(Math.abs(dark * 20 - n * n * 10) / (n * n)) - 1;
    return p + k * 10;
  }
  var MASKS = [
    function (x, y) { return (x + y) % 2 === 0; }, function (x, y) { return y % 2 === 0; },
    function (x, y) { return x % 3 === 0; }, function (x, y) { return (x + y) % 3 === 0; },
    function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
    function (x, y) { return x * y % 2 + x * y % 3 === 0; },
    function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; },
    function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }
  ];

  function encode(text) {
    var data = Array.prototype.slice.call(new TextEncoder().encode(text)), ver, i, j;
    for (ver = 1; ver <= MAXV; ver++) if (4 + (ver < 10 ? 8 : 16) + data.length * 8 <= cap(ver) * 8) break;
    if (ver > MAXV) throw new Error("El contenido es demasiado largo. El máximo es de unos 650 caracteres.");
    var bits = [];
    function put(v, n) { for (var k = n - 1; k >= 0; k--) bits.push((v >>> k) & 1); }
    put(4, 4); put(data.length, ver < 10 ? 8 : 16); data.forEach(function (b) { put(b, 8); });
    var total = cap(ver) * 8; put(0, Math.min(4, total - bits.length)); while (bits.length % 8) bits.push(0);
    for (var pad = 0xEC; bits.length < total; pad ^= 0xEC ^ 0x11) put(pad, 8);
    var cw = []; for (i = 0; i < bits.length; i += 8) { var v = 0; for (j = 0; j < 8; j++) v = (v << 1) | bits[i + j]; cw.push(v); }

    var nb = BLK[ver - 1], el = ECC[ver - 1], rc = raw(ver) >> 3, ns = nb - rc % nb, sl = Math.floor(rc / nb), div = divisor(el), blocks = [], k = 0;
    for (i = 0; i < nb; i++) {
      var dat = cw.slice(k, k + sl - el + (i < ns ? 0 : 1)); k += dat.length;
      var ec = rem(dat, div); if (i < ns) dat.push(0); blocks.push(dat.concat(ec));
    }
    var all = [];
    for (i = 0; i < blocks[0].length; i++) blocks.forEach(function (b, idx) { if (i !== sl - el || idx >= ns) all.push(b[i]); });

    var n = ver * 4 + 17, m = [], fn = [];
    for (i = 0; i < n; i++) { m.push(new Array(n).fill(false)); fn.push(new Array(n).fill(false)); }
    function set(x, y, d) { m[y][x] = d; fn[y][x] = true; }
    function finder(cx, cy) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var x = cx + dx, y = cy + dy, dist = Math.max(Math.abs(dx), Math.abs(dy));
        if (x >= 0 && x < n && y >= 0 && y < n) set(x, y, dist !== 2 && dist !== 4);
      }
    }
    function format(mask) {
      var d = (0 << 3) | mask, r = d, q;
      for (q = 0; q < 10; q++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      var b = ((d << 10) | r) ^ 0x5412, bit = function (q) { return ((b >>> q) & 1) !== 0; };
      for (q = 0; q <= 5; q++) set(8, q, bit(q));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (q = 9; q < 15; q++) set(14 - q, 8, bit(q));
      for (q = 0; q < 8; q++) set(n - 1 - q, 8, bit(q));
      for (q = 8; q < 15; q++) set(8, n - 15 + q, bit(q));
      set(8, n - 8, true);
    }
    for (i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    if (ver > 1) {
      var na = Math.floor(ver / 7) + 2, step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2, pos = [6];
      for (var p = n - 7; pos.length < na; p -= step) pos.splice(1, 0, p);
      pos.forEach(function (a, ia) { pos.forEach(function (b, ib) {
        if ((ia === 0 && ib === 0) || (ia === 0 && ib === na - 1) || (ia === na - 1 && ib === 0)) return;
        for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }); });
    }
    format(0);
    if (ver >= 7) {
      var vr = ver; for (i = 0; i < 12; i++) vr = (vr << 1) ^ ((vr >>> 11) * 0x1F25);
      var vb = (ver << 12) | vr;
      for (i = 0; i < 18; i++) { var bt = ((vb >>> i) & 1) !== 0, a = n - 11 + i % 3, b = Math.floor(i / 3); set(a, b, bt); set(b, a, bt); }
    }
    var idx = 0;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) for (j = 0; j < 2; j++) {
        var x = right - j, y = ((right + 1) & 2) === 0 ? n - 1 - vert : vert;
        if (!fn[y][x] && idx < all.length * 8) { m[y][x] = ((all[idx >>> 3] >>> (7 - (idx & 7))) & 1) !== 0; idx++; }
      }
    }
    function applyMask(mk) { for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (!fn[y][x] && MASKS[mk](x, y)) m[y][x] = !m[y][x]; }
    var best = 0, bestP = Infinity;
    /* La máscara 1 (franjas horizontales) se omite: es válida, pero algunos lectores la leen peor. */
    for (i = 0; i < 8; i++) { if (i === 1) continue; applyMask(i); format(i); var pe = penalty(m, n); if (pe < bestP) { bestP = pe; best = i; } applyMask(i); }
    applyMask(best); format(best);
    return { size: n, modules: m, version: ver };
  }

  /* Dibuja el QR en un canvas (zona de silencio de 4 módulos) con al menos "px" píxeles de ancho. */
  function draw(canvas, text, px) {
    var q = encode(text), scale = Math.max(2, Math.ceil(px / (q.size + 8))), W = scale * (q.size + 8), ctx = canvas.getContext("2d");
    canvas.width = canvas.height = W;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, W); ctx.fillStyle = "#000";
    for (var y = 0; y < q.size; y++) for (var x = 0; x < q.size; x++) if (q.modules[y][x]) ctx.fillRect((x + 4) * scale, (y + 4) * scale, scale, scale);
  }
  var api = { encode: encode, draw: draw };
  if (typeof module !== "undefined") module.exports = api; else window.QR = api;
})();
