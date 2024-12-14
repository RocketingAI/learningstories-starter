# Modular Function Integration Framework

## Overview
This project is a flexible, modular framework designed to integrate and chain various API-driven functions dynamically. While it includes specific implementations like weather data retrieval and web scraping, its true power lies in its ability to add, manage, and interconnect diverse functions seamlessly.

## Key Features
- Modular function architecture
- Dynamic function chaining
- Easy integration of new API-driven functions
- Natural language processing using OpenAI's GPT model for intelligent function orchestration
- Extensible design for adding new capabilities

## Project Structure
- `app.js`: Core application logic for function integration and chaining
- `functionLoader.js`: Utility for dynamically loading and managing functions
- Individual JavaScript files for each function (e.g., `getCurrentWeather.js`, `scrapeTextFromURL.js`)
- `newFunction.js`: Template for adding new functions to the system
- `index.html`: User interface for interacting with the system

## Adding New Functions
1. Create a new JavaScript file for your function (use `newFunction.js` as a template)
2. Implement your function logic
3. Export both the function and its JSON description
4. Import and add the function in `app.js` using the `addFunction` method

Example:
```javascript
// In newFunction.js
export const myNewFunction = async ({ param1, param2 }) => {
    // Function logic here
};

export const function_myNewFunction = {
    type: "function",
    function: {
        name: "myNewFunction",
        description: "Description of what the function does",
        parameters: {
            type: "object",
            properties: {
                param1: { type: "string", description: "Description of param1" },
                param2: { type: "number", description: "Description of param2" }
            },
            required: ["param1", "param2"]
        }
    }
};

// In app.js
import { myNewFunction, function_myNewFunction } from './newFunction.js';
addFunction({ functionImplementation: myNewFunction, functionJSON: function_myNewFunction });
```

## Function Chaining
The system uses OpenAI's GPT model to intelligently chain functions based on user input. This allows for complex operations to be performed by combining simpler functions.

## Extensibility
The framework is designed to be highly extensible. You can add functions for various APIs, data processing tasks, or any other operations that can be encapsulated into a function.

## Usage
1. Start with a user query or command
2. The system processes the input using NLP
3. Appropriate functions are called in sequence
4. Results are aggregated and summarized

## Security Note
Ensure proper security measures when integrating with external APIs, especially regarding key management.

## Contributing
Contributions to expand the framework's capabilities or improve its architecture are welcome. Please follow the existing patterns for consistency.

## License
[Add license information here]