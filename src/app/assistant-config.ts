import OpenAI from "openai";

export const assistantId = process.env.OPENAI_ASSISTANT_ID;

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
