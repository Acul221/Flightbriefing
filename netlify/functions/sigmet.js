export default async function handler(req, res) {
  const { icao } = req.query;

  try {
    const response = await fetch(`https://avwx.rest/api/sigmet/${icao}`, {
      headers: {
        Authorization: `Bearer ${process.env.AVWX_API_KEY}`,
        Accept: "application/json"
      }
    });
    const data = await response.json();
    const sigmets = data.length > 0 ? data.map(sig => `• ${sig.raw}`).join("\n") : "No SIGMETs reported.";
    res.status(200).json(sigmets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch SIGMET" });
  }
}
