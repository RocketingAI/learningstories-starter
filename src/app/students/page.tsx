'use client'

import { Card } from "~/components/ui/card"
import { StudentList } from "~/components/student-list"

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Students</h1>
        <p className="text-zinc-400">Manage and view all students in your organization</p>
      </div>
      
      <Card className="border-zinc-800 bg-zinc-950">
        <StudentList />
      </Card>
    </div>
  )
}
