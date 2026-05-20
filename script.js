const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  document.body.classList.remove("nav-open");
  header.classList.remove("menu-open");
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
}

function alignHashTarget() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  const scrollRoot = document.scrollingElement || document.documentElement;
  const headerOffset = header.offsetHeight + 18;
  const targetTop = target.getBoundingClientRect().top + scrollRoot.scrollTop - headerOffset;
  scrollRoot.scrollTop = Math.max(targetTop, 0);
}

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  header.classList.toggle("menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) closeMenu();
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("hashchange", () => window.setTimeout(alignHashTarget, 0));
window.addEventListener("load", () => window.setTimeout(alignHashTarget, 0));
updateHeader();
