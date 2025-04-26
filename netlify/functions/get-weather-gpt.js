// netlify/functions/get-weather-gpt.js
export default async function handler(req, res) {
  const { narrative } = JSON.parse(req.body || '{}');
  const gptKey = process.env.GPT_API_KEY;

  if (!gptKey) {
    return res.status(500).json({ error: "GPT_API_KEY is not set" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gptKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an aviation weather assistant. Provide a human-readable weather summary." },
          { role: "user", content: narrative }
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("GPT API Error:", data);
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json({ analysis: data.choices?.[0]?.message?.content || "No analysis returned" });
  } catch (error) {
    console.error("GPT Function Error:", error);
    res.status(500).json({ error: "Failed to generate analysis" });
  }
}