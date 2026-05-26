/* Godi — script.js */

/* ---- Fatto in Casa — parallax + convergencia con GSAP ---- */
function initFattoParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const cols = [...document.querySelectorAll('.fatto__col')];
  if (!cols.length) return;

  /* Timeline principal: scrub vinculado al scroll de la sección entera */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.fatto',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  /*
   * Fase 1 (0 → 0.5): columnas se acercan al centro desde los costados
   *   col 0: viene desde la izquierda  (-x) y sube (-y)
   *   col 1: baja (+y), permanece centrada
   *   col 2: viene desde la derecha  (+x) y sube (-y)
   */
  tl.fromTo(cols[0], { y: 120, x: -100 }, { y: -80,  x: 0, ease: 'none', duration: 0.5 }, 0)
    .fromTo(cols[1], { y: -120 },          { y: 80,          ease: 'none', duration: 0.5 }, 0)
    .fromTo(cols[2], { y: 120, x:  100 }, { y: -80,  x: 0, ease: 'none', duration: 0.5 }, 0);

  /*
   * Fase 2 (0.5 → 1): columnas ya unidas continúan su parallax
   *   y se separan levemente para dejar percibir la reunión
   */
  tl.to(cols[0], { y: -320, x: -25, ease: 'none', duration: 0.5 }, 0.5)
    .to(cols[1], { y:  320,         ease: 'none', duration: 0.5 }, 0.5)
    .to(cols[2], { y: -320, x:  25, ease: 'none', duration: 0.5 }, 0.5);

}


/* ---- Tooltip lupa + card de ingredientes del menú ---- */
function initMenuTooltip() {
  const items = [...document.querySelectorAll('.menu__item[data-img]')];
  if (!items.length) return;

  /* --- Tooltip circular --- */
  const tip = document.createElement('div');
  tip.className = 'menu-tooltip';
  const tipImg = document.createElement('img');
  const tipHint = document.createElement('span');
  tipHint.className = 'menu-tooltip__hint';
  tipHint.textContent = 'click · ingredientes';
  tip.appendChild(tipImg);
  tip.appendChild(tipHint);
  document.body.appendChild(tip);

  /* --- Card expandida --- */
  const overlay = document.createElement('div');
  overlay.className = 'menu-card-overlay';
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.innerHTML = `
    <button class="menu-card__close" aria-label="Cerrar">✕</button>
    <img class="menu-card__img" src="" alt="">
    <div class="menu-card__body">
      <h3 class="menu-card__name"></h3>
      <p class="menu-card__desc"></p>
    </div>`;
  document.body.appendChild(overlay);
  document.body.appendChild(card);

  const cardImg  = card.querySelector('.menu-card__img');
  const cardName = card.querySelector('.menu-card__name');
  const cardDesc = card.querySelector('.menu-card__desc');

  function openCard(item) {
    cardImg.src      = item.dataset.img;
    cardImg.alt      = item.textContent.trim();
    cardName.textContent = item.textContent.trim();
    cardDesc.textContent = item.dataset.desc || '';
    card.classList.add('is-open');
    overlay.classList.add('is-open');
    tip.classList.remove('is-visible');
    cancelAnimationFrame(raf);
  }

  function closeCard() {
    card.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }

  card.querySelector('.menu-card__close').addEventListener('click', closeCard);
  overlay.addEventListener('click', closeCard);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCard(); });

  /* --- Movimiento suave del tooltip --- */
  let cx = 0, cy = 0, tx = 0, ty = 0, raf;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    cx = lerp(cx, tx, 0.12);
    cy = lerp(cy, ty, 0.12);
    tip.style.left = cx + 'px';
    tip.style.top  = cy + 'px';
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', e => {
    tx = e.clientX - 95;
    ty = e.clientY - 95;
  });

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      tipImg.src = item.dataset.img;
      tip.classList.add('is-visible');
      raf = requestAnimationFrame(loop);
    });
    item.addEventListener('mouseleave', () => {
      tip.classList.remove('is-visible');
      cancelAnimationFrame(raf);
    });
    item.addEventListener('click', () => openCard(item));
  });
}

window.addEventListener('load', () => {
  initFattoParallax();
  initMenuTooltip();
});


const nav        = document.getElementById('nav');
const burger     = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');
const closeBtn   = document.getElementById('navClose');
const backdrop   = document.getElementById('navBackdrop');

/* ---- Nav: fondo al hacer scroll ---- */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Menú móvil ---- */
function openMenu() {
  mobileMenu.classList.add('open');
  backdrop.classList.add('open');
  burger.classList.add('is-hidden');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  backdrop.classList.remove('open');
  burger.classList.remove('is-hidden');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);

mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* Cerrar con Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

/* ---- Fade-in al hacer scroll ---- */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px',
});

fadeEls.forEach(el => observer.observe(el));

/* ---- Card Pasta y Piano: fade logo → video al entrar en viewport ---- */
const cardLogo = document.querySelector('.eventos__card-logo');
if (cardLogo) {
  const revealCard = cardLogo.closest('.eventos__card');
  const cardRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => revealCard.classList.add('is-revealed'), 1500);
        cardRevealObserver.unobserve(revealCard);
      }
    });
  }, { threshold: 0.3 });
  cardRevealObserver.observe(revealCard);
}

/* ---- Marquee: pausa al hover (solo dispositivos con puntero fino) ---- */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.marquee__track').forEach(track => {
    const container = track.parentElement;
    container.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    container.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  });
}
