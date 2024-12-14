import { type ComponentType } from 'react';

// Type for our components
type GlobalComponentsType = {
  [key: string]: ComponentType<any>;
};

// Create the components object with explicit imports
const components: GlobalComponentsType = {};

// Use webpack's require.context to get all component files
const requireComponent = require.context('./', false, /[A-Z]\w+\.(tsx|ts)$/);

// Add each component to our components object
requireComponent.keys().forEach((fileName) => {
  const componentName = fileName.replace(/^\.\/(.*)\.\w+$/, '$1');
  
  if (componentName !== 'index') {
    const componentConfig = requireComponent(fileName);
    components[componentName] = componentConfig[componentName];
  }
});

// Add type information to the export
export type { GlobalComponentsType };
export default components;