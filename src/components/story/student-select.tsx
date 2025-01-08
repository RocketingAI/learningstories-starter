'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, User2 } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

export type Student = {
  id: string
  name: string
  imageUrl?: string
}

interface StudentSelectProps {
  students: Student[]
  selectedStudent?: Student | null
  onSelect: (student: Student) => void
  className?: string
}

export function StudentSelect({ 
  students, 
  selectedStudent, 
  onSelect,
  className 
}: StudentSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 px-2 py-1 text-sm text-zinc-400">
        <User2 className="w-4 h-4" />
        Student
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
          >
            {selectedStudent ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedStudent.imageUrl} alt={selectedStudent.name} />
                  <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedStudent.name}
              </div>
            ) : (
              "Select student..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 bg-zinc-950 border-zinc-800">
          <Command>
            <CommandInput 
              placeholder="Search students..." 
              className="border-none focus:ring-0"
            />
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  onSelect={(currentValue) => {
                    const selected = students.find(s => s.id.toLowerCase() === currentValue.toLowerCase())
                    if (selected) {
                      onSelect(selected)
                      setOpen(false)
                    }
                  }}
                  value={student.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={student.imageUrl} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {student.name}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedStudent?.id === student.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
