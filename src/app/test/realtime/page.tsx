'use client';

import { WebRTCTest } from '~/components/realtime/webrtc-test';

export default function TestRealtimePage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">Realtime API Test Page</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">WebRTC Test</h2>
          <WebRTCTest />
        </section>
      </div>
    </div>
  );
}
