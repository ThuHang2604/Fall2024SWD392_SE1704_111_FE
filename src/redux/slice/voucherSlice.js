// src/redux/slice/voucherSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import instance from '../axiosCustom';

// Thunk to get the list of all vouchers
export const getVoucherList = createAsyncThunk('voucher/getVoucherList', async (_, { rejectWithValue }) => {
  try {
    const response = await instance.get('/api/v1/voucher/listVoucher');
    console.log('Voucher List Response:', response.data);
    return response.data.data; // Accessing the 'data' field that contains the vouchers
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch vouchers');
  }
});
// Thunk to get a voucher by ID
export const getVoucherById = createAsyncThunk('voucher/getVoucherById', async (voucherId, { rejectWithValue }) => {
  try {
    const response = await instance.get(`/api/v1/voucher/GetVoucherById/${voucherId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch voucher by ID.');
  }
});

// Thunk to get a paginated list of vouchers
export const getPagingVoucherList = createAsyncThunk(
  'voucher/getPagingVoucherList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.get('/api/v1/voucher/PagingVoucherList', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch paginated voucher list.');
    }
  },
);

// Voucher slice
const voucherSlice = createSlice({
  name: 'voucher',
  initialState: {
    vouchers: [],
    currentVoucher: null,
    paginatedVouchers: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Voucher List
      .addCase(getVoucherList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVoucherList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vouchers = action.payload;
      })
      .addCase(getVoucherList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Voucher by ID
      .addCase(getVoucherById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVoucherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVoucher = action.payload;
      })
      .addCase(getVoucherById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Paginated Voucher List
      .addCase(getPagingVoucherList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPagingVoucherList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paginatedVouchers = action.payload;
      })
      .addCase(getPagingVoucherList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export reducer
export const { reducer: voucherReducer } = voucherSlice;
export default voucherReducer;
