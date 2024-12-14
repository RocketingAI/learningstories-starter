"use client";

import { useAuth } from "@clerk/nextjs";

export default function TestPublicPage() {
  const { isLoaded, userId, sessionId } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Public Test Page</h1>
      <div className="space-y-2">
        <p>This page is publicly accessible.</p>
        <p>Authentication Status:</p>
        <ul className="list-disc pl-6">
          <li>Is Loaded: {isLoaded ? "Yes" : "No"}</li>
          <li>User ID: {userId || "Not logged in"}</li>
          <li>Session ID: {sessionId || "No active session"}</li>
        </ul>
      </div>
    </div>
  );
}
