'use client';

import GlobalComponents from '~/components/global';

// Extend the global Window interface
declare global {
  interface Window {
    GlobalComponents: typeof GlobalComponents;
  }
}

// Add GlobalComponents to the global scope
if (typeof window !== 'undefined') {
  window.GlobalComponents = GlobalComponents;
}

// Also add it to the global scope for non-window contexts
(global as any).GlobalComponents = GlobalComponents;
