import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';
import Cookies from 'js-cookie';

// Thunk: Lấy thông tin người dùng hiện tại từ API /current
export const getUserProfileCurrent = createAsyncThunk(
  'userProfile/getUserProfileCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get('/api/v1/userprofile/current');
      console.log('User profile response:', response.data);

      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
    }
  },
);

// Thunk: Lấy thông tin người dùng theo ID từ API /{id}
export const getUserProfileById = createAsyncThunk(
  'userProfile/getUserProfileById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/api/v1/userprofile/${id}`);
      console.log('User profile by ID response:', response.data);

      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error fetching user profile by ID:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
    }
  },
);

// Thunk: Cập nhật thông tin người dùng hiện tại thông qua API /updateCurrentProfile
export const updateCurrentProfile = createAsyncThunk(
  'userProfile/updateCurrentProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/v1/userprofile/updateCurrentProfile', profileData);
      console.log('Update profile response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  },
);

// Slice mới cho userProfile
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      Cookies.remove('authToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Current User Profile
      .addCase(getUserProfileCurrent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileCurrent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfileCurrent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get User Profile By ID
      .addCase(getUserProfileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfileById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Current User Profile
      .addCase(updateCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions và reducer
export const { setUser, clearUser } = userProfileSlice.actions;
export default userProfileSlice.reducer;
