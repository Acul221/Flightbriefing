// netlify/functions/taf.js
export default async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const icao = url.searchParams.get('icao');
  const apiKey = process.env.AVWX_API_KEY;

  if (!icao || !apiKey) {
    return res.status(400).json({ error: "Missing ICAO or API Key" });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/taf/${icao}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();
    res.status(200).json(data.raw || "No TAF data available");
  } catch (error) {
    console.error("TAF Function Error:", error);
    res.status(500).json({ error: "Failed to fetch TAF" });
  }
}
