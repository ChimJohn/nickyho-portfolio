// loader.js — dynamically load navbar and all HTML components
const sectionComponents = [
  "hero",
  "about",
  "experience",
  "projects",
  "education",
  "awards",
  "footer"
];

/**
 * Load a single HTML file and inject into a target element.
 */
async function loadHTML(targetSelector, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    const html = await response.text();
    document.querySelector(targetSelector).innerHTML = html;
  } catch (err) {
    console.error(`❌ Failed to load ${filePath}:`, err);
  }
}

/**
 * Load navbar first, then all page sections horizontally
 */
async function loadAllComponents() {
  // 1️⃣ Load navbar
  await loadHTML("#navbar", "components/navbar.html");

  // 2️⃣ Load each content section into .sections-wrapper
  const wrapper = document.querySelector(".sections-wrapper");

  for (const name of sectionComponents) {
    try {
      const res = await fetch(`components/${name}.html`);
      if (!res.ok) throw new Error(res.status);
      const html = await res.text();

      const temp = document.createElement("div");
      temp.innerHTML = html.trim();
      const section = temp.firstElementChild;
      if (section) wrapper.appendChild(section);
    } catch (err) {
      console.error(`⚠️ Failed to load ${name}.html:`, err);
    }
  }

  // 3️⃣ Notify scripts that all components are ready
  document.dispatchEvent(new Event("componentsLoaded"));
}

document.addEventListener("DOMContentLoaded", loadAllComponents);
