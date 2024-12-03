import React from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
}) => {
    const result: ZXCVBNResult = zxcvbn(password);
    const score = result.score * 25;

    const createPasswordLabel = (score: number): string => {
        switch (score) {
            case 0:
                return 'Very weak';
            case 25:
                return 'Weak';
            case 50:
                return 'Fair';
            case 75:
                return 'Good';
            case 100:
                return 'Strong';
            default:
                return 'Very weak';
        }
    };

    const getProgressColor = (score: number): string => {
        switch (score) {
            case 0:
                return 'bg-red-500';
            case 25:
                return 'bg-orange-500';
            case 50:
                return 'bg-yellow-500';
            case 75:
                return 'bg-lime-500';
            case 100:
                return 'bg-green-500';
            default:
                return 'bg-red-500';
        }
    };

    const { warning, suggestions } = result.feedback;

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div
                        className={`h-full rounded-full transition-all duration-300 ${getProgressColor(score)}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <span className="ml-2 text-sm text-gray-600 min-w-[70px]">
                    {createPasswordLabel(score)}
                </span>
            </div>
            {(warning || suggestions.length > 0) && (
                <div className="mt-1 text-sm">
                    {warning && (
                        <p className="text-red-600 mb-1">{warning}</p>
                    )}
                    {suggestions.length > 0 && (
                        <ul className="text-gray-600 list-disc pl-5">
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <p className="mt-1 text-sm text-gray-600">
                Estimated crack time:{' '}
                {result.crack_times_display.offline_fast_hashing_1e10_per_second}
            </p>
        </div>
    );
};

export default PasswordStrengthIndicator;
