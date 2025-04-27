// netlify/functions/get-weather-gpt.js
export default async function handler(req, res) {
  try {
    const { narrative } = JSON.parse(req.body || '{}');
    const gptApiKey = process.env.GPT_API_KEY;

    if (!gptApiKey) {
      return res.status(500).json({ error: "GPT_API_KEY not defined" });
    }

    const openaiUrl = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(openaiUrl, {
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
            content: "You are an aviation weather assistant. Provide a clear, easy-to-understand weather analysis for pilots.",
          },
          {
            role: "user",
            content: narrative,
          },
        ],
        temperature: 0.4,  // Sedikit kreatif tapi tetap factual
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(500).json({ error: data.error?.message || "Failed to get response from OpenAI" });
    }

    return res.status(200).json({ analysis: data.choices?.[0]?.message?.content || "No analysis generated." });
  } catch (error) {
    console.error("get-weather-gpt function error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
