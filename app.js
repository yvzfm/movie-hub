let movies = [];

async function loadMovies() {
  try {
    const res = await fetch('movies.json');
    const data = await res.json();
    movies = data.movies || [];
    buildCategories(data.categories || []);
    render(movies);
  } catch (err) {
    document.getElementById('movie-grid').innerHTML = '<p style="color:#888">Could not load movies.json</p>';
  }
}

function buildCategories(cats) {
  const bar = document.getElementById('cat-bar');
  cats.forEach(c => {
    if (c.toLowerCase() === 'all') return;
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = c;
    btn.dataset.cat = c;
    btn.onclick = () => setFilter(c, btn);
    bar.appendChild(btn);
  });
}

function setFilter(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'all' ? movies : movies.filter(m =>
    m.category === cat || (m.genres && m.genres.includes(cat))
  );
  render(filtered);
}

document.querySelector('.cat-btn[data-cat="all"]').onclick = (e) => setFilter('all', e.target);

function render(list) {
  const grid = document.getElementById('movie-grid');
  const count = document.getElementById('count');
  count.textContent = list.length + ' titles';
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = '<p style="color:#888">Nothing matches.</p>';
    return;
  }
  list.forEach(m => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${m.poster}" alt="${m.title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/300x450/1a1a2e/eee?text=No+Poster'">
      <div class="card-info">
        <h3>${m.title}</h3>
        <div class="card-meta">${m.year} · ${m.language}</div>
        <span class="quality-badge">${m.quality}</span>
      </div>
    `;
    card.onclick = () => openModal(m);
    grid.appendChild(card);
  });
}

document.getElementById('search').addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.language && m.language.toLowerCase().includes(q)) ||
    (m.category && m.category.toLowerCase().includes(q)) ||
    (m.genres && m.genres.some(g => g.toLowerCase().includes(q)))
  );
  render(filtered);
});

function openModal(m) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  let links = '';
  Object.entries(m.urls || {}).forEach(([label, url]) => {
    links += `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} — open / download</a>`;
  });
  body.innerHTML = `
    <h2>${m.title} (${m.year})</h2>
    <p>${m.description || ''}</p>
    <p><strong>Category:</strong> ${m.category} · <strong>Language:</strong> ${m.language}</p>
    <div class="quality-links">${links || '<p>No links available.</p>'}</div>
  `;
  modal.classList.remove('hidden');
}

document.querySelector('.close').onclick = () => document.getElementById('modal').classList.add('hidden');
document.getElementById('modal').onclick = e => {
  if (e.target.id === 'modal') e.currentTarget.classList.add('hidden');
};

loadMovies();
