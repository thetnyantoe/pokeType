(function () {
  function setAvatarSrc(src) {
    const selectors = [
      "#navbarAvatar",
      "#selectedAvatar",
      "[data-selected-avatar]",
      ".selected-avatar",
    ];
    const elements = document.querySelectorAll(selectors.join(","));
    if (!elements || elements.length === 0) return;
    if (!src) {
      elements.forEach((el) => (el.src = ""));
      return;
    }
    if (src.startsWith("/")) src = location.origin + src;
    const tester = new Image();
    tester.onload = () => elements.forEach((el) => (el.src = src));
    tester.onerror = () =>
      elements.forEach((el) => (el.src = "../assets/images/balls.gif"));
    tester.src = src;
  }

  function initNavbarAvatar() {
    const saved = localStorage.getItem("selectedAvatar");
    setAvatarSrc(saved);
    window.addEventListener("storage", (e) => {
      if (e.key === "selectedAvatar") setAvatarSrc(e.newValue);
    });
  }

  window.setAvatarSrc = setAvatarSrc;

  // hamburger toggle for small screens
  function initNavToggle() {
    const btn = document.getElementById("navToggle");
    if (!btn) return;
    // avoid double-binding
    if (btn.dataset.bound === "1") return;
    const navbarEl = document.querySelector(".navbar");
    const updateAria = (isOpen) => {
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };
    btn.addEventListener("click", () => {
      const isOpen = navbarEl.classList.toggle("open");
      updateAria(isOpen);
    });

    updateAria(navbarEl.classList.contains("open"));
    btn.dataset.bound = "1";
  }

  // run toggle after DOM changes
  document.addEventListener("DOMContentLoaded", initNavToggle);
  const mo = new MutationObserver(initNavToggle);
  mo.observe(document.body, { childList: true, subtree: true });

  window.initNavbarAvatar = initNavbarAvatar;
})();
