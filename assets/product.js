// ═════════════════════════════════════════════════════
//  OTAIMA · Product Page Interactions
//  3D rotation, scroll reveals, animations
// ═════════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── LOADER ───
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 800);
  });

  // ─── 3D BAG INTERACTION (legacy CSS 3D - solo si no es canvas Three.js ni sobres) ───
  const stage = document.querySelector('.stage-3d:not(.stage-3d-canvas)');
  const bag = stage?.querySelector('.bag-3d');
  const isSobresStack = bag?.querySelector('.sobres-stack');

  if (stage && bag && !isSobresStack) {
    let autoRotate = true;
    let rotationY = 0;
    let rotationX = -8;
    let velocityY = 0.3;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let idleTimer = null;

    function update() {
      if (autoRotate && !isDragging) {
        rotationY += velocityY;
      }
      bag.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      requestAnimationFrame(update);
    }
    update();

    stage.addEventListener('mousedown', e => {
      isDragging = true;
      autoRotate = false;
      lastX = e.clientX;
      lastY = e.clientY;
      clearTimeout(idleTimer);
    });
    stage.addEventListener('touchstart', e => {
      isDragging = true;
      autoRotate = false;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      clearTimeout(idleTimer);
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      rotationY += (e.clientX - lastX) * 0.5;
      rotationX = Math.max(-30, Math.min(30, rotationX - (e.clientY - lastY) * 0.3));
      lastX = e.clientX;
      lastY = e.clientY;
    });
    document.addEventListener('touchmove', e => {
      if (!isDragging) return;
      rotationY += (e.touches[0].clientX - lastX) * 0.5;
      rotationX = Math.max(-30, Math.min(30, rotationX - (e.touches[0].clientY - lastY) * 0.3));
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }, { passive: true });

    function release() {
      if (!isDragging) return;
      isDragging = false;
      // Resume auto-rotation after 2.5s idle
      idleTimer = setTimeout(() => {
        autoRotate = true;
      }, 2500);
    }
    document.addEventListener('mouseup', release);
    document.addEventListener('touchend', release);

    // Scroll-driven slight rotation
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      if (window.scrollY < 200) {
        const diff = window.scrollY - lastScroll;
        rotationY += diff * 0.1;
        lastScroll = window.scrollY;
      }
    });
  }

  // ─── HERO ENTRANCE (anime.js if available) ───
  function runHeroAnim() {
    if (typeof anime === 'undefined') return setTimeout(runHeroAnim, 50);

    const tl = anime.timeline({ easing: 'cubicBezier(0.16, 1, 0.3, 1)' });
    tl
      .add({
        targets: '.product-info',
        opacity: [0, 1],
        translateX: [-40, 0],
        duration: 1000
      })
      .add({
        targets: '.product-breadcrumb',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600
      }, '-=700')
      .add({
        targets: '.product-line',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600
      }, '-=500')
      .add({
        targets: '.product-name',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800
      }, '-=400')
      .add({
        targets: '.product-tagline',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700
      }, '-=500')
      .add({
        targets: '.product-intro',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700
      }, '-=500')
      .add({
        targets: '.product-actions',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700
      }, '-=500')
      .add({
        targets: '.stage-3d',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1500,
        easing: 'easeOutExpo'
      }, '-=1500')
      .add({
        targets: '.rotation-hint',
        opacity: [0, 1],
        duration: 600
      }, '-=200');
  }
  runHeroAnim();

  // ─── SCROLL REVEAL ───
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.revealed) return;
      entry.target.dataset.revealed = 'true';
      entry.target.classList.add('in-view');

      if (typeof anime !== 'undefined') {
        // Stagger perfil dots
        const dots = entry.target.querySelectorAll('.perfil-dot.filled');
        if (dots.length > 0) {
          anime({
            targets: dots,
            scale: [0, 1],
            delay: anime.stagger(50),
            duration: 500,
            easing: 'easeOutBack'
          });
        }

        // Stagger notas
        const notas = entry.target.querySelectorAll('.notas-list li');
        if (notas.length > 0) {
          anime({
            targets: notas,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(80),
            duration: 600
          });
        }

        // Metodos cards
        const metodos = entry.target.querySelectorAll('.metodo-card');
        if (metodos.length > 0) {
          anime({
            targets: metodos,
            opacity: [0, 1],
            translateY: [40, 0],
            delay: anime.stagger(150),
            duration: 800
          });
        }

        // Specs
        const specs = entry.target.querySelectorAll('.spec-item');
        if (specs.length > 0) {
          anime({
            targets: specs,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(100),
            duration: 700
          });
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .perfil-sabor, .notas-list, .metodos-grid, .specs-grid').forEach(el => observer.observe(el));

  // ─── MAGNETIC BUTTONS ───
  function magnetic() {
    if (typeof anime === 'undefined') return setTimeout(magnetic, 100);
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        anime({
          targets: btn,
          translateX: x * 0.15,
          translateY: y * 0.15,
          duration: 400,
          easing: 'easeOutQuart'
        });
      });
      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 600,
          easing: 'easeOutElastic(1, 0.5)'
        });
      });
    });
  }
  magnetic();
})();
