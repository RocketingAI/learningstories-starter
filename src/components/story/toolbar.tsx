'use client'

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image,
  Link,
  Undo,
  Redo,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

type ToolbarButton = {
  icon: React.ReactNode
  label: string
  action: string
}

const toolbarButtons: ToolbarButton[] = [
  { icon: <Undo className="h-4 w-4" />, label: 'Undo', action: 'undo' },
  { icon: <Redo className="h-4 w-4" />, label: 'Redo', action: 'redo' },
  { icon: <Heading1 className="h-4 w-4" />, label: 'Heading 1', action: 'h1' },
  { icon: <Heading2 className="h-4 w-4" />, label: 'Heading 2', action: 'h2' },
  { icon: <List className="h-4 w-4" />, label: 'Bullet List', action: 'ul' },
  { icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List', action: 'ol' },
  { icon: <Quote className="h-4 w-4" />, label: 'Quote', action: 'quote' },
]

type StoryToolbarProps = {
  onAction: (action: string) => void
  className?: string
}

export function StoryToolbar({ onAction, className }: StoryToolbarProps) {
  return (
    <div className={`flex items-center space-x-1 bg-zinc-900/50 rounded-md p-1 ${className}`}>
      <TooltipProvider>
        {toolbarButtons.map((button) => (
          <Tooltip key={button.action}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-zinc-800"
                onClick={() => onAction(button.action)}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
