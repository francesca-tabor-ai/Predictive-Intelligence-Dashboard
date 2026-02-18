import React from 'react';
import { StructuredSlideDeck } from '../types';
import { Palette } from 'lucide-react';

interface GlobalStylingPanelProps {
  deck: StructuredSlideDeck;
  onUpdate: (deck: StructuredSlideDeck) => void;
}

const THEME_PRESETS = [
  { id: 'mono-gradient-v1', name: 'Mono Gradient v1', description: 'Monochrome base with intelligence gradient accents' },
  { id: 'pure-minimal', name: 'Pure Minimal', description: 'Clean minimal design with no gradients' },
  { id: 'high-contrast', name: 'High Contrast', description: 'Maximum contrast for readability' }
];

export const GlobalStylingPanel: React.FC<GlobalStylingPanelProps> = ({
  deck,
  onUpdate
}) => {
  const handleThemeChange = (themeId: string) => {
    onUpdate({
      ...deck,
      deckStyleId: themeId
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-700">
          Global Styling
        </h3>
      </div>

      <div className="space-y-4">
        {/* Theme Preset Selector */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Theme Preset
          </label>
          <div className="space-y-2">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleThemeChange(preset.id)}
                className={`w-full text-left p-4 rounded-[20px] border transition-all ${
                  deck.deckStyleId === preset.id
                    ? 'bg-slate-100 border-slate-300 shadow-sm'
                    : 'bg-slate-50 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="font-medium text-sm text-black mb-1">
                  {preset.name}
                </div>
                <div className="text-xs text-slate-500">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Future: Typography scale selector */}
        {/* Future: Layout defaults per slide type */}
      </div>
    </div>
  );
};
