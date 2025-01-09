import { type RealtimeClientEvent, type RealtimeServerEvent } from "~/types/realtime-events";
import { EventDispatcher, type EventHandler } from "./event-dispatcher";

export type ConnectionEvents = {
  onStateChange?: (state: RTCPeerConnectionState) => void;
  onMessage?: (event: RealtimeServerEvent) => void;
  onDataChannelOpen?: () => void;
  onDataChannelClose?: () => void;
};

export class RealtimeConnectionManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaStream: MediaStream | null = null;
  private audioTrack: MediaStreamTrack | null = null;
  private eventDispatcher: EventDispatcher;

  constructor(
    private readonly token: string,
    private readonly model: string = 'gpt-4o-realtime-preview-2024-12-17',
    private readonly events?: ConnectionEvents,
    debug: boolean = false
  ) {
    this.eventDispatcher = new EventDispatcher(debug);
    if (events?.onMessage) {
      this.eventDispatcher.subscribeAll(events.onMessage);
    }
  }

  async connect(): Promise<void> {
    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection();

      // Set up audio playback
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;

      // Handle remote audio tracks
      this.peerConnection.ontrack = (event) => {
        if (this.audioElement) {
          this.audioElement.srcObject = event.streams[0];
        }
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection && this.events?.onStateChange) {
          this.events.onStateChange(this.peerConnection.connectionState);
        }
      };

      // Set up local audio track
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      this.audioTrack = this.mediaStream.getAudioTracks()[0];
      if (this.peerConnection) {
        this.peerConnection.addTrack(this.audioTrack, this.mediaStream);
      }

      // Initially disable the audio track
      this.audioTrack.enabled = false;

      // Create data channel
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.setupDataChannel();

      // Create and set local description
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer to OpenAI
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const sdpResponse = await fetch(`${baseUrl}?model=${this.model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/sdp'
        },
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to establish WebRTC connection');
      }

      // Set remote description
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await this.peerConnection.setRemoteDescription(answer);

    } catch (error) {
      console.error('Connection error:', error);
      this.disconnect();
      throw error;
    }
  }

  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.events?.onDataChannelOpen?.();
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
      this.events?.onDataChannelClose?.();
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const serverEvent = JSON.parse(event.data) as RealtimeServerEvent;
        this.eventDispatcher.dispatch(serverEvent);
      } catch (error) {
        console.error('Error parsing server event:', error);
      }
    };
  }

  // Subscribe to specific event types
  subscribe(eventType: string, handler: EventHandler) {
    return this.eventDispatcher.subscribe(eventType, handler);
  }

  // Subscribe to multiple event types
  subscribeMultiple(eventTypes: string[], handler: EventHandler) {
    return this.eventDispatcher.subscribeMultiple(eventTypes, handler);
  }

  // Subscribe to all events
  subscribeAll(handler: EventHandler) {
    return this.eventDispatcher.subscribeAll(handler);
  }

  // Set debug mode
  setDebugMode(enabled: boolean) {
    this.eventDispatcher.setDebugMode(enabled);
  }

  enableMicrophone(enabled: boolean): void {
    if (this.audioTrack) {
      this.audioTrack.enabled = enabled;
    }
  }

  sendEvent(event: RealtimeClientEvent): boolean {
    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(event));
      return true;
    }
    console.warn('Data channel not ready');
    return false;
  }

  isReady(): boolean {
    return this.dataChannel?.readyState === 'open';
  }

  disconnect(): void {
    // Disable and stop audio track
    if (this.audioTrack) {
      this.audioTrack.enabled = false;
      this.audioTrack.stop();
      this.audioTrack = null;
    }

    // Clean up media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Clean up data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    // Clean up peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Clean up audio element
    if (this.audioElement) {
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }
  }
}
