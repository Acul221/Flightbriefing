// netlify/functions/current.js
export default async function handler(req, res) {
  const { lat, lon } = req.query;
  const openWeatherKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!lat || !lon || !openWeatherKey) {
    return res.status(400).json({ error: "Missing latitude, longitude, or API key" });
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey}&units=metric`);
    const data = await response.json();
    res.status(200).json({
      temp: data.main.temp,
      clouds: data.weather?.[0]?.description || "Unknown",
      windSpeed: data.wind?.speed,
      windDeg: data.wind?.deg,
      pressure: data.main.pressure,
      visibility: data.visibility,
    });
  } catch (error) {
    console.error("Current Weather Function Error:", error);
    res.status(500).json({ error: "Failed to fetch current weather" });
  }
}
