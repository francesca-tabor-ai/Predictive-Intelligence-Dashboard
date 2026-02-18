
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts';
import { 
  TrendingUp, Loader2, Calculator, PieChart, Info, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { calculateROIReport } from '../services/openaiService';
import { ROIReport } from '../types';

interface ROICalculatorProps {
  report: ROIReport | null;
  setReport: (report: ROIReport) => void;
  details: string;
  setDetails: (details: string) => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ report, setReport, details, setDetails }) => {
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;
    
    setLoading(true);
    try {
      const result = await calculateROIReport(details);
      setReport(result);
    } catch (error) {
      console.error("ROI report generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val}`;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Economic impact modeler
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Predictive ROI modeler
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Quantify the economic impact of your intelligence flywheel.
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
                  Business or Sector Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={12}
                  placeholder="Describe your revenue model, current churn rates, and potential for predictive automation..."
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
                    Modeling...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" />
                    Synthesize ROI Report
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
                <PieChart className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Calculate economic returns</h3>
              <p className="text-slate-500 font-light max-w-sm">Define your business on the left to generate a comprehensive ROI analysis anchored in predictive intelligence.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-12">
              <div className="h-64 bg-slate-50 rounded-[44px] animate-pulse" />
              <div className="h-96 bg-slate-50 rounded-[44px] animate-pulse" />
            </div>
          )}

          {report && (
            <div className="space-y-24 animate-in fade-in duration-700">
              <section className="p-12 md:p-16 rounded-[48px] bg-black text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 accent-gradient opacity-10 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-12 text-slate-500">Executive Summary</h3>
                <ul className="space-y-10">
                  {report.executiveSummary.map((item, i) => (
                    <li key={i} className="flex items-start gap-10">
                      <div className="mt-3 w-2 h-2 accent-gradient rounded-full flex-shrink-0 shadow-lg shadow-indigo-500/50" />
                      <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-200">{item}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Baseline Economics</h4>
                   <div className="bg-slate-50/50 p-12 rounded-[44px] border border-slate-100 space-y-10 hover:bg-white transition-all">
                     <Stat label="Annual Revenue" value={report.baselineEconomics.annualRevenue} />
                     <Stat label="Annual Operating Cost" value={report.baselineEconomics.annualCost} />
                     <Stat label="Annual Gross Profit" value={report.baselineEconomics.annualProfit} />
                   </div>
                </div>
                <div className="space-y-8">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Key ROI Metrics</h4>
                   <div className="accent-gradient p-12 rounded-[44px] text-white space-y-10 shadow-2xl shadow-indigo-200/50">
                     <Stat label="Net Annual ROI" value={report.roiCalculation.netROI} light />
                     <Stat label="Net Benefit (Year 1)" value={report.roiCalculation.annualBenefit} light />
                     <Stat label="Payback Period" value={report.paybackPeriod} light />
                   </div>
                </div>
              </div>

              <section>
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-black text-black tracking-tight">High-leverage predictions</h3>
                   <div className="h-px flex-1 mx-8 bg-slate-100"></div>
                </div>
                <div className="bg-white border border-slate-100 rounded-[44px] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-10 py-8 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Opportunity</th>
                        <th className="px-10 py-8 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Economic Impact Type</th>
                        <th className="px-10 py-8 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em] text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {report.predictionOpportunities.map((p, i) => (
                        <tr key={i} className="group hover:bg-slate-50/20 transition-all">
                          <td className="px-10 py-8 text-black font-black tracking-tight text-lg">{p.opportunity}</td>
                          <td className="px-10 py-8 text-slate-500 text-base font-light italic leading-relaxed">{p.impactType}</td>
                          <td className="px-10 py-8 text-right">
                             <div className="inline-flex items-center gap-4">
                               <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-black group-hover:accent-gradient transition-all duration-1000" style={{ width: `${p.score}%` }}></div>
                               </div>
                               <span className="text-xs font-black text-slate-400 w-6">{p.score}</span>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-12 md:p-16 border border-slate-100 rounded-[48px] shadow-sm">
                <h3 className="text-2xl font-black text-black mb-16 tracking-tight">3-year benefit projection</h3>
                <div className="h-[500px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={report.threeYearProjection} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 600}} dy={15} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} tickFormatter={(v) => formatCurrency(v)} dx={-10} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: '1px solid #f1f5f9', padding: '20px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)'}} />
                       <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '50px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em'}} />
                       <Bar dataKey="benefitNumeric" name="Benefit" fill="#000000" radius={[6, 6, 0, 0]} barSize={40}>
                         <LabelList dataKey="benefitNumeric" position="top" formatter={(v: any) => formatCurrency(v)} style={{ fontSize: '11px', fontWeight: '900', fill: '#000000', opacity: 0.6 }} dy={-10} />
                       </Bar>
                       <Bar dataKey="costNumeric" name="Cost" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} />
                     </BarChart>
                   </ResponsiveContainer>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3 px-4">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Sensitivity Analysis
                  </h4>
                  <div className="p-12 bg-slate-50/50 rounded-[44px] border border-slate-100 text-lg text-slate-600 font-light leading-relaxed hover:bg-white transition-all">
                    {report.sensitivityAnalysis}
                  </div>
                </div>
                <div className="space-y-8">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3 px-4">
                    <Info className="w-3.5 h-3.5" />
                    Strategic Recommendation
                  </h4>
                  <div className="p-12 bg-black text-white rounded-[44px] text-lg font-light leading-relaxed shadow-2xl">
                    {report.strategicRecommendation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string; light?: boolean }> = ({ label, value, light }) => (
  <div>
    <div className={`text-[11px] font-black uppercase tracking-[0.15em] mb-3 ${light ? 'text-white/60' : 'text-slate-400'}`}>
      {label}
    </div>
    <div className={`text-4xl md:text-5xl font-black tracking-tighter ${light ? 'text-white' : 'text-black'}`}>
      {value}
    </div>
  </div>
);
