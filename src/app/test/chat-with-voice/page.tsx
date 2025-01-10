'use client';

import { ChatWithVoice } from '~/components/chat/chat-with-voice';

export default function TestChatWithVoicePage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">Chat with Voice Test</h1>
      <ChatWithVoice />
    </div>
  );
}
