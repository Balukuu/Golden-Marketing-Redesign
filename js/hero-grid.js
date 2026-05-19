/* Golden Marketing — Hero Image Mosaic
 *
 * 2-column editorial grid, 5 cells:
 *   [  tall  ] [ sm ]
 *   [ (cont) ] [ sm ]
 *   [ sm     ] [ sm ]
 */

(function () {
  'use strict';

  const GRID_EL = document.querySelector('.hero-animated-grid');
  if (!GRID_EL) return;

  const POOL = [
    'Images/Activations/GM-28.jpg',
    'Images/Merchandising/GM-1.jpg',
    'Images/Activations/ASK_8274.jpg',
    'Images/Activations/GM-64.jpg',
    'Images/Activations/GM-70.jpg',
    'Images/Merchandising/IMG_9003.jpg',
    'Images/Activations/GM-88.jpg',
    'Images/Activations/ASK_8157.jpg',
    'Images/Activations/GM-49.jpg',
    'Images/Merchandising/IMG_9100.jpg',
    'Images/Activations/IMG_0142.jpg',
    'Images/Activations/GM-41.jpg',
  ];

  /* 5-cell layout — cell 0 spans rows 1-2 (tall anchor) */
  const LAYOUT = [
    { rowSpan: 2 },
    { rowSpan: 1 },
    { rowSpan: 1 },
    { rowSpan: 1 },
    { rowSpan: 1 },
  ];

  const KB = ['kb-0', 'kb-1', 'kb-2', 'kb-3'];
  const cells = [];

  function buildGrid() {
    const shuffled = [...POOL].sort(() => Math.random() - 0.5);

    LAYOUT.forEach(function (def, i) {
      const cell = document.createElement('div');
      cell.className = 'hero-grid-cell';
      if (def.rowSpan === 2) cell.style.gridRow = 'span 2';

      const inner = document.createElement('div');
      inner.className = 'hero-grid-img ' + KB[i % KB.length];
      inner.style.backgroundImage = 'url(' + shuffled[i % shuffled.length] + ')';
      inner.style.animationDuration = (16 + Math.random() * 10).toFixed(1) + 's';
      inner.style.animationDelay = '-' + (Math.random() * 20).toFixed(1) + 's';

      cell.appendChild(inner);
      GRID_EL.appendChild(cell);
      cells.push({ cell: cell });
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
    return;
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(revealCells);
  });
})();
