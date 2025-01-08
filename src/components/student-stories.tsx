'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Search, Filter, MoreVertical, Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
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

type Story = {
  id: string
  title: string
  status: 'Complete' | 'In Progress'
  type: string
  content: string
  createdAt: Date
  updatedAt: Date
}

type SortConfig = {
  key: keyof Story | null
  direction: 'asc' | 'desc'
}

// Mock data
const mockStories: Story[] = [
  {
    id: '1',
    title: 'My First Day at School',
    status: 'Complete',
    type: 'Personal',
    content: 'Today was my first day at school. I was very excited to meet new friends and learn new things...',
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-02'),
  },
  {
    id: '2',
    title: 'The Magic Tree',
    status: 'In Progress',
    type: 'Fantasy',
    content: 'Once upon a time, there was a magical tree that grew in my backyard. It had golden leaves...',
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2024-09-05'),
  },
]

const storyTypes = ['All', 'Personal', 'Fantasy', 'Adventure', 'Science', 'History']

type StudentStoriesProps = {
  studentId: string
}

export function StudentStories({ studentId }: StudentStoriesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })

  const handleSort = (key: keyof Story) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedAndFilteredStories = mockStories
    .filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesType = !typeFilter || typeFilter === 'All' || story.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0

      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-500/10 text-green-500'
      case 'In Progress':
        return 'bg-yellow-500/10 text-yellow-500'
      default:
        return 'bg-zinc-500/10 text-zinc-500'
    }
  }

  const TableHeaderSort = ({ column, label }: { column: keyof Story, label: string }) => (
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
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Learning Stories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-800"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {storyTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className="hover:bg-zinc-900"
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border border-zinc-800">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-zinc-900">
                <TableHead>
                  <TableHeaderSort column="title" label="Story Title" />
                </TableHead>
                <TableHead>
                  <TableHeaderSort column="status" label="Status" />
                </TableHead>
                <TableHead>
                  <TableHeaderSort column="type" label="Type" />
                </TableHead>
                <TableHead>Content</TableHead>
                <TableHead>
                  <TableHeaderSort column="createdAt" label="Created" />
                </TableHead>
                <TableHead>
                  <TableHeaderSort column="updatedAt" label="Updated" />
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredStories.map((story) => (
                <TableRow key={story.id} className="border-zinc-800 hover:bg-zinc-900">
                  <TableCell className="font-medium text-white">
                    {story.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(story.status)}
                    >
                      {story.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{story.type}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate text-zinc-400">
                      {story.content}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {format(story.createdAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {format(story.updatedAt, 'MMM d, yyyy')}
                  </TableCell>
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
                          onClick={() => console.log('View story:', story.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-zinc-900 cursor-pointer"
                          onClick={() => console.log('Edit story:', story.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem
                          className="hover:bg-zinc-900 cursor-pointer text-red-500 focus:text-red-500"
                          onClick={() => console.log('Delete story:', story.id)}
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
      </CardContent>
    </Card>
  )
}
