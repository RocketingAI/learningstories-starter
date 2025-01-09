'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { type RealtimeSessionResponse } from '~/types/realtime';

export function TestSession() {
  const [session, setSession] = useState<RealtimeSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/realtime/session', {
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create session');
      }

      const data = await response.json();
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[600px] mx-auto my-8">
      <CardHeader>
        <CardTitle>Test Realtime Session</CardTitle>
        <CardDescription>
          Create a new realtime session to test the API connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={createSession}
          disabled={loading}
        >
          {loading ? 'Creating Session...' : 'Create New Session'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 text-red-900 rounded-md">
            {error}
          </div>
        )}

        {session && (
          <div className="p-4 bg-green-50 text-green-900 rounded-md space-y-2">
            <div><strong>Session ID:</strong> {session.id}</div>
            <div><strong>Token:</strong> {session.client_secret.value}</div>
            <div><strong>Expires:</strong> {new Date(session.client_secret.expires_at * 1000).toLocaleString()}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
