
import React, { useState } from 'react';
import { 
  BarChart3, Loader2, Target, TrendingUp, ShieldCheck, 
  Search, Briefcase, Zap, Star, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { generateValuation } from '../services/openaiService';
import { ValuationReport } from '../types';

interface CompanyValuationProps {
  report: ValuationReport | null;
  setReport: (report: ValuationReport) => void;
  details: string;
  setDetails: (details: string) => void;
}

export const CompanyValuation: React.FC<CompanyValuationProps> = ({ report, setReport, details, setDetails }) => {
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    
    setLoading(true);
    try {
      const result = await generateValuation(details);
      setReport(result);
    } catch (error) {
      console.error("Valuation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecColor = (attr: string) => {
    switch (attr) {
      case 'Exceptional': return 'bg-emerald-500';
      case 'Attractive': return 'bg-indigo-500';
      case 'Neutral': return 'bg-slate-400';
      default: return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Intelligence capital framework (ICVF)
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Company valuation engine
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Identify and quantify compounding intelligence moats for family office investments.
        </p>
      </header>

      <div className="flex items-start transition-all duration-500 gap-0">
        {/* Input Panel Wrapper */}
        <div 
          className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden ${
            isCollapsed ? 'w-0 opacity-0' : 'w-[360px] opacity-100 mr-12'
          }`}
        >
          <div className="bg-[#f8fafc] p-1.5 rounded-[40px] border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[34px] space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                  Business & Data Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={12}
                  placeholder="Describe business model, recurring transactions, proprietary data generation..."
                  className="w-full px-6 py-5 rounded-[24px] bg-slate-50/50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all resize-none text-sm leading-relaxed"
                />
              </div>
              <button
                disabled={loading}
                className="w-full py-5 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Valuing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    Generate Valuation Report
                  </>
                )}
              </button>
              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-60">Senior Investment Analyst Mandate</span>
              </div>
            </form>
          </div>
        </div>

        {/* Vertical Divider and Collapse Button */}
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
                <Briefcase className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Awaiting business mandate</h3>
              <p className="text-slate-500 font-light max-w-sm">Define your investment target to calculate its Intelligence Multiplier and adjusted valuation.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-12">
              <div className="h-48 bg-slate-50 rounded-[40px] animate-pulse" />
              <div className="h-96 bg-slate-50 rounded-[40px] animate-pulse" />
            </div>
          )}

          {report && (
            <div className="space-y-24 animate-in fade-in duration-700">
              {/* Top Banner Recommendation */}
              <section className={`p-10 md:p-14 rounded-[44px] text-white shadow-2xl relative overflow-hidden transition-all duration-500 ${getRecColor(report.executiveSummary.attractiveness)}`}>
                 <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-white/70">ICVF Rating</h3>
                      <div className="text-4xl md:text-5xl font-black leading-tight tracking-tight">{report.recommendation.title}</div>
                    </div>
                    <div className="flex flex-col items-start md:items-end shrink-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-white/70">Attractiveness</div>
                      <div className="text-2xl md:text-3xl font-black">{report.executiveSummary.attractiveness}</div>
                    </div>
                 </div>
              </section>

              {/* Economic Engine */}
              <section className="bg-[#020617] p-12 md:p-16 rounded-[44px] text-white border border-slate-800 shadow-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-slate-500">Core Economic Engine</h3>
                <div className="space-y-10">
                   <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-slate-200">"{report.economicEngine.coreLoop}"</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Revenue Mechanism</h5>
                        <p className="text-base text-slate-300 font-light leading-relaxed">{report.economicEngine.revenueGeneration}</p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Decision Outcomes</h5>
                        <p className="text-base text-slate-300 font-light leading-relaxed">{report.economicEngine.decisionOutcomes}</p>
                      </div>
                   </div>
                </div>
              </section>

              {/* Multiplier & Valuation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-12 bg-white border border-slate-100 rounded-[44px] shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Intelligence Multiplier</h4>
                      <div className="text-8xl font-black accent-gradient-text tracking-tighter mb-6">
                        {report.intelligenceMultiplier.value.toFixed(1)}x
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed font-light">{report.intelligenceMultiplier.normalizationLogic}</p>
                    </div>
                 </div>
                 <div className="p-12 bg-black text-white rounded-[44px] flex flex-col justify-between shadow-2xl">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-slate-500">Adjusted Valuation Range</h4>
                      <div className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{report.executiveSummary.valuationRange}</div>
                      <div className="pt-8 border-t border-white/10 mt-6 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold uppercase tracking-widest">Base Financial</span>
                          <span className="font-bold text-lg">{report.valuation.baseFinancialValue}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold uppercase tracking-widest">Intelligence Adjusted</span>
                          <span className="font-bold text-indigo-400 text-lg">{report.valuation.adjustedValue}</span>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* ICVF Scores (0-5) */}
              <section>
                 <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-bold text-black tracking-tight">Intelligence Capital Assessment</h3>
                   <div className="h-px flex-1 mx-8 bg-slate-100"></div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                    <ScoreCard label="Data Advantage" score={report.scores.dataAdvantage.score} reasoning={report.scores.dataAdvantage.reasoning} />
                    <ScoreCard label="Prediction Impact" score={report.scores.predictionImpact.score} reasoning={report.scores.predictionImpact.reasoning} />
                    <ScoreCard label="Workflow Integration" score={report.scores.workflowIntegration.score} reasoning={report.scores.workflowIntegration.reasoning} />
                    <ScoreCard label="Feedback Velocity" score={report.scores.feedbackVelocity.score} reasoning={report.scores.feedbackVelocity.reasoning} />
                    <ScoreCard label="Decision Frequency" score={report.scores.decisionFrequency.score} reasoning={report.scores.decisionFrequency.reasoning} />
                 </div>
              </section>

              {/* Compounding & Moat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Intelligence Compounding (ICR)
                    </h4>
                    <div className="p-12 bg-slate-50/50 rounded-[44px] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                      <div className="text-2xl font-black text-black mb-6 flex items-center gap-3">
                        {report.compoundingRate.classification}
                        <div className={`w-3 h-3 rounded-full ${report.compoundingRate.classification === 'Exceptional' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
                      </div>
                      <p className="text-base text-slate-500 font-light leading-relaxed">{report.compoundingRate.reasoning}</p>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" />
                      Defensibility Moat
                    </h4>
                    <div className="p-12 bg-slate-50/50 rounded-[44px] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                      <div className="text-2xl font-black text-black mb-6">{report.defensibility.moatStrength}</div>
                      <p className="text-base text-slate-500 font-light leading-relaxed">{report.defensibility.analysis}</p>
                    </div>
                 </div>
              </div>

              {/* Final Flywheel Strength */}
              <section className="p-12 md:p-16 bg-white border border-slate-100 rounded-[44px] shadow-sm hover:border-black transition-all">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-black mb-6 tracking-tight">Flywheel Strength Rating</h3>
                      <p className="text-lg text-slate-600 font-light leading-relaxed">{report.flywheelStrength.reasoning}</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center relative w-40 h-40 rounded-full border-[8px] border-slate-50 shadow-inner">
                       <div className="text-5xl font-black text-black">{report.flywheelStrength.rating}</div>
                       <div className="text-[10px] font-bold text-slate-400 absolute -bottom-5 bg-white px-3 py-1 rounded-full border border-slate-50 uppercase tracking-widest">Score / 10</div>
                       <div className="absolute inset-0 border-[8px] border-black rounded-full" 
                            style={{ clipPath: `inset(0 0 0 ${100 - (report.flywheelStrength.rating * 10)}%)`, transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                    </div>
                 </div>
              </section>

              {/* Justification */}
              <section className="p-12 md:p-16 bg-slate-50 border border-slate-100 rounded-[44px]">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Final Investment Justification</h4>
                 <p className="text-2xl font-light leading-relaxed text-black italic">"{report.recommendation.justification}"</p>
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ScoreCard: React.FC<{ label: string; score: number; reasoning: string }> = ({ label, score, reasoning }) => (
  <div className="space-y-4 flex flex-col">
    <div className="p-8 bg-white border border-slate-100 rounded-[32px] flex-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 group-hover:text-indigo-500 transition-colors">{label}</div>
      <div className="flex items-center gap-1.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i < score ? 'bg-black' : 'bg-slate-100'}`} />
        ))}
      </div>
      <p className="text-[12px] text-slate-500 leading-relaxed font-light">{reasoning}</p>
    </div>
  </div>
);
