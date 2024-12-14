'use client';

import React from 'react';
import GlobalComponents from '~/components/global';

// Create a context for global components
export const GlobalComponentsContext = React.createContext(GlobalComponents);

// Create a provider component
export function GlobalComponentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalComponentsContext.Provider value={GlobalComponents}>
      {children}
    </GlobalComponentsContext.Provider>
  );
}

// Create a custom hook to use global components
export function useGlobalComponents() {
  return React.useContext(GlobalComponentsContext);
}
