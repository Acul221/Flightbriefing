export default async function handler(req, res) {
  const { icao } = req.query;

  if (!icao) {
    return res.status(400).json({ error: "ICAO code is required." });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/taf/${icao}`, {
      headers: {
        Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();
    res.status(200).json(data.sanitized || "No TAF data available.");
  } catch (error) {
    console.error("TAF Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch TAF data." });
  }
}
