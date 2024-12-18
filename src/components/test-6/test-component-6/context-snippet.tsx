import React from 'react';
import { X } from 'lucide-react';
import { Button } from "~/components/ui/button";

interface ContextSnippetProps {
  content: string;
  onRemove: () => void;
}

export const ContextSnippet: React.FC<ContextSnippetProps> = ({ content, onRemove }) => {
  return (
    <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="flex justify-between items-start mb-2">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500">Context Snippet</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">{content}</p>
    </div>
  );
};

