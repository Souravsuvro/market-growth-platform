import { configureStore } from '@reduxjs/toolkit';
import marketAnalysisReducer from './slices/marketAnalysisSlice';

export const store = configureStore({
    reducer: {
        marketAnalysis: marketAnalysisReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
