import React from 'react';
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { X, ChevronRight } from 'lucide-react';
import { ContextSnippet } from "./context-snippet";

interface StagingAreaProps {
  snippets: { id: string; content: string }[];
  files: { name: string; size: number }[];
  onRemoveSnippet: (id: string) => void;
  onRemoveFile: (name: string) => void;
  onProcessItem: (id: string, type: 'snippet' | 'file') => void;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  snippets,
  files,
  onRemoveSnippet,
  onRemoveFile,
  onProcessItem
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between gap-2 p-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white dark:text-white">Staging Area</h3>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="flex items-center gap-2">
              <ContextSnippet
                content={snippet.content}
                onRemove={() => onRemoveSnippet(snippet.id)}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onProcessItem(snippet.id, 'snippet')}
                className="flex-shrink-0 h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {files.map((file) => (
            <div key={file.name} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <span className="text-sm text-white truncate">{file.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onRemoveFile(file.name)}
                  className="h-6 w-6 text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onProcessItem(file.name, 'file')}
                  className="h-6 w-6 text-white/70 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
