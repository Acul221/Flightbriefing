// netlify/functions/metar.js
export default async function handler(req, res) {
  const { icao } = req.query;
  const apiKey = process.env.AVWX_API_KEY;

  if (!icao || !apiKey) {
    return res.status(400).json({ error: "Missing ICAO code or API key" });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/metar/${icao}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    res.status(200).json(data.sanitized || data.raw || "Unable to fetch data");
  } catch (error) {
    console.error("METAR Function Error:", error);
    res.status(500).json({ error: "Failed to fetch METAR" });
  }
}