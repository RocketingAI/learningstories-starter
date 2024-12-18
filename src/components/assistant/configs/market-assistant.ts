import { AssistantConfig } from "../types/assistant-config";

export const marketAssistantConfig: AssistantConfig = {
  id: "market-assistant",
  openAiAssistantId: "asst_Ojwge3RLZfFtR4Ih8vOaySBl",
  title: "Market & Industry Assistant",
  description: "I provide insights about market trends, industry analysis, and competitive intelligence.",
  initialMessage: "What market insights can I help you with today?",
  suggestions: [
    {
      label: "Analyze Market Trends",
      icon: "TrendingUp",
      action: "analyze_trends",
      prompt: "Provide a detailed analysis of current market trends affecting our industry, including emerging opportunities and potential challenges."
    },
    {
      label: "Competitive Analysis",
      icon: "Search",
      action: "analyze_competition",
      prompt: "Generate a comprehensive competitive analysis including market positioning, strengths, weaknesses, and strategic recommendations."
    },
    {
      label: "Industry Forecast",
      icon: "BarChart",
      action: "forecast_industry",
      prompt: "Create a detailed industry forecast including growth projections, emerging technologies, and potential market shifts."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "purple-500",
        via: "violet-500",
        to: "indigo-500",
        darkFrom: "purple-600",
        darkVia: "violet-600",
        darkTo: "indigo-600"
      }
    }
  },
  persona: {
    name: "Market Context",
    language: "en-US",
    expertise: [
      "Market Analysis",
      "Industry Research",
      "Competitive Intelligence",
      "Trend Analysis",
      "Strategic Planning"
    ],
    style: "strategic",
    personalityIndex: {
      brevity: 65,        // Detailed but focused
      politeness: 80,     // Professional
      optimism: 70,       // Balanced view
      riskTolerance: 65,  // Strategic approach
      analysisDepth: 95,  // Very deep analysis
      expertise: 90       // High market expertise
    }
  }
};
