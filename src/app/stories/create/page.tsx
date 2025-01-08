'use client'

import { useState } from 'react'
import { Container } from "~/components/ui/container"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import Assistant from "~/components/assistant/assistant"
import { StoryEditor } from "~/components/story-editor"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { OutputData } from '@editorjs/editorjs'
import { StudentSelect, type Student } from '~/components/story/student-select'
import { StoryList } from '~/components/story/story-list'

const assistantConfig = {
  id: 'story-assistant',
  openAiAssistantId: 'asst_story_helper',
  title: 'Story Writing Assistant',
  description: 'I can help you write engaging learning stories',
  initialMessage: "Hi! I'm here to help you write your learning story. What would you like to write about?",
  suggestions: [
    {
      label: 'Story Ideas',
      icon: 'Sparkles',
      action: 'generate_ideas',
      prompt: 'Can you help me generate some story ideas?'
    },
    {
      label: 'Writing Tips',
      icon: 'Lightbulb',
      action: 'writing_tips',
      prompt: 'What are some tips for writing a good story?'
    }
  ],
  appearance: {
    theme: {
      gradient: {
        from: '#4F46E5',
        via: '#3B82F6',
        to: '#2563EB',
        darkFrom: '#312E81',
        darkVia: '#1E40AF',
        darkTo: '#1E3A8A',
        opacity: {
          light: 0.1,
          dark: 0.2
        }
      },
      background: {
        overlay: {
          light: 'rgba(255, 255, 255, 0.9)',
          dark: 'rgba(0, 0, 0, 0.7)'
        }
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B'
      },
      icon: {
        primary: '#FFFFFF',
        secondary: '#94A3B8'
      },
      input: {
        background: '#1F2937',
        border: '#374151',
        text: '#FFFFFF',
        placeholder: '#9CA3AF'
      },
      button: {
        background: '#3B82F6',
        hover: '#2563EB',
        text: '#FFFFFF'
      }
    },
    animation: {
      transition: 'all 0.2s ease-in-out',
      hover: 'transform 0.1s ease-in-out'
    }
  },
  persona: {
    name: 'Story Assistant',
    role: 'Writing Coach',
    description: 'A friendly writing assistant that helps create engaging learning stories',
    personality: {
      brevity: 60,
      politeness: 80,
      optimism: 90,
      riskTolerance: 50,
      analysisDepth: 70,
      expertise: 85
    }
  },
  prompts: {}
}

// TODO: Replace with actual API call
const mockStudents: Student[] = [
  { id: '1', name: 'Emma Thompson' },
  { id: '2', name: 'Liam Wilson' },
  { id: '3', name: 'Olivia Davis' },
  { id: '4', name: 'Noah Martin' },
  { id: '5', name: 'Ava Anderson' },
]

type Story = {
  title: string
  content: OutputData
  studentId: string
}

export default function CreateStoryPage() {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const handleSave = async (content: OutputData & { title: string }) => {
    if (!selectedStudent) return
    // TODO: Implement save functionality
    console.log('Saving story:', { 
      ...content,
      studentId: selectedStudent.id
    })
  }

  return (
    <Container>
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 -ml-4 text-zinc-400 hover:text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stories
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">Create New Story</h1>
        <p className="text-zinc-400">Create a new learning story with AI assistance</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Story List */}
        <div className="col-span-3">
          <StoryList 
            onSelectStudent={(student) => {
              setSelectedStudent(student)
            }}
            onCreateStory={() => {
              // Reset state for new story
              setSelectedStudent(null)
            }}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {/* Student Selection */}
          <Card className="bg-zinc-950 border-zinc-800 mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentSelect
                students={mockStudents}
                selectedStudent={selectedStudent}
                onSelect={setSelectedStudent}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-350px)]">
            {/* Assistant Card */}
            <Card className="bg-zinc-950 border-zinc-800 h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)] overflow-y-auto">
                <Assistant 
                  config={{
                    ...assistantConfig,
                    initialMessage: selectedStudent 
                      ? `Hi! I'm here to help you write a learning story about ${selectedStudent.name}. What would you like to write about?`
                      : "Please select a student to begin writing their story."
                  }} 
                />
              </CardContent>
            </Card>

            {/* Editor Card */}
            <Card className="bg-zinc-950 border-zinc-800 h-full overflow-hidden">
              <CardContent className="h-full overflow-y-auto p-0">
                <StoryEditor onSave={handleSave} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}
