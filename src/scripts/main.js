/* Yugharling Resort — site-wide interactions (bundled by Astro).
   Every block checks its elements exist, so the same script runs on every page. */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Preloader ---------- */
  function hidePreloader() {
    $("#preloader").classList.add("is-hidden");
    document.body.classList.remove("is-locked");
    if (slides.length) startHero();
  }
  window.addEventListener("load", () => setTimeout(hidePreloader, 200));
  // Don't hold the page behind the preloader on slow connections: images keep loading underneath
  setTimeout(() => { if (!$("#preloader").classList.contains("is-hidden")) hidePreloader(); }, 1500);

  /* ---------- Hero slider ---------- */
  const slides = $$(".hero__slide");
  const dots = $$(".hero__dot");
  const progress = $("#heroProgress");
  const DURATION = 6500;
  let current = 0;
  let timer = null;
  let heroStarted = false;

  // Only the first slide's photo loads with the page; the others are set from data-bg once it has loaded
  function loadSlideBg(slide) {
    const bg = $(".hero__bg[data-bg]", slide);
    if (!bg) return;
    bg.style.backgroundImage = `url('${bg.dataset.bg}')`;
    bg.removeAttribute("data-bg");
  }
  if (slides.length) window.addEventListener("load", () => slides.forEach(loadSlideBg));

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    dots[current].removeAttribute("aria-current");
    current = (index + slides.length) % slides.length;
    loadSlideBg(slides[current]);
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    dots[current].setAttribute("aria-current", "true");
    restartTimer();
  }

  function restartTimer() {
    clearTimeout(timer);
    progress.classList.remove("is-running");
    void progress.offsetWidth; // reflow to restart the CSS transition
    progress.classList.add("is-running");
    timer = setTimeout(() => goTo(current + 1), DURATION);
  }

  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    restartTimer();
  }

  const hero = $(".hero");
  if (hero) {
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));
    $(".js-hero-prev").addEventListener("click", () => goTo(current - 1));
    $(".js-hero-next").addEventListener("click", () => goTo(current + 1));

    // Swipe support
    let touchX = null;
    hero.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Header: sticky, scrolled state ---------- */
  const sticky = $("#stickyHeader");
  const siteHeader = $("#siteHeader");

  function onScroll() {
    const y = window.scrollY;
    sticky.classList.toggle("is-visible", y > 600);
    siteHeader.classList.toggle("is-scrolled", y > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Side panel / mobile menu ---------- */
  const panel = $("#sidePanel");
  const overlay = $("#overlay");

  function openPanel() {
    panel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
  }
  function closePanel() {
    panel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("is-locked");
  }
  $$(".js-panel-open").forEach((b) => b.addEventListener("click", openPanel));
  $$(".js-panel-close").forEach((b) => b.addEventListener("click", closePanel));
  overlay.addEventListener("click", closePanel);
  $$(".side-panel a[href*='#']").forEach((a) => a.addEventListener("click", closePanel));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- Gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lbImg = $("img", lightbox);
  const galleryLinks = $$(".js-lightbox a");
  const lbButtons = $$("button", lightbox);
  let lbIndex = 0;
  let lbReturnFocus = null;

  function showImage(i) {
    lbIndex = (i + galleryLinks.length) % galleryLinks.length;
    lbImg.src = galleryLinks[lbIndex].href;
    lbImg.alt = $("img", galleryLinks[lbIndex]).alt;
  }
  function openLightbox(i) {
    showImage(i);
    lbReturnFocus = document.activeElement;
    lightbox.classList.add("is-open");
    $(".lightbox__close").focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lbReturnFocus?.focus();
  }
  galleryLinks.forEach((a, i) => a.addEventListener("click", (e) => {
    e.preventDefault();
    openLightbox(i);
  }));
  $(".lightbox__close").addEventListener("click", closeLightbox);
  $(".lightbox__prev").addEventListener("click", () => showImage(lbIndex - 1));
  $(".lightbox__next").addEventListener("click", () => showImage(lbIndex + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  /* ---------- Keyboard: Esc closes overlays, arrows move lightbox, Tab stays inside it ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePanel();
      closeLightbox();
    }
    if (lightbox.classList.contains("is-open")) {
      if (e.key === "ArrowRight") showImage(lbIndex + 1);
      if (e.key === "ArrowLeft") showImage(lbIndex - 1);
      if (e.key === "Tab") {
        const first = lbButtons[0];
        const last = lbButtons[lbButtons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (!lightbox.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      }
    }
  });

  $("#year").textContent = new Date().getFullYear();
})();
