// Load the navbar
fetch("/shared/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    const navEl = document.getElementById("navbar");
    if (navEl) navEl.innerHTML = data;

    // Load theme manager
    const t = document.createElement("script");
    t.src = "/js/theme.js";
    document.body.appendChild(t);

    const s = document.createElement("script");
    s.src = "/js/navbar.js";
    s.onload = () => {
      if (window.initNavbarAvatar) window.initNavbarAvatar();
    };
    document.body.appendChild(s);
  })
  .catch((err) => console.error("Failed to load navbar", err));

// Load footer
fetch("../shared/footer.html")
  .then((res) => res.text())
  .then((data) => {
    const footEl = document.getElementById("footer");
    if (footEl) footEl.innerHTML = data;
  })
  .catch((err) => console.error("Failed to load footer", err));
