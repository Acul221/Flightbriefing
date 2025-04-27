export default async function handler(event) {
  const { icao } = event.queryStringParameters || {};

  if (!icao) {
    return new Response(JSON.stringify({ error: "Missing ICAO code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const response = await fetch(`https://aviationweather.gov/cgi-bin/data/sigmet.php?icao=${icao}`);
    const rawSigmet = await response.text();

    return new Response(JSON.stringify({ rawSigmet }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("SIGMET AWC Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch SIGMET from AWC" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
