'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Search, Filter, MoreVertical, Eye, Pencil, Trash2, ArrowUpDown, Plus } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { AddStudentModal } from './add-student-modal'

// Initial mock data
const initialStudents = [
  {
    id: '1',
    name: 'John Doe',
    age: 8,
    class: '3A',
    status: 'Active',
    completedStories: 12,
    inProgressStories: 3,
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 7,
    class: '2B',
    status: 'Inactive',
    completedStories: 8,
    inProgressStories: 0,
  },
]

const mockClasses = ['All', '2A', '2B', '3A', '3B', '4A', '4B']

type Student = {
  id: string
  name: string
  age: number
  class: string
  status: 'Active' | 'Inactive'
  completedStories: number
  inProgressStories: number
}

type SortConfig = {
  key: keyof Student | null
  direction: 'asc' | 'desc'
}

export function StudentList() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [classFilter, setClassFilter] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })

  const handleSort = (key: keyof Student) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleAddStudent = (data: {
    name: string
    age: number
    birthDate: Date
    languages: string[]
    class: string
    notes: string
  }) => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      name: data.name,
      age: data.age,
      class: data.class,
      status: 'Active',
      completedStories: 0,
      inProgressStories: 0,
    }
    
    setStudents(current => [...current, newStudent])
  }

  const sortedAndFilteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || student.status === statusFilter
      const matchesClass = !classFilter || classFilter === 'All' || student.class === classFilter
      return matchesSearch && matchesStatus && matchesClass
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0

      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }

      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'inactive':
        return 'bg-zinc-500/10 text-zinc-500'
      default:
        return 'bg-zinc-500/10 text-zinc-500'
    }
  }

  const TableHeaderSort = ({ column, label }: { column: keyof Student, label: string }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <Button
        variant="ghost"
        onClick={() => handleSort(column)}
        className="h-8 w-8 p-0 hover:bg-transparent"
      >
        <ArrowUpDown className={`h-4 w-4 ${
          sortConfig.key === column 
            ? 'text-white' 
            : 'text-zinc-500'
        }`} />
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-800"
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                onClick={() => setStatusFilter(null)}
                className="hover:bg-zinc-900"
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Active')}
                className="hover:bg-zinc-900"
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('Inactive')}
                className="hover:bg-zinc-900"
              >
                Inactive
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuLabel>Filter by Class</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {mockClasses.map((className) => (
                <DropdownMenuItem
                  key={className}
                  onClick={() => setClassFilter(className)}
                  className="hover:bg-zinc-900"
                >
                  {className}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <AddStudentModal onSubmit={handleAddStudent} />
        </div>
      </div>

      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead>
                <TableHeaderSort column="name" label="Student Name" />
              </TableHead>
              <TableHead>
                <TableHeaderSort column="age" label="Age" />
              </TableHead>
              <TableHead>
                <TableHeaderSort column="class" label="Class" />
              </TableHead>
              <TableHead>
                <TableHeaderSort column="status" label="Status" />
              </TableHead>
              <TableHead>
                <TableHeaderSort column="completedStories" label="Completed Stories" />
              </TableHead>
              <TableHead>
                <TableHeaderSort column="inProgressStories" label="In Progress" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredStudents.map((student) => (
              <TableRow key={student.id} className="border-zinc-800 hover:bg-zinc-900">
                <TableCell className="font-medium text-white">{student.name}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>{student.completedStories}</TableCell>
                <TableCell>{student.inProgressStories}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                      <DropdownMenuItem 
                        className="hover:bg-zinc-900 cursor-pointer"
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="hover:bg-zinc-900 cursor-pointer"
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem 
                        className="hover:bg-zinc-900 cursor-pointer text-red-500 focus:text-red-500"
                        onClick={() => console.log('Delete', student.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
