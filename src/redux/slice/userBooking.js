// bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom'; // Sử dụng axios instance

// Thunk: Tạo booking mới qua API
export const createBooking = createAsyncThunk('booking/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const response = await instance.post('/api/v1/booking/createBooking', bookingData);
    console.log('Booking Created:', response.data);

    // Ensure response structure is as expected
    if (response.data && response.data.status === 1 && response.data.data) {
      return response.data.data; // Trả về dữ liệu booking
    } else {
      throw new Error(response.data.message || 'Booking creation failed due to an unexpected response structure.');
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    // Enhanced error handling to account for various types of errors
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create booking due to a network or server error.',
    );
  }
});

// Thunk: Lấy lịch sử booking qua API
export const getBookingHistory = createAsyncThunk('booking/getBookingHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/booking/history');
    console.log('Booking history:', response.data);
    return response.data.data; // Trả về danh sách lịch sử booking
  } catch (error) {
    console.error('Error fetching booking history:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch booking history');
  }
});

// Slice cho Booking
const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearBookings: (state) => {
      state.bookings = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý createBooking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload); // Lưu booking mới vào state
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Xử lý getBookingHistory
      .addCase(getBookingHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload; // Lưu lịch sử booking
      })
      .addCase(getBookingHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions và reducer
export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
