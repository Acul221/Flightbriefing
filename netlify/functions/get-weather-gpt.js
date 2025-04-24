// netlify/functions/get-weather-gpt.js

export default async (req, res) => {
  try {
    const { narrative } = JSON.parse(req.body || '{}');
    const gptApiKey = process.env.GPT_API_KEY;

    if (!gptApiKey) {
      return res.status(500).json({ error: "Missing GPT_API_KEY in environment" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gptApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an aviation weather assistant. Provide a clear and helpful weather briefing based on the following info.",
          },
          {
            role: "user",
            content: narrative,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({
      analysis: data.choices?.[0]?.message?.content || "No reasoning available.",
    });
  } catch (error) {
    console.error("GPT Function Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
