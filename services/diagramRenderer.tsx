import React from 'react';
import { Diagram, DiagramSpec } from '../types';
import { theme } from './designSystem';

/**
 * Renders a diagram as SVG based on its spec
 */
export function renderDiagramSVG(diagram: Diagram): string {
  switch (diagram.type) {
    case 'flywheel':
      return renderFlywheelSVG(diagram.spec);
    case 'architecture':
      return renderArchitectureSVG(diagram.spec);
    case 'timeline':
      return renderTimelineSVG(diagram.spec);
    case 'gradient-accent':
      return renderGradientAccentSVG(diagram.spec);
    default:
      return '';
  }
}

function renderFlywheelSVG(spec: DiagramSpec): string {
  const size = spec.size || 400;
  const center = size / 2;
  const radius = spec.radius || 140;
  const nodes = spec.nodes || [
    { label: 'Data' },
    { label: 'Prediction' },
    { label: 'Decision' },
    { label: 'Improvement' },
    { label: 'More Data' }
  ];

  // Calculate positions for nodes in a circle
  const nodePositions = nodes.map((node, index) => {
    const angle = (index * 360) / nodes.length - 90; // Start at top
    const rad = (angle * Math.PI) / 180;
    return {
      label: node.label,
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
      angle
    };
  });

  // Create arrow path between nodes
  const createArrowPath = (from: typeof nodePositions[0], to: typeof nodePositions[0]) => {
    const startX = from.x;
    const startY = from.y;
    const endX = to.x;
    const endY = to.y;
    
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

  const gradientId = `flywheelGradient-${Date.now()}`;
  const arrowId = `arrowhead-${Date.now()}`;

  const paths = nodePositions.map((node, index) => {
    const nextNode = nodePositions[(index + 1) % nodePositions.length];
    return `<path d="${createArrowPath(node, nextNode)}" fill="none" stroke="url(#${gradientId})" stroke-width="3" marker-end="url(#${arrowId})" />`;
  }).join('\n        ');

  const nodeCircles = nodePositions.map((node, index) => `
        <g>
          <circle cx="${node.x}" cy="${node.y}" r="50" fill="${theme.colors.deepSpace}" stroke="url(#${gradientId})" stroke-width="2" />
          <text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-size="14" fill="#FFFFFF">
            ${escapeSVG(node.label)}
          </text>
        </g>
      `).join('\n        ');

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.colors.gradient.indigo}" />
          <stop offset="33%" stop-color="${theme.colors.gradient.purple}" />
          <stop offset="66%" stop-color="${theme.colors.gradient.pink}" />
          <stop offset="100%" stop-color="${theme.colors.gradient.orange}" />
        </linearGradient>
        <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0,0 10,3 0,6" fill="url(#${gradientId})" />
        </marker>
      </defs>
      ${paths}
      ${nodeCircles}
    </svg>
  `;
}

function renderArchitectureSVG(spec: DiagramSpec): string {
  const layers = spec.layers || [
    { name: 'Feedback Loop', description: 'Real-time predictions' },
    { name: 'Inference', description: 'Model training' },
    { name: 'Training', description: 'Feature engineering' },
    { name: 'Feature Store', description: 'Data ingestion' },
    { name: 'Data Layer', description: '' }
  ];

  const width = spec.width || 400;
  const height = spec.height || 500;
  const layerHeight = height / layers.length;
  const colors = [
    theme.colors.gradient.orange,
    theme.colors.gradient.pink,
    theme.colors.gradient.purple,
    theme.colors.gradient.indigo,
    theme.colors.semantic.neutral
  ];

  const layerRects = layers.map((layer, index) => {
    const y = index * layerHeight;
    const color = colors[index] || theme.colors.semantic.neutral;
    const isLast = index === layers.length - 1;
    
    return `
      <g>
        <rect x="0" y="${y}" width="${width}" height="${layerHeight - 10}" rx="24" fill="${isLast ? theme.colors.coolGrey.light : theme.colors.pureWhite}" stroke="${color}" stroke-width="2" />
        <text x="20" y="${y + 30}" font-weight="bold" font-size="18" fill="${theme.colors.obsidian}">
          ${escapeSVG(layer.name)}
        </text>
        ${layer.description ? `
          <text x="20" y="${y + 50}" font-size="12" fill="${theme.typography.body.color}">
            ${escapeSVG(layer.description)}
          </text>
        ` : ''}
        ${!isLast ? `
          <line x1="${width / 2}" y1="${y + layerHeight - 10}" x2="${width / 2}" y2="${y + layerHeight}" stroke="${color}" stroke-width="2" />
        ` : ''}
      </g>
    `;
  }).join('\n      ');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${layerRects}
    </svg>
  `;
}

function renderTimelineSVG(spec: DiagramSpec): string {
  const items = spec.items || [
    { label: 'Phase 1', date: 'Q1 2024', description: 'Foundation' },
    { label: 'Phase 2', date: 'Q2 2024', description: 'Deployment' },
    { label: 'Phase 3', date: 'Q3 2024', description: 'Scaling' }
  ];

  const width = spec.width || 800;
  const height = spec.height || 200;
  const itemWidth = width / items.length;
  const centerY = height / 2;

  const timelineLine = `<line x1="0" y1="${centerY}" x2="${width}" y2="${centerY}" stroke="${theme.colors.gradient.indigo}" stroke-width="3" />`;

  const timelineItems = items.map((item, index) => {
    const x = (index + 0.5) * itemWidth;
    return `
      <g>
        <circle cx="${x}" cy="${centerY}" r="8" fill="${theme.colors.gradient.indigo}" />
        <text x="${x}" y="${centerY - 30}" text-anchor="middle" font-weight="bold" font-size="14" fill="${theme.colors.obsidian}">
          ${escapeSVG(item.label)}
        </text>
        ${item.date ? `
          <text x="${x}" y="${centerY - 15}" text-anchor="middle" font-size="12" fill="${theme.typography.body.color}">
            ${escapeSVG(item.date)}
          </text>
        ` : ''}
        ${item.description ? `
          <text x="${x}" y="${centerY + 30}" text-anchor="middle" font-size="11" fill="${theme.typography.body.color}">
            ${escapeSVG(item.description)}
          </text>
        ` : ''}
      </g>
    `;
  }).join('\n      ');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${timelineLine}
      ${timelineItems}
    </svg>
  `;
}

function renderGradientAccentSVG(spec: DiagramSpec): string {
  const direction = spec.direction || 'diagonal';
  const colors = spec.colors || [
    theme.colors.gradient.indigo,
    theme.colors.gradient.purple,
    theme.colors.gradient.pink,
    theme.colors.gradient.orange
  ];
  const width = spec.width || 400;
  const height = spec.height || 50;

  let gradientDef = '';
  if (direction === 'horizontal') {
    gradientDef = `<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">`;
  } else if (direction === 'vertical') {
    gradientDef = `<linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">`;
  } else {
    gradientDef = `<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">`;
  }

  const stops = colors.map((color, index) => 
    `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}" />`
  ).join('\n          ');

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${gradientDef}
          ${stops}
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#gradient)" />
    </svg>
  `;
}

function escapeSVG(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
