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

  /* 9-cell balanced layout for a 3x4 grid */
  const LAYOUT = [
    { rowSpan: 2, colSpan: 1 }, // Cell 0: tall left
    { rowSpan: 1, colSpan: 1 }, // Cell 1: row 1, col 2
    { rowSpan: 1, colSpan: 1 }, // Cell 2: row 1, col 3
    { rowSpan: 2, colSpan: 1 }, // Cell 3: tall right
    { rowSpan: 1, colSpan: 1 }, // Cell 4: row 2, col 2
    { rowSpan: 1, colSpan: 1 }, // Cell 5: row 3, col 1
    { rowSpan: 1, colSpan: 1 }, // Cell 6: row 3, col 2
    { rowSpan: 1, colSpan: 2 }, // Cell 7: wide bottom-left
    { rowSpan: 1, colSpan: 1 }, // Cell 8: bottom-right
  ];

  const KB = ['kb-0', 'kb-1', 'kb-2', 'kb-3'];
  const cells = [];

  function buildGrid() {
    const shuffled = [...POOL].sort(() => Math.random() - 0.5);

    LAYOUT.forEach(function (def, i) {
      const cell = document.createElement('div');
      cell.className = 'hero-grid-cell';
      if (def.rowSpan > 1) cell.style.gridRow = 'span ' + def.rowSpan;
      if (def.colSpan > 1) cell.style.gridColumn = 'span ' + def.colSpan;

      const wrap = document.createElement('div');
      wrap.className = 'hero-grid-img-wrap';

      const inner = document.createElement('div');
      inner.className = 'hero-grid-img ' + KB[i % KB.length];
      const imgSrc = shuffled[i % shuffled.length];
      inner.style.backgroundImage = 'url(' + imgSrc + ')';
      
      // Override background position for specific images to crop out top-cut text banners
      if (imgSrc.includes('GM-1.jpg')) {
        inner.style.backgroundPosition = 'center 85%';
      } else if (imgSrc.includes('IMG_9100.jpg')) {
        inner.style.backgroundPosition = 'center bottom';
      }

      inner.style.animationDuration = (16 + Math.random() * 10).toFixed(1) + 's';
      inner.style.animationDelay = '-' + (Math.random() * 20).toFixed(1) + 's';

      wrap.appendChild(inner);
      cell.appendChild(wrap);
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
