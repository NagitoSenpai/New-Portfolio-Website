// Smooth page transitions (fade out on internal nav, fade in on load)
(function setUpPageTransitions() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("page-loaded"));
  });

  if (reduceMotion) return;

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    // The Gallery and Contact nav links get their own snap-loader transitions below.
    if (link.matches('.nav a[href="gallery.html"]') || link.matches('.nav a[href="contact.html"]')) return;

    link.addEventListener("click", (e) => {
      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        return;
      }
      if (url.pathname === window.location.pathname) return; // same-page anchor
      e.preventDefault();
      document.body.classList.remove("page-loaded");
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 280);
    });
  });
})();

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Snap-loader transitions (nav links that play a full-screen animated
// icon before navigating). Used for the Gallery and Contact nav links.
function setUpSnapLoader({ selector, iconSrc, loadingText, loopMs }) {
  const link = document.querySelector(selector);
  if (!link) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const loader = document.createElement("div");
  loader.className = "photo-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = `
    <div class="photo-loader-inner">
      <img class="loader-gif" src="${iconSrc}" alt="" width="150" height="150">
      <p class="loader-text">${loadingText}</p>
    </div>
  `;
  document.body.appendChild(loader);

  link.addEventListener("click", (e) => {
    const destination = link.href;
    e.preventDefault();

    if (reduceMotion) {
      window.location.href = destination;
      return;
    }

    loader.classList.add("active");
    // Let the animated icon play through a full loop before moving on.
    window.setTimeout(() => {
      window.location.href = destination;
    }, loopMs);
  });
}

setUpSnapLoader({
  selector: '.nav a[href="gallery.html"]',
  iconSrc: "assets/camera-snap.svg",
  loadingText: "Snapping the gallery&hellip;",
  loopMs: 2300,
});

setUpSnapLoader({
  selector: '.nav a[href="contact.html"]',
  iconSrc: "assets/contacts-page.svg",
  loadingText: "Getting you connected&hellip;",
  loopMs: 3100,
});

// Lightbox (gallery click-to-enlarge)
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxExtra = document.getElementById("lightboxExtra");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImage && lightboxCaption) {
  let lastFocused = null;

  function openLightbox(trigger) {
    const { full, title, link, linkLabel } = trigger.dataset;
    lastFocused = document.activeElement;
    lightboxImage.src = full;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;

    if (lightboxExtra) {
      lightboxExtra.innerHTML = link
        ? `<a class="pill-link" href="${link}" target="_blank" rel="noopener">${linkLabel || "View more"}</a>`
        : "";
    }

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.src = "";
    if (lightboxExtra) lightboxExtra.innerHTML = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".card-trigger").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn));
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

// Carousel (Holly Hopper branding card — one image at a time, click
// between them, auto-advances on its own, pauses on hover/focus).
document.querySelectorAll(".carousel-card").forEach((card) => {
  const slides = Array.from(card.querySelectorAll(".carousel-slide"));
  const dots = Array.from(card.querySelectorAll(".carousel-dot"));
  const caption = card.querySelector("figcaption");
  const prevBtn = card.querySelector(".carousel-prev");
  const nextBtn = card.querySelector(".carousel-next");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTOPLAY_MS = 3500;

  let index = slides.findIndex((s) => !s.hidden);
  if (index < 0) index = 0;
  let autoplayTimer = null;

  function showSlide(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.hidden = idx !== index;
    });
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx === index));
    if (caption) {
      const active = slides[index];
      caption.innerHTML = `<span class="tag">${active.dataset.tag || ""}</span>${active.dataset.title || ""}`;
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    if (reduceMotion || slides.length < 2) return;
    stopAutoplay();
    autoplayTimer = window.setInterval(() => showSlide(index + 1), AUTOPLAY_MS);
  }

  function manualNavigate(i) {
    showSlide(i);
    // Restart the timer so autoplay doesn't immediately flip right after a manual click.
    startAutoplay();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      manualNavigate(index - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      manualNavigate(index + 1);
    });
  }
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      manualNavigate(idx);
    });
  });

  // Pause while the mouse is over the card, or while it has keyboard focus.
  card.addEventListener("mouseenter", stopAutoplay);
  card.addEventListener("mouseleave", startAutoplay);
  card.addEventListener("focusin", stopAutoplay);
  card.addEventListener("focusout", startAutoplay);

  startAutoplay();
});
