/* Clean Label Checker (web) - highlights fillers, excipients and additives in a pasted ingredient list.
 * Uses the same dictionary (data.js / CLC_DATA) as the Pure Croft Clean Label Checker browser extension.
 * Runs entirely in the browser; nothing is sent anywhere. MIT License (c) 2026 Pure Croft SASU */
(function () {
  "use strict";
  var D = globalThis.CLC_DATA;
  var t = PC.t, esc = PC.esc;

  var CAT_COLOURS = {
    filler: "#f6d7a7", anticaking: "#e3d5f5", thickener: "#cfe8f7", sugar: "#f9c9c9", sweetener: "#fbd3e9",
    colour: "#ffe08a", preservative: "#d3f0d8", capsule: "#e8e1d9", mycelium: "#d8ecc7", flavour: "#f2e2c4",
    emulsifier: "#d6e4ff", enumber: "#e6e6e6"
  };

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var B_OPEN = "(?<![\\p{L}\\p{N}])", B_CLOSE = "(?![\\p{L}\\p{N}])";

  // Web-only synonyms added on top of the shared dictionary (kept here so data.js stays identical to the extension's).
  var EXTRA_TERMS = { polyols: ["sugar alcohols", "sugar alcohol", "polyols", "polyol"] };
  D.INGREDIENTS.forEach(function (ing) {
    if (EXTRA_TERMS[ing.id]) ing.terms = (ing.terms || []).concat(EXTRA_TERMS[ing.id].filter(function (x) { return ing.terms.indexOf(x) === -1; }));
  });

  // Build one matcher per dictionary term; normalise apostrophes so ' and ’ both match.
  var TERM_MATCHERS = [];
  D.INGREDIENTS.forEach(function (ing) {
    (ing.terms || []).forEach(function (term) {
      var pat = escRe(term.toLowerCase()).replace(/'/g, "['’]").replace(/ /g, "\\s+").replace(/-/g, "[-\\s]?");
      TERM_MATCHERS.push({ re: new RegExp(B_OPEN + pat + B_CLOSE, "giu"), ing: ing });
    });
  });

  // E-number -> ingredient map (normalised as E123a)
  var E_MAP = {};
  D.INGREDIENTS.forEach(function (ing) { (ing.e || []).forEach(function (e) { E_MAP[e.toUpperCase()] = ing; }); });
  var E_RE = /(?<![\p{L}\p{N}])E[\s-]?(\d{3,4})(?:\s?([a-d])(?![\p{L}])|\s?\(?\s?(i{1,3}|iv|v)\s?\)(?![\p{L}]))?/giu;

  function normE(num, letter, roman) {
    var code = "E" + num + (letter ? letter.toLowerCase() : "") + (roman ? roman.toLowerCase() : "");
    return code;
  }

  function lookupE(code) {
    var up = code.toUpperCase();
    if (E_MAP[up]) return E_MAP[up];
    var noRoman = up.replace(/(I{1,3}|IV|V)$/, "");
    if (E_MAP[noRoman]) return E_MAP[noRoman];
    var num = up.match(/^E(\d{3,4})/);
    if (num && E_MAP["E" + num[1]]) return E_MAP["E" + num[1]];
    return null;
  }

  function rangeFor(num) {
    var n = parseInt(num, 10);
    for (var i = 0; i < D.E_RANGES.length; i++) if (n >= D.E_RANGES[i].from && n <= D.E_RANGES[i].to) return D.E_RANGES[i];
    return null;
  }

  function analyse(text) {
    var hits = [];
    TERM_MATCHERS.forEach(function (m) {
      m.re.lastIndex = 0; var r;
      while ((r = m.re.exec(text))) hits.push({ start: r.index, end: r.index + r[0].length, ing: m.ing, text: r[0] });
    });
    E_RE.lastIndex = 0; var e;
    while ((e = E_RE.exec(text))) {
      var code = normE(e[1], e[2], e[3]), ing = lookupE(code);
      if (ing) hits.push({ start: e.index, end: e.index + e[0].length, ing: ing, text: e[0], code: code });
      else {
        var rg = rangeFor(e[1]);
        hits.push({ start: e.index, end: e.index + e[0].length, text: e[0], code: code.toUpperCase().replace(/^E/, "E"),
          ing: { id: "e-" + code.toLowerCase(), cat: "enumber", name: { en: code, fr: code },
                 info: rg ? { en: "EU food-additive number in the " + rg.en + " range (E" + rg.from + "–E" + rg.to + ").",
                              fr: "Numéro d'additif alimentaire UE de la catégorie " + rg.fr + " (E" + rg.from + "–E" + rg.to + ")." }
                          : { en: "EU food-additive number.", fr: "Numéro d'additif alimentaire UE." } } });
      }
    }
    // resolve overlaps: longest match first, then earliest
    hits.sort(function (a, b) { return (b.end - b.start) - (a.end - a.start) || a.start - b.start; });
    var taken = [], kept = [];
    hits.forEach(function (h) {
      for (var i = 0; i < taken.length; i++) if (h.start < taken[i][1] && h.end > taken[i][0]) return;
      taken.push([h.start, h.end]); kept.push(h);
    });
    kept.sort(function (a, b) { return a.start - b.start; });
    return kept;
  }

  function group(hits) {
    var byId = {}, order = [];
    hits.forEach(function (h) {
      if (!byId[h.ing.id]) { byId[h.ing.id] = { ing: h.ing, found: [] }; order.push(h.ing.id); }
      var f = h.text.replace(/\s+/g, " ").trim();
      if (byId[h.ing.id].found.indexOf(f) === -1) byId[h.ing.id].found.push(f);
    });
    return order.map(function (id) { return byId[id]; });
  }

  function render() {
    var text = document.getElementById("ingredients").value;
    var out = document.getElementById("results"), hl = document.getElementById("highlighted"), sum = document.getElementById("summary");
    var L = PC.lang;
    if (!text.trim()) {
      out.innerHTML = ""; hl.innerHTML = ""; sum.textContent = L === "fr" ? "Collez une liste d'ingrédients pour commencer." : "Paste an ingredient list to get started.";
      document.getElementById("result-wrap").hidden = true;
      return;
    }
    document.getElementById("result-wrap").hidden = false;
    var hits = analyse(text), groups = group(hits);

    // highlighted text
    var html = "", pos = 0;
    hits.forEach(function (h) {
      html += esc(text.slice(pos, h.start));
      html += '<mark style="background:' + (CAT_COLOURS[h.ing.cat] || "#eee") + '" title="' + esc(t(h.ing.name) + " – " + t(D.CATEGORIES[h.ing.cat])) + '">' + esc(text.slice(h.start, h.end)) + "</mark>";
      pos = h.end;
    });
    html += esc(text.slice(pos));
    hl.innerHTML = html;

    if (!groups.length) {
      sum.textContent = L === "fr" ? "Aucun des ingrédients de notre liste n'a été repéré." : "None of the ingredients in our list were found.";
      out.innerHTML = "";
      return;
    }
    sum.textContent = L === "fr"
      ? groups.length + " ingrédient" + (groups.length > 1 ? "s" : "") + " repéré" + (groups.length > 1 ? "s" : "") + " dans notre liste."
      : groups.length + " ingredient" + (groups.length > 1 ? "s" : "") + " from our list found.";

    var cats = {};
    groups.forEach(function (g) { (cats[g.ing.cat] = cats[g.ing.cat] || []).push(g); });
    var res = "";
    Object.keys(D.CATEGORIES).forEach(function (c) {
      if (!cats[c]) return;
      res += '<section class="cat"><h3><span class="dot" style="background:' + CAT_COLOURS[c] + '"></span>' + esc(t(D.CATEGORIES[c])) + " (" + cats[c].length + ")</h3><ul>";
      cats[c].forEach(function (g) {
        var e = g.ing.e && g.ing.e.length ? ' <span class="enum">' + esc(g.ing.e.join(", ")) + "</span>" : "";
        res += "<li><strong>" + esc(t(g.ing.name)) + "</strong>" + e + "<br><span>" + esc(t(g.ing.info)) + '</span><br><span class="note">' +
               (L === "fr" ? "Trouvé : " : "Found: ") + esc(g.found.join(", ")) + "</span></li>";
      });
      res += "</ul></section>";
    });
    out.innerHTML = res;
  }

  var SAMPLES = {
    fr: "Ingrédients : maltodextrine, extrait de Reishi (Ganoderma lucidum) 20 %, mycélium de crinière de lion cultivé sur grain (riz mycélisé), agent de charge : cellulose microcristalline, antiagglomérants : stéarate de magnésium, dioxyde de silicium ; gélule : hydroxypropylméthylcellulose, colorant : E171, édulcorant : sucralose, arôme.",
    en: "Ingredients: maltodextrin, Reishi (Ganoderma lucidum) extract 20%, lion's mane mycelium on grain (myceliated brown rice), bulking agent: microcrystalline cellulose, anti-caking agents: magnesium stearate, silicon dioxide; capsule: hydroxypropyl methylcellulose, colour: E171, sweetener: sucralose, E330, flavouring."
  };

  function renderLegend() {
    var el = document.getElementById("legend"); if (!el) return;
    el.innerHTML = Object.keys(D.CATEGORIES).map(function (c) {
      return '<span class="leg"><span class="dot" style="background:' + CAT_COLOURS[c] + '"></span>' + esc(t(D.CATEGORIES[c])) + "</span>";
    }).join("");
    ["dict-count", "dict-count-en"].forEach(function (id) { var c = document.getElementById(id); if (c) c.textContent = String(D.INGREDIENTS.length); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var ta = document.getElementById("ingredients"), timer;
    ta.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 150); });
    document.getElementById("btn-sample").addEventListener("click", function () { ta.value = SAMPLES[PC.lang]; render(); });
    document.getElementById("btn-clear").addEventListener("click", function () { ta.value = ""; render(); ta.focus(); });
    PC.onLang(function () { renderLegend(); render(); });
    renderLegend(); render();
  });

  window.PCCLC = { analyse: analyse, group: group };
})();
