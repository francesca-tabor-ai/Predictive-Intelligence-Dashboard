/**
 * Markdown parsing utilities for slide rendering
 * Converts Markdown bold syntax (**text**) to HTML/React elements
 */

/**
 * Converts Markdown bold syntax (**text**) to HTML string with <strong> tags
 * Used for HTML exports (PDF, PNG)
 */
export function markdownToHTML(text: string): string {
  if (!text) return text;
  
  // Escape HTML first to prevent XSS
  const escaped = escapeHtml(text);
  
  // Convert **text** to <strong>text</strong>
  // Use non-greedy matching to handle multiple bold sections
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/**
 * Converts Markdown bold syntax to plain text with bold markers removed
 * Used for PowerPoint export which handles formatting differently
 */
export function markdownToPlainText(text: string): string {
  if (!text) return text;
  // Simply remove the ** markers
  return text.replace(/\*\*/g, '');
}

/**
 * Parses Markdown bold syntax and returns an array of text segments with bold flags
 * Used for PowerPoint rich text formatting
 */
export function parseMarkdownForPowerPoint(text: string): Array<{ text: string; bold: boolean }> {
  if (!text) return [{ text: '', bold: false }];
  
  const segments: Array<{ text: string; bold: boolean }> = [];
  let currentIndex = 0;
  
  // Match all **text** patterns
  const regex = /\*\*(.*?)\*\*/g;
  let match;
  let lastIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        segments.push({ text: beforeText, bold: false });
      }
    }
    
    // Add the bold text
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text after last match
  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    if (afterText) {
      segments.push({ text: afterText, bold: false });
    }
  }
  
  // If no matches found, return the whole text as non-bold
  if (segments.length === 0) {
    return [{ text, bold: false }];
  }
  
  return segments;
}

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
