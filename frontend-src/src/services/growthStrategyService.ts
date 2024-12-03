import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface MetricData {
    name: string;
    current: number;
    target: number;
}

export interface Strategy {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface GrowthStrategyData {
    metrics: MetricData[];
    strategies: Strategy[];
}

const growthStrategyService = {
    async getGrowthStrategy(): Promise<GrowthStrategyData> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/growth-strategy`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.detail || 'Failed to fetch growth strategy data');
            }
            throw error;
        }
    }
};

export default growthStrategyService;
