'use client';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isFinal: boolean;
  status?: 'speaking' | 'processing' | 'final';
}

interface UseWebRTCReturn {
  status: string;
  isSessionActive: boolean;
  audioIndicatorRef: React.RefObject<HTMLDivElement | null>;
  messages: Message[];
  currentVolume: number;
  startSession: () => Promise<void>;
  stopSession: () => void;
  handleStartStopClick: () => void;
}

export function useWebRTC(voice: string = 'alloy'): UseWebRTCReturn {
  // Connection states
  const [status, setStatus] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentVolume, setCurrentVolume] = useState(0);

  // Audio refs
  const audioIndicatorRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeIntervalRef = useRef<number | null>(null);

  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  // Transcription state
  const ephemeralMessageIdRef = useRef<string | null>(null);

  function getOrCreateEphemeralMessageId(): string {
    let ephemeralId = ephemeralMessageIdRef.current;
    if (!ephemeralId) {
      ephemeralId = uuidv4();
      ephemeralMessageIdRef.current = ephemeralId;

      const newMessage: Message = {
        id: ephemeralId,
        role: 'user',
        text: '',
        timestamp: new Date().toISOString(),
        isFinal: false,
        status: 'speaking'
      };

      setMessages(prev => [...prev, newMessage]);
    }
    return ephemeralId;
  }

  function updateEphemeralMessage(partial: Partial<Message>) {
    const ephemeralId = ephemeralMessageIdRef.current;
    if (!ephemeralId) return;

    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === ephemeralId) {
          return { ...msg, ...partial };
        }
        return msg;
      })
    );
  }

  function clearEphemeralMessage() {
    ephemeralMessageIdRef.current = null;
  }

  async function handleDataChannelMessage(event: MessageEvent) {
    try {
      const msg = JSON.parse(event.data);
      console.log('Received message:', msg);

      switch (msg.type) {
        case 'input_audio_buffer.speech_started': {
          getOrCreateEphemeralMessageId();
          updateEphemeralMessage({ status: 'speaking' });
          break;
        }

        case 'input_audio_buffer.speech_stopped': {
          updateEphemeralMessage({ status: 'speaking' });
          break;
        }

        case 'input_audio_buffer.committed': {
          updateEphemeralMessage({
            text: 'Processing speech...',
            status: 'processing'
          });
          break;
        }

        case 'conversation.item.input_audio_transcription': {
          const partialText = msg.transcript ?? msg.text ?? 'User is speaking...';
          updateEphemeralMessage({
            text: partialText,
            status: 'speaking',
            isFinal: false
          });
          break;
        }

        case 'conversation.item.input_audio_transcription.completed': {
          updateEphemeralMessage({
            text: msg.transcript || '',
            isFinal: true,
            status: 'final'
          });
          clearEphemeralMessage();
          break;
        }

        case 'response.audio_transcript.delta': {
          const newMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            text: msg.delta,
            timestamp: new Date().toISOString(),
            isFinal: false
          };

          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.isFinal) {
              const updated = [...prev];
              updated[updated.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + msg.delta
              };
              return updated;
            }
            return [...prev, newMessage];
          });
          break;
        }

        case 'response.audio_transcript.done': {
          setMessages(prev => {
            if (prev.length === 0) return prev;
            const updated = [...prev];
            updated[updated.length - 1].isFinal = true;
            return updated;
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error handling data channel message:', error);
    }
  }

  function setupAudioVisualization(stream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateIndicator = () => {
      if (!audioContext) return;
      analyzer.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;

      if (audioIndicatorRef.current) {
        audioIndicatorRef.current.classList.toggle('active', average > 30);
      }
      requestAnimationFrame(updateIndicator);
    };
    updateIndicator();

    audioContextRef.current = audioContext;
  }

  function getVolume(): number {
    if (!analyserRef.current) return 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const float = (dataArray[i] - 128) / 128;
      sum += float * float;
    }
    return Math.sqrt(sum / dataArray.length);
  }

  async function startSession() {
    try {
      setStatus('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      setupAudioVisualization(stream);

      setStatus('Fetching session token...');
      const response = await fetch('/api/realtime/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          modalities: ['audio', 'text'],
          instructions: 'You are a friendly assistant.',
          input_audio_transcription: {
            model: 'whisper-1'
          },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
            create_response: false
          },
          voice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await response.json();
      const token = sessionData.client_secret.value;

      setStatus('Establishing connection...');
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Setup audio element for assistant's voice
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;

      pc.ontrack = (event) => {
        audioEl.srcObject = event.streams[0];

        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(event.streams[0]);
        const inboundAnalyzer = audioCtx.createAnalyser();
        inboundAnalyzer.fftSize = 256;
        src.connect(inboundAnalyzer);
        analyserRef.current = inboundAnalyzer;

        volumeIntervalRef.current = window.setInterval(() => {
          setCurrentVolume(getVolume());
        }, 100);
      };

      const dataChannel = pc.createDataChannel('response');
      dataChannelRef.current = dataChannel;

      dataChannel.onopen = () => {
        const sessionUpdate = {
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            input_audio_transcription: {
              model: 'whisper-1'
            }
          }
        };
        dataChannel.send(JSON.stringify(sessionUpdate));
      };

      dataChannel.onmessage = handleDataChannelMessage;

      pc.addTrack(stream.getTracks()[0]);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17&voice=${voice}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/sdp'
          },
          body: offer.sdp
        }
      );

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      setIsSessionActive(true);
      setStatus('Session established successfully!');
    } catch (err) {
      console.error('startSession error:', err);
      setStatus(`Error: ${err}`);
      stopSession();
    }
  }

  function stopSession() {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (audioIndicatorRef.current) {
      audioIndicatorRef.current.classList.remove('active');
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }

    analyserRef.current = null;
    ephemeralMessageIdRef.current = null;

    setCurrentVolume(0);
    setIsSessionActive(false);
    setStatus('Session stopped');
    setMessages([]);
  }

  function handleStartStopClick() {
    if (isSessionActive) {
      stopSession();
    } else {
      startSession();
    }
  }

  useEffect(() => {
    return () => stopSession();
  }, []);

  return {
    status,
    isSessionActive,
    audioIndicatorRef,
    messages,
    currentVolume,
    startSession,
    stopSession,
    handleStartStopClick
  };
}
