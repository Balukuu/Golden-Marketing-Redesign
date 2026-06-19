import os
import re
import glob

# The exact footer block for root pages
footer_root = """  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" aria-label="Home">
            <img src="gm22.png" alt="Golden Marketing" class="footer-logo">
          </a>
          <p>East Africa's field marketing agency.<br>Uganda &middot; Kenya &middot; Tanzania &middot; Zambia &middot; Rwanda &middot; Mozambique</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/GoldenMarketingUganda" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/goldenmarketingug" target="_blank" rel="noopener">Instagram</a>
            <a href="https://wa.me/256393112860" target="_blank" rel="noopener">WhatsApp</a>
            <a href="https://www.linkedin.com/company/golden-marketing-uganda" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Services</h5>
          <ul>
            <li><a href="services/merchandising.html">Merchandising</a></li>
            <li><a href="services/field-activations.html">Field Activations</a></li>
            <li><a href="services/dynamic-roadshows.html">Dynamic Roadshows</a></li>
            <li><a href="services/events-management.html">Events Management</a></li>
            <li><a href="services/field-automation-surveys.html">Field Intelligence</a></li>
            <li><a href="services/retail-audit.html">Retail Audit</a></li>
            <li><a href="services/distribution-sales.html">Distribution &amp; Sales</a></li>
            <li><a href="services/strategy.html">Strategy</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="our-work.html">Our Work</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="careers.html">Careers</a></li>
          </ul>
          <h5 style="margin-top:28px;">Contact</h5>
          <ul>
            <li><a href="tel:+256393112860">+256 39 3112860</a></li>
            <li><a href="mailto:office@goldenmarketing.co.ug">office@goldenmarketing.co.ug</a></li>
            <li><a href="contact.html">Send a Brief</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="footerYear">2025</span> Golden Marketing Limited</span>
        <span><a href="https://blactec.ug" target="_blank" rel="noopener">Designed by BlacTec</a></span>
      </div>
    </div>
  </footer>"""

# The exact footer block for pages inside services/
footer_services = """  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="../index.html" aria-label="Home">
            <img src="../gm22.png" alt="Golden Marketing" class="footer-logo">
          </a>
          <p>East Africa's field marketing agency.<br>Uganda &middot; Kenya &middot; Tanzania &middot; Zambia &middot; Rwanda &middot; Mozambique</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/GoldenMarketingUganda" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/goldenmarketingug" target="_blank" rel="noopener">Instagram</a>
            <a href="https://wa.me/256393112860" target="_blank" rel="noopener">WhatsApp</a>
            <a href="https://www.linkedin.com/company/golden-marketing-uganda" target="_blank" rel="noopener">LinkedIn</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>Services</h5>
          <ul>
            <li><a href="merchandising.html">Merchandising</a></li>
            <li><a href="field-activations.html">Field Activations</a></li>
            <li><a href="dynamic-roadshows.html">Dynamic Roadshows</a></li>
            <li><a href="events-management.html">Events Management</a></li>
            <li><a href="field-automation-surveys.html">Field Intelligence</a></li>
            <li><a href="retail-audit.html">Retail Audit</a></li>
            <li><a href="distribution-sales.html">Distribution &amp; Sales</a></li>
            <li><a href="strategy.html">Strategy</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="../about.html">About Us</a></li>
            <li><a href="../our-work.html">Our Work</a></li>
            <li><a href="../news.html">News</a></li>
            <li><a href="../careers.html">Careers</a></li>
          </ul>
          <h5 style="margin-top:28px;">Contact</h5>
          <ul>
            <li><a href="tel:+256393112860">+256 39 3112860</a></li>
            <li><a href="mailto:office@goldenmarketing.co.ug">office@goldenmarketing.co.ug</a></li>
            <li><a href="../contact.html">Send a Brief</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="footerYear">2025</span> Golden Marketing Limited</span>
        <span><a href="https://blactec.ug" target="_blank" rel="noopener">Designed by BlacTec</a></span>
      </div>
    </div>
  </footer>"""

def update_footers():
    # Regex to match the entire footer block
    footer_regex = re.compile(r'<footer class="site-footer">.*?</footer>', re.DOTALL)
    
    # Process root HTML files
    root_files = glob.glob("e:/Blactec Projects/GM website/Golden Marketing Redesign/*.html")
    for filepath in root_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace footer
        new_content = footer_regex.sub(footer_root, content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated footer in {filepath}")
            
    # Process services HTML files
    services_files = glob.glob("e:/Blactec Projects/GM website/Golden Marketing Redesign/services/*.html")
    for filepath in services_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace footer
        new_content = footer_regex.sub(footer_services, content)
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated footer in {filepath}")

def fix_css():
    css_path = "e:/Blactec Projects/GM website/Golden Marketing Redesign/css/style.css"
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove filter: brightness(0) invert(1); from .footer-brand img
    new_content = content.replace("filter: brightness(0) invert(1);", "")
    
    # Also fix index.html logo since it's now wrapped in <a>
    # Make sure .footer-logo is set to not be inverted in case another rule targets it
    
    if content != new_content:
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated style.css to remove logo inversion filter")

if __name__ == "__main__":
    update_footers()
    fix_css()
