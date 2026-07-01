#!/usr/bin/env python3
"""
Build the Our Work gallery assets from the `GM images` content drop.

- Reads canonical (de-duplicated) per-brand source photos.
- Writes optimized WebP at two sizes:
    images/work/<brand>/<slug>.webp          (full,  max 1600px, q82)
    images/work/<brand>/thumbs/<slug>.webp   (thumb, max  640px, q72)
- Emits scripts/gallery-data.generated.js  (the `galleryData` array literal).

Re-runnable: clears images/work/ before rebuilding.
"""
import json
import re
import shutil
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "GM images" / "Website Content"
OUT = ROOT / "images" / "work"

FULL_MAX, FULL_Q = 1600, 82
THUMB_MAX, THUMB_Q = 640, 72

# brand id -> (display name, meta, [ (source_relpath, campaign_title, type) ... ])
# type is 'activation' | 'merchandising' (drives the overlay tag + sub-filter).
BRANDS = [
    ("cocacola", "Coca-Cola", "Activations & Merchandising", [
        ("Cocacola/Cocacola Activations/Coke Studio", "Coke Studio", "activation"),
        ("Cocacola/Cocacola Activations/Fanta Movie Time", "Fanta Movie Time", "activation"),
        ("Cocacola/Cocacola Activations/Fanta Snacking", "Fanta Snacking", "activation"),
        ("Cocacola/Cocacola Activations/Predator Road Shows", "Predator Roadshows", "activation"),
        ("Cocacola/Cocacola Activations/Rwenzori Marathon", "Rwenzori Marathon", "activation"),
        ("Cocacola/Cocacola Activations/Rwenzori Marathon Launch", "Rwenzori Marathon Launch", "activation"),
        ("Cocacola/Cocacola Activations/World Free Style Football Event", "World Freestyle Football", "activation"),
        ("Cocacola/Merchandising - Cocacola", "In-Store Merchandising", "merchandising"),
    ]),
    ("latitude", "Latitude Chocolate", "Merchandising & Distribution", [
        ("Latitude chocolate", "In-Store Merchandising", "merchandising"),
    ]),
    ("unilever", "Unilever", "Merchandising MT&GT & Activations", [
        ("Unilever/Unilever Activations/Back to School", "Back to School", "activation"),
        ("Unilever/Unilever Activations/Dove", "Dove", "activation"),
        ("Unilever/Unilever Activations/Hamper Promo", "Hamper Promo", "activation"),
        ("Unilever/Unilever Activations/Roast & Rhyme", "Roast & Rhyme", "activation"),
        ("Unilever/Merchandising - Unilever/MT", "Merchandising — Modern Trade", "merchandising"),
        ("Unilever/Merchandising - Unilever/GT", "Merchandising — General Trade", "merchandising"),
    ]),
    ("ubl", "UBL", "Merchandising", [
        ("UBL", "In-Store Merchandising", "activation"),
    ]),
    ("shell", "Shell Vivo", "Forecourt Activations & Merchandising", [
        ("Shell Vivo/Shell Vivo Activations/Heads Up", "Heads Up", "activation"),
        ("Shell Vivo/Shell Vivo Activations/Shell Expo", "Shell Expo", "activation"),
        ("Shell Vivo/Shell Vivo Activations/Shell Fuel On the Go", "Fuel On The Go", "activation"),
        ("Shell Vivo/Shell Vivo Activations/Shell Rimula Oils", "Rimula Oils", "activation"),
        ("Shell Vivo/Merchandising - Shell Vivo", "Forecourt Merchandising", "merchandising"),
    ]),
]


def slugify(s):
    s = s.lower().replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def save_webp(im, dest, max_side, quality):
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "P", "LA"):
        im = im.convert("RGB")
    w, h = im.size
    if max(w, h) > max_side:
        if w >= h:
            im = im.resize((max_side, round(h * max_side / w)), Image.LANCZOS)
        else:
            im = im.resize((round(w * max_side / h), max_side), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)

    gallery = []
    total = 0
    for bid, name, meta, campaigns in BRANDS:
        images = []
        for relpath, title, ctype in campaigns:
            folder = SRC / relpath
            files = sorted([p for p in folder.iterdir()
                            if p.suffix.lower() in (".jpg", ".jpeg", ".png")])
            cslug = slugify(title)
            for i, src in enumerate(files, 1):
                slug = f"{bid}-{cslug}-{i}"
                full = OUT / bid / f"{slug}.webp"
                thumb = OUT / bid / "thumbs" / f"{slug}.webp"
                with Image.open(src) as im:
                    base = im.copy()
                save_webp(base.copy(), full, FULL_MAX, FULL_Q)
                save_webp(base.copy(), thumb, THUMB_MAX, THUMB_Q)
                images.append({
                    "src": f"images/work/{bid}/{slug}.webp",
                    "thumb": f"images/work/{bid}/thumbs/{slug}.webp",
                    "type": ctype,
                    "title": title,
                })
                total += 1
            print(f"  {bid}: {title} -> {len(files)}")
        gallery.append({"id": bid, "name": name, "meta": meta, "images": images})

    header = "// Our Work gallery data — generated by scripts/build_work_gallery.py (do not edit by hand)\n"
    js = header + "const galleryData = " + json.dumps(gallery, indent=2, ensure_ascii=False) + ";\n"
    (ROOT / "js" / "work-gallery-data.js").write_text(js, encoding="utf-8")
    print(f"\nDone. {total} images across {len(gallery)} brands.")
    print(f"Wrote {OUT}")
    print("Wrote js/work-gallery-data.js")


if __name__ == "__main__":
    main()
