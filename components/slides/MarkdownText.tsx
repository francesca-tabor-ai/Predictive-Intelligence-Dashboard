import React from 'react';

interface MarkdownTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders text with Markdown bold syntax (**text**) as bold
 * Converts **text** to <strong>text</strong> in React
 */
export const MarkdownText: React.FC<MarkdownTextProps> = ({ 
  children, 
  className = '', 
  style 
}) => {
  if (!children) return null;
  
  // Parse the text and split by ** markers
  const parts: Array<{ text: string; bold: boolean }> = [];
  let currentIndex = 0;
  const regex = /\*\*(.*?)\*\*/g;
  let match;
  let lastIndex = 0;
  
  while ((match = regex.exec(children)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const beforeText = children.substring(lastIndex, match.index);
      if (beforeText) {
        parts.push({ text: beforeText, bold: false });
      }
    }
    
    // Add the bold text
    parts.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text after last match
  if (lastIndex < children.length) {
    const afterText = children.substring(lastIndex);
    if (afterText) {
      parts.push({ text: afterText, bold: false });
    }
  }
  
  // If no matches found, return the whole text as non-bold
  if (parts.length === 0) {
    return <span className={className} style={style}>{children}</span>;
  }
  
  return (
    <span className={className} style={style}>
      {parts.map((part, index) => 
        part.bold ? (
          <strong key={index}>{part.text}</strong>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )}
    </span>
  );
};
