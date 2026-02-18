import { Slide, SlideDeck } from '../types';
import { theme } from './designSystem';

/**
 * Generate HTML for a single slide
 */
function generateSlideHTML(slide: Slide, index: number): string {
  const hasHighlights = slide.highlights && slide.highlights.length > 0;
  
  // Generate body content
  const bodyHTML = slide.body.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');
  
  // Generate highlights HTML
  const highlightsHTML = hasHighlights ? slide.highlights!.map(highlight => `
          <div style="margin-bottom: 16px;">
            <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.colors.text.muted}; margin-bottom: 4px;">
              ${escapeHtml(highlight.label)}
            </div>
            <div style="font-size: ${theme.typography.section.fontSize}px; font-weight: 700; font-family: ${theme.fonts.mono}; color: ${theme.colors.text.primary};">
              ${escapeHtml(highlight.value)}
            </div>
          </div>
        `).join('') : '';
  
  // Generate layout based on slide type
  let contentHTML = '';
  if (hasHighlights) {
    contentHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${theme.spacing.lg}px;">
          <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.spacing.md}px;">
            ${bodyHTML}
          </ul>
          <div style="background: ${theme.colors.surface}; padding: ${theme.spacing.md}px; border-radius: ${theme.layout.borderRadius.panel}px; border: 1px solid ${theme.colors.text.muted};">
            ${highlightsHTML}
          </div>
        </div>
      `;
  } else {
    contentHTML = `
        <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.spacing.md}px;">
          ${bodyHTML}
        </ul>
      `;
  }
  
  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.margin}px; display: flex; flex-direction: column; background: ${theme.colors.background};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.start} 0%, ${theme.colors.gradient.mid} 50%, ${theme.colors.gradient.end} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${index + 1}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.colors.text.primary};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        ${contentHTML}
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Export slides to PDF using HTML rendering
 */
export async function exportToPDF(slides: Slide[], filename: string): Promise<void> {
  // Generate HTML for all slides
  const slidesHTML = slides.map((slide, index) => generateSlideHTML(slide, index)).join('');

  // Create complete HTML document
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @media print {
      @page {
        size: A4 landscape;
        margin: 0;
      }
      .slide-canvas {
        page-break-after: always;
        page-break-inside: avoid;
        min-height: 100vh;
        height: 100vh;
      }
    }
    body {
      font-family: 'Inter', sans-serif;
      background: ${theme.colors.background};
      color: ${theme.colors.text.primary};
      line-height: 1.6;
    }
    .slide-canvas {
      min-height: 100vh;
      padding: ${theme.layout.margin}px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: ${theme.colors.background};
    }
    h1 {
      font-weight: ${theme.typography.display.fontWeight};
      font-size: ${theme.typography.display.fontSize}px;
      letter-spacing: ${theme.typography.display.letterSpacing}em;
      line-height: ${theme.typography.display.lineHeight};
      margin-bottom: 24px;
      color: ${theme.colors.text.primary};
    }
    h2 {
      font-weight: ${theme.typography.section.fontWeight};
      font-size: ${theme.typography.section.fontSize}px;
      line-height: ${theme.typography.section.lineHeight};
      margin-bottom: 16px;
      color: ${theme.colors.text.primary};
    }
    p {
      font-weight: ${theme.typography.body.fontWeight};
      font-size: ${theme.typography.body.fontSize}px;
      line-height: ${theme.typography.body.lineHeight};
      color: ${theme.typography.body.color};
      margin-bottom: 16px;
    }
    ul {
      font-weight: ${theme.typography.body.fontWeight};
      font-size: ${theme.typography.body.fontSize}px;
      line-height: ${theme.typography.body.lineHeight};
      color: ${theme.typography.body.color};
      margin-left: ${theme.spacing.md}px;
      margin-bottom: 16px;
    }
    li {
      margin-bottom: 8px;
    }
    .grid {
      display: grid;
    }
    .grid-cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }
    .gap-12 {
      gap: ${theme.spacing.lg}px;
    }
    .space-y-3 > * + * {
      margin-top: 12px;
    }
    .space-y-4 > * + * {
      margin-top: 16px;
    }
    .space-y-6 > * + * {
      margin-top: 24px;
    }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1; }
    .bg-white { background: ${theme.colors.background}; }
    .text-black { color: ${theme.colors.text.primary}; }
    .text-slate-400 { color: ${theme.colors.text.muted}; }
    .font-bold { font-weight: 700; }
    .list-disc { list-style-type: disc; }
  </style>
</head>
<body>
  ${slidesHTML}
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  link.click();
  URL.revokeObjectURL(url);

  // Open print dialog for PDF conversion
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

/**
 * Export slides to PowerPoint using pptxgenjs
 */
export async function exportToPowerPoint(slides: Slide[], filename: string): Promise<void> {
  try {
    // Dynamic import to avoid bundling issues
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    // Set presentation properties
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Predictive Intelligence Dashboard';
    pptx.company = '';

    slides.forEach((slide, index) => {
      const slideObj = pptx.addSlide();

      // Add slide number metadata
      slideObj.addText(`Slide ${index + 1}`, {
        x: 0.5,
        y: 0.2,
        w: 2,
        h: 0.3,
        fontSize: 10,
        color: theme.colors.text.muted.replace('#', ''),
        fontFace: theme.fonts.title,
        bold: true
      });

      // Add title
      slideObj.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 36,
        fontFace: theme.fonts.title,
        bold: true,
        color: theme.colors.text.primary.replace('#', '')
      });

      // Add body content
      let yPosition = 1.5;
      slide.body.forEach((line, lineIndex) => {
        slideObj.addText(line, {
          x: 0.5,
          y: yPosition,
          w: slide.highlights && slide.highlights.length > 0 ? 4.5 : 9,
          h: 0.4,
          fontSize: 14,
          fontFace: theme.fonts.body,
          color: theme.typography.body.color.replace('#', ''),
          bullet: true
        });
        yPosition += 0.5;
      });

      // Add highlights if available
      if (slide.highlights && slide.highlights.length > 0) {
        let highlightY = 1.5;
        slide.highlights.forEach((highlight) => {
          // Highlight label
          slideObj.addText(highlight.label, {
            x: 5.5,
            y: highlightY,
            w: 4,
            h: 0.3,
            fontSize: 10,
            fontFace: theme.fonts.title,
            color: theme.colors.text.muted.replace('#', ''),
            bold: true
          });
          
          // Highlight value
          slideObj.addText(highlight.value, {
            x: 5.5,
            y: highlightY + 0.3,
            w: 4,
            h: 0.4,
            fontSize: 18,
            fontFace: theme.fonts.mono,
            color: theme.colors.text.primary.replace('#', ''),
            bold: true
          });
          
          highlightY += 0.9;
        });
      }

      // Add accent line
      slideObj.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 0.2,
        h: 0.05,
        fill: {
          type: 'solid',
          color: theme.colors.gradient.start.replace('#', '')
        }
      });
    });

    // Generate and download
    await pptx.writeFile({ fileName: `${filename}.pptx` });
  } catch (error) {
    console.error('PowerPoint export error:', error);
    throw new Error('Failed to export PowerPoint. Please ensure pptxgenjs is installed.');
  }
}

/**
 * Export slides to PNG images (one per slide)
 */
export async function exportToPNG(slides: Slide[], filename: string): Promise<void> {
  // This would require canvas rendering or html2canvas
  // For now, we'll use a simplified approach with html2canvas if available
  console.warn('PNG export not yet implemented. Please use PDF or PowerPoint export.');
}
