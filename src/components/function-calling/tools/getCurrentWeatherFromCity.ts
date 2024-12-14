interface WeatherFromCityArgs {
  location: string;
  unit?: 'celsius' | 'fahrenheit';
}

async function get_current_weather_from_city({ location, unit = 'fahrenheit' }: WeatherFromCityArgs) {
  console.group('Function Called: get_current_weather_from_city()');
  console.log(`Fetching weather for: ${location}`);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit === 'celsius' ? 'metric' : 'imperial'}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.ok) {
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      console.groupEnd();
      return { description: weatherDescription, temperature, humidity };
    } else {
      console.groupEnd();
      return `Failed to retrieve weather data: ${data.message}`;
    }
  } catch (error) {
    console.groupEnd();
    return `Error fetching weather data: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}

const function_get_current_weather_from_city = {
  type: "function" as const,
  function: {
    name: "get_current_weather_from_city",
    description: "Get the current weather in a given city",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city, e.g. San Francisco or New York",
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
          description: "Temperature unit (defaults to fahrenheit if not specified)",
        },
      },
      required: ["location"],
    },
  },
};

export { get_current_weather_from_city, function_get_current_weather_from_city };
