(function () {
  "use strict";

  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Opening sequence ---------------- */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    // force a style flush so the hidden state is committed before transitioning
    void body.offsetWidth;
    setTimeout(function () {
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
    }, 30);
    setTimeout(startRotator, reduceMotion ? 0 : 1600);
  }

  // Start right away: a blurred preview stands in until the painting arrives.
  var img = document.getElementById("hero-img");
  if (img && img.complete && img.naturalWidth) img.classList.add("is-loaded");
  start();

  /* ---------------- Rotating interests ("clip" effect) ---------------- */
  function startRotator() {
    var wrap = document.querySelector(".rotator");
    if (!wrap) return;
    var words = wrap.querySelectorAll("b");
    if (words.length < 2) return;
    var i = 0;

    function widthOf(el) {
      return Math.ceil(el.getBoundingClientRect().width) + 6;
    }
    wrap.style.width = widthOf(words[0]) + "px";

    setInterval(function () {
      var cur = words[i];
      var next = words[(i + 1) % words.length];
      wrap.style.width = "6px"; // wipe away
      setTimeout(function () {
        cur.classList.remove("is-visible");
        next.classList.add("is-visible");
        wrap.style.width = widthOf(next) + "px"; // wipe in
        i = (i + 1) % words.length;
      }, 700);
    }, 3200);

    window.addEventListener("resize", function () {
      wrap.style.width = widthOf(words[i]) + "px";
    });
  }

  /* ---------------- Scroll: parallax, hero fade, nav state ---------------- */
  var nav = document.getElementById("nav");
  var hero = document.getElementById("home");
  var heroBg = document.querySelector(".hero__bg");
  var heroInner = document.querySelector(".hero__inner");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var h = hero ? hero.offsetHeight : window.innerHeight;

    if (nav) nav.classList.toggle("is-solid", y > h - 80);

    if (!reduceMotion && y <= h) {
      if (heroBg) heroBg.style.transform = "translate3d(0," + (y * 0.35).toFixed(1) + "px,0)";
      if (heroInner) {
        heroInner.style.transform = "translate3d(0," + (y * 0.18).toFixed(1) + "px,0)";
        heroInner.style.opacity = Math.max(0, 1 - y / (h * 0.75)).toFixed(3);
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------- Active nav link ---------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIO.observe(s); });

    /* ---------------- Reveal on scroll ---------------- */
    var inviewIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          inviewIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-inview]").forEach(function (el) { inviewIO.observe(el); });
  } else {
    document.querySelectorAll("[data-inview]").forEach(function (el) { el.classList.add("in-view"); });
  }
})();
