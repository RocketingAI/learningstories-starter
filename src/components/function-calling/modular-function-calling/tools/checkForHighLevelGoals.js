async function checkForHighLevelGoals() {
    console.group('Function Called: checkForHighLevelGoals()');
    let goalContext = "Always look at the request and all the available functions, then plan out the sequence of function calls that will result in the best answer";
    try {
        return goalContext;
    } catch (error) {
        console.groupEnd();
        throw new Error(`Error: ${error.message}`);
    }
}

const function_checkForHighLevelGoals = {
    type: "function",
    function: {
        name: "checkForHighLevelGoals",
        description: "Before proceeding to your next step. Perform an initial important check for high level goals",
        parameters: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "The original user prompt"
                },
                aggregatedData: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            functionName: { type: "string" },
                            result: { type: "object" }
                        }
                    }
                }
            },
            required: ["prompt", "aggregatedData"],
        },
    },
};

export { checkForHighLevelGoals, function_checkForHighLevelGoals };