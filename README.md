# Pure Croft Tools

Free, static, bilingual (FR default / EN) web tools by [Pure Croft](https://purecroft.fr).
No backend, no cookies, no analytics, no accounts. Works on mobile.

Live site (once published with GitHub Pages): https://purecroft.github.io/tools/

| Tool | Path | What it does |
|---|---|---|
| Créateur de café aux champignons / Mushroom Coffee Builder | `mushroom-coffee-builder/` | Pick base, milk, sweetener, temperature and a finishing touch → step-by-step recipe card. Shareable URL, print, "copy embed code" (iframe + attribution link). |
| Générateur de recettes de thé et latte aux champignons / Mushroom Tea & Latte Recipe Generator | `tea-latte/` | Pick base (teas, herbal infusions, coffee, cocoa, chai), milk, sweetener, extras and time of day → recipe card with ingredients, steps and timing. Copy, print, shareable URL, "Surprise me", embed code. |
| Clean Label Checker | `clean-label-checker/` | Paste an ingredient list → fillers, excipients, additives, sugars, sweeteners, colours, mycelium-on-grain and E-numbers highlighted with a neutral one-liner. |
| Glossaire des champignons fonctionnels / Functional mushroom glossary | `glossary/` | Searchable, sourced definitions (fruiting body, mycelium, 10:1 ratio, extraction, beta-glucans, species…). |

## Structure

```
index.html                  landing page
404.html  robots.txt  sitemap.xml  .nojekyll
assets/                     style.css, common.js (language toggle, copy, toast), favicon, OpenGraph images
mushroom-coffee-builder/    index.html + app.js
tea-latte/                  index.html + app.js
clean-label-checker/        index.html + data.js (shared with the browser extension) + app.js
glossary/                   index.html (static, SEO-friendly) + app.js (search)
_build/                     build.py (generates the HTML pages), glossary_data.py, og.py, test_clc.js
```

The HTML pages are generated: edit `_build/build.py` / `_build/glossary_data.py`, then run

```sh
python3 _build/build.py     # regenerate pages, sitemap, robots
python3 _build/og.py        # regenerate OpenGraph images (needs Pillow)
node _build/test_clc.js     # smoke-test the ingredient matcher
```

If the site is served from another URL (custom domain, other repo name), change `SITE` in
`_build/build.py` **and** `PC.SITE` in `assets/common.js` (used for share links and embed code), then rebuild.

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

## Language

French is the default. `?lang=en` switches to English (also remembered in the visitor's own
localStorage). Both languages are in the HTML, so search engines see both.

## URL parameters (coffee builder)

`b` base (`espresso, filter, latte, icedcoffee, coldbrew, matcha, chocolate, chai`),
`m` milk (`none, whole, semi, oat, almond, soy, coconut`),
`s` sweetener (`none, sugar, coconut, honey, maple, agave, vanilla`),
`t` temperature (`hot, iced`), `x` extra (`none, cinnamon, cocoa, cardamom, nutmeg, vanilla`),
`lang` (`en`), `embed=1` (compact view for iframes: hides header/footer, shows attribution link).

## Content policy

Copy is limited to product facts, usage and neutral, sourced definitions. No health, effect or
absorption claims. The coffee builder always says to follow the dose on the product label.

## Publishing on GitHub Pages (not done yet)

1. Create a public repo named `tools` under the `purecroft` account/organisation.
2. Push the contents of this folder to the `main` branch.
3. Settings → Pages → Deploy from branch → `main` / root.

## Contact

inquiries@purecroft.fr

## Licence

MIT © 2026 Pure Croft SASU. See [LICENSE](LICENSE).
