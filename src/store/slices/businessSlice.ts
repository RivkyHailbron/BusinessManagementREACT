import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BusinessState, Business } from '../../types';
import { businessAPI } from '../../services/api';

const initialState: BusinessState = {
  business: null,
  loading: false,
  error: null,
};

export const fetchBusiness = createAsyncThunk(
  'business/fetchBusiness',
  async (_, { rejectWithValue }) => {
    try {
      const business = await businessAPI.getBusiness();
      return business;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת פרטי העסק');
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, business }: { id: string; business: Partial<Business> }, { rejectWithValue }) => {
    try {
      await businessAPI.updateBusiness(id, business);
      return business;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בעדכון פרטי העסק');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.business = action.payload;
        state.error = null;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        if (state.business) {
          state.business = { ...state.business, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer;