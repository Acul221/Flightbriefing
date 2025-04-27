// netlify/functions/sigmet-awc.js

export default async (req, res) => {
  try {
    const url = `https://aviationweather.gov/api/data/sigmet`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const textData = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ rawSigmet: textData }),
    };
  } catch (error) {
    console.error("SIGMET AWC Fetch Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch SIGMET from AWC" }),
    };
  }
};
