/* Pure Croft Tools - shared helpers (language toggle, toast, copy).
 * No tracking, no cookies. The chosen language is kept in the URL (?lang=en)
 * and in localStorage on the visitor's own device only.
 * MIT License (c) 2026 Pure Croft SASU */
(function () {
  "use strict";
  var KEY = "pc-tools-lang";
  var listeners = [];

  function readLang() {
    var p = new URLSearchParams(location.search).get("lang");
    if (p === "fr" || p === "en") return p;
    try { var s = localStorage.getItem(KEY); if (s === "fr" || s === "en") return s; } catch (e) {}
    return "fr"; // French is the default
  }

  function applyLang(lang, push) {
    var html = document.documentElement;
    html.classList.remove("lang-fr", "lang-en");
    html.classList.add("lang-" + lang);
    html.setAttribute("lang", lang);
    document.querySelectorAll(".langswitch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    // attribute translations: data-fr-placeholder / data-en-placeholder, data-fr-title ...
    ["placeholder", "title", "aria-label"].forEach(function (attr) {
      document.querySelectorAll("[data-" + lang + "-" + attr + "]").forEach(function (el) {
        el.setAttribute(attr, el.getAttribute("data-" + lang + "-" + attr));
      });
    });
    var t = document.querySelector("meta[name='pc-title-" + lang + "']");
    if (t) document.title = t.content;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    if (push) {
      var u = new URL(location.href);
      if (lang === "fr") u.searchParams.delete("lang"); else u.searchParams.set("lang", lang);
      history.replaceState(null, "", u);
    }
    PC.lang = lang;
    listeners.forEach(function (fn) { fn(lang); });
  }

  function toast(msg) {
    var el = document.getElementById("pc-toast");
    if (!el) { el = document.createElement("div"); el.id = "pc-toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }

  function t(obj) { return obj ? (obj[PC.lang] || obj.fr || obj.en || "") : ""; }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var PC = window.PC = {
    lang: readLang(),
    onLang: function (fn) { listeners.push(fn); },
    setLang: function (l) { applyLang(l, true); },
    toast: toast, copy: copy, t: t, esc: esc,
    SITE: "https://purecroft.github.io/tools/"
  };

  applyLang(PC.lang, false);
  document.addEventListener("DOMContentLoaded", function () {
    applyLang(PC.lang, false);
    document.querySelectorAll(".langswitch button").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(b.dataset.lang, true); });
    });
  });
})();
