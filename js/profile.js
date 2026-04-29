const avatars = document.querySelectorAll(".avatar");
const selectedAvatar = document.getElementById("selectedAvatar");
let showBtn = document.getElementById("showAvatarsBtn");

const extraImageMap = {
  "N.jpg": "../assets/images/N1.png",
  "cynthia.jpg": "../assets/images/cynthia1.png",
  "leon.jpg": "../assets/images/leon1.webp",
  "iono.jpg": "../assets/images/iono1.webp",
};

const selectedNameEl = document.getElementById("selectedName");
const editNameBtn = document.getElementById("editNameBtn");
const nameInput = document.getElementById("nameInput");

let trainerName = localStorage.getItem("trainerName") || "Trainer";
selectedNameEl.textContent = trainerName;
let closeBtn = document.getElementById("closeAvatarsBtn");
let popup = document.getElementById("avatarPopup");

// Load saved avatar
const savedAvatar = localStorage.getItem("selectedAvatar");
if (savedAvatar) {
  selectedAvatar.src = savedAvatar;
  const file = savedAvatar.split("/").pop();
  if (extraImageMap[file]) {
    localStorage.setItem("extraAvatar", extraImageMap[file]);
  }
  avatars.forEach((av) => {
    av.classList.remove("selected");
    if (av.src.includes(savedAvatar.split("/").pop())) {
      av.classList.add("selected");
    }
  });
}

avatars.forEach((avatar) => {
  avatar.addEventListener("click", () => {
    selectedAvatar.src = avatar.src;
    localStorage.setItem("selectedAvatar", avatar.src);

    // store extra image path
    const fname = avatar.src.split("/").pop();
    if (extraImageMap[fname]) {
      localStorage.setItem("extraAvatar", extraImageMap[fname]);
    }

    avatars.forEach((av) => av.classList.remove("selected"));
    avatar.classList.add("selected");
    if (popup) popup.style.display = "none";
  });
});

//NAME edit
editNameBtn.addEventListener("click", () => {
  selectedNameEl.style.display = "none";
  editNameBtn.style.display = "none";
  nameInput.style.display = "inline";
  nameInput.value = trainerName;
  nameInput.focus();
});

nameInput.addEventListener("blur", saveName);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveName();
  }
});

function saveName() {
  trainerName = nameInput.value.trim() || "Trainer";
  localStorage.setItem("trainerName", trainerName);
  selectedNameEl.textContent = trainerName;
  selectedNameEl.style.display = "inline";
  editNameBtn.style.display = "inline";
  nameInput.style.display = "none";
}

//stats
const totalCaughtEl = document.getElementById("totalCaught");
const levelsPassedEl = document.getElementById("levelsPassed");
const gameOverCountEl = document.getElementById("gameOverCount");

//load stats
const pokemonCaught = parseInt(localStorage.getItem("pokemonCaught")) || 0;
const playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;
const levelsPassed = playerLevel - 1;
const gameOverCount = parseInt(localStorage.getItem("gameOverCount")) || 0;

totalCaughtEl.textContent = pokemonCaught;
levelsPassedEl.textContent = levelsPassed;
gameOverCountEl.textContent = gameOverCount;

//reset
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your profile?")) {
    localStorage.clear();
    location.reload();
  }
});

// popup toggle handlers
function bindPopupHandlers() {
  showBtn = document.getElementById("showAvatarsBtn");
  closeBtn = document.getElementById("closeAvatarsBtn");
  popup = document.getElementById("avatarPopup");

  if (showBtn) {
    showBtn.addEventListener("click", () => {
      if (popup) popup.style.display = "block";
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (popup) popup.style.display = "none";
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bindPopupHandlers);
} else {
  bindPopupHandlers();
}

// close popup for outside click
document.addEventListener("click", (e) => {
  if (!popup || popup.style.display === "none") return;
  if (showBtn && showBtn.contains(e.target)) return;
  if (!popup.contains(e.target)) {
    popup.style.display = "none";
  }
});
