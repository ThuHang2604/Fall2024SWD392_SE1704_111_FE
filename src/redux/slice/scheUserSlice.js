import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosCustom'; // Replace with your custom axios instance

// Thunks for API endpoints
export const getAllStylistSchedules = createAsyncThunk(
  'schedule/getAllStylistSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/users/getAllStylistSchedules');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch all stylist schedules');
    }
  },
);

export const getCurrentStylistSchedules = createAsyncThunk(
  'schedule/getCurrentStylistSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/users/currentStylistSchedules');
      return response.data; // Return the entire response, including "data" array
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch current stylist schedules');
    }
  },
);

export const createScheduleUser = createAsyncThunk(
  'schedule/createScheduleUser',
  async (scheduleData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/v1/users/createScheduleUser', scheduleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create schedule user');
    }
  },
);

export const getStylistSchedule = createAsyncThunk('schedule/getStylistSchedule', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/users/StylistSchedule');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch stylist schedule');
  }
});

export const getStylistByDate = createAsyncThunk('schedule/getStylistByDate', async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/api/v1/users/StylistByDate', {
      startDate: data.startDate,
      startTime: data.startTime,
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch stylist by date');
  }
});

export const getScheduleOfNoStylist = createAsyncThunk(
  'schedule/getScheduleOfNoStylist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/users/ScheduleOfNoStylist');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch schedules of no stylist');
    }
  },
);

export const assignStylistToSchedule = createAsyncThunk(
  'schedule/assignStylistToSchedule',
  async ({ scheduleId, bookingID }, { rejectWithValue }) => {
    try {
      // Correct URL and params usage
      const response = await axiosInstance.put(
        `/api/v1/users/AssignStylistToSchedule/${scheduleId}`,
        {}, // Pass an empty object if the body is not required
        {
          params: { bookingID }, // Pass bookingID as a query parameter
        },
      );
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to assign stylist to schedule');
    }
  },
);
export const updateScheduleUserByUserId = createAsyncThunk(
  'schedule/updateScheduleUserByUserId',
  async ({ scheduleUserId, stylistId, bookingId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put('/api/v1/users/updateScheduleUserByUserId', {
        scheduleUserId,
        stylistId,
        bookingId,
      });

      // Nếu response báo thành công
      if (response.data?.status === 1) {
        return response.data;
      }

      // Nếu API trả về lỗi dù đã thành công
      return rejectWithValue(response.data);
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to update schedule user');
    }
  },
);

// Slice
const scheduleUserSlice = createSlice({
  name: 'scheduleUser',
  initialState: {
    stylistSchedules: [],
    currentStylistSchedule: null,
    createdSchedule: null,
    stylistSchedule: null,
    stylistByDate: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAllStylistSchedules
      .addCase(getAllStylistSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllStylistSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stylistSchedules = action.payload;
      })
      .addCase(getAllStylistSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // getCurrentStylistSchedules
      .addCase(getCurrentStylistSchedules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentStylistSchedules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStylistSchedule = action.payload;
      })
      .addCase(getCurrentStylistSchedules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // createScheduleUser
      .addCase(createScheduleUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createScheduleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdSchedule = action.payload;
      })
      .addCase(createScheduleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // getStylistSchedule
      .addCase(getStylistSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStylistSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stylistSchedule = action.payload;
      })
      .addCase(getStylistSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // getStylistByDate
      .addCase(getStylistByDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStylistByDate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stylistByDate = action.payload;
      })
      .addCase(getStylistByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getScheduleOfNoStylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getScheduleOfNoStylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scheduleOfNoStylist = action.payload;
      })
      .addCase(getScheduleOfNoStylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(assignStylistToSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignStylistToSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(assignStylistToSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateScheduleUserByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateScheduleUserByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Schedule updated successfully', action.payload);
      })
      .addCase(updateScheduleUserByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default scheduleUserSlice.reducer;
