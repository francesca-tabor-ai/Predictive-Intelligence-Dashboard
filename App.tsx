
import React, { useState } from 'react';
import JSZip from 'jszip';
import { Sidebar } from './components/Sidebar';
import { About } from './components/About';
import { InvestmentThesis } from './components/InvestmentThesis';
import { CompanyValuation } from './components/CompanyValuation';
import { PredictionStrategy } from './components/PredictionStrategy';
import { DataFlywheel } from './components/DataFlywheel';
import { Architecture } from './components/Architecture';
import { ROICalculator } from './components/ROICalculator';
import { Proposal } from './components/Proposal';
import { 
  NavigationTab, 
  StrategyReport, 
  FlywheelAnalysis, 
  ArchitectureAnalysis, 
  ROIReport,
  ValuationReport 
} from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.ABOUT);
  
  // Hoisted state for business description (synced across all views)
  const [businessDetails, setBusinessDetails] = useState('');

  // Hoisted state to support ZIP download
  const [strategyReport, setStrategyReport] = useState<StrategyReport | null>(null);
  const [flywheelAnalysis, setFlywheelAnalysis] = useState<FlywheelAnalysis | null>(null);
  const [architectureReport, setArchitectureReport] = useState<ArchitectureAnalysis | null>(null);
  const [roiReport, setRoiReport] = useState<ROIReport | null>(null);
  const [valuationReport, setValuationReport] = useState<ValuationReport | null>(null);

  const handleDownloadZip = async () => {
    const zip = new JSZip();

    // 1. About Section (Static content)
    const aboutMd = `# The Predictive Intelligence Flywheel\n\nA generalized business model for compounding economic advantage through data, prediction, and AI.\n\n- Behavioral data generation\n- Predictive modeling\n- Decision optimization\n- Economic value creation\n- Increased platform dependence`;
    zip.file("01_About_Essay.md", aboutMd);

    // 1b. Investment Thesis (Static content)
    const thesisMd = `# Investment Thesis: The Predictive Intelligence Flywheel Economy\n\nThe dominant companies of the next 20 years will not be software platforms — they will be Predictive Intelligence Platforms that continuously improve economic decisions using proprietary behavioral data.\n\nCore Insight: Economic power will shift from asset ownership to intelligence ownership.`;
    zip.file("01b_Investment_Thesis.md", thesisMd);

    // 1c. Valuation Report
    if (valuationReport) {
      const valMd = `# Intelligence Capital Valuation Report\n\nTarget: ${valuationReport.executiveSummary.coreModel}\nRating: ${valuationReport.recommendation.title}\nMultiplier: ${valuationReport.intelligenceMultiplier.value}x\nValuation: ${valuationReport.valuation.adjustedValue}\n\n## Recommendation\n${valuationReport.recommendation.justification}`;
      zip.file("01c_Company_Valuation_Analysis.md", valMd);
    }

    // 2. Prediction Strategy
    if (strategyReport) {
      const strategyMd = `# Prediction Strategy Report\n\n## Executive Summary\n${strategyReport.executiveSummary.map(s => `- ${s}`).join('\n')}\n\n## Use Cases\n${strategyReport.top3.map(u => `### ${u.useCase}\nLogic: ${u.economicLogic}\nMath: ${u.impactMath}`).join('\n\n')}`;
      zip.file("02_Prediction_Strategy.md", strategyMd);
    }

    // 3. Data Flywheel
    if (flywheelAnalysis) {
      const flywheelMd = `# Data Flywheel Analysis\n\nStrength: ${flywheelAnalysis.flywheelStrengthRating}/10\n\nCore Engine: ${flywheelAnalysis.coreEconomicEngine}\nIntelligence Layer: ${flywheelAnalysis.intelligenceLayer}\nCompounding Loop: ${flywheelAnalysis.compoundingLoop}\n\n## Recommendations\n${flywheelAnalysis.strategicRecommendations.map(r => `- ${r}`).join('\n')}`;
      zip.file("03_Data_Flywheel.md", flywheelMd);
    }

    // 4. Architecture
    if (architectureReport) {
      const archMd = `# AI Platform Blueprint\n\nCore Loop: ${architectureReport.businessModelFlywheel.coreLoop}\n\n## Layered Design\n- Data: ${architectureReport.layeredArchitecture.dataLayer}\n- Feature Store: ${architectureReport.layeredArchitecture.featureStore}\n- Training: ${architectureReport.layeredArchitecture.trainingPlatform}\n- Inference: ${architectureReport.layeredArchitecture.inferencePlatform}\n- Feedback: ${architectureReport.layeredArchitecture.feedbackLoop}`;
      zip.file("04_Architecture_Blueprint.md", archMd);
    }

    // 5. ROI Report
    if (roiReport) {
      const roiMd = `# Predictive ROI Report\n\n## Executive Summary\n${roiReport.executiveSummary.map(s => `- ${s}`).join('\n')}\n\n## Projections\nAnnual ROI: ${roiReport.roiCalculation.netROI}\nBenefit (Y1): ${roiReport.roiCalculation.annualBenefit}\nPayback Period: ${roiReport.paybackPeriod}\n\nRecommendation: ${roiReport.strategicRecommendation}`;
      zip.file("05_ROI_Report.md", roiMd);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "Predictive_Intelligence_Flywheel_Reports.zip";
    link.click();
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.ABOUT:
        return <About />;
      case NavigationTab.INVESTMENT_THESIS:
        return <InvestmentThesis />;
      case NavigationTab.COMPANY_VALUATION:
        return (
          <CompanyValuation 
            report={valuationReport} 
            setReport={setValuationReport} 
            details={businessDetails}
            setDetails={setBusinessDetails}
          />
        );
      case NavigationTab.PREDICTION_STRATEGY:
        return (
          <PredictionStrategy 
            report={strategyReport} 
            setReport={setStrategyReport} 
            details={businessDetails}
            setDetails={setBusinessDetails}
          />
        );
      case NavigationTab.DATA_FLYWHEEL:
        return (
          <DataFlywheel 
            analysis={flywheelAnalysis} 
            setAnalysis={setFlywheelAnalysis} 
            details={businessDetails}
            setDetails={setBusinessDetails}
          />
        );
      case NavigationTab.ARCHITECTURE:
        return (
          <Architecture 
            report={architectureReport} 
            setReport={setArchitectureReport} 
            details={businessDetails}
            setDetails={setBusinessDetails}
          />
        );
      case NavigationTab.ROI_CALCULATOR:
        return (
          <ROICalculator 
            report={roiReport} 
            setReport={setRoiReport} 
            details={businessDetails}
            setDetails={setBusinessDetails}
          />
        );
      case NavigationTab.PROPOSAL:
        return (
          <Proposal 
            strategyReport={strategyReport}
            flywheelAnalysis={flywheelAnalysis}
            architectureReport={architectureReport}
            roiReport={roiReport}
          />
        );
      default:
        return <About />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onDownloadZip={handleDownloadZip}
      />
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
