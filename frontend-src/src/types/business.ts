export type CompanySize = '1-10' | '11-50' | '51-200' | '200+';
export type TargetMarket = 'B2B' | 'B2C' | 'Both';
export type LocationPriority = 'primary' | 'secondary' | 'future';
export type CompetitionLevel = 'low' | 'medium' | 'high';
export type ChallengeCategory = 'operational' | 'financial' | 'marketing' | 'technical' | 'competitive';
export type ChallengePriority = 'high' | 'medium' | 'low';
export type TechnologyCategory = 'marketing' | 'sales' | 'operations' | 'finance' | 'customer_service';

export interface BusinessLocation {
    country: string;
    city: string;
    priority: LocationPriority;
    marketSize?: number;
    competitionLevel?: CompetitionLevel;
}

export interface TechnologyStack {
    category: TechnologyCategory;
    toolName: string;
    purpose: string;
    satisfactionLevel?: number;  // 1-5 scale
    monthlySpend?: number;
}

export interface BusinessChallenge {
    category: ChallengeCategory;
    description: string;
    priority: ChallengePriority;
    impactArea: string[];
}

export interface Website {
    url: string;
    monthlyTraffic?: number;
    conversionRate?: number;
    primaryChannels?: string[];
}

export interface BusinessProfile {
    companyName: string;
    industry: string;
    monthlyRevenue: number;
    companySize: CompanySize;
    targetMarket: TargetMarket;
    preferredLocations: BusinessLocation[];
    website?: Website;
    currentChallenges: BusinessChallenge[];
    technologyStack: TechnologyStack[];
}
