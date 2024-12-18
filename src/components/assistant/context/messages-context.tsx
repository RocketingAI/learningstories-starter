'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Message = {
  content: string;
  role: 'user' | 'assistant';
  source: 'company' | 'product';
  timestamp: number;
};

type MessagesContextType = {
  messages: Message[];
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
};

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((message: Omit<Message, 'timestamp'>) => {
    setMessages(prev => [...prev, { ...message, timestamp: Date.now() }]);
  }, []);

  return (
    <MessagesContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}
