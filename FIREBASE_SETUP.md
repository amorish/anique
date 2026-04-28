# Quick Guide: Checking if Firebase is Working

To make your Anime Watchlist function correctly, you **must link it** to a Google Firebase project. This will enable user login and save their anime watches permanently!

## Step 1: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Log in with your Google account.
3. Click **"Add project"** or **"Create a project"**.
4. Name your project (e.g. `anique-watchlist`) and click **Continue**. 
5. *(Optional)* Turn off Google Analytics if you don't need it.
6. Click **Create project** and wait for it to finish!

## Step 2: Grab your API Keys
1. In the center of your new project's dashboard, you will see a few circular icons (`iOS`, `Android`, `</>`, `Unity`).
2. Click the **`</>` (Web)** icon to register an app.
3. Type in an App nickname (e.g. `AniQue Web`) and click **Register App**.
4. Firebase will display your *firebaseConfig* code. It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDa...",
  authDomain: "anique-watchlist.firebaseapp.com",
  projectId: "anique-watchlist",
  storageBucket: "anique-watchlist.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234"
};
```
5. **Copy** that exact block of code.
6. Open your `d:\AniQue\assets\js\app.js` file, go to **Line 2**, and replace the placeholder `firebaseConfig` with the one you just copied!

## Step 3: Enable Authentication (Sign In)
1. On the left-hand sidebar of Firebase, click **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the *Sign-in Providers* tab, click **Email/Password**.
4. Toggle the first switch to **Enable** (leave Passwordless alone), and click **Save**.

## Step 4: Enable Firestore Database
1. On the left-hand sidebar again, click **Build** -> **Firestore Database**.
2. Click **Create database**.
3. It will ask for rules. Select **Start in Test Mode** (this makes testing easy for the first 30 days while building).
4. Select a location (any default is fine) and click **Enable**.

### All Done!
Now refresh your `index.html` page. You can click "Need an account? Sign up", register with an email/password, and start adding animes! Your watchlist will be securely saved into Firebase!
