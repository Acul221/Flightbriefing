// netlify/functions/metar.js
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
    const response = await fetch(`https://avwx.rest/api/metar/${icao}`, {
      headers: {
        Authorization: `Bearer ${avwxKey}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error || "Failed to fetch METAR" })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data.raw || data)
    };
  } catch (error) {
    console.error("METAR Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error fetching METAR" })
    };
  }
}
