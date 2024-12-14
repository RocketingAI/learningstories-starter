import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, aggregatedData } = body;

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes the results of function calls in a clear and concise way.",
      },
      {
        role: "user",
        content: `Original prompt: "${prompt}"\n\nFunction call results:\n${JSON.stringify(
          aggregatedData,
          null,
          2
        )}\n\nPlease provide a clear summary of these results.`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    return NextResponse.json({
      summary: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error in summarization:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
