import { NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import { type RealtimeSession, type RealtimeSessionResponse } from "~/types/realtime";
import { z } from "zod";

const sessionRequestSchema = z.object({
  model: z.string(),
  modalities: z.array(z.enum(["text", "audio"])).optional(),
  instructions: z.string().optional(),
  voice: z.enum([
    "alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse"
  ]).optional(),
  input_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  output_audio_format: z.enum(["pcm16", "g711_ulaw", "g711_alaw"]).optional(),
  input_audio_transcription: z.object({
    model: z.string()
  }).nullable().optional(),
  turn_detection: z.object({
    type: z.literal("server_vad"),
    threshold: z.number(),
    prefix_padding_ms: z.number(),
    silence_duration_ms: z.number(),
    create_response: z.boolean()
  }).nullable().optional(),
  tools: z.array(z.object({
    type: z.literal("function"),
    name: z.string(),
    description: z.string(),
    parameters: z.object({
      type: z.literal("object"),
      properties: z.record(z.unknown()),
      required: z.array(z.string()).optional()
    })
  })).optional(),
  tool_choice: z.union([
    z.literal("auto"),
    z.literal("none"),
    z.literal("required"),
    z.string()
  ]).optional(),
  temperature: z.number().min(0.6).max(1.2).optional(),
  max_response_output_tokens: z.union([z.number(), z.literal("inf")]).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = sessionRequestSchema.parse(body);

    console.log('Request validation successful');
    console.log('Environment check:', {
      hasRealtimeKey: !!env.OPENAI_REALTIME_API_KEY,
      realtimeKeyLength: env.OPENAI_REALTIME_API_KEY?.length,
      realtimeKeyEnd: env.OPENAI_REALTIME_API_KEY?.slice(-12),
    });
    
    console.log('Creating session with body:', JSON.stringify(validatedBody, null, 2));
    console.log('Using Realtime API key ending in:', env.OPENAI_REALTIME_API_KEY.slice(-12));
    
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_REALTIME_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime-2024-12-17"
      },
      body: JSON.stringify(validatedBody)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: error.error?.message || "Failed to create session" },
        { status: response.status }
      );
    }

    const session = (await response.json()) as RealtimeSessionResponse;
    return NextResponse.json(session);
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
