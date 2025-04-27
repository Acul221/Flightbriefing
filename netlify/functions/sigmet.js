export async function handler(event, context) {
  const url = new URL(event.rawUrl);
  const icao = url.searchParams.get('icao');
  const apiKey = process.env.AVWX_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing API Key" })
    };
  }

  try {
    const response = await fetch(`https://avwx.rest/api/sigmet`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();

    // Filter berdasarkan ICAO di dalam SIGMET text (sederhana)
    const matchingSigmet = data.find(sigmet => sigmet.raw.includes(icao)) || null;

    return {
      statusCode: 200,
      body: JSON.stringify(matchingSigmet ? matchingSigmet.raw : "No SIGMET found for " + icao)
    };
  } catch (error) {
    console.error("SIGMET Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch SIGMET" })
    };
  }
}
