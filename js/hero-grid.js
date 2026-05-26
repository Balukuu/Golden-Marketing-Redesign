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

  // On mobile/tablet (≤1024px) the grid is rendered as a faint background texture
  // at opacity 0.14. Skip loading 12 Drive images to save ~1.2 MB on mobile.
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  const POOL = [
    'https://drive.google.com/thumbnail?id=1QH6aIDXuwtsWpQqTk7OC2yQZBRfxaOgG&sz=w1000', // GM-28.jpg
    'https://drive.google.com/thumbnail?id=1gYZOHoGl4l-a9X4WdKDszzkN76JWBSA7&sz=w1000', // GM-1.jpg
    'https://drive.google.com/thumbnail?id=1Wr4lk5UBo2erCXd52E_F9nVsx5vot35U&sz=w1000', // ASK_8274.jpg
    'https://drive.google.com/thumbnail?id=1Jjpg_WpI8UpUvp0jgN7KA02_S4zQVTph&sz=w1000', // GM-64.jpg
    'https://drive.google.com/thumbnail?id=1lDwNqoyNNHH0esW4t3W6pmu-yxuhFgG7&sz=w1000', // GM-70.jpg
    'https://drive.google.com/thumbnail?id=1bEdRvWtFmky3cN_dvclKjfaEXkMYBxHR&sz=w1000', // IMG_9003.jpg
    'https://drive.google.com/thumbnail?id=1sD5THGA-hcg3WHW4W56SWubqaE9zYbnZ&sz=w1000', // GM-88.jpg
    'https://drive.google.com/thumbnail?id=1PSHKXrFQqadUB9KPplE8WYo7aUF1IU9Y&sz=w1000', // ASK_8157.jpg
    'https://drive.google.com/thumbnail?id=1q73yIbzdTZXSOF8JwiqujvF3d35sBuHC&sz=w1000', // GM-49.jpg
    'https://drive.google.com/thumbnail?id=1GUdbBgsSTfGOU9RaigUSBJhP00TYgtDo&sz=w1000', // IMG_9100.jpg
    'https://drive.google.com/thumbnail?id=13t5p3cTmfjIi40RGH2QnFhpwpfmP6_io&sz=w1000', // IMG_0142.jpg
    'https://drive.google.com/thumbnail?id=1VgkFMkM2ceAh-uZQYPNqIi7yNWAQXLsV&sz=w1000', // GM-41.jpg
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
      if (imgSrc.includes('1gYZOHoGl4l-a9X4WdKDszzkN76JWBSA7')) {
        inner.style.backgroundPosition = 'center 85%';
      } else if (imgSrc.includes('1GUdbBgsSTfGOU9RaigUSBJhP00TYgtDo')) {
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
