const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration: Set your redirect URL here
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://www.google.com';

// Log file path
const LOG_FILE = path.join(__dirname, 'ip-logs.txt');

// Middleware to log IP addresses
function logIPAddress(req, res, next) {
  // Get IP address (handles proxies and direct connections)
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  const timestamp = new Date().toISOString();
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const referer = req.headers['referer'] || 'Direct';
  
  // Create log entry
  const logEntry = `[${timestamp}] IP: ${ip} | User-Agent: ${userAgent} | Referer: ${referer}\n`;
  
  // Log to console
  console.log(`🔍 Visitor detected - IP: ${ip}`);
  
  // Append to log file
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  
  next();
}

// Apply logging middleware to all routes
app.use(logIPAddress);

// Main redirect route - catches all paths
app.get('*', (req, res) => {
  console.log(`↪️  Redirecting to: ${REDIRECT_URL}`);
  res.redirect(301, REDIRECT_URL);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Redirection app running on port ${PORT}`);
  console.log(`📍 Redirecting all traffic to: ${REDIRECT_URL}`);
  console.log(`📝 Logging IPs to: ${LOG_FILE}`);
  console.log(`\n💡 To change redirect URL, set REDIRECT_URL environment variable`);
  console.log(`   Example: REDIRECT_URL=https://example.com npm start\n`);
});
