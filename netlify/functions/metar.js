// netlify/functions/metar.js
export default async function handler(req, res) {
  const { icao } = req.query;
  const avwxKey = process.env.AVWX_API_KEY;

  if (!icao || !avwxKey) {
    return res.status(400).json({ error: "Missing ICAO code or AVWX API key" });
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
      return res.status(response.status).json({ error: errorData.error || "Failed to fetch METAR" });
    }

    const data = await response.json();
    res.status(200).json(data.raw || data); // Kalau ada raw METAR, kirim raw, kalau tidak, kirim seluruh data
  } catch (error) {
    console.error("METAR Proxy Error:", error);
    res.status(500).json({ error: "Server error fetching METAR" });
  }
}
