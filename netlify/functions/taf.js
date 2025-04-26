// netlify/functions/taf.js
export default async function handler(req, res) {
  const { icao } = req.query;
  const avwxKey = process.env.AVWX_API_KEY;

  if (!icao || !avwxKey) {
    return res.status(400).json({ error: "Missing ICAO code or API key" });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/taf/${icao}`, {
      headers: {
        Authorization: `Bearer ${avwxKey}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    res.status(200).json(data.sanitized || data.raw || "No TAF data available");
  } catch (error) {
    console.error("TAF Function Error:", error);
    res.status(500).json({ error: "Failed to fetch TAF" });
  }
}
