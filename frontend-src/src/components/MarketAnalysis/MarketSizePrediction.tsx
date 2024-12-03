import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MarketSizePrediction: React.FC = () => {
    const { insights, loading } = useSelector((state: RootState) => state.marketAnalysis);

    // Sample data - in production, this would come from the API
    const marketShareData = [
        {
            id: 'Market Leader',
            label: 'Market Leader',
            value: 35,
            color: '#22c55e', // Tailwind green-500
        },
        {
            id: 'Major Players',
            label: 'Major Players',
            value: 25,
            color: '#eab308', // Tailwind yellow-500
        },
        {
            id: 'Growing Companies',
            label: 'Growing Companies',
            value: 20,
            color: '#06b6d4', // Tailwind cyan-500
        },
        {
            id: 'Others',
            label: 'Others',
            value: 20,
            color: '#ef4444', // Tailwind red-500
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Market Size & Distribution
                </h2>
                <div className="h-[400px]">
                    <ResponsivePie
                        data={marketShareData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={8}
                        borderWidth={1}
                        borderColor={{
                            from: 'color',
                            modifiers: [['darker', 0.2]],
                        }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#374151" // Tailwind gray-700
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [['darker', 2]],
                        }}
                        theme={{
                            labels: {
                                text: {
                                    fontSize: 14,
                                    fill: '#374151', // Tailwind gray-700
                                },
                            },
                            legends: {
                                text: {
                                    fontSize: 12,
                                    fill: '#6b7280', // Tailwind gray-500
                                },
                            },
                        }}
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                justify: false,
                                translateX: 0,
                                translateY: 56,
                                itemsSpacing: 0,
                                itemWidth: 100,
                                itemHeight: 18,
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 18,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#111827', // Tailwind gray-900
                                        },
                                    },
                                ],
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Key Market Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                        <p className="text-3xl font-bold text-blue-600 mb-2">
                            $50B
                        </p>
                        <p className="text-sm text-gray-600">
                            Total Market Size
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-3xl font-bold text-purple-600 mb-2">
                            12.5%
                        </p>
                        <p className="text-sm text-gray-600">
                            Annual Growth Rate
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <p className="text-3xl font-bold text-green-600 mb-2">
                            85%
                        </p>
                        <p className="text-sm text-gray-600">
                            Market Opportunity
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketSizePrediction;
