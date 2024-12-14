interface AggregatedDataItem {
  functionName: string;
  result: any;
}

async function summarize_results({ prompt, aggregatedData }: { prompt: string; aggregatedData: AggregatedDataItem[] }) {
  console.group('Function Called: summarize_results()');
  
  const messages = [
    { role: "system", content: "Summarize the results." },
    { role: "user", content: prompt },
    { role: "assistant", content: JSON.stringify(aggregatedData, null, 2) }
  ];
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.groupEnd();
      return data.choices[0].message.content;
    } else {
      console.groupEnd();
      throw new Error(data.error.message || "API call failed");
    }
  } catch (error) {
    console.error("Error:", error);
    console.groupEnd();
    return "Error: " + (error instanceof Error ? error.message : "Unknown error");
  }
}

const function_summarize_results = {
  type: "function" as const,
  function: {
    name: "summarize_results",
    description: "Summarize the results of the function calls",
    parameters: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The original user prompt"
        },
        aggregatedData: {
          type: "array",
          description: "Array of function results to summarize",
          items: {
            type: "object",
            properties: {
              functionName: {
                type: "string",
                description: "Name of the function called"
              },
              result: {
                type: "object",
                description: "Result returned by the function"
              }
            }
          }
        }
      },
      required: ["prompt", "aggregatedData"],
    },
  },
};

export { summarize_results, function_summarize_results };
