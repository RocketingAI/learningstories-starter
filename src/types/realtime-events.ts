// src/types/realtime-events.ts
export type RealtimeModality = 'text' | 'audio';

// Base event type that all events will extend
export interface RealtimeEventBase {
  event_id: string;
  type: string;
}

/** ------------------------------------------------------------------
 * TEXT-RELATED EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeTextDeltaEvent extends RealtimeEventBase {
  type: 'response.text.delta';
  response_id: string;
  item_id: string;
  output_index: number;
  content_index: number;
  delta: string;
}

export interface RealtimeTextDoneEvent extends RealtimeEventBase {
  type: 'response.text.done';
  response_id: string;
  item_id: string;
  output_index: number;
  content_index: number;
  text: string;
}

/** ------------------------------------------------------------------
 * AUDIO-RELATED EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeAudioStartEvent extends RealtimeEventBase {
  type: 'response.audio.start';
  response_id: string;
  item_id: string;
  output_index: number;
}

export interface RealtimeAudioChunkEvent extends RealtimeEventBase {
  type: 'response.audio.chunk';
  response_id: string;
  item_id: string;
  output_index: number;
  chunk: ArrayBuffer;
  timestamp: number;
}

export interface RealtimeAudioDoneEvent extends RealtimeEventBase {
  type: 'response.audio.done';
  response_id: string;
  item_id: string;
  output_index: number;
  duration: number;
}

/** ------------------------------------------------------------------
 * AUDIO TRANSCRIPTION EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeTranscriptDeltaEvent extends RealtimeEventBase {
  type: 'audio.transcript.delta';
  transcript: string;
  is_final: boolean;
}

export interface RealtimeTranscriptDoneEvent extends RealtimeEventBase {
  type: 'audio.transcript.done';
  transcript: string;
}

// conversation.item.input_audio_transcription.* events you’re listening for
export interface ConversationItemInputAudioTranscriptionCompletedEvent extends RealtimeEventBase {
  type: 'conversation.item.input_audio_transcription.completed';
  item_id: string;
  content_index: number;
  transcript: string;
}

export interface ConversationItemInputAudioTranscriptionFailedEvent extends RealtimeEventBase {
  type: 'conversation.item.input_audio_transcription.failed';
  item_id: string;
  content_index: number;
  error: {
    type: string;
    code?: string;
    message: string;
    param?: string;
  };
}

/** ------------------------------------------------------------------
 * AUDIO INPUT EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeAudioInputEvent {
  type: 'audio.input';
  audio: {
    type: 'microphone' | 'file';
    data: ArrayBuffer;
    timestamp: number;
  };
}

export interface AudioBufferSpeechStartedEvent extends RealtimeEventBase {
  type: 'input_audio_buffer.speech_started';
  audio_start_ms: number;
  item_id: string;
}

export interface AudioBufferSpeechStoppedEvent extends RealtimeEventBase {
  type: 'input_audio_buffer.speech_stopped';
  audio_end_ms: number;
  item_id: string;
}

export interface AudioBufferCommittedEvent extends RealtimeEventBase {
  type: 'input_audio_buffer.committed';
  previous_item_id: string;
  item_id: string;
}

/** ------------------------------------------------------------------
 * CONVERSATION ITEM EVENTS
 * -----------------------------------------------------------------*/
export interface ConversationItemCreatedEvent extends RealtimeEventBase {
  type: 'conversation.item.created';
  previous_item_id: string;
  item: {
    id: string;
    type: string;
    role?: string;
    content?: Array<{
      type?: string;
      text?: string;
      transcript?: string;
      audio?: ArrayBuffer;
    }>;
  };
}

/** ------------------------------------------------------------------
 * ERROR EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeErrorEvent extends RealtimeEventBase {
  type: 'text.error' | 'audio.error' | 'error';
  error: {
    message: string;
    type?: string;
    code?: string;
  };
}

/** ------------------------------------------------------------------
 * RESPONSE LIFECYCLE EVENTS
 * -----------------------------------------------------------------*/
export interface RealtimeResponseDoneEvent extends RealtimeEventBase {
  type: 'response.done';
  response: {
    id: string;
    status: 'completed' | 'cancelled' | 'failed';
    output: Array<{
      type: RealtimeModality;
      content?: string;
      duration?: number;
    }>;
  };
}

/** ------------------------------------------------------------------
 * CLIENT EVENTS (EVENTS WE SEND)
 * -----------------------------------------------------------------*/
export interface RealtimeResponseCreateEvent {
  type: 'response.create';
  response: {
    modalities: RealtimeModality[];
    instructions?: string;
  };
}
export interface RealtimeAudioInputEvent {
  type: 'audio.input';
  audio: {
    type: 'microphone' | 'file';
    data: ArrayBuffer;
    timestamp: number;
  };
}

/** ------------------------------------------------------------------
 * UNION TYPE OF ALL SERVER EVENTS
 * -----------------------------------------------------------------*/
export type RealtimeServerEvent =
  | RealtimeTextDeltaEvent
  | RealtimeTextDoneEvent
  | RealtimeAudioStartEvent
  | RealtimeAudioChunkEvent
  | RealtimeAudioDoneEvent
  | AudioBufferSpeechStartedEvent
  | AudioBufferSpeechStoppedEvent
  | AudioBufferCommittedEvent
  | ConversationItemCreatedEvent
  | RealtimeTranscriptDeltaEvent
  | RealtimeTranscriptDoneEvent
  | ConversationItemInputAudioTranscriptionCompletedEvent
  | ConversationItemInputAudioTranscriptionFailedEvent
  | RealtimeErrorEvent
  | RealtimeResponseDoneEvent;

/** ------------------------------------------------------------------
 * UNION TYPE OF ALL CLIENT EVENTS WE CURRENTLY SEND
 * -----------------------------------------------------------------*/
export type RealtimeClientEvent = 
  | RealtimeResponseCreateEvent
  | RealtimeAudioInputEvent;
