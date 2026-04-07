# Deployment Guide

## Overview

| Part | Service | URL |
|------|---------|-----|
| Angular Frontend | Firebase Hosting | https://learnapp2026.web.app |
| Node.js API | Railway | https://learnaappapi-production.up.railway.app |
| Database | Firebase Firestore | Firebase Console |

---

## Part 1 — Deploy Node.js API to Railway

### Prerequisites
- Railway CLI installed: `npm install -g @railway/cli`
- `api/serviceAccountKey.json` exists (from Firebase Console → Project Settings → Service Accounts)

### First-time Setup

```bash
cd c:\AI\AngularLanguageLearn\api
railway login
railway init        # creates a new Railway project
railway up          # deploys the API
```

After `railway up`, Railway prints the deployed URL (e.g. `https://learnaappapi-production.up.railway.app`).

### Set Environment Variable in Railway Dashboard

1. Go to https://railway.app → your project → your service → **Variables**
2. Add variable:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** paste the entire contents of `serviceAccountKey.json` as a single-line JSON string
3. Railway will automatically redeploy after saving

### Re-deploy API after code changes

```bash
cd c:\AI\AngularLanguageLearn\api
railway up
```

### Verify API is running

Open in browser: `https://learnaappapi-production.up.railway.app/api/health`
Should return: `{ "status": "ok" }`

---

## Part 2 — Deploy Angular App to Firebase Hosting

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`
- `language-learn/.firebaserc` points to project `learnapp2026`

### Build and Deploy

```bash
cd c:\AI\AngularLanguageLearn\language-learn
ng build --configuration production
firebase deploy --only hosting
```

App will be live at: **https://learnapp2026.web.app**

### Re-deploy Frontend after code changes

Same two commands every time:
```bash
ng build --configuration production
firebase deploy --only hosting
```

---

## Part 3 — Update API URL (if Railway URL changes)

1. Edit `language-learn/src/environments/environment.prod.ts`:
   ```ts
   export const environment = {
     production: true,
     apiUrl: 'https://YOUR_NEW_RAILWAY_URL/api',
   };
   ```

2. Edit `api/src/index.js` — add new URL to CORS origins if needed.

3. Rebuild and redeploy Angular:
   ```bash
   ng build --configuration production
   firebase deploy --only hosting
   ```

---

## Part 4 — First-time Firestore Data Setup

On the very first run, the app auto-seeds Firestore from local JSON files:
- **Papers** — seeded from `src/assets/data/exam/papers.json`
- **Exam Users** — seeded from `src/assets/data/exam/users.json`
- **Assignments & Results** — created through the app, never seeded

### If you need to re-seed (e.g. after schema changes)

1. Go to [Firebase Console](https://console.firebase.google.com/project/learnapp2026/firestore) → Firestore
2. Delete the collection you want to re-seed (`examUsers`, `papers`, etc.)
3. Open the app — it will detect the empty collection and seed again automatically

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy API | `cd api && railway up` |
| Deploy Angular | `cd language-learn && ng build --configuration production && firebase deploy --only hosting` |
| Check API health | `curl https://learnaappapi-production.up.railway.app/api/health` |
| View Firebase logs | Firebase Console → Hosting → Usage |
| View Railway logs | Railway Dashboard → your service → Logs |

---

## Key Files

| File | Purpose |
|------|---------|
| `api/src/index.js` | Express server entry point, CORS config |
| `api/src/firebase.js` | Firebase Admin SDK init |
| `api/serviceAccountKey.json` | Firebase service account (never commit!) |
| `api/.env` | Local env vars (never commit!) |
| `language-learn/src/environments/environment.ts` | Local dev API URL (http://localhost:3000/api) |
| `language-learn/src/environments/environment.prod.ts` | Production API URL (Railway) |
| `language-learn/firebase.json` | Firebase Hosting config (public dir, rewrites) |
| `language-learn/.firebaserc` | Firebase project ID |
