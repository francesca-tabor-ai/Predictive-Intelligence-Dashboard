import React from 'react';
import { Slide } from '../../types';
import { theme } from '../../services/designSystem';

interface SlideTemplateProps {
  slide: Slide;
  slideNumber?: number;
}

/**
 * Base slide canvas component
 * Uses Pure White background with Intelligence-First branding
 */
const SlideCanvas: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div 
      className={`slide-canvas bg-white min-h-screen flex flex-col ${className}`}
      style={{
        fontFamily: theme.fonts.primary,
        padding: `${theme.layout.slidePadding}px`,
        background: theme.colors.pureWhite
      }}
    >
      {children}
    </div>
  );
};

/**
 * Title component - Display Headers
 * font-black text-6xl tracking-tight (Obsidian)
 */
const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h1 
      className={`mb-6 ${className}`}
      style={{
        fontSize: `${theme.typography.display.fontSize}px`,
        fontWeight: theme.typography.display.fontWeight,
        letterSpacing: `${theme.typography.display.letterSpacing}em`,
        lineHeight: theme.typography.display.lineHeight,
        color: theme.typography.display.color
      }}
    >
      {children}
    </h1>
  );
};

/**
 * Section header component
 * font-bold text-2xl tracking-tight (Obsidian)
 */
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h2 
      className="mb-4"
      style={{
        fontSize: `${theme.typography.section.fontSize}px`,
        fontWeight: theme.typography.section.fontWeight,
        letterSpacing: `${theme.typography.section.letterSpacing}em`,
        lineHeight: theme.typography.section.lineHeight,
        color: theme.typography.section.color
      }}
    >
      {children}
    </h2>
  );
};

/**
 * Body text component
 * font-light text-lg leading-relaxed text-slate-600
 */
const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p 
      className={`mb-4 ${className}`}
      style={{
        fontSize: `${theme.typography.body.fontSize}px`,
        fontWeight: theme.typography.body.fontWeight,
        lineHeight: theme.typography.body.lineHeight,
        color: theme.typography.body.color
      }}
    >
      {children}
    </p>
  );
};

/**
 * Bullet list component
 * Uses body typography with proper spacing
 */
const BulletList: React.FC<{ items: string[]; className?: string }> = ({ 
  items, 
  className = '' 
}) => {
  return (
    <ul 
      className={`space-y-3 ${className}`}
      style={{
        fontSize: `${theme.typography.body.fontSize}px`,
        fontWeight: theme.typography.body.fontWeight,
        lineHeight: theme.typography.body.lineHeight,
        color: theme.typography.body.color,
        paddingLeft: theme.layout.spacing.gap12
      }}
    >
      {items.map((item, index) => (
        <li key={index} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
};

/**
 * Two column layout
 * Uses gap-12 (48px) for breathing room
 */
const TwoColumn: React.FC<{ 
  left: React.ReactNode; 
  right: React.ReactNode;
  className?: string;
}> = ({ left, right, className = '' }) => {
  return (
    <div 
      className={`grid grid-cols-2 ${className}`}
      style={{
        gap: `${theme.layout.spacing.gap12}px`
      }}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

/**
 * Highlight panel component
 * Uses executive panel styling with shadow-2xl
 */
const HighlightPanel: React.FC<{ 
  items: Array<{ label: string; value: string }>;
  className?: string;
}> = ({ items, className = '' }) => {
  return (
    <div 
      className={`space-y-4 ${className}`}
      style={{
        background: theme.colors.pureWhite,
        padding: `${theme.layout.spacing.gap12}px`,
        borderRadius: `${theme.layout.borderRadius.executive}px`,
        border: `1px solid ${theme.colors.coolGrey.medium}`,
        boxShadow: theme.shadows.executive
      }}
    >
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <div 
            style={{
              fontSize: `${theme.typography.metadata.fontSize}px`,
              fontWeight: theme.typography.metadata.fontWeight,
              textTransform: theme.typography.metadata.textTransform,
              letterSpacing: `${theme.typography.metadata.letterSpacing}em`,
              color: theme.typography.metadata.color
            }}
          >
            {item.label}
          </div>
          <div 
            style={{
              fontSize: `${theme.typography.section.fontSize}px`,
              fontWeight: theme.typography.section.fontWeight,
              fontFamily: theme.typography.data.fontFamily,
              letterSpacing: `${theme.typography.data.letterSpacing}em`,
              color: theme.typography.display.color
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Metadata label component
 * font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400
 */
const MetadataLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      className="mb-2"
      style={{
        fontSize: `${theme.typography.metadata.fontSize}px`,
        fontWeight: theme.typography.metadata.fontWeight,
        textTransform: theme.typography.metadata.textTransform,
        letterSpacing: `${theme.typography.metadata.letterSpacing}em`,
        color: theme.typography.metadata.color
      }}
    >
      {children}
    </div>
  );
};

/**
 * Accent line component
 * Intelligence Gradient (135°): Indigo → Purple → Pink → Orange
 */
const AccentLine: React.FC = () => {
  return (
    <div 
      className="mb-6"
      style={{
        width: '32px',
        height: '2px',
        background: `linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%)`
      }}
    />
  );
};

/**
 * Cover Slide Template
 * Dark-themed slide with gradient background, white text, top-left alignment
 */
export const CoverSlideTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  // Parse body content to extract preparation details and author info
  const parseCoverContent = (body: string[]) => {
    let preparedFor = '';
    let attention = '';
    let authorName = '';
    let authorRole = '';
    let authorCompany = '';

    let foundPreparedBy = false;
    const authorLines: string[] = [];

    body.forEach((line) => {
      const trimmedLine = line.trim();
      const lowerLine = trimmedLine.toLowerCase();
      
      if (lowerLine.includes('prepared for')) {
        preparedFor = trimmedLine.replace(/prepared for\s*/i, '').trim();
      } else if (lowerLine.includes('attention:')) {
        attention = trimmedLine.replace(/attention:\s*/i, '').trim();
      } else if (lowerLine.includes('prepared by') || lowerLine === 'prepared by') {
        foundPreparedBy = true;
      } else if (foundPreparedBy) {
        // Collect all lines after "Prepared by" as potential author info
        if (trimmedLine && !lowerLine.includes('prepared') && !lowerLine.includes('attention')) {
          authorLines.push(trimmedLine);
        }
      } else if (!preparedFor && !attention && trimmedLine) {
        // If we haven't found prepared for/attention yet, check if this line matches
        if (lowerLine.includes('prepared for')) {
          preparedFor = trimmedLine.replace(/prepared for\s*/i, '').trim();
        } else if (lowerLine.includes('attention')) {
          attention = trimmedLine.replace(/attention:\s*/i, '').trim();
        }
      }
    });

    // Parse author lines: first is name, second is role, third is company
    if (authorLines.length > 0) {
      authorName = authorLines[0];
      if (authorLines.length > 1) {
        authorRole = authorLines[1];
      }
      if (authorLines.length > 2) {
        authorCompany = authorLines[2];
      }
    }

    // Fallback: if no structured parsing worked, try to extract from body directly
    if (!preparedFor && !attention && body.length > 0) {
      body.forEach((line) => {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('bt group') || lowerLine.includes('prepared for')) {
          const match = line.match(/prepared for\s*(.+)/i) || line.match(/(.+)/);
          if (match) preparedFor = match[1].trim();
        }
        if (lowerLine.includes('ian mitchell') || lowerLine.includes('attention')) {
          const match = line.match(/attention:\s*(.+)/i) || line.match(/(.+)/);
          if (match) attention = match[1].trim();
        }
        if (lowerLine.includes('francesca tabor') && !authorName) {
          authorName = line.trim();
        }
        if (lowerLine.includes('chief ai architect') && !authorRole) {
          authorRole = line.trim();
        }
        if (lowerLine.includes('ai growth hub') && !authorCompany) {
          authorCompany = line.trim();
        }
      });
    }

    return { preparedFor, attention, authorName, authorRole, authorCompany };
  };

  const { preparedFor, attention, authorName, authorRole, authorCompany } = parseCoverContent(slide.body);

  // Split title if it's the full title
  const titleParts = slide.title.includes('Flywheel') 
    ? ['Predictive Intelligence', 'Flywheel Dashboard']
    : [slide.title];

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        fontFamily: theme.fonts.primary,
        padding: `${theme.layout.slidePadding}px`,
        background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 50%, rgba(2, 6, 23, 1) 100%), linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 1) 100%)',
        color: '#FFFFFF'
      }}
    >
      <div className="flex-1 flex flex-col justify-start pt-12">
        {/* Title Section - Top Left */}
        <div className="mb-8">
          <h1 
            className="mb-4"
            style={{
              fontSize: `${theme.typography.display.fontSize}px`,
              fontWeight: theme.typography.display.fontWeight,
              letterSpacing: `${theme.typography.display.letterSpacing}em`,
              lineHeight: theme.typography.display.lineHeight,
              color: '#FFFFFF'
            }}
          >
            {titleParts.map((part, index) => (
              <React.Fragment key={index}>
                {part}
                {index < titleParts.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          
          {/* Wide Gradient Accent Line - matches title width */}
          <div 
            className="mb-4"
            style={{
              width: 'fit-content',
              minWidth: '400px',
              maxWidth: '700px',
              height: '2px',
              background: `linear-gradient(90deg, ${theme.colors.gradient.purple} 0%, ${theme.colors.gradient.orange} 100%)`
            }}
          />
          
          {/* DASHBOARD Subtitle */}
          <div 
            style={{
              fontSize: `${theme.typography.metadata.fontSize}px`,
              fontWeight: theme.typography.metadata.fontWeight,
              textTransform: theme.typography.metadata.textTransform,
              letterSpacing: `${theme.typography.metadata.letterSpacing}em`,
              color: '#FFFFFF'
            }}
          >
            DASHBOARD
          </div>
        </div>

        {/* Preparation Details */}
        <div className="space-y-2 mb-8">
          {preparedFor && (
            <p 
              style={{
                fontSize: `${theme.typography.body.fontSize}px`,
                fontWeight: theme.typography.body.fontWeight,
                lineHeight: theme.typography.body.lineHeight,
                color: '#FFFFFF'
              }}
            >
              Prepared for {preparedFor}
            </p>
          )}
          {attention && (
            <p 
              style={{
                fontSize: `${theme.typography.body.fontSize}px`,
                fontWeight: theme.typography.body.fontWeight,
                lineHeight: theme.typography.body.lineHeight,
                color: '#FFFFFF'
              }}
            >
              Attention: {attention}
            </p>
          )}
        </div>

        {/* Separator Line */}
        <div 
          className="mb-6"
          style={{
            width: '200px',
            height: '1px',
            background: '#FFFFFF',
            opacity: 0.3
          }}
        />

        {/* Author Information */}
        <div className="space-y-2">
          {authorName && (
            <p 
              style={{
                fontSize: `${theme.typography.section.fontSize}px`,
                fontWeight: theme.typography.section.fontWeight,
                color: '#FFFFFF'
              }}
            >
              {authorName}
            </p>
          )}
          {authorRole && (
            <p 
              style={{
                fontSize: `${theme.typography.body.fontSize}px`,
                fontWeight: theme.typography.body.fontWeight,
                lineHeight: theme.typography.body.lineHeight,
                color: '#FFFFFF'
              }}
            >
              {authorRole}
            </p>
          )}
          {authorCompany && (
            <p 
              style={{
                fontSize: `${theme.typography.body.fontSize}px`,
                fontWeight: theme.typography.body.fontWeight,
                lineHeight: theme.typography.body.lineHeight,
                color: '#FFFFFF'
              }}
            >
              {authorCompany}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Executive Summary Template
 */
export const ExecutiveSummaryTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber || 1}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        {slide.highlights && slide.highlights.length > 0 ? (
          <TwoColumn
            left={<BulletList items={slide.body} />}
            right={<HighlightPanel items={slide.highlights} />}
          />
        ) : (
          <BulletList items={slide.body} />
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Architecture Template
 * Two-column layout: diagram on left, layer descriptions on right
 */
export const ArchitectureTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  // Parse layer descriptions from body content
  // Format: **Layer Name** followed by description
  const parseLayers = (body: string[]): Array<{ name: string; description: string }> => {
    const layers: Array<{ name: string; description: string }> = [];
    let currentLayer: { name: string; description: string } | null = null;

    body.forEach((line) => {
      // Check if line is a bold header (starts with ** and ends with **)
      const boldMatch = line.match(/^\*\*(.+?)\*\*$/);
      if (boldMatch) {
        // Save previous layer if exists
        if (currentLayer) {
          layers.push(currentLayer);
        }
        // Start new layer
        currentLayer = {
          name: boldMatch[1].trim(),
          description: ''
        };
      } else if (currentLayer && line.trim()) {
        // Add description to current layer
        if (currentLayer.description) {
          currentLayer.description += ' ' + line.trim();
        } else {
          currentLayer.description = line.trim();
        }
      }
    });

    // Add last layer if exists
    if (currentLayer) {
      layers.push(currentLayer);
    }

    return layers;
  };

  const layers = parseLayers(slide.body);

  // Visual diagram placeholder component
  const ArchitectureDiagram: React.FC = () => {
    return (
      <div 
        className="h-full flex items-center justify-center"
        style={{
          background: theme.colors.coolGrey.light,
          borderRadius: `${theme.layout.borderRadius.executive}px`,
          border: `1px solid ${theme.colors.coolGrey.medium}`,
          minHeight: '400px'
        }}
      >
        <div className="text-center space-y-4">
          <div 
            style={{
              fontSize: `${theme.typography.metadata.fontSize}px`,
              fontWeight: theme.typography.metadata.fontWeight,
              textTransform: theme.typography.metadata.textTransform,
              letterSpacing: `${theme.typography.metadata.letterSpacing}em`,
              color: theme.typography.metadata.color
            }}
          >
            Layered Architecture Diagram
          </div>
          <div 
            style={{
              fontSize: `${theme.typography.body.fontSize}px`,
              fontWeight: theme.typography.body.fontWeight,
              color: theme.typography.body.color
            }}
          >
            Visual diagram illustrating the layered architecture
          </div>
        </div>
      </div>
    );
  };

  // Layer descriptions component
  const LayerDescriptions: React.FC = () => {
    if (layers.length === 0) {
      // Fallback to bullet list if no layers parsed
      return <BulletList items={slide.body} />;
    }

    return (
      <div className="space-y-6">
        {layers.map((layer, index) => (
          <div key={index} className="space-y-2">
            <h3 
              style={{
                fontSize: `${theme.typography.section.fontSize}px`,
                fontWeight: theme.typography.section.fontWeight,
                color: theme.typography.section.color
              }}
            >
              {layer.name}
            </h3>
            {layer.description && (
              <BodyText className="mb-0">{layer.description}</BodyText>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber || 1}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        <TwoColumn
          left={<ArchitectureDiagram />}
          right={<LayerDescriptions />}
        />
      </div>
    </SlideCanvas>
  );
};

/**
 * ROI Template
 */
export const ROISlideTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber || 1}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        {slide.highlights && slide.highlights.length > 0 ? (
          <div className="grid grid-cols-2 gap-12">
            <div>
              <BulletList items={slide.body} />
            </div>
            <div>
              <HighlightPanel items={slide.highlights} />
            </div>
          </div>
        ) : (
          <BulletList items={slide.body} />
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Generic Template (default)
 */
export const GenericSlideTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber || 1}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1 space-y-6">
        <BulletList items={slide.body} />
        {slide.highlights && slide.highlights.length > 0 && (
          <HighlightPanel items={slide.highlights} />
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Template mapping
 */
export const slideTemplates: Record<string, React.FC<SlideTemplateProps>> = {
  'cover-slide': CoverSlideTemplate,
  'executive-summary': ExecutiveSummaryTemplate,
  'architecture': ArchitectureTemplate,
  'roi': ROISlideTemplate,
  'flywheel': GenericSlideTemplate,
  'strategy': GenericSlideTemplate,
  'roadmap': GenericSlideTemplate,
  'conclusion': GenericSlideTemplate,
  'generic': GenericSlideTemplate
};

/**
 * Get template component for a slide
 */
export function getSlideTemplate(slide: Slide): React.FC<SlideTemplateProps> {
  return slideTemplates[slide.type] || GenericSlideTemplate;
}
