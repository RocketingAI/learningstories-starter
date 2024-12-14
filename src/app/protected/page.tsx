"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ProtectedPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Protected Page</h1>
      <div className="space-y-2">
        <p>Welcome {user.firstName}!</p>
        <p>This is a protected page. You can only see this if you're signed in.</p>
      </div>
    </div>
  );
}
