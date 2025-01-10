'use client';

import { useWebRTC } from '~/lib/realtime/use-webrtc';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Mic, MicOff } from 'lucide-react';

export function WebRTCTest() {
  const {
    status,
    isSessionActive,
    audioIndicatorRef,
    messages,
    currentVolume,
    handleStartStopClick
  } = useWebRTC('alloy');

  return (
    <Card className="w-[600px] mx-auto">
      <CardHeader>
        <CardTitle>WebRTC Test</CardTitle>
        <CardDescription>
          Test the WebRTC implementation with real-time transcription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleStartStopClick}
            variant={isSessionActive ? "destructive" : "default"}
          >
            {isSessionActive ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop Session
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Session
              </>
            )}
          </Button>
          <div 
            ref={audioIndicatorRef}
            className="w-4 h-4 rounded-full bg-gray-200 transition-colors duration-150"
            style={{
              backgroundColor: isSessionActive 
                ? `rgba(0, 255, 0, ${currentVolume})` 
                : 'rgb(229, 231, 235)'
            }}
          />
        </div>

        {status && (
          <div className="text-sm text-muted-foreground">
            Status: {status}
          </div>
        )}

        <div className="space-y-2 mt-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-50 ml-auto max-w-[80%]' 
                  : 'bg-gray-50 mr-auto max-w-[80%]'
              }`}
            >
              <div className="text-xs text-gray-500 mb-1">
                {message.role} {message.status && `(${message.status})`}
              </div>
              <div className="text-sm">
                {message.text || '...'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
