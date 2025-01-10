'use client';

import { AlertCircle, CheckCircle2, Loader2, Mic, Radio, WifiOff } from 'lucide-react';
import { cn } from '~/lib/utils';
import { cva } from 'class-variance-authority';

const statusVariants = cva(
  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-muted/50 text-muted-foreground/90",
        success: "bg-green-500/15 text-green-600 dark:text-green-400",
        error: "bg-red-500/15 text-red-600 dark:text-red-400",
        warning: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
        connecting: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface StatusIndicatorProps {
  status: string;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  // Determine variant and icon based on status
  const getStatusConfig = (status: string) => {
    const lowercaseStatus = status.toLowerCase();
    
    if (lowercaseStatus.includes('error') || lowercaseStatus.includes('failed')) {
      return {
        variant: 'error' as const,
        icon: AlertCircle
      };
    }
    
    if (lowercaseStatus.includes('success') || lowercaseStatus.includes('established')) {
      return {
        variant: 'success' as const,
        icon: CheckCircle2
      };
    }
    
    if (lowercaseStatus.includes('connecting') || lowercaseStatus.includes('fetching')) {
      return {
        variant: 'connecting' as const,
        icon: Radio
      };
    }
    
    if (lowercaseStatus.includes('requesting')) {
      return {
        variant: 'warning' as const,
        icon: Mic
      };
    }
    
    if (lowercaseStatus.includes('stopped')) {
      return {
        variant: 'default' as const,
        icon: WifiOff
      };
    }

    return {
      variant: 'default' as const,
      icon: Radio
    };
  };

  const { variant, icon: Icon } = getStatusConfig(status);

  return (
    <div className={cn(
      statusVariants({ variant }),
      "group"
    )}>
      <div className="relative flex items-center">
        {variant === 'connecting' ? (
          <div className="relative">
            <Icon className="w-3.5 h-3.5 animate-pulse" />
            <div className="absolute inset-0 animate-ping opacity-50">
              <Icon className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <Icon className={cn(
            "w-3.5 h-3.5",
            variant === 'warning' && "animate-pulse",
            variant === 'error' && "animate-bounce"
          )} />
        )}
        <span className="relative">
          {status}
          {(variant === 'connecting' || variant === 'warning') && (
            <span className="inline-flex ml-0.5">
              <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce ml-0.5" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-current rounded-full animate-bounce ml-0.5" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
