# Publishing AniQue to the Web

Now that your project files are perfectly organized into a standard structure (`index.html`, `assets/css`, `assets/js`, `assets/images`), publishing your website for your friends to use is incredibly easy!

Here are the simplest and most accessible ways to host your web app for free.

## Option 1: Vercel (Recommended)
Vercel is extremely fast and handles standard web files perfectly.
1. Go to [Vercel.com](https://vercel.com) and create a free account (you can sign in with GitHub or Email).
2. Once logged in, go to your dashboard and look for the **"Add New..." -> "Project"** button.
3. If you do not have Git/GitHub, you can install the **Vercel CLI** via your terminal, but the absolute easiest way without code is setting up a GitHub repository.
4. **Without Git:** Download [Vercel Desktop](https://vercel.com/download) or use the command line `npm i -g vercel` and simply type `vercel` inside your `d:\AniQue` folder!
5. Follow the quick prompts in your terminal. Vercel will instantly upload your files and give you a live URL.

## Option 2: Netlify Drop (Easiest)
Netlify allows you to literally drag-and-drop your folder to publish it:
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Simply open your computer's file explorer.
3. Drag the **ENTIRE** `AniQue` folder and drop it into the circle on their website.
4. Netlify will immediately upload your files and generate a live URL!
5. *Tip: You can create a free account on Netlify to rename your URL to something custom like `anique.netlify.app`.*

## Option 3: GitHub Pages
1. Create a free account on [GitHub](https://github.com).
2. Create a new repository named `anique`.
3. Upload all your files (`index.html`, `assets/` folder, etc) to this repository.
4. Go to the repository **Settings** > **Pages**.
5. Select the `main` branch and save.
6. In a few minutes, your site will be live at `https://amorish.github.io/anique`.

> [!IMPORTANT]
> Because you are using **Firebase** for the backend, you do not need a backend host (like Heroku or an Express server). Firebase handles all the dynamic data directly from your front-end. Standard static webpage hosting (like the 3 options above) is all you need!
> Just make sure you've inserted your Firebase configuration strings inside `assets/js/app.js` before you deploy!
