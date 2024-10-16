import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';
import { setUserAuthToken } from '../authServices';
import { jwtDecode } from 'jwt-decode';

// Existing login, logout, and register thunks
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await instance.post('api/v1/users/Login', {
      username: credentials.username,
      password: credentials.password,
    });
    const { data: token } = response;
    console.log('data token:', token);
    return token;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    setUserAuthToken(null);
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Logout failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (userDetails, { rejectWithValue }) => {
  try {
    const response = await instance.post('api/v1/users/Register', {
      username: userDetails.username,
      password: userDetails.password,
      phone: userDetails.phone,
    });
    const { data } = response;
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});

export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth; // Lấy token từ state auth
    if (!token) throw new Error('No token found');

    const response = await instance.get('/api/v1/userprofile/current', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data; // Trả về data nếu thành công
    } else {
      throw new Error('Data field is missing in the API response');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
  }
});

export const updateCurrentProfile = createAsyncThunk(
  'auth/updateCurrentProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await instance.post('/api/v1/userprofile/updateCurrentProfile', profileData);
      const { data } = response;
      console.log('data update:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Update profile failed');
    }
  },
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      setUserAuthToken(null);
    },
    setUser: (state, action) => {
      const decodedUser = jwtDecode(action.payload);
      state.user = { role: decodedUser.role };
      state.token = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const token = action.payload;
        const decodedUser = jwtDecode(token);
        state.user = { role: decodedUser.role };
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;
        setUserAuthToken(token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout user cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch user profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Assuming the API returns the user profile as the payload
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Cập nhật thông tin người dùng
        state.error = null;
      })
      .addCase(updateCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
const {
  actions: { logout, setUser },
  reducer: authReducer,
} = authSlice;

export { authReducer as default, setUser };
