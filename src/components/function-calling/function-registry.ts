import { addFunction } from './function-loader';

// Import all functions
import { get_current_weather, function_get_current_weather } from './tools/getCurrentWeather';
import { get_coordinates, function_get_coordinates } from './tools/getCoordinates';
import { get_current_weather_from_city, function_get_current_weather_from_city } from './tools/getCurrentWeatherFromCity';
import { getWebsiteURLs, function_getWebsiteURLs } from './tools/getWebsiteURLs';
import { scrapeTextFromURL, function_scrapeTextFromURL } from './tools/scrapeTextFromURL';
import { summarize_results, function_summarize_results } from './tools/summarizeResults';

// Register all functions
addFunction({
  functionImplementation: get_current_weather,
  functionJSON: function_get_current_weather,
});

addFunction({
  functionImplementation: get_coordinates,
  functionJSON: function_get_coordinates,
});

addFunction({
  functionImplementation: get_current_weather_from_city,
  functionJSON: function_get_current_weather_from_city,
});

addFunction({
  functionImplementation: getWebsiteURLs,
  functionJSON: function_getWebsiteURLs,
});

addFunction({
  functionImplementation: scrapeTextFromURL,
  functionJSON: function_scrapeTextFromURL,
});

addFunction({
  functionImplementation: summarize_results,
  functionJSON: function_summarize_results,
});

// Template for adding new functions
// import { new_function, function_new_function } from './tools/newFunction';
// addFunction({ functionImplementation: new_function, functionJSON: function_new_function });
