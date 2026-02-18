import JSZip from 'jszip';
import { StructuredSlideDeck, Diagram } from '../types';
import { renderDiagramSVG } from './diagramRenderer';

/**
 * Export project as ZIP file containing:
 * - deck.json
 * - /diagrams/*.svg
 * - /diagrams/*.png
 * - deck.pdf (if generated)
 * - deck.pptx (if generated)
 */
export async function exportProject(
  deck: StructuredSlideDeck,
  options: {
    includePDF?: boolean;
    includePPTX?: boolean;
    filename?: string;
  } = {}
): Promise<void> {
  const zip = new JSZip();
  const filename = options.filename || `deck-${Date.now()}`;
  
  // 1. Add deck.json
  const deckJson = JSON.stringify(deck, null, 2);
  zip.file('deck.json', deckJson);
  
  // 2. Add diagrams folder with SVG and PNG files
  const diagramsFolder = zip.folder('diagrams');
  if (diagramsFolder && deck.diagrams && deck.diagrams.length > 0) {
    for (const diagram of deck.diagrams) {
      // Generate SVG
      const svg = renderDiagramSVG(diagram);
      const svgFilename = `${diagram.name || diagram.id}.svg`;
      diagramsFolder.file(svgFilename, svg);
      
      // Generate PNG
      try {
        const pngBlob = await diagramSVGToPNGBlob(svg);
        const pngFilename = `${diagram.name || diagram.id}.png`;
        diagramsFolder.file(pngFilename, pngBlob);
      } catch (error) {
        console.warn(`Failed to generate PNG for diagram ${diagram.id}:`, error);
        // Continue without PNG if conversion fails
      }
    }
  }
  
  // 3. Add PDF if requested and available
  if (options.includePDF && deck.slides.length > 0) {
    try {
      // Generate PDF HTML content
      const pdfBlob = await generatePDFBlob(deck);
      if (pdfBlob) {
        zip.file('deck.pdf', pdfBlob);
      }
    } catch (error) {
      console.warn('Failed to generate PDF for ZIP:', error);
    }
  }
  
  // 4. Add PPTX if requested and available
  if (options.includePPTX && deck.slides.length > 0) {
    try {
      const pptxBlob = await generatePPTXBlob(deck);
      if (pptxBlob) {
        zip.file('deck.pptx', pptxBlob);
      }
    } catch (error) {
      console.warn('Failed to generate PPTX for ZIP:', error);
    }
  }
  
  // 5. Generate and download ZIP
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Convert diagram SVG to PNG blob
 */
async function diagramSVGToPNGBlob(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        // Extract dimensions from SVG
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
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Set white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create PNG blob'));
            return;
          }
          resolve(blob);
        }, 'image/png');
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read SVG file'));
    };
    
    reader.readAsDataURL(svgBlob);
  });
}

/**
 * Generate PDF blob
 * Creates HTML that can be converted to PDF
 */
async function generatePDFBlob(deck: StructuredSlideDeck): Promise<Blob | null> {
  // Import the HTML generation function
  const exportEngine = await import('./exportEngine');
  const { theme } = await import('./designSystem');
  
  // Generate HTML for all slides
  const slidesHTML = deck.slides.map((slide, index) => 
    exportEngine.generateSlideHTML(deck, slide, index)
  ).join('');
  
  // Create complete HTML document
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Deck Export</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @media print {
      @page { size: A4 landscape; margin: 0; }
      .slide-canvas { page-break-after: always; page-break-inside: avoid; min-height: 100vh; height: 100vh; }
    }
    body { font-family: 'Inter', sans-serif; background: ${theme.colors.pureWhite}; }
    .slide-canvas { min-height: 100vh; padding: ${theme.layout.slidePadding}px; }
  </style>
</head>
<body>
  ${slidesHTML}
</body>
</html>`;
  
  return new Blob([htmlContent], { type: 'text/html' });
}

/**
 * Generate PPTX blob
 */
async function generatePPTXBlob(deck: StructuredSlideDeck): Promise<Blob | null> {
  try {
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Predictive Intelligence Dashboard';
    
    // Add slides (simplified - would use full render pipeline)
    for (const slide of deck.slides) {
      const slideObj = pptx.addSlide();
      slideObj.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 60,
        fontFace: 'Inter',
        bold: true
      });
      
      let yPos = 1.5;
      slide.body.forEach((line) => {
        slideObj.addText(line, {
          x: 0.5,
          y: yPos,
          w: 9,
          h: 0.4,
          fontSize: 18,
          fontFace: 'Inter',
          bullet: true
        });
        yPos += 0.5;
      });
    }
    
    // Generate blob
    const blob = await pptx.write({ outputType: 'blob' });
    return blob as Blob;
  } catch (error) {
    console.error('Failed to generate PPTX blob:', error);
    return null;
  }
}
