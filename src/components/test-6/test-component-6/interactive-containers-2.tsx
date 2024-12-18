"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sparkles, MessageSquare, Send, ChevronRight, Bot, Upload, X, Plus, SendHorizonal } from 'lucide-react';
import { MessageBubble } from "~/components/chat/message-bubble";
import { LoadingIndicator } from "~/components/ui/loading-indicator";
import { cn } from "~/lib/utils";
import { ContextSnippet } from "./context-snippet";
import { StagingArea } from "./staging-area";
import { FileDropZone } from "./file-drop-zone";

type Message = {
  role: 'assistant' | 'user';
  text: string;
};

type UploadedFile = {
  name: string;
  size: number;
};

type ContextSnippet = {
  id: string;
  content: string;
};

export function InteractiveContainers2() {
  const [focusedContainer, setFocusedContainer] = useState<'left' | 'middle' | 'right' | null>(null);
  const [documentContent, setDocumentContent] = useState("This is where the generated document content will appear. When this container is not focused, it will show a loading skeleton instead.");
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Hello! How can I help you today?' }]);
  const [userInput, setUserInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isInitialView, setIsInitialView] = useState(true);
  const [stagedFiles, setStagedFiles] = useState<UploadedFile[]>([]);
  const [processedFiles, setProcessedFiles] = useState<UploadedFile[]>([]);
  const [stagedSnippets, setStagedSnippets] = useState<ContextSnippet[]>([]);
  const [processedSnippets, setProcessedSnippets] = useState<ContextSnippet[]>([]);
  const [selectedText, setSelectedText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [userInput]);

  // Scroll on new messages and streaming
  useEffect(() => { scrollToBottom(); }, [messages, streamingMessage]);

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

  // create a new threadID when chat component created
  useEffect(() => {
    const createThread = async () => {
      try {
        console.log('Creating new thread...');
        const res = await fetch(`/api/assistants/threads`, {
          method: "POST",
        });

        console.log('Thread creation response status:', res.status);
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Thread creation error:', errorData);
          throw new Error(errorData.error || 'Failed to create thread');
        }

        const data = await res.json();
        console.log('Thread created with ID:', data.threadId);
        setThreadId(data.threadId);
      } catch (error) {
        console.error('Error creating thread:', error);
      }
    };
    createThread();
  }, []);

  const sendMessage = async (text: string) => {
    if (!threadId) {
      console.error('No thread ID available');
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "I apologize, but I'm having trouble connecting. Please try refreshing the page."
      }]);
      return;
    }

    setInputDisabled(true);
    setUserInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setStreamingMessage("");

    try {
      console.log('Sending message to thread:', threadId);
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

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to send message');
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
        } catch (error) {
          console.error('Error processing stream:', error);
          throw error;
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
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "I apologize, but I encountered an error. Please try again."
      }]);
    } finally {
      setInputDisabled(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setStagedFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => ({ name: file.name, size: file.size }))
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (fileName: string) => {
    setStagedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
    }
  };

  const addContextSnippet = () => {
    if (selectedText) {
      setStagedSnippets(prev => [...prev, { id: Date.now().toString(), content: selectedText }]);
      setSelectedText("");
    }
  };

  const removeContextSnippet = (id: string) => {
    setStagedSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  const processItem = (id: string, type: 'snippet' | 'file') => {
    if (type === 'snippet') {
      const snippet = stagedSnippets.find(s => s.id === id);
      if (snippet) {
        setProcessedSnippets(prev => [...prev, snippet]);
        setStagedSnippets(prev => prev.filter(s => s.id !== id));
      }
    } else {
      const file = stagedFiles.find(f => f.name === id);
      if (file) {
        setProcessedFiles(prev => [...prev, file]);
        setStagedFiles(prev => prev.filter(f => f.name !== id));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full p-1">
      <div className="flex gap-4 flex-1">

        {/* Left Container (Chat) */}
        <div
          className={`h-full rounded-xl bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden shadow-lg hover:shadow-xl ${focusedContainer === 'left' ? 'w-[40%] ring-2 ring-indigo-400/50 dark:ring-indigo-600/50' : 'w-[30%] opacity-90'
            }`}
          onClick={() => setFocusedContainer('left')}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
            <div className={`h-full flex flex-col transition-all duration-300 ${focusedContainer !== 'left' ? 'opacity-70' : 'opacity-100'
              }`}>
              <div className="flex items-center gap-2 p-4 border-b border-white/5">
                <Bot className="w-5 h-5 text-primary dark:text-primary-foreground" />
                <h3 className="text-sm font-semibold text-white dark:text-white">AI Assistant</h3>
                {focusedContainer !== 'left' && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/70 animate-bounce-x" />
                )}
              </div>

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
                      <h1 className="text-2xl font-semibold tracking-tight text-white">
                        How can I help you today?
                      </h1>
                      <p className="text-white/70">
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
                          className="group relative rounded-lg border border-white/10 p-3 text-left transition-colors hover:bg-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm text-white">{suggestion}</span>
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
                        text={message.text}
                        isLatest={index === messages.length - 1}
                        onUseComment={setUserInput}
                      />
                    ))}
                    {streamingMessage && (
                      <MessageBubble
                        role="assistant"
                        text={streamingMessage}
                        isLatest={true}
                        onUseComment={setUserInput}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 bg-white/5 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!userInput.trim() || inputDisabled) return;
                    if (isInitialView) setIsInitialView(false);
                    sendMessage(userInput.trim());
                  }}
                  className="max-w-3xl mx-auto flex gap-4 items-end"
                >
                  <div className="relative flex w-full">
                    <textarea
                      ref={textareaRef}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!userInput.trim() || inputDisabled) return;
                          if (isInitialView) setIsInitialView(false);
                          sendMessage(userInput.trim());
                        }
                      }}
                      placeholder="Send a message..."
                      className="w-full resize-none rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] max-h-[200px] overflow-y-auto"
                      disabled={inputDisabled}
                      rows={1}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!userInput.trim() || inputDisabled}
                    className={cn(
                      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "h-10 px-4 py-2 min-h-[44px]",
                      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
                    )}
                  >
                    <SendHorizonal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Container (Staging Area and Context Snippets) */}
        <div className="flex flex-col gap-4 w-[30%]">

          {/* Staging Area */}
          <div
            className={`h-1/2 rounded-xl bg-gradient-to-br from-amber-500/30 via-orange-500/30 to-red-500/30 dark:from-amber-500/20 dark:via-orange-500/20 dark:to-red-500/20 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden shadow-lg hover:shadow-xl ${focusedContainer === 'middle' ? 'ring-2 ring-amber-400/50 dark:ring-amber-600/50' : 'opacity-90'
              }`}
            onClick={() => setFocusedContainer('middle')}
          >
            <StagingArea
              snippets={stagedSnippets}
              files={stagedFiles}
              onRemoveSnippet={removeContextSnippet}
              onRemoveFile={removeFile}
              onProcessItem={processItem}
            />
          </div>

          {/* File Drop Zone */}
          <FileDropZone />

          {/* Processed Context */}
          <div
            className={`h-1/4 rounded-xl bg-gradient-to-br from-green-500/30 via-emerald-500/30 to-teal-500/30 dark:from-green-500/20 dark:via-emerald-500/20 dark:to-teal-500/20 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden shadow-lg hover:shadow-xl ${focusedContainer === 'middle' ? 'ring-2 ring-green-400/50 dark:ring-green-600/50' : 'opacity-90'
              }`}
            onClick={() => setFocusedContainer('middle')}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 p-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white dark:text-white">Processed Context</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                  {processedSnippets.map((snippet) => (
                    <ContextSnippet
                      key={snippet.id}
                      content={snippet.content}
                      onRemove={() => { }}
                    />
                  ))}
                  {processedFiles.map((file) => (
                    <div key={file.name} className="bg-white/10 rounded-lg p-2">
                      <span className="text-sm text-white truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Container (Document Generation) */}
        <div
          className={`rounded-xl bg-gradient-to-br from-purple-500/30 via-indigo-500/30 to-blue-500/30 dark:from-purple-500/20 dark:via-indigo-500/20 dark:to-blue-500/20 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden shadow-lg hover:shadow-xl ${focusedContainer === 'right' ? 'w-[40%] ring-2 ring-purple-400/50 dark:ring-purple-600/50' : 'w-[30%] opacity-90'
            }`}
          onClick={() => setFocusedContainer('right')}
        >
          <div className="relative h-full">
            <div className="absolute inset-0 bg-black/5 dark:bg-black/20" />
            <div className="relative p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary dark:text-primary-foreground animate-pulse" />
                <h3 className="text-sm font-semibold text-white dark:text-white">Generated Document</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="prose prose-sm max-w-none text-white/90 dark:text-white/80">
                  <p className="leading-relaxed">{documentContent}</p>
                </div>
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <div className="text-xs text-white/70 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-600 animate-pulse" />
                  AI Generated
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
