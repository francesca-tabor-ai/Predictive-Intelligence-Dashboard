import React from 'react';
import { theme } from '../../services/designSystem';

interface ROIChartProps {
  data?: Array<{ year: number; benefit: string; cost: string; net: string }>;
  className?: string;
}

/**
 * ROI Economic Impact Visualization
 * Shows 3-year projection with benefits, costs, and net value
 */
export const ROIChart: React.FC<ROIChartProps> = ({ data, className = '' }) => {
  // Default data if none provided
  const chartData = data || [
    { year: 1, benefit: '£107.5M', cost: '£15M', net: '£92.5M' },
    { year: 2, benefit: '£122.5M', cost: '£20M', net: '£102.5M' },
    { year: 3, benefit: '£140M', cost: '£25M', net: '£115M' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{
          color: theme.typography.metadata.color
        }}
      >
        THREE-YEAR PROJECTION
      </div>
      
      <div className="space-y-4">
        {chartData.map((item, index) => {
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div
                  className="font-bold text-sm"
                  style={{
                    color: theme.colors.obsidian
                  }}
                >
                  Year {item.year}
                </div>
                <div
                  className="font-bold text-lg"
                  style={{
                    color: theme.colors.semantic.exceptional,
                    fontFamily: theme.typography.data.fontFamily
                  }}
                >
                  {item.net}
                </div>
              </div>
              
              {/* Benefit and Cost as text labels */}
              <div className="space-y-1">
                <div
                  className="text-xs font-bold"
                  style={{
                    color: theme.colors.obsidian
                  }}
                >
                  Benefit: {item.benefit}
                </div>
                <div
                  className="text-xs font-bold"
                  style={{
                    color: theme.colors.obsidian
                  }}
                >
                  Cost: {item.cost}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
