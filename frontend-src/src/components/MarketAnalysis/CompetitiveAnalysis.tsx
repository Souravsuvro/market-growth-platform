import React, { useState } from 'react';
import { FaSpinner, FaGlobe, FaChartLine, FaCode, FaShareAlt, FaFileAlt, FaPlus, FaExchangeAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { api } from '../../services/api';

interface CompetitorAnalysis {
    key_features: string[];
    content_analysis: {
        common_terms: { [key: string]: number };
        word_count: number;
        sentence_count: number;
        avg_sentence_length: number;
    };
    sentiment_analysis: {
        positive: number;
        neutral: number;
        negative: number;
        compound: number;
    };
    tech_stack: {
        frontend: string[];
        analytics: string[];
        cdn: string[];
    };
    social_presence: string[];
    meta_info: {
        description?: string;
        keywords?: string;
        title?: string;
    };
}

interface ComparisonData {
    comparison: {
        summary: {
            key_findings: string[];
        };
        sentiment_comparison: {
            individual: { [key: string]: any };
        };
        tech_stack_comparison: {
            individual: { [key: string]: any };
            common_technologies: { [key: string]: string[] };
        };
        content_metrics_comparison: {
            individual: { [key: string]: any };
        };
        common_terms_comparison: {
            common_terms: { [key: string]: number };
        };
    };
}

const CompetitiveAnalysis: React.FC = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
    const [competitors, setCompetitors] = useState<Array<{ name: string; url: string }>>([
        { name: '', url: '' }
    ]);
    const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/competitor-analysis/analyze', { url });
            setAnalysis(response.data.data);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze competitor');
            setAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompetitor = () => {
        setCompetitors([...competitors, { name: '', url: '' }]);
    };

    const handleRemoveCompetitor = (index: number) => {
        setCompetitors(competitors.filter((_, i) => i !== index));
    };

    const handleCompetitorChange = (index: number, field: 'name' | 'url', value: string) => {
        const newCompetitors = [...competitors];
        newCompetitors[index][field] = value;
        setCompetitors(newCompetitors);
    };

    const handleCompare = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/competitor-analysis/analyze-multiple', {
                competitors: competitors.map(comp => ({
                    name: comp.name,
                    url: comp.url
                }))
            });
            setComparisonData(response.data);
            setAnalysis(null);
        } catch (err: any) {
            setError(err.message || 'Failed to analyze competitors');
            setComparisonData(null);
        } finally {
            setLoading(false);
        }
    };

    const SentimentBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm text-gray-600">{(value * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${value * 100}%`,
                        backgroundColor: color
                    }}
                />
            </div>
        </div>
    );

    const SingleCompetitorAnalysis = ({ analysis }: { analysis: CompetitorAnalysis }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Meta Information */}
            <div className="col-span-full">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FaFileAlt className="w-5 h-5 text-gray-600 mr-2" />
                        <h2 className="text-lg font-semibold">Website Overview</h2>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{analysis.meta_info.title}</h3>
                    <p className="text-gray-600">{analysis.meta_info.description}</p>
                </div>
            </div>

            {/* Key Features */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                    <h2 className="text-lg font-semibold mb-4">Key Features</h2>
                    <ul className="space-y-2">
                        {analysis.key_features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                    <h2 className="text-lg font-semibold mb-4">Content Sentiment</h2>
                    <SentimentBar
                        value={analysis.sentiment_analysis.positive}
                        label="Positive"
                        color="#10B981"
                    />
                    <SentimentBar
                        value={analysis.sentiment_analysis.neutral}
                        label="Neutral"
                        color="#60A5FA"
                    />
                    <SentimentBar
                        value={analysis.sentiment_analysis.negative}
                        label="Negative"
                        color="#EF4444"
                    />
                </div>
            </div>

            {/* Technology Stack */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                    <div className="flex items-center mb-4">
                        <FaCode className="w-5 h-5 text-gray-600 mr-2" />
                        <h2 className="text-lg font-semibold">Technology Stack</h2>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Frontend</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.tech_stack.frontend.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Analytics</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.tech_stack.analytics.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Presence */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 h-full">
                    <div className="flex items-center mb-4">
                        <FaShareAlt className="w-5 h-5 text-gray-600 mr-2" />
                        <h2 className="text-lg font-semibold">Social Presence</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analysis.social_presence.map((platform) => (
                            <span
                                key={platform}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                                {platform}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Analysis */}
            <div className="col-span-full">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center mb-4">
                        <FaChartLine className="w-5 h-5 text-gray-600 mr-2" />
                        <h2 className="text-lg font-semibold">Content Analysis</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Word Count</h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {analysis.content_analysis.word_count.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Sentence Count</h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {analysis.content_analysis.sentence_count.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Sentence Length</h3>
                            <p className="text-3xl font-bold text-gray-900">
                                {analysis.content_analysis.avg_sentence_length.toFixed(1)}
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Common Terms</h3>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(analysis.content_analysis.common_terms).map(([term, count]) => (
                                <span
                                    key={term}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                    {term} ({count})
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ComparisonSection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Summary */}
            <div className="col-span-full">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Comparison Summary</h2>
                    <ul className="space-y-2">
                        {comparisonData?.comparison?.summary?.key_findings.map((finding: string, index: number) => (
                            <li key={index} className="flex items-start">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                                <span>{finding}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Sentiment Comparison */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Sentiment Analysis Comparison</h2>
                    {Object.entries(comparisonData?.comparison?.sentiment_comparison?.individual || {}).map(
                        ([name, sentiment]: [string, any]) => (
                            <div key={name} className="mb-6 last:mb-0">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
                                <SentimentBar
                                    value={sentiment.positive}
                                    label="Positive"
                                    color="#10B981"
                                />
                                <SentimentBar
                                    value={sentiment.neutral}
                                    label="Neutral"
                                    color="#60A5FA"
                                />
                                <SentimentBar
                                    value={sentiment.negative}
                                    label="Negative"
                                    color="#EF4444"
                                />
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Technology Stack Comparison */}
            <div className="col-span-full md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Technology Stack Comparison</h2>
                    {Object.entries(comparisonData?.comparison?.tech_stack_comparison?.individual || {}).map(
                        ([name, tech]: [string, any]) => (
                            <div key={name} className="mb-6 last:mb-0">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(tech).map(([category, items]: [string, any]) => (
                                        items.map((item: string) => (
                                            <span
                                                key={`${category}-${item}`}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    comparisonData?.comparison?.tech_stack_comparison?.common_technologies[category].includes(item)
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {item}
                                            </span>
                                        ))
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Content Metrics Comparison */}
            <div className="col-span-full">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Content Metrics Comparison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(comparisonData?.comparison?.content_metrics_comparison?.individual || {}).map(
                            ([name, metrics]: [string, any]) => (
                                <div key={name} className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">{name}</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-2">
                                        {metrics.word_count.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">Words</p>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Sentences: {metrics.sentence_count.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Avg. Length: {metrics.avg_sentence_length.toFixed(1)}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* Common Terms Comparison */}
            <div className="col-span-full">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Common Terms Across Competitors</h2>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(comparisonData?.comparison?.common_terms_comparison?.common_terms || {}).map(
                            ([term, count]: [string, number]) => (
                                <span
                                    key={term}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                    {term} ({count})
                                </span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                {competitors.map((competitor, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-center">
                        <div className="md:col-span-4">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Competitor Name"
                                value={competitor.name}
                                onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="md:col-span-6">
                            <input
                                type="url"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="https://example.com"
                                value={competitor.url}
                                onChange={(e) => handleCompetitorChange(index, 'url', e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={() => handleRemoveCompetitor(index)}
                                disabled={loading || competitors.length === 1}
                                className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex gap-4 mt-4">
                    <button
                        onClick={handleAddCompetitor}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaPlus className="mr-2 -ml-1 h-4 w-4" />
                        Add Competitor
                    </button>
                    <button
                        onClick={handleCompare}
                        disabled={!competitors.every(c => c.name && c.url) || loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin mr-2 -ml-1 h-4 w-4" />
                        ) : (
                            <FaExchangeAlt className="mr-2 -ml-1 h-4 w-4" />
                        )}
                        {loading ? 'Analyzing...' : 'Compare Competitors'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {comparisonData && <ComparisonSection />}
            {analysis && <SingleCompetitorAnalysis analysis={analysis} />}
        </div>
    );
};

export default CompetitiveAnalysis;
