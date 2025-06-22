import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice';
import servicesReducer from './slices/servicesSlice';
import meetingsReducer from './slices/meetingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    services: servicesReducer,
    meetings: meetingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;