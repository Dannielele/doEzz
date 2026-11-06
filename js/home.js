/* Catálogo de la página principal: tarjetas, filtros por categoría y búsqueda. */
(function () {
  var tools = window.DOEZZ_TOOLS, cats = window.DOEZZ_CATS;
  var list = document.getElementById("catalog"), chips = document.getElementById("chips"), q = document.getElementById("q");
  var active = "Todas";
  var norm = function (s) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); };
  var card = function (t, i) {
    return '<article class="card" style="animation-delay:' + i * 50 + 'ms"><div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg></div><div class="tag">' + t.cat + "</div><h3>" + t.name + "</h3><p>" + t.desc + '</p><a class="btn sm" href="' + t.url + '">Abrir herramienta</a></article>';
  };
  function render() {
    var term = norm(q.value.trim()), shown = 0, html = "";
    cats.forEach(function (c) {
      if (active !== "Todas" && active !== c) return;
      var items = tools.filter(function (t) { return t.cat === c && (!term || norm(t.name + " " + t.desc + " " + t.cat).indexOf(term) > -1); });
      if (!items.length) {
        if (!term && active === c) html += '<p class="soon">Aún no hay herramientas en <strong>' + c + "</strong>. Pronto añadiremos más.</p>";
        return;
      }
      shown += items.length;
      html += '<h3 class="cat-title">' + c + '</h3><div class="grid">' + items.map(card).join("") + "</div>";
    });
    if (term && !shown) html = '<p class="empty">No encontramos herramientas para "' + q.value.replace(/[<>&]/g, "") + '". Prueba con otra palabra o categoría.</p>';
    list.innerHTML = html;
  }
  chips.innerHTML = ["Todas"].concat(cats).map(function (c) { return '<button type="button" class="chip" aria-pressed="' + (c === active) + '">' + c + "</button>"; }).join("");
  chips.addEventListener("click", function (e) {
    if (!e.target.classList.contains("chip")) return;
    active = e.target.textContent;
    Array.prototype.forEach.call(chips.children, function (b) { b.setAttribute("aria-pressed", b === e.target); });
    render();
  });
  q.addEventListener("input", render);
  document.getElementById("search-form").addEventListener("submit", function (e) { e.preventDefault(); document.getElementById("herramientas").scrollIntoView(); });
  render();
})();
