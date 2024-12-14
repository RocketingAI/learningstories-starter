"use client";

import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Marker from "@editorjs/marker";
import "./editor.module.css";

interface EditorJSWrapperProps {
  data?: any;
  onChange?: (data: any) => void;
}

export function EditorJSWrapper({ data, onChange }: EditorJSWrapperProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code here...',
          }
        },
        inlineCode: {
          class: InlineCode,
        },
        marker: {
          class: Marker,
        },
      },
      data: data ?? {
        time: new Date().getTime(),
        blocks: [
          {
            type: "header",
            data: {
              text: "Untitled document",
              level: 1
            }
          },
          {
            type: "paragraph",
            data: {
              text: "Start writing your quotation..."
            }
          }
        ]
      },
      onChange: async () => {
        const content = await editor.save();
        onChange?.(content);
      },
      autofocus: true,
      // placeholder: "...",
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [data, onChange]);

  return (
    <div ref={holderRef} className="w-full max-w-none" style={{ width: '100%' }}>
      {/* Editor content will be rendered here */}
    </div>
  );
}
