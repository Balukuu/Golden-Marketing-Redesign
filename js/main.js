/**
 * Golden Marketing Uganda — Main Script v3.0
 * Keeps all existing behaviours; adds new nav + lazy image logic.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Reveal ──
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revObs.observe(el));
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
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
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

  // ── LEGACY: Mobile Menu Toggle (#menuToggle) ──
  const menuToggle = document.getElementById('menuToggle');
  const legacyNav  = menuToggle ? document.getElementById('navLinks') : null;
  if (menuToggle && legacyNav && !hamburger) {
    menuToggle.addEventListener('click', () => {
      legacyNav.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      const open  = legacyNav.classList.contains('active');
      spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
      if (spans[1]) spans[1].style.opacity = open ? '0' : '1';
      if (spans[2]) spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    legacyNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (legacyNav.classList.contains('active')) menuToggle.click();
      });
    });
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
  const SPEED_SUB = 14;

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

  const subText = heroSub
    ? heroSub.textContent.trim().replace(/\s+/g, ' ')
    : '';

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
        if (heroSub && subText) {
          setTimeout(function () { typeSubText(heroSub, subText, SPEED_SUB); }, 200);
        }
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

  function typeSubText(el, text, speed) {
    const subHeight = el.offsetHeight;
    el.style.minHeight = subHeight + 'px';

    el.innerHTML = '';
    el.style.opacity = '1';

    const textNode  = document.createTextNode('');
    const subCursor = document.createElement('span');
    subCursor.className = 'typing-cursor typing-cursor--sm';
    el.appendChild(textNode);
    el.appendChild(subCursor);

    let i = 0;
    function typeChar() {
      if (i < text.length) {
        textNode.textContent = text.slice(0, ++i);
        setTimeout(typeChar, speed);
      } else {
        setTimeout(function () {
          subCursor.classList.add('typing-cursor-fade');
          el.style.minHeight = '';
          setTimeout(function () { subCursor.remove(); }, 600);
        }, 500);
      }
    }
    typeChar();
  }

  /* No label stagger delay needed anymore — start sooner */
  setTimeout(typeLine1, 120);
}
