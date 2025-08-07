// ================= SETUP ===================
const form = document.getElementById('movie-form');
const movieList = document.getElementById('movie-list');
const API_URL = 'https://movie-watchlist-witn.onrender.com/api/movie';

let allMovies = [];
let filter = 'all';
let yearFilter = '';
let searchFilter = '';

// ============= NOTIFICATION SYSTEM ================
function showNotification(message, type = 'info') {
  const notify = document.getElementById('notification');
  let color = {
    success: 'bg-green-50 border-green-500 text-green-900',
    error: 'bg-red-50 border-red-500 text-red-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900'
  }[type];
  notify.className = `notification max-w-xs px-4 py-2 rounded shadow-lg border-l-4 ${color}`;
  notify.innerText = message;
  notify.style.opacity = '1';
  notify.style.pointerEvents = 'auto';
  setTimeout(() => {
    notify.style.opacity = '0';
    notify.style.pointerEvents = 'none';
  }, 2400);
}

// =============== FORM VALIDATION ==================
function validateForm(title, year, poster) {
  if (!title || title.length > 40) return 'Please provide a valid movie title (max 40 chars).';
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 1888 || y > 2099) return 'Please enter a valid year (1888-2099).';
  if (!/^https?:\/\/\S+\.(jpg|jpeg|png|webp)$/i.test(poster)) return 'Please enter a valid poster URL (JPG, PNG, WebP).';
  return null;
}

// ================ MODAL CONTROL ===================
function openFormModal() {
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeFormModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  form.reset();
}
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeFormModal();
});

// ================== FILTERING ======================
function setFilter(f) {
  filter = f;
  document.querySelectorAll("#filters button").forEach(btn => {
    btn.classList.remove("bg-blue-600", "text-white", "bg-emerald-100", "text-emerald-800", "bg-blue-100", "text-blue-800", "bg-gray-200", "text-gray-700");
  });
  document.getElementById("filter-all").classList.add(filter === 'all' ? "bg-blue-600" : "bg-gray-200", filter === 'all' ? "text-white" : "text-gray-700");
  document.getElementById("filter-watched").classList.add(filter === 'watched' ? "bg-emerald-100" : "bg-gray-200", filter === 'watched' ? "text-emerald-800" : "text-gray-700");
  document.getElementById("filter-unwatched").classList.add(filter === 'unwatched' ? "bg-blue-100" : "bg-gray-200", filter === 'unwatched' ? "text-blue-800" : "text-gray-700");
  renderMovies(allMovies);
}

function setYearFilter(val) {
  yearFilter = val;
  renderMovies(allMovies);
}
function setSearchFilter(val) {
  searchFilter = val.trim().toLowerCase();
  renderMovies(allMovies);
}


// ================ RENDER MOVIE CARDS =================
function renderMovies(movies) {
  let toShow = movies;
  if (filter === 'watched') toShow = toShow.filter(m => m.watched);
  else if (filter === 'unwatched') toShow = toShow.filter(m => !m.watched);
  if (yearFilter)
    toShow = toShow.filter(m => String(m.year) === String(yearFilter));
  if (searchFilter)
    toShow = toShow.filter(m => m.title.toLowerCase().includes(searchFilter));

  movieList.innerHTML = '';
  if (!toShow.length) {
    movieList.innerHTML = `<div class="text-center col-span-full text-gray-500">No movies found 🫤</div>`;
    return;
  }
  toShow.forEach(movie => {
    const card = document.createElement('div');
    card.className = `
      relative group movie-card transition hover:shadow-2xl
      bg-white rounded-xl overflow-hidden shadow ring-1 ring-blue-100 flex flex-col h-full
    `;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="w-full h-[450px] object-cover bg-gray-200 rounded-t">
      <div class="absolute bottom-0 left-0 w-full p-4 
                  flex flex-col
                  bg-gradient-to-t from-black/90 via-black/80 to-transparent
                  opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300">
        <h2 class="text-xl font-bold mb-1 text-blue-100 drop-shadow">${movie.title}</h2>
        <p class="text-gray-200 font-medium">Year: ${movie.year}</p>
        <p class="text-md mt-1 mb-3 font-thin italic flex items-center gap-3">
          <span id="watched-icon-${movie._id}"
                class="inline-block transition duration-300 text-xl
                  ${movie.watched ? "text-emerald-400 animate-pulse" : "text-gray-400"}
          ">${movie.watched ? '✅' : '❌'}</span>
          <span class="font-bold ${movie.watched ? 'text-emerald-200' : 'text-gray-400'}">
            ${movie.watched ? 'Watched' : 'Not Watched'}
          </span>
        </p>
        <div class="mt-auto flex gap-2">
          <button onclick="toggleWatched('${movie._id}')" 
                  class="flex-1 transition bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-medium text-sm">
            Mark as ${movie.watched ? "Unwatched" : "Watched"}
          </button>
          <button onclick="deleteMovie('${movie._id}')" 
                  class="flex-1 transition bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md font-medium text-sm">
            Delete
          </button>
        </div>
      </div>
    `;

    movieList.appendChild(card);
  });
}


// ============== FETCH MOVIES + EVENTS ===============
async function fetchMovies() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to load movies.');
    const data = await res.json();
    allMovies = data.movies || data.result || [];
    // populate year filter dropdown
    const yearSet = Array.from(new Set(allMovies.map(m => m.year).filter(Boolean))).sort((a, b) => b - a);
    const yearSel = document.getElementById("year-filter");
    yearSel.innerHTML = `<option value="">All Years</option>` + yearSet.map(y => `<option value="${y}">${y}</option>`).join('');
    renderMovies(allMovies);
  } catch (e) {
    renderMovies([]);
    showNotification("Couldn't load movies.", 'error');
  }
}

window.fetchMovies = fetchMovies;
window.onload = fetchMovies;

// =============== FORM SUBMIT (MODAL) ================
form.onsubmit = async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const year = document.getElementById('year').value.trim();
  const poster = document.getElementById('poster').value.trim();
  const validation = validateForm(title, year, poster);
  if (validation) return showNotification(validation, 'error');
  try {
    let res = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, year, poster, watched: false })
    });
    if (!res.ok) throw new Error('Server error');
    form.reset();
    closeFormModal();
    showNotification("Movie added!", 'success');
    fetchMovies();
  } catch {
    showNotification("Failed to add movie.", 'error');
  }
}

// ============== TOGGLE WATCHED + ANIMATION ===========
window.toggleWatched = async function(id) {
  try {
    let res = await fetch(`${API_URL}/toggle/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error();
    // Animate watched icon
    const icon = document.getElementById(`watched-icon-${id}`);
    if (icon) {
      icon.classList.add('animate-bounce');
      setTimeout(() => icon.classList.remove('animate-bounce'), 400);
    }
    showNotification("Toggled watched status!", 'success');
    fetchMovies();
  } catch {
    showNotification("Failed to update.", 'error');
  }
};

// ================ DELETE MOVIE =====================
window.deleteMovie = async function(id) {
  if (!confirm("Delete this movie?")) return;
  try {
    let res = await fetch(`${API_URL}/delete/${id}`, { method: 'POST' });
    if (!res.ok) throw new Error();
    showNotification("Deleted movie.", 'success');
    fetchMovies();
  } catch {
    showNotification("Delete failed.", 'error');
  }
};

// =============== SET DEFAULT FILTER ================
setFilter('all');
