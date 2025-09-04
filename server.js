import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.send("OK"));

app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY missing" });

    const { model = "gpt-4o-mini", messages = [], temperature = 0.3 } = req.body || {};

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model, messages, temperature })
    });

    const text = await r.text();
    res.status(r.status).type("application/json").send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Proxy up on port", PORT));
