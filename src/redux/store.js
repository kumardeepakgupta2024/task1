import { configureStore } from '@reduxjs/toolkit';
import { clusterApi } from './apiSlice';

export const store = configureStore({
  reducer: {
    [clusterApi.reducerPath]: clusterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clusterApi.middleware),
});
