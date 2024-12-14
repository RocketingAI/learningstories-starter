async function get_current_weather({ lat, lon }) {
    console.group('Function Called: get_current_weather()');
    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
    const apiKey = apikey_openWeather;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
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

const function_get_current_weather = {
    type: "function",
    function: {
        name: "get_current_weather",
        description: "Get the current weather using latitude and longitude",
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
    },
};

export { get_current_weather, function_get_current_weather };