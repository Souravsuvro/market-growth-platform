import axios, { AxiosError } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!error.response) {
            throw new Error('Backend server is not available. Please ensure the server is running.');
        }
        throw error;
    }
);

// Mock data for development
const mockData = {
    segments: [
        { 
            id: 1, 
            name: 'High-Value Customers', 
            size: 1200, 
            growth: 15,
            characteristics: ['High LTV', 'Frequent Purchases', 'Long Retention']
        },
        { 
            id: 2, 
            name: 'Regular Customers', 
            size: 3500, 
            growth: 8,
            characteristics: ['Medium LTV', 'Regular Engagement']
        },
        { 
            id: 3, 
            name: 'New Customers', 
            size: 850, 
            growth: 25,
            characteristics: ['Recent Acquisition', 'High Potential']
        }
    ],
    behaviors: [
        { type: 'Purchase', count: 2500 },
        { type: 'Site Visit', count: 12000 },
        { type: 'Feature Usage', count: 8500 },
        { type: 'Support Contact', count: 450 }
    ],
    metrics: {
        summary: {
            total_customers: 5550,
            active_customers: 4200,
            churn_rate: 0.05,
            average_lifetime_value: 2500
        },
        trends: {
            growth_rate: 15,
            retention_rate: 95,
            satisfaction_rate: 92
        }
    },
    engagement: [
        { date: '2024-01', engagement: 85, satisfaction: 90, retention: 95 },
        { date: '2024-02', engagement: 87, satisfaction: 91, retention: 94 },
        { date: '2024-03', engagement: 90, satisfaction: 93, retention: 96 },
        { date: '2024-04', engagement: 88, satisfaction: 92, retention: 95 },
        { date: '2024-05', engagement: 92, satisfaction: 94, retention: 97 }
    ]
};

// Customer Intelligence API
export const customerApi = {
    // Segment Management
    getSegments: async () => {
        try {
            const response = await api.get('/customer-intelligence/segments');
            return response.data;
        } catch (error) {
            console.warn('Using mock data for segments');
            return mockData.segments;
        }
    },

    getSegmentDetails: async (segmentId: string) => {
        try {
            const response = await api.get(`/customer-intelligence/segments/${segmentId}`);
            return response.data;
        } catch (error) {
            console.warn('Using mock data for segment details');
            return mockData.segments.find(s => s.id === parseInt(segmentId));
        }
    },

    // Behavior Tracking
    getCustomerBehaviors: async (filters?: { 
        startDate?: string; 
        endDate?: string;
        segmentId?: string;
    }) => {
        try {
            const response = await api.get('/customer-intelligence/behaviors', { params: filters });
            return response.data;
        } catch (error) {
            console.warn('Using mock data for behaviors');
            return mockData.behaviors;
        }
    },

    // Analytics
    getCustomerMetrics: async () => {
        try {
            const response = await api.get('/customer-intelligence/metrics');
            return response.data;
        } catch (error) {
            console.warn('Using mock data for metrics');
            return mockData.metrics;
        }
    },

    getEngagementStats: async (segmentId?: string) => {
        try {
            const response = await api.get('/customer-intelligence/engagement', {
                params: { segmentId }
            });
            return response.data;
        } catch (error) {
            console.warn('Using mock data for engagement');
            return mockData.engagement;
        }
    }
};

// Market Analysis API
export const marketAnalysisApi = {
    getMarketInsights: async (data: { industry: string; context: string }) => {
        try {
            const response = await api.post('/openai/test-market-insights', data);
            return response.data;
        } catch (error) {
            console.error('Error fetching market insights:', error);
            throw error;
        }
    },

    getGrowthStrategies: async (data: any) => {
        try {
            const response = await api.post('/openai/test-growth-strategies', data);
            return response.data;
        } catch (error) {
            console.error('Error fetching growth strategies:', error);
            throw error;
        }
    }
};

export { api };
export default api;
