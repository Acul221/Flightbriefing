export async function handler(event, context) {
  const { lat, lon } = event.queryStringParameters;
  const openWeatherKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!lat || !lon || !openWeatherKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing latitude, longitude, or API key" }),
    };
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        temp: data.main.temp,
        clouds: data.weather?.[0]?.description || "Unknown",
        windSpeed: data.wind?.speed,
        windDeg: data.wind?.deg,
        pressure: data.main.pressure,
        visibility: data.visibility,
      }),
    };
  } catch (error) {
    console.error("Current Weather Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch current weather" }),
    };
  }
}
