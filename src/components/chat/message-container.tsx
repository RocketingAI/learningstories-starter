'use client';

import { useEffect, useRef } from 'react';
import { cn } from '~/lib/utils';
import { MessageMetadata } from './message-metadata';
import type { Message } from '~/lib/realtime/use-chat-with-voice';

interface MessageContainerProps {
  messages: Message[];
}

function DateSeparator({ date }: { date: Date }) {
  return (
    <div className="flex items-center gap-4 px-2 py-4">
      <div className="h-px flex-1 bg-border" />
      <div className="text-xs font-medium text-muted-foreground">
        {date.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function MessageContainer({ messages }: MessageContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp);
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date,
        messages: []
      };
    }
    
    groups[dateKey].messages.push(message);
    return groups;
  }, {} as Record<string, { date: Date; messages: Message[] }>);

  return (
    <div className="relative flex-1 min-h-[400px] max-h-[600px] flex flex-col">
      {/* Top fade effect */}
      <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10
                    bg-gradient-to-b from-background to-transparent" />
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10
                    bg-gradient-to-t from-background to-transparent" />
      
      {/* Scrollable container */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto px-4",
          "scrollbar-thin scrollbar-thumb-muted-foreground/20",
          "scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40",
          "space-y-6"
        )}
      >
        {Object.entries(messagesByDate).map(([dateKey, { date, messages: dateMessages }]) => (
          <div key={dateKey} className="space-y-6">
            <DateSeparator date={date} />
            
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "group flex animate-in slide-in-from-bottom-2",
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                  "pb-1" // Add padding to prevent cut-off
                )}
              >
                <div
                  className={cn(
                    "relative max-w-[85%] px-4 py-2.5 rounded-2xl",
                    "before:absolute before:bottom-[6px] before:w-4 before:h-4",
                    message.role === 'user' ? [
                      "bg-primary text-primary-foreground",
                      "before:right-[-8px]",
                      "before:bg-[radial-gradient(circle_at_top_left,transparent_70%,var(--primary)_0)]",
                    ] : [
                      "bg-muted",
                      "before:left-[-8px]",
                      "before:bg-[radial-gradient(circle_at_top_right,transparent_70%,hsl(var(--muted))_0)]",
                    ],
                    "shadow-sm transition-shadow duration-200",
                    "hover:shadow-md"
                  )}
                >
                  {/* Message metadata */}
                  <MessageMetadata
                    mode={message.mode}
                    status={message.status}
                    timestamp={message.timestamp}
                    isUserMessage={message.role === 'user'}
                  />
                  
                  {/* Message content */}
                  <div className={cn(
                    "text-sm whitespace-pre-wrap leading-relaxed break-words",
                    message.role === 'user'
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}>
                    {message.text || '...'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Auto-scroll anchor */}
        <div ref={bottomRef} className="h-1 w-full" />
      </div>
    </div>
  );
}
