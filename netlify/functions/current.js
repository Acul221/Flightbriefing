export default async function handler(req, res) {
  const { lat, lon } = req.query;

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_KEY}&units=metric`);
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
    res.status(500).json({ error: "Failed to fetch Current Weather" });
  }
}
