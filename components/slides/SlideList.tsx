import React, { useEffect, useRef } from 'react';
import { Slide } from '../../types';
import { FileText } from 'lucide-react';

interface SlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
  onAddSlide: () => void;
  onEnterPress?: () => void;
}

export const SlideList: React.FC<SlideListProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide,
  onEnterPress
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Scroll selected slide into view when it changes (only if not fully visible)
  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      // Use a small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        const container = containerRef.current;
        const selected = selectedRef.current;
        if (!container || !selected) return;
        
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selected.getBoundingClientRect();
        
        // Only scroll if the selected item is not fully visible
        const isAbove = selectedRect.top < containerRect.top;
        const isBelow = selectedRect.bottom > containerRect.bottom;
        
        if (isAbove || isBelow) {
          selected.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSlideId]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input, textarea, or other editable element
      const activeElement = document.activeElement;
      const isEditing = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      );

      if (isEditing) {
        return;
      }

      // Only handle if focus is within the slide list container or if no input is focused
      const isInContainer = containerRef.current?.contains(activeElement);
      if (!isInContainer && activeElement !== document.body) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = slides.findIndex(s => s.id === selectedSlideId);
        if (currentIndex === -1) {
          if (slides.length > 0) {
            onSelectSlide(slides[0].id);
          }
          return;
        }

        const nextIndex = e.key === 'ArrowDown' 
          ? (currentIndex + 1) % slides.length
          : (currentIndex - 1 + slides.length) % slides.length;
        
        onSelectSlide(slides[nextIndex].id);
      } else if (e.key === 'Enter' && selectedSlideId && onEnterPress) {
        e.preventDefault();
        onEnterPress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides, selectedSlideId, onSelectSlide, onEnterPress]);

  const selectedIndex = slides.findIndex(s => s.id === selectedSlideId);

  return (
    <div className="w-[280px] shrink-0 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-700">
          Slides ({slides.length})
        </h3>
        <button
          onClick={onAddSlide}
          className="px-3 py-1.5 rounded-[12px] bg-black hover:bg-slate-800 text-white text-xs font-bold transition-all"
        >
          + Add
        </button>
      </div>

      {/* Selected state indicator */}
      {selectedSlideId && selectedIndex !== -1 && (
        <div className="mb-3 px-3 py-2 rounded-[12px] bg-black text-white">
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">
            Currently Editing
          </div>
          <div className="text-sm font-bold">
            Slide {selectedIndex + 1}
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: 'calc(100vh - 280px)' }}
        tabIndex={0}
      >
        {slides.map((slide, index) => {
          const isSelected = selectedSlideId === slide.id;
          return (
            <button
              key={slide.id}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelectSlide(slide.id)}
              className={`w-full text-left p-4 rounded-[20px] border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-black border-black shadow-lg'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <FileText className={`w-4 h-4 ${
                    isSelected ? 'text-white' : 'text-slate-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      isSelected ? 'text-white opacity-80' : 'text-slate-400'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[8px] ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {slide.type.replace('-', ' ')}
                    </span>
                  </div>
                  <h4 className={`text-sm font-medium truncate ${
                    isSelected ? 'text-white' : 'text-slate-700'
                  }`}>
                    {slide.title || `Slide ${index + 1}`}
                  </h4>
                  {slide.body && slide.body.length > 0 && (
                    <p className={`text-xs mt-1 line-clamp-2 ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {slide.body[0]}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
