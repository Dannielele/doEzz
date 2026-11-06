/* Componentes compartidos: cabecera, pie, tema oscuro/claro, avisos y portapapeles. */
(function () {
  var d = document, html = d.documentElement, root = d.body.dataset.root || "", page = d.body.dataset.page || "";
  var svg = function (p) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + p + "</svg>"; };
  var links = [["inicio", "Inicio", "index.html"], ["herramientas", "Herramientas", "index.html#herramientas"], ["acerca", "Acerca de", "acerca/index.html"], ["contacto", "Contacto", "contacto/index.html"]];
  var nav = links.map(function (l) {
    return '<a href="' + root + l[2] + '"' + (l[0] === page ? ' aria-current="page"' : "") + ">" + l[1] + "</a>";
  }).join("");

  var h = d.getElementById("site-header");
  if (h) h.outerHTML = '<header class="site-header"><div class="wrap bar">' +
    '<a class="logo" href="' + root + 'index.html" aria-label="doEzz, inicio">do<b>E</b>zz</a>' +
    '<nav id="nav" aria-label="Principal">' + nav + "</nav>" +
    '<button class="icon-btn" id="theme" type="button" aria-label="Cambiar entre modo claro y oscuro">' +
    '<span class="i-moon">' + svg('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') + '</span>' +
    '<span class="i-sun">' + svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') + "</span></button>" +
    '<button class="icon-btn menu-btn" id="menu" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav">' + svg('<path d="M4 7h16M4 12h16M4 17h16"/>') + "</button></div></header>";

  var f = d.getElementById("site-footer");
  if (f) f.outerHTML = '<footer class="site-footer"><div class="wrap foot"><div><a class="logo" href="' + root + 'index.html">do<b>E</b>zz</a><br>Lo necesitas. Lo haces. Listo.<br>&copy; ' + new Date().getFullYear() + " doEzz</div>" +
    '<nav aria-label="Legal"><a href="' + root + 'acerca/index.html">Acerca de</a><a href="' + root + 'legal/privacidad/index.html">Privacidad</a><a href="' + root + 'legal/terminos/index.html">Términos y condiciones</a><a href="' + root + 'contacto/index.html">Contacto</a></nav></div></footer>';

  var toast = d.createElement("div"); toast.id = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite"); d.body.appendChild(toast);
  var tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 2200); }

  function copy(text) {
    function fallback() {
      var t = d.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; d.body.appendChild(t); t.select();
      var ok = false; try { ok = d.execCommand("copy"); } catch (e) {} d.body.removeChild(t); return ok;
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { say("Copiado al portapapeles"); }, function () { say(fallback() ? "Copiado al portapapeles" : "No se pudo copiar. Hazlo manualmente."); });
    }
    say(fallback() ? "Copiado al portapapeles" : "No se pudo copiar. Hazlo manualmente.");
    return Promise.resolve();
  }
  window.doEzz = { toast: say, copy: copy };

  var tb = d.getElementById("theme");
  if (tb) tb.addEventListener("click", function () {
    var t = html.dataset.theme === "dark" ? "light" : "dark"; html.dataset.theme = t;
    try { localStorage.setItem("doezz-theme", t); } catch (e) {}
  });
  var mb = d.getElementById("menu"), nv = d.getElementById("nav");
  if (mb && nv) {
    mb.addEventListener("click", function () { var o = nv.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    nv.addEventListener("click", function (e) { if (e.target.tagName === "A") { nv.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });
  }
})();
