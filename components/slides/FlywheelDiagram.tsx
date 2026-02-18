import React from 'react';
import { theme } from '../../services/designSystem';

interface FlywheelDiagramProps {
  className?: string;
}

/**
 * Intelligence Flywheel Visualization
 * Circular flow: Data → Prediction → Decision → Improvement → More Data
 */
export const FlywheelDiagram: React.FC<FlywheelDiagramProps> = ({ className = '' }) => {
  const size = 400;
  const center = size / 2;
  const radius = 140;
  
  // Calculate positions for 5 nodes in a circle
  const nodes = [
    { label: 'Data', angle: -90, x: center, y: center - radius },
    { label: 'Prediction', angle: -18, x: center + radius * 0.95, y: center - radius * 0.31 },
    { label: 'Decision', angle: 54, x: center + radius * 0.59, y: center + radius * 0.81 },
    { label: 'Improvement', angle: 126, x: center - radius * 0.59, y: center + radius * 0.81 },
    { label: 'More Data', angle: 198, x: center - radius * 0.95, y: center - radius * 0.31 }
  ];

  // Create arrow path between nodes
  const createArrowPath = (from: typeof nodes[0], to: typeof nodes[0]) => {
    const startX = from.x;
    const startY = from.y;
    const endX = to.x;
    const endY = to.y;
    
    // Calculate control points for smooth curve
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const controlOffset = distance * 0.3;
    
    const angle = Math.atan2(dy, dx);
    const perpAngle = angle + Math.PI / 2;
    
    const cp1x = startX + Math.cos(angle) * (distance * 0.4) + Math.cos(perpAngle) * controlOffset;
    const cp1y = startY + Math.sin(angle) * (distance * 0.4) + Math.sin(perpAngle) * controlOffset;
    const cp2x = endX - Math.cos(angle) * (distance * 0.4) + Math.cos(perpAngle) * controlOffset;
    const cp2y = endY - Math.sin(angle) * (distance * 0.4) + Math.sin(perpAngle) * controlOffset;
    
    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="flywheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.gradient.indigo} />
            <stop offset="33%" stopColor={theme.colors.gradient.purple} />
            <stop offset="66%" stopColor={theme.colors.gradient.pink} />
            <stop offset="100%" stopColor={theme.colors.gradient.orange} />
          </linearGradient>
        </defs>
        
        {/* Arrow paths */}
        {nodes.map((node, index) => {
          const nextNode = nodes[(index + 1) % nodes.length];
          return (
            <g key={`arrow-${index}`}>
              <path
                d={createArrowPath(node, nextNode)}
                fill="none"
                stroke="url(#flywheelGradient)"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
              />
            </g>
          );
        })}
        
        {/* Arrow marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="url(#flywheelGradient)"
            />
          </marker>
        </defs>
        
        {/* Nodes */}
        {nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="50"
              fill={theme.colors.deepSpace}
              stroke="url(#flywheelGradient)"
              strokeWidth="2"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold"
              style={{
                fontSize: '14px',
                fill: '#FFFFFF'
              }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
