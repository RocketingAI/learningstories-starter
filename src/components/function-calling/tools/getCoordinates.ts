async function get_coordinates({ location }: { location: string }) {
  console.group('Function Called: get_coordinates()');
  console.log(`Fetching coordinates for: ${location}`);
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (response.ok && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      console.groupEnd();
      return { lat, lon: lng };
    } else {
      console.groupEnd();
      throw new Error(`Failed to retrieve coordinates for ${location}`);
    }
  } catch (error) {
    console.groupEnd();
    throw new Error(`Error fetching coordinates: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

const function_get_coordinates = {
  type: "function" as const,
  function: {
    name: "get_coordinates",
    description: "Get the Lat and Long coordinates of a location using the Google Maps API",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "Use the address and/or city and state, e.g. San Francisco, CA",
        },
      },
      required: ["location"],
    },
  },
};

export { get_coordinates, function_get_coordinates };
