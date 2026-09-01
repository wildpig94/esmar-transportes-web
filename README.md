# Transportes Esmar · Sitio web

Sitio web responsive + PWA (instalable como app en el celular, sin pasar por Play Store) para
**Transportes Esmar** (Apatzingán / Uruapan / Morelia / Guadalajara / León).

## Tech
- HTML + CSS + JS puro (sin frameworks). Rápido y fácil de mantener.
- PWA: `manifest.webmanifest` + `sw.js` (funciona offline/instalable).
- **Reserva inteligente:** mini-formulario (ruta + fecha + pasajeros + horario) que arma el
  mensaje de WhatsApp completo para confirmar. WhatsApp: 443 330 6834.
- Sección de **Preguntas frecuentes**.

## Despliegue manual (Netlify)
```bash
cd esmar/web
npx netlify deploy --prod --dir=. --site <SITE_ID>
```
O arrastra la carpeta `web/` a app.netlify.com/drop.

## Estructura
```
web/
├─ index.html          # Página (todas las secciones)
├─ css/styles.css      # Diseño
├─ js/app.js           # Horarios, pestañas, próxima salida, modal de reserva
├─ manifest.webmanifest
├─ sw.js
├─ netlify.toml
├─ assets/logo/*.svg   # Logo recreado (emblema + marca)
├─ assets/img/*.jpg    # Fotos reales de la flota y los interiores
└─ icons/              # Íconos PWA
```
