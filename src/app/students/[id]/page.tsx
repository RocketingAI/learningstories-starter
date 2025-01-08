'use client'

import { Container } from "~/components/ui/container"
import { StudentProfile } from "~/components/student-profile"
import { StudentStories } from "~/components/student-stories"
import { Button } from "~/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  
  // TODO: Fetch student data using the ID
  const mockStudent = {
    id: params.id,
    name: "John Doe",
    age: 8,
    birthDate: new Date("2016-05-15"),
    languages: ["en", "es"],
    class: "3A",
    notes: "John is a very enthusiastic learner who shows great interest in storytelling.",
    status: "Active" as const,
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
          Back to Students
        </Button>
        <h1 className="text-2xl font-bold text-white mb-2">{mockStudent.name}</h1>
        <p className="text-zinc-400">Student Details and Learning Progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudentProfile student={mockStudent} />
        </div>
        <div className="lg:col-span-2">
          <StudentStories studentId={mockStudent.id} />
        </div>
      </div>
    </Container>
  )
}
