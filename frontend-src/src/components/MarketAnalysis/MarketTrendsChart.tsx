import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { FaChartLine, FaChartBar } from 'react-icons/fa';

type ChartType = 'line' | 'bar';

const MarketTrendsChart: React.FC = () => {
    const { insights, loading } = useSelector((state: RootState) => state.marketAnalysis);
    const [chartType, setChartType] = useState<ChartType>('line');

    // Sample data - in production, this would come from the API
    const trendData = [
        {
            id: 'Market Growth',
            data: [
                { x: '2020', y: 100 },
                { x: '2021', y: 120 },
                { x: '2022', y: 150 },
                { x: '2023', y: 180 },
                { x: '2024', y: 220 },
            ],
        },
        {
            id: 'Industry Average',
            data: [
                { x: '2020', y: 90 },
                { x: '2021', y: 100 },
                { x: '2022', y: 120 },
                { x: '2023', y: 140 },
                { x: '2024', y: 170 },
            ],
        },
    ];

    const barData = [
        { quarter: 'Q1 2023', growth: 15, revenue: 120 },
        { quarter: 'Q2 2023', growth: 18, revenue: 150 },
        { quarter: 'Q3 2023', growth: 22, revenue: 180 },
        { quarter: 'Q4 2023', growth: 25, revenue: 220 },
    ];

    const handleChartTypeChange = (newType: ChartType) => {
        setChartType(newType);
    };

    const renderChart = () => {
        const commonProps = {
            animate: true,
            motionConfig: 'gentle',
        };

        switch (chartType) {
            case 'line':
                return (
                    <div className="h-full min-h-[400px]">
                        <ResponsiveLine
                            {...commonProps}
                            data={trendData}
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            xScale={{ type: 'point' }}
                            yScale={{
                                type: 'linear',
                                min: 'auto',
                                max: 'auto',
                                stacked: false,
                                reverse: false,
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Year',
                                legendOffset: 36,
                                legendPosition: 'middle',
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Market Size',
                                legendOffset: -40,
                                legendPosition: 'middle',
                            }}
                            colors={['#2563eb', '#7c3aed']} // Tailwind blue-600 and purple-600
                            pointSize={10}
                            pointColor={{ theme: 'background' }}
                            pointBorderWidth={2}
                            pointBorderColor={{ from: 'serieColor' }}
                            pointLabelYOffset={-12}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: 'left-to-right',
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemBackground: 'rgba(0, 0, 0, .03)',
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: '#6b7280', // Tailwind gray-500
                                        },
                                    },
                                    legend: {
                                        text: {
                                            fill: '#374151', // Tailwind gray-700
                                            fontSize: 12,
                                        },
                                    },
                                },
                                grid: {
                                    line: {
                                        stroke: '#e5e7eb', // Tailwind gray-200
                                    },
                                },
                            }}
                        />
                    </div>
                );
            case 'bar':
                return (
                    <div className="h-full min-h-[400px]">
                        <ResponsiveBar
                            {...commonProps}
                            data={barData}
                            keys={['growth', 'revenue']}
                            indexBy="quarter"
                            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                            padding={0.3}
                            groupMode="grouped"
                            valueScale={{ type: 'linear' }}
                            indexScale={{ type: 'band', round: true }}
                            colors={['#2563eb', '#7c3aed']} // Tailwind blue-600 and purple-600
                            borderColor={{
                                from: 'color',
                                modifiers: [['darker', 1.6]],
                            }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Quarter',
                                legendPosition: 'middle',
                                legendOffset: 32,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Value',
                                legendPosition: 'middle',
                                legendOffset: -40,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            legends={[
                                {
                                    dataFrom: 'keys',
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    justify: false,
                                    translateX: 120,
                                    translateY: 0,
                                    itemsSpacing: 2,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemDirection: 'left-to-right',
                                    itemOpacity: 0.85,
                                    symbolSize: 20,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: '#6b7280', // Tailwind gray-500
                                        },
                                    },
                                    legend: {
                                        text: {
                                            fill: '#374151', // Tailwind gray-700
                                            fontSize: 12,
                                        },
                                    },
                                },
                                grid: {
                                    line: {
                                        stroke: '#e5e7eb', // Tailwind gray-200
                                    },
                                },
                            }}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Market Growth Trends
                    </h2>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick={() => handleChartTypeChange('line')}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-lg border ${
                                chartType === 'line'
                                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <FaChartLine className="w-4 h-4 mr-2" />
                            Line
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChartTypeChange('bar')}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-lg border border-l-0 ${
                                chartType === 'bar'
                                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <FaChartBar className="w-4 h-4 mr-2" />
                            Bar
                        </button>
                    </div>
                </div>
                <div className="h-[500px]">
                    {renderChart()}
                </div>
            </div>
        </div>
    );
};

export default MarketTrendsChart;
