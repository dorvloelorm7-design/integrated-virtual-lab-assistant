// Vercel serverless function for the virtual lab assistant.
// Deployed automatically by Vercel at the path /api/chat.
// Requires the ANTHROPIC_API_KEY environment variable (set it in the Vercel dashboard).
// Local development still uses server.js on localhost:3000 instead of this file.

const Anthropic = require("@anthropic-ai/sdk");

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

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Vercel parses JSON bodies automatically, but fall back to manual parsing.
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { message, systemPrompt } = body || {};

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Missing 'message'" });
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

    res.status(200).json({ reply: reply || "(no response)" });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({
      reply:
        "⚠️ The assistant ran into an error reaching Claude. Check the server logs.",
    });
  }
};
