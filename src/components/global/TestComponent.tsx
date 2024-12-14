import React from 'react';

interface TestComponentProps {
  children?: React.ReactNode;
}

export const TestComponent: React.FC<TestComponentProps> = ({ children }) => {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-md">
      {children || 'Test Component'}
    </div>
  );
};