# Redirection App with IP & Location Logging

A simple Node.js application that requests location permission, logs visitor IP addresses and geolocation data to MongoDB, then redirects them to a specified website.

## Features

- 🚫 **No UI**: Completely invisible - uses browser's native location permission popup
- 📍 **Auto Location Request**: Automatically requests location on page load
- 🔍 **IP Logging**: Captures and logs visitor IP addresses
- 🌍 **Geolocation Logging**: Records latitude and longitude when permitted
- ↪️ **Smart Redirect**: Redirects to configured URL after logging (only if location allowed)
- 🔒 **Auto Close**: Automatically closes tab if location is denied
- 💾 **Persistent Logs**: Stores all data in MongoDB for permanent access
- 📊 **API Access**: Retrieve logs via REST API endpoint
- 📝 **Rich Data**: Logs IP, location, timestamp, and user agent
- ⚙️ **Configurable**: Easy to change redirect URL via environment variable

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB (optional but recommended):
   - See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed setup guide
   - Get a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Add your `MONGODB_URI` to `.env` file

## Usage

### Basic Usage (redirects to Google by default)
```bash
npm start
```

### With MongoDB Logging
```bash
# Create .env file with your MongoDB connection string
cp .env.example .env
# Edit .env and add your MONGODB_URI

npm start
```

### Custom Redirect URL
```bash
REDIRECT_URL=https://example.com npm start
```

### Custom Port
```bash
PORT=8080 npm start
```

### All Options
```bash
REDIRECT_URL=https://example.com PORT=8080 MONGODB_URI=your-connection-string npm start
```

## Configuration

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` to set your values:

```bash
REDIRECT_URL=https://www.google.com
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/redirection-logs?retryWrites=true&w=majority
```

**Note**: The app works without MongoDB - logs will appear in console only.

## Logging

### MongoDB (Recommended)
All visitor data is stored in MongoDB with:
- IP address
- Location (latitude, longitude, accuracy) or status (DENIED/NOT_AVAILABLE)
- Timestamp
- User agent
- Redirect URL

**Setup Guide**: See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### Console Logs
Always logged to console (visible in Vercel dashboard):
```
🔍 IP: 192.168.1.1 | Location: 37.7749, -122.4194
↪️  Redirecting to: https://www.google.com
💾 Log saved to MongoDB
```

### Viewing Logs
- **MongoDB Atlas Dashboard**: Browse collections directly
- **API Endpoint**: `GET /api/logs?limit=100`
- **MongoDB Compass**: Desktop app for querying
- **Vercel Dashboard**: Real-time console logs

**Full Guide**: See [LOGS.md](./LOGS.md)

## How It Works

1. User visits your app URL (e.g., `http://localhost:3000`)
2. Browser's **native location permission popup** appears automatically (no custom UI)
3. **If user allows**: App captures IP + location → Saves to MongoDB → Redirects to configured URL
4. **If user denies**: App logs IP with "DENIED" status → Automatically closes the tab
5. All data is accessible via MongoDB or the `/api/logs` endpoint

## API Endpoints

### GET /api/logs
Retrieve stored logs from MongoDB.

**Query Parameters:**
- `limit` (optional): Number of logs to return (default: 100)

**Example:**
```bash
curl https://your-app.vercel.app/api/logs?limit=50
```

**Response:**
```json
{
  "count": 50,
  "logs": [
    {
      "_id": "...",
      "ip": "192.168.1.1",
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

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add `MONGODB_URI` environment variable in Vercel settings
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Other Platforms
- **Heroku**: `git push heroku main` (add `MONGODB_URI` config var)
- **Railway**: Connect GitHub repo (add `MONGODB_URI` variable)
- **Any VPS**: Run with PM2 or systemd

## Documentation

- **[MONGODB_SETUP.md](./MONGODB_SETUP.md)** - Step-by-step MongoDB setup guide
- **[LOGS.md](./LOGS.md)** - How to view and query logs
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions

## Security Notes

- IP addresses and location data are personal information
- Ensure compliance with privacy laws (GDPR, CCPA, etc.)
- Secure your MongoDB credentials (never commit `.env`)
- Consider adding a privacy notice to your app
- Use MongoDB Atlas security features (IP whitelisting, strong passwords)

## License

ISC

