// Minimal backend for the VR Lab assistant.
// Receives { message, systemPrompt } from index.html and returns { reply }.
// Run with:  node server.js   (after `npm install` and setting ANTHROPIC_API_KEY)

const http = require("http");

// Load variables from the .env file into process.env (no extra dependency needed).
// process.loadEnvFile is available in Node 20.12+ / 21.7+.
try {
  process.loadEnvFile();
} catch {
  // No .env file present, or older Node — fall back to existing environment.
}

const Anthropic = require("@anthropic-ai/sdk");

const PORT = 3000;
const MODEL = "claude-opus-4-8";

// Reads the key from the ANTHROPIC_API_KEY environment variable.
const client = new Anthropic();

const DEFAULT_SYSTEM =
  "You are the Virtual Lab Assistant: a conversational AI assistant inside an " +
  "ELECTRONICS PHYSICS virtual lab. You guide users through step-by-step " +
  "procedures, safety checks, and calibration tasks via voice and chat. " +
  "STRICT SCOPE: only answer electronics physics lab questions (circuits, " +
  "components, instruments, measurement, calibration, and electrical lab safety). " +
  "If a question is NOT part of the electronics physics lab, do NOT answer it — " +
  "politely decline and steer the user back to the lab. Keep answers concise and " +
  "educational, using numbered steps for any procedure.";

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    // Allow the browser-served index.html to call this local server.
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method !== "POST" || req.url !== "/chat") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    // Guard against oversized payloads (~1MB).
    if (raw.length > 1_000_000) req.destroy();
  });

  req.on("end", async () => {
    let message, systemPrompt;
    try {
      ({ message, systemPrompt } = JSON.parse(raw));
    } catch {
      sendJson(res, 400, { error: "Invalid JSON body" });
      return;
    }

    if (!message || typeof message !== "string") {
      sendJson(res, 400, { error: "Missing 'message'" });
      return;
    }

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt || DEFAULT_SYSTEM,
        messages: [{ role: "user", content: message }],
      });

      const reply = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n")
        .trim();

      sendJson(res, 200, { reply: reply || "(no response)" });
    } catch (err) {
      console.error("Claude API error:", err.message);
      sendJson(res, 500, {
        reply: "⚠️ The assistant ran into an error reaching Claude. Check the server console.",
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Lab assistant server running at http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      "⚠️  ANTHROPIC_API_KEY is not set — requests will fail. " +
        "Set it before sending messages."
    );
  }
});
