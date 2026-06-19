# Integrated Virtual Lab Assistant

A WebVR science lab (A-Frame) with an AI lab assistant powered by Claude, plus a
proximity-based safety HUD.

## Running it

The assistant needs a small backend server (`server.js`) running locally so the
browser can talk to Claude.

### 1. Install dependencies (once)

```sh
npm install
```

### 2. Set your Claude API key

Get a key from https://console.anthropic.com, then set it in your terminal:

**PowerShell**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

**bash / Git Bash**
```sh
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Start the server

```sh
npm start
```

You should see `Lab assistant server running at http://localhost:3000`.

### 4. Open the lab

Open `index.html` in Chrome or Edge (the voice features need one of those).
Walk up to a station, then use the **Voice** or **Text** buttons to talk to the
assistant.

## Notes

- The model is `claude-opus-4-8` (set in `server.js`).
- Keep the server window open while using the lab — if it's closed you'll see
  *"Could not reach the server."*
- Voice input/output works only in Chrome/Edge (Web Speech API).
