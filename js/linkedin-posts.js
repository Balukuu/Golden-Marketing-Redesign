/**
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
 * Last synced: May 2026
 * ─────────────────────────────────────────────────────────────
 */

var LINKEDIN_POST_URNS = [
  '7462855535663489024',  // May 2026 — latest post
  // Add older post URNs below this line, newest first:
];
