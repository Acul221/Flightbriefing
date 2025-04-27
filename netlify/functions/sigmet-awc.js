export async function handler(event) {
  const { icao } = event.queryStringParameters || {};
  
  if (!icao) {
    return new Response(JSON.stringify({ error: "Missing ICAO parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Misal ambil data dari AWC
    const response = await fetch(`https://aviationweather.gov/api/data/sigmet?icao=${icao}`);
    const data = await response.text();

    return new Response(JSON.stringify({ rawSigmet: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch SIGMET from AWC" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
