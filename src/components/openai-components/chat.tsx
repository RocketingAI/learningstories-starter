"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageBubble } from "~/components/chat/message-bubble";
import { LoadingIndicator } from "~/components/ui/loading-indicator";
import { cn } from "~/lib/utils";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types available yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";

type MessageProps = {
  role: "user" | "assistant" | "code";
  text: string;
};

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
};

const Chat = ({
  functionCallHandler = () => Promise.resolve(""),
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isInitialView, setIsInitialView] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userInput]);

  // Scroll on new messages and streaming
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // automatically scroll to bottom of chat
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Scroll to top when first message is added
    if (messages.length === 1) {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messages.length]);

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      const res = await fetch(`/api/assistants/threads`, {
        method: "POST",
      });
      const data = await res.json();
      setThreadId(data.threadId);
    };
    createThread();
  }, []);

  const handleReadableStream = async (stream: AssistantStream) => {
    let currentMessage = "";
    for await (const event of stream) {
      if (event.type === "text") {
        currentMessage += event.text;
        setStreamingMessage(currentMessage);
      }
    }
    setMessages(prev => [...prev, { role: "assistant", text: currentMessage }]);
    setStreamingMessage("");
    setInputDisabled(false);
  };

  const sendMessage = async (text: string) => {
    setInputDisabled(true);
    setUserInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setStreamingMessage("");

    try {
      const response = await fetch(
        `/api/assistants/threads/${threadId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: text }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let currentMessage = "";
      
      // Process the stream
      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk (single character)
            const char = new TextDecoder().decode(value);
            currentMessage += char;
            setStreamingMessage(currentMessage);
          }
        } finally {
          reader.releaseLock();
        }
      };

      await processStream();

      // Add the complete message to the messages array
      setMessages(prev => [...prev, { role: "assistant", text: currentMessage }]);
      setStreamingMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show error to user
    } finally {
      setInputDisabled(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || inputDisabled) return;
    
    if (isInitialView) {
      setIsInitialView(false);
    }
    
    await sendMessage(userInput.trim());
  };

  return (
    <div className="relative flex h-full flex-col justify-between">
      <div 
        ref={messagesContainerRef}
        className={cn(
          "flex-1 overflow-y-auto scroll-smooth px-4",
          isInitialView ? "flex items-center justify-center" : ""
        )}
      >
        {isInitialView ? (
          <div className="text-center space-y-6 max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground">
                I'm your AI assistant, ready to help with document generation, analysis, and more.
              </p>
            </div>
            <div className="grid gap-2">
              {["Generate a Sales Proposal", "Create a Quotation", "Create a Sales Outreach Plan"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setUserInput(suggestion);
                    setIsInitialView(false);
                  }}
                  className="group relative rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-4 space-y-4">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                role={message.role}
                content={message.text}
                isLatest={index === messages.length - 1}
                onUseComment={setUserInput}
              />
            ))}
            {streamingMessage && (
              <MessageBubble
                role="assistant"
                content={streamingMessage}
                isLatest={true}
                onUseComment={setUserInput}
              />
            )}
          </div>
        )}
      </div>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4 items-end">
          <div className="relative flex w-full">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Send a message..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px] overflow-y-auto"
              disabled={inputDisabled}
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={inputDisabled || !userInput.trim()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary min-h-[44px] text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
