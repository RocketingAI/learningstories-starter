import { AssistantConfig } from "../types/assistant-config";

export const documentAssistantConfig: AssistantConfig = {
  id: "document-assistant",
  openAiAssistantId: process.env.NEXT_PUBLIC_DOCUMENT_ASSISTANT_ID || "",
  title: "Document Assistant",
  description: "I'm your AI assistant, ready to help with document creation, analysis, and management.",
  initialMessage: "How can I help you today?",
  suggestions: [
    {
      label: "Generate a Sales Proposal",
      icon: "Sparkles",
      action: "generate_sales_proposal",
      prompt: "Create a comprehensive sales proposal document following standard business document formatting. Include sections for executive summary, company background, proposed solution, pricing, implementation timeline, and terms. Focus on clear structure, professional language, and proper formatting."
    },
    {
      label: "Create a Quotation",
      icon: "Sparkles",
      action: "create_quotation",
      prompt: "Generate a formal quotation document with proper business formatting. Include company details, client information, itemized pricing, terms and conditions, validity period, and payment terms. Ensure all necessary legal and business requirements are met."
    },
    {
      label: "Create a Sales Outreach Plan",
      icon: "Sparkles",
      action: "create_sales_outreach",
      prompt: "Create a formal document outlining a comprehensive sales outreach strategy. Include sections for target market analysis, communication protocols, outreach templates, tracking mechanisms, and performance metrics. Focus on documentation standards and clear process definitions."
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: "blue-500",
        via: "indigo-500",
        to: "violet-500",
        darkFrom: "blue-500",
        darkVia: "indigo-500",
        darkTo: "violet-500",
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
    name: "Morgan",
    language: "en-US",
    expertise: [
      "Document Management",
      "Business Writing",
      "Technical Documentation",
      "Process Documentation",
      "Compliance Documentation"
    ],
    style: "technical",
    personalityIndex: {
      brevity: 70,        // More concise than sales assistant
      politeness: 90,     // Very formal and polite
      optimism: 60,       // More neutral/realistic
      riskTolerance: 30,  // More conservative
      analysisDepth: 90,  // Very detailed analysis
      expertise: 95       // Very high technical expertise
    }
  }
};
