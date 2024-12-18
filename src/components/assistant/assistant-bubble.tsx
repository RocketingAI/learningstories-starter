"use client";

import { Bot, User } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";

interface Coach {
  role: string;
  name: string;
  comment: string;
}

interface AssistantBubbleProps {
  role: "user" | "assistant" | "code";
  content?: string;
  text?: string;
  isLatest?: boolean;
  onUseComment?: (comment: string) => void;
}

export function AssistantBubble({ role, content, text, isLatest, onUseComment }: AssistantBubbleProps) {
  const isUser = role === "user";
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [displayContent, setDisplayContent] = useState(text || content || "");

  useEffect(() => {
    const messageContent = text || content || "";
    // Try to extract coaching comments from the content
    try {
      const jsonMatch = messageContent.match(/\{[\s\S]*"comments"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsed = JSON.parse(jsonStr);
        if (parsed.comments && Array.isArray(parsed.comments)) {
          setCoaches(parsed.comments);
          // Remove the JSON from the display content
          setDisplayContent(messageContent.replace(jsonStr, '').trim());
        }
      } else {
        setDisplayContent(messageContent);
        setCoaches([]);
      }
    } catch (e) {
      setDisplayContent(messageContent);
      setCoaches([]);
    }
  }, [text, content]);

  return (
    <>
      <div
        className={cn(
          "group flex items-start gap-3 py-4 transition-opacity",
          isLatest && "animate-in fade-in slide-in-from-bottom-2",
          isUser && "flex-row-reverse"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border border-white/10",
            isUser ? "bg-[#2A2533]" : "bg-[#2A2533]"
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white/60" />
          ) : (
            <Bot className="h-4 w-4 text-white/60" />
          )}
        </div>
        <div className={cn(
          "flex-1 space-y-2",
          isUser && "flex justify-end"
        )}>
          <div className={cn(
            "prose prose-invert max-w-none",
            "prose-p:leading-relaxed prose-pre:p-0",
            "prose-pre:overflow-x-auto prose-pre:max-w-full",
            "prose-code:text-sm prose-code:leading-relaxed",
            "[&_pre]:my-0 [&_pre]:max-w-[calc(100vw-4rem)] [&_pre]:whitespace-pre-wrap",
            isUser ? "max-w-[80%] text-left" : "max-w-none",
            "text-white/90"
          )}>
            <Markdown components={{
              pre: ({ children }) => (
                <pre className="rounded-lg bg-[#2A2533] p-4 border border-white/10">
                  {children}
                </pre>
              ),
              code: ({ children }) => (
                <code className="rounded bg-[#2A2533] px-1 py-0.5 border border-white/10">
                  {children}
                </code>
              ),
            }}>
              {displayContent}
            </Markdown>
          </div>
        </div>
      </div>
    </>
  );
}
