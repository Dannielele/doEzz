/* Calculadora de descuentos */
function calcDiscount(price, pct) {
  var cents = Math.round(price * 100);
  var savedC = Math.round(cents * pct / 100);
  return { original: cents / 100, saved: savedC / 100, final: (cents - savedC) / 100 };
}
if (typeof module !== "undefined") module.exports = { calcDiscount: calcDiscount };

(function () {
  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var price = $("price"), pct = $("pct"), cur = $("cur"), err = $("err"), hist = [], last = null;
  var num = function (v) { v = v.trim().replace(",", "."); return v === "" ? null : Number(v); };
  function fmt(n) {
    var o = cur.value === "none" ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : { style: "currency", currency: cur.value };
    return new Intl.NumberFormat("es-MX", o).format(n);
  }
  function show(r, p) {
    last = r ? { r: r, p: p } : null;
    $("final").textContent = r ? fmt(r.final) : "—";
    $("saved").textContent = r ? fmt(r.saved) : "—";
    $("orig").textContent = r ? fmt(r.original) : "—";
    $("save-btn").disabled = !r;
  }
  function calc() {
    var p = num(price.value), d = num(pct.value);
    err.textContent = "";
    if (p === null || d === null) return show(null);
    if (isNaN(p) || isNaN(d)) { err.textContent = "Escribe solo números (por ejemplo 1500 y 20)."; return show(null); }
    if (p < 0) { err.textContent = "El precio no puede ser negativo."; return show(null); }
    if (d < 0 || d > 100) { err.textContent = "El descuento debe estar entre 0 y 100 %."; return show(null); }
    show(calcDiscount(p, d), d);
  }
  function renderHist() {
    $("hist").innerHTML = hist.map(function (h) { return "<li>" + fmt(h.r.original) + " &minus; " + h.p + " % = <strong>" + fmt(h.r.final) + "</strong> (ahorro " + fmt(h.r.saved) + ")</li>"; }).join("");
    $("hist-wrap").hidden = !hist.length;
  }
  [price, pct, cur].forEach(function (el) { el.addEventListener("input", function () { calc(); renderHist(); }); });
  $("chips").addEventListener("click", function (e) { if (e.target.dataset.p) { pct.value = e.target.dataset.p; calc(); } });
  $("f").addEventListener("submit", function (e) { e.preventDefault(); calc(); });
  $("save-btn").addEventListener("click", function () { if (last) { hist.unshift(last); hist = hist.slice(0, 10); renderHist(); } });
  $("clear-btn").addEventListener("click", function () { price.value = ""; pct.value = ""; calc(); price.focus(); });
  $("hist-clear").addEventListener("click", function () { hist = []; renderHist(); });
  calc();
})();
