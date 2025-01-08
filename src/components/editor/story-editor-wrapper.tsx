'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import "~/styles/editor.css";

interface StoryEditorWrapperProps {
  data?: any;
  onChange?: (data: any) => void;
}

export const StoryEditorWrapper = forwardRef(({ 
  data, 
  onChange,
}: StoryEditorWrapperProps, ref) => {
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
        if (onChange) {
          const content = await editor.save();
          onChange(content);
        }
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: false,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2],
            defaultLevel: 1
          }
        },
        list: {
          class: List,
          inlineToolbar: false,
          config: {
            defaultStyle: 'unordered'
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: false,
        }
      },
      placeholder: 'Start writing your story...',
      minHeight: 0
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [data, onChange]);

  return (
    <div 
      ref={holderRef} 
      className="prose prose-invert max-w-none"
    />
  );
});

StoryEditorWrapper.displayName = 'StoryEditorWrapper';
