# Redirection App with IP Logging

A simple Node.js application that logs visitor IP addresses and redirects them to a specified website.

## Features

- 🔍 **IP Logging**: Captures and logs visitor IP addresses
- ↪️ **Instant Redirect**: Immediately redirects to configured URL
- 📝 **Detailed Logs**: Records timestamp, IP, user agent, and referer
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

All IP addresses are logged to `ip-logs.txt` in the following format:

```
[2026-02-16T16:06:54.123Z] IP: 192.168.1.1 | User-Agent: Mozilla/5.0... | Referer: Direct
```

## How It Works

1. User visits your app URL (e.g., `http://localhost:3000`)
2. App captures their IP address and logs it
3. App immediately redirects them to the configured URL
4. User sees the target website, unaware of the logging

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
