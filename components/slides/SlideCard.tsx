import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Slide, SlideType, Diagram, VisualReference, StructuredSlideDeck, StyleGuidance } from '../../types';
import { Copy, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Plus, Edit2, AlertCircle, ArrowRight, Image, Download, Sparkles, FileImage, FileDown } from 'lucide-react';
import { DiagramEditor } from '../diagrams/DiagramEditor';

interface SlideCardProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  deck: StructuredSlideDeck;
  onUpdate: (slide: Slide) => void;
  onUpdateDeck: (deck: StructuredSlideDeck) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const SLIDE_TYPES: SlideType[] = [
  'cover-slide',
  'executive-summary',
  'architecture',
  'roi',
  'flywheel',
  'strategy',
  'roadmap',
  'conclusion',
  'generic'
];

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  slideNumber,
  totalSlides,
  deck,
  onUpdate,
  onUpdateDeck,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onPrevious,
  onNext
}) => {
  const [localSlide, setLocalSlide] = useState<Slide>(slide);
  const [showDiagramEditor, setShowDiagramEditor] = useState(false);
  const [editingDiagram, setEditingDiagram] = useState<Diagram | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local slide when prop changes
  useEffect(() => {
    setLocalSlide(slide);
  }, [slide.id]);

  const handleUpdate = (updates: Partial<Slide>) => {
    const updated = { ...localSlide, ...updates };
    setLocalSlide(updated);
    onUpdate(updated);
  };

  // Detect design directives in content
  const designDirectivePatterns = useMemo(() => [
    /\b(single column|two column|diagram-led|text-led|layout|emphasis|callout|highlight|bold|italic|large|small|center|left|right|top|bottom)\b/gi,
    /\b(low|medium|high)\s+(emphasis|priority|importance)\b/gi,
    /\b(0|1|2)\s+(callout|highlight|emphasis)\b/gi,
    /\b(use|make|set|apply|style|format|design|layout|arrange)\b.*\b(column|diagram|text|emphasis|callout|highlight)\b/gi
  ], []);

  const detectDesignDirectives = (text: string): string[] => {
    const matches: string[] = [];
    designDirectivePatterns.forEach(pattern => {
      const found = text.match(pattern);
      if (found) {
        matches.push(...found);
      }
    });
    return [...new Set(matches)]; // Remove duplicates
  };

  const titleDirectives = useMemo(() => detectDesignDirectives(localSlide.title), [localSlide.title, designDirectivePatterns]);
  const bodyDirectives = useMemo(() => {
    const allBody = localSlide.body.join(' ');
    return detectDesignDirectives(allBody);
  }, [localSlide.body, designDirectivePatterns]);
  const keyDataDirectives = useMemo(() => {
    const allKeyData = (localSlide.keyData || []).join(' ');
    return detectDesignDirectives(allKeyData);
  }, [localSlide.keyData, designDirectivePatterns]);

  const hasDesignDirectives = titleDirectives.length > 0 || bodyDirectives.length > 0 || keyDataDirectives.length > 0;

  const handleStyleGuidanceUpdate = (updates: Partial<StyleGuidance>) => {
    const currentGuidance = localSlide.styleGuidance || {};
    handleUpdate({
      styleGuidance: { ...currentGuidance, ...updates }
    });
  };

  const handleMoveToStyleGuidance = () => {
    const allDirectives = [...titleDirectives, ...bodyDirectives, ...keyDataDirectives];
    const notes = allDirectives.join(', ');
    const currentGuidance = localSlide.styleGuidance || {};
    handleStyleGuidanceUpdate({ notes: currentGuidance.notes ? `${currentGuidance.notes}\n${notes}` : notes });
  };

  const handleBodyChange = (value: string) => {
    const body = value.split('\n').filter(line => line.trim().length > 0);
    handleUpdate({ body });
  };

  const handleKeyDataChange = (value: string) => {
    const keyData = value.split('\n').filter(line => line.trim().length > 0);
    handleUpdate({ keyData });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-black">
              Slide {slideNumber} of {totalSlides}
            </span>
            <select
              value={localSlide.type}
              onChange={(e) => handleUpdate({ type: e.target.value as SlideType })}
              className="px-3 py-1.5 rounded-[12px] bg-slate-50 border border-slate-200 text-sm font-medium text-black focus:bg-white focus:ring-2 focus:ring-black outline-none"
            >
              {SLIDE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Slide Actions Group */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-[12px] bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
              Slide Actions
            </span>
            <div className="h-4 w-px bg-slate-300"></div>
            <button
              onClick={onMoveUp}
              disabled={slideNumber === 1}
              className="p-1.5 rounded-[8px] hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Move Up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={slideNumber === totalSlides}
              className="p-1.5 rounded-[8px] hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Move Down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={onDuplicate}
              className="p-1.5 rounded-[8px] hover:bg-slate-200 text-slate-600 transition-all"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-[8px] hover:bg-red-100 text-red-600 transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Previous/Next Navigation */}
      <div className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-slate-100">
        <button
          onClick={onPrevious}
          disabled={slideNumber === 1 || !onPrevious}
          className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>
        <button
          onClick={onNext}
          disabled={slideNumber === totalSlides || !onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-[12px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Title
        </label>
        <input
          ref={titleInputRef}
          data-slide-title-input
          type="text"
          value={localSlide.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
          placeholder="Slide title..."
        />
        {titleDirectives.length > 0 && (
          <div className="mt-2 p-3 rounded-[12px] bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-amber-800 mb-1">
                  Design directives detected in Title
                </p>
                <p className="text-xs text-amber-700 mb-2">
                  Found: {titleDirectives.slice(0, 3).join(', ')}
                </p>
                <button
                  onClick={handleMoveToStyleGuidance}
                  className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Move to style guidance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Body
        </label>
        <textarea
          ref={bodyTextareaRef}
          value={localSlide.body.join('\n')}
          onChange={(e) => handleBodyChange(e.target.value)}
          rows={6}
          className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed resize-none"
          placeholder="Enter body content (one line per paragraph)..."
        />
        <p className="mt-2 text-xs text-slate-400">
          Each line will become a separate paragraph
        </p>
        {bodyDirectives.length > 0 && (
          <div className="mt-2 p-3 rounded-[12px] bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-amber-800 mb-1">
                  Design directives detected in Body
                </p>
                <p className="text-xs text-amber-700 mb-2">
                  Found: {bodyDirectives.slice(0, 3).join(', ')}
                  {bodyDirectives.length > 3 && ` +${bodyDirectives.length - 3} more`}
                </p>
                <button
                  onClick={handleMoveToStyleGuidance}
                  className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Move to style guidance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Data Highlights */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Key Data Highlights
        </label>
        <textarea
          value={localSlide.keyData?.join('\n') || ''}
          onChange={(e) => handleKeyDataChange(e.target.value)}
          rows={4}
          className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed resize-none"
          placeholder="Enter key data points (one per line)..."
        />
        <p className="mt-2 text-xs text-slate-400">
          Each line will become a key data highlight
        </p>
        {keyDataDirectives.length > 0 && (
          <div className="mt-2 p-3 rounded-[12px] bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-amber-800 mb-1">
                  Design directives detected in Key Data
                </p>
                <p className="text-xs text-amber-700 mb-2">
                  Found: {keyDataDirectives.slice(0, 3).join(', ')}
                  {keyDataDirectives.length > 3 && ` +${keyDataDirectives.length - 3} more`}
                </p>
                <button
                  onClick={handleMoveToStyleGuidance}
                  className="flex items-center gap-1 text-xs font-medium text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Move to style guidance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Design Directive Validation Warnings */}
      {hasDesignDirectives && (
        <div className="mb-6 p-4 rounded-[16px] bg-amber-50 border-2 border-amber-300">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 mb-1">
                Design Directives Detected
              </h4>
              <p className="text-xs text-amber-800 mb-3">
                Title, Body, and Key Data should contain content only. Design directives should be moved to the Style Guidance section below.
              </p>
              <button
                onClick={handleMoveToStyleGuidance}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold transition-all"
              >
                <ArrowRight className="w-3 h-3" />
                Move all to Style Guidance
              </button>
            </div>
          </div>
          {(titleDirectives.length > 0 || bodyDirectives.length > 0) && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-xs font-medium text-amber-800 mb-1">Detected directives:</p>
              <ul className="text-xs text-amber-700 space-y-1">
                {titleDirectives.length > 0 && (
                  <li>• Title: {titleDirectives.slice(0, 2).join(', ')}</li>
                )}
                {bodyDirectives.length > 0 && (
                  <li>• Body: {bodyDirectives.slice(0, 2).join(', ')}</li>
                )}
                {keyDataDirectives.length > 0 && (
                  <li>• Key Data: {keyDataDirectives.slice(0, 2).join(', ')}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Slide Style Guidance */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Slide Style Guidance
        </label>
        <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-6 space-y-4">
          <p className="text-xs text-slate-500 mb-4">
            Capture layout/styling intent here. This guidance is not exported to slide copy.
          </p>

          {/* Quick-pick prompts */}
          <div className="space-y-4">
            {/* Emphasis Level */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Emphasis Level
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleStyleGuidanceUpdate({ emphasisLevel: level })}
                    className={`flex-1 px-3 py-2 rounded-[12px] text-xs font-medium transition-all ${
                      localSlide.styleGuidance?.emphasisLevel === level
                        ? 'bg-black text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Intent */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Layout Intent
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['single-column', 'two-column', 'diagram-led', 'text-led'] as const).map((layout) => (
                  <button
                    key={layout}
                    onClick={() => handleStyleGuidanceUpdate({ layoutIntent: layout })}
                    className={`px-3 py-2 rounded-[12px] text-xs font-medium transition-all ${
                      localSlide.styleGuidance?.layoutIntent === layout
                        ? 'bg-black text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {layout.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            {/* Callout Preference */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Callout Preference
              </label>
              <div className="flex gap-2">
                {[0, 1, 2].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleStyleGuidanceUpdate({ calloutPreference: count })}
                    className={`flex-1 px-3 py-2 rounded-[12px] text-xs font-medium transition-all ${
                      localSlide.styleGuidance?.calloutPreference === count
                        ? 'bg-black text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {count} callout{count !== 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Free text notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Additional Style Notes
            </label>
            <textarea
              value={localSlide.styleGuidance?.notes || ''}
              onChange={(e) => handleStyleGuidanceUpdate({ notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-[16px] bg-white border border-slate-200 focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed resize-none"
              placeholder="Enter any additional style guidance or layout instructions..."
            />
          </div>
        </div>
      </div>

      {/* Images & Diagrams Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Images & Diagrams
          </label>
          <button
            onClick={() => {
              // Generate visuals for this slide
              // TODO: Implement visual generation
              alert('Generate visuals for this slide - to be implemented');
            }}
            className="px-3 py-1.5 rounded-[12px] bg-black hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3 h-3" />
            Generate Visuals
          </button>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-4">
          {localSlide.visuals && localSlide.visuals.length > 0 ? (
            <div className="space-y-3">
              {localSlide.visuals.map((visual, idx) => {
                const diagram = visual.diagramId 
                  ? deck.diagrams?.find(d => d.id === visual.diagramId)
                  : null;
                
                const updateVisual = (updates: Partial<VisualReference>) => {
                  const updatedVisuals = [...(localSlide.visuals || [])];
                  updatedVisuals[idx] = { ...visual, ...updates };
                  handleUpdate({ visuals: updatedVisuals });
                };

                const handleDownloadSVG = () => {
                  // TODO: Implement SVG download
                  alert(`Download SVG for ${visual.kind} - to be implemented`);
                };

                const handleDownloadPNG = () => {
                  // TODO: Implement PNG download
                  alert(`Download PNG for ${visual.kind} - to be implemented`);
                };
                
                return (
                  <div key={idx} className="bg-white rounded-[16px] p-4 border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {visual.kind === 'diagram' ? (
                          <FileImage className="w-4 h-4 text-slate-600" />
                        ) : (
                          <Image className="w-4 h-4 text-slate-600" />
                        )}
                        <span className="text-xs font-bold text-slate-700">
                          {diagram ? (diagram.name || diagram.type) : visual.kind.charAt(0).toUpperCase() + visual.kind.slice(1)}
                        </span>
                        {visual.assetId && (
                          <span className="text-[10px] text-slate-400">({visual.assetId})</span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          const updatedVisuals = localSlide.visuals?.filter((_, i) => i !== idx);
                          handleUpdate({ visuals: updatedVisuals });
                        }}
                        className="p-1.5 rounded-[8px] hover:bg-red-100 text-red-600 transition-all"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Placement */}
                    <div className="mb-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Placement
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['left', 'right', 'center', 'top', 'bottom', 'background-accent'] as const).map((placement) => (
                          <button
                            key={placement}
                            onClick={() => updateVisual({ placement })}
                            className={`px-2 py-1.5 rounded-[8px] text-[10px] font-medium transition-all ${
                              visual.placement === placement
                                ? 'bg-black text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {placement.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="mb-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Size
                      </label>
                      <div className="flex gap-1.5">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => updateVisual({ size })}
                            className={`flex-1 px-2 py-1.5 rounded-[8px] text-[10px] font-medium transition-all ${
                              (visual.size || 'medium') === size
                                ? 'bg-black text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mb-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={visual.caption || ''}
                        onChange={(e) => updateVisual({ caption: e.target.value })}
                        placeholder="Enter caption..."
                        className="w-full px-3 py-2 rounded-[8px] bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all text-xs"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      {diagram && (
                        <button
                          onClick={() => {
                            setEditingDiagram(diagram);
                            setShowDiagramEditor(true);
                          }}
                          className="flex-1 px-2 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-all flex items-center justify-center gap-1"
                          title="Edit diagram"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={handleDownloadSVG}
                        className="px-2 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-all flex items-center gap-1"
                        title="Download SVG"
                      >
                        <Download className="w-3 h-3" />
                        SVG
                      </button>
                      <button
                        onClick={handleDownloadPNG}
                        className="px-2 py-1.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-all flex items-center gap-1"
                        title="Download PNG"
                      >
                        <Download className="w-3 h-3" />
                        PNG
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">
              No visuals added yet. Add a diagram or image to get started.
            </p>
          )}
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setEditingDiagram(null);
                setShowDiagramEditor(true);
              }}
              className="flex-1 py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <FileImage className="w-4 h-4" />
              Add Diagram
            </button>
            <button
              onClick={() => {
                // Add image
                const newVisual: VisualReference = {
                  kind: 'image',
                  imageId: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  placement: 'left',
                  size: 'medium'
                };
                handleUpdate({
                  visuals: [...(localSlide.visuals || []), newVisual]
                });
              }}
              className="flex-1 py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              Add Image
            </button>
          </div>
        </div>
      </div>

      {/* Diagram Editor Modal */}
      {showDiagramEditor && (
        <DiagramEditor
          diagram={editingDiagram}
          onSave={(diagram) => {
            // Add or update diagram in deck
            const updatedDiagrams = [...(deck.diagrams || [])];
            const existingIndex = updatedDiagrams.findIndex(d => d.id === diagram.id);
            
            if (existingIndex >= 0) {
              updatedDiagrams[existingIndex] = diagram;
            } else {
              updatedDiagrams.push(diagram);
            }
            
            onUpdateDeck({ ...deck, diagrams: updatedDiagrams });
            
            // If this is a new diagram, add it to the slide's visuals
            if (!editingDiagram) {
              const newVisual: VisualReference = {
                kind: 'diagram',
                diagramId: diagram.id,
                placement: 'left'
              };
              handleUpdate({
                visuals: [...(localSlide.visuals || []), newVisual]
              });
            }
            
            setShowDiagramEditor(false);
            setEditingDiagram(null);
          }}
          onClose={() => {
            setShowDiagramEditor(false);
            setEditingDiagram(null);
          }}
        />
      )}
    </div>
  );
};
