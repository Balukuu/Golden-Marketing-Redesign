#!/usr/bin/env python3
"""Wire the built assets into the HTML (service pages, our-work, homepage)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
M = json.loads((ROOT / "scripts" / "assets-manifest.json").read_text(encoding="utf-8"))

# Static-gallery service pages: file stem -> (hero slug, gallery key, alt caption)
STATIC_PAGES = {
    "merchandising": ("svc-merchandising", "merchandising", "Merchandising execution in retail"),
    "dynamic-roadshows": ("svc-dynamic-roadshows", "dynamic-roadshows", "Roadshow activation on tour"),
    "events-management": ("svc-events-management", "events-management", "Brand event in action"),
    "field-automation-surveys": ("svc-field-automation-surveys", "field-automation-surveys", "Field team capturing data"),
    "retail-audit": ("svc-retail-audit", "retail-audit", "Retail audit in store"),
    "distribution-sales": ("svc-distribution-sales", "distribution-sales", "Distribution and sales execution"),
    "strategy": ("svc-strategy", "strategy", "Strategy & planning session"),
}
DELAYS = ["", " delay-100", " delay-200", " delay-300"]
BRAND_LABEL = {"cocacola": "Coca-Cola", "unilever": "Unilever", "shell": "Shell Vivo", "ubl": "UBL"}


def load_work_pool():
    code = (ROOT / "js" / "work-gallery-data.js").read_text(encoding="utf-8")
    arr = json.loads(code[code.index("["):code.rindex("]") + 1])
    pool = []
    for b in arr:
        for im in b["images"]:
            pool.append({"brand": b["id"], "src": im["src"], "thumb": im["thumb"],
                         "type": im["type"], "title": im["title"]})
    return pool


def match_close_div(text, open_idx):
    depth, i = 0, open_idx
    tag = re.compile(r"<(/?)div\b", re.I)
    while True:
        m = tag.search(text, i)
        if not m:
            raise ValueError("unbalanced div")
        depth += 1 if m.group(1) == "" else -1
        if depth == 0:
            return text.index(">", m.end()) + 1
        i = m.end()


def apply_hero(s, hero_url):
    """Convert the first page-hero section into an image hero (idempotent)."""
    m = re.search(r'<section class="page-hero[^"]*"[^>]*>', s)
    assert m, "no hero section"
    s = s[:m.start()] + f'<section class="page-hero page-hero-image" style="background-image: url(\'{hero_url}\');">' + s[m.end():]
    open_end = s.index(">", s.index('<section class="page-hero page-hero-image"')) + 1
    if "page-hero-overlay" not in s[open_end:open_end + 200]:
        s = s[:open_end] + '\n      <div class="page-hero-overlay"></div>' + s[open_end:]
    inner_idx = s.index('<div class="page-hero-inner', open_end)
    inner_tag_end = s.index('>', inner_idx)
    inner_tag = s[inner_idx:inner_tag_end + 1]
    if "page-hero-inner-light" not in inner_tag:
        s = s[:inner_idx] + inner_tag.replace('class="page-hero-inner', 'class="page-hero-inner page-hero-inner-light', 1) + s[inner_tag_end + 1:]
    return s


def wire_static(stem, hero_slug, gal_key, alt):
    p = ROOT / "services" / f"{stem}.html"
    s = p.read_text(encoding="utf-8")
    s = apply_hero(s, "../" + M["heroes"][hero_slug])
    g_idx = s.index('<div class="photo-gallery">')
    g_end = match_close_div(s, g_idx)
    items = []
    for i, thumb in enumerate(M["services"][gal_key]):
        items.append(
            f'          <div class="photo-item reveal{DELAYS[i % 4]}"><img decoding="async" '
            f'src="../{thumb}" alt="{alt} — {i+1}" loading="lazy" '
            f'onerror="this.closest(\'.photo-item\').style.background=\'var(--surface)\'"></div>')
    s = s[:g_idx] + '<div class="photo-gallery">\n' + "\n".join(items) + "\n        </div>" + s[g_end:]
    p.write_text(s, encoding="utf-8")
    print(f"static : {stem}  hero={hero_slug}  gallery={len(M['services'][gal_key])}")


def wire_field_activations(pool):
    p = ROOT / "services" / "field-activations.html"
    s = p.read_text(encoding="utf-8")
    s = apply_hero(s, "../" + M["heroes"]["svc-field-activations"])

    acts = [im for im in pool if im["type"] == "activation"]
    brands = [b for b in ["cocacola", "unilever", "shell", "ubl"] if any(a["brand"] == b for a in acts)]

    # Filter bar
    btns = ['          <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">All Campaigns</button>']
    for b in brands:
        btns.append(f'          <button class="filter-btn" data-filter="{b}" role="tab" aria-selected="false">{BRAND_LABEL[b]}</button>')
    fb_idx = s.index('<div class="filter-bar"')
    fb_end = match_close_div(s, fb_idx)
    open_end = s.index(">", fb_idx) + 1
    s = s[:open_end] + "\n" + "\n".join(btns) + "\n        " + s[fb_end - len("</div>"):]

    # galleryData
    entries = []
    for a in acts:
        title = a["title"].replace('"', '\\"')
        entries.append(f'      {{ src: "../{a["src"]}", thumb: "../{a["thumb"]}", brand: "{a["brand"]}", title: "{title}" }}')
    gd_start = s.index("const galleryData = [")
    gd_end = s.index("];", gd_start) + len("];")
    s = s[:gd_start] + "const galleryData = [\n" + ",\n".join(entries) + "\n    ];" + s[gd_end:]

    # URL logic -> use webp paths from data
    s = s.replace("const thumbUrl = `../images/thumbs/${img.id}.jpg`;", "const thumbUrl = img.thumb;")
    s = s.replace("const highResUrl = `../images/${img.id}.jpg`;", "const highResUrl = img.src;")
    p.write_text(s, encoding="utf-8")
    print(f"dynamic: field-activations  hero=svc-field-activations  images={len(acts)}  filters={brands}")


def wire_our_work():
    p = ROOT / "our-work.html"
    s = p.read_text(encoding="utf-8")
    if ".brand-hero {" not in s:
        css = (
            "    .brand-hero {\n"
            "      height: 220px; border-radius: var(--r-md); overflow: hidden;\n"
            "      background-size: cover; background-position: center;\n"
            "      margin-bottom: 24px; position: relative; box-shadow: var(--shadow-sm);\n"
            "    }\n"
            "    .brand-hero::after { content:''; position:absolute; inset:0;\n"
            "      background: linear-gradient(to top, rgba(12,12,12,0.35), transparent 60%); }\n"
            "    @media (max-width: 580px) { .brand-hero { height: 150px; } }\n")
        s = s.replace("    .brand-section { margin-bottom: 80px; }",
                      "    .brand-section { margin-bottom: 80px; }\n" + css, 1)
    for brand in ["cocacola", "latitude", "unilever", "ubl", "shell"]:
        slug = f"client-{brand}"
        url = M["heroes"][slug]
        marker = f'<div class="brand-section reveal" data-brand="{brand}">'
        assert marker in s, f"missing brand-section {brand}"
        if f"images/heroes/{slug}.webp" in s:
            continue
        s = s.replace(marker, marker + f'\n            <div class="brand-hero" style="background-image:url(\'{url}\');" aria-hidden="true"></div>', 1)
    p.write_text(s, encoding="utf-8")
    print("our-work: 5 brand heroes added")


def wire_homepage():
    p = ROOT / "index.html"
    s = p.read_text(encoding="utf-8")
    repl = {
        "images/thumbs/1duZeGkBR2v5IScfB_HbhA1QSaMkBs3Or.jpg": M["cards"]["unilever"],
        "images/thumbs/1xIj5WcFwf6ezzm5v8jxyqI9V6TUT4X5L.jpg": M["cards"]["cocacola"],
        "images/thumbs/1RGykIrA5kypnirnYVsscY76A4pz2gntH.jpg": M["cards"]["shell"],
        "images/thumbs/1KBiYc0dwdGfsNfFmGsWIso2mjS3hf_Uq.jpg": M["cards"]["latitude"],
        "images/thumbs/1oSaHfWGQkG73V9V-xnh3_e0qDqW1tJJh.jpg": M["cards"]["ubl"],
    }
    done = 0
    for old, new in repl.items():
        if old in s:
            s = s.replace(old, new)
            done += 1
        elif new in s:
            done += 1  # already wired
    assert done == len(repl), f"homepage cards: only {done}/{len(repl)} resolved"
    p.write_text(s, encoding="utf-8")
    print(f"homepage: {done} featured cards repointed")


if __name__ == "__main__":
    pool = load_work_pool()
    for stem, (hero, gal, alt) in STATIC_PAGES.items():
        wire_static(stem, hero, gal, alt)
    wire_field_activations(pool)
    wire_our_work()
    wire_homepage()
    print("\nDone.")
