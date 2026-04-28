const game = document.getElementById("game");
const hpDisplay = document.getElementById("hp");
const caughtDisplay = document.getElementById("caught");
const levelDisplay = document.getElementById("level");
const waveDisplay = document.getElementById("wave");
const playerImg = document.getElementById("player");
const typingOverlay = document.getElementById("typingOverlay");
const hpProgress = document.getElementById("hpProgress");
playerImg.src = localStorage.getItem("extraAvatar");

let activePokemons = [];
let hp = 100;
let pokemonCaught = parseInt(localStorage.getItem("pokemonCaught")) || 0;
let level = parseInt(localStorage.getItem("playerLevel")) || 1;
let gameOverCount = parseInt(localStorage.getItem("gameOverCount")) || 0;

// Wave system
let currentWave = 1;
let totalWaves = 3 + Math.floor((level - 1) / 2); // increases every 2 levels
let pokemonPerWave = 5 + Math.floor((level - 1) / 3); // increases every 3 levels
let wavePokemonLeft = pokemonPerWave;
let isWaveActive = false;
let isGameOver = false;

// update displays
function updateDisplays() {
  hpDisplay.textContent = "HP: " + hp;
  caughtDisplay.textContent = "Pokémon Caught: " + pokemonCaught;
  levelDisplay.textContent = "Level: " + level;
  waveDisplay.textContent = "Wave: " + currentWave + "/" + totalWaves;
  if (hpProgress) {
    const hpPercent = Math.max(0, Math.min(100, hp));
    hpProgress.style.width = hpPercent + "%";
    hpProgress.style.backgroundColor =
      hpPercent > 50 ? "#4caf50" : hpPercent > 20 ? "#f4d03f" : "#e74c3c";
  }
}
updateDisplays();

//typing
let buffer = "";

function updateTypingOverlay() {
  if (!typingOverlay) return;
  if (buffer === "") {
    typingOverlay.innerHTML =
      '<span class="remaining">Type to catch a Pokémon...</span>';
    return;
  }

  const match = activePokemons.find((pokemon) =>
    pokemon.name.startsWith(buffer),
  );
  if (match) {
    typingOverlay.innerHTML = `<span class="correct">${buffer}</span><span class="remaining">${match.name.slice(buffer.length)}</span>`;
  } else {
    typingOverlay.innerHTML = `<span class="remaining">${buffer}</span>`;
  }
}

// Wave spawning
function startWave() {
  isWaveActive = true;
  wavePokemonLeft = pokemonPerWave;
  spawnWavePokemon();
}

function spawnWavePokemon() {
  if (wavePokemonLeft > 0) {
    spawnPokemon();
    wavePokemonLeft--;
    setTimeout(spawnWavePokemon, 1000);
  } else {
    isWaveActive = false;
    checkWaveCompletion();
  }
}

function checkWaveCompletion() {
  if (activePokemons.length === 0 && !isWaveActive) {
    if (currentWave < totalWaves) {
      currentWave++;
      updateDisplays();
      startWave();
    } else {
      showLevelCompleteModal();
    }
  }
}

function showLevelCompleteModal() {
  document.getElementById("completedLevel").textContent = level;
  document.getElementById("levelCompleteModal").style.display = "flex";
  localStorage.setItem("lastCompletedLevel", level);
  localStorage.setItem("totalWaves", totalWaves);
}

document.getElementById("continueBtn").addEventListener("click", () => {
  level++;
  localStorage.setItem("playerLevel", level);
  location.reload(); // restart game
});

document.getElementById("stopBtn").addEventListener("click", () => {
  window.location.href = "/"; // go home
});

document.getElementById("tryAgainBtn").addEventListener("click", () => {
  location.reload(); // restart level
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const bgMusic = new Audio("../assets/background.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

let musicStarted = false;

function startBackgroundMusic() {
  if (musicStarted) return;
  musicStarted = true;
  bgMusic.play().catch((e) => console.log("Music play failed:", e));
}

function playTone(freq = 440, time = 0.08, vol = 0.12, type = "sine") {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  o.connect(g);
  g.connect(audioCtx.destination);
  o.start();
  o.stop(audioCtx.currentTime + time);
}

function sfxCatch() {
  playTone(880, 0.06, 0.06, "triangle");
  playTone(1320, 0.06, 0.02, "sine");
}
function sfxMiss() {
  playTone(180, 0.12, 0.08, "sawtooth");
}

//Spawn logic
async function spawnPokemon() {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const fromLeft = Math.random() < 0.5;
    const startY = 100 + Math.random() * (window.innerHeight * 0.5);
    const speed = 0.6 + Math.random() * (0.6 + level * 0.15);

    const pokemon = {
      id: data.id,
      name: data.name,
      image:
        data.sprites.front_default ||
        data.sprites.other?.["official-artwork"]?.front_default,
      x: fromLeft ? -100 : window.innerWidth + 100,
      y: startY,
      speed,
      typedIndex: 0,
    };

    activePokemons.push(pokemon);
  } catch (e) {
    console.error("spawn error", e);
  }
}

function animatePokeballTo(targetX, targetY) {
  const trainer = document.getElementById("trainer");
  const rect = trainer.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  const ball = document.createElement("div");
  ball.className = "pokeball pop";
  ball.style.left = startX + "px";
  ball.style.top = startY + "px";
  document.body.appendChild(ball);

  // animation
  ball.style.transition =
    "transform 0.6s cubic-bezier(.2,.9,.3,1), left 0.6s linear, top 0.6s linear, opacity 0.4s ease-in";
  // movement
  requestAnimationFrame(() => {
    ball.style.left = targetX + "px";
    ball.style.top = targetY + "px";
    ball.style.transform = "translate(-50%,-50%) scale(0.8)";
  });

  setTimeout(() => {
    ball.style.opacity = "0";
    setTimeout(() => ball.remove(), 400);
  }, 700);
}

function update() {
  const trainer = document.getElementById("trainer");
  const trainerRect = trainer.getBoundingClientRect();
  const trainerX = trainerRect.left + trainerRect.width / 2;
  const trainerY = trainerRect.top + trainerRect.height / 2;

  activePokemons.forEach((pokemon) => {
    const dx = trainerX - pokemon.x;
    const dy = trainerY - pokemon.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 50) {
      // collision
      hp -= 10;
      sfxMiss();
      updateDisplays();
      activePokemons = activePokemons.filter((p) => p !== pokemon);
    } else {
      // move towards trainer
      const moveX = (dx / dist) * pokemon.speed;
      const moveY = (dy / dist) * pokemon.speed;
      pokemon.x += moveX;
      pokemon.y += moveY;
    }
  });

  if (hp <= 0) {
    if (!isGameOver) {
      isGameOver = true;
      gameOverCount++;
      localStorage.setItem("gameOverCount", gameOverCount);
      document.getElementById("gameOverModal").style.display = "flex";
    }
  }

  checkWaveCompletion();
}

function handleFullCatch(pokemon) {
  // animate pokeball
  animatePokeballTo(pokemon.x, pokemon.y);

  sfxCatch();
  pokemonCaught++;
  localStorage.setItem("pokemonCaught", pokemonCaught);

  updateDisplays();

  activePokemons = activePokemons.filter((p) => p !== pokemon);

  checkWaveCompletion();
}

function render() {
  document.querySelectorAll(".pokemon").forEach((el) => el.remove());

  activePokemons.forEach((pokemon) => {
    const div = document.createElement("div");
    div.className = "pokemon";
    div.style.left = pokemon.x + "px";
    div.style.top = pokemon.y + "px";
    div.style.transform = "translate(-50%, -50%)";
    div.style.pointerEvents = "none";

    const typed = pokemon.name.slice(0, pokemon.typedIndex);
    const remaining = pokemon.name.slice(pokemon.typedIndex);

    const img = pokemon.image ? `<img src="${pokemon.image}" width="80"/>` : "";

    div.innerHTML = `${img}
      <div>
        <span class="correct">${typed}</span>
        <span class="remaining">${remaining}</span>
      </div>
    `;

    game.appendChild(div);
  });
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key.length === 1 && /[a-zA-Z]/.test(key)) {
    buffer += key.toLowerCase();
  } else if (key === "Backspace") {
    buffer = buffer.slice(0, -1);
  } else {
    return; // ignore other keys
  }

  if (buffer === "") {
    activePokemons.forEach((p) => (p.typedIndex = 0));
  }

  // update display for all active pokemons
  activePokemons.forEach((pokemon) => {
    if (pokemon.name.startsWith(buffer)) {
      pokemon.typedIndex = buffer.length;
    }
  });

  // check full
  activePokemons.slice().forEach((pokemon) => {
    if (buffer === pokemon.name) {
      handleFullCatch(pokemon);
      buffer = "";
    }
  });

  updateTypingOverlay();
});

document.addEventListener("keydown", startBackgroundMusic, { once: true });
document.addEventListener("click", startBackgroundMusic, { once: true });

// initial wave start
startWave();

updateTypingOverlay();

gameLoop();
