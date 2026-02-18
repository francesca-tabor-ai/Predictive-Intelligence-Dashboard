import { Slide, VisualReference } from '../types';

/**
 * Banned styling tokens that should not appear in slide content
 */
const BANNED_STYLING_TOKENS = [
  // Visual layout directives
  /visual layout:/i,
  /layout:/i,
  /centered/i,
  /monochrome base/i,
  /monochrome/i,
  
  // Gradient references
  /intelligence gradient/i,
  /gradient accent/i,
  /include.*gradient/i,
  /subtle.*gradient/i,
  /gradient.*accent/i,
  
  // Diagram placement instructions
  /diagram on (left|right)/i,
  /diagram.*left/i,
  /diagram.*right/i,
  /left column/i,
  /right column/i,
  /two.?column/i,
  
  // Styling instructions
  /include.*visual/i,
  /add.*visual/i,
  /visual component/i,
  /visual element/i,
  
  // Layout instructions
  /use.*layout/i,
  /apply.*style/i,
  /styling/i,
  /design.*instruction/i
];

/**
 * Detects banned styling tokens in slide content
 */
export interface StylingViolation {
  slideId: string;
  slideNumber: number;
  field: 'title' | 'body' | 'keyData';
  lineIndex?: number;
  violation: string;
  matchedText: string;
}

export function detectStylingViolations(slides: Slide[]): StylingViolation[] {
  const violations: StylingViolation[] = [];

  slides.forEach((slide, index) => {
    const slideNumber = index + 1;

    // Check title
    if (slide.title) {
      const titleViolations = checkTextForViolations(slide.title, slide.id, slideNumber, 'title');
      violations.push(...titleViolations);
    }

    // Check body
    if (slide.body && slide.body.length > 0) {
      slide.body.forEach((line, lineIndex) => {
        const bodyViolations = checkTextForViolations(
          line,
          slide.id,
          slideNumber,
          'body',
          lineIndex
        );
        violations.push(...bodyViolations);
      });
    }

    // Check keyData
    if (slide.keyData && slide.keyData.length > 0) {
      slide.keyData.forEach((line, lineIndex) => {
        const keyDataViolations = checkTextForViolations(
          line,
          slide.id,
          slideNumber,
          'keyData',
          lineIndex
        );
        violations.push(...keyDataViolations);
      });
    }
  });

  return violations;
}

function checkTextForViolations(
  text: string,
  slideId: string,
  slideNumber: number,
  field: 'title' | 'body' | 'keyData',
  lineIndex?: number
): StylingViolation[] {
  const violations: StylingViolation[] = [];

  BANNED_STYLING_TOKENS.forEach((pattern) => {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        slideId,
        slideNumber,
        field,
        lineIndex,
        violation: `Contains styling instruction: "${pattern.source}"`,
        matchedText: match[0]
      });
    }
  });

  return violations;
}

/**
 * Auto-cleans slide content by removing styling tokens and moving visuals to visuals array
 */
export function autoCleanSlide(slide: Slide): {
  cleanedSlide: Slide;
  extractedVisuals: VisualReference[];
  removedText: string[];
} {
  const extractedVisuals: VisualReference[] = [];
  const removedText: string[] = [];

  // First, identify lines to remove and extract visuals
  const originalBody = slide.body || [];
  const originalKeyData = slide.keyData || [];
  
  originalBody.forEach((line) => {
    // Check for diagram references
    if (/diagram.*(left|right|background)/i.test(line)) {
      const placement = line.toLowerCase().includes('left') ? 'left' :
                       line.toLowerCase().includes('right') ? 'right' :
                       line.toLowerCase().includes('background') ? 'background-accent' : 'center';
      
      extractedVisuals.push({
        kind: 'diagram',
        diagramId: `d${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        placement: placement as any
      });
      removedText.push(line);
    }

    // Check for gradient accent references
    if (/gradient.*accent/i.test(line) || /intelligence gradient/i.test(line)) {
      extractedVisuals.push({
        kind: 'diagram',
        diagramId: `gradient-${Date.now()}`,
        placement: 'background-accent'
      });
      removedText.push(line);
    }
  });

  originalKeyData.forEach((line) => {
    // Check for diagram references
    if (/diagram.*(left|right|background)/i.test(line)) {
      const placement = line.toLowerCase().includes('left') ? 'left' :
                       line.toLowerCase().includes('right') ? 'right' :
                       line.toLowerCase().includes('background') ? 'background-accent' : 'center';
      
      extractedVisuals.push({
        kind: 'diagram',
        diagramId: `d${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        placement: placement as any
      });
      removedText.push(line);
    }

    // Check for gradient accent references
    if (/gradient.*accent/i.test(line) || /intelligence gradient/i.test(line)) {
      extractedVisuals.push({
        kind: 'diagram',
        diagramId: `gradient-${Date.now()}`,
        placement: 'background-accent'
      });
      removedText.push(line);
    }
  });

  // Now clean and filter the text
  const cleanedBody = originalBody
    .filter(line => !removedText.includes(line))
    .map(cleanText)
    .filter(line => line.trim().length > 0);
  
  const cleanedKeyData = originalKeyData
    .filter(line => !removedText.includes(line))
    .map(cleanText)
    .filter(line => line.trim().length > 0);

  const cleanedSlide: Slide = {
    ...slide,
    title: cleanText(slide.title),
    body: cleanedBody,
    keyData: cleanedKeyData.length > 0 ? cleanedKeyData : undefined
  };

  // Add extracted visuals to visuals array
  if (extractedVisuals.length > 0) {
    cleanedSlide.visuals = [
      ...(cleanedSlide.visuals || []),
      ...extractedVisuals
    ];
  }

  return {
    cleanedSlide,
    extractedVisuals,
    removedText
  };
}

export function cleanText(text: string): string {
  let cleaned = text;

  // Remove styling instruction patterns
  BANNED_STYLING_TOKENS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '').trim();
  });

  // Remove common prefixes
  cleaned = cleaned
    .replace(/^(visual layout|layout|styling):\s*/i, '')
    .replace(/^(include|add|use|apply):\s*/i, '')
    .trim();

  return cleaned;
}
