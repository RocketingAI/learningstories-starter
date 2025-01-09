'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { RealtimeConnectionManager } from '~/lib/realtime/connection-manager';
import { type RealtimeServerEvent, type RealtimeResponseCreateEvent } from '~/types/realtime-events';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// Message types for conversation history
type MessageRole = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status: 'complete' | 'streaming' | 'error';
}

export function WebRTCTest() {
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const connectionRef = useRef<RealtimeConnectionManager | null>(null);
  const currentMessageRef = useRef<string>('');
  const messageIdCounter = useRef(0);

  const createMessage = (role: MessageRole, content: string, status: Message['status'] = 'complete'): Message => ({
    id: `${role}-${messageIdCounter.current++}`,
    role,
    content,
    timestamp: Date.now(),
    status,
  });

  const updateLastMessage = (update: Partial<Message>) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage) {
        newMessages[newMessages.length - 1] = { ...lastMessage, ...update };
      }
      return newMessages;
    });
  };

  const setupEventHandlers = (connection: RealtimeConnectionManager) => {
    // Subscribe to text events
    connection.subscribeMultiple([
      'response.text.delta',
      'response.text.done'
    ], (event) => {
      switch (event.type) {
        case 'response.text.delta':
          currentMessageRef.current += event.delta;
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && lastMessage.status === 'streaming') {
              return prev.map((msg, i) => 
                i === prev.length - 1 
                  ? { ...msg, content: currentMessageRef.current }
                  : msg
              );
            } else {
              return [
                ...prev,
                createMessage('assistant', currentMessageRef.current, 'streaming')
              ];
            }
          });
          break;
        
        case 'response.text.done':
          updateLastMessage({
            content: event.text,
            status: 'complete'
          });
          currentMessageRef.current = '';
          break;
      }
    });

    // Subscribe to audio input events
    connection.subscribeMultiple([
      'input_audio_buffer.speech_started',
      'input_audio_buffer.speech_stopped',
      'input_audio_buffer.committed',
      'conversation.item.created',
      'response.audio_transcript.delta',
      'response.audio_transcript.done',
      'conversation.item.input_audio_transcription.completed',
      'conversation.item.input_audio_transcription.failed'
    ], (event) => {
      switch (event.type) {
        case 'input_audio_buffer.speech_started':
          // Show that we're actively speaking
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'system' && lastMessage.content.includes('Listening')) {
              return prev.map((msg, i) => 
                i === prev.length - 1 
                  ? { ...msg, content: '🎤 Speaking...', status: 'streaming' }
                  : msg
              );
            }
            return prev;
          });
          break;

        case 'input_audio_buffer.speech_stopped':
          // Update the message to show we're processing
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'system' && lastMessage.content.includes('Speaking')) {
              return prev.map((msg, i) => 
                i === prev.length - 1 
                  ? { ...msg, content: '🎤 Processing speech...', status: 'streaming' }
                  : msg
              );
            }
            return prev;
          });
          break;

        case 'conversation.item.created':
          // Show the transcribed text if available
          console.log('Conversation item created:', JSON.stringify(event.item, null, 2));
          if (event.item.type === 'message' && event.item.role === 'user') {
            // Handle array of content parts
            const contentPart = Array.isArray(event.item.content) ? event.item.content[0] : event.item.content;
            let text = null;
            
            if (contentPart) {
              if (contentPart.type === 'input_audio') {
                text = contentPart.transcript;
              } else {
                text = contentPart.text;
              }
            }

            if (text) {
              console.log('Found text/transcript content:', text);
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'system' && lastMessage.status === 'streaming') {
                  // Remove the system message and add the user message
                  return [
                    ...prev.slice(0, -1),
                    createMessage('user', text, 'complete')
                  ];
                }
                return [
                  ...prev,
                  createMessage('user', text, 'complete')
                ];
              });

              // Send the response create event
              if (connectionRef.current?.isReady()) {
                connectionRef.current.sendEvent({
                  type: 'response.create',
                  response: {
                    modalities: ['audio', 'text'],
                    instructions: text
                  }
                });
              }
            } else {
              // If no transcript yet, show a temporary message
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'system' && lastMessage.content.includes('Speaking')) {
                  return prev.map((msg, i) => 
                    i === prev.length - 1 
                      ? { ...msg, content: '🎤 Processing your message...', status: 'streaming' }
                      : msg
                  );
                }
                return prev;
              });
              console.log('No text/transcript content found yet:', event.item);
            }
          } else {
            console.log('Item is not a user message:', event.item);
          }
          break;

        case 'response.audio_transcript.delta':
          // Update the transcription as it comes in
          const transcript = event.transcript;
          if (transcript) {
            console.log('Audio transcript delta:', transcript);
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'assistant' && lastMessage.status === 'streaming') {
                return prev.map((msg, i) => 
                  i === prev.length - 1 
                    ? { ...msg, content: transcript }
                    : msg
                );
              }
              return [
                ...prev,
                createMessage('assistant', transcript, 'streaming')
              ];
            });
          }
          break;

        case 'response.audio_transcript.done':
          // Finalize the transcription
          if (event.transcript) {
            updateLastMessage({
              content: event.transcript,
              status: 'complete'
            });
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          console.log('Transcription completed:', JSON.stringify(event, null, 2));
          if (event.transcript) {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === 'system' && lastMessage.status === 'streaming') {
                return [
                  ...prev.slice(0, -1),
                  createMessage('user', event.transcript, 'complete')
                ];
              }
              return [
                ...prev,
                createMessage('user', event.transcript, 'complete')
              ];
            });

            // Send the response create event
            if (connectionRef.current?.isReady()) {
              connectionRef.current.sendEvent({
                type: 'response.create',
                response: {
                  modalities: ['audio', 'text'],
                  instructions: event.transcript
                }
              });
            }
          }
          break;

        case 'conversation.item.input_audio_transcription.failed':
          console.error('Transcription failed:', JSON.stringify(event, null, 2));
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'system' && lastMessage.status === 'streaming') {
              return [
                ...prev.slice(0, -1),
                createMessage('system', '❌ Failed to transcribe audio', 'error')
              ];
            }
            return [
              ...prev,
              createMessage('system', '❌ Failed to transcribe audio', 'error')
            ];
          });
          break;

        case 'conversation.item.content_updated':
          console.log('Content updated:', JSON.stringify(event, null, 2));
          if (event.item?.content && Array.isArray(event.item.content)) {
            const contentPart = event.item.content[0];
            if (contentPart?.type === 'input_audio' && contentPart.transcript) {
              console.log('Found transcript in content update:', contentPart.transcript);
              setMessages(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'system' && lastMessage.status === 'streaming') {
                  return [
                    ...prev.slice(0, -1),
                    createMessage('user', contentPart.transcript, 'complete')
                  ];
                }
                return [
                  ...prev,
                  createMessage('user', contentPart.transcript, 'complete')
                ];
              });

              // Send the response create event
              if (connectionRef.current?.isReady()) {
                connectionRef.current.sendEvent({
                  type: 'response.create',
                  response: {
                    modalities: ['audio', 'text'],
                    instructions: contentPart.transcript
                  }
                });
              }
            }
          }
          break;
      }
    });

    // Subscribe to audio transcription events
    connection.subscribeMultiple([
      'audio.transcript.delta',
      'audio.transcript.done'
    ], (event) => {
      switch (event.type) {
        case 'audio.transcript.delta':
          // Update or create a transcript message
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'user' && lastMessage.status === 'streaming') {
              return prev.map((msg, i) => 
                i === prev.length - 1 
                  ? { ...msg, content: event.transcript }
                  : msg
              );
            } else {
              return [
                ...prev,
                createMessage('user', event.transcript, event.is_final ? 'complete' : 'streaming')
              ];
            }
          });
          break;

        case 'audio.transcript.done':
          // Create response.create event when we have final transcript
          updateLastMessage({
            content: event.transcript,
            status: 'complete'
          });
          
          if (connectionRef.current?.isReady()) {
            connectionRef.current.sendEvent({
              type: 'response.create',
              response: {
                modalities: ['audio', 'text'],
                instructions: event.transcript
              }
            });
          }
          break;
      }
    });

    // Subscribe to audio response events
    connection.subscribeMultiple([
      'response.audio.start',
      'response.audio.chunk',
      'response.audio.done'
    ], (event) => {
      switch (event.type) {
        case 'response.audio.start':
          setIsPlayingAudio(true);
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && lastMessage.status === 'streaming') {
              return prev;
            }
            return [
              ...prev,
              createMessage('assistant', '🔊 Speaking...', 'streaming')
            ];
          });
          break;

        case 'response.audio.done':
          setIsPlayingAudio(false);
          updateLastMessage({
            content: '🔊 Audio response completed',
            status: 'complete'
          });
          break;
      }
    });

    // Subscribe to error events
    connection.subscribe('text.error', (event) => {
      if ('error' in event) {
        console.error('Received text error:', event.error);
        setMessages(prev => [
          ...prev,
          createMessage('system', `Error: ${event.error.message}`, 'error')
        ]);
      }
    });

    // Subscribe to audio error events
    connection.subscribe('audio.error', (event) => {
      if ('error' in event) {
        console.error('Received audio error:', event.error);
        setMessages(prev => [
          ...prev,
          createMessage('system', `Audio Error: ${event.error.message}`, 'error')
        ]);
        setIsListening(false);
        setIsPlayingAudio(false);
      }
    });

    // Subscribe to response completion
    connection.subscribe('response.done', (event) => {
      currentMessageRef.current = '';
      updateLastMessage({ status: 'complete' });
    });

    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      connection.setDebugMode(true);
    }
  };

  const connect = async () => {
    try {
      setError(null);
      setMessages([]);
      currentMessageRef.current = '';
      
      // First get a session token
      const sessionResponse = await fetch('/api/realtime/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          modalities: ['audio', 'text'],
          instructions: 'You are a friendly assistant.',
          input_audio_transcription: {
            model: 'whisper-1'
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
            create_response: false
          },
          voice: 'sage'
        }),
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const session = await sessionResponse.json();
      
      // Create and store connection manager
      connectionRef.current = new RealtimeConnectionManager(
        session.client_secret.value,
        'gpt-4o-realtime-preview-2024-12-17',
        {
          onStateChange: setConnectionState,
          onDataChannelOpen: () => {
            setIsReady(true);
            setMessages(prev => [...prev, createMessage('system', 'Connection ready. Type a message or click the microphone to speak.')]);
          },
          onDataChannelClose: () => {
            setIsReady(false);
            setIsListening(false);
          }
        },
        process.env.NODE_ENV === 'development' // Enable debug mode in development
      );

      // Set up event handlers
      setupEventHandlers(connectionRef.current);

      // Connect
      await connectionRef.current.connect();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      console.error('Connection error:', err);
    }
  };

  const sendTextMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (connectionRef.current?.isReady()) {
      currentMessageRef.current = ''; // Reset for new response
      setMessages(prev => [...prev, createMessage('user', inputMessage)]);
      
      connectionRef.current.sendEvent({
        type: 'response.create',
        response: {
          modalities: ['text'], // Only request text response for typed messages
          instructions: inputMessage
        }
      });
      
      setInputMessage(''); // Clear input after sending
    }
  };

  const handleMicrophoneClick = () => {
    if (isListening) {
      setIsListening(false);
      // Don't clear messages when stopping microphone
      if (connectionRef.current?.isReady()) {
        connectionRef.current.enableMicrophone(false);
      }
    } else {
      setIsListening(true);
      setMessages(prev => [
        ...prev,
        createMessage('system', '🎤 Listening...', 'streaming')
      ]);
      if (connectionRef.current?.isReady()) {
        connectionRef.current.enableMicrophone(true);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const disconnect = () => {
    connectionRef.current?.disconnect();
    connectionRef.current = null;
    setConnectionState('disconnected');
    setIsReady(false);
    setIsListening(false);
    currentMessageRef.current = '';
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <Card className="w-[600px] mx-auto my-8">
      <CardHeader>
        <CardTitle>WebRTC Test</CardTitle>
        <CardDescription>
          Test WebRTC connection with the Realtime API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={connect}
            disabled={connectionState !== 'disconnected'}
          >
            Connect
          </Button>
          <Button
            onClick={disconnect}
            disabled={connectionState === 'disconnected'}
            variant="destructive"
          >
            Disconnect
          </Button>
        </div>

        <div className="text-sm space-x-4">
          <span>Connection State: <span className="font-mono">{connectionState}</span></span>
          <span>Data Channel: <span className="font-mono">{isReady ? 'Ready' : 'Not Ready'}</span></span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-900 rounded-md">
            {error}
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-md space-y-2 max-h-[300px] overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`font-mono text-sm whitespace-pre-wrap p-2 rounded ${
                msg.role === 'assistant' 
                  ? 'bg-blue-50' 
                  : msg.role === 'system' 
                    ? 'bg-gray-100 text-gray-600 italic'
                    : 'bg-green-50'
              } ${msg.status === 'streaming' ? 'border-l-4 border-blue-400' : ''}`}
            >
              <span className="font-bold">
                {msg.role === 'assistant' ? 'Assistant: ' : msg.role === 'user' ? 'You: ' : ''}
              </span>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isReady || isListening}
          />
          <Button 
            onClick={sendTextMessage}
            disabled={!isReady || !inputMessage.trim() || isListening}
          >
            Send
          </Button>
          <Button
            onClick={handleMicrophoneClick}
            disabled={!isReady}
            variant={isListening ? "destructive" : "secondary"}
            className="relative"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isPlayingAudio && (
              <span className="absolute -top-1 -right-1">
                <Volume2 className="h-3 w-3 text-blue-500" />
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
