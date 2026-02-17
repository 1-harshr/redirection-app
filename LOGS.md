# How to View Logs

Your app now logs to **MongoDB for persistent storage** and **console for debugging**:
- **MongoDB logs**: Persistent storage with full visitor data (IP, location, timestamp, user agent)
- **Console logs**: Real-time debugging (local + Vercel)

---

## 🔧 Setup MongoDB

### Option 1: MongoDB Atlas (Free Cloud Database - Recommended)

1. **Create a free account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a cluster** (Free tier M0 is perfect)
3. **Create a database user**:
   - Go to "Database Access"
   - Add a new user with username and password
4. **Whitelist your IP** (or allow from anywhere):
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all IPs - good for Vercel)
5. **Get your connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

### Option 2: Local MongoDB

If you have MongoDB installed locally:
```bash
# Start MongoDB
mongod

# Your connection string will be:
# mongodb://localhost:27017/redirection-logs
```

---

## ⚙️ Configure the App

### For Local Development:

Create a `.env` file in your project root:

```bash
REDIRECT_URL=https://www.google.com
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/redirection-logs?retryWrites=true&w=majority
```

Replace `username`, `password`, and `cluster` with your actual MongoDB credentials.

### For Vercel (Production):

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: **redirection-app**
3. Go to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Production, Preview, Development (select all)
5. **Redeploy** your app for changes to take effect

---

## 📊 View Logs

### Method 1: MongoDB Atlas Dashboard (Best for Analysis)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Click on your cluster → **Browse Collections**
3. Select database: `redirection-logs`
4. Select collection: `visitor-logs`
5. You'll see all visitor logs with:
   - IP address
   - Location (latitude, longitude, or status)
   - Timestamp
   - User Agent
   - Redirect URL

### Method 2: API Endpoint (Programmatic Access)

Your app now has a `/api/logs` endpoint to retrieve logs:

```bash
# Get last 100 logs (default)
curl https://redirection-app-pink.vercel.app/api/logs

# Get last 50 logs
curl https://redirection-app-pink.vercel.app/api/logs?limit=50

# Or visit in browser:
# https://redirection-app-pink.vercel.app/api/logs
```

Response format:
```json
{
  "count": 100,
  "logs": [
    {
      "_id": "...",
      "ip": "123.45.67.89",
      "timestamp": "2026-02-17T04:43:21.123Z",
      "userAgent": "Mozilla/5.0...",
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "accuracy": 50
      },
      "redirectUrl": "https://www.google.com"
    }
  ]
}
```

### Method 3: Vercel Console (Real-time Debugging)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: **redirection-app**
3. Click on the **"Logs"** tab
4. You'll see real-time console logs like:
   ```
   🔍 IP: 123.45.67.89 | Location: 37.7749, -122.4194
   ↪️  Redirecting to: https://www.google.com
   💾 Log saved to MongoDB
   ```

### Method 4: MongoDB Compass (Desktop App)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your `MONGODB_URI`
3. Navigate to `redirection-logs` → `visitor-logs`
4. View, filter, and analyze logs with a GUI

---

## 📝 Log Data Structure

Each log entry contains:

```javascript
{
  ip: "123.45.67.89",
  timestamp: ISODate("2026-02-17T04:43:21.123Z"),
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  location: {
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 50
  },
  // OR if location denied:
  location: {
    status: "DENIED"
  },
  // OR if location not available:
  location: {
    status: "NOT_AVAILABLE"
  },
  redirectUrl: "https://www.google.com"
}
```

---

## 🔍 Query Examples (MongoDB)

Using MongoDB Compass or the mongo shell:

```javascript
// Find all logs from a specific IP
db['visitor-logs'].find({ ip: "123.45.67.89" })

// Find all logs where location was denied
db['visitor-logs'].find({ "location.status": "DENIED" })

// Find logs from the last 24 hours
db['visitor-logs'].find({
  timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) }
})

// Count total visitors
db['visitor-logs'].countDocuments()

// Get unique IPs
db['visitor-logs'].distinct("ip")
```

---

## ⚡ Quick Commands

```bash
# Run locally with MongoDB
npm start

# Deploy to Vercel (don't forget to set MONGODB_URI in Vercel settings)
git add .
git commit -m "Add MongoDB logging"
git push origin main

# View logs via API
curl https://redirection-app-pink.vercel.app/api/logs
```

---

## 🎯 Your Live App

**Production URL**: https://redirection-app-pink.vercel.app

Every visitor's data is now:
- ✅ Stored persistently in MongoDB
- ✅ Logged to console for debugging
- ✅ Accessible via `/api/logs` endpoint
- ✅ Queryable and analyzable

---

## 🚨 Troubleshooting

### Logs not appearing in MongoDB?

1. Check if `MONGODB_URI` is set correctly
2. Check Vercel logs for connection errors
3. Verify MongoDB Network Access allows your IP/Vercel
4. Ensure database user has write permissions

### App works but no MongoDB connection?

The app will work fine without MongoDB - logs will just appear in console only. You'll see:
```
⚠️  MONGODB_URI not set - logs will only appear in console
```

Set the `MONGODB_URI` environment variable to enable persistent logging.

