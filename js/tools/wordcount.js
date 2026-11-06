/* Contador de palabras y caracteres */
function analyzeText(t) {
  var trimmed = t.trim();
  return {
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    chars: t.length,
    charsNoSpaces: t.replace(/\s/g, "").length,
    lines: t === "" ? 0 : t.split(/\r\n|\r|\n/).length,
    paragraphs: trimmed ? trimmed.split(/(?:\r?\n\s*){2,}/).filter(function (p) { return p.trim(); }).length : 0
  };
}
if (typeof module !== "undefined") module.exports = { analyzeText: analyzeText };

(function () {
  if (typeof document === "undefined") return;
  var $ = function (id) { return document.getElementById(id); };
  var box = $("text");
  function update() {
    var s = analyzeText(box.value);
    ["words", "chars", "charsNoSpaces", "lines", "paragraphs"].forEach(function (k) { $(k).textContent = s[k].toLocaleString("es-MX"); });
    var min = s.words / 200;
    $("read").textContent = s.words === 0 ? "0 min" : min < 1 ? "< 1 min" : Math.round(min) + " min";
    $("copy-btn").disabled = $("clear-btn").disabled = !box.value;
  }
  box.addEventListener("input", update);
  $("copy-btn").addEventListener("click", function () { window.doEzz.copy(box.value); });
  $("clear-btn").addEventListener("click", function () { box.value = ""; update(); box.focus(); });
  update();
})();
