// netlify/functions/sigmet-awc.js

export default async (req, res) => {
  try {
    const url = `https://aviationweather.gov/api/data/sigmet`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const textData = await response.text();

    return res.status(200).json({ rawSigmet: textData });
  } catch (error) {
    console.error("SIGMET AWC Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch SIGMET from AWC" });
  }
};
