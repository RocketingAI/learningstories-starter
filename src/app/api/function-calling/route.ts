import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, functions, tool_choice } = body;

    // Functions are already in the correct format with type: "function"
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      tools: functions,
      tool_choice,
    });

    console.log("OpenAI Response:", completion);
    return NextResponse.json(completion);
  } catch (error) {
    console.error("Error in function-calling route:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      if ((error as any).response?.data) {
        console.error("API Error details:", (error as any).response.data);
      }
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
