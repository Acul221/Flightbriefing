export default async function handler(req, res) {
  const { icao } = req.query;

  if (!icao) {
    return res.status(400).json({ error: "ICAO code is required." });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/metar/${icao}`, {
      headers: {
        Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();
    res.status(200).json(data.sanitized || data.raw || "No METAR data available.");
  } catch (error) {
    console.error("METAR Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch METAR data." });
  }
};
