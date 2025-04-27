// netlify/functions/sigmet-awc.js
export default async function handler(req, res) {
  const { icao } = req.query;

  if (!icao) {
    return res.status(400).json({ error: "Missing ICAO code" });
  }

  try {
    // Fetch SIGMETs data from Aviation Weather Center (AWC) GeoJSON feed
    const response = await fetch("https://aviationweather.gov/api/data/sigmet", {
      headers: {
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    // Filter SIGMETs relevant to the requested ICAO region
    const filteredSigmets = data.features.filter(sigmet => {
      const location = sigmet.properties?.fir?.toUpperCase() || "";
      return location.includes(icao.substring(0, 2)); // Match by first two letters (region)
    });

    if (filteredSigmets.length === 0) {
      return res.status(200).json("No SIGMETs found for this region.");
    }

    // Prepare summary text
    const result = filteredSigmets.map(sigmet => {
      return `${sigmet.properties.rawSigmet}`;
    }).join("\n\n");

    return res.status(200).json(result);

  } catch (error) {
    console.error("SIGMET AWC Error:", error);
    return res.status(500).json({ error: "Failed to fetch SIGMET from AWC" });
  }
}
