
import React, { useState } from 'react';
import { 
  Server, Cpu, Layers, Workflow, 
  ShieldCheck, Loader2, Database, Zap, RefreshCw, PlayCircle, AlertCircle, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';
import { generateArchitecture } from '../services/openaiService';
import { ArchitectureAnalysis } from '../types';

interface ArchitectureProps {
  report: ArchitectureAnalysis | null;
  setReport: (report: ArchitectureAnalysis) => void;
  details: string;
  setDetails: (details: string) => void;
}

export const Architecture: React.FC<ArchitectureProps> = ({ report, setReport, details, setDetails }) => {
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    
    setLoading(true);
    try {
      const result = await generateArchitecture(details);
      setReport(result);
    } catch (error) {
      console.error("Architecture generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Principal AI architect
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          AI platform blueprint
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Design a scalable, defensible AI platform that powers continuous learning.
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
                  Platform context
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={12}
                  placeholder="Describe your business model, core data sources, and prediction goals..."
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
                    Architecting...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4" />
                    Generate blueprint
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
          {!report && !loading && (
            <div className="h-[600px] flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-100 rounded-[32px]">
              <div className="w-20 h-20 rounded-[28px] bg-white border border-slate-100 flex items-center justify-center mb-8">
                <Workflow className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Awaiting platform context</h3>
              <p className="text-slate-500 font-light max-w-sm">Define your business model on the left to generate a comprehensive AI platform architecture blueprint.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-12 animate-pulse">
              <div className="h-64 bg-slate-50 rounded-[44px]" />
              <div className="h-96 bg-slate-50 rounded-[44px]" />
            </div>
          )}

          {report && (
            <div className="space-y-24 animate-in fade-in duration-700">
              <section className="p-16 rounded-[48px] bg-black text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 accent-gradient opacity-10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-slate-500">Economic flywheel</h3>
                <div className="space-y-12">
                   <div>
                     <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Core Loop</div>
                     <p className="text-3xl font-light leading-relaxed italic text-slate-200">"{report.businessModelFlywheel.coreLoop}"</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                     <div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Data Source</div>
                       <p className="text-base text-slate-300 leading-relaxed font-light">{report.businessModelFlywheel.dataGenerationSource}</p>
                     </div>
                     <div>
                       <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Value Capture</div>
                       <p className="text-base text-slate-300 leading-relaxed font-light">{report.businessModelFlywheel.economicImpact}</p>
                     </div>
                   </div>
                </div>
              </section>

              <section className="space-y-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black text-black tracking-tight">High-leverage predictions</h3>
                  <div className="h-px flex-1 mx-8 bg-slate-100"></div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {report.predictionProblems.map((p, i) => (
                    <div key={i} className="p-10 bg-white border border-slate-100 rounded-[36px] hover:border-black hover:shadow-xl hover:shadow-slate-100 transition-all group">
                      <div className="flex items-start gap-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                          {String(i+1).padStart(2, '0')}
                        </div>
                        <div className="space-y-4 pt-1">
                          <h4 className="text-xl font-black text-black tracking-tight">{p.problem}</h4>
                          <p className="text-slate-600 font-light text-base leading-relaxed">{p.value}</p>
                          <p className="text-indigo-600 font-mono text-[11px] uppercase tracking-[0.2em] font-bold">{p.economicLever}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-12">
                <div className="flex items-center gap-6">
                  <h3 className="text-2xl font-black text-black tracking-tight">Layered design</h3>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Layer 1: Unified Data', content: report.layeredArchitecture.dataLayer, icon: <Database /> },
                    { label: 'Layer 2: Feature Store', content: report.layeredArchitecture.featureStore, icon: <Layers /> },
                    { label: 'Layer 3: Training Platform', content: report.layeredArchitecture.trainingPlatform, icon: <Cpu /> },
                    { label: 'Layer 4: Inference Engine', content: report.layeredArchitecture.inferencePlatform, icon: <Zap /> },
                    { label: 'Layer 5: Continuous Learning', content: report.layeredArchitecture.feedbackLoop, icon: <RefreshCw /> }
                  ].map((layer, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-10 p-12 bg-slate-50/50 rounded-[44px] border border-slate-50 group hover:bg-white hover:border-indigo-200 transition-all">
                      <div className="p-5 bg-white rounded-[24px] border border-slate-100 group-hover:accent-gradient group-hover:text-white transition-all shrink-0 h-fit w-fit shadow-sm">
                        {React.cloneElement(layer.icon as React.ReactElement, { className: 'w-8 h-8' })}
                      </div>
                      <div className="pt-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{layer.label}</h4>
                        <p className="text-xl text-black font-light leading-relaxed">{layer.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Platform thinking</h4>
                  <div className="p-12 bg-white border border-slate-100 rounded-[44px] text-lg text-slate-600 font-light leading-relaxed hover:border-black transition-all">
                    {report.platformStrategy}
                  </div>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Moat & Defensibility</h4>
                  <div className="p-12 bg-black text-white rounded-[44px] text-lg font-light leading-relaxed shadow-2xl">
                    {report.defensibility}
                  </div>
                </div>
              </div>

              <section className="space-y-12">
                 <h3 className="text-2xl font-black text-black tracking-tight flex items-center gap-4">
                   <PlayCircle className="w-8 h-8 text-emerald-500" />
                   Phased execution roadmap
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {report.mvpPhases.map((phase, i) => (
                     <div key={i} className="p-10 bg-slate-50/50 rounded-[40px] border border-slate-100 hover:bg-white hover:border-emerald-200 transition-all">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{phase.phase}</div>
                        <h4 className="text-xl font-black text-black mb-6 tracking-tight leading-tight">{phase.objective}</h4>
                        <p className="text-sm text-slate-500 font-light leading-relaxed">{phase.reasoning}</p>
                     </div>
                   ))}
                 </div>
              </section>

              <section className="p-12 md:p-16 bg-white border border-slate-100 rounded-[48px] hover:border-rose-100 transition-all">
                <h3 className="text-2xl font-black text-black mb-12 flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-indigo-500" />
                  Governance & guardrails
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {report.governance.map((item, i) => (
                     <div key={i} className="space-y-4 group">
                       <div className="flex items-center gap-3 font-black text-black text-lg tracking-tight group-hover:text-rose-600 transition-colors">
                         <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                         {item.risk}
                       </div>
                       <p className="text-slate-500 text-sm font-light leading-relaxed pl-8 italic">"{item.guardrail}"</p>
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
