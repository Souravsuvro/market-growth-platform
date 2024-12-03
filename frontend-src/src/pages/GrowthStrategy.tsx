import React, { useState, useEffect } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { BsGraphUp } from 'react-icons/bs';
import LoadingSpinner from '../components/common/LoadingSpinner';
import growthStrategyService, { MetricData, Strategy } from '../services/growthStrategyService';

const GrowthStrategy: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricData[]>([]);
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await growthStrategyService.getGrowthStrategy();
            setMetrics(data.metrics);
            setStrategies(data.strategies);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch growth strategy data';
            setError(errorMessage);
            console.error('Error fetching growth strategy data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
                <button
                    onClick={fetchData}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    const getStatusColor = (status: Strategy['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500 text-white';
            case 'in_progress':
                return 'bg-blue-500 text-white';
            case 'pending':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                    <BsGraphUp className="mr-2" />
                    Growth Strategy
                </h1>
                <p className="text-gray-600">Track and monitor your business growth initiatives</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Key Metrics Performance
                </h2>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="current" fill="#3b82f6" name="Current" />
                            <Bar dataKey="target" fill="#10b981" name="Target" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Active Growth Strategies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategies.map((strategy) => (
                        <div key={strategy.id} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {strategy.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(strategy.status)}`}>
                                    {strategy.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                {strategy.description}
                            </p>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <span className="text-xs font-semibold inline-block text-gray-600">
                                        Progress
                                    </span>
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                        {strategy.progress}%
                                    </span>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{ width: `${strategy.progress}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrowthStrategy;
