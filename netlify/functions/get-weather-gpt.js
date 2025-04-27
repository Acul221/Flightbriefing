// netlify/functions/get-weather-gpt.js
export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { narrative } = body;
    const gptApiKey = process.env.GPT_API_KEY;

    if (!gptApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GPT_API_KEY not defined" })
      };
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
            content: "You are an aviation weather assistant. Provide a clear, concise weather analysis for pilots.",
          },
          {
            role: "user",
            content: narrative,
          },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error?.message || "Failed to get response from OpenAI" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: data.choices?.[0]?.message?.content || "No analysis generated." }),
    };
  } catch (error) {
    console.error("get-weather-gpt function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
