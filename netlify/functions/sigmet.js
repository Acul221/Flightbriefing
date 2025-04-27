// netlify/functions/sigmet.js
export async function handler(event, context) {
  const { icao } = event.queryStringParameters || {};
  const avwxKey = process.env.AVWX_API_KEY;

  if (!icao || !avwxKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ICAO code or AVWX API key" })
    };
  }

  try {
    const response = await fetch(`https://avwx.rest/api/sigmet/${icao}`, {
      headers: {
        Authorization: `Bearer ${avwxKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error || "Failed to fetch SIGMET" })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data || {})
    };
  } catch (error) {
    console.error("SIGMET Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error fetching SIGMET" })
    };
  }
}
