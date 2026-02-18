import { Slide, SlideType, SlideHighlight } from '../types';

/**
 * Parses raw text content into structured slide objects
 */
export function parseSlides(text: string): Slide[] {
  if (!text || !text.trim()) {
    return [];
  }

  // Split by slide delimiter
  const rawSlides = text.split('=== SLIDE ===').filter(block => block.trim());
  
  return rawSlides.map((block, index) => parseSlideBlock(block.trim(), index));
}

/**
 * Parses a single slide block into a structured Slide object
 */
function parseSlideBlock(block: string, index: number): Slide {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let type: SlideType = 'generic';
  let title = `Slide ${index + 1}`;
  const body: string[] = [];
  const highlights: SlideHighlight[] = [];
  const metadata: Record<string, any> = {};

  let currentSection: 'title' | 'body' | 'highlights' | 'metadata' = 'title';
  let inHighlights = false;
  let inBody = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect slide type
    if (line.toLowerCase().includes('slide type:')) {
      const typeMatch = line.match(/slide type:\s*(.+)/i);
      if (typeMatch) {
        const typeStr = typeMatch[1].toLowerCase().trim();
        type = normalizeSlideType(typeStr);
      }
      continue;
    }

    // Detect title
    if (line.toLowerCase().includes('title:')) {
      const titleMatch = line.match(/title:\s*(.+)/i);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
      continue;
    }

    // Detect body content section
    if (line.toLowerCase().includes('body content:') || line.toLowerCase().includes('body:')) {
      inBody = true;
      inHighlights = false;
      continue;
    }

    // Detect highlights section
    if (line.toLowerCase().includes('key data highlights:') || 
        line.toLowerCase().includes('highlights:') ||
        line.toLowerCase().includes('data highlights:')) {
      inHighlights = true;
      inBody = false;
      continue;
    }

    // Parse highlights (format: "Label: Value" or "- Label: Value")
    if (inHighlights) {
      const highlightMatch = line.match(/[-•]?\s*(.+?):\s*(.+)/);
      if (highlightMatch) {
        highlights.push({
          label: highlightMatch[1].trim(),
          value: highlightMatch[2].trim()
        });
      } else if (line.startsWith('-') || line.startsWith('•')) {
        // Try to parse as "Label - Value" or "Label: Value"
        const altMatch = line.replace(/^[-•]\s*/, '').match(/(.+?)[-:]\s*(.+)/);
        if (altMatch) {
          highlights.push({
            label: altMatch[1].trim(),
            value: altMatch[2].trim()
          });
        }
      }
      continue;
    }

    // Parse body content
    if (inBody || (!inHighlights && !line.includes(':'))) {
      // Remove bullet points and add to body
      const cleanLine = line.replace(/^[-•]\s*/, '').trim();
      if (cleanLine && !cleanLine.toLowerCase().includes('slide type') && 
          !cleanLine.toLowerCase().includes('title:')) {
        body.push(cleanLine);
      }
      continue;
    }

    // Fallback: if line doesn't match any pattern, add to body
    if (!line.includes(':') || line.match(/^[^:]+:\s*[^:]+$/)) {
      const cleanLine = line.replace(/^[-•]\s*/, '').trim();
      if (cleanLine && cleanLine.length > 0) {
        body.push(cleanLine);
      }
    }
  }

  // If no body content was found, use all non-metadata lines
  if (body.length === 0) {
    lines.forEach(line => {
      if (!line.toLowerCase().includes('slide type') && 
          !line.toLowerCase().includes('title:') &&
          !line.toLowerCase().includes('body content:') &&
          !line.toLowerCase().includes('highlights:') &&
          !line.match(/^[-•]?\s*.+?:\s*.+$/)) {
        const cleanLine = line.replace(/^[-•]\s*/, '').trim();
        if (cleanLine) {
          body.push(cleanLine);
        }
      }
    });
  }

  // Generate ID
  const id = `slide-${index + 1}-${Date.now()}`;

  return {
    id,
    type,
    title: title || `Slide ${index + 1}`,
    body: body.length > 0 ? body : ['No content'],
    highlights: highlights.length > 0 ? highlights : undefined,
    metadata
  };
}

/**
 * Normalizes slide type string to SlideType enum
 */
function normalizeSlideType(typeStr: string): SlideType {
  const normalized = typeStr.toLowerCase().trim();
  
  if (normalized.includes('cover') || normalized.includes('title')) {
    return 'cover-slide';
  }
  if (normalized.includes('executive') || normalized.includes('summary')) {
    return 'executive-summary';
  }
  if (normalized.includes('architecture') || normalized.includes('platform')) {
    return 'architecture';
  }
  if (normalized.includes('roi') || normalized.includes('return') || normalized.includes('investment')) {
    return 'roi';
  }
  if (normalized.includes('flywheel') || normalized.includes('loop')) {
    return 'flywheel';
  }
  if (normalized.includes('strategy') || normalized.includes('strategic')) {
    return 'strategy';
  }
  if (normalized.includes('roadmap') || normalized.includes('plan') || normalized.includes('implementation')) {
    return 'roadmap';
  }
  if (normalized.includes('conclusion') || normalized.includes('next steps')) {
    return 'conclusion';
  }
  
  return 'generic';
}

/**
 * Validates parsed slides
 */
export function validateSlides(slides: Slide[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (slides.length === 0) {
    errors.push('No slides found in content');
  }
  
  slides.forEach((slide, index) => {
    if (!slide.title || slide.title.trim().length === 0) {
      errors.push(`Slide ${index + 1}: Missing title`);
    }
    if (!slide.body || slide.body.length === 0) {
      errors.push(`Slide ${index + 1}: Missing body content`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
