async function get_current_weather_from_city({ location }) {
    console.group('Function Called: get_current_weather_from_city()');
    console.log(`Fetching weather for: ${location}`);
    const apiKey = apikey_openWeather;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`;
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
        return `Error fetching weather data: ${error.message}`;
    }
}

const function_get_current_weather_from_city = {
    type: "function",
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
                },
            },
            required: ["location"],
        },
    },
};

export { get_current_weather_from_city, function_get_current_weather_from_city };