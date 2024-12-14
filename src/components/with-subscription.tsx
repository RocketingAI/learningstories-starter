// src/components/with-subscription.tsx
import { useSubscription } from "~/hooks/use-subscription";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

export function withSubscription<T extends object>(
  WrappedComponent: ComponentType<T>
) {
  return function SubscriptionProtectedComponent(props: T) {
    const { isSubscribed, isLoading } = useSubscription();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isSubscribed) {
        router.push("/upgrade");
      }
    }, [isSubscribed, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isSubscribed) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage example:
// const ProFeature = withSubscription(YourComponent);