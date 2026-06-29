/* Golden Marketing — Hero Image Mosaic
 *
 * 9-cell editorial 3x4 grid. Draws from every photo on the site and
 * auto-rotates each cell with a crossfade every 5 seconds. The newest
 * photos are seeded into the opening frame.
 */

(function () {
  'use strict';

  const GRID_EL = document.querySelector('.hero-animated-grid');
  if (!GRID_EL) return;

  // On mobile/tablet (≤1024px) the grid is only a faint background texture.
  // Skip loading the full image set + rotation to save bandwidth/CPU.
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  // Opening frame: office strategy shot + a strong cross-brand spread.
  const NEW = [
    'images/services/strategy-1.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-1.webp',
    'images/work/shell/thumbs/shell-heads-up-1.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-1.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-1.webp',
    'images/work/ubl/thumbs/ubl-field-activations-1.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-1.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-1.webp',
    'images/work/shell/thumbs/shell-shell-expo-1.webp',
  ];

  // Every other photo used across the site.
  const REST = [
    'images/services/strategy-2.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-2.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-3.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-4.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-5.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-6.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-7.webp',
    'images/work/cocacola/thumbs/cocacola-coke-studio-8.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-1.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-2.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-3.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-4.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-5.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-6.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-7.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-8.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-movie-time-9.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-snacking-1.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-snacking-2.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-snacking-3.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-snacking-4.webp',
    'images/work/cocacola/thumbs/cocacola-fanta-snacking-5.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-2.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-3.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-4.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-5.webp',
    'images/work/cocacola/thumbs/cocacola-predator-roadshows-6.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-1.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-2.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-3.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-4.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-5.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-6.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-1.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-2.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-3.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-4.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-5.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-6.webp',
    'images/work/cocacola/thumbs/cocacola-rwenzori-marathon-launch-7.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-1.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-2.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-3.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-4.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-5.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-6.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-7.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-8.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-9.webp',
    'images/work/cocacola/thumbs/cocacola-world-freestyle-football-10.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-1.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-2.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-3.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-4.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-5.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-6.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-7.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-8.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-9.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-10.webp',
    'images/work/cocacola/thumbs/cocacola-retail-merchandising-11.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-2.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-3.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-4.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-5.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-6.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-7.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-8.webp',
    'images/work/latitude/thumbs/latitude-retail-and-sampling-9.webp',
    'images/work/unilever/thumbs/unilever-back-to-school-1.webp',
    'images/work/unilever/thumbs/unilever-back-to-school-2.webp',
    'images/work/unilever/thumbs/unilever-back-to-school-3.webp',
    'images/work/unilever/thumbs/unilever-back-to-school-4.webp',
    'images/work/unilever/thumbs/unilever-back-to-school-5.webp',
    'images/work/unilever/thumbs/unilever-dove-1.webp',
    'images/work/unilever/thumbs/unilever-dove-2.webp',
    'images/work/unilever/thumbs/unilever-dove-3.webp',
    'images/work/unilever/thumbs/unilever-dove-4.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-1.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-2.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-3.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-4.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-5.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-6.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-7.webp',
    'images/work/unilever/thumbs/unilever-hamper-promo-8.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-2.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-3.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-4.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-5.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-6.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-7.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-8.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-9.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-10.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-11.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-12.webp',
    'images/work/unilever/thumbs/unilever-roast-and-rhyme-13.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-2.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-3.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-4.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-5.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-6.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-7.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-8.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-9.webp',
    'images/work/unilever/thumbs/unilever-merchandising-modern-trade-10.webp',
    'images/work/unilever/thumbs/unilever-merchandising-general-trade-1.webp',
    'images/work/unilever/thumbs/unilever-merchandising-general-trade-2.webp',
    'images/work/unilever/thumbs/unilever-merchandising-general-trade-3.webp',
    'images/work/ubl/thumbs/ubl-field-activations-2.webp',
    'images/work/ubl/thumbs/ubl-field-activations-3.webp',
    'images/work/ubl/thumbs/ubl-field-activations-4.webp',
    'images/work/ubl/thumbs/ubl-field-activations-5.webp',
    'images/work/ubl/thumbs/ubl-field-activations-6.webp',
    'images/work/ubl/thumbs/ubl-field-activations-7.webp',
    'images/work/ubl/thumbs/ubl-field-activations-8.webp',
    'images/work/shell/thumbs/shell-heads-up-2.webp',
    'images/work/shell/thumbs/shell-heads-up-3.webp',
    'images/work/shell/thumbs/shell-heads-up-4.webp',
    'images/work/shell/thumbs/shell-heads-up-5.webp',
    'images/work/shell/thumbs/shell-heads-up-6.webp',
    'images/work/shell/thumbs/shell-heads-up-7.webp',
    'images/work/shell/thumbs/shell-heads-up-8.webp',
    'images/work/shell/thumbs/shell-heads-up-9.webp',
    'images/work/shell/thumbs/shell-heads-up-10.webp',
    'images/work/shell/thumbs/shell-heads-up-11.webp',
    'images/work/shell/thumbs/shell-heads-up-12.webp',
    'images/work/shell/thumbs/shell-heads-up-13.webp',
    'images/work/shell/thumbs/shell-heads-up-14.webp',
    'images/work/shell/thumbs/shell-heads-up-15.webp',
    'images/work/shell/thumbs/shell-shell-expo-2.webp',
    'images/work/shell/thumbs/shell-shell-expo-3.webp',
    'images/work/shell/thumbs/shell-shell-expo-4.webp',
    'images/work/shell/thumbs/shell-shell-expo-5.webp',
    'images/work/shell/thumbs/shell-shell-expo-6.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-1.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-2.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-3.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-4.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-5.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-6.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-7.webp',
    'images/work/shell/thumbs/shell-fuel-on-the-go-8.webp',
    'images/work/shell/thumbs/shell-rimula-oils-1.webp',
    'images/work/shell/thumbs/shell-rimula-oils-2.webp',
    'images/work/shell/thumbs/shell-rimula-oils-3.webp',
    'images/work/shell/thumbs/shell-rimula-oils-4.webp',
    'images/work/shell/thumbs/shell-rimula-oils-5.webp',
    'images/work/shell/thumbs/shell-rimula-oils-6.webp',
    'images/work/shell/thumbs/shell-rimula-oils-7.webp',
    'images/work/shell/thumbs/shell-rimula-oils-8.webp',
    'images/work/shell/thumbs/shell-rimula-oils-9.webp',
    'images/work/shell/thumbs/shell-rimula-oils-10.webp',
    'images/work/shell/thumbs/shell-forecourt-merchandising-1.webp',
    'images/work/shell/thumbs/shell-forecourt-merchandising-2.webp',
    'images/work/shell/thumbs/shell-forecourt-merchandising-3.webp',
    'images/work/shell/thumbs/shell-forecourt-merchandising-4.webp',
    'images/work/shell/thumbs/shell-forecourt-merchandising-5.webp',
  ];

  const POOL = NEW.concat(REST);

  // Crop overrides for a couple of photos with top text banners.
  function positionFor(src) {
    return 'center';
  }

  /* 9-cell balanced layout for a 3x4 grid */
  const LAYOUT = [
    { rowSpan: 2, colSpan: 1 }, // tall left
    { rowSpan: 1, colSpan: 1 },
    { rowSpan: 1, colSpan: 1 },
    { rowSpan: 2, colSpan: 1 }, // tall right
    { rowSpan: 1, colSpan: 1 },
    { rowSpan: 1, colSpan: 1 },
    { rowSpan: 1, colSpan: 1 },
    { rowSpan: 1, colSpan: 2 }, // wide bottom-left
    { rowSpan: 1, colSpan: 1 },
  ];

  const KB = ['kb-0', 'kb-1', 'kb-2', 'kb-3'];
  const ROTATE_MS = 5000;
  const FADE_MS = 1200;

  const cells = [];          // { wrap, kb, current }
  let bag = [];              // shuffled queue we draw from

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Pull the next image not currently on screen.
  function pullNext(onScreen) {
    for (let attempts = 0; attempts < POOL.length + 1; attempts++) {
      if (bag.length === 0) bag = shuffle(POOL);
      const src = bag.pop();
      if (onScreen.indexOf(src) === -1) return src;
    }
    return bag.pop() || POOL[0];
  }

  function makeLayer(src, kbIndex) {
    const inner = document.createElement('div');
    inner.className = 'hero-grid-img ' + KB[kbIndex % KB.length];
    inner.style.backgroundImage = 'url(' + src + ')';
    inner.style.backgroundPosition = positionFor(src);
    inner.style.animationDuration = (16 + Math.random() * 10).toFixed(1) + 's';
    inner.style.animationDelay = '-' + (Math.random() * 20).toFixed(1) + 's';
    return inner;
  }

  function buildGrid() {
    // Opening frame: all the new photos + fill to 9 from the rest.
    const opening = shuffle(NEW).concat(shuffle(REST)).slice(0, LAYOUT.length);
    bag = shuffle(POOL);

    LAYOUT.forEach(function (def, i) {
      const cell = document.createElement('div');
      cell.className = 'hero-grid-cell';
      if (def.rowSpan > 1) cell.style.gridRow = 'span ' + def.rowSpan;
      if (def.colSpan > 1) cell.style.gridColumn = 'span ' + def.colSpan;

      const wrap = document.createElement('div');
      wrap.className = 'hero-grid-img-wrap';

      const src = opening[i];
      wrap.appendChild(makeLayer(src, i));

      cell.appendChild(wrap);
      GRID_EL.appendChild(cell);
      cells.push({ cell: cell, wrap: wrap, kb: i, current: src });
    });
  }

  function swapCell(c, src) {
    const layer = makeLayer(src, c.kb);
    layer.style.opacity = '0';
    layer.style.transition = 'opacity ' + FADE_MS + 'ms ease';
    c.wrap.appendChild(layer);

    // force reflow so the transition runs
    void layer.offsetWidth;
    layer.style.opacity = '1';

    const old = c.wrap.firstChild;
    setTimeout(function () {
      if (old && old !== layer && old.parentNode === c.wrap) c.wrap.removeChild(old);
    }, FADE_MS + 60);

    c.current = src;
  }

  function rotate() {
    if (document.hidden) return; // don't churn while tab is in the background
    const onScreen = cells.map(function (c) { return c.current; });
    cells.forEach(function (c, i) {
      const next = pullNext(onScreen);
      onScreen[i] = next; // reserve so siblings don't grab the same one this tick
      setTimeout(function () { swapCell(c, next); }, i * 130); // gentle stagger
    });
  }

  function revealCells() {
    cells.forEach(function (c, i) {
      setTimeout(function () { c.cell.classList.add('active'); }, 160 + i * 100);
    });
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  buildGrid();

  if (prefersReduced) {
    cells.forEach(function (c) { c.cell.classList.add('active'); });
    return; // no auto-rotation when reduced motion is requested
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(revealCells);
  });

  setInterval(rotate, ROTATE_MS);
})();
