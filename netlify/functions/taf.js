export async function handler(event, context) {
  const url = new URL(event.rawUrl);
  const icao = url.searchParams.get('icao');
  const apiKey = process.env.AVWX_API_KEY;

  if (!icao || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ICAO or API Key" })
    };
  }

  try {
    const response = await fetch(`https://avwx.rest/api/taf/${icao}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data.raw || "No TAF data available")
    };
  } catch (error) {
    console.error("TAF Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch TAF" })
    };
  }
}
