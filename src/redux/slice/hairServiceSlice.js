// hairServiceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom'; // Axios instance

// Thunk: Fetch all hair services
export const fetchHairServices = createAsyncThunk('hairService/fetchHairServices', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/hairservice/list');
    return response.data.data; // Return the list of services
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch services');
  }
});

// Thunk: Get details of a specific service by ID
export const fetchServiceById = createAsyncThunk('hairService/fetchServiceById', async (id, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/v1/hairservice/getServices/${id}`);
    return response.data.data; // Return service details
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch service details');
  }
});
export const fetchServiceByName = createAsyncThunk(
  'hairService/fetchServiceByName',
  async (serviceName, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/api/v1/hairservice/${encodeURIComponent(serviceName)}`);
      return response.data; // Return service details
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch service by name');
    }
  },
);
// Slice definition
const hairServiceSlice = createSlice({
  name: 'hairService',
  initialState: {
    services: [],
    selectedService: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchHairServices
      .addCase(fetchHairServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHairServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchHairServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Handle fetchServiceById
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchServiceByName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedService = action.payload;
      })
      .addCase(fetchServiceByName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedService } = hairServiceSlice.actions;
export default hairServiceSlice.reducer;

// export const { clearBookings } = bookingSlice.actions;
// export const { reducer: hairServiceReducer } = hairServiceSlice;
// export default hairServiceReducer;
