import React from 'react';
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const LoadingDots = () => {
  return (
    <span className="inline-flex ml-1">
      <span className="opacity-0 animate-[dot_1.4s_infinite]">.</span>
      <span className="opacity-0 animate-[dot_1.4s_0.2s_infinite]">.</span>
      <span className="opacity-0 animate-[dot_1.4s_0.4s_infinite]">.</span>
    </span>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Initial text that appears to stream in */}
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        <div className="p-4">
          <p className="text-sm text-muted-foreground flex items-center">
            <span>Generating. Just a few more seconds</span>
            <LoadingDots />
          </p>
        </div>
      </div>

      {/* Loading skeleton lines */}
      <div className={cn(
        "flex gap-3 min-h-[4rem] p-4",
        "animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300"
      )}>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes dot {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
