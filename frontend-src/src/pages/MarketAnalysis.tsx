import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchMarketInsights, fetchMarketTrends, predictMarketSize } from '../store/slices/marketAnalysisSlice';
import MarketInsightsCard from '../components/MarketAnalysis/MarketInsightsCard';
import MarketTrendsChart from '../components/MarketAnalysis/MarketTrendsChart';
import MarketSizePrediction from '../components/MarketAnalysis/MarketSizePrediction';
import CompetitiveAnalysis from '../components/MarketAnalysis/CompetitiveAnalysis';
import { FaTimes } from 'react-icons/fa';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <div className="p-6">{children}</div>}
        </div>
    );
}

const industries = [
    'AI Software',
    'Cloud Computing',
    'E-commerce',
    'FinTech',
    'Healthcare Technology',
    'IoT',
    'Renewable Energy',
    'SaaS',
    'Cybersecurity',
    'Digital Marketing',
];

const businessTypes = [
    'B2B',
    'B2C',
    'B2B2C',
    'D2C',
    'Enterprise',
    'SMB',
];

const MarketAnalysis: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState(0);
    const [industry, setIndustry] = useState('');
    const [context, setContext] = useState('');
    const [location, setLocation] = useState('global');
    const [timeframe, setTimeframe] = useState('1year');
    const [businessType, setBusinessType] = useState<string[]>([]);
    const [competitors, setCompetitors] = useState<string[]>([]);
    const [targetMarketSize, setTargetMarketSize] = useState('');
    const [customIndustry, setCustomIndustry] = useState('');
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

    const handleAnalyze = () => {
        const selectedIndustry = customIndustry || industry;
        if (selectedIndustry && context) {
            dispatch(fetchMarketInsights({ 
                industry: selectedIndustry, 
                context,
                location,
                timeframe,
                businessType,
                competitors,
                targetMarketSize: parseInt(targetMarketSize) || 0,
            }));
            dispatch(fetchMarketTrends({ industry: selectedIndustry, location }));
            dispatch(predictMarketSize({ industry: selectedIndustry, location, timeframe }));
        }
    };

    const handleTabChange = (newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <div className="flex-grow">
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4 overflow-x-auto" aria-label="Market Analysis Tabs">
                    {['Market Overview', 'Market Trends', 'Market Size', 'Competitive Analysis'].map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(index)}
                            className={`whitespace-nowrap px-4 py-2 font-medium text-sm rounded-t-lg ${
                                activeTab === index
                                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <TabPanel value={activeTab} index={0}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Analyze Your Market</h2>
                            
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    value={customIndustry || industry}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (industries.includes(value)) {
                                            setIndustry(value);
                                            setCustomIndustry('');
                                        } else {
                                            setCustomIndustry(value);
                                            setIndustry('');
                                        }
                                    }}
                                    onFocus={() => setShowIndustryDropdown(true)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Select or type industry"
                                />
                                {showIndustryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        {industries.map((ind) => (
                                            <div
                                                key={ind}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setIndustry(ind);
                                                    setCustomIndustry('');
                                                    setShowIndustryDropdown(false);
                                                }}
                                            >
                                                {ind}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="global">Global</option>
                                    <option value="north_america">North America</option>
                                    <option value="europe">Europe</option>
                                    <option value="asia_pacific">Asia Pacific</option>
                                    <option value="latin_america">Latin America</option>
                                    <option value="middle_east">Middle East</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <select
                                    value={timeframe}
                                    onChange={(e) => setTimeframe(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1year">1 Year</option>
                                    <option value="3years">3 Years</option>
                                    <option value="5years">5 Years</option>
                                    <option value="10years">10 Years</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {businessType.map((type) => (
                                        <span
                                            key={type}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                        >
                                            {type}
                                            <button
                                                onClick={() => setBusinessType(businessType.filter(t => t !== type))}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <select
                                    value=""
                                    onChange={(e) => {
                                        if (e.target.value && !businessType.includes(e.target.value)) {
                                            setBusinessType([...businessType, e.target.value]);
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Add Business Type</option>
                                    {businessTypes.filter(type => !businessType.includes(type)).map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="number"
                                    value={targetMarketSize}
                                    onChange={(e) => setTargetMarketSize(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Target Market Size (USD)"
                                />
                                <p className="mt-1 text-sm text-gray-500">Enter target market size in USD</p>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={competitors.join(', ')}
                                    onChange={(e) => setCompetitors(e.target.value.split(',').map(s => s.trim()))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter competitor names"
                                />
                                <p className="mt-1 text-sm text-gray-500">Separate competitor names with commas</p>
                            </div>

                            <div className="mb-4">
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your business model, target audience, key differentiators, and specific areas of interest..."
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!industry || !context}
                                className={`w-full py-2 px-4 rounded-md font-medium ${
                                    !industry || !context
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                Analyze Market
                            </button>
                        </div>
                    </div>
                    <div className="md:col-span-8">
                        <MarketInsightsCard />
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <MarketTrendsChart />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <MarketSizePrediction />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <CompetitiveAnalysis />
            </TabPanel>
        </div>
    );
};

export default MarketAnalysis;
