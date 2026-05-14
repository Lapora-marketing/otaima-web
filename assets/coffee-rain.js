// ═════════════════════════════════════════════════════════════
//  OTAIMA · Coffee Rain Experience
//  Scroll-driven bag opening + coffee bean particles
// ═════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const COFFEE_TONES = [
    '#3a1f0d', '#4a2818', '#5a3622', '#6b3f1f',
    '#7a4f2a', '#5d3a1c', '#4a2814', '#3d1f0d'
  ];

  const MAX_BEANS_ON_SCREEN = 180;

  class CoffeeRain {
    constructor() {
      this.bag = document.querySelector('.story-bag');
      this.lid = document.querySelector('.story-bag-lid');
      this.spout = document.querySelector('.story-bag-spout');
      this.beanLayer = document.querySelector('.bean-layer');
      this.pile = document.querySelector('.bean-pile');
      this.story = document.querySelector('.scroll-story');

      if (!this.bag || !this.beanLayer || !this.story) {
        console.warn('CoffeeRain: missing required DOM elements');
        return;
      }

      this.beans = [];
      this.pileBeans = [];
      this.lastScroll = 0;
      this.scrollVelocity = 0;
      this.beanSpawnCounter = 0;
      this.totalSpawned = 0;
      this.maxPileBeans = 80;

      this.bind();
      this.tick();
    }

    bind() {
      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      window.addEventListener('resize', () => this.onResize());
    }

    onScroll() {
      const scrollY = window.scrollY;
      const dy = scrollY - this.lastScroll;
      this.scrollVelocity = dy;
      this.lastScroll = scrollY;

      // Calculate scroll progress through story section
      const storyRect = this.story.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const storyTop = storyRect.top;
      const storyHeight = storyRect.height;

      // Progress: 0 when story top hits viewport top, 1 when story bottom passes viewport top
      const progress = Math.max(0, Math.min(1, -storyTop / (storyHeight - viewportH)));
      this.progress = progress;

      // Open lid based on progress (0-0.15)
      this.updateLid(progress);

      // Spawn beans while scrolling down within story
      if (dy > 0 && progress > 0.05 && progress < 0.95) {
        this.beanSpawnCounter += Math.min(dy, 30);
        const spawnEvery = 35; // pixels of scroll per bean
        while (this.beanSpawnCounter > spawnEvery) {
          this.beanSpawnCounter -= spawnEvery;
          this.spawnBean();
        }
      }
    }

    updateLid(progress) {
      if (!this.lid || !this.spout) return;
      // Open from 0 to 0.2 of scroll
      const open = Math.min(1, progress / 0.18);
      // Lid tilts backward and lifts
      this.lid.style.transform = `translateY(${-open * 35}px) rotateX(${open * 75}deg)`;
      this.lid.style.opacity = `${1 - open * 0.4}`;
      // Spout (dark interior visible)
      this.spout.style.opacity = open;
      this.spout.style.transform = `scaleY(${0.3 + open * 0.7})`;
    }

    spawnBean() {
      if (this.beans.length >= MAX_BEANS_ON_SCREEN) {
        const old = this.beans.shift();
        if (old?.el?.parentNode) old.el.remove();
      }

      const bagRect = this.bag.getBoundingClientRect();
      const layerRect = this.beanLayer.getBoundingClientRect();

      // Spawn position: just above the bag opening (top center of bag)
      const x = bagRect.left + bagRect.width / 2 - layerRect.left + (Math.random() - 0.5) * 30;
      const y = bagRect.top - layerRect.top + 20;

      const size = 9 + Math.random() * 5;
      const color = COFFEE_TONES[Math.floor(Math.random() * COFFEE_TONES.length)];
      const el = document.createElement('div');
      el.className = 'coffee-bean';
      el.style.cssText = `
        position: absolute;
        left: ${x}px; top: ${y}px;
        width: ${size}px; height: ${size * 1.35}px;
        background: linear-gradient(135deg, ${color}, #2a1607);
        border-radius: 50%;
        box-shadow: inset -1px -1px 2px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.5);
        transform: rotate(${Math.random() * 360}deg);
        pointer-events: none;
        z-index: 5;
      `;
      // Bean crease
      const crease = document.createElement('div');
      crease.style.cssText = `
        position: absolute; left: 50%; top: 10%; bottom: 10%;
        width: 1px; background: rgba(0,0,0,0.6);
        transform: translateX(-50%);
        border-radius: 50%;
      `;
      el.appendChild(crease);
      this.beanLayer.appendChild(el);

      const bean = {
        el,
        x, y,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 1.5 + 0.5,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 8,
        falling: true
      };
      this.beans.push(bean);
      this.totalSpawned++;
    }

    tick() {
      requestAnimationFrame(() => this.tick());

      const pileEl = this.pile;
      const pileRect = pileEl?.getBoundingClientRect();
      const layerRect = this.beanLayer.getBoundingClientRect();
      const pileTop = pileRect ? pileRect.top - layerRect.top : 999999;

      const gravity = 0.35;
      const wind = Math.sin(performance.now() * 0.001) * 0.05;

      for (let i = this.beans.length - 1; i >= 0; i--) {
        const b = this.beans[i];
        if (!b.falling) continue;

        b.vy += gravity;
        b.vx += wind;
        b.vx *= 0.995;
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vrot;

        // Land on pile or pile area
        if (b.y >= pileTop - 10 - Math.random() * 30) {
          b.falling = false;
          // Move to pile (transfer DOM)
          if (this.pileBeans.length < this.maxPileBeans && pileEl) {
            const pileX = b.x - (pileRect.left - layerRect.left);
            const pileY = pileTop + (pileRect.height - (b.y - pileTop)) * 0.3;
            b.el.style.left = `${pileX}px`;
            b.el.style.top = `${b.y - pileTop + pileRect.height - 30}px`;
            b.el.style.transform = `rotate(${b.rot}deg)`;
            pileEl.appendChild(b.el);
            this.pileBeans.push(b.el);
          } else {
            // Remove
            b.el.remove();
          }
          this.beans.splice(i, 1);
          continue;
        }

        b.el.style.transform = `translate(${b.x - parseFloat(b.el.style.left)}px, ${b.y - parseFloat(b.el.style.top)}px) rotate(${b.rot}deg)`;
      }
    }

    onResize() {
      // Beans recompute on next scroll
    }
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CoffeeRain());
  } else {
    new CoffeeRain();
  }
})();
