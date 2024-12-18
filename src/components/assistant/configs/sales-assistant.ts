import { AssistantConfig } from "../types/assistant-config";

export const salesAssistantConfig: AssistantConfig = {
  id: "sales-assistant",
  openAiAssistantId: process.env.NEXT_PUBLIC_SALES_ASSISTANT_ID || "",
  title: "Sales Assistant",
  description: "I'm your AI assistant, ready to help with sales planning, negotiation, and more.",
  initialMessage: "How can I help you today?",
  suggestions: [
    {
      label: "Generate a Sales Proposal",
      icon: "Sparkles",
      action: "generate_sales_proposal",
      prompt: "Act as an experienced sales professional and create a detailed, persuasive sales proposal. Consider value proposition, pricing strategy, and competitive advantages. Structure the proposal with clear sections including executive summary, solution overview, pricing, and next steps."
    },
    {
      label: "Create a Quotation",
      icon: "Sparkles",
      action: "create_quotation",
      prompt: "Generate a professional quotation document that includes detailed line items, pricing breakdowns, terms and conditions, and payment schedules. Consider volume discounts and package deals where appropriate."
    },
    {
      label: "Create a Sales Outreach Plan",
      icon: "Sparkles",
      action: "create_sales_outreach",
      prompt: "Develop a comprehensive sales outreach strategy including target audience identification, communication channels, messaging templates, follow-up sequences, and success metrics. Focus on building relationships and providing value."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "indigo-500",
        via: "purple-500",
        to: "pink-500",
        darkFrom: "indigo-500",
        darkVia: "purple-500",
        darkTo: "pink-500",
        opacity: {
          light: 0.3,
          dark: 0.2
        }
      },
      background: {
        overlay: {
          light: "bg-black/5",
          dark: "bg-black/20"
        }
      },
      text: {
        primary: "text-white",
        secondary: "text-white/70",
        muted: "text-white/50"
      },
      icon: {
        primary: "text-primary",
        secondary: "text-white/60"
      },
      input: {
        background: "bg-white/10",
        border: "border-white/10",
        text: "text-white",
        placeholder: "text-white/50"
      },
      button: {
        background: "bg-white/10",
        hover: "hover:bg-white/20",
        text: "text-white"
      }
    },
    animation: {
      transition: "transition-all duration-300",
      hover: "hover:shadow-xl"
    }
  },
  persona: {
    name: "Alex",
    language: "en-US",
    expertise: [
      "Sales Strategy",
      "Negotiation",
      "Business Development",
      "Client Relations",
      "Market Analysis"
    ],
    style: "professional",
    personalityIndex: {
      brevity: 60,        // Fairly concise but not too brief
      politeness: 85,     // Very polite and professional
      optimism: 80,       // Quite optimistic
      riskTolerance: 50,  // Balanced approach to risk
      analysisDepth: 75,  // Thorough but not overwhelming
      expertise: 90       // High level of expertise
    }
  }
};
