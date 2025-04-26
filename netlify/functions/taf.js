export default async function handler(req, res) {
  const { icao } = req.query;

  try {
    const response = await fetch(`https://avwx.rest/api/taf/${icao}`, {
      headers: {
        Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        Accept: "application/json"
      }
    });
    const data = await response.json();
    res.status(200).json(data.sanitized || "Unable to fetch weather data");
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TAF" });
  }
}
