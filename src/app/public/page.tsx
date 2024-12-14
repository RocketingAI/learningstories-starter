"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function PublicPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Public Page</h1>
      <div className="space-y-4">
        <p>This is a public page. Anyone can see this.</p>
        
        {isLoaded && (
          <div>
            {isSignedIn ? (
              <p>Welcome back, {user.firstName}!</p>
            ) : (
              <p>You are not signed in.</p>
            )}
          </div>
        )}

        <div className="space-x-4">
          <Link href="/protected" className="text-blue-500 hover:underline">
            Go to Protected Page
          </Link>
          {!isSignedIn && (
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
