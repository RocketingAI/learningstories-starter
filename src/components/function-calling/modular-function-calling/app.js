   import { functions, availableFunctions, addFunction } from './functionLoader.js';

        // // Template to add new functions
        // import { new_function, function_new_function } from './tools/newFunction.js';
        // addFunction({ functionImplementation: new_function, functionJSON: function_new_function });

        // IMPORT FUNCTIONS
        import { get_current_weather, function_get_current_weather } from './tools/getCurrentWeather.js';
        addFunction({ functionImplementation: get_current_weather, functionJSON: function_get_current_weather });

        import { get_current_weather_from_city, function_get_current_weather_from_city } from './tools/getCurrentWeatherFromCity.js';
        addFunction({ functionImplementation: get_current_weather_from_city, functionJSON: function_get_current_weather_from_city });

        import { send_email, function_send_email } from './tools/sendEmail.js';
        addFunction({ functionImplementation: send_email, functionJSON: function_send_email });

        import { get_coordinates, function_get_coordinates } from './tools/getCoordinates.js';
        addFunction({ functionImplementation: get_coordinates, functionJSON: function_get_coordinates });

        import { summarize_results, function_summarize_results } from './tools/summarizeResults.js';
        addFunction({ functionImplementation: summarize_results, functionJSON: function_summarize_results });

        import { scrapeTextFromURL, function_scrapeTextFromURL } from './tools/scrapeTextFromURL.js';
        addFunction({ functionImplementation: scrapeTextFromURL, functionJSON: function_scrapeTextFromURL });

        import { getWebsiteURLs, function_getWebsiteURLs } from './tools/getWebsiteURLs.js';
        addFunction({ functionImplementation: getWebsiteURLs, functionJSON: function_getWebsiteURLs });

        import { checkForHighLevelGoals, function_checkForHighLevelGoals } from './tools/checkForHighLevelGoals.js';
        addFunction({ functionImplementation: checkForHighLevelGoals, functionJSON: function_checkForHighLevelGoals });

        // Function to Call OpenAI API
        async function callOpenAI() {
            console.group('callOpenAI()');
            const systemInstructions = document.getElementById("systemInstructions").value;
            const prompt = document.getElementById("prompt").value;
            const messages = [
                { "role": "system", "content": systemInstructions },
                { "role": "user", "content": prompt }
            ];
            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": apikey_openAI
                    },
                    body: JSON.stringify({
                        model: "gpt-4o",
                        messages: messages,
                        tools: functions,
                        tool_choice: "auto",
                    }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error.message || "API call failed");
                }
                console.log('Initial Tool Calls:', data.choices[0].message.tool_calls);
                const aggregatedData = [];
                // await handleToolCall(data.choices[0].message.tool_calls, prompt, aggregatedData, maxOpenAiCalls);
                await handleToolCall(data.choices[0].message.tool_calls, 0, prompt, aggregatedData, maxOpenAiCalls);
                console.log('Final Aggregated Data:', aggregatedData);
                await summarize_results({ prompt, aggregatedData });
                console.groupEnd();
            } catch (error) {
                console.error("Error:", error);
                document.getElementById(displayContainerId).innerText = "Error: " + error.message;
                console.groupEnd();
            }
        }

        // Function to Display the result of a step
        function displayStepResult(result, isIncremental = true) {
            console.group('displayStepResult()');
            if (typeof result === "object") {
                result = JSON.stringify(result, null, 2);
            }
            console.log('result: ', result);
            const containerElement = isIncremental ?
                document.getElementById("incrementalResults") :
                document.getElementById("mainResult");
            if (containerElement) {
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(result));
                containerElement.appendChild(li);
                console.groupEnd();
            } else {
                console.log("Container not found for displaying result.");
                console.groupEnd();
            }
        }

        // Function to display summarized results
        async function displaySummarizedResults(prompt, aggregatedData) {
            try {
                const summary = await summarize_results({ prompt, aggregatedData });
                displayStepResult(summary, false); // Display in main result area
            } catch (error) {
                console.error("Error in displaySummarizedResults:", error);
                displayStepResult("Error summarizing results: " + error.message, false);
            }
        }

        // Update the handleToolCall function to use the new displayStepResult
        async function handleToolCall(toolCalls, callCount, prompt, aggregatedData, maxOpenAiCalls = 5) {
            console.group('handleToolCall()');
            if (callCount >= maxOpenAiCalls) {
                console.error("Exceeded maximum function call limit.");
                console.groupEnd();
                return;
            }
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionArguments = JSON.parse(toolCall.function.arguments);
                if (availableFunctions.hasOwnProperty(functionName)) {
                    console.log(`Calling function: ${functionName} with arguments: ${JSON.stringify(functionArguments)}`);
                    const result = await availableFunctions[functionName](functionArguments);
                    aggregatedData.push({ functionName, result });
                    displayStepResult(`${functionName}: ${JSON.stringify(result)}`, true);
                    if (functionName === 'get_coordinates') {
                        const lat = result.lat;
                        const lon = result.lon;
                        const nextFunctionCall = {
                            function: {
                                name: 'get_current_weather',
                                arguments: JSON.stringify({ lat, lon })
                            }
                        };
                        await handleToolCall([nextFunctionCall], callCount + 1, prompt, aggregatedData);
                    }
                } else {
                    console.error("Function not supported or not found:", functionName);
                }
            }
            console.groupEnd();
            if (callCount === 0) {
                await displaySummarizedResults(prompt, aggregatedData);
            }
        }

        // async function handleToolCall(initialToolCalls, prompt, aggregatedData, maxOpenAiCalls = 5) {
        //     console.group('handleToolCall()');
        //     const queue = [...initialToolCalls];
        //     let callCount = 0;

        //     while (queue.length > 0 && callCount < maxOpenAiCalls) {
        //         const toolCall = queue.shift();
        //         const functionName = toolCall.function.name;
        //         const functionArguments = JSON.parse(toolCall.function.arguments);

        //         if (availableFunctions.hasOwnProperty(functionName)) {
        //             console.log(`Calling function: ${functionName} with arguments: ${JSON.stringify(functionArguments)}`);
        //             const result = await availableFunctions[functionName](functionArguments);
        //             aggregatedData.push({ functionName, result });
        //             displayStepResult(`${functionName}: ${JSON.stringify(result)}`, true);

        //             // Check for additional tool calls from the result
        //             if (result.tool_calls && Array.isArray(result.tool_calls)) {
        //                 queue.push(...result.tool_calls);
        //             }
        //         } else {
        //             console.error("Function not supported or not found:", functionName);
        //         }

        //         callCount++;
        //     }

        //     if (callCount >= maxOpenAiCalls) {
        //         console.error("Exceeded maximum function call limit.");
        //     }

        //     console.groupEnd();

        //     if (queue.length === 0) {
        //         await displaySummarizedResults(prompt, aggregatedData);
        //     }
        // }


        // Expose functions to the window object
        window.callOpenAI = callOpenAI;
        window.handleToolCall = handleToolCall;
        window.displayStepResult = displayStepResult;
        window.displaySummarizedResults = displaySummarizedResults;
        window.maxOpenAiCalls = 5;
        window.displayContainerId = "apiResponse";
