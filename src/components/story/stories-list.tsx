'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Search, MoreVertical, Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { format } from 'date-fns'

export type Story = {
  id: string
  title: string
  student: string
  status: 'draft' | 'in_progress' | 'completed'
  content: string
  createdAt: Date
  updatedAt: Date
}

type SortConfig = {
  key: keyof Story | null
  direction: 'asc' | 'desc'
}

const getStatusColor = (status: Story['status']) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
    case 'completed':
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
    default:
      return 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20'
  }
}

// Mock data
const mockStories: Story[] = [
  {
    id: '1',
    title: 'First Day at School',
    student: 'Emma Thompson',
    status: 'completed',
    content: 'Emma showed great enthusiasm during her first day. She quickly made friends and participated actively in class discussions.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '2',
    title: 'Math Progress',
    student: 'Liam Wilson',
    status: 'in_progress',
    content: 'Liam has been making steady progress in mathematics. He can now solve basic addition and subtraction problems independently.',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '3',
    title: 'Art Project',
    student: 'Olivia Davis',
    status: 'draft',
    content: 'Olivia created a beautiful painting today using watercolors. She showed great attention to detail and color mixing.',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
]

interface StoriesListProps {
  onView?: (story: Story) => void
  onEdit?: (story: Story) => void
  onDelete?: (story: Story) => void
}

export function StoriesList({ onView, onEdit, onDelete }: StoriesListProps) {
  const [stories] = useState<Story[]>(mockStories)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Story['status'] | 'all'>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })

  const handleSort = (key: keyof Story) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const filteredStories = stories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-800"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-zinc-900 border-zinc-800">
              {statusFilter === 'all' ? 'All Stories' : statusFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-zinc-950 border-zinc-800">
            <DropdownMenuItem onClick={() => setStatusFilter('all')}>
              All Stories
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('in_progress')}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('title')}
                  className="-ml-4"
                >
                  Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('student')}
                >
                  Student
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('updatedAt')}
                >
                  Last Edited
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStories.map((story) => (
              <TableRow key={story.id}>
                <TableCell className="font-medium">{story.title}</TableCell>
                <TableCell>{story.student}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(story.status)} variant="outline">
                    {story.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">{story.content}</TableCell>
                <TableCell>{format(story.createdAt, 'MMM d, yyyy')}</TableCell>
                <TableCell>{format(story.updatedAt, 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
                      <DropdownMenuItem 
                        onClick={() => onView?.(story)}
                        className="cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onEdit?.(story)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(story)}
                        className="cursor-pointer text-red-500 focus:text-red-500"
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
