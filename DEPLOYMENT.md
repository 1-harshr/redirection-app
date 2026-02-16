# Deployment Guide

This guide covers multiple ways to deploy your redirection app to the web.

---

## 🚀 Option 1: Vercel (Recommended - Easiest & Free)

Vercel is perfect for Node.js apps with automatic HTTPS and global CDN.

### Steps:

1. **Install Vercel CLI** (already done):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Login with GitHub/Email
   - Confirm project settings
   - Done! You'll get a URL like `https://your-app.vercel.app`

3. **Set Environment Variables** (optional):
   ```bash
   vercel env add REDIRECT_URL
   ```
   Then enter your redirect URL when prompted.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Auto-Deploy on Git Push:
- Connect your GitHub repo on [vercel.com](https://vercel.com)
- Every push to `main` will auto-deploy!

---

## 🌐 Option 2: Render (Free Tier Available)

Render offers free hosting for web services.

### Steps:

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `1-harshr/redirection-app`
4. Configure:
   - **Name**: redirection-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add environment variable:
   - Key: `REDIRECT_URL`
   - Value: `https://your-target-url.com`
6. Click "Create Web Service"

Your app will be live at `https://redirection-app.onrender.com`

---

## ☁️ Option 3: Railway (Simple & Fast)

Railway offers $5 free credit monthly.

### Steps:

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `1-harshr/redirection-app`
5. Railway auto-detects Node.js and deploys
6. Add environment variables in Settings:
   - `REDIRECT_URL=https://your-target-url.com`
7. Get your URL from the deployment

---

## 🔷 Option 4: Heroku (Classic Option)

Heroku is a well-established platform.

### Steps:

1. Install Heroku CLI:
   ```bash
   brew install heroku/brew/heroku
   ```

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create your-app-name
   ```

4. Set environment variable:
   ```bash
   heroku config:set REDIRECT_URL=https://your-target-url.com
   ```

5. Deploy:
   ```bash
   git push heroku main
   ```

Your app will be at `https://your-app-name.herokuapp.com`

---

## 🌊 Option 5: DigitalOcean App Platform

DigitalOcean offers $200 free credit for 60 days.

### Steps:

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Click "Create" → "Apps"
3. Connect GitHub repo
4. Configure:
   - **Type**: Web Service
   - **Run Command**: `npm start`
   - **HTTP Port**: 3000
5. Add environment variable: `REDIRECT_URL`
6. Deploy

---

## 🔧 Option 6: Azure (You Already Have Workflows!)

I see you have Azure workflows in `.github/workflows/`. 

### Steps:

1. Create Azure Web App:
   - Go to [portal.azure.com](https://portal.azure.com)
   - Create "Web App"
   - Runtime: Node.js
   - Region: Choose closest to your users

2. Configure GitHub Actions:
   - The workflow files are already set up
   - Add Azure credentials to GitHub Secrets
   - Push to trigger deployment

---

## 📊 Comparison

| Platform | Free Tier | Ease | Auto-Deploy | Custom Domain |
|----------|-----------|------|-------------|---------------|
| **Vercel** | ✅ Yes | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Yes |
| **Render** | ✅ Yes | ⭐⭐⭐⭐ | ✅ Yes | ✅ Yes |
| **Railway** | $5 credit | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Yes |
| **Heroku** | Limited | ⭐⭐⭐ | ✅ Yes | ✅ Yes |
| **DigitalOcean** | $200 credit | ⭐⭐⭐ | ✅ Yes | ✅ Yes |
| **Azure** | Limited | ⭐⭐ | ✅ Yes | ✅ Yes |

---

## 🎯 Quick Start (Vercel - Fastest)

Just run this command:

```bash
vercel --prod
```

That's it! Your app will be live in ~30 seconds. 🚀

---

## ⚠️ Important Notes

1. **Location Permissions**: HTTPS is required for geolocation API to work. All these platforms provide free HTTPS.

2. **Log Files**: On serverless platforms (Vercel), file writes are temporary. Consider using a database or external logging service for persistent logs.

3. **Environment Variables**: Always set `REDIRECT_URL` in your deployment platform's environment settings.

4. **Custom Domain**: All platforms support custom domains (e.g., `redirect.yourdomain.com`)

---

## 🔐 For Production

If you need persistent logging, consider:
- **MongoDB Atlas** (free tier) for storing logs
- **PostgreSQL** on Render/Railway
- **Supabase** (free tier with PostgreSQL)

Let me know if you need help setting up database logging!
