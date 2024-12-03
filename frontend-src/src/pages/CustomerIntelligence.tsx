import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from 'recharts';
import { customerApi } from '../services/api';
import { FaUsers, FaChartLine, FaArrowUp, FaSync } from 'react-icons/fa';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className="focus:outline-none"
            {...other}
        >
            {value === index && <div className="p-6">{children}</div>}
        </div>
    );
}

const CustomerIntelligence: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [segments, setSegments] = useState<any[]>([]);
    const [behaviors, setBehaviors] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [engagement, setEngagement] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Enhanced UI Components with Tailwind CSS
    const MetricsCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: React.ReactNode; trend?: number }) => (
        <div className="transform transition-all duration-200 ease-in-out hover:translate-y-[-4px]">
            <div className="h-full bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-blue-600 text-white mr-4">
                        {icon}
                    </div>
                    <h3 className="text-gray-700 font-semibold">
                        {title}
                    </h3>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                    {value}
                </div>
                {trend !== undefined && (
                    <div className="flex items-center text-sm">
                        <FaArrowUp 
                            className={`mr-2 ${
                                trend >= 0 
                                    ? 'text-emerald-500 rotate-0' 
                                    : 'text-red-500 rotate-45'
                            }`}
                        />
                        <span className={
                            trend >= 0 
                                ? 'text-emerald-500' 
                                : 'text-red-500'
                        }>
                            {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [segmentsData, behaviorsData, metricsData, engagementData] = await Promise.all([
                customerApi.getSegments(),
                customerApi.getCustomerBehaviors(),
                customerApi.getCustomerMetrics(),
                customerApi.getEngagementStats()
            ]);

            setSegments(segmentsData);
            setBehaviors(behaviorsData);
            setMetrics(metricsData);
            setEngagement(engagementData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTabChange = (newValue: number) => {
        setTabValue(newValue);
    };

    const handleRefresh = () => {
        fetchData();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Customer Intelligence
                </h1>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Refresh Data"
                >
                    <FaSync className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
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

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['Overview', 'Segments', 'Behaviors', 'Engagement'].map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(index)}
                            className={`
                                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                ${tabValue === index
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <TabPanel value={tabValue} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics?.summary && (
                        <>
                            <MetricsCard
                                title="Total Customers"
                                value={metrics.summary.total_customers.toLocaleString()}
                                icon={<FaUsers className="w-5 h-5" />}
                                trend={metrics.trends.growth_rate}
                            />
                            <MetricsCard
                                title="Active Customers"
                                value={metrics.summary.active_customers.toLocaleString()}
                                icon={<FaChartLine className="w-5 h-5" />}
                                trend={metrics.trends.growth_rate}
                            />
                            <MetricsCard
                                title="Churn Rate"
                                value={`${(metrics.summary.churn_rate * 100).toFixed(1)}%`}
                                icon={<FaArrowUp className="w-5 h-5" />}
                                trend={-metrics.trends.retention_rate}
                            />
                            <MetricsCard
                                title="Avg Lifetime Value"
                                value={`$${metrics.summary.average_lifetime_value.toLocaleString()}`}
                                icon={<FaArrowUp className="w-5 h-5" />}
                                trend={metrics.trends.growth_rate}
                            />
                        </>
                    )}
                </div>

                {engagement.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white rounded-xl shadow-md p-6 transition-shadow duration-200 hover:shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Engagement Trend
                            </h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={engagement}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fill: '#4B5563' }}
                                            tickLine={{ stroke: '#9CA3AF' }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#4B5563' }}
                                            tickLine={{ stroke: '#9CA3AF' }}
                                        />
                                        <ChartTooltip
                                            contentStyle={{
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '0.5rem',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Legend 
                                            verticalAlign="top"
                                            height={36}
                                            wrapperStyle={{
                                                paddingTop: '1rem',
                                            }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="engagement" 
                                            stroke="#2563EB"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, strokeWidth: 2 }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="satisfaction" 
                                            stroke="#7C3AED"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6, strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {segments.map((segment) => (
                        <div key={segment.id} className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg transform hover:translate-y-[-4px]">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {segment.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Size: {segment.size.toLocaleString()} customers
                            </p>
                            <div className="mb-4 flex flex-wrap gap-2">
                                {segment.characteristics.map((char: string) => (
                                    <span
                                        key={char}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                            <button
                                className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium
                                    hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 
                                    focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => {/* Handle view details */}}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 transition-shadow duration-200 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Customer Behavior Patterns
                        </h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer>
                                <BarChart data={behaviors}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis 
                                        dataKey="type"
                                        tick={{ fill: '#4B5563' }}
                                        tickLine={{ stroke: '#9CA3AF' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4B5563' }}
                                        tickLine={{ stroke: '#9CA3AF' }}
                                    />
                                    <ChartTooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="top"
                                        height={36}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="#6366F1"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 transition-shadow duration-200 hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Customer Engagement Analysis
                        </h2>
                        <div className="h-[400px]">
                            <ResponsiveContainer>
                                <LineChart data={engagement}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                                    <XAxis 
                                        dataKey="date"
                                        tick={{ fill: '#4B5563' }}
                                        tickLine={{ stroke: '#9CA3AF' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#4B5563' }}
                                        tickLine={{ stroke: '#9CA3AF' }}
                                    />
                                    <ChartTooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Legend 
                                        verticalAlign="top"
                                        height={36}
                                        wrapperStyle={{
                                            paddingTop: '1rem',
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="engagement" 
                                        stroke="#2563EB"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="retention" 
                                        stroke="#7C3AED"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="satisfaction" 
                                        stroke="#DC2626"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6, strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </div>
    );
};

export default CustomerIntelligence;
