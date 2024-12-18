import { AssistantConfig } from "../types/assistant-config";

export const companyAssistantConfig: AssistantConfig = {
  id: "company-assistant",
  openAiAssistantId: "asst_RgukfI4JdVwiZdPfDqUka5lS",
  title: "Company & Team Context",
  description: "I collect information about your sales organization.",
  initialMessage: "Tell me about your sales organization.",
  suggestions: [
    {
      label: "Team Structure",
      icon: "Users2",
      action: "team_info",
      prompt: "I'd like to tell you about my sales team structure, roles, and responsibilities."
    },
    {
      label: "Sales Process",
      icon: "ClipboardCheck",
      action: "process_info",
      prompt: "I'd like to describe my current sales processes and workflows."
    },
    {
      label: "Team Goals",
      icon: "Target",
      action: "goals_info",
      prompt: "I'd like to tell you about my team's current goals and targets."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "indigo-500",
        via: "purple-500",
        to: "pink-500",
        darkFrom: "indigo-600",
        darkVia: "purple-600",
        darkTo: "pink-600"
      }
    }
  },
  persona: {
    name: "Company Context",
    language: "en-US",
    expertise: [
      "Sales Organization",
      "Team Structure",
      "Process Documentation"
    ],
    style: "inquisitive",
    personalityIndex: {
      brevity: 60,
      politeness: 80,
      optimism: 70,
      riskTolerance: 50,
      analysisDepth: 90,
      expertise: 95
    }
  }
};
