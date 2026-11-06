/* Catálogo de herramientas. Para añadir una nueva: agrega un objeto aquí y crea su carpeta en /herramientas/. */
window.DOEZZ_CATS = ["Calculadoras", "Productividad", "Texto", "Generadores", "Utilidades"];
window.DOEZZ_TOOLS = [
  { name: "Calculadora de descuentos", cat: "Calculadoras", url: "herramientas/calculadora-descuentos/index.html",
    desc: "Calcula el precio final y cuánto ahorras con cualquier porcentaje de descuento.",
    icon: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>' },
  { name: "Generador de códigos QR", cat: "Generadores", url: "herramientas/generador-qr/index.html",
    desc: "Convierte texto o enlaces en un código QR y descárgalo en PNG.",
    icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>' },
  { name: "Contador de palabras y caracteres", cat: "Texto", url: "herramientas/contador-palabras/index.html",
    desc: "Cuenta palabras, caracteres, líneas y párrafos de cualquier texto al instante.",
    icon: '<path d="M4 7V5h16v2M12 5v14M9 19h6"/>' }
];
