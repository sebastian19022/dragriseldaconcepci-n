(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile nav ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navScrim = document.getElementById('navScrim');

  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navScrim.classList.remove('is-open');
    header.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-menu"></use></svg>';
  };
  const openNav = () => {
    mainNav.classList.add('is-open');
    navScrim.classList.add('is-open');
    header.classList.add('nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-close"></use></svg>';
  };

  menuToggle.addEventListener('click', () => {
    mainNav.classList.contains('is-open') ? closeNav() : openNav();
  });
  navScrim.addEventListener('click', closeNav);
  mainNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------------- Reveal-on-scroll (fail-safe: hidden state only ever applied by JS) ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealEls.forEach((el) => el.classList.add('reveal-init'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------- Floating pills: ambient CSS handles drift; JS adds smoothed mouse parallax ---------------- */
  const orbit = document.getElementById('orbit');
  const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (orbit && pointerFine && !reduceMotion) {
    const pills = Array.from(orbit.querySelectorAll('.pill'));
    const state = pills.map(() => ({ tx: 0, ty: 0, cx: 0, cy: 0 }));
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    orbit.addEventListener('mousemove', (e) => {
      const rect = orbit.getBoundingClientRect();
      if (rect.width < 500) return; // desktop-only layout is active
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    orbit.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    const tick = () => {
      pills.forEach((pill, i) => {
        const depth = parseFloat(pill.dataset.depth || '0.3');
        const s = state[i];
        s.cx += (targetX * depth * 26 - s.cx) * 0.07;
        s.cy += (targetY * depth * 26 - s.cy) * 0.07;
        pill.style.transform = `translate3d(${s.cx.toFixed(2)}px, ${s.cy.toFixed(2)}px, 0)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  /* ---------------- Ambient float per-pill drift target (varies each pill's keyframe endpoint) ---------------- */
  document.querySelectorAll('.pill__float').forEach((el, i) => {
    const angle = (i / 6) * Math.PI * 2;
    el.style.setProperty('--fx', `${(Math.cos(angle) * 9).toFixed(1)}px`);
    el.style.setProperty('--fy', `${(Math.sin(angle) * 9 - 6).toFixed(1)}px`);
  });

  /* ---------------- Certificaciones: data + marquee (nivel 2) + lightbox ---------------- */
  const CRED_L1 = [
    { full: 'images/certificados/titulos-y-especialidad/01-doctora-en-medicina-uce-2011.webp', title: 'Doctora en Medicina', meta: 'Universidad Central del Este · 25 feb 2011' },
    { full: 'images/certificados/titulos-y-especialidad/04-especialidad-nutriologia-clinica-intec-2021.webp', title: 'Especialidad en Nutriología Clínica', meta: 'INTEC · 21 abr 2021' },
    { full: 'images/certificados/titulos-y-especialidad/02-diplomado-nutricion-deportiva-cifmec-2018.webp', title: 'Diplomado en Nutrición Deportiva', meta: 'CIFMEC / UASD / CMD · 165h · 2018' },
    { full: 'images/certificados/titulos-y-especialidad/03-diplomado-nutricion-en-salud-cifmec-2018.webp', title: 'Diplomado en Nutrición en Salud', meta: 'CIFMEC / UASD / CMD · 165h · 2018' },
  ];

  const CRED_L2 = [
    { base: '01-sodonuclim-mix360-criterios-glim-2020', title: 'Criterios GLIM para el diagnóstico nutricional', meta: 'SODONUCLIM + MIX360 · Nov 2020' },
    { base: '02-nutriab-nutricion-embarazo', title: 'Nutrición durante el embarazo', meta: 'NUTRIAB Centro (aval ALNJ, México)' },
    { base: '03-fundacion-carlos-slim-asesor-lactancia-materna-2023', title: 'Asesor de lactancia materna', meta: 'Fundación Carlos Slim · 50h · Jul 2023' },
    { base: '04-celan-nutricion-enfermedad-renal-cronica-2023', title: 'Nutrición en enfermedad renal crónica', meta: 'CELAN · 45h · Ago 2023' },
    { base: '05-sodonuclim-asodeo-obesidad-diabetes-sarcopenia-2023', title: 'Obesidad, Diabetes y Sarcopenia', meta: 'SODONUCLIM & ASODEO · Punta Cana, RD · Nov 2023' },
    { base: '06-idff-congreso-fitness-fisioterapia-2023', title: '3er Congreso Nacional de Fitness y Fisioterapia', meta: 'IDFF · Dic 2023' },
    { base: '07-club-del-pancreas-patologias-pancreaticas-2023', title: 'Nutrición en Patologías Pancreáticas', meta: 'Club del Páncreas · Buenos Aires, Argentina · Nov 2023' },
    { base: '08-asodeo-viii-congreso-abordaje-obesidad-2024', title: 'Abordaje 360 de la Obesidad', meta: 'VIII Congreso ASODEO · Punta Cana, RD · Nov 2024' },
    { base: '09-cil-latam-nutricion-alimentacion-consciente-2025', title: 'Nutrición y Alimentación Consciente', meta: 'CIL LATAM, Colombia · 20h · Mar 2025' },
    { base: '10-diplomado-psiconutricion-2025', title: 'Psiconutrición: alimentación, cerebro y salud mental', meta: 'Diplomado · Medellín, Colombia · 160h · Mar 2025' },
    { base: '11-inans-tratamiento-obesidad-2025', title: 'Nuevas tendencias en el tratamiento de la Obesidad', meta: 'INANS · online, Utah, USA · 20h · Jun 2025' },
    { base: '12-dominio-en-sueroterapia', title: 'Dominio en Sueroterapia', meta: 'Programa respaldado por Hotmart · 50h' },
  ].map((c) => ({
    full: `images/certificados/formacion-continua/${c.base}.webp`,
    thumb: `images/certificados/formacion-continua/${c.base}-thumb.webp`,
    title: c.title,
    meta: c.meta,
  }));

  const marqueeTrack = document.getElementById('marqueeTrack');
  const marqueeEl = document.getElementById('marquee');
  if (marqueeTrack) {
    const buildThumb = (item, idx) => {
      const btn = document.createElement('button');
      btn.className = 'cred-thumb';
      btn.type = 'button';
      btn.dataset.lightboxGroup = 'l2';
      btn.dataset.index = String(idx);
      btn.innerHTML = `
        <span class="cred-thumb__frame"><img src="${item.thumb}" alt="${item.title} — ${item.meta}" loading="lazy" width="150" height="193"></span>
        <span class="cred-thumb__cap">${item.title}</span>`;
      return btn;
    };
    const sets = reduceMotion ? [CRED_L2] : [CRED_L2, CRED_L2];
    sets.forEach((set) => set.forEach((item, idx) => marqueeTrack.appendChild(buildThumb(item, idx))));
    if (reduceMotion) marqueeEl.style.overflowX = 'auto';
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  const GROUPS = { l1: CRED_L1, l2: CRED_L2 };
  let currentGroup = null;
  let currentIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const item = GROUPS[currentGroup][currentIndex];
    lbImage.src = item.full;
    lbImage.alt = item.title;
    lbCaption.textContent = `${item.title} — ${item.meta}`;
  }

  function openLightbox(group, index, trigger) {
    currentGroup = group;
    currentIndex = index;
    lastFocused = trigger || document.activeElement;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    const len = GROUPS[currentGroup].length;
    currentIndex = (currentIndex + delta + len) % len;
    renderLightbox();
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-group]');
    if (trigger) {
      const group = trigger.dataset.lightboxGroup;
      const index = parseInt(trigger.dataset.index, 10);
      openLightbox(group, index, trigger);
    }
    if (e.target.closest('[data-close]')) closeLightbox();
  });
  lbPrev.addEventListener('click', () => step(-1));
  lbNext.addEventListener('click', () => step(1));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------------- Location tabs (mobile) ---------------- */
  const locTabs = document.querySelectorAll('.loc-tab');
  const locCards = document.querySelectorAll('.loc-card');
  locTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      locTabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const targetId = tab.dataset.target;
      locCards.forEach((card) => {
        const isTarget = card.id === targetId;
        card.classList.toggle('is-active', isTarget);
        card.hidden = !isTarget;
      });
    });
  });
})();
