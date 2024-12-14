// src/app/pro-features/page.tsx
"use client";

import { useSubscriptionGuard } from "~/hooks/use-subscription-guard";

export default function ProFeaturePage() {
  const { isLoading } = useSubscriptionGuard();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Pro Features</h1>
      {/* Pro-only content here */}
    </div>
  );
}