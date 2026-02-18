import { StructuredSlideDeck, Slide } from '../types';

/**
 * Exports a structured deck to clean text format (without styling mentions)
 */
export function exportDeckToText(deck: StructuredSlideDeck): string {
  const slides = deck.slides || [];
  
  if (slides.length === 0) {
    return '';
  }
  
  const slideTexts = slides.map((slide, index) => {
    const parts: string[] = [];
    
    // Slide delimiter
    if (index > 0) {
      parts.push('\n=== SLIDE ===\n');
    } else {
      parts.push('=== SLIDE ===\n');
    }
    
    // Slide Type
    parts.push(`Slide Type: ${slide.type}\n`);
    
    // Title
    parts.push(`Title: ${slide.title}\n`);
    
    // Body Content
    if (slide.body && slide.body.length > 0) {
      parts.push('Body Content:\n');
      slide.body.forEach(line => {
        parts.push(`${line}\n`);
      });
    }
    
    // Key Data Highlights
    if (slide.keyData && slide.keyData.length > 0) {
      parts.push('Key Data Highlights:\n');
      slide.keyData.forEach(line => {
        parts.push(`${line}\n`);
      });
    }
    
    // Note about diagrams (not included in text, exported separately)
    if (slide.visuals && slide.visuals.some(v => v.kind === 'diagram')) {
      const diagramCount = slide.visuals.filter(v => v.kind === 'diagram').length;
      parts.push(`\n[Note: ${diagramCount} diagram${diagramCount !== 1 ? 's' : ''} referenced - export diagrams separately]\n`);
    }
    
    return parts.join('');
  });
  
  return slideTexts.join('\n');
}

/**
 * Exports deck metadata to text
 */
export function exportDeckMetadata(deck: StructuredSlideDeck): string {
  const metadata = deck.metadata || {};
  const parts: string[] = [];
  
  parts.push('=== DECK METADATA ===\n');
  
  if (metadata.toCompany) parts.push(`Recipient Company: ${metadata.toCompany}\n`);
  if (metadata.toPerson) parts.push(`Recipient Person: ${metadata.toPerson}\n`);
  if (metadata.toRole) parts.push(`Recipient Role: ${metadata.toRole}\n`);
  if (metadata.fromCompany) parts.push(`Sender Company: ${metadata.fromCompany}\n`);
  if (metadata.fromPerson) parts.push(`Sender Person: ${metadata.fromPerson}\n`);
  if (metadata.fromRole) parts.push(`Sender Role: ${metadata.fromRole}\n`);
  
  if (deck.deckStyleId) {
    parts.push(`\nDeck Style: ${deck.deckStyleId}\n`);
  }
  
  return parts.join('');
}
