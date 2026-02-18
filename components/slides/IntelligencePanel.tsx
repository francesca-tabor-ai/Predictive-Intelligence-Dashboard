import React from 'react';
import { theme } from '../../services/designSystem';

interface IntelligencePanelProps {
  children: React.ReactNode;
  variant?: 'default' | 'executive';
  className?: string;
}

/**
 * Heavy Rounded Intelligence Panel
 * Default: White panel with shadow-sm
 * Executive: Dark authority panel with shadow-2xl
 */
export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'executive') {
    return (
      <div 
        className={`rounded-[48px] p-16 ${className}`}
        style={{
          background: theme.colors.deepSpace,
          color: 'white',
          boxShadow: theme.shadows.executive
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-[48px] p-12 shadow-sm border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
};
