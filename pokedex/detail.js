const bodyTag = document.body;

const typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
};

document.addEventListener("DOMContentLoaded", () => {
  const pokemonID = parseInt(
    new URLSearchParams(window.location.search).get("id"),
    10,
  );

  if (pokemonID) {
    fetchDetail(pokemonID);
  }
});

async function fetchDetail(id) {
  const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await pokemonRes.json();

  const speciesRes = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`,
  );
  const species = await speciesRes.json();

  const mainType = pokemon.types[0].type.name;
  const themeColor = typeColors[mainType] || "#777";

  document.title = pokemon.name.toUpperCase();

  // Clean English flavor text
  const flavorText =
    species.flavor_text_entries
      .find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "";

  // Build stats rows dynamically
  const statsHTML = pokemon.stats
    .slice(0, 4)
    .map((stat) => {
      const value = stat.base_stat;
      return `
        <div class="stat-row">
          <div class="stat-label">
            <small>${stat.stat.name.toUpperCase()}</small>
            <span class="vl"></span>
            ${value}
          </div>
          <div class="progress">
            <div class="progress-bar" style="width:${value}%; background:${themeColor}"></div>
          </div>
        </div>
      `;
    })
    .join("");

  bodyTag.innerHTML = `
    <h1 style="color:white;">${pokemon.name.toUpperCase()}</h1>

    <div class="detail-container">

      <img src="${pokemon.sprites.other.dream_world.front_default}"
           class="main-img"
           alt="${pokemon.name}">

      <img src="./arrow-left-solid.svg" class="arrow" id="aLeft">
      <img src="./arrow-right-solid.svg" class="arrow" id="aRight">

      <div class="card">

        <div class="badge-container">
          ${pokemon.types
            .map(
              (t) =>
                `<span class="badge" style="background:${themeColor}">
                  ${t.type.name.toUpperCase()}
                </span>`,
            )
            .join("")}
        </div>

        <div class="about">About</div>

        <div class="info-row">
          <div><b>${pokemon.weight} kg</b><p>Weight</p></div>
          <div><b>${pokemon.height} m</b><p>Height</p></div>
          <div><b>${pokemon.moves[0].move.name}</b><p>Move</p></div>
        </div>

        <div class="bio">${flavorText}</div>

        <div class="base-stats">Base Stats</div>

        ${statsHTML}

      </div>
    </div>
  `;

  // Apply theme color
  bodyTag.style.backgroundColor = themeColor;

  // Arrow navigation
  document.getElementById("aLeft").addEventListener("click", () => {
    if (id > 1) fetchDetail(id - 1);
  });

  document.getElementById("aRight").addEventListener("click", () => {
    fetchDetail(id + 1);
  });
}
