'use client';

import React from 'react';
import { 
  Target, Users, FileSearch, Goal,
  UserCheck, Package, Building2, LineChart,
  Plus, X, LucideIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

export type ContextType = 
  | 'opportunity'
  | 'customer'
  | 'requirements'
  | 'goals'
  | 'salesperson'
  | 'product'
  | 'standards'
  | 'metrics'
  | 'plus';

interface ContextButtonProps {
  type: ContextType;
  percentage: number;
  title: string;
  description: string;
  isEmpty?: boolean;
  color?: string;
}

const getContextIcon = (type: ContextType): LucideIcon => {
  const icons = {
    opportunity: Target,
    customer: Users,
    requirements: FileSearch,
    goals: Goal,
    salesperson: UserCheck,
    product: Package,
    standards: Building2,
    metrics: LineChart,
    plus: Plus
  };
  
  return icons[type];
};

export const ContextButton: React.FC<ContextButtonProps> = ({
  type,
  percentage,
  title,
  description,
  isEmpty = false,
  color = 'rgb(16, 185, 129)' // Default to emerald green if no color provided
}) => {
  const normalizedPercentage = Math.min(Math.max(0, percentage), 100);
  const Icon = isEmpty ? Plus : getContextIcon(type);

  return (
    <Dialog>
      {/* <HoverCard openDelay={50} closeDelay={75}>
        <HoverCardTrigger asChild> */}
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer mb-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                {!isEmpty && (
                  <div 
                    className="absolute bottom-0 left-0 w-full transition-all duration-700 ease-out"
                    style={{ 
                      height: `${normalizedPercentage}%`,
                      backgroundColor: color,
                      opacity: 0.9
                    }}
                  >
                    <div className="absolute inset-0">
                      <div className="absolute top-0 h-px w-full 
                        bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative transition-colors duration-300 
                    ${isEmpty ? 'text-white/40' : 
                      normalizedPercentage > 50 ? 'text-white' : 'text-white/80'}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300">
                  <div className="absolute inset-0 bg-white/5" />
                </div>
              </div>

              {!isEmpty && (
                <div 
                  className={`absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-700
                    ${normalizedPercentage > 75 ? 'opacity-30' : ''}`}
                  style={{
                    background: `radial-gradient(circle at center, ${color}, transparent 70%)`
                  }}
                />
              )}
            </div>
          </DialogTrigger>
        {/* </HoverCardTrigger>

        <HoverCardContent
          side="right"
          align="center"
          sideOffset={8}
          className="w-80 bg-gradient-to-b from-gray-900 to-gray-950 
            border border-white/10 shadow-lg shadow-emerald-500/10"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-md bg-gray-800/50">
                <div className="text-gray-200">
                  <Icon className="w-8 h-8" />
                </div>
              </div>
              <h4 className="text-sm font-semibold text-white">{title}</h4>
            </div>
            
            <div className="space-y-1">
              {!isEmpty && (
                <div className="flex items-center space-x-2">
                  <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${normalizedPercentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color }}>
                    {normalizedPercentage}%
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-400">{description}</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard> */}

      <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 
        border border-white/10 shadow-lg shadow-emerald-500/10">
        <DialogClose className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100">
          <X className="h-4 w-4 text-gray-300" />
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gray-800/50">
              <div className="text-gray-200">
                <Icon className="w-8 h-8" />
              </div>
            </div>
            <div>
              {!isEmpty && (
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${normalizedPercentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium" style={{ color }}>
                    {normalizedPercentage}%
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};