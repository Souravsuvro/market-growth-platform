export type EvidenceTier = 'primary' | 'peer_reviewed' | 'government' | 'provider' | 'news' | 'user_provided';
export type ResearchStatus = 'draft' | 'queued' | 'running' | 'completed' | 'failed';
export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type ForecastScenario = 'bear' | 'base' | 'bull';

export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
  retrievedAt: string;
  tier: EvidenceTier;
  excerpt?: string;
  licenseNote?: string;
}

export interface ResearchScope {
  industry: string;
  geography: string[];
  dateFrom?: string;
  dateTo?: string;
  competitors?: string[];
  objectives: string[];
}

export interface MarketSignal {
  id: string;
  projectId: string;
  title: string;
  category: 'demand' | 'competition' | 'customer' | 'geographic' | 'regulatory' | 'investment';
  direction: 'up' | 'down' | 'neutral';
  magnitude?: number;
  observedAt: string;
  summary: string;
  citations: SourceCitation[];
}

export interface ResearchRun {
  id: string;
  projectId: string;
  status: ResearchStatus;
  scope: ResearchScope;
  summary?: string;
  citations: SourceCitation[];
  createdAt: string;
  completedAt?: string;
}

export interface ForecastPoint {
  period: string;
  value: number;
  lower?: number;
  upper?: number;
}

export interface Forecast {
  id: string;
  projectId: string;
  metric: string;
  horizon: string;
  scenario: ForecastScenario;
  assumptions: string[];
  confidence: number;
  methodology: string;
  validationNote?: string;
  points: ForecastPoint[];
  citations: SourceCitation[];
}

export interface InvestorThesis {
  id: string;
  companyName: string;
  stance: 'bull' | 'neutral' | 'bear';
  confidence: number;
  summary: string;
  catalysts: string[];
  risks: string[];
  comparableCompanies: string[];
  forecasts: Forecast[];
  citations: SourceCitation[];
  disclaimer: string;
}

export interface Recommendation {
  id: string;
  projectId: string;
  title: string;
  rationale: string;
  priority: RecommendationPriority;
  confidence: number;
  impact: number;
  effort: number;
  horizon: '30_days' | '60_days' | '90_days';
  nextAction: string;
  citations: SourceCitation[];
}

export interface Report {
  id: string;
  projectId: string;
  researchRunId: string;
  title: string;
  template: string;
  status: 'draft' | 'ready' | 'published';
  shareUrl?: string;
  createdAt: string;
}

export interface PitchDeck {
  id: string;
  projectId: string;
  researchRunId: string;
  title: string;
  fundingAsk?: string;
  stage: 'brief' | 'building' | 'review' | 'shared';
  slideCount: number;
  shareUrl?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  pitchDeckId: string;
  recipientName: string;
  recipientEmail?: string;
  message: string;
  status: 'draft' | 'sent' | 'viewed' | 'expired';
  createdAt: string;
}

export interface ApiEnvelope<T> {
  data: T;
  requestId?: string;
}
