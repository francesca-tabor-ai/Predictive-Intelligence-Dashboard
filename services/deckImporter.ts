import { StructuredSlideDeck, Slide, Diagram, VisualReference, DiagramSpec } from '../types';
import { parseSlides } from './slideParser';
import { cleanText } from './stylingValidator';

export interface ImportResult {
  deck: StructuredSlideDeck;
  warnings: ImportWarning[];
}

export interface ImportWarning {
  slideNumber: number;
  message: string;
  content: string;
}

/**
 * Imports a legacy text blob and converts it to a structured deck
 */
export function importTextToDeck(text: string, existingDeck?: StructuredSlideDeck): ImportResult {
  const warnings: ImportWarning[] = [];
  const diagrams: Diagram[] = [];
  const slides: Slide[] = [];
  
  // Parse slides from text
  const parsedSlides = parseSlides(text);
  
  // Process each slide to extract visual layout/component information
  parsedSlides.forEach((slide, index) => {
    const slideNumber = index + 1;
    const slideWarnings: ImportWarning[] = [];
    const slideVisuals: VisualReference[] = [];
    
    // Extract visual layout/component information from body and metadata
    const visualLayoutInfo = extractVisualLayoutInfo(slide, slideNumber);
    
    if (visualLayoutInfo.diagrams.length > 0) {
      // Create diagrams from extracted info
      visualLayoutInfo.diagrams.forEach((diagramInfo) => {
        const diagram: Diagram = {
          id: `diagram-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: diagramInfo.type,
          spec: diagramInfo.spec,
          name: diagramInfo.name
        };
        diagrams.push(diagram);
        
        // Add visual reference to slide
        slideVisuals.push({
          kind: 'diagram',
          diagramId: diagram.id,
          placement: diagramInfo.placement
        });
      });
    }
    
    if (visualLayoutInfo.warnings.length > 0) {
      slideWarnings.push(...visualLayoutInfo.warnings);
    }
    
    // Clean slide body (remove visual layout mentions)
    const cleanedBody = slide.body.filter(line => {
      const lowerLine = line.toLowerCase();
      return !lowerLine.includes('visual layout') &&
             !lowerLine.includes('visual component') &&
             !lowerLine.includes('diagram on') &&
             !lowerLine.includes('left column') &&
             !lowerLine.includes('right column');
    });
    
    // Create cleaned slide
    const cleanedSlide: Slide = {
      ...slide,
      body: cleanedBody,
      visuals: slideVisuals.length > 0 ? slideVisuals : undefined
    };
    
    slides.push(cleanedSlide);
    warnings.push(...slideWarnings);
  });
  
  // Extract global style information
  const globalStyle = extractGlobalStyle(text);
  
  // Create deck
  const deck: StructuredSlideDeck = {
    deckStyleId: globalStyle.deckStyleId || existingDeck?.deckStyleId || 'mono-gradient-v1',
    slides,
    diagrams: [...(existingDeck?.diagrams || []), ...diagrams],
    metadata: existingDeck?.metadata
  };
  
  return { deck, warnings };
}

interface VisualLayoutInfo {
  diagrams: Array<{
    type: Diagram['type'];
    spec: DiagramSpec;
    placement: VisualReference['placement'];
    name?: string;
  }>;
  warnings: ImportWarning[];
}

function extractVisualLayoutInfo(slide: Slide, slideNumber: number): VisualLayoutInfo {
  const diagrams: VisualLayoutInfo['diagrams'] = [];
  const warnings: ImportWarning[] = [];
  
  // Check body content and metadata for visual layout/component mentions
  const bodyText = slide.body.join('\n').toLowerCase();
  const metadataText = slide.metadata?.visualLayout ? slide.metadata.visualLayout.join('\n').toLowerCase() : '';
  const allText = [...slide.body, ...(slide.keyData || []), ...(slide.metadata?.visualLayout || [])].join('\n');
  
  // Detect diagram references
  if (bodyText.includes('flywheel') || bodyText.includes('circular flow')) {
    diagrams.push({
      type: 'flywheel',
      spec: {
        nodes: [
          { label: 'Data' },
          { label: 'Prediction' },
          { label: 'Decision' },
          { label: 'Improvement' },
          { label: 'More Data' }
        ]
      },
      placement: detectPlacement(allText)
    });
  } else if (bodyText.includes('architecture') || bodyText.includes('layered')) {
    diagrams.push({
      type: 'architecture',
      spec: {
        layers: [
          { name: 'Feedback Loop', description: 'Real-time predictions' },
          { name: 'Inference', description: 'Model training' },
          { name: 'Training', description: 'Feature engineering' },
          { name: 'Feature Store', description: 'Data ingestion' },
          { name: 'Data Layer', description: '' }
        ]
      },
      placement: detectPlacement(allText)
    });
  } else if (bodyText.includes('timeline') || bodyText.includes('roadmap')) {
    diagrams.push({
      type: 'timeline',
      spec: {
        items: slide.body.slice(0, 5).map((item, idx) => ({
          label: `Phase ${idx + 1}`,
          description: item
        }))
      },
      placement: 'center'
    });
  } else if (bodyText.includes('gradient accent') || bodyText.includes('intelligence gradient')) {
    diagrams.push({
      type: 'gradient-accent',
      spec: {
        direction: 'diagonal'
      },
      placement: 'background-accent'
    });
  }
  
  // Check for unmappable visual layout content
  const hasVisualLayout = bodyText.includes('visual layout') || 
                         bodyText.includes('visual component') ||
                         metadataText.includes('visual layout') ||
                         metadataText.includes('visual component');
  
  if (hasVisualLayout) {
    const visualLines = [
      ...slide.body.filter(line => {
        const lower = line.toLowerCase();
        return lower.includes('visual layout') || 
               lower.includes('visual component') ||
               (lower.includes('centered') && !lower.includes('title')) ||
               (lower.includes('monochrome') && !lower.includes('base'));
      }),
      ...(slide.metadata?.visualLayout || [])
    ];
    
    if (visualLines.length > 0 && diagrams.length === 0) {
      warnings.push({
        slideNumber,
        message: 'Visual layout instructions found but could not be mapped to a diagram. Please review and add diagrams manually if needed.',
        content: visualLines.slice(0, 3).join('; ') + (visualLines.length > 3 ? '...' : '')
      });
    }
  }
  
  return { diagrams, warnings };
}

function detectPlacement(text: string): VisualReference['placement'] {
  const lower = text.toLowerCase();
  if (lower.includes('left') || lower.includes('left column')) {
    return 'left';
  }
  if (lower.includes('right') || lower.includes('right column')) {
    return 'right';
  }
  if (lower.includes('background') || lower.includes('accent')) {
    return 'background-accent';
  }
  if (lower.includes('center') || lower.includes('centered')) {
    return 'center';
  }
  return 'left'; // Default
}

function extractGlobalStyle(text: string): { deckStyleId?: string } {
  const lower = text.toLowerCase();
  
  if (lower.includes('mono-gradient') || lower.includes('monochrome')) {
    return { deckStyleId: 'mono-gradient-v1' };
  }
  if (lower.includes('pure minimal') || lower.includes('minimal')) {
    return { deckStyleId: 'pure-minimal' };
  }
  if (lower.includes('high contrast')) {
    return { deckStyleId: 'high-contrast' };
  }
  
  return {};
}
