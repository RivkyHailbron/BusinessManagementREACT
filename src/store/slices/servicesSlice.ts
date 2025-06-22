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
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        // Note: In real app, the service would have an ID from the server
        const newService = { ...action.payload, id: Date.now().toString() };
        state.services.push(newService);
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(service => service.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;