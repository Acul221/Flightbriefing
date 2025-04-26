// netlify/functions/sigmet.js
export default async function handler(req, res) {
  const { icao } = req.query;
  const apiKey = process.env.AVWX_API_KEY;

  if (!icao || !apiKey) {
    return res.status(400).json({ error: "Missing ICAO code or API key" });
  }

  try {
    const response = await fetch(`https://avwx.rest/api/sigmet/${icao}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      res.status(200).json(data.map(sig => sig.raw).join('\n\n'));
    } else {
      res.status(200).json("No active SIGMETs.");
    }
  } catch (error) {
    console.error("SIGMET Function Error:", error);
    res.status(500).json({ error: "Failed to fetch SIGMET" });
  }
}