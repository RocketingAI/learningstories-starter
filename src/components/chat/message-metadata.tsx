'use client';

import { Mic, Keyboard, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';

interface MessageMetadataProps {
  mode: 'text' | 'voice';
  status?: string;
  timestamp: string;
  isUserMessage: boolean;
}

export function MessageMetadata({ mode, status, timestamp, isUserMessage }: MessageMetadataProps) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 text-[10px] mb-1",
      isUserMessage ? "text-primary-foreground/70" : "text-muted-foreground/70"
    )}>
      {/* Mode icon */}
      {mode === 'voice' ? (
        <Mic className="w-3 h-3" />
      ) : (
        <Keyboard className="w-3 h-3" />
      )}

      {/* Status with loading indicator */}
      {status && (
        <span className="flex items-center gap-1">
          {status === 'speaking' && (
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
          {status === 'processing' && (
            <Loader2 className="w-3 h-3 animate-spin" />
          )}
          {status}
        </span>
      )}

      {/* Timestamp */}
      <span className="ml-auto">
        {new Date(timestamp).toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit'
        })}
      </span>
    </div>
  );
}
