import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FaSpinner } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';

const MarketInsightsCard: React.FC = () => {
    const { insights, loading, error } = useSelector(
        (state: RootState) => state.marketAnalysis
    );

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg">
                <div className="flex justify-center items-center p-8">
                    <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-4">
                    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
                        <BiErrorCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Market Insights
                </h2>
                {insights ? (
                    <p className="text-gray-700 leading-relaxed">
                        {insights.insights}
                    </p>
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        No insights available. Try analyzing a specific industry.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MarketInsightsCard;
