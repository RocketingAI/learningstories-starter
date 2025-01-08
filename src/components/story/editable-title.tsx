'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from "~/lib/utils"

interface EditableTitleProps {
  title: string
  onChange: (title: string) => void
  className?: string
}

export function EditableTitle({ title, onChange, className }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(title)
  }, [title])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (value !== title) {
      onChange(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      onChange(value)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setValue(title)
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-transparent text-xl font-bold text-zinc-100 border-none outline-none focus:ring-2 focus:ring-zinc-700 rounded px-1 -ml-1",
          className
        )}
      />
    )
  }

  return (
    <h1
      onDoubleClick={handleDoubleClick}
      className={cn(
        "text-xl font-bold text-zinc-100 cursor-text",
        className
      )}
    >
      {title}
    </h1>
  )
}
