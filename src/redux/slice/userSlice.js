import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosCustom'; // Custom Axios instance for API requests

// Async thunk to fetch user list
export const fetchUserList = createAsyncThunk('users/fetchUserList', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/v1/users/usersList');
    return response.data; // The response body from the API
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch user list');
  }
});

// Initial state
const initialState = {
  users: [], // To store the user list
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // To store any error messages
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data || []; // Assuming API response has a "data" field
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      });
  },
});

// Export reducer
export default userSlice.reducer;
