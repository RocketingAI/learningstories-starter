export interface PersonalityAttribute {
  name: string;
  index: number;
}

export interface PersonalityCategory {
  name: string;
  attributes: Record<string, PersonalityAttribute>;
}

export interface DefinedPersonalityProfile {
  profile_type: "DefinedPersonalityProfile";
  categories: Record<string, PersonalityCategory>;
}

