/* Glossary search - filters terms client-side (accent- and case-insensitive).
 * MIT License (c) 2026 Pure Croft SASU */
(function () {
  "use strict";
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "'"); }
  document.addEventListener("DOMContentLoaded", function () {
    var q = document.getElementById("q"), terms = Array.prototype.slice.call(document.querySelectorAll(".term"));
    var count = document.getElementById("count"), empty = document.getElementById("empty");
    terms.forEach(function (el) { el._s = norm(el.getAttribute("data-search")); });
    function run() {
      var words = norm(q.value).split(/\s+/).filter(Boolean), shown = 0;
      terms.forEach(function (el) {
        var ok = words.every(function (w) { return el._s.indexOf(w) !== -1; });
        el.hidden = !ok; if (ok) shown++;
      });
      empty.hidden = shown !== 0;
      count.textContent = PC.lang === "fr" ? shown + " terme" + (shown > 1 ? "s" : "") + " sur " + terms.length : shown + " of " + terms.length + " terms";
      var u = new URL(location.href);
      if (q.value.trim()) u.searchParams.set("q", q.value.trim()); else u.searchParams.delete("q");
      history.replaceState(null, "", u);
    }
    var init = new URLSearchParams(location.search).get("q"); if (init) q.value = init;
    q.addEventListener("input", run);
    PC.onLang(run);
    run();
  });
})();
