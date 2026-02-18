import React from 'react';
import { theme } from '../../services/designSystem';

interface ArchitectureDiagramProps {
  className?: string;
}

/**
 * Layered Architecture Visualization
 * Data Layer → Feature Store → Training → Inference → Feedback Loop
 */
export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ className = '' }) => {
  const layers = [
    { name: 'Feedback Loop', color: theme.colors.gradient.orange },
    { name: 'Inference', color: theme.colors.gradient.pink },
    { name: 'Training', color: theme.colors.gradient.purple },
    { name: 'Feature Store', color: theme.colors.gradient.indigo },
    { name: 'Data Layer', color: theme.colors.semantic.neutral }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {layers.map((layer, index) => (
        <div key={index} className="relative">
          {/* Layer box */}
          <div
            className="rounded-[24px] p-6 border-2 transition-all hover:shadow-lg"
            style={{
              backgroundColor: index === layers.length - 1 ? theme.colors.surface : theme.colors.pureWhite,
              borderColor: layer.color,
              borderWidth: '2px'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="font-bold text-lg mb-1"
                  style={{
                    color: theme.colors.obsidian
                  }}
                >
                  {layer.name}
                </div>
                {index < layers.length - 1 && (
                  <div
                    className="text-xs font-light"
                    style={{
                      color: theme.typography.body.color
                    }}
                  >
                    {index === 0 && 'Real-time predictions and model serving'}
                    {index === 1 && 'Model training and optimization'}
                    {index === 2 && 'Feature engineering and storage'}
                    {index === 3 && 'Raw data ingestion and processing'}
                  </div>
                )}
              </div>
              
              {/* Gradient accent */}
              <div
                className="w-2 h-12 rounded-full"
                style={{
                  background: `linear-gradient(180deg, ${layer.color}, ${layers[Math.min(index + 1, layers.length - 1)].color})`
                }}
              />
            </div>
          </div>
          
          {/* Arrow between layers */}
          {index < layers.length - 1 && (
            <div className="flex justify-center my-2">
              <div
                className="w-0.5 h-6"
                style={{
                  background: `linear-gradient(180deg, ${layer.color}, ${layers[index + 1].color})`
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
