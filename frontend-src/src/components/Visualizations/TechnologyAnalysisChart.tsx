import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { TechnologyAnalysis } from '../../types/analysis';

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

interface Props {
    techAnalysis: TechnologyAnalysis;
}

export const TechnologyAnalysisChart: React.FC<Props> = ({ techAnalysis }) => {
    const efficiencyData = {
        labels: ['Efficient', 'Improvement Needed'],
        datasets: [
            {
                data: [
                    techAnalysis.efficiency_score * 100,
                    100 - (techAnalysis.efficiency_score * 100),
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const costData = {
        labels: ['Current Spend', 'Potential Savings'],
        datasets: [
            {
                data: [
                    techAnalysis.cost_optimization.current_spend,
                    techAnalysis.cost_optimization.potential_savings,
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Technology Stack Efficiency</h3>
                    <Doughnut data={efficiencyData} options={options} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
                    <Doughnut data={costData} options={options} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Coverage Gaps</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {techAnalysis.coverage_gaps.map((gap, index) => (
                            <li key={index} className="text-gray-700">{gap}</li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Integration Opportunities</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {techAnalysis.integration_opportunities.map((opportunity, index) => (
                            <li key={index} className="text-gray-700">{opportunity}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techAnalysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{recommendation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
