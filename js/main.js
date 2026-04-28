// Load the navbar
const scriptUrl = document.currentScript?.src || "";
const scriptPath = new URL(scriptUrl, window.location.href).pathname;
const SITE_ROOT = scriptPath.replace(/\/js\/main\.js$/, "") || "/";

function sitePath(path) {
  if (!path.startsWith("/")) path = "/" + path;
  const root = SITE_ROOT.replace(/\/$/, "");
  return root + path;
}

window.SITE_ROOT = SITE_ROOT;

function normalizeContainerPaths(container) {
  if (!container) return;
  container.querySelectorAll("a[href^='/']").forEach((link) => {
    const original = link.getAttribute("href");
    let path = original;
    const rootNoSlash = SITE_ROOT.replace(/\/$/, "");
    if (rootNoSlash && original.startsWith(rootNoSlash)) {
      path = original.slice(rootNoSlash.length) || "/";
    }
    link.setAttribute("href", sitePath(path));
  });
  container.querySelectorAll("img[src^='/']").forEach((img) => {
    const original = img.getAttribute("src");
    let path = original;
    const rootNoSlash = SITE_ROOT.replace(/\/$/, "");
    if (rootNoSlash && original.startsWith(rootNoSlash)) {
      path = original.slice(rootNoSlash.length) || "/";
    }
    img.setAttribute("src", sitePath(path));
  });
}

fetch(sitePath("/shared/navbar.html"))
  .then((res) => res.text())
  .then((data) => {
    const navEl = document.getElementById("navbar");
    if (navEl) navEl.innerHTML = data;

    // Load theme manager
    const t = document.createElement("script");
    t.src = sitePath("/js/theme.js");
    document.body.appendChild(t);

    const s = document.createElement("script");
    s.src = sitePath("/js/navbar.js");
    s.onload = () => {
      if (window.initNavbarAvatar) window.initNavbarAvatar();
    };
    document.body.appendChild(s);
  })
  .catch((err) => console.error("Failed to load navbar", err));

// Load footer
fetch(sitePath("/shared/footer.html"))
  .then((res) => res.text())
  .then((data) => {
    const footEl = document.getElementById("footer");
    if (footEl) footEl.innerHTML = data;
    normalizeContainerPaths(footEl);
  })
  .catch((err) => console.error("Failed to load footer", err));
