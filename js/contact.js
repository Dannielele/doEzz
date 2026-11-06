/* Formulario de contacto sin servidor: abre el cliente de correo del usuario. */
(function () {
  var f = document.getElementById("contact-form"); if (!f) return;
  var email = (window.DOEZZ_CONFIG || {}).email;
  document.getElementById("mail").textContent = email; document.getElementById("mail").href = "mailto:" + email;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = f.name.value.trim(), m = f.message.value.trim(), err = document.getElementById("err");
    if (!n || !m) { err.textContent = "Escribe tu nombre y tu mensaje."; return; }
    err.textContent = "";
    location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Mensaje desde doEzz de " + n) + "&body=" + encodeURIComponent(m);
  });
})();
