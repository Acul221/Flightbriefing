// netlify/functions/sigmet-awc.js

export default async (req) => {
  const { icao } = req.query;

  if (!icao) {
    return new Response(JSON.stringify({ error: "Missing ICAO parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Fetch SIGMET data dari AWC JSON endpoint
    const response = await fetch('https://aviationweather.gov/api/data/products?prod=sigmet');

    if (!response.ok) {
      throw new Error('Failed to fetch SIGMET from AWC');
    }

    const data = await response.json();

    // Cari SIGMET yang relevan untuk ICAO yang diminta
    const matchingSigmets = data.products?.filter((item) => 
      item?.data?.includes(icao.toUpperCase())
    );

    if (!matchingSigmets || matchingSigmets.length === 0) {
      return new Response(JSON.stringify({ sigmet: "No SIGMET found for this ICAO" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ambil raw text dari SIGMET yang ditemukan
    const sigmetTexts = matchingSigmets.map((sigmet) => sigmet.data);

    return new Response(JSON.stringify({ sigmet: sigmetTexts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("SIGMET Fetch Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch SIGMET data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
