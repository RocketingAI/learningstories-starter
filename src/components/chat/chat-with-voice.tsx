'use client';

import { useChatWithVoice } from '~/lib/realtime/use-chat-with-voice';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { StatusIndicator } from './status-indicator';
import { ChatInput } from './chat-input';
import { MessageContainer } from './message-container';

export function ChatWithVoice() {
  const {
    messages,
    inputText,
    setInputText,
    sendTextMessage,
    isProcessing,
    isVoiceActive,
    status,
    audioIndicatorRef,
    currentVolume,
    startVoiceSession,
    stopVoiceSession,
  } = useChatWithVoice('alloy');

  return (
    <Card className={cn(
      "w-[600px] mx-auto",
      "flex flex-col",
      "h-[800px]" // Fixed height for better layout
    )}>
      {/* Header */}
      <div className="flex-none px-4 py-3 border-b">
        <h2 className="text-xl font-semibold">Chat with Voice</h2>
        <p className="text-sm text-muted-foreground">
          Test the combined chat and voice interface
        </p>
        {status && (
          <div className="mt-3">
            <StatusIndicator status={status} />
          </div>
        )}
      </div>

      {/* Messages */}
      <MessageContainer messages={messages} />

      {/* Input area */}
      <div className="flex-none">
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          sendTextMessage={sendTextMessage}
          isProcessing={isProcessing}
          isVoiceActive={isVoiceActive}
          currentVolume={currentVolume}
          audioIndicatorRef={audioIndicatorRef}
          onStartVoice={startVoiceSession}
          onStopVoice={stopVoiceSession}
        />
      </div>
    </Card>
  );
}
