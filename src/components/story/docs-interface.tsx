'use client'

import { Button } from "~/components/ui/button"
import { FileText } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

export function StoryDocsInterface() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Docs
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] bg-zinc-950 border-zinc-800">
        <SheetHeader>
          <SheetTitle className="text-zinc-100">Documentation</SheetTitle>
          <SheetDescription className="text-zinc-400">
            Quick reference for writing learning stories
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Add documentation content here */}
        </div>
      </SheetContent>
    </Sheet>
  )
}
