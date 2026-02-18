
import React, { useState } from 'react';
import { FileText, Loader2, Download, Edit3 } from 'lucide-react';
import { generateProposal } from '../services/openaiService';
import { StrategyReport, FlywheelAnalysis, ArchitectureAnalysis, ROIReport } from '../types';

interface ProposalProps {
  strategyReport: StrategyReport | null;
  flywheelAnalysis: FlywheelAnalysis | null;
  architectureReport: ArchitectureAnalysis | null;
  roiReport: ROIReport | null;
}

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

  const generatePDF = (content: string, filename: string) => {
    // Parse slides from content
    const slides = content.split('=== SLIDE ===').filter(slide => slide.trim());
    
    // Create HTML content with proper styling
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    @media print {
      @page {
        size: A4 landscape;
        margin: 0;
      }
      .slide {
        page-break-after: always;
        page-break-inside: avoid;
      }
    }
    body {
      font-family: 'Inter', sans-serif;
      background: #FFFFFF;
      color: #000000;
      line-height: 1.6;
    }
    .slide {
      min-height: 100vh;
      padding: 64px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
    }
    .slide-header {
      margin-bottom: 48px;
    }
    .metadata {
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #94a3b8;
      margin-bottom: 16px;
    }
    h1 {
      font-weight: 900;
      font-size: 64px;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      color: #000000;
      line-height: 1.1;
    }
    h2 {
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 16px;
      color: #000000;
    }
    h3 {
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 12px;
      color: #000000;
    }
    p {
      font-weight: 300;
      font-size: 18px;
      color: #475569;
      margin-bottom: 16px;
      line-height: 1.8;
    }
    ul, ol {
      font-weight: 300;
      font-size: 18px;
      color: #475569;
      margin-left: 24px;
      margin-bottom: 16px;
    }
    li {
      margin-bottom: 8px;
      line-height: 1.8;
    }
    .gradient {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .accent-line {
      width: 32px;
      height: 2px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      margin-bottom: 24px;
    }
    code, pre {
      font-family: 'Courier New', monospace;
      font-size: 14px;
      background: #F1F5F9;
      padding: 16px;
      border-radius: 24px;
      overflow-x: auto;
      white-space: pre-wrap;
      color: #020617;
    }
    .highlight {
      background: #F1F5F9;
      padding: 24px;
      border-radius: 32px;
      border: 1px solid #E2E8F0;
    }
  </style>
</head>
<body>
  ${slides.map((slide, index) => {
    if (!slide.trim()) return '';
    
    // Basic formatting - convert markdown-like syntax to HTML
    let formattedSlide = slide.trim();
    
    // Convert headers
    formattedSlide = formattedSlide.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    formattedSlide = formattedSlide.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    formattedSlide = formattedSlide.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    
    // Convert bullet points
    formattedSlide = formattedSlide.replace(/^• (.*$)/gim, '<li>$1</li>');
    formattedSlide = formattedSlide.replace(/^- (.*$)/gim, '<li>$1</li>');
    
    // Wrap consecutive list items in ul tags
    formattedSlide = formattedSlide.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    // Convert line breaks
    formattedSlide = formattedSlide.replace(/\n\n/g, '</p><p>');
    formattedSlide = formattedSlide.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!formattedSlide.startsWith('<h') && !formattedSlide.startsWith('<ul')) {
      formattedSlide = '<p>' + formattedSlide + '</p>';
    }
    
    return `<div class="slide">
      <div class="slide-header">
        <div class="accent-line"></div>
        <div class="metadata">Slide ${index + 1}</div>
      </div>
      <div class="slide-content">
        ${formattedSlide}
      </div>
    </div>`;
  }).join('')}
</body>
</html>`;

    // Create blob and download HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    link.click();
    URL.revokeObjectURL(url);

    // Open print dialog for PDF conversion
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

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
    } catch (error) {
      console.error("Proposal creation failed", error);
      alert('Failed to generate proposal. Please check your OpenAI API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!proposalContent) return;
    const filename = `Predictive_Intelligence_Flywheel_Dashboard_${toCompany.replace(/\s+/g, '_')}`;
    generatePDF(proposalContent, filename);
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
          Create and customize your proposal.
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-black tracking-tight mb-2">
                    Proposal Content
                  </h2>
                  <p className="text-slate-500 text-sm font-light">
                    Edit the proposal content below, then export as PDF
                  </p>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="px-6 py-3 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center gap-3 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
              
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
                <div className="mt-4 text-xs text-slate-400">
                  <p>💡 Tip: Use "=== SLIDE ===" to separate slides. Edit the content as needed, then click "Export PDF" to generate the presentation.</p>
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
    </div>
  );
};
