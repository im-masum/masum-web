// Dark Mode Toggle (defensive)
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  // initialize aria-pressed
  themeToggle.setAttribute(
    "aria-pressed",
    document.body.classList.contains("dark")
  );
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-pressed", isDark);
  });
}

// Mobile Menu Toggle (defensive + aria)
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.addEventListener("click", () => {
    const expanded = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}

// Scroll Reveal
const fadeSections = document.querySelectorAll(".fade-slide");
window.addEventListener("scroll", () => {
  fadeSections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) sec.classList.add("show");
  });
});

// Project Filtering
const projectFilters = document.querySelectorAll(".projects-filters .filter");
const projectCards = document.querySelectorAll(".project-card");

function filterProjects(filter) {
  const filterValue = filter.getAttribute("data-filter");

  projectCards.forEach((card) => {
    const types = card.getAttribute("data-type").split(" ");

    if (filterValue === "all" || types.includes(filterValue)) {
      card.style.display = "";
      card.style.opacity = "0";
      setTimeout(() => {
        card.style.opacity = "1";
      }, 50);
    } else {
      card.style.display = "none";
    }
  });
}

projectFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    // Remove active class from current active filter (guarded)
    const current = document.querySelector(".filter.active");
    if (current && current !== filter) current.classList.remove("active");
    // Toggle active on clicked filter
    filter.classList.add("active");
    // Filter the projects
    filterProjects(filter);
  });
  // keyboard support (Enter/Space)
  filter.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      filter.click();
    }
  });
});

// Reveal / stagger animations for elements with .reveal
(function () {
  function initReveal() {
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if (!revealEls.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            // apply per-element delay if provided via data-delay (seconds)
            const d = el.getAttribute("data-delay");
            if (d) el.style.setProperty("--delay", `${d}s`);
            el.classList.add("show");
            // once shown, unobserve to avoid re-triggering
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el, i) => {
      // if no explicit data-delay, stagger by index
      if (!el.hasAttribute("data-delay")) {
        const stagger = Math.min(0.02 * i, 0.18); // small cap
        el.style.setProperty("--delay", `${stagger}s`);
      }
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal, { once: true });
  } else {
    initReveal();
  }
})();

// Skill bar animation: animate .skill-bar-fill based on data-percent when visible
(function initSkillBars() {
  const fills = document.querySelectorAll(".skill-bar-fill");
  if (!fills.length) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const pct = el.getAttribute("data-percent") || "0";
        el.style.width = pct + "%";
        el.setAttribute("aria-valuenow", pct);
        observer.unobserve(el);
      });
    },
    { threshold: 0.25 }
  );

  fills.forEach((f) => {
    // start collapsed for animation
    f.style.width = "0%";
    io.observe(f);
  });
})();

// Contact form handler: client-side validation, honeypot, spinner, accessible feedback
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmit");
  const feedback = document.getElementById("contactFeedback");
  if (!form || !submitBtn || !feedback) return;

  function setLoading(loading) {
    if (loading) submitBtn.classList.add("loading");
    else submitBtn.classList.remove("loading");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // basic honeypot
    const honeypot = form.querySelector(".honeypot");
    if (honeypot && honeypot.value.trim() !== "") {
      // silently abort (likely bot)
      return;
    }

    // simple validation
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");
    let valid = true;
    [name, email, message].forEach((el) => {
      el.classList.remove("field-error");
      if (!el || !el.value || !el.value.trim()) {
        valid = false;
        if (el) el.classList.add("field-error");
      }
    });

    if (!valid) {
      feedback.textContent = "Please complete the required fields.";
      feedback.classList.remove("success");
      feedback.classList.add("error");
      feedback.setAttribute("aria-live", "polite");
      return;
    }

    // simulate send
    setLoading(true);
    feedback.textContent = "";
    feedback.classList.remove("error");

    // Simulate a network request (replace with real POST in production)
    setTimeout(() => {
      setLoading(false);
      feedback.textContent = "Thanks — your message has been sent.";
      feedback.classList.remove("error");
      feedback.classList.add("success");
      // reset form
      form.reset();
      // clear any error styles
      [name, email, message].forEach(
        (el) => el && el.classList.remove("field-error")
      );
    }, 900);
  });
})();

// Back-to-top button: show after scroll and smooth-scroll (respecting reduced motion)
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function scrollToTop() {
    if (prefersReduced) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  btn.addEventListener("click", scrollToTop);

  // toggle visibility
  function onScroll() {
    if (window.scrollY > 300) btn.classList.add("visible");
    else btn.classList.remove("visible");
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  // initial state
  onScroll();
})();
