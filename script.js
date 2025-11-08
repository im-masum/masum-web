// Dark Mode Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

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
    // Remove active class from current active filter
    document.querySelector(".filter.active").classList.remove("active");
    // Add active class to clicked filter
    filter.classList.add("active");
    // Filter the projects
    filterProjects(filter);
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
