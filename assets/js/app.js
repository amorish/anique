const firebaseConfig = {
  apiKey: "AIzaSyBHzRwrjSAKIzKfMDgEfIsiKUnkSf02hZg",
  authDomain: "anique-ffcdb.firebaseapp.com",
  projectId: "anique-ffcdb",
  storageBucket: "anique-ffcdb.firebasestorage.app",
  messagingSenderId: "467263577157",
  appId: "1:467263577157:web:e6da039127c895a1c6172c",
  measurementId: "G-9QMLNEK8TB"
};

let db = null;
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) { console.error("Firebase not configured"); }

let currentUser = null;
let isSignupMode = false;

// DISPOSABLE / TEMP EMAIL BLOCKLIST
const BLOCKED_EMAIL_DOMAINS = new Set([
  'tempmail.com','temp-mail.org','guerrillamail.com','guerrillamail.net','guerrillamail.org',
  'guerrillamailblock.com','grr.la','sharklasers.com','guerrillamail.de','throwaway.email',
  'yopmail.com','yopmail.fr','mailinator.com','maildrop.cc','dispostable.com',
  'trashmail.com','trashmail.net','trashmail.me','trashmail.org','mailnesia.com',
  'tempail.com','tempr.email','10minutemail.com','10minutemail.net','minutemail.com',
  'mohmal.com','getnada.com','emailondeck.com','33mail.com','mailcatch.com',
  'fakeinbox.com','fakemail.net','deadaddress.com','discard.email','discardmail.com',
  'disposableemailaddresses.emailmiser.com','emailigo.de','emailtemporario.com.br',
  'getairmail.com','harakirimail.com','jetable.org','mail-temporaire.fr','mailexpire.com',
  'mailforspam.com','mailhazard.com','mailhazard.us','mailmoat.com','mailnull.com',
  'mailscrap.com','mailshell.com','mailsiphon.com','mailslite.com','mailzilla.com',
  'nomail.xl.cx','nowmymail.com','objectmail.com','obobbo.com','onewaymail.com',
  'owlpic.com','proxymail.eu','punkass.com','putthisinyouremail.com','receiveee.com',
  'regbypass.com','rejectmail.com','rklips.com','safersignup.de','sharklasers.com',
  'shieldedmail.com','smellfear.com','snapmail.cc','sogetthis.com','soodonims.com',
  'spambob.com','spambob.net','spambob.org','spamcero.com','spamday.com','spamfree24.com',
  'spamfree24.de','spamfree24.eu','spamfree24.info','spamfree24.net','spamfree24.org',
  'spamgourmet.com','spamgourmet.net','spamgourmet.org','spamherelots.com','spamhole.com',
  'spamify.com','spaminator.de','spamkill.info','spaml.com','spaml.de','spammotel.com',
  'spamobox.com','spamspot.com','spamthis.co.uk','spamtrail.com','speed.1s.fr',
  'superrito.com','suremail.info','tempalias.com','temporaryemail.net','temporaryemail.us',
  'temporaryforwarding.com','temporaryinbox.com','thanksmia.com','thisisnotmyrealemail.com',
  'throwawayemailaddress.com','tittbit.in','tradermail.info','turual.com','uggsrock.com',
  'veryreallyfakeemails.com','wegwerfmail.de','wegwerfmail.net','wetrainbayarea.com',
  'whyspam.me','wilemail.com','willselfdestruct.com','winemaven.info','wronghead.com',
  'xagloo.com','xemaps.com','xents.com','xjoi.com','xoxy.net','yapped.net',
  'maildrop.cc','nada.email','anonbox.net','binkmail.com','bobmail.info','brefmail.com',
  'bugmenot.com','bumpymail.com','byom.de','chogmail.com','cool.fr.nf','correo.blogos.net',
  'cosmorph.com','courriel.fr.nf','cubiclink.com','curryworld.de','cust.in',
  'dacoolest.com','dandikmail.com','dayrep.com','dcemail.com','deadaddress.com',
  'despammed.com','devnullmail.com','dfgh.net','digitalsanctuary.com','dingbone.com',
  'mail.tm','tempmailo.com','internxt.com','luxusmail.org','tmail.ws',
]);

function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return BLOCKED_EMAIL_DOMAINS.has(domain);
}

function isValidEmailFormat(email) {
  // Must have @ with something before and after, proper domain with dot
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
}

function togglePassword() {
  const pwdInput = document.getElementById('authPwd');
  const icon = document.getElementById('pwdEyeIcon');
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    icon.setAttribute('data-lucide', 'eye-off');
  } else {
    pwdInput.type = 'password';
    icon.setAttribute('data-lucide', 'eye');
  }
  lucide.createIcons();
}

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    // Check if email is verified
    if (!user.emailVerified) {
      currentUser = null;
      showVerificationScreen(user.email);
      return;
    }
    currentUser = user;
    document.getElementById('authOverlay').style.display = 'none';
    document.getElementById('verifyOverlay').style.display = 'none';
    document.getElementById('userBadge').style.display = 'flex';
    document.getElementById('userEmail').textContent = user.displayName || user.email;
    await loadWatchlist();
  } else {
    currentUser = null;
    watchlist = [];
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('verifyOverlay').style.display = 'none';
    document.getElementById('userBadge').style.display = 'none';
    renderGrid();
  }
});

function showVerificationScreen(email) {
  document.getElementById('authOverlay').style.display = 'none';
  document.getElementById('verifyOverlay').style.display = 'flex';
  document.getElementById('verifyEmail').textContent = email;
}

async function resendVerification() {
  const user = firebase.auth().currentUser;
  if (!user) return showToast('No user logged in');
  const btn = document.getElementById('resendBtn');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    await user.sendEmailVerification();
    showToast('Verification email sent! Check your inbox & spam.');
  } catch (e) {
    if (e.code === 'auth/too-many-requests') {
      showToast('Too many attempts. Wait a few minutes.');
    } else {
      showToast('Failed to send. Try again later.');
    }
  } finally {
    btn.textContent = 'Resend Verification Email';
    // Cooldown: disable for 30 seconds to prevent spam
    setTimeout(() => { btn.disabled = false; }, 30000);
  }
}

async function checkVerification() {
  const user = firebase.auth().currentUser;
  if (!user) return;
  await user.reload();
  if (user.emailVerified) {
    currentUser = user;
    document.getElementById('verifyOverlay').style.display = 'none';
    document.getElementById('userBadge').style.display = 'flex';
    document.getElementById('userEmail').textContent = user.displayName || user.email;
    showToast('Email verified successfully.');
    await loadWatchlist();
  } else {
    showToast('Email not verified yet. Check your inbox.');
  }
}

function verifyLogout() {
  firebase.auth().signOut();
}

function toggleAuthMode() {
  isSignupMode = !isSignupMode;
  document.getElementById('authTitle').textContent = isSignupMode ? "Create Account" : "Sign In";
  document.getElementById('authActionBtn').textContent = isSignupMode ? "Sign Up" : "Sign In";
  document.getElementById('authToggleBtn').textContent = isSignupMode ? "Already have an account? Sign in" : "Need an account? Sign up";
  document.getElementById('authUsername').style.display = isSignupMode ? "block" : "none";
}

async function handleAuth() {
  const email = document.getElementById('authEmail').value.trim();
  const pwd = document.getElementById('authPwd').value;
  const username = document.getElementById('authUsername').value.trim();
  
  if (isSignupMode && (!email || !pwd || !username)) return showToast('Enter username, email, and password');
  if (!isSignupMode && (!email || !pwd)) return showToast('Enter email and password');

  // Validate email format
  if (!isValidEmailFormat(email)) return showToast('Please enter a valid email address');

  // Block disposable/temp emails on signup
  if (isSignupMode && isDisposableEmail(email)) {
    return showToast('Temporary/disposable emails are not allowed. Use a real email.');
  }

  const btn = document.getElementById('authActionBtn');
  btn.textContent = "Please wait...";
  btn.disabled = true;

  try {
    if (isSignupMode) {
      const cred = await firebase.auth().createUserWithEmailAndPassword(email, pwd);
      await cred.user.updateProfile({ displayName: username });
      if (db) {
        await db.collection("users").doc(cred.user.uid).set({
          username: username,
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      // Send verification email immediately
      await cred.user.sendEmailVerification();
      showToast("Account created! Check your email to verify.");
    } else {
      await firebase.auth().signInWithEmailAndPassword(email, pwd);
      // onAuthStateChanged will handle the verified check
    }
  } catch (e) {
    const code = e.code || '';
    // Smart auth: auto-switch to sign up if the account doesn't exist
    if (!isSignupMode && (code === 'auth/user-not-found' || code === 'auth/invalid-credential')) {
      try {
        const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
        if (methods.length === 0) {
          isSignupMode = true;
          document.getElementById('authTitle').textContent = "Create Account";
          document.getElementById('authActionBtn').textContent = "Sign Up";
          document.getElementById('authToggleBtn').textContent = "Already have an account? Sign in";
          document.getElementById('authUsername').style.display = "block";
          showToast("No account found — sign up instead!");
        } else {
          showToast("Incorrect password. Try again.");
        }
      } catch (_) {
        showToast(friendlyAuthError(code));
      }
    } else {
      showToast(friendlyAuthError(code));
    }
  } finally {
    btn.disabled = false;
    btn.textContent = isSignupMode ? "Sign Up" : "Sign In";
  }
}

function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found': 'No account with that email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/email-already-in-use': 'Email already registered — try signing in',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment',
    'auth/network-request-failed': 'Network error. Check your connection',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

async function forgotPassword() {
  const email = document.getElementById('authEmail').value.trim();
  if (!email) return showToast('Enter your email first, then click Forgot Password');
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    showToast('Password reset email sent! Check your inbox.');
  } catch (e) {
    showToast(friendlyAuthError(e.code || ''));
  }
}

function logout() {
  firebase.auth().signOut();
}

async function loadWatchlist() {
  if (!db || !currentUser) return;
  try {
    const docSnap = await db.collection("watchlists").doc(currentUser.uid).get();
    if (docSnap.exists) {
      watchlist = docSnap.data().items || [];
    } else {
      watchlist = [];
    }
    renderGrid();
  } catch (e) {
    console.error("Error loading watchlist", e);
  }
}

// STATE
let watchlist = [];
let currentFilter = 'all';
let searchTimeout;
let lastQuery = '';

// SEARCH
const searchInput = document.getElementById('searchInput');
const dropdown = document.getElementById('dropdown');
const searchStatus = document.getElementById('searchStatus');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim();
  clearTimeout(searchTimeout);
  if (q.length < 2) {
    closeDropdown();
    searchStatus.textContent = '';
    return;
  }
  searchStatus.textContent = 'Searching...';
  searchTimeout = setTimeout(() => fetchSearch(q), 500);
});

searchInput.addEventListener('focus', () => {
  if (dropdown.innerHTML && lastQuery === searchInput.value.trim()) openDropdown();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) closeDropdown();
});

async function fetchSearch(q) {
  lastQuery = q;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=8&sfw=true`);
    const data = await res.json();
    if (q !== lastQuery) return;
    renderDropdown(data.data || []);
    searchStatus.textContent = '';
  } catch (e) {
    searchStatus.textContent = 'Error fetching results';
  }
}

// Store search results for safe reference by index (avoids inline JSON injection)
let lastSearchResults = [];

function renderDropdown(results) {
  if (!results.length) {
    dropdown.innerHTML = `<div class="drop-empty">No results found</div>`;
    openDropdown();
    return;
  }
  lastSearchResults = results;
  dropdown.innerHTML = results.map((a, idx) => {
    const inList = watchlist.some(w => w.id === a.mal_id);
    return `
    <div class="drop-item" data-id="${a.mal_id}">
      <img class="drop-poster" src="${escHtml(a.images?.jpg?.image_url || '')}" alt="" onerror="this.style.background='#222';this.src=''"/>
      <div class="drop-info">
        <div class="drop-title">${escHtml(a.title)}</div>
        <div class="drop-meta">${escHtml(a.type || 'TV')} · ${escHtml(String(a.year || '—'))} · ${a.episodes ? a.episodes + ' eps' : '?'}</div>
      </div>
      <button class="drop-add ${inList ? 'added' : ''}" data-idx="${idx}"
        ${inList ? 'disabled' : ''}>
        ${inList ? 'Added' : '+ Add'}
      </button>
    </div>`;
  }).join('');

  // Event delegation for add buttons (safer than inline onclick with JSON)
  dropdown.querySelectorAll('.drop-add:not(.added)').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const anime = lastSearchResults[idx];
      if (anime) addAnime(anime.mal_id, anime, btn);
    });
  });

  openDropdown();
}

function openDropdown() { dropdown.classList.add('open'); }
function closeDropdown() { dropdown.classList.remove('open'); }

// ADD ANIME
function addAnime(id, animeData, btn) {
  if (watchlist.some(w => w.id === id)) return;

  const item = {
    id: animeData.mal_id,
    title: animeData.title,
    title_en: animeData.title_english || '',
    poster: animeData.images?.jpg?.large_image_url || animeData.images?.jpg?.image_url || '',
    type: animeData.type || 'TV',
    episodes: animeData.episodes,
    year: animeData.year || animeData.aired?.prop?.from?.year || null,
    score: animeData.score,
    status: animeData.status,
    studio: animeData.studios?.[0]?.name || null,
    watched: false,
    addedAt: Date.now()
  };
  watchlist.push(item);
  save().then(() => {
    btn.textContent = 'Added';
    btn.classList.add('added');
    btn.disabled = true;
    showToast(`"${item.title}" added to watchlist`);
  });
  renderGrid();
}

// REMOVE
function removeAnime(id) {
  watchlist = watchlist.filter(w => w.id !== id);
  save();
  renderGrid();
  showToast('Removed from watchlist');
}

// TOGGLE WATCHED
async function toggleWatched(id) {
  const item = watchlist.find(w => w.id === id);
  if (!item) return;
  item.watched = !item.watched;
  await save();
  renderGrid();
}

// SAVE
async function save() {
  updateStats();
  if (!db || !currentUser) return;
  try {
    await db.collection("watchlists").doc(currentUser.uid).set({ items: watchlist });
  } catch (e) {
    console.error("Error saving watchlist", e);
    showToast("Failed to sync to database");
  }
}

// STATS
function updateStats() {
  const total = watchlist.length;
  const watched = watchlist.filter(w => w.watched).length;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('watchedCount').textContent = watched;
  document.getElementById('remainCount').textContent = total - watched;
}

// FILTER
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
}

// RENDER GRID
function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('emptyState');
  updateStats();

  let items = watchlist;
  if (currentFilter === 'watched') items = watchlist.filter(w => w.watched);
  if (currentFilter === 'watching') items = watchlist.filter(w => !w.watched);

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = items.map((a, i) => `
    <div class="card ${a.watched ? 'watched' : ''}" id="card-${a.id}">
      <div class="sl-badge">#${watchlist.indexOf(a) + 1}</div>
      <button class="watched-btn ${a.watched ? 'checked' : ''}" onclick="toggleWatched(${a.id})" title="${a.watched ? 'Mark unwatched' : 'Mark watched'}">
        <i data-lucide="check" style="width:13px; height:13px; stroke-width: 3;"></i>
      </button>
      <div class="poster-wrap" onclick="openModal(${a.id})">
        ${a.poster
      ? `<img class="poster-img" src="${a.poster}" alt="${escHtml(a.title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'poster-placeholder\\'>🎌</div>'"/>`
      : `<div class="poster-placeholder">🎌</div>`}
        <div class="poster-overlay">
          <span class="overlay-hint">View details</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${escHtml(a.title)}</div>
        <div class="card-meta">
          <span class="type-pill">${a.type || 'TV'}</span>
          ${a.year ? `<span>${a.year}</span>` : ''}
          ${a.episodes ? `<span>${a.episodes} eps</span>` : ''}
        </div>
        <button class="remove-btn" onclick="removeAnime(${a.id})">Remove</button>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

// MODAL
async function openModal(id) {
  const backdrop = document.getElementById('modalBackdrop');
  const content = document.getElementById('modalContent');
  backdrop.classList.add('open');
  content.innerHTML = `<div class="modal-loading"><div class="spinner"></div>Loading details…</div>`;

  try {
    const [detailRes, staffRes, relRes] = await Promise.all([
      fetch(`https://api.jikan.moe/v4/anime/${id}/full`),
      fetch(`https://api.jikan.moe/v4/anime/${id}/staff`),
      fetch(`https://api.jikan.moe/v4/anime/${id}/relations`)
    ]);
    const detail = (await detailRes.json()).data;
    const staffData = (await staffRes.json()).data || [];
    const relData = (await relRes.json()).data || [];

    const director = staffData.find(s => s.positions?.some(p => p.toLowerCase().includes('director')));
    const seriesComp = staffData.find(s => s.positions?.some(p => p.toLowerCase().includes('series composition')));

    // Watch order from relations (prequels, sequels)
    const watchOrder = buildWatchOrder(relData, detail);

    // Detect sub/dub from title or status (Jikan doesn't give explicit dub/sub; we note availability)
    const subDub = detail.rating ? detectSubDub(detail) : '—';

    content.innerHTML = `
      <div class="modal-hero">
        <div class="modal-poster">
          <img src="${detail.images?.jpg?.large_image_url || ''}" alt="" onerror="this.src=''" />
        </div>
        <div class="modal-hero-info">
          ${detail.score ? `<div class="modal-score">★ ${detail.score}</div>` : ''}
          <div class="modal-title">${escHtml(detail.title)}</div>
          ${detail.title_english && detail.title_english !== detail.title
        ? `<div class="modal-eng-title">${escHtml(detail.title_english)}</div>`
        : '<div class="modal-eng-title"></div>'}
          <div class="modal-tags">
            <span class="tag accent">${detail.type || 'TV'}</span>
            ${detail.status ? `<span class="tag">${detail.status}</span>` : ''}
            ${detail.rating ? `<span class="tag">${detail.rating}</span>` : ''}
            ${detail.genres?.slice(0, 3).map(g => `<span class="tag">${g.name}</span>`).join('') || ''}
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="detail-grid">
          <div class="detail-item">
            <div class="detail-label">Year</div>
            <div class="detail-val">${detail.year || detail.aired?.prop?.from?.year || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">${detail.type === 'Movie' ? 'Duration' : 'Episodes'}</div>
            <div class="detail-val">${detail.type === 'Movie' ? (detail.duration || '—') : (detail.episodes || '?')}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Studio</div>
            <div class="detail-val">${detail.studios?.map(s => s.name).join(', ') || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Director</div>
            <div class="detail-val">${director ? director.person.name : '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Source</div>
            <div class="detail-val">${detail.source || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Sub / Dub</div>
            <div class="detail-val">${subDub}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Season</div>
            <div class="detail-val">${detail.season ? capitalize(detail.season) + (detail.year ? ' ' + detail.year : '') : '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Score Rank</div>
            <div class="detail-val">${detail.rank ? '#' + detail.rank : '—'}</div>
          </div>
        </div>

        <div class="section-label">Synopsis</div>
        <div class="synopsis" id="synopsisBox">
          ${detail.synopsis ? escHtml(detail.synopsis).replace(/\n/g, '<br>') : 'No synopsis available.'}
          <div class="synopsis-fade"></div>
        </div>
        <button class="read-more" onclick="toggleSynopsis()">Read more ↓</button>

        ${watchOrder.length > 1 ? `
        <div class="watch-order">
          <div class="watch-order-title"></div>
          ${watchOrder.map((w, i) => `
            <div class="order-item">
              <div class="order-num">${i + 1}</div>
              <div class="order-name">${escHtml(w.name)}</div>
              <div class="order-type">${w.type}</div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
    `;
  } catch (e) {
    content.innerHTML = `<div class="modal-loading" style="height:200px">Failed to load details. Try again.</div>`;
  }
}

function buildWatchOrder(relData, currentDetail) {
  const order = [];
  const prequel = relData.find(r => r.relation === 'Prequel');
  const sequel = relData.find(r => r.relation === 'Sequel');
  const parent = relData.find(r => r.relation === 'Parent story');

  if (parent?.entry?.[0]) order.push({ name: parent.entry[0].name, type: 'Parent Story' });
  if (prequel?.entry?.[0]) order.push({ name: prequel.entry[0].name, type: 'Prequel' });
  order.push({ name: currentDetail.title, type: currentDetail.type + ' (Current)' });
  if (sequel?.entry?.[0]) order.push({ name: sequel.entry[0].name, type: 'Sequel' });

  // Side stories
  const sideStory = relData.filter(r => r.relation === 'Side story');
  sideStory.forEach(s => s.entry?.forEach(e => order.push({ name: e.name, type: 'Side Story' })));

  return order;
}

function detectSubDub(detail) {
  // Jikan doesn't carry dub status explicitly; we show a note
  return 'Sub (check Crunchyroll)';
}

function toggleSynopsis() {
  const box = document.getElementById('synopsisBox');
  const btn = box.nextElementSibling;
  box.classList.toggle('expanded');
  btn.textContent = box.classList.contains('expanded') ? 'Read less ↑' : 'Read more ↓';
}

function closeModal(e) {
  if (e.target === document.getElementById('modalBackdrop')) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modalBackdrop').classList.remove('open');
}

// UTILS
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// INIT
lucide.createIcons();
renderGrid();
