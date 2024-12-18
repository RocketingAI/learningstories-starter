import { AssistantConfig } from "../types/assistant-config";

export const customerAssistantConfig: AssistantConfig = {
  id: "customer-assistant",
  openAiAssistantId: "asst_YxU9fADEGLansZhGHy7EZ1J0",
  title: "Customer Profile Assistant",
  description: "I help analyze customer profiles, behaviors, and needs to improve engagement.",
  initialMessage: "How can I help you understand your customers better?",
  suggestions: [
    {
      label: "Customer Needs Analysis",
      icon: "Users",
      action: "analyze_needs",
      prompt: "Analyze customer needs and pain points, providing insights for better engagement and solution alignment."
    },
    {
      label: "Buyer Persona Development",
      icon: "UserPlus",
      action: "develop_persona",
      prompt: "Help create detailed buyer personas including demographics, behaviors, preferences, and decision factors."
    },
    {
      label: "Customer Journey Mapping",
      icon: "Map",
      action: "map_journey",
      prompt: "Map the customer journey from initial contact to purchase, identifying key touchpoints and improvement opportunities."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "rose-500",
        via: "pink-500",
        to: "fuchsia-500",
        darkFrom: "rose-600",
        darkVia: "pink-600",
        darkTo: "fuchsia-600"
      }
    }
  },
  persona: {
    name: "Customer Context",
    language: "en-US",
    expertise: [
      "Customer Analysis",
      "Behavior Patterns",
      "Need Assessment",
      "Relationship Management",
      "Customer Experience"
    ],
    style: "empathetic",
    personalityIndex: {
      brevity: 65,        // Detailed but accessible
      politeness: 95,     // Very empathetic
      optimism: 85,       // Positive approach
      riskTolerance: 55,  // Conservative with customer data
      analysisDepth: 85,  // Thorough analysis
      expertise: 90       // High customer expertise
    }
  }
};
