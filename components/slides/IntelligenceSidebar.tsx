import React from 'react';
import { Brain, Zap, TrendingUp, Layers, Shield, Map, FileText, BarChart3 } from 'lucide-react';
import { Slide } from '../../types';
import { MarkdownText } from './MarkdownText';

interface IntelligenceSidebarProps {
  slides: Slide[];
  activeSlideIndex: number | null;
  onSlideSelect: (index: number) => void;
  onClose?: () => void;
}

interface ModuleGroup {
  label: string;
  modules: {
    label: string;
    icon: React.ReactNode;
    slideTypes: string[];
  }[];
}

export const IntelligenceSidebar: React.FC<IntelligenceSidebarProps> = ({
  slides,
  activeSlideIndex,
  onSlideSelect,
  onClose
}) => {
  const moduleGroups: ModuleGroup[] = [
    {
      label: 'INTELLIGENCE CORE',
      modules: [
        { label: 'Executive Summary', icon: <FileText className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['cover-slide', 'executive-summary'] },
        { label: 'Flywheel Engine', icon: <Zap className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['flywheel'] },
        { label: 'Predictive Models', icon: <Brain className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['strategy'] },
        { label: 'Economic Impact', icon: <TrendingUp className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['roi'] }
      ]
    },
    {
      label: 'PLATFORM',
      modules: [
        { label: 'Architecture', icon: <Layers className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['architecture'] },
        { label: 'Data Pipeline', icon: <BarChart3 className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['architecture'] }
      ]
    },
    {
      label: 'STRATEGY',
      modules: [
        { label: 'Moat', icon: <Shield className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['strategy'] },
        { label: 'Roadmap', icon: <Map className="w-4 h-4" strokeWidth={1.5} />, slideTypes: ['roadmap', 'conclusion'] }
      ]
    }
  ];

  const getSlidesForModule = (slideTypes: string[]) => {
    return slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => slideTypes.includes(slide.type));
  };

  return (
    <aside 
      className="fixed left-0 top-0 h-full w-[360px] bg-[#020617] text-white z-50 border-r border-slate-800 flex flex-col overflow-y-auto"
      style={{
        background: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(12px)'
      }}
    >
      {/* Header */}
      <div className="p-8 border-b border-slate-800 shrink-0">
        <h1 className="text-lg font-bold tracking-tight uppercase mb-2">Intelligence Core</h1>
        <div 
          className="h-0.5 w-8 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 33%, #ec4899 66%, #f97316 100%)'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-8">
        {moduleGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <div className="px-4">
              <div 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
              >
                {group.label}
              </div>
            </div>
            
            {group.modules.map((module, moduleIndex) => {
              const moduleSlides = getSlidesForModule(module.slideTypes);
              const isActive = moduleSlides.some(({ index }) => index === activeSlideIndex);
              
              return (
                <div key={moduleIndex} className="space-y-1">
                  <button
                    onClick={() => {
                      if (moduleSlides.length > 0) {
                        onSlideSelect(moduleSlides[0].index);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-3 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="bg-white/5 rounded-full p-2">
                      {module.icon}
                    </div>
                    <span>{module.label}</span>
                    {isActive && (
                      <div 
                        className="ml-auto h-0.5 w-16 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 33%, #ec4899 66%, #f97316 100%)'
                        }}
                      />
                    )}
                  </button>
                  
                  {/* Sub-slides */}
                  {isActive && moduleSlides.length > 1 && (
                    <div className="ml-12 space-y-1">
                      {moduleSlides.map(({ slide, index }) => (
                        <button
                          key={index}
                          onClick={() => onSlideSelect(index)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all ${
                            index === activeSlideIndex
                              ? 'text-white bg-white/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <MarkdownText>{slide.title}</MarkdownText>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800 shrink-0">
        <div className="text-xs text-slate-500">
          {slides.length} intelligence module{slides.length !== 1 ? 's' : ''}
        </div>
      </div>
    </aside>
  );
};
