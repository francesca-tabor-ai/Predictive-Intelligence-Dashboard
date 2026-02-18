import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Download, Edit3, Eye, CheckCircle, FileDown, Presentation, AlertTriangle, Sparkles } from 'lucide-react';
import { generateProposal } from '../services/openaiService';
import { StrategyReport, FlywheelAnalysis, ArchitectureAnalysis, ROIReport, Slide, StructuredSlideDeck, SlideType } from '../types';
import { validateSlides } from '../services/slideParser';
import { exportToPDF, exportToPowerPoint } from '../services/exportEngine';
import { SlidePreview } from './slides/SlidePreview';
import { SlideCard } from './slides/SlideCard';
import { SlideList } from './slides/SlideList';
import { GlobalStylingPanel } from './GlobalStylingPanel';
import { DiagramsPanel } from './diagrams/DiagramsPanel';
import { detectStylingViolations, autoCleanSlide, StylingViolation } from '../services/stylingValidator';
import { importTextToDeck, ImportWarning } from '../services/deckImporter';
import { exportDeckToText, exportDeckMetadata } from '../services/deckExporter';
import { exportProject } from '../services/projectExporter';

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
  const [deck, setDeck] = useState<StructuredSlideDeck>({
    deckStyleId: 'mono-gradient-v1',
    slides: [],
    diagrams: []
  });
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProposalStatus>('draft');
  const [showPreview, setShowPreview] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'pptx' | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [stylingViolations, setStylingViolations] = useState<StylingViolation[]>([]);
  const [showAutoCleanPrompt, setShowAutoCleanPrompt] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importText, setImportText] = useState('');
  const [importWarnings, setImportWarnings] = useState<ImportWarning[]>([]);
  const [approvedVersion, setApprovedVersion] = useState<StructuredSlideDeck | null>(null);
  const [exportingProject, setExportingProject] = useState(false);

  // Validate slides whenever deck changes
  useEffect(() => {
    if (deck.slides.length > 0) {
      const validation = validateSlides(deck.slides);
      setParseErrors(validation.errors);
      
      // Check for styling violations
      const violations = detectStylingViolations(deck.slides);
      setStylingViolations(violations);
      
      // Reset status if deck changes after approval
      // Compare slide count and IDs to detect changes
      if (status === 'approved' && approvedVersion) {
        const slidesChanged = deck.slides.length !== approvedVersion.slides.length ||
          deck.slides.some((slide, idx) => {
            const approvedSlide = approvedVersion.slides[idx];
            return !approvedSlide || 
                   slide.id !== approvedSlide.id ||
                   slide.title !== approvedSlide.title ||
                   JSON.stringify(slide.body) !== JSON.stringify(approvedSlide.body);
          });
        
        if (slidesChanged) {
          setStatus('draft');
          setApprovedVersion(null);
        }
      } else if (status === 'rendered') {
        setStatus('draft');
      }
    } else {
      setParseErrors([]);
      setStylingViolations([]);
    }
  }, [deck, status, approvedVersion]);

  // Select first slide by default when slides are added
  useEffect(() => {
    if (deck.slides.length > 0 && !selectedSlideId) {
      setSelectedSlideId(deck.slides[0].id);
    } else if (deck.slides.length === 0) {
      setSelectedSlideId(null);
    } else if (selectedSlideId && !deck.slides.find(s => s.id === selectedSlideId)) {
      // Selected slide was deleted, select first available
      setSelectedSlideId(deck.slides[0]?.id || null);
    }
  }, [deck.slides, selectedSlideId]);

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

      // Convert text response to structured JSON using importer
      const importResult = importTextToDeck(presentationContent);
      const newDeck: StructuredSlideDeck = {
        ...importResult.deck,
        metadata: {
          toCompany,
          toPerson,
          toRole,
          fromCompany,
          fromPerson,
          fromRole
        }
      };
      
      setDeck(newDeck);
      setStatus('draft');
      
      // Show warnings if any
      if (importResult.warnings.length > 0) {
        setImportWarnings(importResult.warnings);
        alert(`Proposal created with ${importResult.warnings.length} import warning(s). Some visual layout instructions could not be automatically mapped.`);
      }
    } catch (error) {
      console.error("Proposal creation failed", error);
      alert('Failed to generate proposal. Please check your OpenAI API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (deck.slides.length === 0) {
      alert('No slides to preview. Please generate or add slides first.');
      return;
    }
    
    // Check for styling violations
    if (stylingViolations.length > 0) {
      setShowAutoCleanPrompt(true);
      return;
    }
    
    setShowPreview(true);
  };

  const handleApprove = () => {
    if (parseErrors.length > 0) {
      alert(`Please fix the following errors before approving:\n${parseErrors.join('\n')}`);
      return;
    }
    if (deck.slides.length === 0) {
      alert('No slides to approve. Please generate or add slides first.');
      return;
    }
    
    // Check for styling violations
    if (stylingViolations.length > 0) {
      setShowAutoCleanPrompt(true);
      return;
    }
    
    // Create version snapshot (lock the JSON)
    const snapshot: StructuredSlideDeck = {
      ...deck,
      // Deep clone to prevent mutations
      slides: deck.slides.map(slide => ({
        ...slide,
        body: [...slide.body],
        keyData: slide.keyData ? [...slide.keyData] : undefined,
        visuals: slide.visuals ? [...slide.visuals] : undefined
      })),
      diagrams: deck.diagrams ? deck.diagrams.map(diagram => ({
        ...diagram,
        spec: { ...diagram.spec }
      })) : undefined
    };
    
    setApprovedVersion(snapshot);
    setStatus('approved');
  };

  const handleAutoClean = () => {
    const cleanedSlides = deck.slides.map(slide => {
      const { cleanedSlide } = autoCleanSlide(slide);
      return cleanedSlide;
    });

    setDeck({
      ...deck,
      slides: cleanedSlides
    });
    
    setShowAutoCleanPrompt(false);
    setStylingViolations([]);
  };

  const handleExportPDF = async () => {
    if (deck.slides.length === 0) {
      alert('No slides to export. Please generate or add slides first.');
      return;
    }
    
    // Check for styling violations
    if (stylingViolations.length > 0) {
      setShowAutoCleanPrompt(true);
      return;
    }
    
    setExporting('pdf');
    try {
      const filename = `Predictive_Intelligence_Flywheel_Dashboard_${(toCompany || 'Proposal').replace(/\s+/g, '_')}`;
      await exportToPDF(deck.slides, filename, deck);
      setStatus('rendered');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const handleExportPPTX = async () => {
    if (deck.slides.length === 0) {
      alert('No slides to export. Please generate or add slides first.');
      return;
    }
    
    // Check for styling violations
    if (stylingViolations.length > 0) {
      setShowAutoCleanPrompt(true);
      return;
    }
    
    setExporting('pptx');
    try {
      const filename = `Predictive_Intelligence_Flywheel_Dashboard_${(toCompany || 'Proposal').replace(/\s+/g, '_')}`;
      await exportToPowerPoint(deck.slides, filename, deck);
      setStatus('rendered');
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      alert('Failed to export PowerPoint. Please ensure pptxgenjs is installed: npm install pptxgenjs');
    } finally {
      setExporting(null);
    }
  };

  const handleUpdateSlide = (updatedSlide: Slide) => {
    setDeck(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === updatedSlide.id ? updatedSlide : s)
    }));
  };

  const handleDeleteSlide = (slideId: string) => {
    setDeck(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== slideId)
    }));
  };

  const handleDuplicateSlide = (slideId: string) => {
    const slide = deck.slides.find(s => s.id === slideId);
    if (slide) {
      const newSlide: Slide = {
        ...slide,
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${slide.title} (Copy)`
      };
      const index = deck.slides.findIndex(s => s.id === slideId);
      setDeck(prev => ({
        ...prev,
        slides: [
          ...prev.slides.slice(0, index + 1),
          newSlide,
          ...prev.slides.slice(index + 1)
        ]
      }));
      setSelectedSlideId(newSlide.id);
    }
  };

  const handleMoveSlide = (slideId: string, direction: 'up' | 'down') => {
    const index = deck.slides.findIndex(s => s.id === slideId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= deck.slides.length) return;

    const newSlides = [...deck.slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    
    setDeck(prev => ({ ...prev, slides: newSlides }));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'generic',
      title: `New Slide ${deck.slides.length + 1}`,
      body: [],
      keyData: []
    };
    setDeck(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setSelectedSlideId(newSlide.id);
  };

  const handleImportText = () => {
    if (!importText.trim()) {
      alert('Please paste the text content to import');
      return;
    }

    try {
      const result = importTextToDeck(importText, deck);
      setDeck(result.deck);
      setImportWarnings(result.warnings);
      
      if (result.warnings.length > 0) {
        // Show warnings but still import
        alert(`Import completed with ${result.warnings.length} warning(s). Check the import dialog for details.`);
      } else {
        setShowImportDialog(false);
        setImportText('');
        alert('Import completed successfully!');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import text. Please check the format and try again.');
    }
  };

  const handleExportText = () => {
    const text = exportDeckToText(deck);
    const metadata = exportDeckMetadata(deck);
    const fullText = metadata + '\n\n' + text;
    
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deck-export-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportProject = async () => {
    if (deck.slides.length === 0) {
      alert('No slides to export. Please generate or add slides first.');
      return;
    }
    
    setExportingProject(true);
    try {
      const filename = `Predictive_Intelligence_Flywheel_Dashboard_${(toCompany || 'Proposal').replace(/\s+/g, '_')}`;
      await exportProject(deck, {
        includePDF: status === 'rendered' || status === 'approved',
        includePPTX: status === 'rendered' || status === 'approved',
        filename
      });
    } catch (error) {
      console.error('Project export failed:', error);
      alert('Failed to export project. Please try again.');
    } finally {
      setExportingProject(false);
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
          {deck.slides.length > 0 ? (
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
                      {approvedVersion && (
                        <span className="text-xs text-slate-400" title="Version snapshot locked">
                          📌 Locked
                        </span>
                      )}
                      <span className="text-sm text-slate-500">
                        {deck.slides.length} slide{deck.slides.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowImportDialog(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black rounded-[20px] font-bold flex items-center gap-2 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Import Text
                  </button>
                  {deck.slides.length > 0 && (
                    <button
                      onClick={handleExportText}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black rounded-[20px] font-bold flex items-center gap-2 transition-all text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export Text
                    </button>
                  )}
                  <button
                    onClick={handlePreview}
                    disabled={deck.slides.length === 0}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Preview renders from JSON + theme + diagrams"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={deck.slides.length === 0 || parseErrors.length > 0 || status === 'approved'}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Locks the JSON (creates version snapshot)"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleExportPDF}
                      disabled={deck.slides.length === 0 || exporting !== null}
                      className="px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Generated from JSON render pipeline"
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
                    disabled={deck.slides.length === 0 || exporting !== null}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Generated from JSON render pipeline"
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
                  <button
                    onClick={handleExportProject}
                    disabled={deck.slides.length === 0 || exportingProject}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export project as ZIP (deck.json + diagrams + PDF/PPTX)"
                  >
                    {exportingProject ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export Project
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Parse Errors */}
              {parseErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-[24px] p-4">
                  <div className="text-sm font-bold text-red-800 mb-2">Validation Errors:</div>
                  <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                    {parseErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Styling Violations Warning */}
              {stylingViolations.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-amber-800 mb-2">
                        Styling Instructions Detected
                      </div>
                      <p className="text-xs text-amber-700 mb-3">
                        Found {stylingViolations.length} styling instruction{stylingViolations.length !== 1 ? 's' : ''} in slide content. 
                        Styling should be managed in the Global Styling panel, not in slide text.
                      </p>
                      <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                        {stylingViolations.slice(0, 5).map((violation, index) => (
                          <div key={index} className="text-xs text-amber-700 bg-amber-100 rounded-[8px] p-2">
                            <span className="font-medium">Slide {violation.slideNumber}</span> ({violation.field}): "{violation.matchedText}"
                          </div>
                        ))}
                        {stylingViolations.length > 5 && (
                          <div className="text-xs text-amber-600 italic">
                            + {stylingViolations.length - 5} more violation{stylingViolations.length - 5 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleAutoClean}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-[12px] font-bold text-xs flex items-center gap-2 transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auto-clean (Remove styling & move visuals)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide Cards UI */}
              <div className="flex gap-6 items-start">
                {/* Left Sidebar: Slide List + Global Styling + Diagrams */}
                <div className="w-[280px] shrink-0 space-y-4">
                  <SlideList
                    slides={deck.slides}
                    selectedSlideId={selectedSlideId}
                    onSelectSlide={setSelectedSlideId}
                    onAddSlide={handleAddSlide}
                  />
                  <GlobalStylingPanel
                    deck={deck}
                    onUpdate={setDeck}
                  />
                  <DiagramsPanel
                    deck={deck}
                    onUpdate={setDeck}
                  />
                </div>

                {/* Slide Card Editor (Right Side) */}
                <div className="flex-1">
                  {selectedSlideId ? (
                    (() => {
                      const slide = deck.slides.find(s => s.id === selectedSlideId);
                      const slideIndex = deck.slides.findIndex(s => s.id === selectedSlideId);
                      if (!slide) return null;
                      
                      return (
                        <SlideCard
                          slide={slide}
                          slideNumber={slideIndex + 1}
                          totalSlides={deck.slides.length}
                          deck={deck}
                          onUpdate={handleUpdateSlide}
                          onUpdateDeck={setDeck}
                          onDelete={() => handleDeleteSlide(slide.id)}
                          onDuplicate={() => handleDuplicateSlide(slide.id)}
                          onMoveUp={() => handleMoveSlide(slide.id, 'up')}
                          onMoveDown={() => handleMoveSlide(slide.id, 'down')}
                        />
                      );
                    })()
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm text-center">
                      <p className="text-slate-500">Select a slide from the list to edit</p>
                    </div>
                  )}
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
          deck={deck}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-3xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                Import from Text
              </h2>
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportText('');
                  setImportWarnings([]);
                }}
                className="p-2 rounded-[12px] hover:bg-slate-100 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Paste Text Content (=== SLIDE === format)
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={12}
                  className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all text-sm leading-relaxed font-mono resize-none"
                  placeholder="Paste your text content here using === SLIDE === format..."
                />
                <p className="mt-2 text-xs text-slate-400">
                  The importer will extract: Slide Type, Title, Body Content, Key Data Highlights. Visual Layout/Component instructions will be converted to diagrams or shown as warnings.
                </p>
              </div>

              {/* Import Warnings */}
              {importWarnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-4">
                  <div className="text-sm font-bold text-amber-800 mb-2">
                    Import Warnings ({importWarnings.length})
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importWarnings.map((warning, index) => (
                      <div key={index} className="text-xs text-amber-700 bg-amber-100 rounded-[8px] p-2">
                        <span className="font-medium">Slide {warning.slideNumber}:</span> {warning.message}
                        {warning.content && (
                          <div className="mt-1 text-amber-600 italic">
                            "{warning.content}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportDialog(false);
                  setImportText('');
                  setImportWarnings([]);
                }}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-black rounded-[16px] font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleImportText}
                className="flex-1 px-4 py-3 bg-black hover:bg-slate-800 text-white rounded-[16px] font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <FileText className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-clean Prompt Modal */}
      {showAutoCleanPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-amber-100 rounded-[16px]">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-black mb-2">
                  Styling Instructions Detected
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Found {stylingViolations.length} styling instruction{stylingViolations.length !== 1 ? 's' : ''} in your slides. 
                  These should be removed from slide content and managed through the Global Styling panel instead.
                </p>
                <div className="bg-slate-50 rounded-[16px] p-4 mb-4 max-h-48 overflow-y-auto">
                  <div className="text-xs font-medium text-slate-700 mb-2">Examples:</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {stylingViolations.slice(0, 5).map((v, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-slate-400">•</span>
                        <span>Slide {v.slideNumber} ({v.field}): "{v.matchedText}"</span>
                      </li>
                    ))}
                    {stylingViolations.length > 5 && (
                      <li className="text-slate-400 italic">
                        + {stylingViolations.length - 5} more...
                      </li>
                    )}
                  </ul>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Auto-clean will remove styling instructions from text and move any visual references to the Visuals/Diagrams section.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAutoCleanPrompt(false)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-black rounded-[16px] font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAutoClean}
                className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-[16px] font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Auto-clean All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
