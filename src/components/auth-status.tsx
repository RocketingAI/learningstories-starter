"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export function AuthStatus() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <p>Welcome, {user.firstName}!</p>
          <SignOutButton>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Sign Out
            </button>
          </SignOutButton>
        </>
      ) : (
        <SignInButton>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  );
}
