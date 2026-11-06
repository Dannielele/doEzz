/* Generador de códigos QR: interfaz */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var input = $("qr-text"), canvas = $("qr-canvas"), ph = $("qr-ph"), err = $("err"), dl = $("dl-btn"), cp = $("copy-btn"), timer;
  function make() {
    var v = input.value.trim();
    err.textContent = "";
    if (!v) { canvas.hidden = true; ph.hidden = false; dl.disabled = cp.disabled = true; return; }
    try {
      QR.draw(canvas, v, parseInt($("size").value, 10));
      canvas.hidden = false; ph.hidden = true; dl.disabled = cp.disabled = false;
    } catch (e) {
      canvas.hidden = true; ph.hidden = false; dl.disabled = true; cp.disabled = false;
      err.textContent = e.message || "No se pudo generar el código QR.";
    }
  }
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(make, 150); });
  $("size").addEventListener("change", make);
  cp.addEventListener("click", function () { window.doEzz.copy(input.value.trim()); });
  $("clear-btn").addEventListener("click", function () { input.value = ""; make(); input.focus(); });
  dl.addEventListener("click", function () {
    canvas.toBlob(function (b) {
      if (!b) { err.textContent = "No se pudo crear la imagen. Inténtalo de nuevo."; return; }
      var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "doezz-qr.png";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }, "image/png");
  });
  make();
})();
