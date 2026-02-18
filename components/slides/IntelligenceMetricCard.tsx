import React from 'react';
import { theme } from '../../services/designSystem';
import { MarkdownText } from './MarkdownText';

interface IntelligenceMetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  impact?: 'exceptional' | 'attractive' | 'neutral' | 'risk';
  className?: string;
}

export const IntelligenceMetricCard: React.FC<IntelligenceMetricCardProps> = ({
  label,
  value,
  subtitle,
  impact,
  className = ''
}) => {
  const impactColors = {
    exceptional: theme.colors.semantic.exceptional,
    attractive: theme.colors.semantic.attractive,
    neutral: theme.colors.semantic.neutral,
    risk: theme.colors.semantic.risk
  };

  return (
    <div 
      className={`bg-white rounded-[32px] p-8 border border-slate-200 hover:shadow-md transition-all ${className}`}
    >
      <div className="space-y-2">
        <div 
          className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
        >
          <MarkdownText>{label}</MarkdownText>
        </div>
        
        <div 
          className="font-black text-4xl text-black"
          style={{
            fontSize: '36px',
            fontWeight: 900,
            lineHeight: 1.1
          }}
        >
          <MarkdownText>{value}</MarkdownText>
        </div>
        
        {subtitle && (
          <div 
            className="font-light text-slate-600"
            style={{
              fontSize: theme.typography.body.fontSize,
              fontWeight: theme.typography.body.fontWeight
            }}
          >
            {subtitle}
          </div>
        )}
        
        {impact && (
          <div className="flex items-center gap-2 pt-2">
            <div 
              className="rounded-full w-2 h-2"
              style={{
                backgroundColor: impactColors[impact]
              }}
            />
            <div 
              className="text-xs font-bold uppercase tracking-wider"
              style={{
                color: impactColors[impact]
              }}
            >
              Impact: {impact.charAt(0).toUpperCase() + impact.slice(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
