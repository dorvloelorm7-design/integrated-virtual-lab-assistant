# LabMate · Integrated Virtual Lab Assistant

![LabMate VR Lab banner](./docs/banner.png)

A browser-based **WebVR electronics physics lab** built with [A-Frame](https://aframe.io/). Walk through a 3D lab, interact with instrument stations, get step-by-step guidance from a **Claude-powered AI assistant**, and receive **proximity-based safety alerts** as you move around hazardous areas.

**Live demo:** [lab-mate-khaki.vercel.app](https://lab-mate-khaki.vercel.app/) · **VR lab (this repo):** open `index.html` locally or via a static server

---

## Features

| Feature | Description |
|--------|-------------|
| **3D lab environment** | Explore a furnished electronics lab (`67.glb`) with benches, oscilloscope, power supply, and measurement tools |
| **Station-based AI** | Four proximity zones — each station has its own topic and system prompt (oscilloscope, power supply/generator, measurement bench, workbench) |
| **Voice & text chat** | Ask questions by voice (Chrome/Edge) or text; optional text-to-speech for replies |
| **Safety HUD** | Hazard zones trigger on-screen warnings, audio beeps, and an incident log (electrical, trip, ESD) |
| **Collision system** | Raycast-based movement so you cannot walk through walls or furniture |
| **VR support** | Enter VR with hand controllers; use the right trigger for voice near a station |

---

## Tech stack

- **Frontend:** A-Frame 1.6, aframe-extras, Marked (markdown rendering)
- **Backend:** Node.js (`server.js`) locally, Vercel serverless (`api/chat.js`) when deployed
- **AI:** Anthropic Claude (`claude-opus-4-8`) via `@anthropic-ai/sdk`
- **Assets:** GLB 3D model, SVG favicon/branding

---

## Project structure

```
.
├── index.html       # Full VR lab app (scene, UI, safety system, chat)
├── server.js        # Local chat API (POST /chat)
├── api/chat.js      # Vercel serverless chat endpoint
├── 67.glb           # 3D lab model
├── favicon.svg      # LabMate robot icon
├── docs/
│   └── banner.png
└── package.json
```

---

## Requirements

- **Node.js** 20.12 or newer
- **Browser:** Chrome or Edge recommended (voice input uses the Web Speech API)
- **Anthropic API key** for the AI assistant ([console.anthropic.com](https://console.anthropic.com))

---

## Quick start (local)

The assistant needs the Node backend running so the browser can reach Claude.

### 1. Install dependencies

```sh
npm install
```

### 2. Set your API key

**Option A — environment variable (PowerShell)**

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

**Option B — environment variable (bash / Git Bash)**

```sh
export ANTHROPIC_API_KEY="sk-ant-..."
```

**Option C — `.env` file** (gitignored)

```env
ANTHROPIC_API_KEY=sk-ant-...
```

`server.js` loads `.env` automatically via Node’s built-in `process.loadEnvFile()`.

### 3. Start the backend

```sh
npm start
```

You should see:

```
Lab assistant server running at http://localhost:3000
```

### 4. Open the lab

Serve the frontend over HTTP (recommended — avoids issues loading the 3D model):

```sh
npx serve -l 8080 .
```

Then open **http://localhost:8080** while the backend keeps running on port **3000**.

Alternatively, open `index.html` directly in Chrome or Edge. The app detects localhost and sends chat requests to `http://localhost:3000/chat`.

---

## Controls

| Input | Action |
|-------|--------|
| **WASD / Arrow keys** | Move |
| **Mouse** | Look around |
| **Walk near a station** | Shows proximity prompt |
| **E** | Open chat at the nearest station |
| **Voice / Text buttons** | Talk to the assistant from anywhere |
| **V** | Toggle voice recording |
| **Space** | Stop voice recording |
| **Escape** | Close chat overlay |

### VR

- Enter VR from the browser’s VR button (headset required)
- Walk near a station, then use the **right trigger** for voice input
- A 3D HUD panel shows responses inside the headset

---

## Lab stations

| Station | Focus |
|---------|--------|
| Oscilloscope | Waveforms, timebase, triggering, probe compensation |
| Power supply & generator | Voltage/current limits, waveforms, safe output use |
| Measurement bench | Multimeter use, ranges, calibration |
| Workbench | General circuits, components, soldering, lab safety |

Each station only answers **electronics physics lab** questions; off-topic requests are politely declined.

---

## Safety system

Invisible hazard zones are anchored to real equipment in the 3D model:

- **Oscilloscope** — high-voltage probe inputs (caution)
- **Bench power supply** — live output terminals (danger)
- **Loose cables** — trip/snag hazard (caution)
- **ESD-sensitive bench** — static-sensitive components (info)

When you enter an outer or inner radius, the HUD shows severity, distance, and logs the event.

---

## Deployment

### Frontend + API on Vercel

- Static files (`index.html`, `67.glb`, etc.) are served as the site root
- `api/chat.js` is exposed at `/api/chat`
- Set **`ANTHROPIC_API_KEY`** in the Vercel project environment variables

When not on localhost, `index.html` automatically uses `/api/chat` instead of `http://localhost:3000/chat`.

### Backend elsewhere (Render, Railway, etc.)

- Run `node server.js` (respects the `PORT` env var)
- Set `ANTHROPIC_API_KEY`
- CORS is open (`*`) for local `index.html` usage

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| *"Could not reach the server."* | Run `npm start` and keep the terminal open |
| API errors / 500 responses | Check `ANTHROPIC_API_KEY` is set; read the server console |
| Voice not working | Use Chrome or Edge; allow microphone access for the site |
| Model not loading | Serve files over HTTP; ensure `67.glb` is in the project root |
| Chat works locally but not deployed | Add `ANTHROPIC_API_KEY` on Vercel |

---

## Configuration

| Setting | Location | Default |
|---------|----------|---------|
| Claude model | `server.js`, `api/chat.js` | `claude-opus-4-8` |
| Server port | `server.js` (`PORT` env) | `3000` |
| Movement speed | `index.html` (`movement-controls`) | `0.09` |

---

## License

See repository license terms. Third-party libraries include A-Frame, aframe-extras, Marked, and the Anthropic SDK.
