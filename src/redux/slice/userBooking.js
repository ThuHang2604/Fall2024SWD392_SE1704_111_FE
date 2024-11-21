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
// Thunk: Get bookings of a stylist via API
export const getBookingsOfStylist = createAsyncThunk('booking/getBookingsOfStylist', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/booking/bookingOfStylist');
    console.log('Response from API:', response.data); // Add this log
    return response.data.data; // Return only the data array
  } catch (error) {
    console.error('Error fetching bookings of stylist:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch bookings of stylist');
  }
});
// Thunk: Fetch bookings with no stylist via API
export const getBookingsNoStylist = createAsyncThunk('booking/getBookingsNoStylist', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/booking/bookings/NoStylist');
    return response.data.data; // Assuming "schedules" is the array in the API response
  } catch (error) {
    console.error('Error fetching bookings with no stylist:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch bookings with no stylist');
  }
});
export const getAllBookings = createAsyncThunk('booking/getAllBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/booking/bookingList'); // Adjust the endpoint to match the screenshot
    console.log('All bookings:', response.data); // Log response for debugging
    return response.data.data; // Assuming 'data' contains the bookings array
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return rejectWithValue(error.response?.data || 'Failed to fetch all bookings');
  }
});

// Slice cho Booking
const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    bookingsNoStylist: [], // Add a separate field for "No Stylist" bookings
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
      })
      .addCase(getBookingsOfStylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingsOfStylist.fulfilled, (state, action) => {
        // console.log('Fulfilled action payload:', action.payload);
        state.isLoading = false;
        state.bookings = action.payload || []; // Update bookings with fetched data
      })
      .addCase(getBookingsOfStylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getBookingsNoStylist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingsNoStylist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookingsNoStylist = action.payload || []; // Save "No Stylist" bookings to state
      })
      .addCase(getBookingsNoStylist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload || []; // Update state with fetched bookings
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions và reducer
export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
