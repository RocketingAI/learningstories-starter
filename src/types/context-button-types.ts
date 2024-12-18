export type ContextButtonType = 
  | 'customer'
  | 'company'
  | 'salesperson'
  | 'deal'
  | 'lead'
  | 'revenue'
  | 'meeting'
  | 'contract'
  | 'plus'
  ;

export interface ContextButtonData {
  type: ContextButtonType;
  percentage: number;
  title: string;
  description: string;
  color?: string;
  isEmpty?: boolean;
}

export interface ContextButtonProps {
  layer?: ContextButtonData;
  isEmpty?: boolean;
}