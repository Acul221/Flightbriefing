export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHERMAP_KEY}`);
    const data = await response.json();

    res.status(200).json({
      temp: data.main.temp,
      clouds: data.weather[0].description,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      pressure: data.main.pressure,
      visibility: data.visibility
    });
  } catch (error) {
    console.error("Current Weather Proxy Error:", error);
    res.status(500).json({ error: "Failed to fetch current weather." });
  }
};
