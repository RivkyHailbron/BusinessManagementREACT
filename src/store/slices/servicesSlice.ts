import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ServicesState, Service } from '../../types';
import { servicesAPI } from '../../services/api';

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const services = await servicesAPI.getServices();
      return services;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת השירותים');
    }
  }
);
export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const service = await servicesAPI.getService(id);
      return service;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת השירות');
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (service: Omit<Service, 'id'>, { rejectWithValue }) => {
    try {
      await servicesAPI.createService(service);
      return service;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה ביצירת השירות');
    }
  }
);
export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, service }: { id: string; service: Partial<Service> }, { rejectWithValue }) => {
    try {
      await servicesAPI.updateService(id, service);
      return { id, service };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון השירות');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      await servicesAPI.deleteService(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה במחיקת השירות');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // מקרים קיימים
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // הוספת המקרים עבור fetchServiceById
    .addCase(fetchServiceById.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;
  // הוספה או עדכון של השירות ב-state.services
  const existingIndex = state.services.findIndex(s => s.id === action.payload.id);
  if (existingIndex !== -1) {
    state.services[existingIndex] = action.payload;
  } else {
    state.services.push(action.payload);
  }
})
      
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
