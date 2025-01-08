'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { format } from 'date-fns'
import { Badge } from "~/components/ui/badge"

export type Story = {
  id: string
  title: string
  student: string
  status: 'draft' | 'in_progress' | 'completed'
  content: string
  createdAt: Date
  updatedAt: Date
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

const columns: ColumnDef<Story>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Story['status']
      const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
      return (
        <Badge className={getStatusColor(status)} variant="outline">
          {label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "content",
    header: "Content",
    cell: ({ row }) => {
      const content = row.getValue("content") as string
      return <div className="max-w-[300px] truncate">{content}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return format(row.getValue("createdAt"), 'MMM d, yyyy')
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Edited
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return format(row.getValue("updatedAt"), 'MMM d, yyyy')
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const story = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800">
            <DropdownMenuItem 
              onClick={() => console.log('View story:', story.id)}
              className="cursor-pointer"
            >
              View story
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => console.log('Edit story:', story.id)}
              className="cursor-pointer"
            >
              Edit story
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => console.log('Delete story:', story.id)}
              className="cursor-pointer text-red-500 focus:text-red-500"
            >
              Delete story
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface StoriesTableProps {
  data: Story[]
  onView?: (story: Story) => void
  onEdit?: (story: Story) => void
  onDelete?: (story: Story) => void
}

export function StoriesTable({ 
  data,
  onView,
  onEdit,
  onDelete
}: StoriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div>
      <div className="rounded-md border border-zinc-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No stories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-zinc-400">
          {table.getFilteredRowModel().rows.length} story(ies) total.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
