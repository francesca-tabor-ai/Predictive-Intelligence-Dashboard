import { Slide, StructuredSlideDeck } from '../types';
import { theme } from './designSystem';

/**
 * Generate HTML for a single slide using template-based rendering
 * Exported for use in project exporter
 */
export function generateSlideHTML(deck: StructuredSlideDeck, slide: Slide, index: number): string {
  const slideNumber = index + 1;
  
  // Apply template based on slide type
  switch (slide.type) {
    case 'cover-slide':
      return generateCoverSlideHTML(deck, slide);
    case 'executive-summary':
      return generateExecutiveSummaryHTML(deck, slide, slideNumber);
    case 'architecture':
      return generateArchitectureHTML(deck, slide, slideNumber);
    case 'roi':
      return generateTwoColumnHTML(deck, slide, slideNumber);
    case 'roadmap':
      return generateTimelineHTML(deck, slide, slideNumber);
    case 'conclusion':
      return generateClosingHTML(deck, slide);
    default:
      return generateGenericHTML(deck, slide, slideNumber);
  }
}

/**
 * Cover Slide HTML
 */
function generateCoverSlideHTML(deck: StructuredSlideDeck, slide: Slide): string {
  const metadata = deck.metadata || {};
  const preparedFor = metadata.toCompany || '';
  const attention = metadata.toPerson ? `${metadata.toPerson}${metadata.toRole ? `, ${metadata.toRole}` : ''}` : '';
  const authorName = metadata.fromPerson || '';
  const authorRole = metadata.fromRole || '';
  const authorCompany = metadata.fromCompany || '';
  const displayTitle = slide.title || 'Predictive Intelligence Flywheel Dashboard';

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 50%, rgba(2, 6, 23, 1) 100%), linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 1) 100%); font-family: ${theme.fonts.primary}; color: #FFFFFF;">
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 48px;">
        <div style="margin-bottom: 32px;">
          <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 16px; color: #FFFFFF;">
            ${escapeHtml(displayTitle)}
          </h1>
          <div style="width: fit-content; min-width: 400px; max-width: 700px; height: 2px; background: linear-gradient(90deg, ${theme.colors.gradient.purple} 0%, ${theme.colors.gradient.orange} 100%); margin-bottom: 16px;"></div>
          <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: #FFFFFF;">
            DASHBOARD
          </div>
        </div>
        ${preparedFor ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF; margin-bottom: 8px;">Prepared for ${escapeHtml(preparedFor)}</p>` : ''}
        ${attention ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF; margin-bottom: 8px;">Attention: ${escapeHtml(attention)}</p>` : ''}
        <div style="width: 200px; height: 1px; background: #FFFFFF; opacity: 0.3; margin: 24px 0;"></div>
        ${authorName ? `<p style="font-size: ${theme.typography.section.fontSize}px; font-weight: ${theme.typography.section.fontWeight}; color: #FFFFFF; margin-bottom: 8px;">${escapeHtml(authorName)}</p>` : ''}
        ${authorRole ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF; margin-bottom: 8px;">${escapeHtml(authorRole)}</p>` : ''}
        ${authorCompany ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF;">${escapeHtml(authorCompany)}</p>` : ''}
      </div>
    </div>
  `;
}

/**
 * Executive Summary HTML
 */
function generateExecutiveSummaryHTML(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): string {
  const bodyHTML = slide.body.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');
  
  const keyDataHTML = slide.keyData && slide.keyData.length > 0 ? slide.keyData.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ') : '';

  const contentHTML = keyDataHTML ? `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${theme.layout.spacing.gap12}px;">
      <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
        ${bodyHTML}
      </ul>
      <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
        ${keyDataHTML}
      </ul>
    </div>
  ` : `
    <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
      ${bodyHTML}
    </ul>
  `;

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: ${theme.colors.pureWhite}; font-family: ${theme.fonts.primary};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${slideNumber}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.typography.display.color};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        ${contentHTML}
      </div>
    </div>
  `;
}

/**
 * Architecture HTML
 */
function generateArchitectureHTML(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): string {
  const bodyHTML = slide.body.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: ${theme.colors.pureWhite}; font-family: ${theme.fonts.primary};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${slideNumber}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.typography.display.color};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${theme.layout.spacing.gap12}px;">
          <div style="background: ${theme.colors.coolGrey.light}; border-radius: ${theme.layout.borderRadius.executive}px; border: 1px solid ${theme.colors.coolGrey.medium}; min-height: 400px; display: flex; align-items: center; justify-content: center;">
            <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color};">
              Architecture Diagram
            </div>
          </div>
          <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
            ${bodyHTML}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Two-Column HTML
 */
function generateTwoColumnHTML(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): string {
  const leftItems = slide.body.slice(0, Math.ceil(slide.body.length / 2));
  const rightItems = slide.keyData && slide.keyData.length > 0 
    ? slide.keyData 
    : slide.body.slice(Math.ceil(slide.body.length / 2));

  const leftHTML = leftItems.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');
  
  const rightHTML = rightItems.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: ${theme.colors.pureWhite}; font-family: ${theme.fonts.primary};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${slideNumber}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.typography.display.color};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: ${theme.layout.spacing.gap12}px;">
          <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
            ${leftHTML}
          </ul>
          <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
            ${rightHTML}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * Timeline HTML
 */
function generateTimelineHTML(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): string {
  const itemsHTML = slide.body.map((item, index) => `
    <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: ${theme.colors.gradient.indigo}; margin-top: 8px; flex-shrink: 0;"></div>
      <p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; flex: 1;">
        ${escapeHtml(item)}
      </p>
    </div>
  `).join('');

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: ${theme.colors.pureWhite}; font-family: ${theme.fonts.primary};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${slideNumber}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.typography.display.color};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        ${itemsHTML}
      </div>
    </div>
  `;
}

/**
 * Closing HTML
 */
function generateClosingHTML(deck: StructuredSlideDeck, slide: Slide): string {
  const metadata = deck.metadata || {};
  const authorName = metadata.fromPerson || '';
  const authorRole = metadata.fromRole || '';
  const authorCompany = metadata.fromCompany || '';
  const displayTitle = slide.title || 'Strategic Call to Action';

  const bodyHTML = slide.body.map(line => 
    `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF; margin-bottom: 16px;">${escapeHtml(line)}</p>`
  ).join('');

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 50%, rgba(2, 6, 23, 1) 100%), linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 1) 100%); font-family: ${theme.fonts.primary}; color: #FFFFFF; text-align: center;">
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: #FFFFFF;">
        ${escapeHtml(displayTitle)}
      </h1>
      <div style="width: fit-content; min-width: 300px; max-width: 500px; height: 2px; background: linear-gradient(90deg, ${theme.colors.gradient.purple} 0%, ${theme.colors.gradient.orange} 100%); margin-bottom: 32px;"></div>
      ${bodyHTML}
      ${(authorName || authorRole || authorCompany) ? `
        <div style="margin-top: 32px;">
          ${authorName ? `<p style="font-size: ${theme.typography.section.fontSize}px; font-weight: ${theme.typography.section.fontWeight}; color: #FFFFFF; margin-bottom: 8px;">${escapeHtml(authorName)}</p>` : ''}
          ${authorRole ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF; margin-bottom: 8px;">${escapeHtml(authorRole)}</p>` : ''}
          ${authorCompany ? `<p style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: #FFFFFF;">${escapeHtml(authorCompany)}</p>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Generic HTML
 */
function generateGenericHTML(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): string {
  const bodyHTML = slide.body.map(line => 
    `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
  ).join('\n        ');
  
  const keyDataHTML = slide.keyData && slide.keyData.length > 0 ? `
    <div style="margin-top: 24px;">
      <h3 style="font-size: ${theme.typography.section.fontSize}px; font-weight: ${theme.typography.section.fontWeight}; margin-bottom: 16px; color: ${theme.typography.section.color};">
        Key Data Highlights
      </h3>
      <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
        ${slide.keyData.map(line => 
          `<li style="margin-bottom: 8px; line-height: ${theme.typography.body.lineHeight};">${escapeHtml(line)}</li>`
        ).join('\n        ')}
      </ul>
    </div>
  ` : '';

  return `
    <div class="slide-canvas" style="min-height: 100vh; padding: ${theme.layout.slidePadding}px; display: flex; flex-direction: column; background: ${theme.colors.pureWhite}; font-family: ${theme.fonts.primary};">
      <div style="width: 32px; height: 2px; background: linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%); margin-bottom: 24px;"></div>
      <div style="font-size: ${theme.typography.metadata.fontSize}px; font-weight: ${theme.typography.metadata.fontWeight}; text-transform: uppercase; letter-spacing: ${theme.typography.metadata.letterSpacing}em; color: ${theme.typography.metadata.color}; margin-bottom: 16px;">
        Slide ${slideNumber}
      </div>
      <h1 style="font-weight: ${theme.typography.display.fontWeight}; font-size: ${theme.typography.display.fontSize}px; letter-spacing: ${theme.typography.display.letterSpacing}em; line-height: ${theme.typography.display.lineHeight}; margin-bottom: 24px; color: ${theme.typography.display.color};">
        ${escapeHtml(slide.title)}
      </h1>
      <div style="flex: 1;">
        <ul style="font-size: ${theme.typography.body.fontSize}px; font-weight: ${theme.typography.body.fontWeight}; line-height: ${theme.typography.body.lineHeight}; color: ${theme.typography.body.color}; padding-left: ${theme.layout.spacing.gap12}px;">
          ${bodyHTML}
        </ul>
        ${keyDataHTML}
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
export async function exportToPDF(slides: Slide[], filename: string, deck?: StructuredSlideDeck): Promise<void> {
  // Create a default deck if not provided (for backward compatibility)
  const defaultDeck: StructuredSlideDeck = deck || {
    deckStyleId: 'mono-gradient-v1',
    slides: slides,
    diagrams: []
  };
  
  // Generate HTML for all slides
  const slidesHTML = slides.map((slide, index) => generateSlideHTML(defaultDeck, slide, index)).join('');

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
      background: ${theme.colors.pureWhite};
      color: ${theme.colors.obsidian};
      line-height: 1.6;
    }
    .slide-canvas {
      min-height: 100vh;
      padding: ${theme.layout.slidePadding}px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: ${theme.colors.pureWhite};
      font-family: ${theme.fonts.primary};
    }
    h1 {
      font-weight: ${theme.typography.display.fontWeight};
      font-size: ${theme.typography.display.fontSize}px;
      letter-spacing: ${theme.typography.display.letterSpacing}em;
      line-height: ${theme.typography.display.lineHeight};
      margin-bottom: 24px;
      color: ${theme.colors.obsidian};
    }
    h2 {
      font-weight: ${theme.typography.section.fontWeight};
      font-size: ${theme.typography.section.fontSize}px;
      line-height: ${theme.typography.section.lineHeight};
      margin-bottom: 16px;
      color: ${theme.colors.obsidian};
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
      margin-left: ${theme.layout.spacing.gap12}px;
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
      gap: ${theme.layout.spacing.gap12}px;
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
    .bg-white { background: ${theme.colors.pureWhite}; }
    .text-black { color: ${theme.colors.obsidian}; }
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
export async function exportToPowerPoint(slides: Slide[], filename: string, deck?: StructuredSlideDeck): Promise<void> {
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
        fontSize: theme.typography.metadata.fontSize,
        color: theme.typography.metadata.color.replace('#', ''),
        fontFace: theme.fonts.primary,
        bold: true
      });

      // Add title (Display Header - font-black text-6xl)
      slideObj.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: theme.typography.display.fontSize,
        fontFace: theme.fonts.primary,
        bold: true,
        color: theme.typography.display.color.replace('#', '')
      });

      // Add body content (font-light text-lg)
      let yPosition = 1.5;
      slide.body.forEach((line, lineIndex) => {
        slideObj.addText(line, {
          x: 0.5,
          y: yPosition,
          w: slide.highlights && slide.highlights.length > 0 ? 4.5 : 9,
          h: 0.4,
          fontSize: theme.typography.body.fontSize,
          fontFace: theme.fonts.primary,
          color: theme.typography.body.color.replace('#', ''),
          bullet: true
        });
        yPosition += 0.5;
      });

      // Add highlights if available
      if (slide.highlights && slide.highlights.length > 0) {
        let highlightY = 1.5;
        slide.highlights.forEach((highlight) => {
          // Highlight label (Metadata style)
          slideObj.addText(highlight.label, {
            x: 5.5,
            y: highlightY,
            w: 4,
            h: 0.3,
            fontSize: theme.typography.metadata.fontSize,
            fontFace: theme.fonts.primary,
            color: theme.typography.metadata.color.replace('#', ''),
            bold: true
          });
          
          // Highlight value (Data style - font-mono)
          slideObj.addText(highlight.value, {
            x: 5.5,
            y: highlightY + 0.3,
            w: 4,
            h: 0.4,
            fontSize: theme.typography.section.fontSize,
            fontFace: theme.typography.data.fontFamily,
            color: theme.typography.display.color.replace('#', ''),
            bold: true
          });
          
          highlightY += 0.9;
        });
      }

      // Add accent line (Intelligence Gradient)
      slideObj.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 0.2,
        h: 0.05,
        fill: {
          type: 'solid',
          color: theme.colors.gradient.indigo.replace('#', '')
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
