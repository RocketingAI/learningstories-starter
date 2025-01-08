'use client'

import { useState, useRef, useEffect } from 'react'
import { StoryEditorWrapper } from "~/components/story/editor-wrapper"
import { StoryDocsInterface } from "~/components/story/docs-interface"
import { Button } from "~/components/ui/button"
import { Save } from "lucide-react"
import { StoryToolbar } from '~/components/story/toolbar'
import { EditableTitle } from '~/components/story/editable-title'
import { StudentSelect, type Student } from '~/components/story/student-select'
import { OutputData } from '@editorjs/editorjs'

type StoryEditorProps = {
  onSave?: (content: OutputData & { title: string; studentId: string }) => void
  className?: string
}

// TODO: Replace with actual API call
const mockStudents: Student[] = [
  { id: '1', name: 'Emma Thompson', imageUrl: '/avatars/emma.jpg' },
  { id: '2', name: 'Liam Wilson', imageUrl: '/avatars/liam.jpg' },
  { id: '3', name: 'Olivia Davis', imageUrl: '/avatars/olivia.jpg' },
  { id: '4', name: 'Noah Martin', imageUrl: '/avatars/noah.jpg' },
  { id: '5', name: 'Ava Anderson', imageUrl: '/avatars/ava.jpg' },
]

export function StoryEditor({ onSave, className }: StoryEditorProps) {
  const [content, setContent] = useState<OutputData | null>(null)
  const [title, setTitle] = useState("Untitled Story")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<any>(null)

  // Auto-generate title from first header or first few words
  useEffect(() => {
    if (!content?.blocks?.length) return

    const firstBlock = content.blocks[0]
    if (title === "Untitled Story") {
      if (firstBlock.type === 'header') {
        setTitle(firstBlock.data.text)
      } else if (firstBlock.type === 'paragraph') {
        // Take first few words for title
        const words = firstBlock.data.text.split(' ')
        const newTitle = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '')
        setTitle(newTitle)
      }
    }
  }, [content, title])

  const handleSave = async () => {
    if (!onSave || !content || !selectedStudent) return
    setSaving(true)
    try {
      await onSave({ 
        ...content, 
        title,
        studentId: selectedStudent.id
      })
    } catch (error) {
      console.error('Error saving story:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleToolbarAction = (action: string) => {
    if (!editorRef.current?.editor) return

    const editor = editorRef.current.editor

    switch (action) {
      case 'undo':
        editor.undo()
        break
      case 'redo':
        editor.redo()
        break
      case 'h1':
        editor.blocks.insert('header', { level: 1 })
        break
      case 'h2':
        editor.blocks.insert('header', { level: 2 })
        break
      case 'ul':
        editor.blocks.insert('list', { style: 'unordered' })
        break
      case 'ol':
        editor.blocks.insert('list', { style: 'ordered' })
        break
      case 'quote':
        editor.blocks.insert('quote')
        break
      default:
        console.log('Action not implemented:', action)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 flex flex-col gap-4 p-4 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <EditableTitle 
            title={title} 
            onChange={setTitle}
          />
          <StudentSelect
            students={mockStudents}
            selectedStudent={selectedStudent}
            onSelect={setSelectedStudent}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <StoryToolbar onAction={handleToolbarAction} />
          <div className="flex items-center gap-2">
            <StoryDocsInterface />
            {onSave && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !selectedStudent}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <StoryEditorWrapper 
          ref={editorRef}
          data={content}
          onChange={setContent}
        />
      </div>
    </div>
  )
}
