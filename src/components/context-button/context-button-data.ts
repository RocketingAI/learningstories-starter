import { ContextType } from './context-button';
import { Globe } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ContextButtonData {
  type: ContextType;
  title: string;
  color?: string;
  description: string;
  percentage: number;
  category?: 'dynamic' | 'static';
}

export const ContextButtonDataArray: ContextButtonData[] = [
  {
    type: 'opportunity',
    title: 'Opportunity Context',
    color: 'rgb(16, 185, 129)',  // Emerald green
    description: 'Current opportunity state and key details',
    percentage: 100,
    category: 'dynamic'
  },
  {
    type: 'customer',
    title: 'Customer Context',
    color: 'rgb(52, 211, 153)',  // Lighter emerald
    description: 'Current customer state and key details',
    percentage: 80,
    category: 'dynamic'
  },
  {
    type: 'requirements',
    title: 'Requirements Context',
    color: '#FFA500',  // Orange
    description: 'Current requirements state and key details',
    percentage: 60,
    category: 'dynamic'
  },
  {
    type: 'salesperson',
    title: 'Salesperson Context',
    color: '#FFA500',  // Orange
    description: 'Current salesperson state and key details',
    percentage: 40,
    category: 'dynamic'
  },
  {
    type: 'product',
    title: 'Product Context',
    color: '#FFA500',  // Orange
    description: 'Current product state and key details',
    percentage: 20,
    category: 'dynamic'
  },
  {
    type: 'plus',
    title: 'Metrics Context',
    color: '#FFA500',  // Orange
    description: 'Current metrics state and key details',
    percentage: 0,
    category: 'dynamic'
  }
];