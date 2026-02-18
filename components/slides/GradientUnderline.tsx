import React from 'react';

interface GradientUnderlineProps {
  width?: string;
  className?: string;
}

/**
 * Intelligence Gradient Underline
 * Used sparingly for module headers and active states
 */
export const GradientUnderline: React.FC<GradientUnderlineProps> = ({
  width = '32px',
  className = ''
}) => {
  return (
    <div 
      className={`h-[2px] rounded-full ${className}`}
      style={{
        width,
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 33%, #ec4899 66%, #f97316 100%)'
      }}
    />
  );
};
