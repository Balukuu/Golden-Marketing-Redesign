/**
 * Golden Marketing Uganda — Main Script v3.0
 * Keeps all existing behaviours; adds new nav + lazy image logic.
 */

// Define global Scroll Reveal function to support dynamic content loading
window.initReveal = function() {
  const revealEls = document.querySelectorAll('.reveal:not(.revealed-observed)');
  if (revealEls.length > 0) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => {
      el.classList.add('revealed-observed');
      revObs.observe(el);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal ──
  if (typeof window.initReveal === 'function') {
    window.initReveal();
  }

  // ── Counter Animation ──
  const counters = document.querySelectorAll('.counter-value');
  if (counters.length > 0) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1800;
          const total = Math.round(duration / (1000 / 60));
          let frame = 0;
          const tick = () => {
            frame++;
            const ease = 1 - Math.pow(2, -10 * (frame / total));
            el.textContent = Math.round(target * ease).toLocaleString() + suffix;
            if (frame < total) requestAnimationFrame(tick);
            else el.textContent = target.toLocaleString() + suffix;
          };
          tick();
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  // ── Text Rotator (legacy) ──
  document.querySelectorAll('.text-rotator').forEach(rotator => {
    const items = rotator.querySelectorAll('.rotator-item');
    if (items.length > 1) {
      let idx = 0;
      setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
      }, 3500);
    }
  });

  // ── Solutions Accordion (legacy) ──
  const solPanels = document.querySelectorAll('.sol-panel');
  if (solPanels.length > 0) {
    const activate = p => { solPanels.forEach(x => x.classList.remove('active')); p.classList.add('active'); };
    solPanels.forEach(p => {
      p.addEventListener('mouseenter', () => activate(p));
      p.addEventListener('click', () => activate(p));
    });
  }

  // ── NEW: Mobile Nav (site-nav / #navHamburger) ──
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    // Inject a close (X) button into the mobile menu overlay
    let closeBtn = navLinks.querySelector('.nav-close');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'nav-close';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
      navLinks.prepend(closeBtn);
    }

    const collapseDropdowns = () => {
      navLinks.querySelectorAll('.nav-dropdown-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
    };
    const closeMenu = () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      collapseDropdowns();
    };

    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (!open) collapseDropdowns();
    });
    closeBtn.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });
  }

  // ── Dropdown keyboard/click toggle ──
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-dropdown-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
      trigger.setAttribute('aria-expanded', String(!expanded));
    });
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Escape') trigger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
    }
  });

  // ── Footer Copyright Year ──
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  // ── Active Nav Link ──
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a:not(.btn), .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    try {
      const lp = new URL(link.href, window.location.origin).pathname;
      if (path === lp || (path.endsWith('/') && lp.endsWith('index.html'))) {
        link.classList.add('active');
        const dd = link.closest('.nav-dropdown');
        if (dd) dd.querySelector('.nav-dropdown-trigger, .nav-link')?.classList.add('active');
      }
    } catch (e) {}
  });

  // ── Lazy Image Fade ──
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    const show = () => { img.style.opacity = '1'; };
    if (img.complete) show();
    else img.addEventListener('load', show);
  });

  // ── Hero Load Trigger ──
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    if (document.readyState === 'complete') heroSection.classList.add('loaded');
    else window.addEventListener('load', () => heroSection.classList.add('loaded'));
  }

  // ── Hero Typing Animation ──
  initHeroTyping();

});

function initHeroTyping() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSub   = document.querySelector('.hero-sub');
  if (!heroTitle) return;

  const LINE1     = 'We put your brand';
  const LINE2     = 'in the room.';
  const SPEED_H1  = 38;

  /* Phrases that replace the <em> every 20 s — max ~14 chars */
  const PHRASES   = [
    'in the room.',
    'on the shelf.',
    'face to face.',
    'across Africa.',
    'in their hands.',
  ];
  let phraseIdx = 0;
  const ROTATE_INTERVAL = 20000;

  heroTitle.innerHTML = '';

  const span1  = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';

  heroTitle.appendChild(span1);
  heroTitle.appendChild(cursor);
  heroTitle.style.opacity = '1';

  let idx = 0;

  function typeLine1() {
    if (idx < LINE1.length) {
      span1.textContent = LINE1.slice(0, ++idx);
      setTimeout(typeLine1, SPEED_H1);
    } else {
      const br = document.createElement('br');
      const em = document.createElement('em');
      em.setAttribute('aria-live', 'polite');
      heroTitle.insertBefore(br, cursor);
      heroTitle.insertBefore(em, cursor);
      idx = 0;
      setTimeout(function () { typeLine2(em); }, SPEED_H1 * 2);
    }
  }

  function typeLine2(em) {
    if (idx < LINE2.length) {
      em.textContent = LINE2.slice(0, ++idx);
      setTimeout(function () { typeLine2(em); }, SPEED_H1);
    } else {
      setTimeout(function () {
        cursor.classList.add('typing-cursor-fade');
        setTimeout(function () { cursor.remove(); }, 550);
        /* Start phrase rotation after typing finishes */
        startPhraseRotation(em);
      }, 420);
    }
  }

  function startPhraseRotation(em) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setInterval(function () {
      phraseIdx = (phraseIdx + 1) % PHRASES.length;

      if (reduced) {
        em.textContent = PHRASES[phraseIdx];
        return;
      }

      em.classList.add('phrase-out');
      setTimeout(function () {
        em.textContent = PHRASES[phraseIdx];
        em.classList.remove('phrase-out');
        em.classList.add('phrase-in');
        setTimeout(function () { em.classList.remove('phrase-in'); }, 450);
      }, 300);
    }, ROTATE_INTERVAL);
  }

  /* No label stagger delay needed anymore — start sooner */
  setTimeout(typeLine1, 120);
}

