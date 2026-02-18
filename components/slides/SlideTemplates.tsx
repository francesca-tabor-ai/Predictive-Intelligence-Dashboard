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
 */
export const CoverSlideTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <div className="flex flex-col justify-center items-center h-full text-center">
        <AccentLine />
        <MetadataLabel>Slide {slideNumber || 1}</MetadataLabel>
        <Title className="mb-8">
          {slide.title}
        </Title>
        {slide.body.length > 0 && (
          <div className="space-y-4 max-w-2xl">
            {slide.body.map((line, index) => (
              <BodyText key={index}>{line}</BodyText>
            ))}
          </div>
        )}
      </div>
    </SlideCanvas>
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
 */
export const ArchitectureTemplate: React.FC<SlideTemplateProps> = ({ slide, slideNumber }) => {
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
