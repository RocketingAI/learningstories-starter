import { AssistantConfig } from "../types/assistant-config";

export const dealAssistantConfig: AssistantConfig = {
  id: "deal-assistant",
  openAiAssistantId: "asst_P95aNGzvTxhbhqfpuGToISjO",
  title: "Deal & Opportunity Assistant",
  description: "I help analyze and optimize sales opportunities and deal strategies.",
  initialMessage: "How can I help you with your deals today?",
  suggestions: [
    {
      label: "Deal Strategy Analysis",
      icon: "Target",
      action: "analyze_deal",
      prompt: "Analyze the current deal status and provide strategic recommendations for moving forward successfully."
    },
    {
      label: "Risk Assessment",
      icon: "AlertTriangle",
      action: "assess_risk",
      prompt: "Perform a comprehensive risk assessment of the deal, identifying potential obstacles and mitigation strategies."
    },
    {
      label: "Opportunity Optimization",
      icon: "Maximize",
      action: "optimize_opportunity",
      prompt: "Review the opportunity and suggest ways to maximize deal value and improve win probability."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "cyan-500",
        via: "sky-500",
        to: "blue-500",
        darkFrom: "cyan-600",
        darkVia: "sky-600",
        darkTo: "blue-600"
      }
    }
  },
  persona: {
    name: "Deal Context",
    language: "en-US",
    expertise: [
      "Deal Analysis",
      "Risk Assessment",
      "Negotiation Strategy",
      "Value Optimization",
      "Opportunity Management"
    ],
    style: "strategic",
    personalityIndex: {
      brevity: 70,        // Clear and focused
      politeness: 85,     // Professional
      optimism: 75,       // Balanced outlook
      riskTolerance: 65,  // Calculated approach
      analysisDepth: 90,  // Very detailed analysis
      expertise: 95       // High deal expertise
    }
  }
};
