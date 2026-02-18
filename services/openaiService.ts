
import OpenAI from "openai";

// Type enum for compatibility
enum Type {
  STRING = "string",
  NUMBER = "number",
  BOOLEAN = "boolean",
  ARRAY = "array",
  OBJECT = "object"
}

const getAI = () => {
  const apiKey = process.env.API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not set. Please set OPENAI_API_KEY environment variable.");
  }
  return new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true 
  });
};

// Helper function to convert schema from Google format to OpenAI JSON Schema format
function convertSchemaToOpenAI(schema: any): any {
  if (schema.type === Type.OBJECT) {
    const result: any = {
      type: "object",
      properties: {},
      required: schema.required || [],
      additionalProperties: false
    };
    
    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        result.properties[key] = convertPropertyToOpenAI(value as any);
      }
    }
    
    return result;
  }
  return schema;
}

function convertPropertyToOpenAI(prop: any): any {
  if (!prop || typeof prop !== 'object') {
    return prop;
  }
  
  if (prop.type === Type.ARRAY) {
    return {
      type: "array",
      items: prop.items ? convertPropertyToOpenAI(prop.items) : {}
    };
  } else if (prop.type === Type.OBJECT) {
    // Recursively convert nested objects - convertSchemaToOpenAI already sets additionalProperties: false
    return convertSchemaToOpenAI(prop);
  } else if (prop.type === Type.STRING) {
    const result: any = { type: "string" };
    if (prop.enum) result.enum = prop.enum;
    if (prop.description) result.description = prop.description;
    return result;
  } else if (prop.type === Type.NUMBER) {
    const result: any = { type: "number" };
    if (prop.description) result.description = prop.description;
    return result;
  } else if (prop.type === Type.BOOLEAN) {
    return { type: "boolean" };
  }
  return prop;
}

export async function generateStrategy(details: string) {
  const ai = getAI();
  const systemInstruction = `You are a senior AI product strategist and commercial operator. Your task is to identify high-impact ways a business or industry can use predictive intelligence to improve revenue, retention, margin, efficiency, or defensibility.

For any given company or sector:
1. Start with Business Economics: Revenue, cost, retention drivers, and risk factors.
2. Identify High-Leverage Decision Points: Map where decisions are currently manual, reactive, or suboptimal.
3. Convert Decisions into Prediction Problems: Reframe as "Predict the probability that ___ will ___ within ___ timeframe."
4. Rank Opportunities by Business Impact: Score based on revenue, cost, retention, risk, feasibility, and defensibility.
5. Quantify Impact: Show simple impact math and identify leading indicators.
6. Design Platform Thinking: Data infra, feedback loops, and data flywheels.
7. Identify Risks: Data sparsity, bias, drift, trust.
8. Provide MVP Approach: Phased rollout.

Avoid generic AI suggestions. Always anchor on measurable economic value.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-5 key strategic bullets."
      },
      opportunities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            prediction: { type: Type.STRING },
            timeframe: { type: Type.STRING },
            businessOutcome: { type: Type.STRING },
            impactScore: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
          },
          required: ["decision", "prediction", "timeframe", "businessOutcome", "impactScore"]
        }
      },
      top3: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            useCase: { type: Type.STRING },
            economicLogic: { type: Type.STRING },
            impactMath: { type: Type.STRING },
            metrics: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["useCase", "economicLogic", "impactMath", "metrics"]
        }
      },
      roiModel: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          projectedBenefit: { type: Type.STRING }
        },
        required: ["description", "projectedBenefit"]
      },
      platformArchitecture: {
        type: Type.OBJECT,
        properties: {
          infrastructure: { type: Type.STRING },
          feedbackLoop: { type: Type.STRING },
          moat: { type: Type.STRING }
        },
        required: ["infrastructure", "feedbackLoop", "moat"]
      },
      risks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            risk: { type: Type.STRING },
            mitigation: { type: Type.STRING }
          },
          required: ["risk", "mitigation"]
        }
      },
      rolloutPlan: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["executiveSummary", "opportunities", "top3", "roiModel", "platformArchitecture", "risks", "rolloutPlan"]
  };

  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Analyze the following business/sector and generate a full Predictive Intelligence Strategy Report: ${details}` }
    ],
    response_format: { type: "json_schema", json_schema: { name: "strategy_response", strict: true, schema: convertSchemaToOpenAI(responseSchema) } },
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

export async function analyzeFlywheel(details: string) {
  const ai = getAI();
  const systemInstruction = `Role: You are a senior AI strategy consultant specializing in identifying data network effects and defensible data flywheels in companies and sectors.
Your task is to analyze a given company or industry and determine whether a scalable data flywheel exists, how it works, and how it can be strengthened.

Core Objective: Identify and articulate potential data flywheel, compounding mechanism, commercial impact, defensibility, and leverage points. Analysis must be business-first.

Step 1: Identify Core Economic Engine.
Step 2: Map Data Generation Layer.
Step 3: Identify Intelligence Conversion.
Step 4: Connect Intelligence to Economic Outcomes.
Step 5: Identify the Compounding Mechanism.
Step 6: Assess Defensibility (Weak, Moderate, Strong, Compounding).
Step 7: Identify Highest-Leverage Intervention Point.
Step 8: Identify Failure Modes.

Avoid generic AI buzzwords. Prioritize business impact and compounding advantage.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      coreEconomicEngine: { type: Type.STRING },
      dataGenerated: { type: Type.STRING },
      intelligenceLayer: { type: Type.STRING },
      economicImpactPathway: { type: Type.STRING },
      compoundingLoop: { type: Type.STRING },
      defensibilityAssessment: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING, enum: ["Weak", "Moderate", "Strong", "Compounding"] },
          analysis: { type: Type.STRING }
        },
        required: ["classification", "analysis"]
      },
      highestLeverageEntryPoint: { type: Type.STRING },
      risksAndConstraints: { type: Type.ARRAY, items: { type: Type.STRING } },
      flywheelStrengthRating: { type: Type.NUMBER, description: "Scale 1-10" },
      strategicRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: [
      "coreEconomicEngine", "dataGenerated", "intelligenceLayer", 
      "economicImpactPathway", "compoundingLoop", "defensibilityAssessment", 
      "highestLeverageEntryPoint", "risksAndConstraints", 
      "flywheelStrengthRating", "strategicRecommendations"
    ]
  };

  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Analyze the following business/sector for a Predictive Data Flywheel: ${details}` }
    ],
    response_format: { type: "json_schema", json_schema: { name: "flywheel_response", strict: true, schema: convertSchemaToOpenAI(responseSchema) } },
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

export async function generateArchitecture(details: string) {
  const ai = getAI();
  const systemInstruction = `You are a Principal AI Architect and Product Strategist designing an Ideal AI Platform Architecture for a company whose core business model depends on data, predictions, and continuous machine learning improvement.
Your job is to design a scalable, reusable, defensible AI platform that powers the entire company.
The company's competitive advantage must come from: Proprietary data, Prediction quality, Continuous learning, Compounding feedback loops, Platform-level intelligence, and Increasing returns to scale.

REQUIRED OUTPUT STRUCTURE:
1. Business Model & Economic Flywheel (Core loop, data generation, behavior influence, compounding flywheel).
2. High-Leverage Prediction Problems (3-5 impactful problems).
3. Ideal AI Platform Architecture (5 Layered Design: Unified Data, Feature Store, Training, Prediction/Inference, Feedback).
4. Platform-First vs Feature-First Thinking.
5. MVP Strategy (3 Phased rollout).
6. Defensibility & Data Moat.
7. Risk Management & Governance (Drift, bias, failure modes).

Avoid generic AI buzzwords. Focus on architectural blueprints that turn data into continuously improving predictions.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      businessModelFlywheel: {
        type: Type.OBJECT,
        properties: {
          coreLoop: { type: Type.STRING },
          dataGenerationSource: { type: Type.STRING },
          economicImpact: { type: Type.STRING }
        },
        required: ["coreLoop", "dataGenerationSource", "economicImpact"]
      },
      predictionProblems: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            problem: { type: Type.STRING },
            value: { type: Type.STRING },
            economicLever: { type: Type.STRING }
          },
          required: ["problem", "value", "economicLever"]
        }
      },
      layeredArchitecture: {
        type: Type.OBJECT,
        properties: {
          dataLayer: { type: Type.STRING },
          featureStore: { type: Type.STRING },
          trainingPlatform: { type: Type.STRING },
          inferencePlatform: { type: Type.STRING },
          feedbackLoop: { type: Type.STRING }
        },
        required: ["dataLayer", "featureStore", "trainingPlatform", "inferencePlatform", "feedbackLoop"]
      },
      platformStrategy: { type: Type.STRING },
      mvpPhases: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            phase: { type: Type.STRING },
            objective: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["phase", "objective", "reasoning"]
        }
      },
      defensibility: { type: Type.STRING },
      governance: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            risk: { type: Type.STRING },
            guardrail: { type: Type.STRING }
          },
          required: ["risk", "guardrail"]
        }
      }
    },
    required: ["businessModelFlywheel", "predictionProblems", "layeredArchitecture", "platformStrategy", "mvpPhases", "defensibility", "governance"]
  };

  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Design an AI Platform Architecture for the following business context: ${details}` }
    ],
    response_format: { type: "json_schema", json_schema: { name: "architecture_response", strict: true, schema: convertSchemaToOpenAI(responseSchema) } },
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

export async function calculateROIReport(details: string) {
  const ai = getAI();
  const systemInstruction = `You are a senior AI product strategist, CFO, and commercial operator specializing in quantifying the ROI of predictive intelligence systems.
Your task is to calculate and explain the economic ROI of implementing predictive intelligence in a business.

Follow these rigorous steps:

STEP 1: Identify Core Business Economics
Extract or infer Revenue = Users × Frequency × Value per transaction × Retention. Define Costs (Fixed + Variable) and Margin. Define baseline annual economics.

STEP 2: Identify High-Leverage Prediction Opportunities
Convert suboptimal decisions into prediction form: "Predict probability that [entity] will [behavior] within [timeframe]."

STEP 3: Quantify Impact Mechanism
Explain causal chain: Prediction → Decision improvement → Behavior change → Economic impact.

STEP 4: Calculate Incremental Economic Impact
Incremental Revenue = Base Revenue × Improvement %. Cost Savings = Base Cost × Reduction %. Margin Impact = Incremental Revenue × Margin %. Annual Benefit = Incremental Revenue + Cost Savings.

STEP 5: Estimate Implementation Cost
Initial implementation cost and annual operating cost (Infrastructure, engineering, model maintenance).

STEP 6: Calculate ROI
ROI = (Annual Benefit − Annual Cost) / Annual Cost. Payback Period = Implementation Cost / Annual Benefit. 3-Year Net Benefit = Total Benefits − Total Costs.

STEP 7: Model Flywheel Effect
Assume model performance improves between 10% and 30% annually due to feedback loops.

STEP 8: Rank Prediction Opportunities
Rank based on Commercial impact, Decision leverage, Defensibility, and Feasibility. Score 0-100.

STEP 9: Output Format
Provide structured JSON output matching the required schema. Ensure benefitNumeric and costNumeric are valid integers representing total annual dollars for charting.

Always prioritize economic clarity. Always show formulas. Always quantify impact.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
      baselineEconomics: {
        type: Type.OBJECT,
        properties: {
          annualRevenue: { type: Type.STRING },
          annualCost: { type: Type.STRING },
          annualProfit: { type: Type.STRING }
        },
        required: ["annualRevenue", "annualCost", "annualProfit"]
      },
      predictionOpportunities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            opportunity: { type: Type.STRING },
            impactType: { type: Type.STRING },
            score: { type: Type.NUMBER }
          },
          required: ["opportunity", "impactType", "score"]
        }
      },
      roiCalculation: {
        type: Type.OBJECT,
        properties: {
          annualBenefit: { type: Type.STRING },
          annualCost: { type: Type.STRING },
          netROI: { type: Type.STRING }
        },
        required: ["annualBenefit", "annualCost", "netROI"]
      },
      threeYearProjection: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.NUMBER },
            benefit: { type: Type.STRING },
            cost: { type: Type.STRING },
            net: { type: Type.STRING },
            benefitNumeric: { type: Type.NUMBER, description: "Raw integer benefit for charting" },
            costNumeric: { type: Type.NUMBER, description: "Raw integer cost for charting" }
          },
          required: ["year", "benefit", "cost", "net", "benefitNumeric", "costNumeric"]
        }
      },
      paybackPeriod: { type: Type.STRING },
      sensitivityAnalysis: { type: Type.STRING },
      strategicRecommendation: { type: Type.STRING }
    },
    required: [
      "executiveSummary", "baselineEconomics", "predictionOpportunities", 
      "roiCalculation", "threeYearProjection", "paybackPeriod", 
      "sensitivityAnalysis", "strategicRecommendation"
    ]
  };

  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Generate a comprehensive ROI report for the following business or sector: ${details}` }
    ],
    response_format: { type: "json_schema", json_schema: { name: "roi_response", strict: true, schema: convertSchemaToOpenAI(responseSchema) } },
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

export async function generateValuation(details: string) {
  const ai = getAI();
  const systemInstruction = `You are a Senior Investment Analyst working for a sophisticated multi-generational Family Office. Your mandate is to value companies using the Intelligence Capital Valuation Framework (ICVF), a forward-looking valuation methodology designed for Predictive Intelligence Flywheel companies.

Your objective is to identify, quantify, and value a company's Intelligence Capital, which represents its ability to continuously improve economic outcomes through proprietary behavioral data, prediction systems, and embedded decision optimization.

You must prioritize long-term compounding advantage over short-term financial metrics.
Traditional valuation metrics (P/E, EV/EBITDA, revenue multiples) are considered baseline inputs, not final outputs.
Your job is to determine the company's Intelligence Multiplier and Intelligence-Adjusted Valuation.

Core Valuation Philosophy:
Assume that a company's true economic value is determined by its ability to compound decision advantage over time.
Prediction advantage → better decisions → better economic outcomes → more usage → more data → stronger prediction advantage.
This creates increasing returns to intelligence.

Required Output Structure (Strict JSON):
1. Executive Summary: business model, flywheel existence (boolean), capital strength, multiplier estimate (number), valuation range, attractiveness (Exceptional/Attractive/Neutral/Avoid).
2. Economic Engine Analysis: Revenue generation, user behaviors, actions for data, decision outcomes, core loop description.
3. Assessments (0-5 score + reasoning): Data Advantage, Prediction Impact, Workflow Integration, Feedback Velocity, Decision Frequency.
4. Intelligence Multiplier: Value (1.0 - 20.0), Logic.
5. Intelligence Compounding Rate (ICR): Classification (Low/Moderate/High/Exceptional), reasoning.
6. Intelligence-Adjusted Valuation: Base financial value, Adjusted value, Assumptions.
7. Defensibility & Flywheel Rating (1-10): Rating, reasoning, moat strength classification.
8. Investment Recommendation: Title and Justification.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: {
        type: Type.OBJECT,
        properties: {
          coreModel: { type: Type.STRING },
          flywheelExists: { type: Type.BOOLEAN },
          capitalStrength: { type: Type.STRING },
          multiplierEstimate: { type: Type.NUMBER },
          valuationRange: { type: Type.STRING },
          attractiveness: { type: Type.STRING, enum: ["Exceptional", "Attractive", "Neutral", "Avoid"] }
        },
        required: ["coreModel", "flywheelExists", "capitalStrength", "multiplierEstimate", "valuationRange", "attractiveness"]
      },
      economicEngine: {
        type: Type.OBJECT,
        properties: {
          revenueGeneration: { type: Type.STRING },
          userBehaviors: { type: Type.STRING },
          dataGeneration: { type: Type.STRING },
          decisionOutcomes: { type: Type.STRING },
          coreLoop: { type: Type.STRING }
        },
        required: ["revenueGeneration", "userBehaviors", "dataGeneration", "decisionOutcomes", "coreLoop"]
      },
      scores: {
        type: Type.OBJECT,
        properties: {
          dataAdvantage: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
          predictionImpact: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
          workflowIntegration: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
          feedbackVelocity: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] },
          decisionFrequency: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } }, required: ["score", "reasoning"] }
        },
        required: ["dataAdvantage", "predictionImpact", "workflowIntegration", "feedbackVelocity", "decisionFrequency"]
      },
      intelligenceMultiplier: {
        type: Type.OBJECT,
        properties: {
          value: { type: Type.NUMBER },
          normalizationLogic: { type: Type.STRING }
        },
        required: ["value", "normalizationLogic"]
      },
      compoundingRate: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Exceptional"] },
          reasoning: { type: Type.STRING }
        },
        required: ["classification", "reasoning"]
      },
      valuation: {
        type: Type.OBJECT,
        properties: {
          baseFinancialValue: { type: Type.STRING },
          adjustedValue: { type: Type.STRING },
          assumptions: { type: Type.STRING }
        },
        required: ["baseFinancialValue", "adjustedValue", "assumptions"]
      },
      defensibility: {
        type: Type.OBJECT,
        properties: {
          moatStrength: { type: Type.STRING, enum: ["Weak", "Moderate", "Strong", "Compounding", "Elite"] },
          analysis: { type: Type.STRING }
        },
        required: ["moatStrength", "analysis"]
      },
      flywheelStrength: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["rating", "reasoning"]
      },
      recommendation: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          justification: { type: Type.STRING }
        },
        required: ["title", "justification"]
      }
    },
    required: ["executiveSummary", "economicEngine", "scores", "intelligenceMultiplier", "compoundingRate", "valuation", "defensibility", "flywheelStrength", "recommendation"]
  };

  // Convert schema and ensure additionalProperties is false at root level
  const convertedSchema = convertSchemaToOpenAI(responseSchema);
  if (convertedSchema && convertedSchema.type === "object") {
    convertedSchema.additionalProperties = false;
  }

  const response = await ai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: `Analyze the following business for a comprehensive ICVF valuation: ${details}` }
    ],
    response_format: { type: "json_schema", json_schema: { name: "valuation_response", strict: true, schema: convertedSchema } },
    temperature: 0.7
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}
