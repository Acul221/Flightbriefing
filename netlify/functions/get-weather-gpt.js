export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { narrative } = body;
    const openaiKey = process.env.GPT_API_KEY;

    if (!narrative || !openaiKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing narrative text or GPT API Key" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an aviation weather analyst. Summarize and analyze the provided weather briefing for a pilot in clear and concise English."
          },
          {
            role: "user",
            content: narrative
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    const analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis.";

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis })
    };
  } catch (error) {
    console.error("GPT Reasoning Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch AI reasoning" })
    };
  }
}
