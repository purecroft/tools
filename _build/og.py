#!/usr/bin/env python3
"""Generates 1200x630 OpenGraph images into assets/. Requires Pillow."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
PAGES = {
  "index": ("Outils gratuits autour des champignons", "Free mushroom tools"),
  "mushroom-coffee-builder": ("Créateur de café aux champignons", "Mushroom Coffee Builder"),
  "tea-latte": ("Thé & latte aux champignons", "Mushroom Tea & Latte Recipe Generator"),
  "clean-label-checker": ("Clean Label Checker", "Analyse de liste d'ingrédients · Ingredient scanner"),
  "glossary": ("Glossaire des champignons fonctionnels", "Functional mushroom glossary"),
}
def wrap(d, text, font, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
for key, (t1, t2) in PAGES.items():
    im = Image.new("RGB", (1200, 630), "#faf7f2"); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 1200, 18], fill="#c9772b"); d.rectangle([0, 612, 1200, 630], fill="#7a4b2a")
    d.pieslice([900, 120, 1140, 360], 180, 360, fill="#7a4b2a"); d.rectangle([985, 240, 1055, 400], fill="#c9772b")
    for cx, cy, r in [(960, 200, 14), (1030, 170, 11), (1080, 215, 10)]: d.ellipse([cx-r, cy-r, cx+r, cy+r], fill="#f3e6d6")
    d.text((80, 80), "PURE CROFT · TOOLS", font=ImageFont.truetype(FB, 34), fill="#c9772b")
    f1 = ImageFont.truetype(FB, 64); y = 170
    for line in wrap(d, t1, f1, 780): d.text((80, y), line, font=f1, fill="#2b2420"); y += 80
    f2 = ImageFont.truetype(FR, 36)
    for line in wrap(d, t2, f2, 780): d.text((80, y + 20), line, font=f2, fill="#6b5f57"); y += 48
    d.text((80, 540), "purecroft.fr", font=ImageFont.truetype(FB, 30), fill="#7a4b2a")
    im.save(os.path.join(ROOT, "assets", f"og-{key}.png"), optimize=True); print("og", key)
