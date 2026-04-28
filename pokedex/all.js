const rowTag = document.querySelector(".row");
const searchInputTag = document.getElementById("searchInput");
const pokeballTag = document.getElementById("pokeball");
const paginationContainer = document.getElementById("pagination");
const loadingTag = document.getElementById("loading");

const itemsPerPage = 50;
let currentPage = 1;
let allCards = [];
//show all pokemons
async function getAllPokemon(url) {
  const response = await fetch(url);
  const data = await response.json();
  await showEach(data);
  renderPage();
  if (loadingTag) loadingTag.style.display = "none";
}

getAllPokemon("https://pokeapi.co/api/v2/pokemon?limit=649");

function checkDetail(id) {
  window.location.href = `./detail.html?id=${id}`;
}

async function showEach(data) {
  const pokemonCount = data.results.length;
  for (let i = 0; i < pokemonCount; i++) {
    const response = await fetch(data.results[i].url);
    const pokemon = await response.json();

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.onclick = () => checkDetail(pokemon.id);
    card.style.display = "none";

    card.innerHTML = `
      <div class="card-inner">
        <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
        <div class="pokemon-id">#${pokemon.id}</div>
        <div class="pokemon-name">${pokemon.name}</div>
      </div>
    `;

    rowTag.appendChild(card);
    allCards.push({ element: card, name: pokemon.name.toLowerCase() });
  }
}
//search
function getFilteredCards() {
  const searchValue = searchInputTag.value.toLowerCase();
  return allCards.filter((card) => card.name.includes(searchValue));
}

function renderPage() {
  const filteredCards = getFilteredCards();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / itemsPerPage),
  );
  if (currentPage > totalPages) currentPage = totalPages;

  allCards.forEach((card) => {
    card.element.style.display = "none";
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);
  pageCards.forEach((card) => {
    card.element.style.display = "block";
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.textContent = "Prev";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderPage();
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    if (page === currentPage) pageButton.classList.add("active");
    pageButton.addEventListener("click", () => {
      currentPage = page;
      renderPage();
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderPage();
    }
  });
  paginationContainer.appendChild(nextButton);
}

function search() {
  currentPage = 1;
  renderPage();
}

pokeballTag.addEventListener("click", search);
searchInputTag.addEventListener("keyup", search);
