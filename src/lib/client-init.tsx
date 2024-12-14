'use client';

import GlobalComponents from '~/components/global';

// Initialize global components
if (typeof window !== 'undefined') {
  (window as any).GlobalComponents = GlobalComponents;
}

export default function ClientInit() {
  // This is a client component that will run on the client side
  return null;
}
