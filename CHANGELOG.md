# Changelog

All notable changes to the OTAIMA website project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
