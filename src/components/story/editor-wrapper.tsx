'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import "~/styles/editor.css";

interface StoryEditorWrapperProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
}

const StoryEditorWrapper = forwardRef<{ editor: EditorJS | null }, StoryEditorWrapperProps>(({ 
  data, 
  onChange,
  placeholder = 'Start writing your story...'
}, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    editor: editorRef.current
  }));

  useEffect(() => {
    if (!holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data,
      onChange: async () => {
        if (onChange && editorRef.current) {
          const content = await editorRef.current.save();
          onChange(content);
        }
      },
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2],
            defaultLevel: 1
          }
        },
        list: {
          class: List,
          config: {
            defaultStyle: 'unordered'
          }
        },
        quote: {
          class: Quote,
        }
      },
      placeholder,
      minHeight: 0,
      logLevel: 'ERROR',
      defaultBlock: 'paragraph',
      autofocus: true,
      inlineToolbar: false,
      tunes: []
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [data, onChange, placeholder]);

  return (
    <div ref={holderRef} className="prose prose-invert max-w-none" />
  );
});

StoryEditorWrapper.displayName = 'StoryEditorWrapper';

export { StoryEditorWrapper };
