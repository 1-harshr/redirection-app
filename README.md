# Redirection App with IP & Location Logging

A simple Node.js application that requests location permission, logs visitor IP addresses and geolocation data, then redirects them to a specified website.

## Features

- 🚫 **No UI**: Completely invisible - uses browser's native location permission popup
- 📍 **Auto Location Request**: Automatically requests location on page load
- 🔍 **IP Logging**: Captures and logs visitor IP addresses
- 🌍 **Geolocation Logging**: Records latitude and longitude when permitted
- ↪️ **Smart Redirect**: Redirects to configured URL after logging (only if location allowed)
- 🔒 **Auto Close**: Automatically closes tab if location is denied
- 📝 **Simple Logs**: Records only IP and location data
- ⚙️ **Configurable**: Easy to change redirect URL via environment variable

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage (redirects to Google by default)
```bash
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

### Both Custom URL and Port
```bash
REDIRECT_URL=https://example.com PORT=8080 npm start
```

## Configuration

You can create a `.env` file (copy from `.env.example`) to set default values:

```bash
cp .env.example .env
```

Then edit `.env` to set your preferred redirect URL and port.

## Log File

All IP addresses and location data are logged to `ip-logs.txt` in a simple format:

**When location is allowed:**
```
IP: 192.168.1.1 | Location: 37.7749, -122.4194
```

**When location is denied:**
```
IP: 192.168.1.1 | Location: DENIED
```

## How It Works

1. User visits your app URL (e.g., `http://localhost:3000`)
2. Browser's **native location permission popup** appears automatically (no custom UI)
3. **If user allows**: App captures IP + location → Logs it → Redirects to configured URL
4. **If user denies**: App logs IP with "DENIED" → Automatically closes the tab
5. All data is saved to `ip-logs.txt`

## Deployment

This app can be deployed to:
- **Heroku**: `git push heroku main`
- **Vercel**: `vercel deploy`
- **Railway**: Connect your GitHub repo
- **Any VPS**: Run with PM2 or systemd

## Security Notes

- IP addresses are considered personal data in many jurisdictions
- Ensure you comply with privacy laws (GDPR, CCPA, etc.)
- Consider adding a privacy notice
- Secure your log files appropriately

## License

ISC
# redirection-app
