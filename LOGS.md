# How to View Logs

Your app now logs to **both console and file**:
- **Console logs**: Work everywhere (local + Vercel)
- **File logs** (`ip-logs.txt`): Work locally only

---

## 📊 View Logs on Vercel (Production)

### Method 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: **redirection-app**
3. Click on the **"Logs"** tab
4. You'll see real-time logs like:
   ```
   🔍 IP: 123.45.67.89 | Location: 37.7749, -122.4194
   ↪️  Redirecting to: https://www.google.com
   ```

### Method 2: Vercel CLI (Real-time)

Watch logs in real-time from your terminal:

```bash
vercel logs https://redirection-app-pink.vercel.app --follow
```

Or just recent logs:
```bash
vercel logs https://redirection-app-pink.vercel.app
```

---

## 💻 View Logs Locally

When running locally with `npm start`, logs appear in:

1. **Terminal/Console**: Real-time output
2. **File**: `ip-logs.txt` in your project folder

Example:
```bash
npm start
# Then visit http://localhost:3000
# Logs appear in terminal AND ip-logs.txt
```

---

## 📝 Log Format

All logs follow this simple format:

```
IP: 123.45.67.89 | Location: 37.7749, -122.4194
```

or if denied:

```
IP: 123.45.67.89 | Location: DENIED
```

---

## 🔍 Filter Logs in Vercel

In the Vercel dashboard, you can:
- Filter by time range
- Search for specific IPs
- Download logs as JSON/CSV

---

## ⚡ Quick Commands

```bash
# Deploy latest changes
git push origin main
# Vercel auto-deploys!

# View production logs
vercel logs https://redirection-app-pink.vercel.app --follow

# Run locally and check ip-logs.txt
npm start
cat ip-logs.txt
```

---

## 🎯 Your Live App

**Production URL**: https://redirection-app-pink.vercel.app

Every visitor's IP and location (if allowed) will be logged to the Vercel console! 🚀
