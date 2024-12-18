import { AssistantConfig } from "../types/assistant-config";

export const productAssistantConfig: AssistantConfig = {
  id: "product-assistant",
  openAiAssistantId: "asst_otf5oUKcB9sXD5MdRWrRw1HW",
  title: "Product & Service Context",
  description: "I collect information about your products and services.",
  initialMessage: "Tell me about your products and services.",
  suggestions: [
    {
      label: "Product Details",
      icon: "Package",
      action: "product_info",
      prompt: "I'd like to tell you about our main products or services."
    },
    {
      label: "Key Benefits",
      icon: "Zap",
      action: "benefits_info",
      prompt: "I'd like to tell you about the key benefits our products provide to customers."
    },
    {
      label: "Target Market",
      icon: "Shield",
      action: "market_info",
      prompt: "I'd like to tell you our target customers for these products."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "emerald-500",
        via: "teal-500",
        to: "cyan-500",
        darkFrom: "emerald-600",
        darkVia: "teal-600",
        darkTo: "cyan-600"
      }
    }
  },
  persona: {
    name: "Product Context",
    language: "en-US",
    expertise: [
      "Product Information",
      "Customer Benefits",
      "Market Segmentation"
    ],
    style: "inquisitive",
    personalityIndex: {
      brevity: 70,
      politeness: 80,
      optimism: 75,
      riskTolerance: 60,
      analysisDepth: 90,
      expertise: 95
    }
  }
};
