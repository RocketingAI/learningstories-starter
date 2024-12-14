import { openai } from "~/app/assistant-config";
import { functionLoader } from "~/app/assistant/function-loader";

// Import all available functions
import "~/app/assistant/tools/weather";

export const runtime = "nodejs";

// Create a new assistant
export async function POST() {
  const assistant = await openai.beta.assistants.create({
    instructions: "You are a helpful assistant with access to various functions. Use them when appropriate to help users.",
    name: "Function-Enabled Assistant",
    model: "gpt-4-1106-preview",
    tools: [
      { type: "code_interpreter" },
      ...functionLoader.getFunctionDefinitions(),
      { type: "file_search" },
    ],
  });
  return Response.json({ assistantId: assistant.id });
}
