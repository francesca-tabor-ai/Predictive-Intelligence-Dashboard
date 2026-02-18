import React from 'react';
import { Slide } from '../../types';
import { theme } from '../../services/designSystem';

interface SlideTemplateProps {
  slide: Slide;
  slideNumber?: number;
}

/**
 * Base slide canvas component
 */
const SlideCanvas: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div 
      className={`slide-canvas bg-white min-h-screen p-16 flex flex-col ${className}`}
      style={{
        fontFamily: theme.fonts.title,
        padding: `${theme.layout.margin}px`
      }}
    >
      {children}
    </div>
  );
};

/**
 * Title component
 */
const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h1 
      className={`mb-6 text-black ${className}`}
      style={{
        fontSize: theme.typography.display.fontSize,
        fontWeight: theme.typography.display.fontWeight,
        letterSpacing: `${theme.typography.display.letterSpacing}em`,
        lineHeight: theme.typography.display.lineHeight
      }}
    >
      {children}
    </h1>
  );
};

/**
 * Section header component
 */
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h2 
      className="mb-4 text-black"
      style={{
        fontSize: theme.typography.section.fontSize,
        fontWeight: theme.typography.section.fontWeight,
        lineHeight: theme.typography.section.lineHeight
      }}
    >
      {children}
    </h2>
  );
};

/**
 * Body text component
 */
const BodyText: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p 
      className={`mb-4 ${className}`}
      style={{
        fontSize: theme.typography.body.fontSize,
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
 */
const BulletList: React.FC<{ items: string[]; className?: string }> = ({ 
  items, 
  className = '' 
}) => {
  return (
    <ul 
      className={`space-y-3 ${className}`}
      style={{
        fontSize: theme.typography.body.fontSize,
        fontWeight: theme.typography.body.fontWeight,
        lineHeight: theme.typography.body.lineHeight,
        color: theme.typography.body.color,
        paddingLeft: theme.spacing.md
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
 */
const TwoColumn: React.FC<{ 
  left: React.ReactNode; 
  right: React.ReactNode;
  className?: string;
}> = ({ left, right, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-12 ${className}`}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

/**
 * Highlight panel component
 */
const HighlightPanel: React.FC<{ 
  items: Array<{ label: string; value: string }>;
  className?: string;
}> = ({ items, className = '' }) => {
  return (
    <div 
      className={`space-y-4 ${className}`}
      style={{
        background: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: `${theme.layout.borderRadius.panel}px`,
        border: `1px solid ${theme.colors.text.muted}`
      }}
    >
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <div 
            className="text-slate-400"
            style={{
              fontSize: theme.typography.metadata.fontSize,
              fontWeight: theme.typography.metadata.fontWeight,
              textTransform: theme.typography.metadata.textTransform,
              letterSpacing: `${theme.typography.metadata.letterSpacing}em`
            }}
          >
            {item.label}
          </div>
          <div 
            className="text-black font-bold"
            style={{
              fontSize: theme.typography.section.fontSize,
              fontFamily: theme.fonts.mono
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
 */
const MetadataLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      className="mb-2"
      style={{
        fontSize: theme.typography.metadata.fontSize,
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
 */
const AccentLine: React.FC = () => {
  return (
    <div 
      className="mb-6"
      style={{
        width: '32px',
        height: '2px',
        background: `linear-gradient(135deg, ${theme.colors.gradient.start} 0%, ${theme.colors.gradient.mid} 50%, ${theme.colors.gradient.end} 100%)`
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
