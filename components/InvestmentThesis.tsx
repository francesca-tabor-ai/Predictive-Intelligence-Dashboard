
import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Target,
  BarChart3,
  Briefcase
} from 'lucide-react';

export const InvestmentThesis: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-32">
      <header className="max-w-4xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-6">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Strategic intelligence economy
        </div>
        <h1 className="text-6xl font-black text-black tracking-tight leading-[1.1] mb-8">
          Investment Thesis: The Predictive Intelligence Flywheel Economy
        </h1>
        <p className="text-2xl text-slate-500 font-light leading-relaxed max-w-3xl">
          The dominant companies of the next 20 years will not be software platforms — they will be Predictive Intelligence Platforms.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-24">
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Executive Summary
            </h2>
            <div className="space-y-6 text-slate-600 text-lg font-light leading-relaxed">
              <p>The dominant companies of the next 20 years will not be software platforms — they will be Predictive Intelligence Platforms that continuously improve economic decisions using proprietary behavioral data.</p>
              <ul className="list-none space-y-4 pl-0">
                <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full accent-gradient mt-2.5 shrink-0" /> These companies exhibit increasing returns to scale driven by compounding prediction advantage, not traditional network effects or capital scale.</li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full accent-gradient mt-2.5 shrink-0" /> The core economic asset is no longer software, but proprietary behavioral data converted into continuously improving prediction systems.</li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full accent-gradient mt-2.5 shrink-0" /> Firms that successfully activate the Predictive Intelligence Flywheel achieve structural economic defensibility, expanding margins, and winner-take-most market dynamics.</li>
                <li className="flex gap-4"><div className="w-1.5 h-1.5 rounded-full accent-gradient mt-2.5 shrink-0" /> Investment alpha will accrue to investors who identify companies at the early activation stage of this flywheel, before prediction advantage fully compounds.</li>
              </ul>
            </div>
          </section>

          <section className="p-12 bg-black text-white rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 accent-gradient opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-slate-400">Core Thesis Statement</h2>
            <p className="text-3xl font-light leading-tight italic">
              "The next generation of market-defining companies will derive their primary competitive advantage from continuously improving prediction systems powered by proprietary behavioral data, embedded directly into high-value economic decision workflows."
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12 border-t border-white/10 pt-10">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Increasing returns to intelligence</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Rising switching costs</div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Structural defensibility</div>
              <div className="text-xs text-slate-500 uppercase font-bold Thesis font-bold tracking-widest">Expanding margins</div>
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Structural Shift: From Software to Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Software Era</h3>
                <ul className="list-none p-0 text-sm space-y-3 text-slate-500">
                  <li>Code and Features</li>
                  <li>Distribution Network</li>
                  <li>Traditional Network Effects</li>
                  <li className="pt-4 border-t border-slate-200 text-slate-400 italic">"Advantages saturate over time"</li>
                </ul>
              </div>
              <div className="p-10 bg-white rounded-[32px] border border-black shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-6">Intelligence Era</h3>
                <ul className="list-none p-0 text-sm space-y-3 text-black font-medium">
                  <li>Proprietary Behavioral Data</li>
                  <li>Prediction Accuracy</li>
                  <li>Longitudinal Data History</li>
                  <li className="pt-4 border-t border-slate-200 text-slate-400 italic">"Advantages compound over time"</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Mechanism of Compounding Advantage
            </h2>
            <p className="text-slate-600 text-lg font-light mb-10 leading-relaxed">
              Traditional companies exhibit diminishing returns. AI-native predictive platforms exhibit increasing returns. As data volume and diversity increase, prediction accuracy improves, leading to better decisions, higher economic value, and accelerated platform adoption.
            </p>
            <div className="bg-[#020617] p-12 rounded-[40px] border border-slate-800 text-center">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">Compounding loop dynamics</div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {["Behavior", "Data", "Prediction", "Decision", "Outcome", "Usage"].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-sm uppercase tracking-tighter">
                      {step}
                    </div>
                    {i < 5 && <div className="text-slate-700">→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Defensibility Mechanisms (The Four Moats)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MoatCard 
                title="Proprietary Behavioral Data" 
                content="Competitors cannot replicate historical behavioral data. Prediction accuracy depends heavily on longitudinal history, making time a defensive asset."
              />
              <MoatCard 
                title="Compounding Model Advantage" 
                content="Prediction systems continuously improve. Early leaders accumulate structural performance advantages that leave competitors behind."
              />
              <MoatCard 
                title="Workflow Integration Lock-In" 
                content="Predictions become embedded in operational decisions. Removing predictions degrades economic outcomes, creating structural switching costs."
              />
              <MoatCard 
                title="Data Network Effects" 
                content="More users generate more data, which improves accuracy, which attracts more users. A pure compounding loop."
              />
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Investment Timing & Entry Point
            </h2>
            <div className="p-10 bg-slate-50 rounded-[32px] border border-slate-100 italic text-black text-2xl font-light leading-snug">
              "Maximum investment alpha occurs when companies are transitioning from Data Collection Platforms to Decision Optimization Platforms."
            </div>
            <p className="text-slate-600 text-lg font-light mt-10">
              Value creation accelerates dramatically between the Predictive Stage and the Autonomous Stage. Investors who recognize this transition before full compounding is priced in capture the highest returns.
            </p>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              Conclusion
            </h2>
            <p className="text-black text-2xl font-bold leading-tight max-w-3xl">
              Firms that control predictive intelligence layers will control markets. Economic power is shifting from asset ownership to intelligence ownership.
            </p>
          </section>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-12 sticky top-12 h-fit">
          <div className="p-10 bg-slate-50 border border-slate-100 rounded-[32px] space-y-10">
            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Pattern Recognition</h4>
            <div className="space-y-8">
              <PatternItem 
                title="Frequency" 
                description="High-frequency behavioral data accelerates flywheel velocity." 
              />
              <PatternItem 
                title="Direct Value" 
                description="Prediction must directly influence pricing, credit, or allocation." 
              />
              <PatternItem 
                title="Feedback" 
                description="User actions must produce outcome data for the model." 
              />
            </div>
          </div>

          <div className="p-10 rounded-[32px] accent-gradient text-white shadow-2xl shadow-indigo-200">
            <BarChart3 className="w-10 h-10 mb-6 opacity-80" />
            <h3 className="text-xl font-bold mb-4">Investment alpha</h3>
            <p className="text-white/80 text-sm leading-relaxed font-light">
              Alph occurs at the transition stage. Identify companies where prediction advantage exists but is not yet fully compounding.
            </p>
          </div>

          <div className="p-10 bg-black rounded-[32px] text-white">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Risk Checklist</h4>
            <ul className="text-xs space-y-4 font-light text-slate-400">
              <li>• Weak data generation frequency</li>
              <li>• Prediction not embedded in workflow</li>
              <li>• Commodity data / Weak defensibility</li>
              <li>• Failure to activate the feedback loop</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const MoatCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="p-8 bg-white border border-slate-100 rounded-[24px] hover:border-slate-200 transition-all">
    <h4 className="font-bold text-black mb-3 text-lg">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed font-light">{content}</p>
  </div>
);

const PatternItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div>
    <h5 className="font-bold text-black text-sm mb-2">{title}</h5>
    <p className="text-slate-600 text-sm leading-relaxed font-light italic">"{description}"</p>
  </div>
);
