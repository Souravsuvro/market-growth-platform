import { BusinessLocation, BusinessChallenge } from './business';

export interface LocationAnalysis extends BusinessLocation {
    location_score: number;
    market_potential: number;
    competition_level: string;
    growth_forecast: number;
    risk_factors: string[];
    recommendations: string[];
}

export interface TechnologyAnalysis {
    efficiency_score: number;
    coverage_gaps: string[];
    cost_optimization: {
        current_spend: number;
        potential_savings: number;
        recommendations: string[];
    };
    integration_opportunities: string[];
    recommendations: string[];
}

export interface ChallengeAnalysis {
    priority_matrix: {
        high_impact_urgent: BusinessChallenge[];
        high_impact_non_urgent: BusinessChallenge[];
        low_impact_urgent: BusinessChallenge[];
        low_impact_non_urgent: BusinessChallenge[];
    };
    impact_analysis: {
        severity: number;
        scope: number;
        urgency: number;
    };
    solution_roadmap: {
        challenge: string;
        steps: string[];
        timeline: string;
        resources: string[];
    }[];
}

export interface ComprehensiveAnalysis {
    location_analysis: LocationAnalysis[];
    technology_analysis: TechnologyAnalysis;
    challenge_analysis: ChallengeAnalysis;
    overall_recommendations: string[];
}
