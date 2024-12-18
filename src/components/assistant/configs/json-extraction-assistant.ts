import { AssistantConfig } from "../types/assistant-config";

export const jsonExtractionAssistantConfig: AssistantConfig = {
  id: "json-extraction-assistant",
  openAiAssistantId: "asst_8Tfrcl8Y8EoqsknEDetiId6W",
  title: "JSON Extraction Assistant",
  description: "I analyze conversations and extract structured data.",
  initialMessage: "Ready to process conversation data.",
  suggestions: [],  // No suggestions needed as this is automated
  appearance: {
    theme: {
      gradient: {
        from: "slate-500",
        via: "zinc-500",
        to: "stone-500",
        darkFrom: "slate-600",
        darkVia: "zinc-600",
        darkTo: "stone-600"
      }
    }
  },
  persona: {
    name: "Data",
    language: "en-US",
    expertise: [
      "Data Extraction",
      "Conversation Analysis",
      "JSON Processing",
      "Information Structuring",
      "Pattern Recognition"
    ],
    style: "analytical",
    personalityIndex: {
      brevity: 100,       // Maximum brevity - just the data
      politeness: 50,     // Neutral - not interactive
      optimism: 50,       // Neutral
      riskTolerance: 30,  // Conservative with data
      analysisDepth: 100, // Maximum analysis depth
      expertise: 100      // Maximum expertise in data extraction
    }
  }
};
