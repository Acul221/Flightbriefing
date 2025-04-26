export default async function handler(req, res) {
  const { icao } = req.query;

  if (!icao) {
    return res.status(400).json({ error: "ICAO code is required." });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/sigmet/${icao}`, {
      headers: {
        Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json(data.map(item => item.raw).join("\n"));
    } else {
      res.status(200).json("No SIGMETs reported.");
    }
  } catch (error) {
    console.error("SIGMET Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch SIGMET data." });
  }
}
