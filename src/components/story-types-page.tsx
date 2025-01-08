'use client'

import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Textarea } from "~/components/ui/textarea"
import { Eye, EyeOff, FileText, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

export function StoryTypesPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStoryType, setSelectedStoryType] = useState<any>(null)

  const mockStoryTypes = [
    {
      id: 1,
      name: "Daily Activity",
      description: "Record of daily activities and achievements",
      usageCount: 156,
      example: "daily-activity-example.pdf",
      status: "active"
    },
    {
      id: 2,
      name: "Learning Milestone",
      description: "Document significant learning achievements",
      usageCount: 89,
      example: "milestone-example.pdf",
      status: "active"
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Story Types</h2>
          <p className="text-sm text-zinc-400">Manage your organization's story types</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          Add Story Type
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Story Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Usage Count</TableHead>
            <TableHead>Example</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStoryTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell>{type.usageCount}</TableCell>
              <TableCell>{type.example}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  type.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-500/10 text-zinc-500'
                }`}>
                  {type.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedStoryType(type)
                      setShowEditModal(true)
                    }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {type.status === 'active' ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
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

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Story Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Story Type Name</Label>
              <Input id="name" placeholder="Enter story type name" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter description" />
            </div>
            <div>
              <Label htmlFor="example">Example File</Label>
              <div className="mt-2">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Example File
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button>Create Story Type</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Story Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Story Type Name</Label>
              <Input 
                id="edit-name" 
                placeholder="Enter story type name"
                defaultValue={selectedStoryType?.name}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                placeholder="Enter description"
                defaultValue={selectedStoryType?.description}
              />
            </div>
            <div>
              <Label htmlFor="edit-example">Example File</Label>
              <div className="mt-2">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Change Example File
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
