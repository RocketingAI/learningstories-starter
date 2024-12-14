// src/hooks/use-subscription-guard.ts
import { useSubscription } from "./use-subscription";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useSubscriptionGuard() {
  const { isSubscribed, isLoading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSubscribed) {
      router.push("/upgrade");
    }
  }, [isSubscribed, isLoading, router]);

  return { isSubscribed, isLoading };
}