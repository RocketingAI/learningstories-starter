"use client";

import { useState, useRef } from "react";
import { functions } from "./function-loader";
import "./function-registry"; // Import to ensure functions are registered
import { cn } from "~/lib/utils";

interface AggregatedData {
  functionName: string;
  result: any;
  timestamp?: number;
}

export function FunctionCaller() {
  const [prompt, setPrompt] = useState("What's the weather like at 6 Fox Run Lane in Frontenac, MO and how does it differ from 2330 Maybrook Lane in Kirkwood, MO right now?");
  const [isLoading, setIsLoading] = useState(false);
  const [incrementalResults, setIncrementalResults] = useState<string[]>([]);
  const [mainResult, setMainResult] = useState<string>("");
  const [systemInstructions, setSystemInstructions] = useState(
    "You are a helpful assistant that can use various tools to get information and help users. When using tools, always try to be precise and specific with your requests. Break down complex tasks into smaller steps."
  );
  const maxOpenAiCalls = 5;
  const aggregatedDataRef = useRef<AggregatedData[]>([]);

  const displayStepResult = (result: any, isIncremental = true) => {
    console.group('displayStepResult');
    const formattedResult = typeof result === "object" ? JSON.stringify(result, null, 2) : result;
    console.log('result:', formattedResult);
    
    if (isIncremental) {
      setIncrementalResults(prev => [...prev, formattedResult]);
    } else {
      setMainResult(formattedResult);
    }
    console.groupEnd();
  };

  const handleCallOpenAI = async () => {
    console.group('handleCallOpenAI');
    setIsLoading(true);
    setIncrementalResults([]);
    setMainResult("");
    aggregatedDataRef.current = [];

    const messages = [
      { role: "system", content: systemInstructions },
      { role: "user", content: prompt }
    ];

    try {
      console.log("Sending request with functions:", functions);
      const response = await fetch("/api/function-calling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          functions,
          tool_choice: "auto",
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error?.message || "API call failed");
      }

      // Handle direct response without tool calls
      if (!data.choices?.[0]?.message?.tool_calls) {
        const content = data.choices[0].message.content || "No response from assistant";
        displayStepResult(content, false);
        console.groupEnd();
        return;
      }

      // Process all tool calls
      console.log('Initial Tool Calls:', data.choices[0].message.tool_calls);
      
      // Create a queue of all tool calls
      const toolCallsQueue = [...data.choices[0].message.tool_calls];
      
      // Process each tool call and its potential chain
      while (toolCallsQueue.length > 0) {
        const currentToolCall = toolCallsQueue.shift();
        if (!currentToolCall) continue;
        
        const result = await handleToolCall([currentToolCall], 0, prompt);
        
        // If there are new tool calls from the result, add them to the queue
        if (result?.newToolCalls?.length > 0) {
          toolCallsQueue.push(...result.newToolCalls);
        }
      }

      console.log('Final Aggregated Data:', aggregatedDataRef.current);
      await displaySummarizedResults(prompt);

    } catch (error) {
      console.error("Error:", error);
      displayStepResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, false);
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  const handleToolCall = async (
    toolCalls: any[],
    callCount: number,
    prompt: string,
  ): Promise<{ newToolCalls: any[] } | void> => {
    console.group('handleToolCall');
    
    if (callCount >= maxOpenAiCalls) {
      displayStepResult("Exceeded maximum function call limit.", true);
      console.groupEnd();
      return;
    }

    const newToolCalls: any[] = [];

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArguments = JSON.parse(toolCall.function.arguments);

      try {
        console.log(`Calling function ${functionName} with arguments:`, functionArguments);
        const response = await fetch("/api/function-calling/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName,
            arguments: functionArguments,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Function execution failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log(`Function ${functionName} result:`, result);
        
        const resultData = { 
          functionName, 
          result,
          timestamp: Date.now()
        };
        aggregatedDataRef.current.push(resultData);
        displayStepResult(`${functionName}: ${JSON.stringify(result, null, 2)}`, true);

        // Handle chained function calls
        if (functionName === 'get_coordinates' && result.lat && result.lon) {
          newToolCalls.push({
            function: {
              name: 'get_current_weather',
              arguments: JSON.stringify({ lat: result.lat, lon: result.lon })
            }
          });
        }

        // Check for additional tool calls from the result
        if (result.tool_calls && Array.isArray(result.tool_calls)) {
          newToolCalls.push(...result.tool_calls);
        }

      } catch (error) {
        console.error(`Error executing function ${functionName}:`, error);
        displayStepResult(
          `Error executing ${functionName}: ${error instanceof Error ? error.message : "Unknown error"}`,
          true
        );
        console.groupEnd();
        return;
      }
    }

    console.groupEnd();
    return { newToolCalls };
  };

  const displaySummarizedResults = async (prompt: string) => {
    console.group('displaySummarizedResults');
    try {
      const response = await fetch("/api/function-calling/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt, 
          aggregatedData: aggregatedDataRef.current 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Summarization failed");
      }

      displayStepResult(result.summary, false);
    } catch (error) {
      console.error("Error summarizing results:", error);
      displayStepResult(
        `Error summarizing results: ${error instanceof Error ? error.message : "Unknown error"}`,
        false
      );
    }
    console.groupEnd();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">System Instructions</label>
          <textarea
            value={systemInstructions}
            onChange={(e) => setSystemInstructions(e.target.value)}
            className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-y text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">User Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question..."
            className="w-full min-h-[150px] p-3 rounded-md border bg-background resize-y"
          />
          <button
            onClick={handleCallOpenAI}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-md bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? "Processing..." : "Send"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {mainResult && (
          <div className="p-4 rounded-md border bg-muted/50">
            <h3 className="font-medium mb-2">Final Result</h3>
            <div className="text-sm whitespace-pre-wrap">{mainResult}</div>
          </div>
        )}
        <div className="border-l pl-6">
          <h3 className="font-medium mb-4">Incremental Results</h3>
          <ul className="space-y-2">
            {incrementalResults.map((result, index) => (
              <li
                key={index}
                className="text-sm p-2 rounded bg-muted/30 whitespace-pre-wrap"
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
