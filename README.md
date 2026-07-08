# Twirll Menu SPA

A React single-page application for browsing a restaurant menu, selecting product variants, and managing a persistent cart — with user authentication.

## Features

- **Homepage** with Menu and Login navigation
- **Menu page** — fetches items from Twirll API, displays name, description, price, image (with placeholder), and availability
- **Variant modal** — click multi-variant items to choose a variant and add to cart
- **Auto-add** — single-variant items (`total_variants === 1`) are added directly after fetching variant details
- **Login / Sign Up** — Express + SQLite backend with 50 seeded users
- **Persistent cart** — stored in `localStorage`, survives refresh
- **Bonus**: multi-criteria priority sorting, cart count badge, logged-in user indicator

## Quick Start

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Auth API: http://localhost:3001

## Sample Login

| Email | Password |
|-------|----------|
| priya@demo.com | Hgyfgyt67 |
| rahul@demo.com | kgtfrdyt67 |

## Deploy to Render (recommended)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/product-variant-twirll.git
git push -u origin main
```

### 2. Deploy on Render

1. Go to [render.com](https://render.com) and sign up / log in.
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repo.
4. Render reads `render.yaml` automatically. Or set manually:
   - **Build command:** `npm run install:all && npm run build`
   - **Start command:** `npm start`
5. Click **Deploy**.

Your app will be live at `https://twirll-menu.onrender.com` (or similar).

### Test production locally

```bash
npm run install:all
npm run build
npm start
```

Open http://localhost:3001 — one server serves both UI and API.

## Project Structure

```
client/   React + Vite frontend
server/   Express auth API (SQLite)
```
