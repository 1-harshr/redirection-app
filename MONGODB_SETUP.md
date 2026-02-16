# MongoDB Atlas Setup Guide

Follow these steps to set up free MongoDB database for your redirection app.

---

## 📦 Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google/GitHub or email
3. Choose the **FREE** tier (M0 Sandbox)

---

## 🗄️ Step 2: Create a Cluster

1. After signing in, click **"Build a Database"**
2. Choose **M0 FREE** tier
3. Select a cloud provider and region (choose closest to your users)
4. Cluster Name: `redirection-cluster` (or any name)
5. Click **"Create Cluster"** (takes 1-3 minutes)

---

## 🔐 Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `redirectionapp` (or any username)
5. **Auto-generate a secure password** (copy it!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

**⚠️ IMPORTANT: Save the password! You'll need it in the next step.**

---

## 🌐 Step 4: Allow Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Vercel deployment)
   - IP Address: `0.0.0.0/0`
4. Click **"Confirm"**

---

## 🔗 Step 5: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<username>` and `<password>`** with your actual credentials from Step 3

**Example:**
```
mongodb+srv://redirectionapp:MySecurePass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ Step 6: Add to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **redirection-app** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string from Step 5
   - **Environment**: Production, Preview, Development (select all)
5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment

### Option B: Via CLI

```bash
cd /Users/harshranjan/Documents/apps/redirection-app
vercel env add MONGODB_URI production
```
Then paste your connection string when prompted.

Redeploy:
```bash
vercel --prod
```

---

## 🧪 Step 7: Test It

1. Visit your app: `https://redirection-app-pink.vercel.app`
2. Allow location permission
3. Check logs in MongoDB Atlas:
   - Go to **Database** → **Browse Collections**
   - Database: `redirection-app`
   - Collection: `visitor-logs`
   - You should see your log entry!

---

## 📊 Step 8: View Your Logs

### Via MongoDB Atlas Dashboard:
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **"Database"** → **"Browse Collections"**
3. Select `redirection-app` database → `visitor-logs` collection
4. See all visitor IPs and locations!

### Via API Endpoint:
Visit: `https://redirection-app-pink.vercel.app/api/logs`

This shows the last 100 log entries in JSON format.

---

## 🎯 What Gets Logged

Each visitor entry contains:
```json
{
  "_id": "...",
  "ip": "192.168.1.1",
  "timestamp": "2026-02-16T16:30:00.000Z",
  "denied": false,
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "accuracy": 20
  }
}
```

If location is denied:
```json
{
  "_id": "...",
  "ip": "192.168.1.1",
  "timestamp": "2026-02-16T16:30:00.000Z",
  "denied": true
}
```

---

## 💡 Pro Tips

1. **Free Tier Limits**: 512MB storage, 100 connections - more than enough for most use cases
2. **Backup**: MongoDB Atlas automatically backs up your data
3. **Analytics**: Use MongoDB Charts (free) to visualize your data
4. **Security**: Never commit your connection string to Git (it's in `.gitignore`)

---

## 🔧 Troubleshooting

**Connection fails?**
- Check username/password are correct
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify connection string format

**No logs appearing?**
- Check Vercel logs: `vercel logs`
- Ensure `MONGODB_URI` environment variable is set
- Redeploy after adding environment variable

**Need help?**
- MongoDB Atlas docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Vercel environment variables: [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)

---

## ✅ You're Done!

Your app now has persistent logging that survives deployments! 🎉
