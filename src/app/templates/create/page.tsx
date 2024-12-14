"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { type Template, type TemplateSection } from "~/types/template";
import { TemplateSectionEditor } from "~/components/templates/template-section";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [template, setTemplate] = React.useState<Partial<Template>>({
    name: "",
    description: "",
    sections: [
      {
        id: "1",
        name: "Introduction",
        content: [{ type: "paragraph", children: [{ text: "" }] }],
        placeholders: [],
        order: 0,
        isRequired: true,
        isRepeatable: false,
      },
    ],
  });

  const handleSectionChange = (index: number, updatedSection: TemplateSection) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections?.map((section, i) =>
        i === index ? updatedSection : section
      ),
    }));
  };

  const addSection = () => {
    setTemplate((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections ?? []),
        {
          id: String(Date.now()),
          name: `Section ${(prev.sections?.length ?? 0) + 1}`,
          content: [{ type: "paragraph", children: [{ text: "" }] }],
          placeholders: [],
          order: prev.sections?.length ?? 0,
          isRequired: false,
          isRepeatable: false,
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!template.name || !template.description) {
      // TODO: Add proper form validation and error messages
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error("Failed to create template");
      }

      const createdTemplate = await response.json();
      router.push("/templates");
    } catch (error) {
      console.error("Error creating template:", error);
      alert("Failed to create template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Template</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={template.name}
              onChange={(e) =>
                setTemplate((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter template name..."
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={template.description}
              onChange={(e) =>
                setTemplate((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter template description..."
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sections</h2>
            <Button 
              type="button" 
              onClick={addSection} 
              variant="outline"
              disabled={isSubmitting}
            >
              Add Section
            </Button>
          </div>
          {template.sections?.map((section, index) => (
            <TemplateSectionEditor
              key={section.id}
              section={section}
              onChange={(updatedSection) =>
                handleSectionChange(index, updatedSection)
              }
            />
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/templates")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
}
