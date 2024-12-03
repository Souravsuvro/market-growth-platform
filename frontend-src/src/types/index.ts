// API Response Types
export interface MarketInsight {
    status: string;
    insights: string;
    usage?: any;
}

export interface MarketTrend {
    id: number;
    trend: string;
    impact: number;
    relevance: string;
    growth_rate: number;
    timeline: string;
}

export interface MarketSize {
    total_size: number;
    growth_rate: number;
    opportunity_score: number;
    market_share: {
        id: string;
        label: string;
        value: number;
        color: string;
    }[];
    forecast: {
        year: string;
        size: number;
    }[];
}

export interface CompetitorAnalysis {
    status: string;
    analysis: string;
    usage?: any;
}

export interface CustomerSegment {
    id: number;
    name: string;
    size: number;
    characteristics: string[];
}

export interface MarketAnalysisParams {
    industry: string;
    context: string;
    location: string;
    timeframe: string;
    businessType: string[];
    competitors: string[];
    targetMarketSize: number;
}

// State Types
export interface MarketAnalysisState {
    insights: MarketInsight | null;
    trends: MarketTrend[];
    marketSize: MarketSize | null;
    loading: boolean;
    error: string | null;
}

export interface CustomerState {
    segments: CustomerSegment[];
    loading: boolean;
    error: string | null;
}

export interface TrendState {
    trends: MarketTrend[];
    loading: boolean;
    error: string | null;
}
