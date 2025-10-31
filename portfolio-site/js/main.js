document.addEventListener("componentsLoaded", () => {
  console.log("✅ Components loaded, initializing...");
  lucide.createIcons(); // render Lucide icons

  initThemeToggle();
  initNavbarIndicator();
  initSectionSlider();
});

/* -----------------------
   1. Theme Toggle
------------------------*/
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sunIcon = document.getElementById("icon-sun");
  const moonIcon = document.getElementById("icon-moon");

  if (!toggle) return;

  // Initialize theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  body.classList.toggle("dark", isDark);

  sunIcon.style.display = isDark ? "block" : "none";
  moonIcon.style.display = isDark ? "none" : "block";

  toggle.addEventListener("click", () => {
    const nowDark = !body.classList.contains("dark");
    body.classList.toggle("dark", nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");

    sunIcon.style.display = nowDark ? "block" : "none";
    moonIcon.style.display = nowDark ? "none" : "block";

    // Trigger ripple animation
    toggle.classList.remove("expanding", "contracting");
    void toggle.offsetWidth;
    toggle.classList.add(nowDark ? "expanding" : "contracting");
  });
}

/* -----------------------
   2. Navbar underline animation
------------------------*/
function initNavbarIndicator() {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-link");
  let indicator = document.querySelector(".nav-indicator");

  if (!nav || !navLinks.length) return;

  if (!indicator) {
    indicator = document.createElement("div");
    indicator.className = "nav-indicator";
    nav.appendChild(indicator);
  }

  window.setActiveNav = function (targetId) {
    const activeLink = Array.from(navLinks).find(
      (l) => l.getAttribute("href") === `#${targetId}`
    );
    if (!activeLink) return;

    navLinks.forEach((l) => l.classList.remove("active"));
    activeLink.classList.add("active");

    const rect = activeLink.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - navRect.left}px`;
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").substring(1);
      setActiveNav(targetId);
    });
  });

  const active = document.querySelector(".nav-link.active") || navLinks[0];
  if (active) setActiveNav(active.getAttribute("href").substring(1));

  window.addEventListener("resize", () => {
    const current = document.querySelector(".nav-link.active");
    if (current) setActiveNav(current.getAttribute("href").substring(1));
  });
}

/* -----------------------
   3. Horizontal section slider
------------------------*/
function initSectionSlider() {
  const wrapper = document.querySelector(".sections-wrapper");
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!wrapper || !sections.length) return;

  let currentIndex = 0;
  sections[0].classList.add("active", "visible");

  function goToSection(index, targetId = null) {
    if (index < 0 || index >= sections.length) return;

    wrapper.style.transform = `translateX(-${index * 100}vw)`;
    sections.forEach((s, i) => s.classList.toggle("active", i === index));
    sections[index].classList.add("visible");
    currentIndex = index;

    if (targetId && typeof setActiveNav === "function") {
      setActiveNav(targetId.replace("#", ""));
    }
  }

  navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      goToSection(index, targetId);
    });
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest('a[href="#projects"]');
    if (!btn) return;
    e.preventDefault();
    const targetSection = document.querySelector("#projects");
    const index = Array.from(sections).indexOf(targetSection);
    if (index !== -1) goToSection(index, "#projects");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && currentIndex < sections.length - 1) {
      const nextId = navLinks[currentIndex + 1]?.getAttribute("href");
      goToSection(currentIndex + 1, nextId);
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      const prevId = navLinks[currentIndex - 1]?.getAttribute("href");
      goToSection(currentIndex - 1, prevId);
    }
  });
}
