// Vercel serverless function — lives at /api/chat.js in the project root.
// Vercel automatically turns any file under /api into a live endpoint at
// https://yourproject.vercel.app/api/chat — no Express, no separate server needed.
//
// The Groq key is read from process.env.GROQ_API_KEY, which you set in the
// Vercel dashboard (Project → Settings → Environment Variables), NOT in a
// .env file that gets committed. It never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set in Vercel's Environment Variables" });
  }

  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      for await (const chunk of upstream.body) {
        res.write(chunk);
      }
      return res.end();
    }

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
}