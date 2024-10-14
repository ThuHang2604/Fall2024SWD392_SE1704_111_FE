import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';
import { setUserAuthToken } from '../authServices';
import { jwtDecode } from 'jwt-decode';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await instance.post('api/v1/users/Login', {
      username: credentials.username,
      password: credentials.password,
    });
    const { data: token } = response; // API chỉ trả về token
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

// Khởi tạo slice
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const token = action.payload;

        // Decode token để lấy thông tin người dùng
        const decodedUser = jwtDecode(token);

        state.user = {
          role: decodedUser.role,
        };
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;

        // Lưu token vào localStorage hoặc header
        setUserAuthToken(token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
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

    builder
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
      });
  },
});

const {
  actions: { logout },
  reducer: authReducer,
} = authSlice;

export { authReducer as default };
