import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { StructuredSlideDeck } from '../../types';
import { getSlideTemplate } from '../../services/slideRenderer';

interface SlidePreviewProps {
  deck: StructuredSlideDeck;
  onClose: () => void;
}

export const SlidePreview: React.FC<SlidePreviewProps> = ({ deck, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.slides.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < deck.slides.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck.slides.length, onClose]);

  if (deck.slides.length === 0) {
    return null;
  }

  const currentSlide = deck.slides[currentIndex];
  const SlideComponent = getSlideTemplate(deck, currentSlide);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.slides.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < deck.slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        {/* Slide container */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-8">
          <div className="w-full max-w-7xl">
            <SlideComponent deck={deck} slide={currentSlide} slideNumber={currentIndex + 1} />
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-lg">
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
            disabled={deck.slides.length <= 1}
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          
          <span className="text-sm font-bold text-black px-4">
            {currentIndex + 1} / {deck.slides.length}
          </span>
          
          <button
            onClick={goToNext}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
            disabled={deck.slides.length <= 1}
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Keyboard navigation hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-50">
          Use arrow keys to navigate
        </div>
      </div>
    </div>
  );
};
