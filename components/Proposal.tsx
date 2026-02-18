import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Download, Edit3, Eye, CheckCircle, FileDown, Presentation } from 'lucide-react';
import { generateProposal } from '../services/openaiService';
import { StrategyReport, FlywheelAnalysis, ArchitectureAnalysis, ROIReport, Slide, SlideDeck } from '../types';
import { parseSlides, validateSlides } from '../services/slideParser';
import { exportToPDF, exportToPowerPoint } from '../services/exportEngine';
import { SlidePreview } from './slides/SlidePreview';

interface ProposalProps {
  strategyReport: StrategyReport | null;
  flywheelAnalysis: FlywheelAnalysis | null;
  architectureReport: ArchitectureAnalysis | null;
  roiReport: ROIReport | null;
}

type ProposalStatus = 'draft' | 'approved' | 'rendered';

export const Proposal: React.FC<ProposalProps> = ({
  strategyReport,
  flywheelAnalysis,
  architectureReport,
  roiReport
}) => {
  const [toCompany, setToCompany] = useState('');
  const [toPerson, setToPerson] = useState('');
  const [toRole, setToRole] = useState('');
  const [fromCompany, setFromCompany] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [fromRole, setFromRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [proposalContent, setProposalContent] = useState<string>('');
  const [parsedSlides, setParsedSlides] = useState<Slide[]>([]);
  const [status, setStatus] = useState<ProposalStatus>('draft');
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  // Parse slides whenever proposal content changes
  useEffect(() => {
    if (proposalContent) {
      const slides = parseSlides(proposalContent);
      setParsedSlides(slides);
      
      const validation = validateSlides(slides);
      setParseErrors(validation.errors);
      
      // Reset status if slides change
      if (status === 'approved' || status === 'rendered') {
        setStatus('draft');
      }
    } else {
      setParsedSlides([]);
      setParseErrors([]);
    }
  }, [proposalContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!toCompany || !toPerson || !fromCompany || !fromPerson) {
      alert('Please fill in all required fields (Company and Person for both Recipient and Sender)');
      return;
    }

    setLoading(true);
    try {
      const presentationContent = await generateProposal(
        toCompany,
        toPerson,
        toRole,
        fromCompany,
        fromPerson,
        fromRole,
        strategyReport,
        flywheelAnalysis,
        architectureReport,
        roiReport
      );

      setProposalContent(presentationContent);
      setStatus('draft');
    } catch (error) {
      console.error("Proposal creation failed", error);
      alert('Failed to generate proposal. Please check your OpenAI API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (parsedSlides.length === 0) {
      alert('No slides to preview. Please generate or edit the proposal content first.');
      return;
    }
    setShowPreview(true);
  };

  const handleApprove = () => {
    if (parseErrors.length > 0) {
      alert(`Please fix the following errors before approving:\n${parseErrors.join('\n')}`);
      return;
    }
    if (parsedSlides.length === 0) {
      alert('No slides to approve. Please generate or edit the proposal content first.');
      return;
    }
    setStatus('approved');
  };

  const handleExportPDF = async () => {
    if (parsedSlides.length === 0) {
      alert('No slides to export. Please generate or edit the proposal content first.');
      return;
    }
    
    setExporting('pdf');
    try {
      const filename = `Predictive_Intelligence_Flywheel_Dashboard_${toCompany.replace(/\s+/g, '_')}`;
      await exportToPDF(parsedSlides, filename);
      setStatus('rendered');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPPTX = async () => {
    if (parsedSlides.length === 0) {
      alert('No slides to export. Please generate or edit the proposal content first.');
      return;
    }
    
    setExporting('pptx');
    try {
      const filename = `Predictive_Intelligence_Flywheel_Dashboard_${toCompany.replace(/\s+/g, '_')}`;
      await exportToPowerPoint(parsedSlides, filename);
      setStatus('rendered');
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      alert('Failed to export PowerPoint. Please ensure pptxgenjs is installed: npm install pptxgenjs');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2 text-slate-400 font-semibold tracking-widest text-[10px] uppercase mb-4">
          <div className="w-4 h-0.5 accent-gradient"></div>
          Proposal
        </div>
        <h1 className="text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Proposal
        </h1>
        <p className="text-xl text-slate-500 font-light">
          Create and customize your proposal with structured slide rendering.
        </p>
      </header>

      <div className="flex gap-12 items-start">
        {/* Input Form Panel */}
        <div className="shrink-0 w-[360px]">
          <div className="bg-[#f8fafc] p-1.5 rounded-[40px] border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[34px] space-y-8">
              {/* Recipient Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Recipient
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Recipient Company
                    </label>
                    <input
                      type="text"
                      value={toCompany}
                      onChange={(e) => setToCompany(e.target.value)}
                      placeholder="{{To Company}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Recipient Person
                    </label>
                    <input
                      type="text"
                      value={toPerson}
                      onChange={(e) => setToPerson(e.target.value)}
                      placeholder="{{To Person}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Recipient Role
                    </label>
                    <input
                      type="text"
                      value={toRole}
                      onChange={(e) => setToRole(e.target.value)}
                      placeholder="{{To Role}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100"></div>

              {/* Sender Section */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Sender
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Sender Company
                    </label>
                    <input
                      type="text"
                      value={fromCompany}
                      onChange={(e) => setFromCompany(e.target.value)}
                      placeholder="{{From Company}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Sender Person
                    </label>
                    <input
                      type="text"
                      value={fromPerson}
                      onChange={(e) => setFromPerson(e.target.value)}
                      placeholder="{{From Person}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Sender Role
                    </label>
                    <input
                      type="text"
                      value={fromRole}
                      onChange={(e) => setFromRole(e.target.value)}
                      placeholder="{{From Role}}"
                      className="w-full px-6 py-4 rounded-[20px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Create Proposal Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Create Proposal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {proposalContent ? (
            <div className="space-y-6">
              {/* Status and Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-black tracking-tight mb-2">
                      Proposal Content
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        status === 'draft' ? 'bg-slate-100 text-slate-600' :
                        status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {status.toUpperCase()}
                      </span>
                      <span className="text-sm text-slate-500">
                        {parsedSlides.length} slide{parsedSlides.length !== 1 ? 's' : ''} parsed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePreview}
                    disabled={parsedSlides.length === 0}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={parsedSlides.length === 0 || parseErrors.length > 0 || status === 'approved'}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleExportPDF}
                      disabled={parsedSlides.length === 0 || exporting !== null}
                      className="px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exporting === 'pdf' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4" />
                          PDF
                        </>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleExportPPTX}
                    disabled={parsedSlides.length === 0 || exporting !== null}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting === 'pptx' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Presentation className="w-4 h-4" />
                        PPTX
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Parse Errors */}
              {parseErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-[24px] p-4">
                  <div className="text-sm font-bold text-red-800 mb-2">Parse Errors:</div>
                  <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                    {parseErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Editable Content */}
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Edit3 className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Editable Content
                  </span>
                </div>
                <textarea
                  value={proposalContent}
                  onChange={(e) => setProposalContent(e.target.value)}
                  className="w-full h-[600px] px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed font-mono resize-none"
                  placeholder="Proposal content will appear here after generation..."
                />
                <div className="mt-4 text-xs text-slate-400 space-y-1">
                  <p>💡 Tip: Use "=== SLIDE ===" to separate slides. Edit the content as needed.</p>
                  <p>📋 Format: Include "Slide Type:", "Title:", "Body content:", and "Key data highlights:" for best results.</p>
                  <p>👁️ Click "Preview" to see rendered slides, then "Approve" and export as PDF or PowerPoint.</p>
                </div>
              </div>
            </div>
          ) : (
            <section className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-bold text-black tracking-tight mb-8">
                Overview
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                Your proposal content will appear here. Use the form on the left to input recipient and sender information, then click "Create Proposal" to generate the content.
              </p>
            </section>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <SlidePreview
          slides={parsedSlides}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};
