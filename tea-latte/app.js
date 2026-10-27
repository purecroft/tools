/* Mushroom Tea & Latte Recipe Generator / Générateur de recettes de thé et latte aux champignons
 * Static, no backend, no tracking. MIT License (c) 2026 Pure Croft SASU */
(function () {
  "use strict";
  var SHOP = "https://purecroft.fr";
  var TOOL_PATH = "tea-latte/";
  var t = PC.t, esc = PC.esc;

  var BASES = {
    black: { icon: "🫖", name: { fr: "Thé noir", en: "Black tea" }, water: 250, time: 6,
      ingr: { fr: "1 sachet de thé noir (ou 2 g en vrac)", en: "1 black tea bag (or 2 g loose leaf)" },
      prep: { fr: "Faites chauffer 250 ml d'eau jusqu'à frémissement (95 °C) et laissez infuser le thé 3 à 4 minutes, puis retirez-le.", en: "Heat 250 ml of water to just off the boil (95 °C) and steep the tea for 3–4 minutes, then remove it." } },
    green: { icon: "🍵", name: { fr: "Thé vert", en: "Green tea" }, water: 250, time: 5,
      ingr: { fr: "1 sachet de thé vert (ou 2 g en vrac)", en: "1 green tea bag (or 2 g loose leaf)" },
      prep: { fr: "Faites chauffer 250 ml d'eau à environ 80 °C et laissez infuser le thé 2 à 3 minutes, puis retirez-le.", en: "Heat 250 ml of water to about 80 °C and steep the tea for 2–3 minutes, then remove it." } },
    rooibos: { icon: "🍂", name: { fr: "Rooibos", en: "Rooibos" }, water: 250, time: 7,
      ingr: { fr: "1 sachet de rooibos (ou 2 à 3 g en vrac)", en: "1 rooibos tea bag (or 2–3 g loose)" },
      prep: { fr: "Versez 250 ml d'eau bouillante sur le rooibos et laissez infuser 5 minutes.", en: "Pour 250 ml of boiling water over the rooibos and steep for 5 minutes." } },
    chamomile: { icon: "🌼", name: { fr: "Camomille", en: "Chamomile" }, water: 250, time: 7,
      ingr: { fr: "1 sachet de camomille (ou 1 c. à soupe de fleurs séchées)", en: "1 chamomile tea bag (or 1 tbsp dried flowers)" },
      prep: { fr: "Versez 250 ml d'eau très chaude sur la camomille, couvrez et laissez infuser 5 minutes.", en: "Pour 250 ml of very hot water over the chamomile, cover and steep for 5 minutes." } },
    verbena: { icon: "🌿", name: { fr: "Verveine", en: "Lemon verbena" }, water: 250, time: 7,
      ingr: { fr: "1 sachet de verveine (ou 5 à 6 feuilles séchées)", en: "1 lemon verbena tea bag (or 5–6 dried leaves)" },
      prep: { fr: "Versez 250 ml d'eau très chaude sur la verveine, couvrez et laissez infuser 5 minutes.", en: "Pour 250 ml of very hot water over the verbena, cover and steep for 5 minutes." } },
    linden: { icon: "🍃", name: { fr: "Tilleul", en: "Linden" }, water: 250, time: 7,
      ingr: { fr: "1 sachet de tilleul (ou 1 c. à soupe de fleurs séchées)", en: "1 linden tea bag (or 1 tbsp dried blossoms)" },
      prep: { fr: "Versez 250 ml d'eau très chaude sur le tilleul, couvrez et laissez infuser 5 à 7 minutes.", en: "Pour 250 ml of very hot water over the linden, cover and steep for 5–7 minutes." } },
    coffee: { icon: "☕", name: { fr: "Café", en: "Coffee" }, latte: { fr: "Café latte", en: "Coffee latte" }, water: 0, time: 5,
      ingr: { fr: "1 espresso double ou 120 ml de café filtre", en: "1 double espresso or 120 ml filter coffee" },
      prep: { fr: "Préparez un espresso double ou 120 ml de café filtre dans une grande tasse.", en: "Brew a double espresso or 120 ml of filter coffee into a large mug." } },
    cocoa: { icon: "🍫", name: { fr: "Chocolat chaud", en: "Hot chocolate" }, water: 0, time: 6, needsMilk: true,
      ingr: { fr: "2 c. à café de cacao non sucré (ou 20 g de chocolat noir)", en: "2 tsp unsweetened cocoa (or 20 g dark chocolate)" },
      prep: { fr: "Dans la tasse, délayez le cacao avec un peu de lait pour obtenir une pâte lisse.", en: "In the mug, mix the cocoa with a splash of milk into a smooth paste." } },
    chai: { icon: "🫚", name: { fr: "Chai", en: "Chai" }, latte: { fr: "Chai latte", en: "Chai latte" }, water: 150, time: 9,
      ingr: { fr: "1 sachet de thé noir, 1 bâton de cannelle, 2 capsules de cardamome, 1 tranche de gingembre", en: "1 black tea bag, 1 cinnamon stick, 2 cardamom pods, 1 slice of ginger" },
      prep: { fr: "Faites frémir 150 ml d'eau avec le thé et les épices 4 à 5 minutes, puis filtrez dans la tasse.", en: "Simmer 150 ml of water with the tea and spices for 4–5 minutes, then strain into the mug." } }
  };
  var MILKS = {
    none: { fr: "Sans lait", en: "No milk" },
    oat: { fr: "Boisson à l'avoine", en: "Oat drink" },
    almond: { fr: "Boisson à l'amande", en: "Almond drink" },
    cow: { fr: "Lait de vache", en: "Cow's milk" },
    coconut: { fr: "Boisson à la noix de coco", en: "Coconut drink" }
  };
  var SWEET = {
    none: { name: { fr: "Sans sucrant", en: "Unsweetened" } },
    honey: { name: { fr: "Miel", en: "Honey" }, qty: { fr: "1 c. à café de miel", en: "1 tsp honey" } },
    maple: { name: { fr: "Sirop d'érable", en: "Maple syrup" }, qty: { fr: "1 c. à café de sirop d'érable", en: "1 tsp maple syrup" } },
    sugar: { name: { fr: "Sucre", en: "Sugar" }, qty: { fr: "1 c. à café de sucre", en: "1 tsp sugar" } }
  };
  var EXTRAS = {
    cinnamon: { name: { fr: "Cannelle", en: "Cinnamon" }, qty: { fr: "1 pincée de cannelle", en: "1 pinch of cinnamon" } },
    orange: { name: { fr: "Écorce d'orange", en: "Orange peel" }, qty: { fr: "1 zeste d'écorce d'orange", en: "1 strip of orange peel" } },
    vanilla: { name: { fr: "Vanille", en: "Vanilla" }, qty: { fr: "2 gouttes d'extrait de vanille", en: "2 drops of vanilla extract" } },
    ginger: { name: { fr: "Gingembre", en: "Ginger" }, qty: { fr: "1 fine tranche de gingembre frais", en: "1 thin slice of fresh ginger" } },
    cardamom: { name: { fr: "Cardamome", en: "Cardamom" }, qty: { fr: "1 pincée de cardamome moulue", en: "1 pinch of ground cardamom" } },
    turmeric: { name: { fr: "Curcuma", en: "Turmeric" }, qty: { fr: "1 pincée de curcuma", en: "1 pinch of turmeric" } }
  };
  var MOODS = {
    morning: { icon: "🌅", name: { fr: "Matin", en: "Morning" } },
    afternoon: { icon: "☀️", name: { fr: "Après-midi", en: "Afternoon" } },
    evening: { icon: "🌙", name: { fr: "Soirée tranquille", en: "Evening wind-down" } }
  };
  var DEFAULTS = { b: "chamomile", m: "none", s: "honey", x: ["orange"], w: "evening" };
  var state;
  var isEmbed = new URLSearchParams(location.search).get("embed") === "1";

  function params() {
    var p = new URLSearchParams(location.search), s = {};
    s.b = BASES[p.get("b")] ? p.get("b") : DEFAULTS.b;
    s.m = MILKS[p.get("m")] ? p.get("m") : DEFAULTS.m;
    s.s = SWEET[p.get("s")] ? p.get("s") : DEFAULTS.s;
    s.w = MOODS[p.get("w")] ? p.get("w") : DEFAULTS.w;
    s.x = p.has("x") ? p.get("x").split(",").filter(function (k) { return EXTRAS[k]; }) : DEFAULTS.x.slice();
    return normalise(s);
  }
  function normalise(s) { if (BASES[s.b].needsMilk && s.m === "none") s.m = "oat"; return s; }
  function query(s, extra) {
    var p = new URLSearchParams();
    p.set("b", s.b); p.set("m", s.m); p.set("s", s.s); p.set("x", s.x.join(",")); p.set("w", s.w);
    if (PC.lang === "en") p.set("lang", "en");
    if (extra) Object.keys(extra).forEach(function (k) { p.set(k, extra[k]); });
    return p.toString();
  }
  function shareUrl() { return PC.SITE + TOOL_PATH + "?" + query(state); }

  function buildRecipe(s) {
    var L = PC.lang, fr = L === "fr", base = BASES[s.b], milk = s.m !== "none", sw = SWEET[s.s];
    var evening = s.w === "evening";
    var ext = evening
      ? { fr: "Reishi à l'écorce d'orange Pure Croft", en: "Pure Croft Reishi with orange peel" }
      : { fr: "Complexe 5 Champignons Pure Croft (Reishi, Crinière de lion, Cordyceps sinensis, Chaga, Shiitaké)", en: "Pure Croft 5-mushroom blend (Reishi, Lion's Mane, Cordyceps sinensis, Chaga, Shiitake)" };
    var milkMl = base.water ? (s.b === "chai" ? 120 : 60) : (s.b === "cocoa" ? 250 : 150);
    var ingr = [t(base.ingr)];
    if (base.water) ingr.push(base.water + (fr ? " ml d'eau" : " ml water"));
    if (milk) ingr.push(milkMl + " ml " + (fr ? "de " : "") + t(MILKS[s.m]).toLowerCase());
    if (sw.qty) ingr.push(t(sw.qty));
    s.x.forEach(function (k) { ingr.push(t(EXTRAS[k].qty)); });
    ingr.push((fr ? "3 à 5 gouttes d'extrait liquide de champignons, par ex. " : "3–5 drops of a liquid mushroom extract, e.g. ") + esc(t(ext)));

    var steps = [], spices = s.x.filter(function (k) { return k !== "vanilla"; });
    if (spices.length && base.water) steps.push(fr ? "Mettez " + spices.map(function (k) { return t(EXTRAS[k].qty); }).join(", ") + " dans la tasse ou la théière avec l'infusion." : "Add " + spices.map(function (k) { return t(EXTRAS[k].qty); }).join(", ") + " to the mug or pot with the tea.");
    steps.push(t(base.prep));
    if (milk) {
      if (base.water) steps.push(fr ? "Faites chauffer " + milkMl + " ml de " + t(MILKS[s.m]).toLowerCase() + " à environ 60–65 °C, faites mousser et versez-le sur l'infusion." : "Warm " + milkMl + " ml of " + t(MILKS[s.m]).toLowerCase() + " to about 60–65 °C, froth it and pour it over the tea.");
      else steps.push(fr ? "Faites chauffer " + milkMl + " ml de " + t(MILKS[s.m]).toLowerCase() + " à environ 60–65 °C sans ébullition, faites mousser et versez dans la tasse." : "Heat " + milkMl + " ml of " + t(MILKS[s.m]).toLowerCase() + " to about 60–65 °C without boiling, froth it and pour it into the mug.");
    }
    if (spices.length && !base.water) steps.push(fr ? "Ajoutez " + spices.map(function (k) { return t(EXTRAS[k].qty); }).join(", ") + "." : "Add " + spices.map(function (k) { return t(EXTRAS[k].qty); }).join(", ") + ".");
    if (s.x.indexOf("vanilla") > -1) steps.push(fr ? "Ajoutez 2 gouttes d'extrait de vanille." : "Add 2 drops of vanilla extract.");
    if (sw.qty) steps.push(fr ? "Sucrez avec " + t(sw.qty) + " et remuez." : "Sweeten with " + t(sw.qty) + " and stir.");
    steps.push(fr ? "Laissez tiédir 1 minute, puis ajoutez 3 à 5 gouttes d'extrait liquide de champignons (par ex. " + esc(t(ext)) + "). Remuez avant de déguster." : "Let it cool for a minute, then add 3–5 drops of a liquid mushroom extract (e.g. " + esc(t(ext)) + "). Stir before sipping.");

    var title = t(base.name);
    if (milk) title = base.latte ? t(base.latte) : (s.b === "cocoa" ? t(base.name) : (fr ? "Latte " + t(base.name).toLowerCase() : t(base.name) + " latte"));
    var sub = [MOODS[s.w].icon + " " + t(MOODS[s.w].name), t(MILKS[s.m]), t(sw.name)];
    return { title: title, sub: sub, ingr: ingr, steps: steps, time: base.time + (milk ? 2 : 0), icon: base.icon,
      tip: fr ? "Variante : remplacez les gouttes par 3 à 5 pulvérisations sous la langue. Les extraits Pure Croft sont sans alcool, dans de l'huile MCT : remuez bien avant de boire. Suivez toujours les indications de l'étiquette."
              : "Variation: swap the drops for 3–5 sprays under the tongue. Pure Croft extracts are alcohol-free and in MCT oil, so stir well before sipping. Always follow the directions on the label." };
  }

  function chips(id, name, dict, labelFn, current, multi, disabledFn) {
    var html = "";
    Object.keys(dict).forEach(function (k) {
      var iid = name + "-" + k, on = multi ? current.indexOf(k) > -1 : k === current, dis = disabledFn && disabledFn(k);
      html += '<input type="' + (multi ? "checkbox" : "radio") + '" name="' + name + '" id="' + iid + '" value="' + k + '"' + (on ? " checked" : "") + (dis ? " disabled" : "") + '><label for="' + iid + '">' + esc(labelFn(k)) + "</label>";
    });
    document.getElementById(id).innerHTML = html;
  }
  function renderForm() {
    chips("f-base", "b", BASES, function (k) { return BASES[k].icon + " " + t(BASES[k].name); }, state.b);
    chips("f-milk", "m", MILKS, function (k) { return t(MILKS[k]); }, state.m, false, function (k) { return k === "none" && BASES[state.b].needsMilk; });
    chips("f-sweet", "s", SWEET, function (k) { return t(SWEET[k].name); }, state.s);
    chips("f-extra", "x", EXTRAS, function (k) { return t(EXTRAS[k].name); }, state.x, true);
    chips("f-mood", "w", MOODS, function (k) { return MOODS[k].icon + " " + t(MOODS[k].name); }, state.w);
  }
  function renderCard() {
    var r = buildRecipe(state), fr = PC.lang === "fr";
    document.getElementById("recipe").innerHTML =
      '<div class="rc-head"><span class="rc-icon" aria-hidden="true">' + r.icon + '</span><div><p class="rc-kicker">' + (fr ? "Recette aux champignons" : "Mushroom tea & latte recipe") + '</p><h2 class="rc-title">' + esc(r.title) + '</h2><p class="rc-sub">' + r.sub.map(esc).join(" · ") + " · ⏱ " + r.time + " min</p></div></div>" +
      "<h3>" + (fr ? "Ingrédients" : "Ingredients") + '</h3><ul class="rc-ingr">' + r.ingr.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
      "<h3>" + (fr ? "Étapes" : "Steps") + '</h3><ol class="rc-steps">' + r.steps.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ol>" +
      '<p class="rc-tip">💡 ' + r.tip + "</p>" +
      '<p class="rc-foot">' + (fr ? "Recette créée avec le générateur gratuit de Pure Croft · " : "Recipe made with the free Pure Croft generator · ") + '<a href="' + SHOP + '" target="_blank" rel="noopener">purecroft.fr</a></p>';
  }
  function recipeText() {
    var r = buildRecipe(state), fr = PC.lang === "fr", strip = function (h) { var d = document.createElement("div"); d.innerHTML = h; return d.textContent; };
    return r.title + "\n" + r.sub.join(" · ") + " · " + r.time + " min\n\n" + (fr ? "Ingrédients" : "Ingredients") + "\n" + r.ingr.map(function (i) { return "- " + strip(i); }).join("\n") +
      "\n\n" + (fr ? "Étapes" : "Steps") + "\n" + r.steps.map(function (i, n) { return (n + 1) + ". " + strip(i); }).join("\n") + "\n\n" + r.tip + "\n\n" + shareUrl();
  }
  function embedCode() {
    var fr = PC.lang === "fr", src = PC.SITE + TOOL_PATH + "?" + query(state, { embed: "1" });
    return '<iframe src="' + src.replace(/&/g, "&amp;") + '" title="' + (fr ? "Générateur de recettes de thé et latte aux champignons" : "Mushroom Tea & Latte Recipe Generator") + '" width="100%" height="950" style="border:0;max-width:720px;width:100%;" loading="lazy"></iframe>\n' +
      '<p style="font-size:13px;margin:4px 0 0;">' + (fr ? "Outil gratuit par " : "Free tool by ") + '<a href="https://purecroft.fr">Pure Croft</a></p>';
  }
  function update(push) {
    state = normalise(state); renderForm(); renderCard();
    document.getElementById("embed-code").value = embedCode();
    if (push) history.replaceState(null, "", location.pathname + "?" + query(state, isEmbed ? { embed: "1" } : null));
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (isEmbed) document.documentElement.classList.add("embed");
    state = params(); update(false);
    document.getElementById("builder").addEventListener("change", function (e) {
      var n = e.target && e.target.name; if (!n) return;
      if (n === "x") state.x = Array.prototype.map.call(document.querySelectorAll('input[name="x"]:checked'), function (i) { return i.value; });
      else state[n] = e.target.value;
      update(true);
    });
    document.getElementById("btn-random").addEventListener("click", function () {
      function pick(o) { var k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; }
      var xs = Object.keys(EXTRAS).filter(function () { return Math.random() < 0.3; }).slice(0, 2);
      state = { b: pick(BASES), m: pick(MILKS), s: pick(SWEET), x: xs, w: pick(MOODS) }; update(true);
    });
    document.getElementById("btn-copy").addEventListener("click", function () { PC.copy(recipeText()).then(function () { PC.toast(PC.lang === "fr" ? "Recette copiée !" : "Recipe copied!"); }); });
    document.getElementById("btn-print").addEventListener("click", function () { window.print(); });
    document.getElementById("btn-share").addEventListener("click", function () {
      var url = shareUrl();
      if (navigator.share) { navigator.share({ title: document.querySelector(".rc-title").textContent, url: url }).catch(function () {}); return; }
      PC.copy(url).then(function () { PC.toast(PC.lang === "fr" ? "Lien copié !" : "Link copied!"); });
    });
    document.getElementById("btn-embed").addEventListener("click", function () { PC.copy(embedCode()).then(function () { PC.toast(PC.lang === "fr" ? "Code d'intégration copié !" : "Embed code copied!"); }); });
    PC.onLang(function () { update(true); });
  });
  window.PCTea = { BASES: BASES, MILKS: MILKS, SWEET: SWEET, EXTRAS: EXTRAS, MOODS: MOODS, buildRecipe: buildRecipe };
})();
