# doEzz

Sitio estático (HTML + CSS + JS), sin dependencias ni servidor. Ábrelo con doble clic en `index.html` o publícalo en GitHub Pages.

## Publicar en GitHub Pages
1. Sube esta carpeta a un repositorio.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.
3. Reemplaza `https://TU-USUARIO.github.io/doezz/` por tu URL real en `sitemap.xml` y `robots.txt`.
4. Cambia el correo en `js/config.js`.

## Añadir una herramienta
1. Crea `herramientas/mi-herramienta/index.html` (copia una existente) y su script en `js/tools/`.
2. Agrégala a `js/tools-data.js` para que aparezca en el catálogo y el buscador.
3. Añade su URL al `sitemap.xml`.

## Google AdSense (cuando el sitio sea aprobado)
Las páginas ya incluyen `<aside class="ad-slot" data-slot="...">` ocultos. Al recibir la aprobación:
1. Añade el script de AdSense en el `<head>` de las páginas.
2. Pega el bloque `<ins class="adsbygoogle">` dentro de cada `.ad-slot`.
3. Agrega la clase `ads-on` a `<html>` (por ejemplo desde `components.js`) para reservar el espacio.
4. Actualiza la política de privacidad y añade el aviso de consentimiento de cookies si tu región lo exige.

## Estructura
`index.html` · `herramientas/` (una carpeta por herramienta) · `legal/` · `acerca/` · `contacto/` · `css/` · `js/` (`components.js`, `tools-data.js`, `home.js`, `qr.js`, `tools/`) · `assets/`
