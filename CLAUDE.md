# Godi — Pasta é calle · CLAUDE.md

Sitio web del restaurante de pastas Godi, Córdoba, Argentina.  
Stack: HTML + CSS + Vanilla JS. Sin framework, sin build step, sin bundler.

---

## Stack y dependencias

| Capa | Tecnología |
|------|-----------|
| HTML | Semántico, sin template engine |
| CSS | Vanilla + custom properties (design tokens) |
| JS | Vanilla — sin jQuery, sin framework |
| Animaciones | GSAP 3.12.5 + ScrollTrigger (CDN) |
| Tipografía | Google Fonts (Newsreader + IBM Plex Sans) + `@font-face` local (Bellarina) |
| Deploy | GitHub → Vercel (auto-deploy en push a `main`) |
| DNS | Cloudflare (modo DNS only — gris, no naranja) apuntando a Vercel |
| SSL | Let's Encrypt vía Vercel, TLS 1.3 |

---

## Estructura de archivos

```
godi/
├── index.html          # Página principal (todas las secciones)
├── galeria.html        # Galería /galeria — columnas parallax GSAP
├── styles.css          # Design system completo
├── script.js           # Lógica: parallax, tooltip menú, nav, fade-in
├── fonts/
│   ├── Bellarina.woff2
│   └── Bellarina.otf
├── assets/             # Imágenes, videos, logo
│   ├── GODI- LOGO (8).png
│   ├── video-hero.mp4          ← usar siempre .mp4, no .MOV
│   ├── video-calle.mp4
│   ├── video-amo-godi.mp4
│   ├── pastas-no-buenas-godis.png   ← overlay con mix-blend-mode: multiply
│   └── [imágenes galería y salsas]
└── CLAUDE.md
```

---

## Design tokens (CSS custom properties)

```css
:root {
  /* Colores */
  --cream:     #F7E2D0;
  --warm-gray: #DDD5D0;
  --maroon:    #410D02;
  --gold:      #D78D18;
  --olive:     #4A4D2B;
  --rust:      #9D3D29;
  --tan:       #B08C70;

  /* Tipografías */
  --ff-serif:  'Newsreader', Georgia, serif;
  --ff-sans:   'IBM Plex Sans', system-ui, sans-serif;
  --ff-script: 'Bellarina', cursive;          /* solo decorativa */

  /* Espaciado responsive */
  --pad-x: clamp(1.25rem, 5vw, 5rem);
  --pad-y: clamp(4rem, 10vw, 8rem);
}
```

Nunca usar valores hardcoded de color o fuente directamente en el CSS — siempre usar las variables.

---

## Orden de secciones — index.html

1. `<nav>` — logo + links + burger mobile
2. `.hero` — video-hero.mp4 + logo centrado + CTA "Hacé tu pedido" (PedidosYa)
3. `.marquee` — franja de texto rotativo
4. `.manifesto` / `#nosotros` — imagen de fondo + texto + acento Bellarina dorado
5. `.video-calle` — video-calle.mp4
6. `.menu` / `#menu` — sección blanca, tooltip de lupa + card de ingredientes
7. `.galeria` — grilla de fotos (link a /galeria)
8. `.eventos` / `#eventos`
9. `.ubicacion` / `#ubicacion` — mapa (desktop) / botón CTA (mobile)
10. `.video-duo` — video-amo-godi.mp4 + PNG overlay (`pastas-no-buenas-godis.png`)
11. `<footer>`

---

## Convenciones de desarrollo

- **Videos**: siempre MP4 (H.264). Los `.MOV` están en `assets/` pero no se usan en HTML. Convertir con FFmpeg si llegan nuevos videos: `ffmpeg -i entrada.MOV -c:v libx264 -crf 23 -preset fast -an salida.mp4`
- **Imágenes galería**: `loading="lazy"` en todas.
- **PNG con texto** (`pastas-no-buenas-godis.png`): usa `mix-blend-mode: multiply` sobre fondo claro — no cambiar el modo de mezcla.
- **GSAP**: registrar `ScrollTrigger` dentro de la función, con guard `if (typeof gsap === 'undefined') return`.
- **Clases JS**: prefijo `is-` para estados (`.is-open`, `.is-visible`). Nunca manipular estilos inline desde JS salvo posicionamiento del tooltip.
- **No agregar comentarios** salvo que la lógica sea no obvia.
- **No introducir dependencias nuevas** sin consultar — el proyecto es intencionalmente sin build step.

---

## Deploy

```bash
git add <archivos>
git commit -m "descripción"
git push origin main        # Vercel detecta el push y despliega automáticamente
```

- URL producción: **https://godicalle.com** y **https://www.godicalle.com**
- Preview automático en cada PR: `https://godi-web-<hash>.vercel.app`
- Panel Vercel: vercel.com/juancruzguidi/godi-web

### DNS (Cloudflare)

| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| CNAME | godicalle.com | `d41320115be8a860.vercel-dns-017.com` | DNS only (gris) |
| CNAME | www | `cname.vercel-dns.com` | DNS only (gris) |
| TXT | _vercel | token de verificación | — |

**Importante**: mantener ambos CNAME en modo "DNS only" (gris). Si se activa el proxy de Cloudflare (naranja), Vercel no puede verificar el SSL y el sitio devuelve HTTP 526.

---

## Datos del negocio

- **Nombre**: Godi — Pasta é calle
- **Dirección**: Caseros 329, X5022 Córdoba
- **Teléfono**: +54 9 351 862-9892
- **Mail**: godi.calle@gmail.com
- **Instagram**: [@godi.calle](https://www.instagram.com/godi.calle)
- **PedidosYa**: enlace en `index.html` → `.hero__cta`

---

## Tareas pendientes

- [ ] Verificar que `www.godicalle.com` redirige correctamente a `godicalle.com` (CNAME configurado, confirmar en browser)
- [ ] Revisar si el `.gitignore` excluye el PDF de presentación de gran tamaño (`assets/GODI - Presentación.pdf`)
- [ ] Optimizar imágenes galería a WebP si el peso total crece
