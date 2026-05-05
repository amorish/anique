<p align="center">
  <img src="assets/images/ScreenshotDesktop.png" alt="AniQue Screenshot" height="100%" />
</p>

<p align="center">
  <img src="assets/images/aniqueTitleLogo.png" alt="AniQue Logo" width="220" />
</p>

<p align="center">
  <strong>A sleek anime watchlist to share with your friends.</strong><br/>
  Track what you're watching, discover new anime, and keep your list organized.
</p>

<p align="center">
  <a href="https://amorish.github.io/anique"><img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-e50914?style=for-the-badge" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <br/>
  <img src="https://img.shields.io/github/last-commit/amorish/anique?style=flat-square&color=e50914" alt="Last Commit" />
  <img src="https://img.shields.io/github/repo-size/amorish/anique?style=flat-square&color=333" alt="Repo Size" />
  <img src="https://img.shields.io/github/license/amorish/anique?style=flat-square&color=333" alt="License" />
</p>

---

## ![Features icon](https://api.iconify.design/lucide/sparkles.svg?color=white) Features

| Feature | Description |
|---------|-------------|
| ![Secure Auth icon](https://api.iconify.design/lucide/lock.svg?color=white) **Secure Auth** | Email/password login & signup with Firebase — smart auto-detection for new users |
| ![Instant Search icon](https://api.iconify.design/lucide/search.svg?color=white) **Instant Search** | Search 25,000+ anime via the Jikan (MyAnimeList) API with live dropdown results |
| ![Personal Watchlist icon](https://api.iconify.design/lucide/clipboard-list.svg?color=white) **Personal Watchlist** | Add, remove, and mark anime as watched — synced to the cloud in real-time |
| ![Google Calendar icon](https://api.iconify.design/lucide/calendar.svg?color=white) **Google Calendar** | Schedule watch times directly to your Google Calendar |
| ![Random Pick icon](https://api.iconify.design/lucide/dices.svg?color=white) **Random Pick** | Get high quality anime suggestions instantly |
| ![Live Stats icon](https://api.iconify.design/lucide/bar-chart-2.svg?color=white) **Live Stats** | Track total, watched, and remaining anime at a glance |
| ![Rich Details icon](https://api.iconify.design/lucide/clapperboard.svg?color=white) **Rich Details** | Click any anime card to see synopsis, watch order, director, studio, score, and more |
| ![Filter & Sort icon](https://api.iconify.design/lucide/sliders-horizontal.svg?color=white) **Filter & Sort** | Quick filter between All / Watching / Watched views |
| ![Password Reset icon](https://api.iconify.design/lucide/key.svg?color=white) **Password Reset** | Forgot your password? Reset it with one click |
| ![Responsive icon](https://api.iconify.design/lucide/smartphone.svg?color=white) **Responsive** | Looks great on desktop, tablet, and mobile |
| ![Premium Dark UI icon](https://api.iconify.design/lucide/palette.svg?color=white) **Premium Dark UI** | Sleek dark theme with Outfit + Inter fonts, video backgrounds, and glassmorphism |

---

## ![Screenshots icon](https://api.iconify.design/lucide/image.svg?color=white) Screenshots

<details>
<summary><strong>Click to expand</strong></summary>

### Login Screen
> Clean auth overlay with sign in / sign up toggle and forgot password

### Watchlist Grid
> Anime cards with poster art, watched badges, and hover effects

### Anime Details Modal
> Full details with synopsis, watch order, score, studio, and more

</details>

---

## ![Quick Start icon](https://api.iconify.design/lucide/rocket.svg?color=white) Quick Start

### 1. Clone the Repo
```bash
git clone https://github.com/amorish/anique.git
cd anique
```

### 2. Set Up Firebase (Free)
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Add a **Web App** and copy the `firebaseConfig`
3. Paste it into `assets/js/app.js` (line 1-9)
4. Enable **Authentication → Email/Password**
5. Enable **Firestore Database**

### 3. Set Firestore Security Rules
Go to Firestore → Rules and paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /watchlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Open & Enjoy
Just open `index.html` in your browser — or deploy for free on GitHub Pages / Netlify / Vercel!

---

## ![Tech Stack icon](https://api.iconify.design/lucide/layers.svg?color=white) Tech Stack

| Tech | Purpose |
|------|---------|
| **HTML5 / CSS3 / JS** | Core frontend — zero frameworks, ultra-lightweight |
| **Firebase Auth** | Secure user authentication |
| **Cloud Firestore** | Real-time database for watchlists |
| **Jikan API v4** | Anime data from MyAnimeList |
| **Lucide Icons** | Beautiful SVG icons |
| **Google Fonts** | Outfit (headings) + Inter (body) |

---

## ![Project Structure icon](https://api.iconify.design/lucide/folder-tree.svg?color=white) Project Structure

```
anique/
├── index.html              # Main app entry
├── assets/
│   ├── css/
│   │   └── style.css       # Complete styling (610+ lines)
│   ├── js/
│   │   └── app.js          # App logic, Firebase, search, UI
│   └── images/
│       ├── aniqueTitleLogo.png       # Logo
│       ├── AniQueLogo.svg   # Logo (SVG)
│       └── screenshotDesktop.png       # App screenshot
└── README.md                # Documentation
```

---

## ![Security icon](https://api.iconify.design/lucide/shield-check.svg?color=white) Security

- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) Firebase Authentication with friendly error handling
- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) Per-user data isolation (users can only access their own watchlist)
- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) XSS protection on all user-facing content
- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) Safe-for-work search filter enabled
- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) No raw error messages exposed to users
- ![check icon](https://api.iconify.design/lucide/check-circle-2.svg?color=white) Firestore security rules enforce server-side access control

---

## ![Roadmap icon](https://api.iconify.design/lucide/map.svg?color=white) Roadmap

- [ ] Episode-by-episode progress tracking
- [ ] Personal ratings (1-10 stars)
- [ ] Sort by score, year, name, date added
- [ ] Search within your own watchlist
- [ ] Google Sign-In (one-click login)
- [ ] Statistics dashboard (hours watched, genre breakdown)
- [ ] Friend system & shared watchlists
- [ ] PWA support (install on phone)
- [ ] Light mode toggle
- [ ] Import from MyAnimeList

---

## ![Contributing icon](https://api.iconify.design/lucide/users.svg?color=white) Contributing

Contributions are welcome! Feel free to fork and submit a PR.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ![License icon](https://api.iconify.design/lucide/file-text.svg?color=white) License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Created by <a href="https://github.com/amorish">@amorish</a>
</p>
