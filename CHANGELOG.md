# Changelog

All notable changes to the OTAIMA website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-05-14

### Added — Product detail pages with 3D interactive viewer 🎨

Four dedicated product pages with Tolima-rooted storytelling:

- **`colecciones/calarma.html`** — Edición Especial · 500g
  Historia del Páramo de Las Hermosas (Cajamarca, Tolima)
  Perfil 3/4/5 (cuerpo/acidez/dulzor), notas: chocolate, cítricos, caramelo
  Métodos V60, Prensa Francesa, Cafetera Moka

- **`colecciones/locomboco.html`** — Trilogía Exótica · 500g
  Historia del Nevado del Tolima
  Perfil 4/3/4, notas: chocolate dulce, cítricos, caramelo, tabaco
  Métodos Chemex, Prensa Francesa, Espresso
  Accent color: cobre (#c8946a)

- **`colecciones/do.html`** — Café de Origen · 500g
  Historia del sur del Tolima (Planadas, Rioblanco)
  Perfil 2/3/4, notas suaves: chocolate de leche, caramelo, frutos secos
  Métodos V60, AeroPress, Cafetera Moka
  Accent color: marfil (#e6c989)

- **`colecciones/sobres.html`** — Sobres Individuales 20g
  Historia del ritual diario
  Display 3D tipo "fan stack" con 5 sobres en perspectiva
  Métodos: Dosis, Agua, Disfruta (3 pasos simples)
  Hover individual con `easeOutElastic` por sobre

### 3D Interactive Viewer
- CSS 3D `transform-style: preserve-3d` + perspective
- Auto-rotación continua (idle state)
- Drag to rotate (mouse + touch)
- Scroll-driven micro-rotation
- Resume auto-rotate después de 2.5s idle
- Drop shadows dinámicas

### Shared Assets
- `assets/product.css` — Estilos de página de producto (700+ líneas)
- `assets/product.js` — Lógica 3D + anime.js animations

### Schema.org
- JSON-LD Product schema en cada página
- Open Graph product type
- Canonical URLs por página

### Updated
- Index: `Explorar` links ahora apuntan a páginas individuales
- Sitemap.xml: 4 nuevas URLs de colecciones
- Cards de colección ahora son `<a>` tags completos (mejor UX + SEO)

---

## [1.1.0] - 2026-05-14

### Added — Anime.js animation engine 🎬
- Integrated [anime.js](https://animejs.com/) v3.2.2 via CDN
- **Hero master timeline**: orchestrated loader → tagline → title (char-by-char with rotateX) → italic → subtitle → CTA → image reveal
- **Continuous animations**: hero image floating, scroll hint bouncing, marquee items pulsing
- **Stagger reveals** on scroll for: collections grid, proceso steps, blog cards, stats, gallery grid (center-out)
- **Smooth counter animation** with easeOutExpo (replaces previous linear interval)
- **Tab transitions** in ficha técnica: fade-out → swap → fade-in + dots staggered with easeOutBack
- **Lightbox transitions**: scale-in on open, slide left/right on prev/next
- **Magnetic buttons** with anime easing (easeOutElastic on release for spring effect)
- **Proceso icons** spin 360° on hover with scale pulse
- **Hero parallax** for mountains SVG controlled by anime.set()
- **Language switch** with fade transition during translation swap

### Changed
- Removed CSS `@keyframes` animations from hero elements (now driven by anime.js)
- Counter logic refactored to use anime.js update callbacks

---

## [1.0.0] - 2026-05-14

### 🎉 Initial release — Production-ready

#### Added
- **Single-page web app** with 13 sections:
  - Loader animado con logo OTAIMA
  - Navegación sticky con blur al hacer scroll
  - Hero con título carácter-por-carácter + imagen flotante
  - Marquee horizontal infinito con beneficios
  - Showcase fullscreen de las 3 colecciones
  - Grid de colecciones (Calarma, Locomboco, Do) con tilt 3D
  - Sección de sobres individuales 20g
  - Historia con drop cap dorada editorial
  - Stats animados con contador (2000 m.s.n.m, 100% Arábica, etc.)
  - Proceso 01-04 (Cultivo → Selección → Fermentación → Tostión)
  - Sección de uniformes OTAIMA Calarma
  - Ficha técnica interactiva con tabs y perfiles de sabor
  - Galería con lightbox + navegación con teclado
  - Blog con 3 artículos placeholder
  - Formulario de contacto con validación
  - CTA section + Footer completo

- **Sistema bilingüe ES/EN** con selector en navegación
- **Cursor personalizado** con anillo magnético
- **Animaciones premium**:
  - Reveal on scroll con stagger
  - Parallax en hero
  - Magnetic buttons
  - Card tilt 3D
  - Hover effects en imágenes
  - Contadores animados

- **SEO completo**:
  - Meta tags (description, keywords, theme-color, canonical)
  - Open Graph para Facebook/WhatsApp/LinkedIn
  - Twitter Cards
  - Schema.org JSON-LD (Organization + Product)
  - sitemap.xml con hreflang ES/EN
  - robots.txt

- **PWA**:
  - site.webmanifest
  - Theme color
  - Apple touch icon
  - Favicon SVG inline

- **Accesibilidad WCAG 2.1**:
  - Alt text en todas las imágenes
  - ARIA labels
  - role="dialog" en lightbox
  - Navegación por teclado (ESC, ←, →)
  - HTML semántico

- **Performance**:
  - Lazy loading de imágenes
  - Preload del hero
  - Preconnect a Google Fonts
  - Animaciones GPU-accelerated
  - IntersectionObserver para reveal

#### Assets incluidos
- 9 imágenes de producto (PNG) + 1 ilustración (JPEG)
- Ficha técnica oficial (PDF)
- Favicon SVG inline

---

## [Próximas versiones]

### Planificado para v1.1
- [ ] Convertir imágenes a WebP/AVIF
- [ ] Service Worker para offline
- [ ] Conexión a Formspree / EmailJS
- [ ] Google Analytics 4
- [ ] Microinteracciones adicionales

### Planificado para v2.0
- [ ] E-commerce funcional (Shopify Buy Button o headless)
- [ ] Blog real con CMS (Sanity / Strapi)
- [ ] Sitio multipágina con rutas reales
- [ ] Sistema de loyalty / suscripción de café
