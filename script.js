const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// highlight the nav link for the section in view
const links = [...navLinks.querySelectorAll("a")];
const targets = links.map((a) => document.querySelector(a.getAttribute("href")));
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
targets.forEach((t) => t && observer.observe(t));

// ---------- animation ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// scroll progress bar
const progress = document.getElementById("progress");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ")";
};
addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// staggered scroll reveal
if (!reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js");
  const groups = [
    ".hero-left > *, .hero-visual",
    ".section-header, .section-head, .col > p, .project-card, .edu-card",
    ".skill-group, .mini-projects > h4, .mini-project, .tl-item",
    ".footer-card > div, .copyright",
  ];
  const seen = new Set();
  document.querySelectorAll(groups.join(",")).forEach((el) => {
    // don't reveal a parent and its child separately
    if (seen.has(el) || [...seen].some((s) => s.contains(el))) return;
    seen.add(el);
    el.classList.add("reveal");
    el.querySelectorAll(".tag").forEach((t, i) => t.style.setProperty("--i", i));
  });
  // stagger siblings that appear together
  document.querySelectorAll(".reveal").forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", sibs.indexOf(el) * 0.1 + "s");
  });
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

// ---------- photo lightbox ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
document.querySelectorAll(".thumb").forEach((btn) => {
  btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.querySelector("img").alt;
    lbCap.textContent = btn.dataset.caption;
    lightbox.showModal();
  });
});
document.getElementById("lb-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
