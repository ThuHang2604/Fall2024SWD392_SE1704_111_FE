// bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom'; // Sử dụng axios instance

// Thunk: Tạo booking mới qua API
export const createBooking = createAsyncThunk('booking/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const response = await instance.post('/api/v1/booking/createBooking', bookingData);
    console.log('Booking Created:', response.data);

    // if (response.data.status !== 1) {
    //   throw new Error(response.data.message || 'Booking failed.');
    // }

    return response.data.data; // Trả về dữ liệu booking
  } catch (error) {
    console.error('Error creating booking:', error);
    return rejectWithValue(error.response?.data || 'Failed to create booking.');
  }
});

// Thunk: Lấy lịch sử booking qua API
export const getBookingHistory = createAsyncThunk('userProfile/getBookingHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/booking/history');
    console.log('Booking history response:', response.data);

    if (response.data && response.data.data) {
      return response.data.data; // Return booking data if successful
    } else {
      throw new Error('No booking history found');
    }
  } catch (error) {
    console.error('Error fetching booking history:', {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
    });
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch booking history');
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
