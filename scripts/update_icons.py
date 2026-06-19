import os
import re
import glob

footer_socials_root = """          <div class="footer-socials">
            <a href="https://www.facebook.com/GoldenMarketingUganda" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/goldenmarketingug" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://wa.me/256393112860" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a href="https://www.linkedin.com/company/golden-marketing-uganda" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>"""

def process_files(files, is_root):
    socials_regex = re.compile(r'<div class="footer-socials">.*?</div>', re.DOTALL)
    favicon_str = '<link rel="icon" type="image/png" href="favicon.png">' if is_root else '<link rel="icon" type="image/png" href="../favicon.png">'
    
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = socials_regex.sub(footer_socials_root, content)
        
        if '<link rel="icon"' not in new_content:
            new_content = new_content.replace('</head>', f'  {favicon_str}\n</head>')
        else:
            new_content = re.sub(r'<link rel="icon"[^>]*>', favicon_str, new_content)
            
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")

root_files = glob.glob("e:/Blactec Projects/GM website/Golden Marketing Redesign/*.html")
process_files(root_files, True)

services_files = glob.glob("e:/Blactec Projects/GM website/Golden Marketing Redesign/services/*.html")
process_files(services_files, False)

# Also update CSS for gap
css_path = "e:/Blactec Projects/GM website/Golden Marketing Redesign/css/style.css"
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Increase gap for icons slightly
new_css = css_content.replace('.footer-socials { display: flex; gap: 16px; flex-wrap: wrap; }', '.footer-socials { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }')
if css_content != new_css:
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_css)
    print("Updated style.css for footer-socials gap")
