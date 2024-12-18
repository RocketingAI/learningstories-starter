import { functionLoader } from '../function-loader';

const getCurrentWeather = async ({ lat, lon }: { lat: number; lon: number }) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenWeather API key not found');
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.ok) {
      return {
        description: data.weather[0].description,
        temperature: data.main.temp,
        humidity: data.main.humidity,
      };
    } else {
      throw new Error(`Failed to retrieve weather data: ${data.message}`);
    }
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

// Register the function with our loader
functionLoader.registerFunction({
  name: "get_current_weather",
  description: "Get the current weather using latitude and longitude coordinates",
  parameters: {
    type: "object",
    properties: {
      lat: {
        type: "number",
        description: "The latitude of the location",
      },
      lon: {
        type: "number",
        description: "The longitude of the location",
      },
    },
    required: ["lat", "lon"],
  },
  implementation: getCurrentWeather,
});
