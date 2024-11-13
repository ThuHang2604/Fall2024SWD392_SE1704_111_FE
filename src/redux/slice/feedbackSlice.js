import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';

// Thunk: Tạo feedback mới
export const createFeedback = createAsyncThunk('feedback/createFeedback', async (feedbackData, { rejectWithValue }) => {
  try {
    const response = await instance.post('/api/v1/feedbacks/createFeedback', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error creating feedback:', error);
    return rejectWithValue(error.response?.data || 'Failed to create feedback');
  }
});

// Thunk: Cập nhật feedback
export const updateFeedback = createAsyncThunk(
  'feedback/updateFeedback',
  async ({ feedbackId, feedbackData }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/api/v1/feedbacks/updateFeedback/${feedbackId}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error updating feedback:', error);
      return rejectWithValue(error.response?.data || 'Failed to update feedback');
    }
  },
);

// Thunk: Lấy danh sách feedback
export const getFeedbackList = createAsyncThunk('feedback/getFeedbackList', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/feedbacks/feedbackList');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching feedback list:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch feedback list');
  }
});

// Thunk: Lấy feedback theo ID
export const getFeedbackById = createAsyncThunk('feedback/getFeedbackById', async (feedbackId, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/v1/feedbacks/GetFeedbackById/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch feedback');
  }
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    feedbackDetail: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateFeedback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.feedbacks.findIndex((feedback) => feedback.feedbackId === action.payload.feedbackId);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getFeedbackList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedbackList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbackList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getFeedbackById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedbackById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbackDetail = action.payload;
      })
      .addCase(getFeedbackById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;
