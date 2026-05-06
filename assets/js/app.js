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
  document.getElementById('authFooterText').textContent = isSignupMode ? "Already have an account?" : "New here?";
  document.getElementById('authToggleBtn').textContent = isSignupMode ? "Sign in" : "Sign up";
  document.getElementById('authUsernameGroup').style.display = isSignupMode ? "block" : "none";
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
          document.getElementById('authFooterText').textContent = "Already have an account?";
          document.getElementById('authToggleBtn').textContent = "Sign in";
          document.getElementById('authUsernameGroup').style.display = "block";
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
let currentFilter = 'list'; // 'list' | 'watching' | 'watched' | 'explore'
let currentSort = 'added';
let currentSortOrder = 'desc'; // 'asc' | 'desc'
let flowModeActive = false;
let searchTimeout;
let lastQuery = '';
let deleteMode = false;
let selectedForDelete = new Set();
let recentlyDeletedItems = [];
let exploreLoaded = false;

// Google Calendar
const CAL_CLIENT_ID = '509204660972-3774jpvhcginocobddqkn3pmv8ngnf51.apps.googleusercontent.com';
const CAL_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
let gapiInited = false, gisInited = false, tokenClient = null, currentScheduleAnime = null;

function gapiLoaded() {
  gapi.load('client', async () => {
    await gapi.client.init({ discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'] });
    gapiInited = true;
  });
}
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CAL_CLIENT_ID, scope: CAL_SCOPE,
    callback: (resp) => {
      if (!resp.error) {
        gapi.client.setToken({ access_token: resp.access_token });
        submitCalendarEvent();
      }
    }
  });
  gisInited = true;
}

// SORT PANEL
const SORT_OPTIONS = [
  { key: 'added',    label: 'Date Added',  canOrder: true  },
  { key: 'name',     label: 'Name',        canOrder: true  },
  { key: 'rating',   label: 'Rating',      canOrder: true  },
  { key: 'year',     label: 'Year',        canOrder: true  },
  { key: 'episodes', label: 'Episodes',    canOrder: true  },
];

function toggleSortPanel() {
  const panel = document.getElementById('sortPanel');
  const backdrop = document.getElementById('sortPanelBackdrop');
  const btn = document.getElementById('sortFilterBtn');
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  backdrop.style.display = isOpen ? 'none' : 'block';
  btn.classList.toggle('active', !isOpen);
  if (!isOpen) renderSortPills();
}

function renderSortPills() {
  const container = document.getElementById('sortPills');
  const flowBtn = document.getElementById('flowModeBtn');
  if (flowBtn) flowBtn.classList.toggle('active', flowModeActive);
  container.innerHTML = SORT_OPTIONS.map(opt => {
    const isActive = !flowModeActive && currentSort === opt.key;
    const arrow = currentSortOrder === 'asc' ? '↑' : '↓';
    return `<button class="sort-pill ${isActive ? 'active' : ''}" onclick="setSortFromPanel('${opt.key}')">
      ${opt.label}
      ${isActive && opt.canOrder ? `<span class="pill-arrow" onclick="toggleSortOrder(event)">${arrow}</span>` : ''}
    </button>`;
  }).join('');
}

function setSortFromPanel(key) {
  flowModeActive = false;
  if (currentSort === key) {
    // Toggle order if same key tapped
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort = key;
    currentSortOrder = 'desc';
  }
  renderSortPills();
  renderGrid();
}

function toggleSortOrder(e) {
  e.stopPropagation();
  currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  renderSortPills();
  renderGrid();
}

async function activateFlowMode() {
  flowModeActive = true;
  currentSort = 'flowmode';
  toggleSortPanel();
  // Show Lottie overlay with rotating status messages
  const overlay = document.getElementById('flowmodeOverlay');
  const statusEl = document.getElementById('flowmodeStatus');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const phases = ['Scanning your list...', 'Fetching genre data...', 'Analysing flow patterns...', 'Optimising your order...'];
  let pi = 0;
  statusEl.textContent = phases[0];
  const phaseTimer = setInterval(() => { pi++; if (pi < phases.length) statusEl.textContent = phases[pi]; }, 900);
  try {
    // Fetch AniList genre data for richer FlowMode sorting
    const ids = watchlist.filter(w => !w.watched).map(w => w.id).filter(Boolean);
    if (ids.length > 0) {
      const query = `query($ids:[Int]){Page(perPage:50){media(idMal_in:$ids,type:ANIME){idMal genres averageScore}}}`;
      const res = await fetch('https://graphql.anilist.co', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({query, variables:{ids}}) });
      const data = await res.json();
      (data.data?.Page?.media || []).forEach(m => {
        const item = watchlist.find(w => w.id === m.idMal);
        if (item) { item._genres = m.genres || []; item._aniScore = m.averageScore || 0; }
      });
    }
  } catch(e) { /* AniList failed, fall back to basic algo */ }
  // Wait for animation to feel meaningful
  await new Promise(r => setTimeout(r, 3500));
  clearInterval(phaseTimer);
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  renderSortPills();
  renderGrid();
  showToast('FlowMode active — your optimised order is ready');
}

function applyFlowMode(items) {
  // Enhanced: avoid same genre back-to-back, boost in-progress, interleave lengths
  const withPriority = items.map(a => ({
    ...a,
    _score: (a._aniScore || (a.score ? a.score * 10 : 0)),
    _inProgress: (a.episodesWatched || 0) > 0 ? 1 : 0
  }));
  const short  = withPriority.filter(a => (a.episodes||999) <= 13).sort((a,b) => b._inProgress-a._inProgress || b._score-a._score);
  const medium = withPriority.filter(a => (a.episodes||999) > 13 && (a.episodes||999) <= 50).sort((a,b) => b._inProgress-a._inProgress || b._score-a._score);
  const long   = withPriority.filter(a => (a.episodes||999) > 50).sort((a,b) => b._inProgress-a._inProgress || b._score-a._score);
  const movies = withPriority.filter(a => a.type === 'Movie').sort((a,b) => b._score-a._score);
  const result = []; let mi = 0;
  const maxLen = Math.max(short.length, medium.length, long.length);
  for (let i = 0; i < maxLen; i++) {
    if (short[i])  result.push(short[i]);
    if (medium[i]) result.push(medium[i]);
    // Insert a movie as palette cleanser every 4 items
    if (i % 2 === 1 && movies[mi]) { result.push(movies[mi++]); }
    if (long[i])   result.push(long[i]);
  }
  // Add remaining movies at end
  while (mi < movies.length) result.push(movies[mi++]);
  // Deduplicate (movie might be in short/medium/long too)
  const seen = new Set(); return result.filter(a => seen.has(a.id) ? false : seen.add(a.id));
}

// LIGHTBOX
function openLightbox(src) {
  const lb = document.getElementById('lightboxBackdrop');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}
function closeLightbox() {
  document.getElementById('lightboxBackdrop').classList.remove('open');
  // Only restore scroll if modal is also closed
  if (!document.getElementById('modalBackdrop').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

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
  if (!e.target.closest('.search-overlay')) closeDropdown();
});

function clearSearch() {
  searchInput.value = '';
  dropdown.innerHTML = '';
  searchStatus.textContent = '';
  closeDropdown();
  searchInput.focus();
}

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
    <div class="drop-item" data-idx="${idx}" data-id="${a.mal_id}">
      <img class="drop-poster" src="${escHtml(a.images?.jpg?.image_url || '')}" alt="" onerror="this.style.background='#222';this.src=''" draggable="false" oncontextmenu="return false"/>
      <div class="drop-info">
        <div class="drop-title">${escHtml(a.title)}</div>
        <div class="drop-meta">${escHtml(a.type || 'TV')} · ${escHtml(String(a.year || '—'))} · ${a.episodes ? a.episodes + ' eps' : '?'}</div>
      </div>
      <button class="drop-add ${inList ? 'added' : ''}" data-idx="${idx}" ${inList ? 'disabled' : ''}>
        ${inList ? 'Added' : '+ Add'}
      </button>
    </div>`;
  }).join('');

  // Click on poster or title → open detail modal
  dropdown.querySelectorAll('.drop-item').forEach(item => {
    const idx = parseInt(item.dataset.idx);
    const clickable = [item.querySelector('.drop-poster'), item.querySelector('.drop-title')];
    clickable.forEach(el => {
      if (el) el.addEventListener('click', (e) => {
        e.stopPropagation();
        const anime = lastSearchResults[idx];
        if (anime) openModal(anime.mal_id, null);
      });
    });
  });

  // Event delegation for add buttons
  dropdown.querySelectorAll('.drop-add:not(.added)').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const anime = lastSearchResults[idx];
      if (anime) addAnime(anime.mal_id, anime, btn);
    });
  });

  openDropdown();
}

function openDropdown() { dropdown.classList.add('open'); }
function closeDropdown() { dropdown.classList.remove('open'); }

let currentModalAnime = null;
function addAnimeFromModal(btn) {
  if (currentModalAnime) addAnime(currentModalAnime.mal_id, currentModalAnime, btn);
}

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
    episodesWatched: 0,
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
function removeAnime(id, event) {
  if (event) event.stopPropagation();
  const index = watchlist.findIndex(w => w.id === id);
  if (index !== -1) {
    recentlyDeletedItems = [watchlist[index]];
    watchlist.splice(index, 1);
    save();
    renderGrid();
    showToast(`Removed "${recentlyDeletedItems[0].title}"`, true);
  }
}

// TOGGLE WATCHED
async function toggleWatched(id, event) {
  if (event) event.stopPropagation();
  const item = watchlist.find(w => w.id === id);
  if (!item) return;
  item.watched = !item.watched;
  if (item.watched) {
    if (item.episodesWatched !== item.episodes) {
      item.previousEpisodesWatched = item.episodesWatched || 0;
    }
    if (item.episodes) item.episodesWatched = item.episodes;
    item.watchedAt = todayDate();
  } else {
    item.episodesWatched = item.previousEpisodesWatched !== undefined ? item.previousEpisodesWatched : 0;
    item.watchedAt = null;
  }
  await save();
  renderGrid();
}

function todayDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
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

// SEARCH AND PROFILE TOGGLES
function toggleSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  if (overlay.style.display === 'none') {
    overlay.style.display = 'flex';
    input.focus();
  } else {
    overlay.style.display = 'none';
  }
}

function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}

// Close profile menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('profileMenu');
  const btn = document.getElementById('avatarBtn');
  if (menu && menu.style.display !== 'none' && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// FILTER & SELECT MODE
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('#normalFilters .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Toggle grid vs explore visibility
  const gridWrap = document.getElementById('gridWrap');
  const exploreSection = document.getElementById('exploreSection');
  const sortFilterBtn = document.getElementById('sortFilterBtn');
  const selectModeToggleBtn = document.getElementById('selectModeToggleBtn');
  if (f === 'explore') {
    gridWrap.style.display = 'none';
    exploreSection.style.display = 'block';
    if (sortFilterBtn) sortFilterBtn.style.display = 'none';
    if (selectModeToggleBtn) selectModeToggleBtn.style.display = 'none';
    if (!exploreLoaded) loadExplore();
  } else {
    gridWrap.style.display = 'block';
    exploreSection.style.display = 'none';
    if (sortFilterBtn) sortFilterBtn.style.display = '';
    if (selectModeToggleBtn) selectModeToggleBtn.style.display = '';
    renderGrid();
  }
}

function toggleSelectMode() {
  deleteMode = !deleteMode;
  selectedForDelete.clear();
  document.getElementById('normalFilters').style.display = deleteMode ? 'none' : 'flex';
  document.getElementById('selectFilters').style.display = deleteMode ? 'flex' : 'none';
  renderGrid();
  updateSelectUI();
}

function updateSelectUI() {
  const countText = document.getElementById('selectCountText');
  if (countText) countText.textContent = `${selectedForDelete.size} Selected`;
}

function toggleSelection(id) {
  if (selectedForDelete.has(id)) selectedForDelete.delete(id);
  else selectedForDelete.add(id);
  updateSelectUI();
  const card = document.getElementById(`card-${id}`);
  if (card) card.classList.toggle('selected', selectedForDelete.has(id));
}

function confirmRemoveSelected() {
  if (selectedForDelete.size === 0) { toggleSelectMode(); return; }
  const count = selectedForDelete.size;
  if (!confirm(`Remove ${count} anime from your watchlist?\n\nThis action cannot be undone (you can Undo from the toast).`)) return;
  recentlyDeletedItems = watchlist.filter(w => selectedForDelete.has(w.id));
  watchlist = watchlist.filter(w => !selectedForDelete.has(w.id));
  save();
  toggleSelectMode();
  showToast(`Removed ${recentlyDeletedItems.length} anime`, true);
}

function markSelectedWatched() {
  if (selectedForDelete.size === 0) { toggleSelectMode(); return; }
  const date = todayDate();
  selectedForDelete.forEach(id => {
    const item = watchlist.find(w => w.id === id);
    if (item) {
      item.watched = true;
      if (item.episodes) item.episodesWatched = item.episodes;
      item.watchedAt = date;
    }
  });
  const count = selectedForDelete.size;
  save();
  toggleSelectMode();
  showToast(`Marked ${count} anime as watched ✓`);
}

// RENDER GRID
function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('emptyState');
  updateStats();

  let items = [...watchlist];
  if (currentFilter === 'watched')  items = items.filter(w => w.watched);
  else if (currentFilter === 'watching') items = items.filter(w => !w.watched && (w.episodesWatched || 0) > 0);
  else /* list */ items = items.filter(w => !w.watched);

  const showEpCounter = (currentFilter === 'watching');

  if (flowModeActive) {
    items = applyFlowMode(items);
  } else {
    const asc = currentSortOrder === 'asc';
    if (currentSort === 'rating')   items.sort((a,b) => asc ? (a.score||0)-(b.score||0) : (b.score||0)-(a.score||0));
    else if (currentSort === 'name') items.sort((a,b) => asc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
    else if (currentSort === 'year') items.sort((a,b) => asc ? (a.year||0)-(b.year||0) : (b.year||0)-(a.year||0));
    else if (currentSort === 'episodes') items.sort((a,b) => asc ? (a.episodes||0)-(b.episodes||0) : (b.episodes||0)-(a.episodes||0));
    else { if (!asc) items.reverse(); }
  }

  if (items.length === 0) { grid.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';

  grid.innerHTML = items.map((a, i) => `
    <div class="card-wrapper">
      <article class="card ${a.watched ? 'watched' : ''} ${deleteMode ? 'delete-mode' : ''} ${selectedForDelete.has(a.id) ? 'selected' : ''}" id="card-${a.id}" onclick="openModal(${a.id}, event)">
        <img class="poster-img" src="${a.poster || ''}" alt="${escHtml(a.title)}" loading="lazy" onerror="this.src=''" draggable="false" oncontextmenu="return false" />
        <div class="card-gradient"></div>
        <div class="card-select-overlay"></div>
        <button class="watched-btn ${a.watched ? 'checked' : ''}" onclick="toggleWatched(${a.id}, event)" title="${a.watched ? 'Mark unwatched' : 'Mark watched'}">
          <i data-lucide="check" style="width:14px;height:14px;stroke-width:3;"></i>
        </button>
        ${currentFilter !== 'watched' ? `<button class="remove-btn" onclick="removeAnime(${a.id}, event)" title="Remove"><i data-lucide="trash-2" style="width:13px;height:13px;"></i></button>` : ''}
        <div class="card-content">
          <div class="card-meta"><span class="type-pill">${a.type || 'TV'}</span></div>
          <h3 class="card-title">${escHtml(a.title)}</h3>
          ${showEpCounter ? `<div class="card-ep-counter" onclick="event.stopPropagation()">
            <button class="ep-btn" onmousedown="startProgress(${a.id},-1,event)" onmouseup="stopProgress(event)" onmouseleave="stopProgress(event)" ontouchstart="startProgress(${a.id},-1,event)" ontouchend="stopProgress(event)">−</button>
            <span class="ep-text" id="ep-text-${a.id}">Ep ${a.episodesWatched||0}/${a.episodes||'?'}</span>
            <button class="ep-btn" onmousedown="startProgress(${a.id},1,event)" onmouseup="stopProgress(event)" onmouseleave="stopProgress(event)" ontouchstart="startProgress(${a.id},1,event)" ontouchend="stopProgress(event)">+</button>
          </div>` : ''}
        </div>
      </article>
      ${(!deleteMode && currentSort === 'added' && !flowModeActive) ? `<div class="card-sl">${i + 1}</div>` : ''}
    </div>
  `).join('');
  lucide.createIcons();
}

// MODAL
async function openModal(id, event) {
  if (deleteMode) {
    if (event) event.preventDefault();
    toggleSelection(id);
    return;
  }
  document.body.style.overflow = 'hidden';
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
    currentModalAnime = detail;
    const staffData = (await staffRes.json()).data || [];
    const relData = (await relRes.json()).data || [];

    const director = staffData.find(s => s.positions?.some(p => p.toLowerCase().includes('director')));
    const seriesComp = staffData.find(s => s.positions?.some(p => p.toLowerCase().includes('series composition')));

    // Watch order from relations (prequels, sequels)
    const watchOrder = buildWatchOrder(relData, detail);

    // Detect sub/dub from title or status (Jikan doesn't give explicit dub/sub; we note availability)
    const subDub = detail.rating ? detectSubDub(detail) : '—';
    
    let syn = detail.synopsis || 'No synopsis available.';
    syn = syn.replace(/\[Written by MAL Rewrite\]/gi, '').trim();
    syn = escHtml(syn).replace(/\n/g, '<br>');
    
    const existingItem = watchlist.find(w => w.id === id);
    const inList = !!existingItem;

    content.innerHTML = `
      <div class="modal-hero">
        <div class="modal-poster">
          <img src="${escHtml(detail.images?.jpg?.large_image_url || '')}" alt="" onerror="this.src=''" draggable="false" oncontextmenu="return false" />
          <button class="modal-poster-expand" onclick="openLightbox('${escHtml(detail.images?.jpg?.large_image_url || detail.images?.jpg?.image_url || '')}')" title="View poster">
            <i data-lucide="maximize-2"></i>
          </button>
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
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
            ${!inList ? `<button class="modal-add-btn" onclick="addAnimeFromModal(this)">+ Add</button>` : `<span style="font-size:11px;color:var(--muted);align-self:center;">In list</span>`}
            ${(!existingItem?.watched) ? `<button class="modal-watched-btn" onclick="markWatchedFromModal(${detail.mal_id})"><i data-lucide="eye" style="width:12px;height:12px;"></i> Mark Watched</button>` : ''}
            <button class="modal-cal-btn" onclick="openSchedule(${detail.mal_id})"><i data-lucide="calendar" style="width:12px;height:12px;"></i> Schedule</button>
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
          ${(inList && !existingItem.watched) ? `
          <div style="grid-column: 1 / -1; background: #111; padding: 12px 16px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border);">
            <div class="detail-label" style="margin: 0;">Episodes Watched</div>
            <div class="progress-controls">
              <button class="progress-btn" onmousedown="startProgress(${id},-1,event)" onmouseup="stopProgress(event)" onmouseleave="stopProgress(event)" ontouchstart="startProgress(${id},-1,event)" ontouchend="stopProgress(event)">−</button>
              <span class="progress-text">${existingItem.episodesWatched || 0} / ${detail.episodes || '?'}</span>
              <button class="progress-btn" onmousedown="startProgress(${id},1,event)" onmouseup="stopProgress(event)" onmouseleave="stopProgress(event)" ontouchstart="startProgress(${id},1,event)" ontouchend="stopProgress(event)">+</button>
            </div>
          </div>
          ` : ''}
        </div>

        <div class="section-label">Synopsis</div>
        <div class="synopsis" id="synopsisBox">
          ${syn}
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
    lucide.createIcons();
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
  if (!document.getElementById('lightboxBackdrop').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function markWatchedFromModal(id) {
  let item = watchlist.find(w => w.id === id);
  if (!item && currentModalAnime) {
    // Add to list first (inline, avoiding dummy button)
    const a = currentModalAnime;
    const newItem = {
      id: a.mal_id, title: a.title, title_en: a.title_english || '',
      poster: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '',
      type: a.type || 'TV', episodes: a.episodes,
      year: a.year || a.aired?.prop?.from?.year || null,
      score: a.score, status: a.status,
      studio: a.studios?.[0]?.name || null,
      watched: false, episodesWatched: 0, addedAt: Date.now()
    };
    watchlist.push(newItem);
    item = newItem;
  }
  if (item) {
    item.watched = true;
    if (item.episodes) item.episodesWatched = item.episodes;
    item.watchedAt = todayDate();
    save(); renderGrid(); showToast('Marked as watched ✓');
  }
}

// UTILS
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function showToast(msg, isUndo = false) {
  const t = document.getElementById('toast');
  t.innerHTML = `<span>${escHtml(msg)}</span>` + (isUndo ? `<span onclick="undoDelete()" style="color:var(--accent); text-decoration:underline; margin-left:16px; cursor:pointer; font-weight:bold;">Undo</span>` : '');
  t.classList.add('show');
  clearTimeout(t.timeout);
  t.timeout = setTimeout(() => t.classList.remove('show'), isUndo ? 4000 : 2500);
}

function undoDelete() {
  if (recentlyDeletedItems.length > 0) {
    watchlist.push(...recentlyDeletedItems);
    save();
    renderGrid();
    recentlyDeletedItems = [];
    document.getElementById('toast').classList.remove('show');
  }
}

// INIT
lucide.createIcons();
renderGrid();

let progressInterval = null;
let progressTimeout = null;

function startProgress(id, change, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  updateProgress(id, change, null, true);
  progressTimeout = setTimeout(() => {
    progressInterval = setInterval(() => {
      updateProgress(id, change, null, true);
    }, 100);
  }, 400);
}

function stopProgress(event) {
  if (event) event.stopPropagation();
  clearTimeout(progressTimeout);
  clearInterval(progressInterval);
  save(); // Save once when released
}

async function updateProgress(id, change, event, skipSave = false) {
  if (event) event.stopPropagation();
  const item = watchlist.find(i => i.id === id);
  if (!item) return;
  let newProgress = (item.episodesWatched || 0) + change;
  if (newProgress < 0) newProgress = 0;
  if (item.episodes && newProgress > item.episodes) newProgress = item.episodes;
  item.episodesWatched = newProgress;
  if (item.episodes && item.episodesWatched === item.episodes) item.watched = true;
  if (!skipSave) await save();
  
  // Update card ep counter in-place
  const epText = document.getElementById(`ep-text-${id}`);
  if (epText) epText.textContent = `Ep ${item.episodesWatched}/${item.episodes || '?'}`;
  if (item.watched && !skipSave) renderGrid();
  
  // Update modal progress text if open
  const modal = document.getElementById('modalBackdrop');
  if (modal && modal.classList.contains('open')) {
    const textEl = modal.querySelector('.progress-text');
    if (textEl) textEl.textContent = `${item.episodesWatched} / ${item.episodes || '?'}`;
  }
  updateStats();
}

function confirmDeleteAccount() {
  if (confirm("Are you sure you want to delete your account?\n\nAll your watchlist data will be permanently cleared. This action cannot be undone.")) {
    deleteAccount();
  }
}

async function deleteAccount() {
  const user = firebase.auth().currentUser;
  if (!user) return;
  try {
    // Delete user data first
    await db.collection('users').doc(user.uid).delete();
    // Delete auth account
    await user.delete();
    alert("Account deleted successfully.");
    window.location.reload();
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      alert("Security requirement: Please sign out and sign back in to delete your account.");
      logout();
    } else {
      console.error("Error deleting account", error);
      alert("Failed to delete account: " + error.message);
    }
  }
}

// ===== EXPLORE SECTION =====
async function loadExplore() {
  exploreLoaded = true;
  await fetchExploreList('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10', 'carousel-trending');
  await new Promise(r => setTimeout(r, 400));
  await fetchExploreList('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10', 'carousel-popular');
  await new Promise(r => setTimeout(r, 400));
  await fetchExploreList('https://api.jikan.moe/v4/seasons/upcoming?limit=10', 'carousel-upcoming');
  await new Promise(r => setTimeout(r, 400));
  await fetchExploreList('https://api.jikan.moe/v4/seasons/now?limit=10', 'carousel-toprated');
  await new Promise(r => setTimeout(r, 400));
  await fetchRandomAnime();
}

async function fetchExploreList(url, containerId, retries = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="explore-loading"><i data-lucide="loader" style="width:20px;height:20px;animation:spin 2s linear infinite;"></i></div>`;
  lucide.createIcons();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 429 && attempt < retries) {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const items = data.data || [];
      container.innerHTML = items.map(a => `
        <div class="explore-card" onclick="openModal(${a.mal_id}, event)">
          <img class="explore-card-img" src="${escHtml(a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '')}" onerror="this.src=''" alt="" draggable="false" oncontextmenu="return false"/>
          <div class="explore-card-title">${escHtml(a.title)}</div>
          <div class="explore-card-meta">${escHtml(a.type || 'TV')} · ★ ${a.score || 'N/A'}</div>
        </div>
      `).join('');
      return; // Success, exit function
    } catch(e) {
      if (attempt === retries) {
        container.innerHTML = `<div class="explore-loading">Failed to load list. Please try again later.</div>`;
      }
    }
  }
}

async function fetchRandomAnime(forceNew = false) {
  const container = document.getElementById('randomAnimeGrid');
  const limitText = document.getElementById('randomLimitText');
  const btn = document.getElementById('randomPickBtn');
  if (!container) return;

  const todayStr = todayDate();
  let state = { count: 0, items: [] };
  try {
    const stored = localStorage.getItem('random_pick_state');
    if (stored) state = JSON.parse(stored);
  } catch(e) { console.error('Error parsing random_pick_state', e); }
  
  if (state.date !== todayStr) { state = { date: todayStr, count: 0, items: [] }; }

  if (!forceNew && state.items && state.items.length === 3) {
    renderRandomAnime(state.items);
    updateRandomLimit(state.count);
    return;
  }

  if (forceNew && state.count >= 6) {
    showToast('Daily limit reached (6/6). Come back tomorrow!');
    return;
  }

  container.innerHTML = `<div class="explore-loading" style="grid-column:1/-1;"><div class="spinner" style="border-top-color:var(--accent);"></div></div>`;
  if (btn) btn.classList.add('loading');
  lucide.createIcons();

  try {
    const page = Math.floor(Math.random() * 20) + 1;
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    let candidates = data.data.filter(a => a.score >= 7.5 && !watchlist.some(w => w.id === a.mal_id));
    
    // Shuffle candidates
    candidates = candidates.sort(() => 0.5 - Math.random());
    
    const newItems = [];
    for (const a of candidates) {
      if (newItems.length >= 3) break;
      const aGenres = (a.genres || []).map(g => g.name);
      // Try to avoid genre overlap if possible
      const overlap = newItems.some(ex => {
        const exGenres = (ex.genres || []).map(g => g.name);
        return aGenres.some(g => exGenres.includes(g));
      });
      if (!overlap || candidates.length < 5) newItems.push(a);
    }

    if (newItems.length >= 3) {
      if (forceNew) state.count++;
      state.items = newItems.slice(0, 3);
      localStorage.setItem('random_pick_state', JSON.stringify(state));
      renderRandomAnime(state.items);
      updateRandomLimit(state.count);
    } else {
      throw new Error('Not enough items');
    }
  } catch(e) {
    container.innerHTML = `<div class="explore-loading" style="grid-column:1/-1;">Failed to fetch</div>`;
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}

function updateRandomLimit(count) {
  const limitText = document.getElementById('randomLimitText');
  if (limitText) limitText.textContent = `${6 - count}/6 remaining`;
}

function renderRandomAnime(items) {
  const container = document.getElementById('randomAnimeGrid');
  if (!container) return;
  container.innerHTML = items.map(a => `
    <div class="explore-card" style="width: 100%; flex-shrink: 1;" onclick="openModal(${a.mal_id}, event)">
      <div style="width:100%;aspect-ratio:2/3;position:relative;border-radius:var(--radius-md);overflow:hidden;margin-bottom:8px;">
        <img class="explore-card-img" src="${escHtml(a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '')}" onerror="this.src=''" alt="" draggable="false" oncontextmenu="return false" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>
      </div>
      <div class="explore-card-title" style="font-size:14px;">${escHtml(a.title)}</div>
      <div class="explore-card-meta" style="font-size:12px;">${escHtml(a.type || 'TV')} · ★ ${a.score || 'N/A'}</div>
    </div>
  `).join('');
}

// ===== GOOGLE CALENDAR SCHEDULE =====
function openSchedule(animeId) {
  if (!currentModalAnime || currentModalAnime.mal_id !== animeId) return;
  currentScheduleAnime = currentModalAnime;
  const isMovie = currentScheduleAnime.type === 'Movie';
  
  const content = document.getElementById('scheduleContent');
  content.innerHTML = `
    <div class="schedule-content">
      <div class="schedule-title">Schedule Watch</div>
      <div class="schedule-subtitle">${escHtml(currentScheduleAnime.title)}</div>
      <form id="scheduleForm" onsubmit="event.preventDefault(); handleScheduleSubmit();">
        <div class="schedule-row">
          <div class="schedule-field">
            <label>Start Date</label>
            <input type="date" id="schStartDate" required />
          </div>
          <div class="schedule-field">
            <label>Time</label>
            <input type="time" id="schTime" required />
          </div>
        </div>
        ${!isMovie ? `
        <div class="schedule-row">
          <div class="schedule-field">
            <label>Frequency</label>
            <select id="schFreq">
              <option value="1">Daily (1 ep/day)</option>
              <option value="2">Every 2 days</option>
              <option value="7">Weekly (1 ep/week)</option>
            </select>
          </div>
          <div class="schedule-field">
            <label>Episodes</label>
            <input type="number" id="schEps" min="1" max="${currentScheduleAnime.episodes || 999}" value="${currentScheduleAnime.episodes || 12}" required />
          </div>
        </div>` : ''}
        <div class="schedule-actions">
          <button type="button" class="schedule-cancel" onclick="closeScheduleDirect()">Cancel</button>
          <button type="submit" class="schedule-submit">Add to Calendar</button>
        </div>
      </form>
    </div>
  `;
  
  // Set default date to today
  document.getElementById('schStartDate').valueAsDate = new Date();
  document.getElementById('scheduleBackdrop').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeSchedule(e) { if (e.target === document.getElementById('scheduleBackdrop')) closeScheduleDirect(); }
function closeScheduleDirect() {
  document.getElementById('scheduleBackdrop').style.display = 'none';
  if (!document.getElementById('modalBackdrop').classList.contains('open') && !document.getElementById('lightboxBackdrop').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function handleScheduleSubmit() {
  if (!gapiInited || !gisInited) return showToast('Calendar API not ready yet. Try again in a moment.');
  tokenClient.requestAccessToken({prompt: 'consent'});
}

async function submitCalendarEvent() {
  const form = document.getElementById('scheduleForm');
  const startDate = document.getElementById('schStartDate').value;
  const time = document.getElementById('schTime').value;
  const isMovie = currentScheduleAnime.type === 'Movie';
  
  const startDateTime = new Date(`${startDate}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + (isMovie ? 120 : 25) * 60000); // 2 hours for movie, 25m for ep
  
  const event = {
    summary: `Watch ${currentScheduleAnime.title}`,
    description: `Scheduled via AniQue\n\n${currentScheduleAnime.url || ''}`,
    start: { dateTime: startDateTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end: { dateTime: endDateTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  };

  if (!isMovie) {
    const freqVal = parseInt(document.getElementById('schFreq').value);
    const count = parseInt(document.getElementById('schEps').value);
    const byDayMap = {1: 'DAILY', 2: 'DAILY', 7: 'WEEKLY'};
    const intervalStr = freqVal === 2 ? ';INTERVAL=2' : '';
    event.recurrence = [`RRULE:FREQ=${byDayMap[freqVal]}${intervalStr};COUNT=${count}`];
  }

  try {
    const btn = document.querySelector('.schedule-submit');
    const oldTxt = btn.textContent;
    btn.textContent = 'Saving...'; btn.disabled = true;
    
    await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    showToast('Successfully scheduled in Google Calendar!');
    closeScheduleDirect();
  } catch (err) {
    console.error(err);
    showToast('Failed to add to calendar.');
  }
}
