# OTAIMA — Café Premium de Colombia

> Sitio web oficial de OTAIMA, café de origen Tolima. Tres ediciones especiales nacidas en las montañas de Colombia.

![License](https://img.shields.io/badge/license-Proprietary-c9a961)
![Status](https://img.shields.io/badge/status-production--ready-success)
![Stack](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-0a0807)

---

## 🌐 Demo

🔗 **Producción**: [otaima.co](https://otaima.co) *(pendiente de deploy)*

---

## ✨ Características

- 🎨 **Diseño premium editorial** — Tipografía Cormorant Garamond + Inter
- 🌍 **Bilingüe** — Selector ES/EN con traducción instantánea
- 📱 **100% responsive** — Mobile-first, optimizado para todos los dispositivos
- ⚡ **Performance** — Lazy loading, preload crítico, animaciones GPU
- ♿ **Accesible** — WCAG 2.1, navegación por teclado, ARIA labels
- 🔍 **SEO completo** — Open Graph, Schema.org, sitemap, hreflang
- 📲 **PWA-ready** — Instalable como app móvil
- 🎬 **Animaciones premium** — Cursor custom, parallax, reveal on scroll, lightbox

---

## 📂 Estructura del proyecto

```
otaima-web/
├── index.html              # Página principal (single-page)
├── robots.txt              # Reglas para crawlers
├── sitemap.xml             # Sitemap con hreflang ES/EN
├── site.webmanifest        # PWA manifest
├── README.md               # Este archivo
├── LICENSE                 # Licencia
├── CHANGELOG.md            # Historial de cambios
└── img/                    # Assets visuales
    ├── hero-trilogia.png   # Hero: Caja de regalo trilogía
    ├── colecciones.png     # Las 3 cajas (Calarma, Locomboco, Do)
    ├── calarma.png         # Bolsa Calarma 500g
    ├── locomboco.png       # Bolsa Locomboco 500g
    ├── do.png              # Bolsa Do 500g
    ├── sobres.png          # Sobres individuales 20g
    ├── uniformes.png       # Uniforme OTAIMA Calarma
    ├── campesino.jpeg      # Ilustración campesino Tolima
    ├── cajas.png           # Línea de cajas
    └── ficha-tecnica.pdf   # Ficha técnica oficial
```

---

## 🚀 Quick Start

### Desarrollo local

```bash
# Clonar el repo
git clone https://github.com/USUARIO/otaima-web.git
cd otaima-web

# Servir con cualquier servidor estático
npx serve .
# o
python3 -m http.server 8000
# o
php -S localhost:8000
```

Abre `http://localhost:8000` en tu navegador.

### Sin servidor

Simplemente abre `index.html` con doble-click. Todo funciona localmente (algunas features de SEO como sitemap solo funcionan con dominio real).

---

## 🌐 Deploy

### Netlify (recomendado — gratis)

```bash
# Opción 1: Drag & drop en netlify.com
# Opción 2: CLI
npm i -g netlify-cli
netlify deploy --prod
```

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Cloudflare Pages

1. Conecta el repo en [pages.cloudflare.com](https://pages.cloudflare.com)
2. Framework preset: **None** (sitio estático)
3. Build command: *(vacío)*
4. Output: `/`

### GitHub Pages

Ya configurado vía `.github/workflows/deploy.yml`. Solo activa Pages en Settings.

---

## ✅ Checklist pre-launch

Antes de hacer deploy a producción:

- [ ] Reemplazar `https://otaima.co/` por tu dominio real en `index.html`, `sitemap.xml`, `robots.txt`
- [ ] Conectar el formulario de contacto (ver sección abajo)
- [ ] Agregar Google Analytics 4 / Meta Pixel
- [ ] Generar favicons PNG 192×192 y 512×512 para PWA
- [ ] Convertir imágenes a WebP (reduce 70% el peso)
- [ ] Probar en [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Probar accesibilidad en [WAVE](https://wave.webaim.org/)
- [ ] Validar Schema.org en [validator.schema.org](https://validator.schema.org/)
- [ ] Configurar HTTPS / SSL
- [ ] Configurar redirects `www.otaima.co` → `otaima.co` (o viceversa)

---

## 📧 Conectar el formulario de contacto

El formulario actualmente solo registra los datos en consola. Elige una opción:

### Opción A — Formspree (más simple)

```html
<form action="https://formspree.io/f/TU_ID_AQUI" method="POST" class="contacto-form">
```

### Opción B — EmailJS

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>
  emailjs.init("TU_PUBLIC_KEY");
  // ...
</script>
```

### Opción C — Netlify Forms (si deployas en Netlify)

```html
<form name="contact" method="POST" data-netlify="true" class="contacto-form">
```

---

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Animaciones, Grid, Custom Properties |
| **JavaScript (vanilla)** | Interactividad, IntersectionObserver, Lightbox |
| **[anime.js](https://animejs.com/)** v3.2.2 | Motor de animaciones — timelines, stagger, easing |
| **Google Fonts** | Cormorant Garamond + Inter |
| **SVG** | Iconos y favicon inline |
| **Schema.org JSON-LD** | SEO estructurado |

**Una sola dependencia (anime.js vía CDN). Sin build step. Sin npm install.**

---

## 🎨 Sistema de diseño

### Paleta

| Color | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#0a0807` | Fondo principal |
| `--bg-soft` | `#141110` | Fondo secciones |
| `--gold` | `#c9a961` | Acentos, CTAs, links |
| `--gold-bright` | `#e6c989` | Hover states |
| `--copper` | `#b87333` | Locomboco accent |
| `--cream` | `#f5ede0` | Texto destacado |
| `--text` | `#e8e2d4` | Texto principal |
| `--text-dim` | `#8a8275` | Texto secundario |

### Tipografía

- **Serif**: `Cormorant Garamond` (300–700) — Titulares, énfasis
- **Sans**: `Inter` (300–600) — UI, body text

---

## 📊 SEO & Performance

| Métrica | Target |
|---------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | 100 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| FID | < 100ms |

---

## 📝 Licencia

Proprietary © 2026 OTAIMA · Diseñado por [Lapora Marketing Digital](https://lapora.co)

Todos los derechos reservados. El contenido, marca, fotografía y código de este proyecto son propiedad de OTAIMA y no pueden ser reutilizados sin autorización por escrito.

---

## 🙏 Créditos

- **Diseño & Desarrollo**: [Lapora Marketing Digital](https://lapora.co) · Ibagué, Tolima
- **Fotografía & Branding**: Equipo OTAIMA
- **Tipografías**: Google Fonts (Cormorant Garamond, Inter)

---

<p align="center">
  <strong>OTAIMA</strong><br>
  <em>El alma del Tolima en cada grano</em><br>
  🇨🇴 Tolima, Colombia
</p>
