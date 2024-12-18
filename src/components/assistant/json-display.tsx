'use client';

import React, { useState } from "react";
import { Bot, MessageSquare, Code } from "lucide-react";
import { AssistantConfig } from "./types/assistant-config";
import { useMessages } from "./context/messages-context";
import { cn } from "~/lib/utils";
import { useChat } from "ai/react";

type JsonDisplayProps = {
  config: AssistantConfig;
};

type Tab = 'messages' | 'json';

export const JsonDisplay: React.FC<JsonDisplayProps> = ({ config }) => {
  const { messages } = useMessages();
  const [activeTab, setActiveTab] = useState<Tab>('messages');
  const [jsonResponse, setJsonResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const { append: appendJsonMessage } = useChat({
    api: "/api/chat/json-extraction",
    id: "json-extraction",
    body: {
      context: config.context,
    },
  });

  const handleExtractJson = async () => {
    setIsLoading(true);
    try {
      // Format messages for the JSON extraction assistant
      const messageContent = JSON.stringify({
        company: {
          messages: messages.filter(m => m.source === 'company').map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          }))
        },
        product: {
          messages: messages.filter(m => m.source === 'product').map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          }))
        }
      }, null, 2);

      // Send to JSON extraction assistant
      const response = await appendJsonMessage({
        role: 'user',
        content: `Please extract structured information from these messages: ${messageContent}`
      });

      // Update the JSON response state
      setJsonResponse(response.content);
    } catch (error) {
      console.error('Error extracting JSON:', error);
      setJsonResponse('Error extracting JSON. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-white/5">
        <Bot className="w-5 h-5 text-white" />
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-white">{config.persona.name}</h3>
          <p className="text-xs text-white/70">{config.title}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
            activeTab === 'messages'
              ? "text-white border-b-2 border-white"
              : "text-white/50 hover:text-white"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          Messages
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
            activeTab === 'json'
              ? "text-white border-b-2 border-white"
              : "text-white/50 hover:text-white"
          )}
        >
          <Code className="w-4 h-4" />
          JSON
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'messages' ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg",
                  message.source === 'company' ? "bg-indigo-500/10" : "bg-emerald-500/10"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white/70">
                    {message.source === 'company' ? 'Company Context' : 'Product Context'}
                  </span>
                  <span className="text-xs text-white/50">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-white/90">
                  <span className="font-medium">{message.role === 'user' ? 'User: ' : 'Assistant: '}</span>
                  {message.content}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-white/50 text-sm">
                No messages collected yet. Start a conversation with either assistant.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleExtractJson}
              disabled={isLoading}
              className={cn(
                "w-full px-3 py-2 rounded transition-colors text-sm text-white font-medium",
                isLoading
                  ? "bg-white/5 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20"
              )}
            >
              {isLoading ? "Extracting..." : "Extract JSON"}
            </button>
            {jsonResponse ? (
              <pre className="p-4 rounded-lg bg-black/20 text-white/90 text-sm overflow-auto">
                {jsonResponse}
              </pre>
            ) : (
              <div className="text-center text-white/50 text-sm">
                Click "Extract JSON" to process the collected messages.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
