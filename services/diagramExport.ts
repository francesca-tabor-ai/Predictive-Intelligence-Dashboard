import { Diagram } from '../types';
import { renderDiagramSVG } from './diagramRenderer';

/**
 * Export a diagram as SVG
 */
export async function exportDiagramSVG(diagram: Diagram): Promise<void> {
  const svg = renderDiagramSVG(diagram);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${diagram.name || diagram.id}.svg`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Export a diagram as PNG
 */
export async function exportDiagramPNG(diagram: Diagram): Promise<void> {
  const svg = renderDiagramSVG(diagram);
  
  // Create an image from SVG
  const img = new Image();
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Extract dimensions from SVG or use defaults
      const widthMatch = svg.match(/width="(\d+)"/);
      const heightMatch = svg.match(/height="(\d+)"/);
      const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      
      let width = 800;
      let height = 600;
      
      if (viewBoxMatch) {
        width = parseInt(viewBoxMatch[1]);
        height = parseInt(viewBoxMatch[2]);
      } else if (widthMatch && heightMatch) {
        width = parseInt(widthMatch[1]);
        height = parseInt(heightMatch[1]);
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        
        const pngUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${diagram.name || diagram.id}.png`;
        link.click();
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    
    // Use data URL for better compatibility
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to read SVG file'));
    };
    reader.readAsDataURL(svgBlob);
  });
}

/**
 * Export all diagrams as a ZIP file
 */
export async function exportAllDiagrams(diagrams: Diagram[], format: 'svg' | 'png' = 'svg'): Promise<void> {
  // For now, we'll download them individually
  // A proper ZIP implementation would require a library like JSZip
  // This is a simplified version that downloads all diagrams sequentially
  
  for (let i = 0; i < diagrams.length; i++) {
    const diagram = diagrams[i];
    if (format === 'svg') {
      await exportDiagramSVG(diagram);
      // Small delay to prevent browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      await exportDiagramPNG(diagram);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}

/**
 * Get diagram SVG as data URL (for preview)
 */
export function getDiagramDataURL(diagram: Diagram): string {
  const svg = renderDiagramSVG(diagram);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}
