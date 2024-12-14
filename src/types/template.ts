import { type Descendant } from "slate";

export type TemplateCategory = {
  id: string;
  name: string;
  description: string;
  slug: string;
};

export type TemplatePlaceholder = {
  id: string;
  key: string;
  label: string;
  type: "text" | "number" | "date" | "table" | "image" | "rich-text";
  defaultValue?: string | number | null;
  required: boolean;
  description?: string;
};

export type TemplateSection = {
  id: string;
  name: string;
  content: Descendant[];
  placeholders: TemplatePlaceholder[];
  order: number;
  isRequired: boolean;
  isRepeatable: boolean;
};

export type Template = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  sections: TemplateSection[];
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    isPublic: boolean;
  };
  styling: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    margins?: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    pageSize?: "A4" | "Letter" | "Legal";
    orientation?: "portrait" | "landscape";
  };
};

export type DocumentInstance = {
  id: string;
  templateId: string;
  name: string;
  content: {
    sections: {
      id: string;
      content: Descendant[];
      placeholderValues: Record<string, any>;
    }[];
  };
  status: "draft" | "review" | "final";
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    author: string;
    version: string;
    tags: string[];
    lastEditedBy: string;
  };
};