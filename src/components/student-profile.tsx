'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Pencil } from 'lucide-react'
import { EditStudentModal } from './edit-student-modal'

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Russian", value: "ru" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
]

type StudentProfileProps = {
  student: {
    id: string
    name: string
    age: number
    birthDate: Date
    languages: string[]
    class: string
    notes: string
    status: 'Active' | 'Inactive'
  }
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleEditSubmit = (data: typeof student) => {
    // TODO: Update student data
    console.log('Updated student data:', data)
    setIsEditing(false)
  }

  return (
    <>
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Student Profile</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Name</Label>
            <div className="text-white">{student.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-zinc-400">Age</Label>
              <div className="text-white">{student.age}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-zinc-400">Birth Date</Label>
              <div className="text-white">
                {format(student.birthDate, 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Class</Label>
            <div className="text-white">{student.class}</div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Languages</Label>
            <div className="flex flex-wrap gap-2">
              {student.languages.map(lang => {
                const language = languages.find(l => l.value === lang)
                return language ? (
                  <Badge
                    key={lang}
                    variant="secondary"
                    className="bg-zinc-800"
                  >
                    {language.label}
                  </Badge>
                ) : null
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Status</Label>
            <div>
              <Badge 
                variant="secondary"
                className={student.status === 'Active' 
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-zinc-500/10 text-zinc-500'
                }
              >
                {student.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-zinc-400">Notes</Label>
            <div className="text-white whitespace-pre-wrap">{student.notes}</div>
          </div>
        </CardContent>
      </Card>

      <EditStudentModal
        student={student}
        open={isEditing}
        onOpenChange={setIsEditing}
        onSubmit={handleEditSubmit}
      />
    </>
  )
}
