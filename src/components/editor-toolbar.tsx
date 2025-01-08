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
  { icon: <Bold className="h-4 w-4" />, label: 'Bold', action: 'bold' },
  { icon: <Italic className="h-4 w-4" />, label: 'Italic', action: 'italic' },
  { icon: <Heading1 className="h-4 w-4" />, label: 'Heading 1', action: 'h1' },
  { icon: <Heading2 className="h-4 w-4" />, label: 'Heading 2', action: 'h2' },
  { icon: <List className="h-4 w-4" />, label: 'Bullet List', action: 'ul' },
  { icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List', action: 'ol' },
  { icon: <Quote className="h-4 w-4" />, label: 'Quote', action: 'quote' },
  { icon: <Link className="h-4 w-4" />, label: 'Link', action: 'link' },
  { icon: <Image className="h-4 w-4" />, label: 'Image', action: 'image' },
]

type EditorToolbarProps = {
  onAction: (action: string) => void
  className?: string
}

export function EditorToolbar({ onAction, className }: EditorToolbarProps) {
  return (
    <div className={`flex items-center space-x-1 bg-zinc-900 rounded-md p-1 ${className}`}>
      <TooltipProvider>
        <div className="flex items-center space-x-1 border-r border-zinc-700 pr-1 mr-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-zinc-800"
                onClick={() => onAction('undo')}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-zinc-800"
                onClick={() => onAction('redo')}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>

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
