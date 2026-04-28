(function () {
  const THEME_KEY = "theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.classList.add("theme-dark");
      root.classList.remove("theme-light");
    } else {
      root.classList.add("theme-light");
      root.classList.remove("theme-dark");
    }
    const img = document.getElementById("themeToggleImg");
    if (img) {
      img.src =
        theme === "dark"
          ? assetPath("/assets/images/moon.svg")
          : assetPath("/assets/images/sun.svg");
      img.alt = theme === "dark" ? "Dark theme" : "Light theme";
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      //
    }
  }

  const stored = getStoredTheme();
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(stored || (prefersDark ? "dark" : "light"));

  function getSiteRoot() {
    return (window.SITE_ROOT || "").replace(/\/$/, "");
  }

  function assetPath(path) {
    const root = getSiteRoot();
    if (!path.startsWith("/")) path = "/" + path;
    return `${root}${path}`;
  }

  function toggleTheme() {
    const current = document.documentElement.classList.contains("theme-dark")
      ? "dark"
      : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
  }

  window.toggleTheme = toggleTheme;

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("#themeToggle");
    if (!btn) return;

    toggleTheme();

    const img = document.getElementById("themeToggleImg");
    if (img) {
      const current = document.documentElement.classList.contains("theme-dark")
        ? "dark"
        : "light";

      img.src =
        current === "dark"
          ? assetPath("/assets/images/moon.svg")
          : assetPath("/assets/images/sun.svg");

      img.alt = current === "dark" ? "Dark theme" : "Light theme";
    }
  });

  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY)
      applyTheme(e.newValue || (prefersDark ? "dark" : "light"));
  });
})();
