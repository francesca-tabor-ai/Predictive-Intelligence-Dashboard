
import React, { useState } from 'react';
import { 
  Zap, RefreshCw, Loader2, Lightbulb, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';
import { analyzeFlywheel } from '../services/openaiService';
import { FlywheelAnalysis } from '../types';

interface DataFlywheelProps {
  analysis: FlywheelAnalysis | null;
  setAnalysis: (analysis: FlywheelAnalysis) => void;
  details: string;
  setDetails: (details: string) => void;
}

export const DataFlywheel: React.FC<DataFlywheelProps> = ({ analysis, setAnalysis, details, setDetails }) => {
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    
    setLoading(true);
    try {
      const result = await analyzeFlywheel(details);
      setAnalysis(result);
    } catch (error) {
      console.error("Flywheel analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Network effects analyzer
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Data flywheel discovery
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Identify and strengthen self-reinforcing data network effects.
        </p>
      </header>

      <div className="flex gap-0 items-start relative transition-all duration-500">
        {/* Input Panel Wrapper */}
        <div 
          className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden ${
            isCollapsed ? 'w-0 opacity-0' : 'w-[360px] opacity-100 mr-12'
          }`}
        >
          <div className="bg-[#f8fafc] p-1.5 rounded-[40px] border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[34px] space-y-8 min-w-[300px]">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Business mechanism
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={10}
                  placeholder="e.g. A marketplace where sellers use dynamic pricing tools..."
                  className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>
              <button
                disabled={loading}
                className="w-full py-5 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mapping loops
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze mechanism
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Button Container */}
        <div className="relative flex flex-col items-center">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -left-5 top-10 z-20 p-2.5 bg-white border border-slate-100 rounded-full shadow-md hover:scale-110 hover:bg-slate-50 transition-all duration-300"
            title={isCollapsed ? "Expand Input Panel" : "Collapse Input Panel"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-slate-600" /> : <PanelLeftClose className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Report Panel */}
        <div className="flex-1 min-w-0 transition-all duration-500">
          {!analysis && !loading && (
            <div className="h-[600px] flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="w-20 h-20 rounded-[28px] bg-white border border-slate-100 flex items-center justify-center mb-8">
                <RefreshCw className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Identify your data moat</h3>
              <p className="text-slate-500 font-light max-w-sm">Enter your business context on the left to uncover potential network effects and compounding advantages.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-12 animate-pulse">
              <div className="h-48 bg-slate-50 rounded-[44px]" />
              <div className="grid grid-cols-2 gap-10">
                <div className="h-40 bg-slate-50 rounded-[44px]" />
                <div className="h-40 bg-slate-50 rounded-[44px]" />
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-24 animate-in fade-in duration-700">
              <div className="p-16 rounded-[48px] bg-black text-white flex items-center justify-between shadow-2xl">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-500">Flywheel strength rating</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-8xl font-black tracking-tighter">{analysis.flywheelStrengthRating}</span>
                    <span className="text-slate-500 text-3xl font-medium">/ 10</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-24 rounded-full transition-all duration-700 ${i < analysis.flywheelStrengthRating ? 'accent-gradient' : 'bg-slate-800'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <SectionCard title="Core economic engine" content={analysis.coreEconomicEngine} />
                <SectionCard title="Intelligence layer" content={analysis.intelligenceLayer} />
                <SectionCard title="Data generated" content={analysis.dataGenerated} />
                <SectionCard title="Economic pathway" content={analysis.economicImpactPathway} />
              </div>

              <section className="bg-slate-50/50 p-16 rounded-[48px] border border-slate-100 text-center relative overflow-hidden group hover:bg-white transition-all">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-12">Compounding mechanism</h3>
                <div className="relative max-w-2xl mx-auto py-12">
                  <div className="text-3xl font-black text-black italic leading-tight tracking-tight">
                    "{analysis.compoundingLoop}"
                  </div>
                  <div className="absolute inset-0 border-[4px] border-slate-200 border-dashed rounded-full -m-12 opacity-30 group-hover:rotate-45 transition-transform duration-[2000ms]"></div>
                </div>
              </section>

              <section className="space-y-10">
                 <div className="flex items-center gap-6">
                   <h3 className="text-2xl font-black text-black tracking-tight">Strategic recommendations</h3>
                   <div className="h-px flex-1 bg-slate-100"></div>
                 </div>
                 <div className="grid grid-cols-1 gap-6">
                   {analysis.strategicRecommendations.map((rec, i) => (
                     <div key={i} className="flex gap-8 p-10 bg-white border border-slate-100 rounded-[36px] group hover:border-black hover:shadow-xl hover:shadow-slate-100 transition-all">
                       <div className="text-slate-200 font-black text-4xl italic group-hover:text-black transition-colors shrink-0">{String(i+1).padStart(2, '0')}</div>
                       <p className="text-lg text-slate-600 font-light leading-relaxed pt-1">{rec}</p>
                     </div>
                   ))}
                 </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">{title}</h4>
    <div className="p-10 bg-white border border-slate-100 rounded-[40px] hover:border-black hover:shadow-lg hover:shadow-slate-100 transition-all h-full">
      <p className="text-black font-medium text-base leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);
