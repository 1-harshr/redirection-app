# MongoDB Setup Guide

This guide will help you set up MongoDB Atlas (free cloud database) for persistent logging.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster

1. After signing up, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a cloud provider and region (choose one close to you)
4. Click **"Create Cluster"** (takes 1-3 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `redirection-app`)
5. Set a strong password (save it!)
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (or add `0.0.0.0/0`)
   - This is needed for Vercel to connect
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your actual credentials
7. Add the database name after `.net/`: 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/redirection-logs?retryWrites=true&w=majority
   ```

### Step 6: Add to Your App

#### For Local Development:

Create a `.env` file in your project root:

```bash
REDIRECT_URL=https://www.google.com
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/redirection-logs?retryWrites=true&w=majority
```

#### For Vercel (Production):

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your connection string
   - **Environments**: Check all (Production, Preview, Development)
5. Click **"Save"**
6. **Redeploy** your app (or push a new commit)

### Step 7: Test It!

1. Run your app locally: `npm start`
2. Visit `http://localhost:3000`
3. Check the console - you should see:
   ```
   ✅ Connected to MongoDB - logs will be persisted
   💾 Log saved to MongoDB
   ```

4. Check MongoDB Atlas:
   - Go to **"Database"** → **"Browse Collections"**
   - You should see `redirection-logs` database
   - Inside: `visitor-logs` collection with your data!

---

## 📊 View Your Logs

### In MongoDB Atlas Dashboard:

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click **"Database"** → **"Browse Collections"**
3. Select `redirection-logs` → `visitor-logs`
4. See all your visitor data!

### Via API:

```bash
# Get logs from your app
curl https://your-app.vercel.app/api/logs

# Or visit in browser:
https://your-app.vercel.app/api/logs
```

### Using MongoDB Compass (Desktop App):

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Open Compass
3. Paste your connection string
4. Click **"Connect"**
5. Navigate to `redirection-logs` → `visitor-logs`
6. View, filter, and analyze your logs!

---

## 🔒 Security Tips

1. **Never commit `.env` file** - it's already in `.gitignore`
2. **Use strong passwords** for database users
3. **Rotate credentials** periodically
4. **Monitor access** in MongoDB Atlas dashboard
5. **Set up alerts** for unusual activity

---

## 💰 Free Tier Limits

MongoDB Atlas Free Tier (M0) includes:
- ✅ 512 MB storage (enough for millions of logs)
- ✅ Shared RAM
- ✅ Shared vCPU
- ✅ No credit card required
- ✅ Never expires

Perfect for this use case! 🎉

---

## 🆘 Troubleshooting

### "Authentication failed"
- Check username and password in connection string
- Ensure database user has correct permissions

### "Connection timeout"
- Check Network Access settings
- Ensure `0.0.0.0/0` is whitelisted

### "Database not found"
- The database will be created automatically on first write
- Make sure you added `/redirection-logs` to the connection string

### App works but no MongoDB logs
- Check if `MONGODB_URI` environment variable is set
- Check Vercel logs for error messages
- Verify connection string format

---

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)

---

**Need help?** Check the [LOGS.md](./LOGS.md) file for more details on viewing and querying logs.
