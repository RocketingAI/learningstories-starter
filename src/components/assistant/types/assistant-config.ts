import { IconName } from "../utils/icon-mapping";

export type SuggestionAction = {
  label: string;          // Display text in UI
  icon: IconName;         // Icon to show in UI
  action: string;         // Action identifier
  prompt: string;         // The actual prompt sent to the assistant
};

export type PersonalityIndex = {
  brevity: number;        // 0-100: How concise the responses should be
  politeness: number;     // 0-100: How formal and polite the responses are
  optimism: number;       // 0-100: How positive and optimistic the responses are
  riskTolerance: number;  // 0-100: How conservative vs adventurous in suggestions
  analysisDepth: number;  // 0-100: How detailed the analysis should be
  expertise: number;      // 0-100: Level of expertise in their domain
};

export type PersonaConfig = {
  name: string;           // Name of the assistant
  avatar?: string;        // URL or path to avatar image
  voice?: string;         // Voice ID or configuration
  language: string;       // Primary language (e.g., "en-US")
  expertise: string[];    // List of areas of expertise
  style: string;         // Conversational style (e.g., "professional", "casual", "technical")
  personalityIndex: PersonalityIndex;
};

export type AssistantConfig = {
  id: string;                // Internal ID
  openAiAssistantId: string; // OpenAI Assistant ID
  title: string;
  description: string;
  initialMessage: string;
  suggestions: SuggestionAction[];
  appearance: {
    theme: {
      gradient: {
        from: string;
        via: string;
        to: string;
        darkFrom: string;
        darkVia: string;
        darkTo: string;
        opacity: {
          light: number;
          dark: number;
        };
      };
      background: {
        overlay: {
          light: string;
          dark: string;
        };
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      icon: {
        primary: string;
        secondary: string;
      };
      input: {
        background: string;
        border: string;
        text: string;
        placeholder: string;
      };
      button: {
        background: string;
        hover: string;
        text: string;
      };
    };
    animation: {
      transition: string;
      hover: string;
    };
  };
  persona: PersonaConfig;
  prompts: any; 
};
