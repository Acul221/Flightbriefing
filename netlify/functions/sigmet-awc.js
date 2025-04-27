// netlify/functions/sigmet-awc.js

export async function handler(event, context) {
  const params = new URLSearchParams(event.queryStringParameters);
  const icao = params.get("icao");

  if (!icao) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ICAO code" })
    };
  }

  try {
    const response = await fetch("https://aviationweather.gov/api/data/sigmet", {
      headers: { "Accept": "application/json" }
    });

    const data = await response.json();

    const filteredSigmets = data.features.filter(sigmet => {
      const location = sigmet.properties?.fir?.toUpperCase() || "";
      return location.includes(icao.substring(0, 2)); // Filter pakai 2 huruf awal
    });

    if (filteredSigmets.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify("No SIGMETs found for this region.")
      };
    }

    const result = filteredSigmets.map(sigmet => sigmet.properties.rawSigmet).join("\n\n");

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("SIGMET AWC Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch SIGMET from AWC" })
    };
  }
}
