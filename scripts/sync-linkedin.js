/**
 * sync-linkedin.js — Golden Marketing Uganda
 * ─────────────────────────────────────────────────────────────
 * Automatically scrapes the Golden Marketing LinkedIn company page
 * for all post share URNs, then writes js/linkedin-posts.js.
 *
 * REQUIREMENTS:
 *   npm install playwright
 *   npx playwright install chromium
 *
 * USAGE:
 *   node scripts/sync-linkedin.js
 *
 * The browser window opens so you can log in to LinkedIn if needed.
 * Once the page loads, the script scrolls and collects all post URNs.
 * ─────────────────────────────────────────────────────────────
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const COMPANY_POSTS_URL = 'https://www.linkedin.com/company/golden-marketing-agency/posts/';
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'linkedin-posts.js');

// How many times to scroll down looking for more posts (each scroll ~2-3 posts)
const MAX_SCROLLS = 20;
// Milliseconds to wait after each scroll for content to load
const SCROLL_WAIT_MS = 2500;

async function scrapeLinkedIn() {
  console.log('Launching browser (headed so you can log in if required)...');
  const browser = await chromium.launch({ headless: false, slowMo: 50 });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  // ── Step 1: Go to login page ──────────────────────────────────
  console.log('Opening LinkedIn login...');
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });

  console.log('\n>>> Please log in to LinkedIn in the browser window.');
  console.log('>>> Once you see your feed/home page, the script will continue automatically.\n');

  // Wait until we reach a logged-in page (feed or company page redirect)
  try {
    await page.waitForURL(url => !url.includes('/login') && !url.includes('/checkpoint'), {
      timeout: 180000, // 3 minutes for manual login
    });
    console.log('Login detected. Navigating to company page...');
  } catch {
    console.error('Timed out waiting for login. Please try again.');
    await browser.close();
    process.exit(1);
  }

  // ── Step 2: Navigate to company posts page ────────────────────
  await page.goto(COMPANY_POSTS_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // ── Step 3: Scroll and collect URNs ──────────────────────────
  const urnSet = new Set();

  for (let scroll = 0; scroll <= MAX_SCROLLS; scroll++) {
    // Collect all post links visible on page
    const found = await page.evaluate(() => {
      const links  = Array.from(document.querySelectorAll('a[href]'));
      const results = [];

      links.forEach(a => {
        const href = a.href || '';

        // Pattern 1: /posts/...activity-XXXXXXXXX-xxxx/
        const actMatch = href.match(/activity[-:](\d{15,20})/i);
        if (actMatch) results.push(actMatch[1]);

        // Pattern 2: /feed/update/urn:li:share:XXXXXXXXX
        const shareMatch = href.match(/urn:li:(?:share|activity):(\d{15,20})/i);
        if (shareMatch) results.push(shareMatch[1]);
      });

      // Also check data attributes on post containers
      document.querySelectorAll('[data-urn],[data-id]').forEach(el => {
        const val = el.getAttribute('data-urn') || el.getAttribute('data-id') || '';
        const m = val.match(/\d{15,20}/);
        if (m) results.push(m[0]);
      });

      return results;
    });

    found.forEach(u => urnSet.add(u));
    console.log(`Scroll ${scroll + 1}/${MAX_SCROLLS + 1} — found ${urnSet.size} unique URNs so far`);

    if (scroll < MAX_SCROLLS) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await page.waitForTimeout(SCROLL_WAIT_MS);
    }
  }

  await browser.close();

  // ── Step 4: Write linkedin-posts.js ──────────────────────────
  if (urnSet.size === 0) {
    console.warn('\nNo URNs found. LinkedIn may have required login or the page structure changed.');
    console.warn('Try logging in manually and re-running, or add URNs manually to js/linkedin-posts.js');
    process.exit(1);
  }

  const urns = [...urnSet];
  console.log(`\nCollected ${urns.length} post URN(s). Writing ${OUTPUT_FILE}...`);

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const urnLines = urns.map((u, i) => `  '${u}',${i === 0 ? '  // newest post' : ''}`).join('\n');

  const content =
`/**
 * linkedin-posts.js — Golden Marketing Uganda
 * ─────────────────────────────────────────────────────────────
 * LinkedIn post URNs in newest-first order.
 * These are rendered as official LinkedIn embed iframes on:
 *   - news.html      (full embeds, all posts)
 *   - index.html     (teaser cards, top 3)
 *
 * HOW TO ADD A POST MANUALLY:
 *   1. Open the post on LinkedIn.
 *   2. Click "…" → "Embed this post".
 *   3. Copy the iframe src URL. It looks like:
 *      https://www.linkedin.com/embed/feed/update/urn:li:share:XXXXXXXXXXXXXXXXX
 *   4. The number at the end is the URN. Add it to the TOP of the array below.
 *
 * HOW TO SYNC ALL POSTS AUTOMATICALLY:
 *   Run: node scripts/sync-linkedin.js
 *   (Requires Node.js + Playwright — see scripts/README.md)
 *
 * LinkedIn Company: https://www.linkedin.com/company/golden-marketing-agency/
 * Last synced: ${date}
 * ─────────────────────────────────────────────────────────────
 */

var LINKEDIN_POST_URNS = [
${urnLines}
];
`;

  fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
  console.log(`Done. ${urns.length} post(s) written to ${OUTPUT_FILE}`);
  console.log('\nNext steps:');
  console.log('  1. Open news.html and index.html in a browser to verify the posts load.');
  console.log('  2. Commit and deploy the updated js/linkedin-posts.js file.');
}

scrapeLinkedIn().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
