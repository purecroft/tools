// Node smoke test for the Clean Label Checker matcher. Run: node _build/test_clc.js
global.window = global; global.PC = { t: function (o) { return o.en; }, esc: String, lang: "en", onLang: function () {} };
global.document = { addEventListener: function () {} };
require("../clean-label-checker/data.js");
require("../clean-label-checker/app.js");
var samples = [
  "Ingrédients : maltodextrine, extrait de Reishi, riz mycélisé, cellulose microcristalline, stéarate de magnésium, dioxyde de silicium ; gélule : hydroxypropylméthylcellulose, colorant : E171, édulcorant : sucralose, arôme, E 330, E-460(ii), E150d, sirop de glucose-fructose, lécithine de tournesol, carraghénanes.",
  "Ingredients: maltodextrin, lion's mane mycelium on grain, microcrystalline cellulose, magnesium stearate, silicon dioxide, E171, sucralose, E330, sugar, sugar alcohols, glucose syrup, Mycelium, E1442."
];
samples.forEach(function (s) {
  PCCLC.analyse(s).forEach(function (h) { console.log(JSON.stringify(h.text), "->", h.ing.id, h.ing.cat); });
  console.log("---");
});
