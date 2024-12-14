export const types = ["GPT-4", "GPT-3"] as const

export type ModelType = (typeof types)[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "gpt-4o",
    description: "The most capable GPT-4 model. Can do any task the other models can do, often with better quality, speed and stability.",
    type: "GPT-4",
    strengths:
      "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "gpt-4o-mini",
    description: "A small, faster version of the most capable GPT-4 model. Can do any task the other models can do, often with better quality, speed and stability.",
    type: "GPT-4",
    strengths:
      "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
  {
    id: "ac0797b0-7e31-43b6-a494-da7e2ab43445",
    name: "gpt-3.5-turbo",
    description: "The most capable GPT-3 model. Can do any task the other models can do, often with better quality, speed and stability.",
    type: "GPT-3",
    strengths: "Complex intent, cause and effect, creative generation, search, summarization for audience",
  },
]
