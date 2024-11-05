import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';
import { setUserAuthToken } from '../authServices';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Thunk: Login user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await instance.post('/api/v1/users/Login', {
      username: credentials.username,
      password: credentials.password,
    });

    const { data: token } = response;
    console.log('Token:', token);

    // Lưu token vào cookie
    Cookies.set('authToken', token, { expires: 1 });

    return token;
  } catch (error) {
    console.error('Login error:', error);
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Thunk: Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    setUserAuthToken(null);
    Cookies.remove('authToken');
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Logout failed');
  }
});

// Thunk: Register user
// Thunk: Register user
export const registerUser = createAsyncThunk('auth/registerUser', async (userDetails, { rejectWithValue }) => {
  try {
    const response = await instance.post('/api/v1/users/Register', {
      userName: userDetails.userName,
      password: userDetails.password,
      phone: userDetails.phone,
      fullName: userDetails.fullName,
      email: userDetails.email,
      gender: userDetails.gender,
      address: userDetails.address,
      dateOfBirth: userDetails.dateOfBirth,
    });
    console.log('Register :', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.log('Full error response:', error.response); // Log full response
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      Cookies.remove('authToken');
    },
    setUser: (state, action) => {
      state.user = action.payload;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
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
      });
  },
});

// Export actions and reducer
const { actions, reducer } = authSlice;
export const { logout, setUser } = actions;
export default reducer;
