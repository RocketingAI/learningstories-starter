"use client";

import React from "react";
import { type Descendant } from "slate";
import { Label } from "~/components/ui/label";
import { RichTextEditor } from "~/components/editor/rich-text-editor";
import { type TemplateSection } from "~/types/template";

interface TemplateSectionEditorProps {
  section: TemplateSection;
  onChange?: (updatedSection: TemplateSection) => void;
}

export function TemplateSectionEditor({
  section,
  onChange,
}: TemplateSectionEditorProps) {
  const handleContentChange = (newContent: Descendant[]) => {
    onChange?.({
      ...section,
      content: newContent,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{section.name}</Label>
        <RichTextEditor
          initialValue={section.content}
          onChange={handleContentChange}
          placeholder={`Enter content for ${section.name}...`}
        />
      </div>
    </div>
  );
}
