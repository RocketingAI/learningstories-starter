export type AudioFormat = 'pcm16' | 'g711_ulaw' | 'g711_alaw';
export type VoiceOption = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';
export type Modality = 'text' | 'audio';
export type ToolChoice = 'auto' | 'none' | 'required' | string;

export interface Tool {
  type: 'function';
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface RealtimeSession {
  id?: string;
  object?: 'realtime.session';
  model: string;
  modalities?: Modality[];
  instructions?: string;
  voice?: VoiceOption;
  input_audio_format?: AudioFormat;
  output_audio_format?: AudioFormat;
  input_audio_transcription?: {
    model: string;
  } | null;
  turn_detection?: {
    type: 'server_vad';
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
    create_response: boolean;
  } | null;
  tools?: Tool[];
  tool_choice?: ToolChoice;
  temperature?: number;
  max_response_output_tokens?: number | 'inf';
}

export interface RealtimeSessionResponse extends RealtimeSession {
  client_secret: {
    value: string;
    expires_at: number;
  };
}
