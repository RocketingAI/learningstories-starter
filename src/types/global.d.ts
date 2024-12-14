import type { ComponentType } from 'react';
import type GlobalComponents from '~/components/global';

declare global {
  // Augment the global namespace
  var GlobalComponents: typeof GlobalComponents;
}
