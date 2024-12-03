import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ChallengeAnalysis } from '../../types/analysis';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ScatterController
);

interface Props {
    challengeAnalysis: ChallengeAnalysis;
}

export const ChallengeAnalysisChart: React.FC<Props> = ({ challengeAnalysis }) => {
    // Create data points for priority matrix visualization
    const getDataPoints = () => {
        const dataPoints: { x: number; y: number; label: string }[] = [];
        
        // High impact, urgent
        challengeAnalysis.priority_matrix.high_impact_urgent.forEach(challenge => {
            dataPoints.push({ x: 0.8 + Math.random() * 0.2, y: 0.8 + Math.random() * 0.2, label: challenge.description });
        });
        
        // High impact, non-urgent
        challengeAnalysis.priority_matrix.high_impact_non_urgent.forEach(challenge => {
            dataPoints.push({ x: 0.8 + Math.random() * 0.2, y: 0.2 + Math.random() * 0.2, label: challenge.description });
        });
        
        // Low impact, urgent
        challengeAnalysis.priority_matrix.low_impact_urgent.forEach(challenge => {
            dataPoints.push({ x: 0.2 + Math.random() * 0.2, y: 0.8 + Math.random() * 0.2, label: challenge.description });
        });
        
        // Low impact, non-urgent
        challengeAnalysis.priority_matrix.low_impact_non_urgent.forEach(challenge => {
            dataPoints.push({ x: 0.2 + Math.random() * 0.2, y: 0.2 + Math.random() * 0.2, label: challenge.description });
        });
        
        return dataPoints;
    };

    const scatterData = {
        datasets: [
            {
                label: 'Challenges',
                data: getDataPoints(),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                pointRadius: 8,
                pointHoverRadius: 12,
            },
        ],
    };

    const scatterOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Impact',
                },
                min: 0,
                max: 1,
            },
            y: {
                title: {
                    display: true,
                    text: 'Urgency',
                },
                min: 0,
                max: 1,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return context.raw.label;
                    },
                },
            },
            title: {
                display: true,
                text: 'Challenge Priority Matrix',
            },
        },
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <Scatter data={scatterData} options={scatterOptions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Impact Analysis</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Severity</span>
                            <div className="w-64 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${challengeAnalysis.impact_analysis.severity * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Scope</span>
                            <div className="w-64 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${challengeAnalysis.impact_analysis.scope * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Urgency</span>
                            <div className="w-64 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-red-600 h-2.5 rounded-full"
                                    style={{ width: `${challengeAnalysis.impact_analysis.urgency * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Solution Roadmap</h3>
                    <div className="space-y-4">
                        {challengeAnalysis.solution_roadmap.map((solution, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-medium text-gray-800">{solution.challenge}</h4>
                                <p className="text-sm text-gray-600 mt-1">Timeline: {solution.timeline}</p>
                                <ul className="list-disc list-inside mt-2">
                                    {solution.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="text-sm text-gray-700">{step}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
