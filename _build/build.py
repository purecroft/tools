#!/usr/bin/env python3
"""Generates the static HTML pages of Pure Croft Tools.
Run from anywhere:  python3 _build/build.py
Edit SITE below if the GitHub Pages URL differs (e.g. custom domain)."""
import json, os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
from glossary_data import TERMS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = "https://purecroft.github.io/tools/"
BRAND = "https://purecroft.fr"
EMAIL = "inquiries@purecroft.fr"
PRODUCT = "https://purecroft.fr/products/5-champignons-complexe-gouttes"
E = html.escape

ORG = {"@type": "Organization", "name": "Pure Croft", "url": BRAND + "/", "email": EMAIL}

def bi(fr, en, tag="span"):
    return f'<{tag} class="l-fr">{fr}</{tag}><{tag} class="l-en" lang="en">{en}</{tag}>'

NAV = [("", "🏠", "Outils", "Tools"),
       ("mushroom-coffee-builder/", "☕", "Café aux champignons", "Mushroom coffee"),
       ("tea-latte/", "🫖", "Thé & latte", "Tea & latte"),
       ("clean-label-checker/", "🔍", "Clean Label Checker", "Clean Label Checker"),
       ("glossary/", "📖", "Glossaire", "Glossary")]

def page(path, title_fr, title_en, desc_fr, desc_en, body, jsonld, scripts=(), extra_css="", depth=1):
    rel = "../" * depth
    url = SITE + path
    nav = "".join(
        f'<a href="{rel}{p}"{" aria-current=\"page\"" if p == path else ""}>{bi(fr, en)}</a>' for p, ic, fr, en in NAV)
    scr = "".join(f'<script src="{s}" defer></script>' for s in scripts)
    og_img = SITE + "assets/og-" + (path.strip("/") or "index") + ".png"
    return f"""<!doctype html>
<html lang="fr" class="lang-fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{E(title_fr)}</title>
<meta name="description" content="{E(desc_fr)}">
<meta name="pc-title-fr" content="{E(title_fr)}">
<meta name="pc-title-en" content="{E(title_en)}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="fr" href="{url}">
<link rel="alternate" hreflang="en" href="{url}?lang=en">
<link rel="alternate" hreflang="x-default" href="{url}">
<meta name="robots" content="index,follow">
<meta name="author" content="Pure Croft">
<meta name="theme-color" content="#7a4b2a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Pure Croft Tools">
<meta property="og:title" content="{E(title_fr)}">
<meta property="og:description" content="{E(desc_fr)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="fr_FR">
<meta property="og:locale:alternate" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{E(title_en)}">
<meta name="twitter:description" content="{E(desc_en)}">
<meta name="twitter:image" content="{og_img}">
<link rel="icon" href="{rel}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{rel}assets/style.css">
{extra_css}
<script src="{rel}assets/common.js"></script>
<script type="application/ld+json">
{json.dumps(jsonld, ensure_ascii=False, indent=1)}
</script>
{scr}
</head>
<body>
<a class="skip" href="#main">{bi("Aller au contenu", "Skip to content")}</a>
<header class="site"><div class="wrap">
<a class="logo" href="{rel}">Pure <span>Croft</span> · {bi("Outils", "Tools")}</a>
<nav class="tools" aria-label="Outils / Tools">{nav}</nav>
<div class="langswitch" role="group" aria-label="Langue / Language"><button type="button" data-lang="fr" aria-pressed="true">FR</button><button type="button" data-lang="en" aria-pressed="false">EN</button></div>
</div></header>
<main id="main"><div class="wrap">
{body}
</div></main>
<footer class="site"><div class="wrap">
<p>{bi("Réalisé par", "Made by")} Pure Croft · <a href="{BRAND}/">purecroft.fr</a> · <a href="mailto:{EMAIL}">{EMAIL}</a></p>
<p class="note">{bi("Outils gratuits, sans compte, sans cookies ni suivi. Code source sous licence MIT.", "Free tools, no account, no cookies, no tracking. Source code under the MIT licence.")}</p>
</div></footer>
</body>
</html>
"""

def webapp(name, desc, path, cat="UtilitiesApplication"):
    return {"@context": "https://schema.org", "@type": "WebApplication", "name": name, "description": desc,
            "url": SITE + path, "applicationCategory": cat, "operatingSystem": "Any", "browserRequirements": "Requires JavaScript",
            "inLanguage": ["fr", "en"], "isAccessibleForFree": True,
            "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
            "publisher": ORG, "creator": ORG, "license": "https://opensource.org/licenses/MIT"}

def write(rel, content):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", rel)

# ---------------------------------------------------------------- index
index_body = f"""
<h1>{bi("Outils gratuits autour des champignons", "Free mushroom tools")}</h1>
<p class="lede">{bi("Des petits outils simples et gratuits pour explorer les champignons au quotidien : recettes de café aux champignons, lecture d'étiquettes et vocabulaire. Sans compte, sans suivi, utilisables sur mobile.",
 "Small, simple and free tools to explore mushrooms in everyday life: mushroom coffee recipes, label reading and vocabulary. No account, no tracking, mobile friendly.")}</p>
<div class="grid two" style="margin-top:22px">
<a class="card tile" href="mushroom-coffee-builder/"><div class="emoji" aria-hidden="true">☕</div>
<h2>{bi("Créateur de café aux champignons", "Mushroom Coffee Builder")}</h2>
<p>{bi("Choisissez une base (espresso, latte, cold brew, matcha, chai…), un lait, un sucrant et la température : obtenez une fiche recette imprimable, partageable et intégrable sur votre site.",
 "Pick a base (espresso, latte, cold brew, matcha, chai…), milk, sweetener and temperature: get a printable, shareable recipe card you can also embed on your site.")}</p></a>
<a class="card tile" href="tea-latte/"><div class="emoji" aria-hidden="true">🫖</div>
<h2>{bi("Générateur de recettes de thé et latte aux champignons", "Mushroom Tea & Latte Recipe Generator")}</h2>
<p>{bi("Thé noir ou vert, rooibos, camomille, verveine, tilleul, café, chocolat ou chai : choisissez lait, sucrant, épices et moment de la journée pour obtenir une fiche recette à copier, imprimer, partager ou intégrer.",
 "Black or green tea, rooibos, chamomile, verbena, linden, coffee, cocoa or chai: pick milk, sweetener, spices and time of day to get a recipe card to copy, print, share or embed.")}</p></a>
<a class="card tile" href="clean-label-checker/"><div class="emoji" aria-hidden="true">🔍</div>
<h2>{bi("Clean Label Checker", "Clean Label Checker")}</h2>
<p>{bi("Collez une liste d'ingrédients : les charges, excipients, additifs, sucres, édulcorants, colorants et numéros E sont surlignés, avec une explication neutre pour chacun.",
 "Paste an ingredient list: fillers, excipients, additives, sugars, sweeteners, colours and E-numbers are highlighted, each with a neutral one-line explanation.")}</p></a>
<a class="card tile" href="glossary/"><div class="emoji" aria-hidden="true">📖</div>
<h2>{bi("Glossaire des champignons fonctionnels", "Functional mushroom glossary")}</h2>
<p>{bi("Carpophore, mycélium, ratio 10:1, double extraction, bêta-glucanes, Reishi, Cordyceps… Des définitions claires et sourcées, avec recherche.",
 "Fruiting body, mycelium, 10:1 ratio, dual extraction, beta-glucans, Reishi, Cordyceps… Clear, sourced definitions with search.")}</p></a>
<div class="card"><div class="emoji" aria-hidden="true">🍄</div>
<h2 style="color:var(--brand)">{bi("À propos de Pure Croft", "About Pure Croft")}</h2>
<p>{bi("Pure Croft est une marque française de gouttes et de sprays d'extraits de champignons 10:1 sans alcool : Reishi à l'écorce d'orange et Complexe 5 Champignons (Reishi, Cordyceps, Crinière de lion, Shiitaké, Chaga). Les champignons, version simple et ludique : quelques gouttes dans votre café, et le tour est joué.",
 "Pure Croft is a French brand of alcohol-free 10:1 mushroom extract drops and sprays: Reishi with orange peel and the 5-Mushroom Complex (Reishi, Cordyceps, Lion's Mane, Shiitake, Chaga). Mushrooms made fun and convenient: a few drops in your coffee and you're done.")}</p>
<p><a href="{BRAND}/">purecroft.fr →</a></p></div>
</div>
"""
index_ld = {"@context": "https://schema.org", "@graph": [
    {"@type": "WebSite", "name": "Pure Croft Tools", "url": SITE, "inLanguage": ["fr", "en"], "publisher": ORG},
    {"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "url": SITE + "mushroom-coffee-builder/", "name": "Créateur de café aux champignons / Mushroom Coffee Builder"},
        {"@type": "ListItem", "position": 2, "url": SITE + "tea-latte/", "name": "Générateur de recettes de thé et latte aux champignons / Mushroom Tea & Latte Recipe Generator"},
        {"@type": "ListItem", "position": 3, "url": SITE + "clean-label-checker/", "name": "Clean Label Checker"},
        {"@type": "ListItem", "position": 4, "url": SITE + "glossary/", "name": "Glossaire des champignons fonctionnels / Functional mushroom glossary"}]}]}
write("index.html", page("", "Outils gratuits autour des champignons | Pure Croft", "Free mushroom tools | Pure Croft",
    "Outils gratuits Pure Croft : créateur de café aux champignons, générateur de thés et lattes aux champignons, vérificateur d'étiquettes clean label et glossaire des champignons fonctionnels. Sans compte ni suivi.",
    "Free Pure Croft tools: mushroom coffee recipe builder, mushroom tea & latte recipe generator, clean label ingredient checker and functional mushroom glossary. No account, no tracking.",
    index_body, index_ld, depth=0))

# ---------------------------------------------------------------- coffee builder
coffee_css = """<style>
.builder-grid{display:grid;gap:18px}
@media(min-width:900px){.builder-grid{grid-template-columns:1fr 1.05fr;align-items:start}#recipe-col{position:sticky;top:12px}}
.recipe-card{border-top:6px solid var(--brand-2)}
.rc-head{display:flex;gap:14px;align-items:center}
.rc-icon{font-size:2.6rem}
.rc-kicker{margin:0;text-transform:uppercase;font-size:.75rem;letter-spacing:.08em;color:var(--brand-2);font-weight:700}
.rc-title{margin:.1em 0}
.rc-sub{margin:0;color:var(--muted);font-size:.92rem}
.recipe-card h3{margin:1.1em 0 .4em;font-size:1.05rem}
.rc-steps li,.rc-ingr li{margin:.35em 0}
.rc-foot{margin-top:16px;font-size:.8rem;color:var(--muted);border-top:1px dashed var(--line);padding-top:8px}
.embed-box textarea{min-height:110px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.8rem}
.embed-credit{display:none;text-align:center;font-size:.8rem;margin:10px 0 0}
html.embed header.site,html.embed footer.site,html.embed .hide-embed{display:none !important}
html.embed main{padding:10px 0}
html.embed .embed-credit{display:block}
@media print{#builder,.embed-box,.lede,h1,.intro-note{display:none !important}.builder-grid{display:block}.recipe-card{border:1px solid #999}}
</style>"""
coffee_body = f"""
<h1 class="hide-embed">{bi("Créateur de café aux champignons", "Mushroom Coffee Builder")}</h1>
<p class="lede hide-embed">{bi("Composez votre café aux champignons en quelques clics : choisissez la base, le lait, le sucrant et la température, et obtenez une fiche recette pas à pas à imprimer, partager ou intégrer sur votre blog.",
 "Build your mushroom coffee in a few clicks: pick the base, milk, sweetener and temperature, and get a step-by-step recipe card to print, share or embed on your blog.")}</p>
<div class="builder-grid">
<form id="builder" class="card" onsubmit="return false" aria-label="Recipe options">
<fieldset><legend>{bi("1. Base", "1. Base")}</legend><div class="chips" id="f-base"></div></fieldset>
<fieldset><legend>{bi("2. Lait ou boisson végétale", "2. Milk or plant drink")}</legend><div class="chips" id="f-milk"></div></fieldset>
<fieldset><legend>{bi("3. Sucrant", "3. Sweetener")}</legend><div class="chips" id="f-sweet"></div></fieldset>
<fieldset><legend>{bi("4. Température", "4. Temperature")}</legend><div class="chips" id="f-temp"></div></fieldset>
<fieldset><legend>{bi("5. Touche finale", "5. Finishing touch")}</legend><div class="chips" id="f-extra"></div></fieldset>
<div class="actions"><button type="button" class="btn ghost" id="btn-random">🎲 {bi("Surprenez-moi", "Surprise me")}</button></div>
</form>
<div id="recipe-col">
<article class="card recipe-card" id="recipe" aria-live="polite"></article>
<div class="actions no-print">
<button type="button" class="btn" id="btn-print">🖨️ {bi("Imprimer la fiche", "Print card")}</button>
<button type="button" class="btn ghost" id="btn-share">🔗 {bi("Partager le lien", "Share link")}</button>
</div>
<p class="embed-credit no-print"><a href="{SITE}mushroom-coffee-builder/" target="_blank" rel="noopener">{bi("Outil de recettes par Pure Croft", "Recipe tool by Pure Croft")}</a></p>
<div class="card embed-box hide-embed no-print" style="margin-top:18px">
<h2 style="margin-top:0">{bi("Intégrer cet outil sur votre site", "Embed this tool on your site")}</h2>
<p class="note">{bi("Copiez ce code et collez-le dans votre article ou page (bloc HTML). La recette actuellement affichée sera celle proposée par défaut.",
 "Copy this code and paste it into your post or page (HTML block). The recipe currently shown will be the default one.")}</p>
<label for="embed-code" class="note">{bi("Code d'intégration", "Embed code")}</label>
<textarea id="embed-code" readonly></textarea>
<div class="actions"><button type="button" class="btn" id="btn-embed">📋 {bi("Copier le code d'intégration", "Copy embed code")}</button></div>
</div>
</div>
</div>
<section class="hide-embed intro-note">
<h2>{bi("Comment ça marche ?", "How does it work?")}</h2>
<p>{bi(f"Chaque recette inclut une étape « quelques gouttes d'extrait de champignons ». Avec le <a href=\"{PRODUCT}\">Complexe 5 Champignons Pure Croft en gouttes</a> (Reishi, Cordyceps, Crinière de lion, Shiitaké, Chaga), votre café habituel devient un café aux champignons, sans poudre à dissoudre. Suivez toujours la dose indiquée sur l'étiquette de votre produit.",
 f"Every recipe includes an 'add a few drops of mushroom extract' step. With <a href=\"{PRODUCT}\">Pure Croft 5-Mushroom Complex drops</a> (Reishi, Cordyceps, Lion's Mane, Shiitake, Chaga), your everyday coffee becomes mushroom coffee, with no powder to dissolve. Always follow the dose on your product label.")}</p>
<p>{bi("Vos choix sont enregistrés dans l'adresse de la page : copiez-la pour retrouver ou partager votre recette. Rien n'est envoyé à un serveur.",
 "Your choices are saved in the page address: copy it to come back to or share your recipe. Nothing is sent to a server.")}</p>
</section>
"""
write("mushroom-coffee-builder/index.html", page("mushroom-coffee-builder/",
    "Créateur de café aux champignons – recettes gratuites | Pure Croft",
    "Mushroom Coffee Builder – free recipe cards | Pure Croft",
    "Créez votre recette de café aux champignons : espresso, latte, cold brew, matcha, chocolat chaud ou chai, lait, sucrant et température. Fiche imprimable, lien partageable et code d'intégration.",
    "Create your mushroom coffee recipe: espresso, latte, cold brew, matcha, hot chocolate or chai, milk, sweetener and temperature. Printable card, shareable link and embed code.",
    coffee_body, webapp("Créateur de café aux champignons / Mushroom Coffee Builder",
        "Outil gratuit pour créer des recettes de café aux champignons. Free tool to create mushroom coffee recipes.",
        "mushroom-coffee-builder/", "LifestyleApplication"),
    scripts=("app.js",), extra_css=coffee_css))

# ---------------------------------------------------------------- tea & latte generator
tea_css = coffee_css.replace("</style>", ".rc-tip{background:#faf3ea;border-radius:8px;padding:10px 12px;font-size:.9rem}\n</style>")
tea_body = f"""
<h1 class="hide-embed">{bi("Générateur de recettes de thé et latte aux champignons", "Mushroom Tea &amp; Latte Recipe Generator")}</h1>
<p class="lede hide-embed">{bi("Choisissez une base, un lait, un sucrant, des épices et le moment de la journée : obtenez une fiche recette avec ingrédients, étapes et temps de préparation, à copier, imprimer, partager ou intégrer sur votre blog.",
 "Pick a base, milk, sweetener, extras and the time of day: get a recipe card with ingredients, steps and timing to copy, print, share or embed on your blog.")}</p>
<div class="builder-grid">
<form id="builder" class="card" onsubmit="return false" aria-label="Recipe options">
<fieldset><legend>{bi("1. Base", "1. Base")}</legend><div class="chips" id="f-base"></div></fieldset>
<fieldset><legend>{bi("2. Lait ou boisson végétale", "2. Milk or plant drink")}</legend><div class="chips" id="f-milk"></div></fieldset>
<fieldset><legend>{bi("3. Sucrant", "3. Sweetener")}</legend><div class="chips" id="f-sweet"></div></fieldset>
<fieldset><legend>{bi("4. Extras (plusieurs choix possibles)", "4. Extras (pick any)")}</legend><div class="chips" id="f-extra"></div></fieldset>
<fieldset><legend>{bi("5. Moment de la journée", "5. Time of day")}</legend><div class="chips" id="f-mood"></div></fieldset>
<div class="actions"><button type="button" class="btn ghost" id="btn-random">🎲 {bi("Surprenez-moi", "Surprise me")}</button></div>
</form>
<div id="recipe-col">
<article class="card recipe-card" id="recipe" aria-live="polite"></article>
<div class="actions no-print">
<button type="button" class="btn" id="btn-copy">📋 {bi("Copier la recette", "Copy recipe")}</button>
<button type="button" class="btn ghost" id="btn-print">🖨️ {bi("Imprimer", "Print")}</button>
<button type="button" class="btn ghost" id="btn-share">🔗 {bi("Partager le lien", "Share link")}</button>
</div>
<p class="embed-credit no-print">{bi("Outil gratuit par", "Free tool by")} <a href="{BRAND}" target="_blank" rel="noopener">Pure Croft</a></p>
<div class="card embed-box hide-embed no-print" style="margin-top:18px">
<h2 style="margin-top:0">{bi("Intégrer cet outil sur votre site", "Embed this tool on your site")}</h2>
<p class="note">{bi("Copiez ce code et collez-le dans un bloc HTML de votre article. La recette affichée sera celle proposée par défaut.", "Copy this code and paste it into an HTML block in your post. The recipe shown will be the default one.")}</p>
<label for="embed-code" class="note">{bi("Code d'intégration", "Embed code")}</label>
<textarea id="embed-code" readonly></textarea>
<div class="actions"><button type="button" class="btn" id="btn-embed">📋 {bi("Copier le code d'intégration", "Copy embed code")}</button></div>
</div>
</div>
</div>
<section class="hide-embed intro-note">
<h2>{bi("Comment ça marche ?", "How does it work?")}</h2>
<p>{bi("Chaque recette se termine par 3 à 5 gouttes d'un extrait liquide de champignons : le Reishi à l'écorce d'orange pour les recettes du soir, le Complexe 5 Champignons (Reishi, Crinière de lion, Cordyceps sinensis, Chaga, Shiitaké) pour celles du matin. Les extraits Pure Croft sont sans alcool, dans de l'huile MCT, fabriqués dans l'UE (Pologne) pour une marque française.",
 "Every recipe finishes with 3–5 drops of a liquid mushroom extract: Reishi with orange peel for evening recipes, the 5-mushroom blend (Reishi, Lion's Mane, Cordyceps sinensis, Chaga, Shiitake) for morning ones. Pure Croft extracts are alcohol-free, in MCT oil, and made in the EU (Poland) for a French brand.")} <a href="{BRAND}">purecroft.fr</a></p>
<p>{bi("Vos choix sont enregistrés dans l'adresse de la page : copiez-la pour partager votre recette. Rien n'est envoyé à un serveur.", "Your choices are saved in the page address: copy it to share your recipe. Nothing is sent to a server.")}</p>
</section>
"""
write("tea-latte/index.html", page("tea-latte/",
    "Générateur de recettes de thé et latte aux champignons – gratuit | Pure Croft",
    "Mushroom Tea & Latte Recipe Generator – free | Pure Croft",
    "Créez votre recette de thé, infusion ou latte aux champignons : base, lait, sucrant, épices et moment de la journée. Fiche à copier, imprimer, partager ou intégrer.",
    "Build a mushroom tea or latte recipe: base, milk, sweetener, spices and time of day. Recipe card to copy, print, share or embed. Free, no sign-up.",
    tea_body, webapp("Générateur de recettes de thé et latte aux champignons / Mushroom Tea & Latte Recipe Generator",
        "Outil gratuit pour créer des recettes de thé et latte aux champignons. Free tool to build mushroom tea and latte recipes.",
        "tea-latte/", "LifestyleApplication"),
    scripts=("app.js",), extra_css=tea_css))

# ---------------------------------------------------------------- clean label checker
clc_css = """<style>
.hl{white-space:pre-wrap;word-wrap:break-word;line-height:1.9;background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px}
.hl mark{border-radius:4px;padding:1px 2px;color:inherit}
.cat h3{font-size:1.02rem;margin:1.1em 0 .4em;display:flex;align-items:center;gap:8px}
.cat ul{margin:0;padding-left:1.2em}.cat li{margin:.5em 0}
.dot{display:inline-block;width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.15);flex:none}
.enum{font-size:.78rem;background:var(--accent);border-radius:6px;padding:1px 6px;margin-left:4px}
.legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.85rem;color:var(--muted);margin-top:10px}
.leg{display:inline-flex;align-items:center;gap:5px}
</style>"""
clc_body = f"""
<h1>{bi("Clean Label Checker : analysez une liste d'ingrédients", "Clean Label Checker: scan an ingredient list")}</h1>
<p class="lede">{bi("Collez la liste d'ingrédients d'un complément, d'une boisson ou d'un aliment. L'outil surligne les charges, excipients, antiagglomérants, sucres ajoutés, édulcorants, colorants, conservateurs et numéros E, avec une explication factuelle pour chacun. Tout se passe dans votre navigateur.",
 "Paste the ingredient list of a supplement, drink or food. The tool highlights fillers, excipients, anti-caking agents, added sugars, sweeteners, colours, preservatives and E-numbers, with a factual explanation for each. Everything runs in your browser.")}</p>
<div class="grid two" style="margin-top:18px">
<div class="card">
<label for="ingredients">{bi("Liste d'ingrédients", "Ingredient list")}</label>
<textarea id="ingredients" spellcheck="false" data-fr-placeholder="Ex. : Ingrédients : maltodextrine, extrait de champignon, stéarate de magnésium, E551…" data-en-placeholder="e.g. Ingredients: maltodextrin, mushroom extract, magnesium stearate, E551…" placeholder="Ex. : Ingrédients : maltodextrine, extrait de champignon, stéarate de magnésium, E551…"></textarea>
<div class="actions"><button type="button" class="btn ghost" id="btn-sample">🧪 {bi("Essayer un exemple", "Try an example")}</button><button type="button" class="btn ghost" id="btn-clear">✕ {bi("Effacer", "Clear")}</button></div>
<div class="legend" id="legend" aria-label="Legend"></div>
</div>
<div class="card" aria-live="polite">
<h2 style="margin-top:0">{bi("Résultat", "Result")}</h2>
<p id="summary"></p>
<div id="result-wrap" hidden>
<div class="hl" id="highlighted"></div>
<div id="results"></div>
</div>
</div>
</div>
<section>
<h2>{bi("À savoir", "Good to know")}</h2>
<ul>
<li>{bi('La base contient <strong id="dict-count">…</strong> ingrédients (noms français et anglais, synonymes et numéros E), plus la reconnaissance de tout numéro E par catégorie de la numérotation européenne.',
 'The dictionary holds <strong id="dict-count-en">…</strong> ingredients (French and English names, synonyms and E-numbers), plus recognition of any E-number by its EU numbering category.')}</li>
<li>{bi("Un ingrédient surligné n'est pas forcément « mauvais » : l'outil explique simplement ce qu'il est et à quoi il sert. Il ne constitue pas une évaluation de sécurité ni un avis médical.",
 "A highlighted ingredient is not necessarily 'bad': the tool simply explains what it is and what it is used for. It is not a safety assessment or medical advice.")}</li>
<li>{bi('Sources de référence : <a href="https://food.ec.europa.eu/food-safety/food-improvement-agents/additives/database_en">base de données des additifs alimentaires de l\'UE</a>, <a href="https://www.efsa.europa.eu/en/topics/topic/food-additives">EFSA – additifs alimentaires</a>, <a href="https://eur-lex.europa.eu/eli/reg/2022/63/oj">Règlement (UE) 2022/63 (E171)</a>.',
 'Reference sources: <a href="https://food.ec.europa.eu/food-safety/food-improvement-agents/additives/database_en">EU food additives database</a>, <a href="https://www.efsa.europa.eu/en/topics/topic/food-additives">EFSA – food additives</a>, <a href="https://eur-lex.europa.eu/eli/reg/2022/63/oj">Regulation (EU) 2022/63 (E171)</a>.')}</li>
<li>{bi("Aucune donnée n'est envoyée : le texte collé reste sur votre appareil.", "No data is sent anywhere: the text you paste stays on your device.")}</li>
<li>{bi('Envie de voir un nom manquant ajouté ? Écrivez-nous : <a href="mailto:inquiries@purecroft.fr">inquiries@purecroft.fr</a>.', 'Missing an ingredient? Tell us: <a href="mailto:inquiries@purecroft.fr">inquiries@purecroft.fr</a>.')}</li>
</ul>
</section>
"""
write("clean-label-checker/index.html", page("clean-label-checker/",
    "Clean Label Checker – analyse gratuite de liste d'ingrédients | Pure Croft",
    "Clean Label Checker – free ingredient list scanner | Pure Croft",
    "Collez une liste d'ingrédients : maltodextrine, stéarate de magnésium, dioxyde de silicium, carraghénane, édulcorants, colorants et numéros E sont surlignés et expliqués. Gratuit, sans suivi.",
    "Paste an ingredient list: maltodextrin, magnesium stearate, silicon dioxide, carrageenan, sweeteners, colours and E-numbers are highlighted and explained. Free, no tracking.",
    clc_body, webapp("Clean Label Checker", "Outil gratuit qui surligne charges, excipients et additifs dans une liste d'ingrédients. Free tool highlighting fillers, excipients and additives in an ingredient list.",
        "clean-label-checker/"),
    scripts=("data.js", "app.js"), extra_css=clc_css))

# ---------------------------------------------------------------- glossary
gl_css = """<style>
.search{position:sticky;top:0;background:var(--bg);padding:10px 0;z-index:5}
.term{scroll-margin-top:80px}
.term h2{margin:.1em 0 .2em;font-size:1.2rem}
.term .alt{font-size:.85rem;color:var(--muted);margin:0 0 .5em}
.term .src{font-size:.85rem;margin:.6em 0 0}
.term .anchor{font-size:.85rem;text-decoration:none;margin-left:6px;opacity:.5}
.terms{display:grid;gap:14px;margin-top:10px}
.toc{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:.9rem;margin:10px 0}
</style>"""
arts, toc, defs = [], [], []
for t in TERMS:
    srcs = " · ".join(f'<a href="{E(u)}" rel="noopener" target="_blank">{E(l)}</a>' for l, u in t["src"])
    search = " ".join([t["fr"], t["en"], t["alt"], t["dfr"], t["den"]])
    arts.append(f"""<article class="card term" id="{t['id']}" data-search="{E(search)}">
<h2>{bi(E(t['fr']), E(t['en']))}<a class="anchor" href="#{t['id']}" aria-label="Lien / Link">#</a></h2>
{f'<p class="alt">{E(t["alt"])}</p>' if t["alt"] else ""}
<p>{bi(E(t['dfr']), E(t['den']))}</p>
<p class="src">{bi("Sources :", "Sources:")} {srcs}</p>
</article>""")
    toc.append(f'<a href="#{t["id"]}">{bi(E(t["fr"]), E(t["en"]))}</a>')
    defs.append({"@type": "DefinedTerm", "@id": SITE + "glossary/#" + t["id"], "name": t["fr"],
                 "alternateName": [t["en"]] + [a.strip() for a in t["alt"].split(",") if a.strip()],
                 "description": t["dfr"], "url": SITE + "glossary/#" + t["id"],
                 "inDefinedTermSet": SITE + "glossary/", "sameAs": [u for _, u in t["src"]]})
gl_body = f"""
<h1>{bi("Glossaire des champignons fonctionnels", "Functional mushroom glossary")}</h1>
<p class="lede">{bi("Les mots que l'on croise sur les étiquettes et dans les articles sur les champignons, expliqués simplement : biologie, procédés d'extraction et espèces. Chaque définition renvoie à ses sources.",
 "The words you meet on labels and in articles about mushrooms, explained simply: biology, extraction processes and species. Every definition links to its sources.")}</p>
<div class="search"><label for="q" class="note">{bi("Rechercher un terme", "Search a term")}</label>
<input type="search" id="q" autocomplete="off" data-fr-placeholder="Ex. : mycélium, 10:1, chaga…" data-en-placeholder="e.g. mycelium, 10:1, chaga…" placeholder="Ex. : mycélium, 10:1, chaga…">
<p class="note" id="count" aria-live="polite"></p></div>
<nav class="toc" aria-label="Index">{"".join(toc)}</nav>
<div class="terms" id="terms">
{"".join(arts)}
</div>
<p class="note" id="empty" hidden>{bi("Aucun terme ne correspond. Suggérez-en un :", "No matching term. Suggest one:")} <a href="mailto:{EMAIL}">{EMAIL}</a></p>
<p class="note" style="margin-top:24px">{bi("Ce glossaire est informatif et purement descriptif ; il ne contient aucune allégation. Les sources Wikipédia citées sont en anglais. Dernière vérification des sources : 26 septembre 2026.",
 "This glossary is informational and purely descriptive; it contains no claims. Last source check: 26 September 2026.")}</p>
"""
gl_ld = {"@context": "https://schema.org", "@type": "DefinedTermSet", "@id": SITE + "glossary/",
         "name": "Glossaire des champignons fonctionnels / Functional mushroom glossary",
         "description": "Définitions sourcées des termes liés aux champignons : carpophore, mycélium, ratio 10:1, extraction, bêta-glucanes, espèces.",
         "url": SITE + "glossary/", "inLanguage": ["fr", "en"], "publisher": ORG, "hasDefinedTerm": defs}
write("glossary/index.html", page("glossary/",
    "Glossaire des champignons fonctionnels : carpophore, mycélium, 10:1… | Pure Croft",
    "Functional mushroom glossary: fruiting body, mycelium, 10:1… | Pure Croft",
    "Définitions claires et sourcées : carpophore, mycélium, ratio d'extrait 10:1, extraction à l'eau chaude, double extraction, bêta-glucanes, Reishi, Crinière de lion, Cordyceps, Chaga, Shiitaké.",
    "Clear, sourced definitions: fruiting body, mycelium, 10:1 extract ratio, hot-water and dual extraction, beta-glucans, Reishi, Lion's Mane, Cordyceps, Chaga, Shiitake.",
    gl_body, gl_ld, scripts=("app.js",), extra_css=gl_css))

# ---------------------------------------------------------------- 404, sitemap, robots
write("404.html", page("404.html", "Page introuvable | Pure Croft Tools", "Page not found | Pure Croft Tools",
    "Page introuvable.", "Page not found.",
    f'<h1>{bi("Page introuvable", "Page not found")}</h1><p><a href="{SITE}">{bi("Retour aux outils", "Back to the tools")}</a></p>',
    {"@context": "https://schema.org", "@type": "WebPage", "name": "404"}, depth=0).replace('href="assets/', f'href="{SITE}assets/').replace('src="assets/', f'src="{SITE}assets/').replace('content="index,follow"', 'content="noindex"'))
urls = ["", "mushroom-coffee-builder/", "tea-latte/", "clean-label-checker/", "glossary/"]
sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for u in urls:
    sm.append(f'<url><loc>{SITE}{u}</loc><xhtml:link rel="alternate" hreflang="fr" href="{SITE}{u}"/><xhtml:link rel="alternate" hreflang="en" href="{SITE}{u}?lang=en"/></url>')
sm.append("</urlset>")
write("sitemap.xml", "\n".join(sm) + "\n")
write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE}sitemap.xml\n")
