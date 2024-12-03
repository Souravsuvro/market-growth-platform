import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { LocationAnalysis } from '../../types/analysis';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

interface Props {
    locationAnalysis: LocationAnalysis[];
}

export const LocationAnalysisChart: React.FC<Props> = ({ locationAnalysis }) => {
    const barChartData = {
        labels: locationAnalysis.map(location => `${location.city}, ${location.country}`),
        datasets: [
            {
                label: 'Market Potential (millions)',
                data: locationAnalysis.map(location => location.market_potential / 1000000),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Growth Forecast (%)',
                data: locationAnalysis.map(location => location.growth_forecast * 100),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Market Potential and Growth by Location',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const radarData = {
        labels: locationAnalysis.map(location => `${location.city}, ${location.country}`),
        datasets: [
            {
                label: 'Location Score',
                data: locationAnalysis.map(location => location.location_score * 100),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Location Comparison Radar',
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <Bar data={barChartData} options={barOptions} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <Radar data={radarData} options={radarOptions} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationAnalysis.map((location, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">{`${location.city}, ${location.country}`}</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700">Risk Factors</h4>
                                <ul className="list-disc list-inside">
                                    {location.risk_factors.map((risk, idx) => (
                                        <li key={idx} className="text-sm text-gray-600">{risk}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700">Recommendations</h4>
                                <ul className="list-disc list-inside">
                                    {location.recommendations.map((rec, idx) => (
                                        <li key={idx} className="text-sm text-gray-600">{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
