
import React from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Quote
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-32">
      {/* Hero Header */}
      <header className="relative max-w-4xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-6">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Strategic business model essay
        </div>
        <h1 className="text-6xl font-black text-black tracking-tight leading-[1.1] mb-8">
          The predictive intelligence flywheel
        </h1>
        <p className="text-2xl text-slate-500 font-light leading-relaxed max-w-3xl">
          A generalized business model for compounding economic advantage through data, prediction, and AI.
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-24">
          
          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              I. Introduction
            </h2>
            <p className="text-slate-600 leading-relaxed text-xl font-light mb-10">
              Historically, firms created value by producing goods, delivering services, or enabling transactions. In the digital era, platform companies created value by facilitating interactions between participants, generating network effects. However, the Predictive Intelligence Flywheel represents a further evolutionary step: firms no longer merely facilitate transactions—they optimize them.
            </p>
            <div className="my-12 p-10 bg-slate-50 rounded-[32px] border border-slate-100 italic text-black text-2xl font-light leading-snug">
              "Traditional firms execute decisions. Predictive intelligence flywheel firms improve decisions."
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              II. Formal definition
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-light mb-10">
              The Predictive Intelligence Flywheel is a self-reinforcing system consisting of five core stages that create a recursive loop of intelligence accumulation.
            </p>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {[
                { n: "01", t: "Behavioral data generation", d: "Collection of raw interaction signals." },
                { n: "02", t: "Predictive modeling", d: "Conversion of data into probabilities." },
                { n: "03", t: "Decision optimization", d: "Applying predictions to real-world choices." },
                { n: "04", t: "Economic value creation", d: "Realizing measurable gains in efficiency or revenue." },
                { n: "05", t: "Increased platform dependence", d: "Usage drives more data, reinforcing the cycle." }
              ].map(item => (
                <div key={item.n} className="group p-8 bg-white border border-slate-100 rounded-[24px] hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="text-slate-200 font-bold text-4xl italic group-hover:accent-gradient-text transition-all">{item.n}</div>
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1">{item.t}</h3>
                      <p className="text-slate-500 text-sm font-light">{item.d}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              III. Mathematical & economic structure
            </h2>
            <div className="bg-[#020617] p-12 rounded-[32px] text-slate-100 font-mono text-sm leading-relaxed overflow-x-auto border border-slate-800">
              <p className="text-slate-500 mb-6">// The recursive logic of intelligence returns</p>
              <div className="space-y-4">
                <p>M = f(D) <span className="text-slate-600 ml-4"># Model quality scales with data volume</span></p>
                <p>O = g(M) <span className="text-slate-600 ml-4"># Optimization scales with model accuracy</span></p>
                <p>V = h(O) <span className="text-slate-600 ml-4"># Economic value captured via optimization</span></p>
                <p>U = k(V) <span className="text-slate-600 ml-4"># Usage increases as users extract value</span></p>
                <p>D(t+1) = D(t) + U(t) <span className="text-slate-600 ml-4"># Data accumulation reinforces model</span></p>
              </div>
              <div className="mt-10 h-0.5 w-full bg-slate-800"></div>
              <p className="mt-8 text-xl font-bold accent-gradient-text tracking-widest uppercase">D → M → O → V → U → D</p>
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              IV. Sector generalizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CaseStudy title="Finance" content="Visa/Mastercard predict fraud and creditworthiness network-wide." />
              <CaseStudy title="Logistics" content="Uber predicts demand surges and optimal pricing in real-time." />
              <CaseStudy title="Manufacturing" content="Tesla uses telemetry to iterate on autonomous driving safety." />
              <CaseStudy title="Healthcare" content="Precision medicine platforms map genetic data to treatment outcomes." />
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              V. Compounding intelligence
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              Traditional industries exhibit diminishing returns to scale. PIF firms exhibit increasing returns to intelligence. More scale produces better predictions, creating superlinear growth dynamics and extreme dominance.
            </p>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
              VI. Conclusion
            </h2>
            <p className="text-black text-2xl font-bold leading-tight max-w-2xl">
              The predictive intelligence flywheel is a new economic architecture—the dominant form of value creation in the intelligence economy.
            </p>
          </section>

        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 space-y-12 sticky top-12 h-fit">
          <div className="p-10 bg-slate-50 border border-slate-100 rounded-[32px] space-y-10">
            <div className="space-y-4">
              <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Key implications</h4>
              <div className="space-y-8">
                <div>
                  <h5 className="font-bold text-black text-sm mb-2">Economic shift</h5>
                  <p className="text-slate-600 text-sm leading-relaxed font-light italic">"Economic advantage shifts from asset ownership to intelligence ownership."</p>
                </div>
                <div>
                  <h5 className="font-bold text-black text-sm mb-2">Growth dynamics</h5>
                  <p className="text-slate-600 text-sm leading-relaxed font-light italic">"Recursive loops create increasing returns to scale, diverging from linear growth."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[32px] accent-gradient text-white shadow-2xl shadow-indigo-200">
            <Cpu className="w-10 h-10 mb-6 opacity-80" />
            <h3 className="text-xl font-bold mb-4">The new moat</h3>
            <p className="text-white/80 text-sm leading-relaxed font-light">
              Historical behavioral data is non-replicable. This creates compounding asymmetry that later entrants cannot overcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CaseStudy: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="p-8 bg-white border border-slate-100 rounded-[24px] hover:border-slate-200 transition-all">
    <h4 className="font-bold text-black mb-3">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed font-light">{content}</p>
  </div>
);
