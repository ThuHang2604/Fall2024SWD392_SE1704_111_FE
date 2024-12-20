// scheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosCustom'; // Replace with your axios instance

// Thunk for fetching all schedules
export const fetchScheduleList = createAsyncThunk('schedule/fetchScheduleList', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/schedule/scheduleList');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data || 'Failed to fetch schedule list');
  }
});

// Thunk for fetching a schedule by ID
export const fetchScheduleById = createAsyncThunk(
  'schedule/fetchScheduleById',
  async (scheduleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/schedule/GetScheduleById/${scheduleId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to fetch schedule by ID');
    }
  },
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    scheduleList: [],
    selectedSchedule: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchScheduleList
    builder
      .addCase(fetchScheduleList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scheduleList = action.payload;
      })
      .addCase(fetchScheduleList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Handle fetchScheduleById
    builder
      .addCase(fetchScheduleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSchedule = action.payload;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default scheduleSlice.reducer;
