"use client";

import React, { useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface RichTextEditorProps {
  initialValue?: Descendant[];
  onChange?: (value: Descendant[]) => void;
  placeholder?: string;
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export function RichTextEditor({
  initialValue: propInitialValue,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = React.useState<Descendant[]>(propInitialValue ?? initialValue);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <Editable
          className="min-h-[inherit] outline-none"
          placeholder={placeholder}
        />
      </Slate>
    </div>
  );
}
