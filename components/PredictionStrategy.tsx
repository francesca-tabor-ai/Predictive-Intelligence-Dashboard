
import React, { useState } from 'react';
import { 
  Brain, Loader2, Send, ChevronRight, PanelLeftClose, PanelLeftOpen 
} from 'lucide-react';
import { generateStrategy } from '../services/openaiService';
import { StrategyReport } from '../types';

interface PredictionStrategyProps {
  report: StrategyReport | null;
  setReport: (report: StrategyReport) => void;
  details: string;
  setDetails: (details: string) => void;
}

export const PredictionStrategy: React.FC<PredictionStrategyProps> = ({ report, setReport, details, setDetails }) => {
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    
    setLoading(true);
    try {
      const result = await generateStrategy(details);
      setReport(result);
    } catch (error) {
      console.error("Strategy generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 bg-indigo-500"></div>
          Decision intelligence architect
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Prediction strategy builder
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Architect high-impact intelligence layers for your specific business case.
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
                  Business context
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={12}
                  placeholder="Describe your revenue drivers, churn factors, and industry..."
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Synthesize strategy
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
                <Brain className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Awaiting intelligence inputs</h3>
              <p className="text-slate-500 font-light max-w-sm">Provide details about your business to generate a multi-phase predictive strategy report.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-12">
              <div className="h-64 bg-slate-50 rounded-[32px] animate-pulse" />
              <div className="h-96 bg-slate-50 rounded-[32px] animate-pulse" />
            </div>
          )}

          {report && (
            <div className="space-y-20 animate-in fade-in duration-700">
              <section className="p-12 md:p-16 rounded-[44px] bg-black text-white shadow-2xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-slate-500">Executive Summary</h3>
                <ul className="space-y-10">
                  {report.executiveSummary.map((item, i) => (
                    <li key={i} className="flex items-start gap-8">
                      <div className="mt-3 w-2 h-2 accent-gradient rounded-full flex-shrink-0 shadow-lg shadow-indigo-500/50" />
                      <p className="text-xl font-light leading-relaxed text-slate-200">{item}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-bold text-black tracking-tight">Prediction opportunities</h3>
                   <div className="h-px flex-1 mx-8 bg-slate-100"></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-8 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Decision context</th>
                        <th className="pb-8 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Prediction</th>
                        <th className="pb-8 font-bold text-[10px] text-slate-400 uppercase tracking-widest text-right">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {report.opportunities.map((opt, i) => (
                        <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                          <td className="py-10 pr-8">
                            <div className="font-bold text-black mb-2 text-lg">{opt.decision}</div>
                            <div className="text-xs text-slate-400 tracking-wide uppercase font-medium">{opt.timeframe}</div>
                          </td>
                          <td className="py-10 pr-8 text-base text-slate-500 font-light italic leading-relaxed">"{opt.prediction}"</td>
                          <td className="py-10 text-right">
                            <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] ${
                              opt.impactScore === 'High' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {opt.impactScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="space-y-10">
                <h3 className="text-2xl font-bold text-black tracking-tight">High-leverage use cases</h3>
                <div className="grid grid-cols-1 gap-8">
                  {report.top3.map((useCase, i) => (
                    <div key={i} className="p-12 bg-slate-50/50 rounded-[44px] border border-slate-100 group transition-all hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                        <div className="space-y-8 flex-1">
                          <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-black shadow-lg">
                              {i+1}
                            </div>
                            <h4 className="text-2xl font-black text-black tracking-tight">{useCase.useCase}</h4>
                          </div>
                          <p className="text-lg text-slate-600 font-light leading-relaxed">{useCase.economicLogic}</p>
                          <div className="p-8 bg-white rounded-[32px] border border-slate-100 font-mono text-sm text-black shadow-sm">
                             <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Economic formula</div>
                             <div className="text-base font-medium">{useCase.impactMath}</div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col flex-wrap gap-3 w-full md:w-56 shrink-0">
                          {useCase.metrics.map((m, j) => (
                            <div key={j} className="px-5 py-3 bg-white rounded-2xl border border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider shadow-sm flex-1 md:flex-none text-center">
                              {m}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <section className="p-12 md:p-16 bg-slate-50/50 rounded-[44px] border border-slate-100">
                <h3 className="text-2xl font-bold text-black mb-16 tracking-tight">Phased rollout plan</h3>
                <div className="space-y-16 relative before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {report.rolloutPlan.map((step, i) => (
                    <div key={i} className="flex gap-12 relative items-start">
                      <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-200 shrink-0 z-10 shadow-sm" />
                      <div className="pt-0.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Phase {i+1}</div>
                        <p className="text-xl text-black font-light leading-relaxed">{step}</p>
                      </div>
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
