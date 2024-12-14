import { openai } from "~/app/assistant-config";

export const runtime = "nodejs";

// Create a new thread
export async function POST() {
  try {
    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_ASSISTANT_ID) {
      return Response.json(
        { error: "OpenAI Assistant ID is not configured" },
        { status: 500 }
      );
    }

    const thread = await openai.beta.threads.create();
    
    if (!thread?.id) {
      return Response.json(
        { error: "Failed to create thread: No thread ID returned" },
        { status: 500 }
      );
    }

    return Response.json({ threadId: thread.id });
  } catch (error: any) {
    console.error("Error creating thread:", error);
    return Response.json(
      { 
        error: "Failed to create thread",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
