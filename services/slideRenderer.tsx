import React from 'react';
import { StructuredSlideDeck, Slide, SlideType, Diagram } from '../types';
import { theme } from './designSystem';
import { ArchitectureDiagram } from '../components/slides/ArchitectureDiagram';
import { FlywheelDiagram } from '../components/slides/FlywheelDiagram';
import { renderDiagramSVG } from './diagramRenderer';

/**
 * Rendering pipeline that applies styling only at render/export time
 * Reads: deckStyleId + slides[] + diagrams[]
 * Applies: fonts, spacing, backgrounds, layout templates by slide type
 */

interface RenderContext {
  deck: StructuredSlideDeck;
  slide: Slide;
  slideNumber: number;
}

/**
 * Base slide canvas with theme-aware styling
 */
const SlideCanvas: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  background?: string;
}> = ({ children, className = '', background }) => {
  const bgColor = background || theme.colors.pureWhite;
  
  return (
    <div 
      className={`slide-canvas bg-white min-h-screen flex flex-col ${className}`}
      style={{
        fontFamily: theme.fonts.primary,
        padding: `${theme.layout.slidePadding}px`,
        background: bgColor
      }}
    >
      {children}
    </div>
  );
};

/**
 * Title component - Display Headers
 */
const Title: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({ 
  children, 
  className = '',
  color
}) => {
  return (
    <h1 
      className={`mb-6 ${className}`}
      style={{
        fontSize: `${theme.typography.display.fontSize}px`,
        fontWeight: theme.typography.display.fontWeight,
        letterSpacing: `${theme.typography.display.letterSpacing}em`,
        lineHeight: theme.typography.display.lineHeight,
        color: color || theme.typography.display.color
      }}
    >
      {children}
    </h1>
  );
};

/**
 * Body text component
 */
const BodyText: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({ 
  children, 
  className = '',
  color
}) => {
  return (
    <p 
      className={`mb-4 ${className}`}
      style={{
        fontSize: `${theme.typography.body.fontSize}px`,
        fontWeight: theme.typography.body.fontWeight,
        lineHeight: theme.typography.body.lineHeight,
        color: color || theme.typography.body.color
      }}
    >
      {children}
    </p>
  );
};

/**
 * Bullet list component
 */
const BulletList: React.FC<{ items: string[]; className?: string; color?: string }> = ({ 
  items, 
  className = '',
  color
}) => {
  return (
    <ul 
      className={`space-y-3 ${className}`}
      style={{
        fontSize: `${theme.typography.body.fontSize}px`,
        fontWeight: theme.typography.body.fontWeight,
        lineHeight: theme.typography.body.lineHeight,
        color: color || theme.typography.body.color,
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
 * Accent line component
 */
const AccentLine: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div 
      className={`mb-6 ${className}`}
      style={{
        width: '32px',
        height: '2px',
        background: `linear-gradient(135deg, ${theme.colors.gradient.indigo} 0%, ${theme.colors.gradient.purple} 33%, ${theme.colors.gradient.pink} 66%, ${theme.colors.gradient.orange} 100%)`
      }}
    />
  );
};

/**
 * Metadata label
 */
const MetadataLabel: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => {
  return (
    <div 
      className="mb-2"
      style={{
        fontSize: `${theme.typography.metadata.fontSize}px`,
        fontWeight: theme.typography.metadata.fontWeight,
        textTransform: theme.typography.metadata.textTransform,
        letterSpacing: `${theme.typography.metadata.letterSpacing}em`,
        color: color || theme.typography.metadata.color
      }}
    >
      {children}
    </div>
  );
};

/**
 * Cover Slide Template
 * Centered title, subtitle block, footer
 */
const CoverSlideTemplate: React.FC<RenderContext> = ({ slide, deck }) => {
  // Extract metadata from deck
  const metadata = deck.metadata || {};
  const preparedFor = metadata.toCompany || '';
  const attention = metadata.toPerson ? `${metadata.toPerson}${metadata.toRole ? `, ${metadata.toRole}` : ''}` : '';
  const authorName = metadata.fromPerson || '';
  const authorRole = metadata.fromRole || '';
  const authorCompany = metadata.fromCompany || '';

  // Use title from slide, or default
  const displayTitle = slide.title || 'Predictive Intelligence Flywheel Dashboard';

  return (
    <SlideCanvas
      background="radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 50%, rgba(2, 6, 23, 1) 100%), linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 1) 100%)"
    >
      <div className="flex-1 flex flex-col justify-start pt-12">
        {/* Title Section - Top Left */}
        <div className="mb-8">
          <Title color="#FFFFFF">{displayTitle}</Title>
          
          {/* Wide Gradient Accent Line */}
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
          <MetadataLabel color="#FFFFFF">DASHBOARD</MetadataLabel>
        </div>

        {/* Preparation Details */}
        <div className="space-y-2 mb-8">
          {preparedFor && (
            <BodyText color="#FFFFFF">Prepared for {preparedFor}</BodyText>
          )}
          {attention && (
            <BodyText color="#FFFFFF">Attention: {attention}</BodyText>
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
            <BodyText color="#FFFFFF" className="font-bold">{authorName}</BodyText>
          )}
          {authorRole && (
            <BodyText color="#FFFFFF">{authorRole}</BodyText>
          )}
          {authorCompany && (
            <BodyText color="#FFFFFF">{authorCompany}</BodyText>
          )}
        </div>
      </div>
    </SlideCanvas>
  );
};

/**
 * Executive Summary Template
 * Left-aligned title + text
 */
const ExecutiveSummaryTemplate: React.FC<RenderContext> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        {slide.keyData && slide.keyData.length > 0 ? (
          <TwoColumn
            left={<BulletList items={slide.body} />}
            right={<BulletList items={slide.keyData} />}
          />
        ) : (
          <BulletList items={slide.body} />
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Two-Column Template
 * Column grid with title and text areas
 */
const TwoColumnTemplate: React.FC<RenderContext> = ({ slide, slideNumber }) => {
  // Split body into two columns if keyData exists, otherwise use body for both
  const leftItems = slide.body.slice(0, Math.ceil(slide.body.length / 2));
  const rightItems = slide.keyData && slide.keyData.length > 0 
    ? slide.keyData 
    : slide.body.slice(Math.ceil(slide.body.length / 2));

  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        <TwoColumn
          left={<BulletList items={leftItems} />}
          right={<BulletList items={rightItems} />}
        />
      </div>
    </SlideCanvas>
  );
};

/**
 * Timeline Template
 * Timeline component with chronological items
 */
const TimelineTemplate: React.FC<RenderContext> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        <div className="space-y-6">
          {slide.body.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div 
                className="shrink-0 w-2 h-2 rounded-full mt-2"
                style={{
                  background: theme.colors.gradient.indigo
                }}
              />
              <div className="flex-1">
                <BodyText>{item}</BodyText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideCanvas>
  );
};

/**
 * Architecture Template
 * Left diagram placeholder + right bullets
 */
const ArchitectureTemplate: React.FC<RenderContext> = ({ slide, slideNumber, deck }) => {
  // Find diagram reference in visuals
  const diagramRef = slide.visuals?.find(v => v.kind === 'diagram' && v.diagramId);
  const diagram = diagramRef?.diagramId 
    ? deck.diagrams?.find(d => d.id === diagramRef.diagramId)
    : null;
  
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1">
        <TwoColumn
          left={
            diagram ? (
              <DiagramRenderer diagram={diagram} />
            ) : (
              <div 
                className="h-full flex items-center justify-center"
                style={{
                  background: theme.colors.coolGrey.light,
                  borderRadius: `${theme.layout.borderRadius.executive}px`,
                  border: `1px solid ${theme.colors.coolGrey.medium}`,
                  minHeight: '400px'
                }}
              >
                <MetadataLabel>Architecture Diagram</MetadataLabel>
              </div>
            )
          }
          right={<BulletList items={slide.body} />}
        />
      </div>
    </SlideCanvas>
  );
};

/**
 * Diagram Renderer Component
 */
const DiagramRenderer: React.FC<{ diagram: Diagram }> = ({ diagram }) => {
  const svgContent = React.useMemo(() => renderDiagramSVG(diagram), [diagram]);
  
  return (
    <div 
      className="h-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ minHeight: '400px' }}
    />
  );
};

/**
 * Closing Template
 * Centered summary + signature block
 */
const ClosingTemplate: React.FC<RenderContext> = ({ slide, deck }) => {
  const metadata = deck.metadata || {};
  const authorName = metadata.fromPerson || '';
  const authorRole = metadata.fromRole || '';
  const authorCompany = metadata.fromCompany || '';

  return (
    <SlideCanvas
      background="radial-gradient(ellipse at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 1) 50%, rgba(2, 6, 23, 1) 100%), linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(2, 6, 23, 1) 100%)"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <Title color="#FFFFFF">{slide.title || 'Strategic Call to Action'}</Title>
        
        {/* Gradient Accent Line - Centered */}
        <div 
          className="mb-8"
          style={{
            width: 'fit-content',
            minWidth: '300px',
            maxWidth: '500px',
            height: '2px',
            background: `linear-gradient(90deg, ${theme.colors.gradient.purple} 0%, ${theme.colors.gradient.orange} 100%)`
          }}
        />

        {/* Summary from body */}
        {slide.body.length > 0 && (
          <div className="mb-8">
            {slide.body.map((line, index) => (
              <BodyText key={index} color="#FFFFFF">{line}</BodyText>
            ))}
          </div>
        )}

        {/* Signature Block */}
        {(authorName || authorRole || authorCompany) && (
          <div className="space-y-2 mt-8">
            {authorName && (
              <BodyText color="#FFFFFF" className="font-bold">{authorName}</BodyText>
            )}
            {authorRole && (
              <BodyText color="#FFFFFF">{authorRole}</BodyText>
            )}
            {authorCompany && (
              <BodyText color="#FFFFFF">{authorCompany}</BodyText>
            )}
          </div>
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Generic Template (default)
 */
const GenericTemplate: React.FC<RenderContext> = ({ slide, slideNumber }) => {
  return (
    <SlideCanvas>
      <AccentLine />
      <MetadataLabel>Slide {slideNumber}</MetadataLabel>
      <Title>{slide.title}</Title>
      
      <div className="flex-1 space-y-6">
        <BulletList items={slide.body} />
        {slide.keyData && slide.keyData.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">Key Data Highlights</h3>
            <BulletList items={slide.keyData} />
          </div>
        )}
      </div>
    </SlideCanvas>
  );
};

/**
 * Template mapping by slide type
 */
const TEMPLATE_MAP: Record<SlideType, React.FC<RenderContext>> = {
  'cover-slide': CoverSlideTemplate,
  'executive-summary': ExecutiveSummaryTemplate,
  'architecture': ArchitectureTemplate,
  'roi': TwoColumnTemplate,
  'flywheel': GenericTemplate,
  'strategy': GenericTemplate,
  'roadmap': TimelineTemplate,
  'conclusion': ClosingTemplate,
  'generic': GenericTemplate
};

/**
 * Render a slide using the appropriate template based on slide type and deck style
 */
export function renderSlide(deck: StructuredSlideDeck, slide: Slide, slideNumber: number): React.ReactElement {
  const Template = TEMPLATE_MAP[slide.type] || GenericTemplate;
  
  return (
    <Template
      deck={deck}
      slide={slide}
      slideNumber={slideNumber}
    />
  );
}

/**
 * Get the template component for a slide (for use in React components)
 */
export function getSlideTemplate(deck: StructuredSlideDeck, slide: Slide): React.FC<RenderContext> {
  return TEMPLATE_MAP[slide.type] || GenericTemplate;
}
