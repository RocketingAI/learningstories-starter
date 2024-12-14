'use client'

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'

interface EditorProps {
  data?: OutputData
  onChange?: (data: OutputData) => void
  className?: string
}

export interface EditorRefMethods {
  toggleBold: () => void
  toggleItalic: () => void
  toggleUnderline: () => void
  setHeading: (level: number) => void
}

const Editor = forwardRef<EditorRefMethods, EditorProps>(({ data, onChange, className }, ref) => {
  const editorRef = useRef<EditorJS | null>(null)

  useImperativeHandle(ref, () => ({
    toggleBold: () => {
      editorRef.current?.execute('bold');
    },
    toggleItalic: () => {
      editorRef.current?.execute('italic');
    },
    toggleUnderline: () => {
      editorRef.current?.execute('underline');
    },
    setHeading: (level: number) => {
      editorRef.current?.blocks.insert('header', { level });
    },
  }));

  useEffect(() => {
    let editor: EditorJS;

    const initEditor = async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const List = (await import('@editorjs/list')).default
      const Bold = (await import('@editorjs/bold')).default
      const Italic = (await import('@editorjs/italic')).default
      const Underline = (await import('@editorjs/underline')).default

      if (!editorRef.current) {
        editor = new EditorJS({
          holder: 'editorjs',
          data: data || {},
          onChange: async () => {
            const content = await editor.save()
            onChange && onChange(content)
          },
          autofocus: true,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4],
                defaultLevel: 3
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            bold: Bold,
            italic: Italic,
            underline: Underline,
          },
        })

        editorRef.current = editor
      }
    }

    initEditor()

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    const editorElement = document.getElementById('editorjs');
    if (editorElement) {
      const focusEditor = () => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      };
      editorElement.addEventListener('click', focusEditor);
      return () => {
        editorElement.removeEventListener('click', focusEditor);
      };
    }
  }, []);

  return (
    <div 
      id="editorjs" 
      className={`prose max-w-none ${className || ''}`}
      contentEditable={true}
      suppressContentEditableWarning={true}
      style={{ cursor: 'text' }}
    />
  )
})

Editor.displayName = 'Editor'

export default Editor
