'use client';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Loader2, Mic, MicOff, Send } from 'lucide-react';
import { cn } from '~/lib/utils';
import { useRef, useEffect } from 'react';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  sendTextMessage: () => void;
  isProcessing: boolean;
  isVoiceActive: boolean;
  currentVolume: number;
  audioIndicatorRef: React.RefObject<HTMLDivElement>;
  onStartVoice: () => void;
  onStopVoice: () => void;
}

export function ChatInput({
  inputText,
  setInputText,
  sendTextMessage,
  isProcessing,
  isVoiceActive,
  currentVolume,
  audioIndicatorRef,
  onStartVoice,
  onStopVoice,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when switching from voice to text
  useEffect(() => {
    if (!isVoiceActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVoiceActive]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-2 p-4 transition-colors duration-200",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-t"
      )}
    >
      {/* Voice button with indicator ring */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-transform duration-200",
            isVoiceActive ? "scale-150 opacity-0" : "scale-100 opacity-0",
            "bg-primary/10"
          )}
        />
        <Button
          onClick={() => isVoiceActive ? onStopVoice() : onStartVoice()}
          variant={isVoiceActive ? "destructive" : "secondary"}
          size="icon"
          className={cn(
            "relative h-10 w-10 shrink-0",
            "transition-transform duration-200",
            isVoiceActive && "scale-110"
          )}
          disabled={isProcessing}
        >
          {isVoiceActive ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          
          {/* Voice activity ring */}
          {isVoiceActive && (
            <div 
              className="absolute inset-0 rounded-full border-2 border-destructive animate-ping"
              style={{
                opacity: Math.min(0.5, currentVolume)
              }}
            />
          )}
        </Button>
        
        {/* Small volume indicator dot */}
        <div
          ref={audioIndicatorRef}
          className={cn(
            "absolute bottom-0 right-0",
            "w-2.5 h-2.5 rounded-full",
            "transition-all duration-150",
            "border-2 border-background",
            isVoiceActive ? "scale-100" : "scale-90 opacity-70"
          )}
          style={{
            backgroundColor: isVoiceActive
              ? `rgba(22, 163, 74, ${Math.max(0.3, currentVolume)})`
              : 'rgb(229, 231, 235)'
          }}
        />
      </div>

      {/* Input field */}
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isVoiceActive ? "Voice mode active..." : "Type a message..."}
          disabled={isProcessing || isVoiceActive}
          className={cn(
            "pr-12 py-6 text-sm",
            "transition-colors duration-200",
            isVoiceActive && "bg-muted/50"
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendTextMessage();
            }
          }}
        />
        
        {/* Send button (absolute positioned) */}
        <Button
          onClick={sendTextMessage}
          disabled={isProcessing || isVoiceActive || !inputText.trim()}
          size="icon"
          variant="ghost"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2",
            "h-8 w-8",
            "hover:bg-primary hover:text-primary-foreground"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
