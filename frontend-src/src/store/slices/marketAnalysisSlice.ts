import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MarketAnalysisState, MarketAnalysisParams } from '../../types';

const initialState: MarketAnalysisState = {
    insights: null,
    trends: [],
    marketSize: null,
    loading: false,
    error: null,
};

export const fetchMarketInsights = createAsyncThunk(
    'marketAnalysis/fetchInsights',
    async (params: MarketAnalysisParams) => {
        const response = await axios.post('/api/market-analysis', params);
        return response.data;
    }
);

export const fetchMarketTrends = createAsyncThunk(
    'marketAnalysis/fetchTrends',
    async (data: { industry: string; location: string }) => {
        const response = await axios.get(`/api/v1/market-analysis/trends/${data.industry}?location=${data.location}`);
        return response.data;
    }
);

export const predictMarketSize = createAsyncThunk(
    'marketAnalysis/predictSize',
    async (data: { industry: string; location: string; timeframe: string }) => {
        const response = await axios.post('/api/v1/market-analysis/market-size', data);
        return response.data;
    }
);

const marketAnalysisSlice = createSlice({
    name: 'marketAnalysis',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Market Insights
            .addCase(fetchMarketInsights.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarketInsights.fulfilled, (state, action) => {
                state.loading = false;
                state.insights = action.payload;
            })
            .addCase(fetchMarketInsights.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch market insights';
            })
            // Market Trends
            .addCase(fetchMarketTrends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarketTrends.fulfilled, (state, action) => {
                state.loading = false;
                state.trends = action.payload;
            })
            .addCase(fetchMarketTrends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch market trends';
            })
            // Market Size Prediction
            .addCase(predictMarketSize.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(predictMarketSize.fulfilled, (state, action) => {
                state.loading = false;
                state.marketSize = action.payload;
            })
            .addCase(predictMarketSize.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to predict market size';
            });
    },
});

export default marketAnalysisSlice.reducer;
