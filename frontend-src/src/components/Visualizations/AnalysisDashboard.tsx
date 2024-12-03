import React, { useState, useEffect } from 'react';
import { LocationAnalysisChart } from './LocationAnalysisChart';
import { TechnologyAnalysisChart } from './TechnologyAnalysisChart';
import { ChallengeAnalysisChart } from './ChallengeAnalysisChart';
import { ComprehensiveAnalysis } from '../../types/analysis';
import axios from 'axios';

export const AnalysisDashboard: React.FC = () => {
    const [analysisData, setAnalysisData] = useState<ComprehensiveAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'location' | 'technology' | 'challenges'>('location');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await axios.get<ComprehensiveAnalysis>('/api/analysis/comprehensive');
                setAnalysisData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch analysis data');
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !analysisData) {
        return (
            <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">{error || 'No analysis data available'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
                <nav className="flex border-b">
                    <button
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'location'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('location')}
                    >
                        Location Analysis
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'technology'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('technology')}
                    >
                        Technology Analysis
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium ${
                            activeTab === 'challenges'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('challenges')}
                    >
                        Challenge Analysis
                    </button>
                </nav>

                <div className="p-6">
                    {activeTab === 'location' && (
                        <LocationAnalysisChart locationAnalysis={analysisData.location_analysis} />
                    )}
                    {activeTab === 'technology' && (
                        <TechnologyAnalysisChart techAnalysis={analysisData.technology_analysis} />
                    )}
                    {activeTab === 'challenges' && (
                        <ChallengeAnalysisChart challengeAnalysis={analysisData.challenge_analysis} />
                    )}
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Overall Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analysisData.overall_recommendations.map((recommendation, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                        >
                            <p className="text-gray-700">{recommendation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
