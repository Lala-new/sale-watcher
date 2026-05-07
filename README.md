# 🛍️ Sale Watcher

> AI-powered price drop alerts. Add any product URL, set a target price, and get notified the moment it goes on sale.

**[→ Try it live](https://YOUR-USERNAME.github.io/sale-watcher)**

![Sale Watcher screenshot](https://via.placeholder.com/800x450/0a0a0a/c8f135?text=Sale+Watcher)

---

## Features

- 🔗 **Any product URL** — Nike, ASOS, Amazon, H&M, Zara, and more
- 📏 **Size tracking** — check if your specific size is in stock
- 🎯 **Target price** — only alert when price drops below your threshold
- 📧 **Email alerts** — get notified instantly when a sale drops
- 🔒 **Private** — your data never leaves your browser (except to the Anthropic API for price checks)
- 📱 **Works on mobile** — use it on your iPhone or Android

---

## How It Works

Sale Watcher uses the **Claude AI API** with web search to visit product pages and extract current pricing, sale status, and size availability. Your watchlist is stored in your browser's local storage — no account, no backend.

---

## Getting Started

### 1. Use the hosted version

Visit **[YOUR-USERNAME.github.io/sale-watcher](https://YOUR-USERNAME.github.io/sale-watcher)** — no setup needed.

### 2. Get a free API key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. Click **API Keys → Create Key**
4. Copy your key (starts with `sk-ant-...`)

### 3. Paste your key into Settings

Open the app → **Settings** → paste your API key. It's stored only in your browser.

### 4. Add products & start watching

Go to **Add Item**, paste a product URL, and hit "Add to Watchlist." Then click **Check All** to run your first check.

---

## Running Locally

```bash
git clone https://github.com/YOUR-USERNAME/sale-watcher.git
cd sale-watcher
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to GitHub Pages (free)

```bash
# 1. Update homepage in package.json
#    "homepage": "https://YOUR-USERNAME.github.io/sale-watcher"

# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Deploy
npm run deploy
```

Your app will be live at `https://YOUR-USERNAME.github.io/sale-watcher` in about 2 minutes.

---

## API Cost

Checking prices uses the Anthropic Claude API. Approximate costs:
- **10 items, checked once daily** ≈ $0.05–$0.15/month
- New accounts get **free credits** to get started
- Set a spending limit at [console.anthropic.com/settings/limits](https://console.anthropic.com/settings/limits)

---

## Tech Stack

- **React 18** — UI framework
- **Claude claude-sonnet-4-20250514** — AI price checking with web search
- **localStorage** — client-side data persistence
- **GitHub Pages** — free hosting

---

## Privacy

- Your watchlist is stored in **your browser only**
- Your API key is stored in **your browser only**
- The only external request is to the **Anthropic API** when checking prices
- No analytics, no tracking, no backend

---

## Contributing

Pull requests welcome! Some ideas:
- [ ] Push notifications (via Web Push API)
- [ ] Price history chart
- [ ] Import/export watchlist
- [ ] Browser extension version
- [ ] Scheduled checks via Service Worker

---

## License

MIT — use it, fork it, share it freely.
