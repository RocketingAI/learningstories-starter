"use client";

import { cn } from "~/lib/utils";

export function LoadingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute w-12 h-12">
        <div className="absolute inset-0 animate-ping-slow rounded-full border border-primary/30" />
        <div className="absolute inset-[2px] animate-ping-slow animation-delay-150 rounded-full border border-primary/30" />
        <div className="absolute inset-[4px] animate-ping-slow animation-delay-300 rounded-full border border-primary/30" />
        <div className="absolute inset-[6px] animate-ping-slow animation-delay-450 rounded-full border border-primary/30" />
      </div>
      <div className="relative w-2 h-2 rounded-full bg-primary animate-pulse" />
    </div>
  );
}
