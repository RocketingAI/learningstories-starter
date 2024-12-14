import { openai, assistantId } from "~/app/assistant-config";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = params.threadId;
    const { content } = await request.json();

    if (!content) {
      return Response.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Create message
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });

    // Create a run
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId!,
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Poll for run status
          while (true) {
            const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            
            if (runStatus.status === "completed") {
              // Get the latest messages
              const messages = await openai.beta.threads.messages.list(threadId);
              const latestMessage = messages.data[0];
              
              // Stream the message content character by character
              if (latestMessage.content[0].type === 'text') {
                const content = latestMessage.content[0].text.value;
                for (let i = 0; i < content.length; i++) {
                  controller.enqueue(encoder.encode(content[i]));
                  // Reduced delay to 7ms for even faster typing
                  await new Promise(resolve => setTimeout(resolve, 7));
                }
              }
              controller.close();
              break;
            } else if (runStatus.status === "failed" || runStatus.status === "cancelled" || runStatus.status === "expired") {
              throw new Error(`Run ended with status: ${runStatus.status}`);
            }
            
            // Wait before polling again
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream);
  } catch (error: any) {
    console.error("Error in messages route:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
