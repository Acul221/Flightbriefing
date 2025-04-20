// netlify/functions/notam.js

export async function handler(event, context) {
  const token = "NJguHgtYtFHNznXNQ8S_dmFK2re90L4M12Y4DAert2c"; // Ganti kalau perlu
  const icao = event.queryStringParameters.icao?.toUpperCase();

  if (!icao) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ICAO parameter" }),
    };
  }

  try {
    const response = await fetch(`https://avwx.rest/api/notam/${icao}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `AVWX request failed: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
headers: {
  Authorization: `Bearer ${AVWX_TOKEN}`,
  'Cache-Control': 'no-cache',
}
url = `/.netlify/functions/notam?icao=${icao}&t=${Date.now()}`;

