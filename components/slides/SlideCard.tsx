import React, { useState } from 'react';
import { Slide, SlideType, Diagram, VisualReference, StructuredSlideDeck } from '../../types';
import { Copy, Trash2, ChevronUp, ChevronDown, X, Plus, Edit2 } from 'lucide-react';
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
  onMoveDown
}) => {
  const [localSlide, setLocalSlide] = useState<Slide>(slide);
  const [showDiagramEditor, setShowDiagramEditor] = useState(false);
  const [editingDiagram, setEditingDiagram] = useState<Diagram | null>(null);

  const handleUpdate = (updates: Partial<Slide>) => {
    const updated = { ...localSlide, ...updates };
    setLocalSlide(updated);
    onUpdate(updated);
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Slide {slideNumber}
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
        <div className="flex items-center gap-2">
          <button
            onClick={onMoveUp}
            disabled={slideNumber === 1}
            className="p-2 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={slideNumber === totalSlides}
            className="p-2 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-2 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-[12px] bg-red-50 hover:bg-red-100 text-red-600 transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Title
        </label>
        <input
          type="text"
          value={localSlide.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm font-medium"
          placeholder="Slide title..."
        />
      </div>

      {/* Body */}
      <div className="mb-6">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Body
        </label>
        <textarea
          value={localSlide.body.join('\n')}
          onChange={(e) => handleBodyChange(e.target.value)}
          rows={6}
          className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed resize-none"
          placeholder="Enter body content (one line per paragraph)..."
        />
        <p className="mt-2 text-xs text-slate-400">
          Each line will become a separate paragraph
        </p>
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
      </div>

      {/* Visuals / Diagrams Section */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          Visuals / Diagrams
        </label>
        <div className="bg-slate-50 border border-slate-100 rounded-[20px] p-4">
          {localSlide.visuals && localSlide.visuals.length > 0 ? (
            <div className="space-y-2">
              {localSlide.visuals.map((visual, idx) => {
                const diagram = visual.diagramId 
                  ? deck.diagrams?.find(d => d.id === visual.diagramId)
                  : null;
                
                return (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-[12px] p-3 border border-slate-200">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs font-medium text-slate-600">
                        {diagram ? (diagram.name || diagram.type) : visual.kind} ({visual.placement})
                      </span>
                      {visual.diagramId && (
                        <span className="text-xs text-slate-400">
                          {diagram ? diagram.type : 'Diagram'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {diagram && (
                        <button
                          onClick={() => {
                            setEditingDiagram(diagram);
                            setShowDiagramEditor(true);
                          }}
                          className="p-1.5 rounded-[8px] hover:bg-slate-100 text-slate-600"
                          title="Edit diagram"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const updatedVisuals = localSlide.visuals?.filter((_, i) => i !== idx);
                          handleUpdate({ visuals: updatedVisuals });
                        }}
                        className="p-1.5 rounded-[8px] hover:bg-red-100 text-red-600"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              No visuals added yet
            </p>
          )}
          <button
            onClick={() => {
              setEditingDiagram(null);
              setShowDiagramEditor(true);
            }}
            className="mt-3 w-full py-2 px-4 rounded-[12px] bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Diagram
          </button>
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
