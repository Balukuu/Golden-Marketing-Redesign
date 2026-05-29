# LinkedIn Sync Script

Automatically syncs all posts from the Golden Marketing LinkedIn company page into `js/linkedin-posts.js`.

## First-time setup

1. Open a terminal and navigate to this folder:
   ```
   cd "scripts"
   ```

2. Install dependencies:
   ```
   npm install
   npm run install-browser
   ```

## Syncing posts

Run this command from the `scripts/` folder:
```
npm run sync
```

Or from the project root:
```
node scripts/sync-linkedin.js
```

**What happens:**
1. A Chrome browser window opens and goes to the LinkedIn login page
2. Log in with your LinkedIn credentials (the script waits up to 3 minutes)
3. After login, the script navigates to the company page and scrolls through all posts
4. All post URNs are saved to `js/linkedin-posts.js`
5. The browser closes and you're done — deploy the updated file

## Adding a single post manually

If you only want to add one new post:

1. Open the post on LinkedIn
2. Click `…` → **Embed this post**
3. Copy the `src` URL from the iframe code. It looks like:
   ```
   https://www.linkedin.com/embed/feed/update/urn:li:share:7462855535663489024
   ```
4. The number at the end (`7462855535663489024`) is the URN
5. Open `js/linkedin-posts.js` and add the URN to the **top** of the array:
   ```js
   var LINKEDIN_POST_URNS = [
     '7462855535663489024',  // your new post
     '1234567890123456789',  // previous post
     ...
   ];
   ```
6. Save and deploy

## How the site uses these URNs

- **`news.html`** — shows all URNs as full LinkedIn embed iframes in a 2-column grid
- **`index.html`** — shows the top 3 URNs as teaser cards that link to news.html
