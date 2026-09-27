/* Mushroom Coffee Builder / Créateur de café aux champignons
 * Static, no backend, no tracking. MIT License (c) 2026 Pure Croft SASU */
(function () {
  "use strict";
  var PRODUCT_URL = "https://purecroft.fr/products/5-champignons-complexe-gouttes";
  var TOOL_PATH = "mushroom-coffee-builder/";

  // ---------- data ----------
  var BASES = {
    espresso: { name: { fr: "Espresso", en: "Espresso" }, iced: { fr: "Espresso glacé", en: "Iced espresso" },
      temps: ["hot", "iced"], milkMl: 30, time: 5, needsMilk: false, icon: "☕",
      prep: { fr: "Préparez un espresso simple ou double (environ 30 à 60 ml).", en: "Pull a single or double espresso shot (about 30–60 ml)." } },
    filter: { name: { fr: "Café filtre", en: "Filter coffee" }, iced: { fr: "Café filtre glacé", en: "Iced filter coffee" },
      temps: ["hot", "iced"], milkMl: 40, time: 6, needsMilk: false, icon: "☕",
      prep: { fr: "Préparez 200 à 250 ml de café filtre (environ 60 g de café moulu par litre d'eau).", en: "Brew 200–250 ml of filter coffee (about 60 g of ground coffee per litre of water)." },
      prepIced: { fr: "Préparez 150 ml de café filtre un peu plus corsé (environ 75 g de café moulu par litre) : la glace va le diluer.", en: "Brew 150 ml of slightly stronger filter coffee (about 75 g of ground coffee per litre) – the ice will dilute it." } },
    latte: { name: { fr: "Latte", en: "Latte" }, iced: { fr: "Latte glacé", en: "Iced latte" },
      temps: ["hot", "iced"], milkMl: 180, time: 6, needsMilk: true, icon: "🥛",
      prep: { fr: "Préparez un espresso double (environ 60 ml) directement dans une grande tasse.", en: "Pull a double espresso (about 60 ml) straight into a large cup." },
      prepIced: { fr: "Préparez un espresso double (environ 60 ml) dans un petit pichet.", en: "Pull a double espresso (about 60 ml) into a small jug." } },
    icedcoffee: { name: { fr: "Café glacé", en: "Iced coffee" }, iced: { fr: "Café glacé", en: "Iced coffee" },
      temps: ["iced"], milkMl: 120, time: 5, needsMilk: false, icon: "🧊",
      prep: { fr: "Préparez un espresso double ou 120 ml de café filtre bien corsé.", en: "Make a double espresso or 120 ml of strong filter coffee." } },
    coldbrew: { name: { fr: "Cold brew", en: "Cold brew" }, iced: { fr: "Cold brew", en: "Cold brew" },
      temps: ["iced"], milkMl: 60, time: 5, needsMilk: false, icon: "🫙", ahead: true,
      prep: { fr: "La veille : mélangez 100 g de café moulu gros avec 800 ml d'eau froide, laissez infuser 12 à 18 h au réfrigérateur, puis filtrez. Vous obtenez un concentré qui se garde quelques jours au frais.", en: "The day before: stir 100 g of coarsely ground coffee into 800 ml of cold water, steep 12–18 h in the fridge, then strain. This makes a concentrate that keeps a few days in the fridge." },
      prep2: { fr: "Versez 100 ml de concentré de cold brew et allongez avec 50 à 100 ml d'eau froide, selon votre goût.", en: "Pour 100 ml of cold brew concentrate and top up with 50–100 ml of cold water, to taste." } },
    matcha: { name: { fr: "Matcha latte", en: "Matcha latte" }, iced: { fr: "Matcha latte glacé", en: "Iced matcha latte" },
      temps: ["hot", "iced"], milkMl: 200, time: 5, needsMilk: true, icon: "🍵",
      prep: { fr: "Tamisez 1 à 2 g de matcha (½ à 1 c. à café) dans un bol et fouettez-le avec 60 ml d'eau à environ 80 °C jusqu'à ce qu'il mousse.", en: "Sift 1–2 g of matcha (½–1 tsp) into a bowl and whisk it with 60 ml of water at about 80 °C until frothy." } },
    chocolate: { name: { fr: "Chocolat chaud", en: "Hot chocolate" }, iced: { fr: "Chocolat glacé", en: "Iced chocolate" },
      temps: ["hot", "iced"], milkMl: 250, time: 7, needsMilk: true, icon: "🍫",
      prep: { fr: "Dans une tasse, délayez 2 c. à café de cacao en poudre non sucré (ou 20 g de chocolat noir fondu) avec un peu de lait.", en: "In a cup, mix 2 tsp of unsweetened cocoa powder (or 20 g of melted dark chocolate) into a paste with a splash of milk." } },
    chai: { name: { fr: "Chai latte", en: "Chai latte" }, iced: { fr: "Chai latte glacé", en: "Iced chai latte" },
      temps: ["hot", "iced"], milkMl: 150, time: 8, needsMilk: false, icon: "🫖",
      prep: { fr: "Faites infuser 1 sachet de thé noir avec 1 bâton de cannelle, 2 capsules de cardamome écrasées et 1 tranche de gingembre dans 120 ml d'eau frémissante pendant 4 à 5 minutes, puis filtrez (ou utilisez 60 ml de concentré de chai).", en: "Steep 1 black tea bag with 1 cinnamon stick, 2 crushed cardamom pods and 1 slice of ginger in 120 ml of simmering water for 4–5 minutes, then strain (or use 60 ml of chai concentrate)." } }
  };

  var MILKS = {
    none: { fr: "Sans lait", en: "No milk" },
    whole: { fr: "Lait entier", en: "Whole milk" },
    semi: { fr: "Lait demi-écrémé", en: "Semi-skimmed milk" },
    oat: { fr: "Boisson à l'avoine", en: "Oat drink" },
    almond: { fr: "Boisson à l'amande", en: "Almond drink" },
    soy: { fr: "Boisson au soja", en: "Soy drink" },
    coconut: { fr: "Boisson à la noix de coco", en: "Coconut drink" }
  };

  var SWEET = {
    none: { name: { fr: "Sans sucre", en: "Unsweetened" } },
    sugar: { name: { fr: "Sucre", en: "Sugar" }, qty: { fr: "1 à 2 c. à café de sucre", en: "1–2 tsp sugar" }, solid: true },
    coconut: { name: { fr: "Sucre de coco", en: "Coconut sugar" }, qty: { fr: "1 à 2 c. à café de sucre de coco", en: "1–2 tsp coconut sugar" }, solid: true },
    honey: { name: { fr: "Miel", en: "Honey" }, qty: { fr: "1 c. à café de miel", en: "1 tsp honey" } },
    maple: { name: { fr: "Sirop d'érable", en: "Maple syrup" }, qty: { fr: "1 c. à café de sirop d'érable", en: "1 tsp maple syrup" } },
    agave: { name: { fr: "Sirop d'agave", en: "Agave syrup" }, qty: { fr: "1 c. à café de sirop d'agave", en: "1 tsp agave syrup" } },
    vanilla: { name: { fr: "Sirop de vanille", en: "Vanilla syrup" }, qty: { fr: "10 ml de sirop de vanille", en: "10 ml vanilla syrup" } }
  };

  var TEMPS = { hot: { fr: "Chaud", en: "Hot" }, iced: { fr: "Glacé", en: "Iced" } };

  var EXTRAS = {
    none: { name: { fr: "Aucun", en: "None" } },
    cinnamon: { name: { fr: "Cannelle", en: "Cinnamon" }, qty: { fr: "1 pincée de cannelle", en: "1 pinch of cinnamon" } },
    cocoa: { name: { fr: "Cacao", en: "Cocoa" }, qty: { fr: "1 pincée de cacao en poudre", en: "1 pinch of cocoa powder" } },
    cardamom: { name: { fr: "Cardamome", en: "Cardamom" }, qty: { fr: "1 pincée de cardamome moulue", en: "1 pinch of ground cardamom" } },
    nutmeg: { name: { fr: "Muscade", en: "Nutmeg" }, qty: { fr: "1 pincée de muscade râpée", en: "1 pinch of grated nutmeg" } },
    vanilla: { name: { fr: "Vanille", en: "Vanilla" }, qty: { fr: "quelques gouttes d'extrait de vanille", en: "a few drops of vanilla extract" } }
  };

  var DEFAULTS = { b: "latte", m: "oat", s: "none", t: "hot", x: "none" };
  var state = {};
  var t = PC.t, esc = PC.esc;

  // ---------- helpers ----------
  function params() {
    var p = new URLSearchParams(location.search), s = {};
    s.b = BASES[p.get("b")] ? p.get("b") : DEFAULTS.b;
    s.m = MILKS[p.get("m")] ? p.get("m") : DEFAULTS.m;
    s.s = SWEET[p.get("s")] ? p.get("s") : DEFAULTS.s;
    s.t = TEMPS[p.get("t")] ? p.get("t") : DEFAULTS.t;
    s.x = EXTRAS[p.get("x")] ? p.get("x") : DEFAULTS.x;
    return normalise(s);
  }

  function normalise(s) {
    var base = BASES[s.b];
    if (base.temps.indexOf(s.t) === -1) s.t = base.temps[0];
    if (base.needsMilk && s.m === "none") s.m = "oat";
    return s;
  }

  function query(s, extra) {
    var p = new URLSearchParams();
    ["b", "m", "s", "t", "x"].forEach(function (k) { p.set(k, s[k]); });
    if (PC.lang === "en") p.set("lang", "en");
    if (extra) Object.keys(extra).forEach(function (k) { p.set(k, extra[k]); });
    return p.toString();
  }

  function shareUrl() { return PC.SITE + TOOL_PATH + "?" + query(state); }
  var isEmbed = new URLSearchParams(location.search).get("embed") === "1";

  function milkName(m) { return t(MILKS[m]).toLowerCase(); }

  // ---------- recipe ----------
  function buildRecipe(s) {
    var L = PC.lang, base = BASES[s.b], iced = s.t === "iced", milk = s.m !== "none";
    var sw = SWEET[s.s], ex = EXTRAS[s.x];
    var steps = [], ingr = [];
    var ml = base.milkMl;
    var drops = L === "fr"
      ? 'Ajoutez quelques gouttes d\'extrait de champignons <a href="' + PRODUCT_URL + '" target="_blank" rel="noopener">Pure Croft 5 Champignons</a> (suivez la dose indiquée sur l\'étiquette de votre produit) et mélangez bien.'
      : 'Add a few drops of <a href="' + PRODUCT_URL + '" target="_blank" rel="noopener">Pure Croft 5 Champignons</a> mushroom extract (follow the dose on your product label) and stir well.';

    // ingredients
    var baseIngr = {
      espresso: { fr: "1 à 2 doses d'espresso (7 à 18 g de café moulu)", en: "1–2 espresso shots (7–18 g ground coffee)" },
      filter: { fr: "15 g de café moulu moyen", en: "15 g medium-ground coffee" },
      latte: { fr: "1 espresso double (environ 18 g de café moulu)", en: "1 double espresso (about 18 g ground coffee)" },
      icedcoffee: { fr: "1 espresso double ou 120 ml de café filtre corsé", en: "1 double espresso or 120 ml strong filter coffee" },
      coldbrew: { fr: "100 ml de concentré de cold brew (100 g de café moulu gros + 800 ml d'eau)", en: "100 ml cold brew concentrate (100 g coarse coffee + 800 ml water)" },
      matcha: { fr: "1 à 2 g de matcha", en: "1–2 g matcha" },
      chocolate: { fr: "2 c. à café de cacao non sucré ou 20 g de chocolat noir", en: "2 tsp unsweetened cocoa or 20 g dark chocolate" },
      chai: { fr: "1 sachet de thé noir, 1 bâton de cannelle, 2 capsules de cardamome, 1 tranche de gingembre", en: "1 black tea bag, 1 cinnamon stick, 2 cardamom pods, 1 slice of ginger" }
    }[s.b];
    ingr.push(t(baseIngr));
    if (milk) ingr.push(ml + " ml " + (L === "fr" ? "de " : "") + milkName(s.m));
    if (sw.qty) ingr.push(t(sw.qty));
    if (ex.qty) ingr.push(t(ex.qty));
    if (iced) ingr.push(L === "fr" ? "1 verre de glaçons" : "1 glass of ice cubes");
    ingr.push((L === "fr" ? "Quelques gouttes de " : "A few drops of ") + '<a href="' + PRODUCT_URL + '" target="_blank" rel="noopener">Pure Croft 5 Champignons</a>');

    // steps
    if (s.b === "coldbrew") {
      steps.push(t(base.prep));
      steps.push(L === "fr" ? "Remplissez un grand verre de glaçons." : "Fill a tall glass with ice.");
      steps.push(t(base.prep2));
      steps.push(drops);
    } else {
      steps.push(t(iced && base.prepIced ? base.prepIced : base.prep));
      if (sw.qty) {
        if (iced && sw.solid) steps.push(L === "fr" ? "Faites fondre le sucre dans la boisson encore chaude, avant d'ajouter la glace." : "Dissolve the sugar in the base while it is still warm, before adding ice.");
        else steps.push(L === "fr" ? "Ajoutez " + t(sw.qty) + " et remuez." : "Stir in " + t(sw.qty) + ".");
      }
      steps.push(drops);
      if (iced) steps.push(L === "fr" ? "Remplissez un grand verre de glaçons et versez-y la préparation." : "Fill a tall glass with ice and pour the drink over it.");
    }

    if (milk) {
      if (iced) {
        steps.push(L === "fr" ? "Versez par-dessus " + ml + " ml de " + milkName(s.m) + ", bien frais." : "Pour " + ml + " ml of cold " + milkName(s.m) + " on top.");
      } else if (ml <= 40) {
        steps.push(L === "fr" ? "Ajoutez un nuage de " + milkName(s.m) + " (environ " + ml + " ml), chaud ou froid." : "Add a splash of " + milkName(s.m) + " (about " + ml + " ml), warm or cold.");
      } else {
        steps.push(L === "fr" ? "Faites chauffer " + ml + " ml de " + milkName(s.m) + " jusqu'à environ 60–65 °C, sans ébullition, puis faites mousser (mousseur, fouet ou bocal fermé secoué)." : "Heat " + ml + " ml of " + milkName(s.m) + " to about 60–65 °C without boiling, then froth it (frother, whisk or a shaken closed jar).");
        steps.push(L === "fr" ? "Versez le liquide chaud dans la tasse en retenant la mousse, puis déposez la mousse sur le dessus." : "Pour the milk into the cup, holding back the foam, then spoon the foam on top.");
      }
    } else if (s.b === "chai" && !iced) {
      steps.push(L === "fr" ? "Servez tel quel, comme un thé épicé." : "Serve as it is, like a spiced tea.");
    }
    if (ex.qty) steps.push(L === "fr" ? "Terminez avec " + t(ex.qty) + "." : "Finish with " + t(ex.qty) + ".");
    steps.push(L === "fr" ? "Remuez une dernière fois et dégustez." : "Give it a final stir and enjoy.");

    var title = iced ? t(base.iced) : t(base.name);
    var sub = [t(TEMPS[s.t]), t(MILKS[s.m]), t(sw.name)];
    if (ex.qty) sub.push(t(ex.name));
    return { title: title, sub: sub, ingr: ingr, steps: steps, time: base.time, ahead: base.ahead, icon: base.icon };
  }

  // ---------- rendering ----------
  function chips(container, name, dict, labelFn, current, disabledFn) {
    var html = "";
    Object.keys(dict).forEach(function (k) {
      var id = name + "-" + k, dis = disabledFn && disabledFn(k);
      html += '<input type="radio" name="' + name + '" id="' + id + '" value="' + k + '"' + (k === current ? " checked" : "") + (dis ? " disabled" : "") + '>' +
              '<label for="' + id + '">' + esc(labelFn(k)) + "</label>";
    });
    container.innerHTML = html;
  }

  function renderForm() {
    var base = BASES[state.b];
    chips(document.getElementById("f-base"), "b", BASES, function (k) { return BASES[k].icon + " " + t(BASES[k].name); }, state.b);
    chips(document.getElementById("f-milk"), "m", MILKS, function (k) { return t(MILKS[k]); }, state.m, function (k) { return k === "none" && base.needsMilk; });
    chips(document.getElementById("f-sweet"), "s", SWEET, function (k) { return t(SWEET[k].name); }, state.s);
    chips(document.getElementById("f-temp"), "t", TEMPS, function (k) { return t(TEMPS[k]); }, state.t, function (k) { return base.temps.indexOf(k) === -1; });
    chips(document.getElementById("f-extra"), "x", EXTRAS, function (k) { return t(EXTRAS[k].name); }, state.x);
  }

  function renderCard() {
    var r = buildRecipe(state), L = PC.lang;
    var html = '<div class="rc-head"><span class="rc-icon" aria-hidden="true">' + r.icon + '</span><div>' +
      '<p class="rc-kicker">' + (L === "fr" ? "Recette de café aux champignons" : "Mushroom coffee recipe") + "</p>" +
      '<h2 class="rc-title">' + esc(r.title) + "</h2>" +
      '<p class="rc-sub">' + r.sub.map(esc).join(" · ") + " · ⏱ " + r.time + " min" + (r.ahead ? (L === "fr" ? " (+ infusion la veille)" : " (+ overnight steep)") : "") + "</p></div></div>" +
      "<h3>" + (L === "fr" ? "Ingrédients" : "Ingredients") + "</h3><ul class=\"rc-ingr\">" + r.ingr.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
      "<h3>" + (L === "fr" ? "Étapes" : "Steps") + "</h3><ol class=\"rc-steps\">" + r.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" +
      '<p class="rc-foot">' + (L === "fr" ? "Recette créée avec le Créateur de café aux champignons de Pure Croft · purecroft.fr" : "Recipe made with the Pure Croft Mushroom Coffee Builder · purecroft.fr") + "</p>";
    document.getElementById("recipe").innerHTML = html;
  }

  function embedCode() {
    var L = PC.lang, url = PC.SITE + TOOL_PATH;
    var src = url + "?" + query(state, { embed: "1" });
    var title = L === "fr" ? "Créateur de café aux champignons – Pure Croft" : "Mushroom Coffee Builder – Pure Croft";
    var credit = L === "fr" ? "Outil de recettes par Pure Croft" : "Recipe tool by Pure Croft";
    return '<iframe src="' + src.replace(/&/g, "&amp;") + '" title="' + title + '" width="100%" height="900" style="border:0;max-width:720px;width:100%;" loading="lazy"></iframe>\n' +
      '<p style="font-size:13px;margin:4px 0 0;"><a href="' + url + (L === "en" ? "?lang=en" : "") + '">' + credit + "</a></p>";
  }

  function update(push) {
    state = normalise(state);
    renderForm(); renderCard();
    var ta = document.getElementById("embed-code"); if (ta) ta.value = embedCode();
    if (push) {
      var q = query(state, isEmbed ? { embed: "1" } : null);
      history.replaceState(null, "", location.pathname + "?" + q);
    }
  }

  // ---------- init ----------
  document.addEventListener("DOMContentLoaded", function () {
    if (isEmbed) document.documentElement.classList.add("embed");
    state = params();
    update(false);

    document.getElementById("builder").addEventListener("change", function (e) {
      if (e.target && e.target.name && state.hasOwnProperty(e.target.name)) {
        state[e.target.name] = e.target.value; update(true);
      }
    });
    document.getElementById("btn-random").addEventListener("click", function () {
      function pick(o) { var k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; }
      state = { b: pick(BASES), m: pick(MILKS), s: pick(SWEET), t: pick(TEMPS), x: pick(EXTRAS) };
      update(true);
    });
    document.getElementById("btn-print").addEventListener("click", function () { window.print(); });
    document.getElementById("btn-share").addEventListener("click", function () {
      var url = shareUrl(), title = document.querySelector(".rc-title").textContent;
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
      PC.copy(url).then(function () { PC.toast(PC.lang === "fr" ? "Lien copié !" : "Link copied!"); });
    });
    var be = document.getElementById("btn-embed");
    if (be) be.addEventListener("click", function () {
      PC.copy(embedCode()).then(function () { PC.toast(PC.lang === "fr" ? "Code d'intégration copié !" : "Embed code copied!"); });
    });
    PC.onLang(function () { update(true); });
  });

  // exposed for tests
  window.PCCoffee = { BASES: BASES, MILKS: MILKS, SWEET: SWEET, TEMPS: TEMPS, EXTRAS: EXTRAS, buildRecipe: buildRecipe, normalise: normalise };
})();
