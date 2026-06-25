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

  // Newest photos first — these are seeded into the opening frame.
  const NEW = [
    'images/thumbs/coca-cola-merch-1.jpg',
    'images/thumbs/coca-cola-merch-2.jpg',
    'images/thumbs/coca-cola-merch-3.jpg',
    'images/thumbs/coca-cola-merch-4.jpg',
    'images/thumbs/coca-cola-merch-5.jpg',
    'images/thumbs/coca-cola-merch-6.jpg',
    'images/thumbs/coca-cola-merch-7.jpg',
  ];

  // Every other photo used across the site.
  const REST = [
    'images/thumbs/1-NzZjw1Q1bU0nesEVOGPKipKfXDorFaQ.jpg',
    'images/thumbs/10XM3tn0J6uZ7GilGEeOYyfk7213UCo2P.jpg',
    'images/thumbs/122ytWqfNj2vAzcR9k0QzFoFJ8hmsit8k.jpg',
    'images/thumbs/12Jk8LpG-TQ0H7K0sy9xgttZP1AKrH52Y.jpg',
    'images/thumbs/12Qxm7xgTTeYRSxqA3pqWrnWNc9eOww5-.jpg',
    'images/thumbs/12le0QpiUQZ1KzVIrhSnYlmNjhXfmN4-_.jpg',
    'images/thumbs/12pIfeyc7PuxTeBu0v4uk2NHGoszAZ694.jpg',
    'images/thumbs/13t5p3cTmfjIi40RGH2QnFhpwpfmP6_io.jpg',
    'images/thumbs/15NTXOzbzlhVYlFKGqPmg4KDw_BkJOhol.jpg',
    'images/thumbs/15Wc_3UAVPQLKyKiMXqI6xjMdJzBejO3L.jpg',
    'images/thumbs/16bQ3SdA8u1Tg07tjXRAaBfOhf6GhrJL4.jpg',
    'images/thumbs/17GJG3qhubJQ25dUxBEU61LSppGRi_TZV.jpg',
    'images/thumbs/17bncoA75hh0rXPdMhBCiTYIlWbpCTU2j.jpg',
    'images/thumbs/17k_5q4P5kTJj6mDLQlqjMJM5ngKH2FoW.jpg',
    'images/thumbs/17tCDzYFsfhEufNdULo6tFJcLhTPeGKx4.jpg',
    'images/thumbs/18-IFeoJoKpW8kqsfyRE-ItxDRZuYcCgV.jpg',
    'images/thumbs/184iE79SA8GUgbJbhSxYldEO-IgDSsTrq.jpg',
    'images/thumbs/1AKITaz89s1vLWcz93PZeGXSUlw3hV9EO.jpg',
    'images/thumbs/1CN-0UzabliTymEIp_kecIFcU9eikuqeq.jpg',
    'images/thumbs/1DWPkcmJSA3zrfXf1H6hEtDrLLVkOYIi0.jpg',
    'images/thumbs/1EWpV-TvgyDiF_vA6C4phU1wLkaFrA-FJ.jpg',
    'images/thumbs/1EejIuqNVxL0soXrYNaX5sJfpv-jSLs-1.jpg',
    'images/thumbs/1EluGosJGRioG_g4xAYM_05i9ERCeh0WS.jpg',
    'images/thumbs/1FJ4qYbRCRkBrFvQqDDneSqhAygNPk2Wk.jpg',
    'images/thumbs/1FcQIa5sZQM5LVs6yAj48fwqeKuIW-f31.jpg',
    'images/thumbs/1FezemIhOGOvE5uUsjTVpk7J_HpbCkcTU.jpg',
    'images/thumbs/1FfZScRg7HBpaQkmqbJQBVoCSx_Z-_FHT.jpg',
    'images/thumbs/1GUdbBgsSTfGOU9RaigUSBJhP00TYgtDo.jpg',
    'images/thumbs/1H3WGp6grVjs7ykNAVbmBRq6E4iAKzNul.jpg',
    'images/thumbs/1Jjpg_WpI8UpUvp0jgN7KA02_S4zQVTph.jpg',
    'images/thumbs/1KBiYc0dwdGfsNfFmGsWIso2mjS3hf_Uq.jpg',
    'images/thumbs/1LdXI-jS3za4x3EtHE7LjuMKhB2Ztkj4Q.jpg',
    'images/thumbs/1Mm7r4dMaqz-7QdxepTpzLkYaT4If0Uu_.jpg',
    'images/thumbs/1NaeGO0wIy-4fEv0qIStYOEWVAWp_zwv9.jpg',
    'images/thumbs/1OiErKzp79it0VCcb9Y98qEI4qHOC4GRj.jpg',
    'images/thumbs/1PSHKXrFQqadUB9KPplE8WYo7aUF1IU9Y.jpg',
    'images/thumbs/1QH6aIDXuwtsWpQqTk7OC2yQZBRfxaOgG.jpg',
    'images/thumbs/1R1W-8Lccpdq_G_4cqnXU811Njq7Qqp-k.jpg',
    'images/thumbs/1RGykIrA5kypnirnYVsscY76A4pz2gntH.jpg',
    'images/thumbs/1S_xm-x-tDjqDhWe_YnXxVgoD-yxxxpY6.jpg',
    'images/thumbs/1SriZQ0RdIgTzlo8XdFwMmwRS4GhCY5oD.jpg',
    'images/thumbs/1Ssd1N4OKqUfH8WjoNIYawVtdKhzwU0eE.jpg',
    'images/thumbs/1TR5jQxzMQHQCgKY9C-eb74h-09cZw-xP.jpg',
    'images/thumbs/1TXED50jj09q2gZ8YjnT_Zl4pY0HcWIEr.jpg',
    'images/thumbs/1T_iLUv_Lp7h_0KKhKp3GRsn5Hy2QJ0bU.jpg',
    'images/thumbs/1TaGatT7hf2aL-l3QgCEB7yogZB-JeA8F.jpg',
    'images/thumbs/1Tx_XByaIcSS8ruPfiGVzt-3m4XKnzih_.jpg',
    'images/thumbs/1VgkFMkM2ceAh-uZQYPNqIi7yNWAQXLsV.jpg',
    'images/thumbs/1WbFb5N1FWklb8UD1K6vDL7IqNpx7tvul.jpg',
    'images/thumbs/1Wr4lk5UBo2erCXd52E_F9nVsx5vot35U.jpg',
    'images/thumbs/1Y3Bfi0_TLoCiZYdE8Q-XGNZ8aSikOnZs.jpg',
    'images/thumbs/1_AcBJKbed8lI1fkAkfbI3isSmgt8YX9j.jpg',
    'images/thumbs/1azkXTXKdrsfNMTxLhxThszgu852xyOr1.jpg',
    'images/thumbs/1bEdRvWtFmky3cN_dvclKjfaEXkMYBxHR.jpg',
    'images/thumbs/1bbZW7QnTv5iwjKO5rtL8AhxYbT0D2HB1.jpg',
    'images/thumbs/1c26DQE4pcApdkA2zRFJlE3JvOI8Jl-aP.jpg',
    'images/thumbs/1ccNoF2ZH-ydCyzgnX_363rFf417RUxW0.jpg',
    'images/thumbs/1dAZ8P3LOjGjm4giZPMaxDO8kObBCP8e1.jpg',
    'images/thumbs/1dT-pqHszDQEC23c5vFUoACZF8fnzVTCP.jpg',
    'images/thumbs/1duZeGkBR2v5IScfB_HbhA1QSaMkBs3Or.jpg',
    'images/thumbs/1fBsUtq_TRUZm61MyUqtDHHDbIzhSVcq2.jpg',
    'images/thumbs/1gHSvLGAbWev_Zror4EaZI4QS67v7y3Xw.jpg',
    'images/thumbs/1gPkXfxPrBklY-L4doNcx0Bc-JJs57Aiw.jpg',
    'images/thumbs/1gYZOHoGl4l-a9X4WdKDszzkN76JWBSA7.jpg',
    'images/thumbs/1j-iko37HgOKYl-4mqcBys751EIa2qy7m.jpg',
    'images/thumbs/1k9bDTgxjaYuhBj3cpo1j0ScZhdp8knf7.jpg',
    'images/thumbs/1l0k7hrdmazWD-GpMz7LV8rSPyT7tWa4I.jpg',
    'images/thumbs/1lDwNqoyNNHH0esW4t3W6pmu-yxuhFgG7.jpg',
    'images/thumbs/1lYwKE3s7hzUuGDyq23cMbE1DTsma4wDO.jpg',
    'images/thumbs/1mAMyfYn_xL9h6Ua0oNHizFpo78wnpDPu.jpg',
    'images/thumbs/1n0napyexKvPOilWTxh13AI5L0jJkZscD.jpg',
    'images/thumbs/1nhv1VlbPlpxMmtU2_IKdsujHhMU0eEI0.jpg',
    'images/thumbs/1oSaHfWGQkG73V9V-xnh3_e0qDqW1tJJh.jpg',
    'images/thumbs/1psAEag1BHsdYIrwxIy1Ww5SJ1ZTQEyKn.jpg',
    'images/thumbs/1q73yIbzdTZXSOF8JwiqujvF3d35sBuHC.jpg',
    'images/thumbs/1rLHidERZwfRgHSLIuRDY1UnP7yRhGaKU.jpg',
    'images/thumbs/1sD5THGA-hcg3WHW4W56SWubqaE9zYbnZ.jpg',
    'images/thumbs/1tMpPKV5DiQUf7ZUITScF1pcCg9X8d-rZ.jpg',
    'images/thumbs/1tu3a2qV5M4_7m-tHwFW1J0Kus6CJ0jqb.jpg',
    'images/thumbs/1u0rOyAJMdg5Vp4-0JMhS_KScHWXF8NUW.jpg',
    'images/thumbs/1uXBTmcSgBF79EaJgLljPtPxto62Vnrv3.jpg',
    'images/thumbs/1vM5VnG8Vf_qkSTMQgtyv1i7NQBIqw8T1.jpg',
    'images/thumbs/1vjtdQAXioimw4vkg4vTrKVawzvb0YFD_.jpg',
    'images/thumbs/1xIj5WcFwf6ezzm5v8jxyqI9V6TUT4X5L.jpg',
    'images/thumbs/1xMWnBHjVrTg1deD8tV4vv_KtOnYaTlof.jpg',
    'images/thumbs/1ymV8NXISZl5rsVqaHTzsA81z6fiO-C01.jpg',
    'images/thumbs/1zHsIFqCzOeexPPLpaNdl7A80O37kX8Om.jpg',
  ];

  const POOL = NEW.concat(REST);

  // Crop overrides for a couple of photos with top text banners.
  function positionFor(src) {
    if (src.indexOf('1gYZOHoGl4l-a9X4WdKDszzkN76JWBSA7') !== -1) return 'center 85%';
    if (src.indexOf('1GUdbBgsSTfGOU9RaigUSBJhP00TYgtDo') !== -1) return 'center bottom';
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
