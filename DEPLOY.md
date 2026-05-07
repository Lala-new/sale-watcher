# How to publish Sale Watcher on GitHub (free)

This guide walks you through putting Sale Watcher online so anyone can use it.
No coding experience needed — just follow each step.

---

## What you'll end up with

A live website at:
**https://YOUR-USERNAME.github.io/sale-watcher**

Anyone can visit it, enter their own Anthropic API key, and start tracking sales.
It's 100% free to host.

---

## Step 1 — Create a GitHub account

1. Go to **github.com**
2. Click **Sign up**
3. Choose a username (this will appear in your app's URL)
4. Complete the signup

---

## Step 2 — Create a new repository

1. Once logged in, click the **+** button (top right) → **New repository**
2. Name it exactly: `sale-watcher`
3. Make sure **Public** is selected
4. Click **Create repository**

---

## Step 3 — Install Git and Node.js (one-time setup)

**On Mac:**
- Install Homebrew first: paste this into Terminal:
  `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Then run: `brew install node git`

**On Windows:**
- Download Node.js from **nodejs.org** → click the "LTS" version → run the installer
- Download Git from **git-scm.com** → run the installer (click Next through everything)

---

## Step 4 — Upload the code

Open **Terminal** (Mac) or **Command Prompt** (Windows) and run these commands one by one.

Replace `YOUR-USERNAME` with your actual GitHub username:

```bash
# Go into the project folder
cd sale-watcher-app

# Install dependencies
npm install

# Set up git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/sale-watcher.git
git branch -M main
git push -u origin main
```

---

## Step 5 — Update your app URL

Open the file `package.json` in a text editor (Notepad on Windows, TextEdit on Mac).

Find this line:
```
"homepage": ".",
```

Change it to (replace YOUR-USERNAME):
```
"homepage": "https://YOUR-USERNAME.github.io/sale-watcher",
```

Save the file.

---

## Step 6 — Publish to GitHub Pages

Run these commands in Terminal/Command Prompt:

```bash
npm run deploy
```

Wait about 60 seconds. Then visit:
**https://YOUR-USERNAME.github.io/sale-watcher**

Your app is live! 🎉

---

## Step 7 — Share it!

Copy your link and share it anywhere:
- Reddit communities (r/frugal, r/deals, r/buildapc, etc.)
- Product Hunt
- Twitter/X
- Friends & family

---

## Making updates later

Whenever you want to update the app:
1. Make your changes to the code
2. Run `npm run deploy` again
3. The live site updates automatically

---

## Troubleshooting

**"npm: command not found"**
→ Node.js isn't installed. Go back to Step 3.

**"git: command not found"**  
→ Git isn't installed. Go back to Step 3.

**Page shows 404 after deploying**
→ Wait 2–3 minutes and refresh. GitHub Pages takes a moment.

**"Permission denied" when pushing**
→ GitHub will ask you to log in. Use your GitHub username and a Personal Access Token
  (go to github.com → Settings → Developer settings → Personal access tokens → Generate new token)
