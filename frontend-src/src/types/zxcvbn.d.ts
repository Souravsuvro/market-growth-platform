declare module 'zxcvbn' {
    export interface ZXCVBNResult {
        score: number;
        feedback: {
            warning: string;
            suggestions: string[];
        };
        crack_times_display: {
            offline_fast_hashing_1e10_per_second: string;
        };
    }

    export default function zxcvbn(password: string): ZXCVBNResult;
}
