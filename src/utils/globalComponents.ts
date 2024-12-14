'use client';

import GlobalComponents from '~/components/global';

// Make components available globally
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

// Add components to window object in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).GlobalComponents = GlobalComponents;
}

export { GlobalComponents };
