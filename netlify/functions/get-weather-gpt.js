// netlify/functions/get-weather-gpt.js
export async function handler(event, context) {
  const gptKey = process.env.GPT_API_KEY;

  if (!gptKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing GPT API key" })
    };
  }

  const body = JSON.parse(event.body || '{}');
  const { narrative } = body;

  if (!narrative) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing narrative text" })
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${gptKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Analyze this aviation weather summary and give a short natural language briefing:\n\n${narrative}` }],
        temperature: 0.3
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: data.choices?.[0]?.message?.content || "No analysis returned." })
    };
  } catch (error) {
    console.error("GPT Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch GPT analysis" })
    };
  }
}
