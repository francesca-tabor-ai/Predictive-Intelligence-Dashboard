import React from 'react';
import { StructuredSlideDeck, Diagram } from '../../types';
import { Download, FileDown, Image, FileImage, Package } from 'lucide-react';
import { exportDiagramSVG, exportDiagramPNG, exportAllDiagrams } from '../../services/diagramExport';
import { getDiagramDataURL } from '../../services/diagramExport';

interface DiagramsPanelProps {
  deck: StructuredSlideDeck;
  onUpdate: (deck: StructuredSlideDeck) => void;
}

export const DiagramsPanel: React.FC<DiagramsPanelProps> = ({
  deck,
  onUpdate
}) => {
  const diagrams = deck.diagrams || [];

  const handleDeleteDiagram = (diagramId: string) => {
    // Remove diagram from deck
    const updatedDiagrams = diagrams.filter(d => d.id !== diagramId);
    onUpdate({ ...deck, diagrams: updatedDiagrams });
    
    // Remove visual references to this diagram from all slides
    const updatedSlides = deck.slides.map(slide => ({
      ...slide,
      visuals: slide.visuals?.filter(v => v.diagramId !== diagramId)
    }));
    
    onUpdate({ ...deck, diagrams: updatedDiagrams, slides: updatedSlides });
  };

  const handleExportSVG = async (diagram: Diagram) => {
    await exportDiagramSVG(diagram);
  };

  const handleExportPNG = async (diagram: Diagram) => {
    await exportDiagramPNG(diagram);
  };

  const handleExportAll = async (format: 'svg' | 'png') => {
    await exportAllDiagrams(diagrams, format);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">
          Diagrams ({diagrams.length})
        </h3>
        {diagrams.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportAll('svg')}
              className="px-3 py-1.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Download all as SVG"
            >
              <FileImage className="w-3 h-3" />
              All SVG
            </button>
            <button
              onClick={() => handleExportAll('png')}
              className="px-3 py-1.5 rounded-[12px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Download all as PNG"
            >
              <Image className="w-3 h-3" />
              All PNG
            </button>
          </div>
        )}
      </div>

      {diagrams.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">
          No diagrams created yet. Add diagrams from slide cards.
        </p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {diagrams.map((diagram) => {
            const dataUrl = getDiagramDataURL(diagram);
            const usedInSlides = deck.slides.filter(slide => 
              slide.visuals?.some(v => v.diagramId === diagram.id)
            ).length;

            return (
              <div key={diagram.id} className="bg-slate-50 border border-slate-100 rounded-[16px] p-4">
                <div className="flex items-start gap-3 mb-3">
                  {/* Preview */}
                  <div className="shrink-0 w-20 h-20 rounded-[12px] bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src={dataUrl} 
                      alt={diagram.name || diagram.type}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-black mb-1">
                      {diagram.name || diagram.type}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      Type: {diagram.type}
                    </div>
                    {usedInSlides > 0 && (
                      <div className="text-xs text-slate-400">
                        Used in {usedInSlides} slide{usedInSlides !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportSVG(diagram)}
                      className="p-2 rounded-[8px] hover:bg-slate-200 text-slate-600"
                      title="Download SVG"
                    >
                      <FileImage className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportPNG(diagram)}
                      className="p-2 rounded-[8px] hover:bg-slate-200 text-slate-600"
                      title="Download PNG"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                    {usedInSlides === 0 && (
                      <button
                        onClick={() => handleDeleteDiagram(diagram.id)}
                        className="p-2 rounded-[8px] hover:bg-red-100 text-red-600"
                        title="Delete diagram"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
