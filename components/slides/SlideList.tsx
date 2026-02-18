import React from 'react';
import { Slide } from '../../types';
import { FileText } from 'lucide-react';

interface SlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
  onAddSlide: () => void;
}

export const SlideList: React.FC<SlideListProps> = ({
  slides,
  selectedSlideId,
  onSelectSlide,
  onAddSlide
}) => {
  return (
    <div className="w-[280px] shrink-0 bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
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
      
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSelectSlide(slide.id)}
            className={`w-full text-left p-4 rounded-[20px] border transition-all ${
              selectedSlideId === slide.id
                ? 'bg-slate-100 border-slate-300 shadow-sm'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <FileText className={`w-4 h-4 ${
                  selectedSlideId === slide.id ? 'text-slate-700' : 'text-slate-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded-[8px] bg-slate-200">
                    {slide.type.replace('-', ' ')}
                  </span>
                </div>
                <h4 className={`text-sm font-medium truncate ${
                  selectedSlideId === slide.id ? 'text-black' : 'text-slate-700'
                }`}>
                  {slide.title || `Slide ${index + 1}`}
                </h4>
                {slide.body && slide.body.length > 0 && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {slide.body[0]}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
