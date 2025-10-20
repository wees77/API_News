const API_KEY = "pub_800bbf831cb54ba08a295e5f47afab48";
const BASE_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=pt`;

const mainHighlight = document.getElementById("mainHighlight");
const sideHighlights = document.getElementById("sideHighlights");
const newsContainer = document.getElementById("newsContainer");
const trendingTopics = document.getElementById("trendingTopics").querySelector("ul");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Funções para criar cards
function createMainCard(news) {
  mainHighlight.innerHTML = `
    <img src="${news.image_url || 'https://via.placeholder.com/600x250'}" alt="${news.title}">
    <h2>${news.title}</h2>
    <p>${news.description || ''}</p>
  `;
}

function createSideCard(news) {
  const card = document.createElement("div");
  card.classList.add("side-card");
  card.innerHTML = `
    <img src="${news.image_url || 'https://via.placeholder.com/300x140'}" alt="${news.title}">
    <span>${news.title}</span>
  `;
  sideHighlights.appendChild(card);
}

function createNewsCard(news) {
  const card = document.createElement("div");
  card.classList.add("news-card");
  card.innerHTML = `
    <img src="${news.image_url || 'https://via.placeholder.com/120x80'}" alt="${news.title}">
    <div class="info">
      <h3>${news.title}</h3>
      <p>${news.description || ''}</p>
    </div>
  `;
  newsContainer.appendChild(card);
}

function populateTrendingTopics(newsList) {
  const topics = new Set();
  newsList.forEach(news => {
    if(news.keywords) {
      news.keywords.split(",").forEach(kw => topics.add(kw.trim()));
    }
  });
  trendingTopics.innerHTML = '';
  Array.from(topics).slice(0, 10).forEach(topic => {
    const li = document.createElement("li");
    li.textContent = topic;
    trendingTopics.appendChild(li);
  });
}

// Função para buscar notícias da API
async function fetchNews(query = "") {
  try {
    const url = query ? `${BASE_URL}&q=${encodeURIComponent(query)}` : BASE_URL;
    const res = await fetch(url);
    const data = await res.json();
    const newsList = data.results || [];

    if(newsList.length > 0) {
      createMainCard(newsList[0]);
      sideHighlights.innerHTML = '';
      if(newsList[1]) createSideCard(newsList[1]);
      if(newsList[2]) createSideCard(newsList[2]);

      newsContainer.innerHTML = '';
      newsList.slice(3).forEach(news => createNewsCard(news));

      populateTrendingTopics(newsList);
    } else {
      mainHighlight.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      sideHighlights.innerHTML = '';
      newsContainer.innerHTML = '';
      trendingTopics.innerHTML = '';
    }
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
  }
}

const logo = document.getElementById("logo");

// Ao clicar no logo, volta para a home (notícias principais)
logo.addEventListener("click", () => {
  searchInput.value = ""; // limpa o input de busca
  fetchNews(); // chama a função sem query para carregar notícias principais
});


// Carregar notícias principais ao abrir a página
window.addEventListener("DOMContentLoaded", () => fetchNews());

// Buscar notícias ao clicar no botão
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  fetchNews(query);
});

// Buscar notícias ao pressionar Enter no input
searchInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    const query = searchInput.value.trim();
    fetchNews(query);
  }
});


