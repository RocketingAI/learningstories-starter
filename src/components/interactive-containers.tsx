"use client";

import { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Sparkles, MessageSquare, Send, ChevronRight, Bot } from "lucide-react";

export function InteractiveContainers() {
  const [focusedContainer, setFocusedContainer] = useState<'left' | 'right' | null>(null);
  const [documentContent] = useState("This is where the generated document content will appear. When this container is not focused, it will show a loading skeleton instead.");
  const [messages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
    { role: 'user', content: 'Can you help me write a document?' },
    { role: 'assistant', content: 'Of course! I\'ll help you create a well-structured document. What would you like it to be about?' }
  ]);

  return (
    <div className="flex gap-4 w-full h-full">
      <div 
        className={`h-full rounded-xl bg-gradient-to-br from-muted/40 via-muted/50 to-muted/40 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl ${
          focusedContainer === 'left' ? 'w-[70%] ring-2 ring-primary/20' : focusedContainer === 'right' ? 'w-[30%] opacity-90' : 'w-1/2'
        }`}
        onClick={() => setFocusedContainer('left')}
      >
        <div className={`h-full flex flex-col transition-all duration-300 ${
          focusedContainer !== 'right' ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-4'
        }`}>
          <div className="flex items-center gap-2 p-4 border-b border-muted">
            <Bot className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            {focusedContainer !== 'left' && (
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground animate-bounce-x" />
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 transition-all duration-300 ${
                  message.role === 'user' ? 'justify-end' : ''
                } ${focusedContainer === 'right' ? 'opacity-50 scale-95' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`p-4 border-t border-muted transition-all duration-300 ${
            focusedContainer === 'right' ? 'opacity-50' : ''
          }`}>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-sm focus:outline-none"
              />
              <button className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Send className="w-3 h-3 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`rounded-xl bg-gradient-to-br from-muted/50 via-muted/50 to-muted/60 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl ${
          focusedContainer === 'right' ? 'w-[70%] ring-2 ring-primary/20' : focusedContainer === 'left' ? 'w-[30%]' : 'w-1/2'
        }`}
        onClick={() => setFocusedContainer('right')}
      >
        {focusedContainer === 'right' ? (
          <div className="p-6 h-full flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <h3 className="text-sm font-semibold text-primary">Generated Document</h3>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed">{documentContent}</p>
              </div>
            </div>
            <div className="mt-auto pt-4 flex justify-end">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-primary/40" />
                AI Generated
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 h-full space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full animate-none bg-muted" />
              <Skeleton className="h-4 w-24 animate-none bg-muted" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-[90%] animate-none bg-muted" />
              <Skeleton className="h-4 w-[85%] animate-none bg-muted" />
              <Skeleton className="h-4 w-[88%] animate-none bg-muted" />
              <Skeleton className="h-4 w-[82%] animate-none bg-muted" />
            </div>
            <div className="mt-auto pt-4 flex justify-end">
              <Skeleton className="h-3 w-20 animate-none bg-muted" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
