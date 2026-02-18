
export enum NavigationTab {
  ABOUT = 'about',
  INVESTMENT_THESIS = 'investment-thesis',
  COMPANY_VALUATION = 'company-valuation',
  PREDICTION_STRATEGY = 'prediction-strategy',
  DATA_FLYWHEEL = 'data-flywheel',
  ARCHITECTURE = 'architecture',
  ROI_CALCULATOR = 'roi-calculator',
  PROPOSAL = 'proposal'
}

export interface PredictionOpportunity {
  decision: string;
  prediction: string;
  timeframe: string;
  businessOutcome: string;
  impactScore: 'High' | 'Medium' | 'Low';
}

export interface DetailedUseCase {
  useCase: string;
  economicLogic: string;
  impactMath: string;
  metrics: string[];
}

export interface StrategyReport {
  executiveSummary: string[];
  opportunities: PredictionOpportunity[];
  top3: DetailedUseCase[];
  roiModel: {
    description: string;
    projectedBenefit: string;
  };
  platformArchitecture: {
    infrastructure: string;
    feedbackLoop: string;
    moat: string;
  };
  risks: {
    risk: string;
    mitigation: string;
  }[];
  rolloutPlan: string[];
}

export interface FlywheelAnalysis {
  coreEconomicEngine: string;
  dataGenerated: string;
  intelligenceLayer: string;
  economicImpactPathway: string;
  compoundingLoop: string;
  defensibilityAssessment: {
    classification: 'Weak' | 'Moderate' | 'Strong' | 'Compounding';
    analysis: string;
  };
  highestLeverageEntryPoint: string;
  risksAndConstraints: string[];
  flywheelStrengthRating: number;
  strategicRecommendations: string[];
}

export interface ArchitectureAnalysis {
  businessModelFlywheel: {
    coreLoop: string;
    dataGenerationSource: string;
    economicImpact: string;
  };
  predictionProblems: {
    problem: string;
    value: string;
    economicLever: string;
  }[];
  layeredArchitecture: {
    dataLayer: string;
    featureStore: string;
    trainingPlatform: string;
    inferencePlatform: string;
    feedbackLoop: string;
  };
  platformStrategy: string;
  mvpPhases: {
    phase: string;
    objective: string;
    reasoning: string;
  }[];
  defensibility: string;
  governance: {
    risk: string;
    guardrail: string;
  }[];
}

export interface ROIReport {
  executiveSummary: string[];
  baselineEconomics: {
    annualRevenue: string;
    annualCost: string;
    annualProfit: string;
  };
  predictionOpportunities: {
    opportunity: string;
    impactType: string;
    score: number;
  }[];
  roiCalculation: {
    annualBenefit: string;
    annualCost: string;
    netROI: string;
  };
  threeYearProjection: {
    year: number;
    benefit: string;
    cost: string;
    net: string;
    benefitNumeric: number;
    costNumeric: number;
  }[];
  paybackPeriod: string;
  sensitivityAnalysis: string;
  strategicRecommendation: string;
}

export interface ValuationReport {
  executiveSummary: {
    coreModel: string;
    flywheelExists: boolean;
    capitalStrength: string;
    multiplierEstimate: number;
    valuationRange: string;
    attractiveness: 'Exceptional' | 'Attractive' | 'Neutral' | 'Avoid';
  };
  economicEngine: {
    revenueGeneration: string;
    userBehaviors: string;
    dataGeneration: string;
    decisionOutcomes: string;
    coreLoop: string;
  };
  scores: {
    dataAdvantage: { score: number; reasoning: string };
    predictionImpact: { score: number; reasoning: string };
    workflowIntegration: { score: number; reasoning: string };
    feedbackVelocity: { score: number; reasoning: string };
    decisionFrequency: { score: number; reasoning: string };
  };
  intelligenceMultiplier: {
    value: number;
    normalizationLogic: string;
  };
  compoundingRate: {
    classification: 'Low' | 'Moderate' | 'High' | 'Exceptional';
    reasoning: string;
  };
  valuation: {
    baseFinancialValue: string;
    adjustedValue: string;
    assumptions: string;
  };
  defensibility: {
    moatStrength: 'Weak' | 'Moderate' | 'Strong' | 'Compounding' | 'Elite';
    analysis: string;
  };
  flywheelStrength: {
    rating: number;
    reasoning: string;
  };
  recommendation: {
    title: string;
    justification: string;
  };
}

// Slide system types
export type SlideType = 
  | 'cover-slide'
  | 'executive-summary'
  | 'architecture'
  | 'roi'
  | 'flywheel'
  | 'strategy'
  | 'roadmap'
  | 'conclusion'
  | 'generic';

export interface SlideHighlight {
  label: string;
  value: string;
}

export interface VisualReference {
  kind: 'diagram' | 'chart' | 'image';
  diagramId?: string;
  placement: 'background-accent' | 'left' | 'right' | 'top' | 'bottom' | 'center';
  metadata?: Record<string, any>;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  body: string[];
  keyData?: string[]; // Key data highlights as array of strings
  highlights?: SlideHighlight[]; // Legacy format, kept for compatibility
  visuals?: VisualReference[];
  metadata?: Record<string, any>;
}

export interface Diagram {
  id: string;
  type: 'gradient-accent' | 'flywheel' | 'architecture' | 'timeline' | 'chart' | 'custom';
  spec: DiagramSpec;
  name?: string; // Optional name for the diagram
}

export interface DiagramSpec {
  // Flywheel diagram spec
  nodes?: Array<{ label: string; angle?: number }>;
  size?: number;
  radius?: number;
  
  // Architecture diagram spec
  layers?: Array<{ name: string; description?: string; color?: string }>;
  
  // Timeline diagram spec
  items?: Array<{ label: string; date?: string; description?: string }>;
  
  // Gradient accent spec
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  colors?: string[];
  
  // Common properties
  width?: number;
  height?: number;
  backgroundColor?: string;
  [key: string]: any; // Allow additional custom properties
}

export interface StructuredSlideDeck {
  deckStyleId?: string;
  slides: Slide[];
  diagrams?: Diagram[];
  metadata?: {
    toCompany?: string;
    toPerson?: string;
    toRole?: string;
    fromCompany?: string;
    fromPerson?: string;
    fromRole?: string;
  };
}

export interface SlideDeck {
  proposalId?: string;
  status: 'draft' | 'approved' | 'rendered';
  slides: Slide[];
  metadata?: {
    toCompany?: string;
    toPerson?: string;
    toRole?: string;
    fromCompany?: string;
    fromPerson?: string;
    fromRole?: string;
  };
}
