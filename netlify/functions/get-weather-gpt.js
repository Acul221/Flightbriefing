export default async (req, res) => {
  try {
    const { narrative } = JSON.parse(req.body || '{}');
    const gptApiKey = process.env.GPT_API_KEY;

    // Check for GPT_API_KEY
    if (!gptApiKey) {
      console.error("GPT_API_KEY is not set in environment variables.");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // Validate input
    if (!narrative || typeof narrative !== 'string') {
      return res.status(400).json({ error: "Invalid or missing narrative field." });
    }

    // Timeout mechanism
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Error communicating with OpenAI API",
      });
    }

    return res.status(200).json({
      analysis: data.choices?.[0]?.message?.content || "No reasoning available.",
    });
  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Request timed out");
      return res.status(504).json({ error: "Request to OpenAI API timed out" });
    }

    console.error(`[${new Date().toISOString()}] GPT Function Error:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
};