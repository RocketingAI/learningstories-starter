"use client";

import { useAuth } from "@clerk/nextjs";

export default function TestPrivatePage() {
  const { userId, sessionId } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Private Test Page</h1>
      <div className="space-y-2">
        <p>This page is private and requires authentication.</p>
        <p>If you can see this, you are authenticated!</p>
        <p>Your Details:</p>
        <ul className="list-disc pl-6">
          <li>User ID: {userId}</li>
          <li>Session ID: {sessionId}</li>
        </ul>
      </div>
    </div>
  );
}
