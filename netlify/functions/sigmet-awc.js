// netlify/functions/sigmet-awc.js

export default async (req, res) => {
  const { icao } = req.query;

  if (!icao) {
    return res.status(400).json({ error: "Missing ICAO code" });
  }

  try {
    const url = `https://aviationweather.gov/api/data/sigmet`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const textData = await response.text();

    // AWC data biasanya berupa XML. Untuk sekarang kita kirim raw text.
    res.status(200).json({ rawSigmet: textData });
  } catch (error) {
    console.error("SIGMET AWC Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch SIGMET from AWC" });
  }
};
