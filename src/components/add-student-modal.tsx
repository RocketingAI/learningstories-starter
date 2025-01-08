'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Plus } from "lucide-react"
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
import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"

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

const classes = ['2A', '2B', '3A', '3B', '4A', '4B']

type AddStudentModalProps = {
  onSubmit: (data: {
    name: string
    age: number
    birthDate?: Date
    languages: string[]
    class: string
    notes: string
  }) => void
}

export function AddStudentModal({ onSubmit }: AddStudentModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [languageCommandOpen, setLanguageCommandOpen] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name) {
      setError('Name is required')
      return
    }
    if (!age || isNaN(parseInt(age))) {
      setError('Valid age is required')
      return
    }
    if (!selectedClass) {
      setError('Class is required')
      return
    }

    onSubmit({
      name,
      age: parseInt(age),
      languages: selectedLanguages,
      class: selectedClass,
      notes
    })

    // Reset form
    setName('')
    setAge('')
    setSelectedClass('')
    setNotes('')
    setSelectedLanguages([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
                min="1"
                max="100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class *</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800">
                  {classes.map((className) => (
                    <SelectItem
                      key={className}
                      value={className}
                      className="hover:bg-zinc-900"
                    >
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Languages</Label>
            <Popover open={languageCommandOpen} onOpenChange={setLanguageCommandOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between bg-zinc-900 border-zinc-800",
                    !selectedLanguages.length && "text-zinc-500"
                  )}
                  type="button"
                >
                  {selectedLanguages.length > 0
                    ? `${selectedLanguages.length} selected`
                    : "Select languages"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0 bg-zinc-950 border-zinc-800">
                <Command className="bg-zinc-950">
                  <CommandInput placeholder="Search languages..." className="bg-zinc-900" />
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languages.map((language) => (
                      <CommandItem
                        key={language.value}
                        onSelect={() => {
                          setSelectedLanguages(current =>
                            current.includes(language.value)
                              ? current.filter(l => l !== language.value)
                              : [...current, language.value]
                          )
                        }}
                        className="hover:bg-zinc-900"
                      >
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-zinc-700",
                          selectedLanguages.includes(language.value)
                            ? "bg-zinc-700"
                            : "opacity-50"
                        )}>
                          {selectedLanguages.includes(language.value) && (
                            <span className="h-2 w-2 bg-white rounded-sm" />
                          )}
                        </div>
                        {language.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLanguages.map(lang => {
                  const language = languages.find(l => l.value === lang)
                  return (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="bg-zinc-800 hover:bg-zinc-700"
                      onClick={() => setSelectedLanguages(current =>
                        current.filter(l => l !== lang)
                      )}
                    >
                      {language?.label}
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-900 border-zinc-800 min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-zinc-900 border-zinc-800"
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
