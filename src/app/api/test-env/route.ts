import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET() {
  return NextResponse.json({
    apiKeyLastChars: env.OPENAI_API_KEY.slice(-8),
    realtimeKeyLastChars: env.OPENAI_REALTIME_API_KEY.slice(-8),
    projectId: env.OPENAI_PROJECT_ID,
  });
}
