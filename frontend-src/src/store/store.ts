import { configureStore } from '@reduxjs/toolkit';
import marketAnalysisReducer from './slices/marketAnalysisSlice';

const store = configureStore({
    reducer: {
        marketAnalysis: marketAnalysisReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
