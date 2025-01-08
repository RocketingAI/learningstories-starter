'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { formatDistanceToNow } from 'date-fns'

type Story = {
  id: string
  studentName: string
  title: string
  type: string
  preview?: string
  status: 'draft' | 'complete'
  updatedAt: Date
}

type Student = {
  id: string
  name: string
  stories: Story[]
}

// TODO: Replace with API data
const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Ryan',
    stories: [
      {
        id: '1',
        studentName: 'Ryan',
        title: 'New Story',
        type: 'Evaluation Story',
        status: 'draft',
        updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        studentName: 'Ryan',
        title: 'New Story',
        type: 'Recognition Story',
        status: 'draft',
        updatedAt: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000),
      }
    ]
  },
  {
    id: '2',
    name: 'Charlie',
    stories: [
      {
        id: '3',
        studentName: 'Charlie',
        title: 'New Story',
        type: 'Recognition Story',
        preview: 'My name is ryan. I have two children and a wife and I live in St. Louis, MO',
        status: 'draft',
        updatedAt: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000),
      }
    ]
  },
  {
    id: '3',
    name: 'Student 3',
    stories: [
      {
        id: '4',
        studentName: 'Student 3',
        title: 'Story 3 for Stu...',
        type: 'Recognition Story',
        preview: 'This is example story content',
        status: 'draft',
        updatedAt: new Date(Date.now() - 189 * 24 * 60 * 60 * 1000),
      }
    ]
  }
]

interface StoryListProps {
  onSelectStory?: (story: Story) => void
  onSelectStudent?: (student: Student) => void
  onCreateStory?: () => void
}

export function StoryList({ onSelectStory, onSelectStudent, onCreateStory }: StoryListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('stories')

  const allStories = mockStudents.flatMap(student => student.stories)

  const filteredStories = allStories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.preview?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search stories..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onCreateStory}
        >
          Create New Story →
        </Button>

        <Tabs defaultValue="stories" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="w-full bg-zinc-900">
            <TabsTrigger value="stories" className="flex-1">Stories</TabsTrigger>
            <TabsTrigger value="students" className="flex-1">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="mt-4">
            <div className="space-y-3">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => onSelectStory?.(story)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-zinc-100">{story.studentName}</span>
                        <span className="text-zinc-400">|</span>
                        <span className="text-zinc-400">{story.title}</span>
                      </div>
                      <div className="text-sm text-zinc-400 mb-2">{story.type}</div>
                      {story.preview && (
                        <p className="text-sm text-zinc-400 line-clamp-2">{story.preview}</p>
                      )}
                      <div className="mt-2">
                        {story.status === 'draft' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-400/10 text-orange-400">
                            1. Chat to Begin Story
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400">
                            2. Edit to Complete Story
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500">
                      {formatDistanceToNow(story.updatedAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 cursor-pointer"
                  onClick={() => onSelectStudent?.(student)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-100">{student.name}</span>
                    <span className="text-sm text-zinc-400">
                      {student.stories.length} {student.stories.length === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
