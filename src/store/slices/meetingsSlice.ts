import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MeetingsState, Meeting } from '../../types';
import { meetingsAPI } from '../../services/api';

const initialState: MeetingsState = {
  meetings: [],
  loading: false,
  error: null,
};

export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (_, { rejectWithValue }) => {
    try {
      const meetings = await meetingsAPI.getMeetings();
      return meetings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה בטעינת הפגישות');
    }
  }
);

export const createMeeting = createAsyncThunk(
  'meetings/createMeeting',
  async (meeting: Omit<Meeting, 'id' | 'status'>, { rejectWithValue }) => {
    try {
      await meetingsAPI.createMeeting(meeting);
      return meeting;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה ביצירת הפגישה');
    }
  }
);

export const deleteMeeting = createAsyncThunk(
  'meetings/deleteMeeting',
  async (id: string, { rejectWithValue }) => {
    try {
      await meetingsAPI.deleteMeeting(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'שגיאה במחיקת הפגישה');
    }
  }
);

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = action.payload.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        state.error = null;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        // Note: In real app, the meeting would have an ID from the server
        const newMeeting = { 
          ...action.payload, 
          id: Date.now().toString(),
          status: 'confirmed' as const
        };
        state.meetings.push(newMeeting);
        state.error = null;
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetings = state.meetings.filter(meeting => meeting.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = meetingsSlice.actions;
export default meetingsSlice.reducer;