// netlify/functions/sigmet-awc.js

export default async (req) => {
  try {
    const url = `https://aviationweather.gov/api/data/sigmet`;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const textData = await response.text();

    return new Response(
      JSON.stringify({ rawSigmet: textData }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("SIGMET AWC Fetch Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch SIGMET from AWC" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
