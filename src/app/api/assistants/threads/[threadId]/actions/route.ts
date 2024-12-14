import { openai } from "~/app/assistant-config";
import { functionLoader } from "~/app/assistant/function-loader";

// Import all available functions
import "~/app/assistant/tools/weather";

export const runtime = "nodejs";

// Submit tool outputs for a run
export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = params.threadId;
    const { runId, toolCalls } = await request.json();

    if (!runId) {
      return Response.json(
        { error: "Run ID is required" },
        { status: 400 }
      );
    }

    if (!toolCalls || !Array.isArray(toolCalls)) {
      return Response.json(
        { error: "Tool calls must be an array" },
        { status: 400 }
      );
    }

    // Execute each function call using our function loader
    const toolOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        try {
          const result = await functionLoader.executeFunction(functionName, functionArgs);
          return {
            tool_call_id: toolCall.id,
            output: JSON.stringify(result),
          };
        } catch (error: any) {
          console.error(`Error executing function ${functionName}:`, error);
          return {
            tool_call_id: toolCall.id,
            output: JSON.stringify({ error: error.message }),
          };
        }
      })
    );

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: toolOutputs }
    );

    return new Response(stream.toReadableStream());
  } catch (error: any) {
    console.error("Error in actions route:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
