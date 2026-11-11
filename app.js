let movies = [];
let currentFilter = 'all';

async function loadMovies() {
  try {
    const res = await fetch('movies.json');
    const data = await res.json();
    movies = data.movies;
    renderCategories(data.categories);
    renderMovies(movies);
  } catch (e) {
    document.getElementById('movie-grid').innerHTML = '<p>Failed to load movies.json</p>';
  }
}

function renderCategories(cats) {
  const nav = document.querySelector('.categories .container');
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.onclick = () => filterByCategory(cat);
    nav.appendChild(btn);
  });
}

function renderMovies(list) {
  const grid = document.getElementById('movie-grid');
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.innerHTML = '<p>No movies found.</p>';
    return;
  }
  list.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/300x450/1a1a2e/eee?text=No+Poster'">
      <div class="card-info">
        <h3>${movie.title} (${movie.year})</h3>
        <div class="card-meta">${movie.language} • ${movie.category}</div>
        <span class="quality-badge">${movie.quality}</span>
      </div>
    `;
    card.onclick = () => openModal(movie);
    grid.appendChild(card);
  });
}

function filterByCategory(cat) {
  currentFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = cat === 'all' ? movies : movies.filter(m => m.category === cat || m.genres.includes(cat));
  renderMovies(filtered);
}

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = movies.filter(m => 
    m.title.toLowerCase().includes(q) || 
    m.language.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q)
  );
  renderMovies(filtered);
});

function openModal(movie) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  let links = '';
  for (const [q, url] of Object.entries(movie.urls)) {
    links += `<a href="${url}" target="_blank" rel="noopener">${q} Download / Stream</a>`;
  }
  body.innerHTML = `
    <h2>${movie.title} (${movie.year})</h2>
    <p>${movie.description}</p>
    <p><strong>Language:</strong> ${movie.language} | <strong>Category:</strong> ${movie.category}</p>
    <div class="quality-links">${links}</div>
  `;
  modal.classList.remove('hidden');
}

document.querySelector('.close').onclick = () => {
  document.getElementById('modal').classList.add('hidden');
};

document.getElementById('modal').onclick = (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
  }
};

// All button
document.querySelector('.cat-btn[data-cat="all"]').onclick = () => {
  currentFilter = 'all';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-btn[data-cat="all"]').classList.add('active');
  renderMovies(movies);
};

loadMovies();
