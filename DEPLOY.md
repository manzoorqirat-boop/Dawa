# 🚀 Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (railway.app) — sign in with GitHub
- This repo pushed to GitHub

---

## Step 1 — Push to GitHub

```bash
cd dawa-inventory
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dawa-inventory.git
git push -u origin main
```

---

## Step 2 — Create Railway Project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **"Deploy from GitHub repo"**
3. Select `dawa-inventory`
4. Railway will detect the repo — **cancel auto-deploy for now** (we'll configure services manually)

---

## Step 3 — Add MongoDB Plugin

1. Inside your Railway project → **+ New** → **Database** → **MongoDB**
2. Click the MongoDB service → **Variables** tab
3. Copy the `MONGO_URL` value (you'll need it in Step 5)

---

## Step 4 — Create Backend Service

1. In your Railway project → **+ New** → **GitHub Repo** → select `dawa-inventory`
2. Click the new service → **Settings** tab:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Watch Paths**: `backend/**`
3. Go to **Variables** tab and add:

```
MONGO_URI=<paste your MongoDB MONGO_URL from Step 3>
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.up.railway.app
```

4. Go to **Settings** → **Networking** → **Generate Domain**
5. Copy the backend domain (e.g. `dawa-backend.up.railway.app`)

---

## Step 5 — Seed the Database

After backend deploys successfully:

1. Click backend service → **Deploy** tab → open the latest deploy
2. Or use Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway link   # select your project + backend service
railway run npm run seed
```

---

## Step 6 — Create Frontend Service

1. In your Railway project → **+ New** → **GitHub Repo** → select `dawa-inventory` again
2. Click the new service → **Settings** tab:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`
   - **Watch Paths**: `frontend/**`
3. Go to **Variables** tab and add:

```
VITE_API_URL=https://dawa-backend.up.railway.app/api
```

4. Go to **Settings** → **Networking** → **Generate Domain**

---

## Step 7 — Update Backend FRONTEND_URL

1. Go back to the **backend service** → **Variables**
2. Update `FRONTEND_URL` to your actual frontend Railway domain
3. Railway will auto-redeploy

---

## Auto-Deploy on Push

Railway automatically redeploys each service when you push changes to `main`:
- Changes in `backend/` → only backend redeploys (Watch Paths filter)
- Changes in `frontend/` → only frontend redeploys

---

## Final URLs
| Service  | URL                                        |
|----------|--------------------------------------------|
| Frontend | `https://dawa-frontend.up.railway.app`     |
| Backend  | `https://dawa-backend.up.railway.app/api`  |
| MongoDB  | Managed internally by Railway              |