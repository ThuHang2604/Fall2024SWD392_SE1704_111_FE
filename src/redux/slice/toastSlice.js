// src/redux/slice/toastSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const toastSlice = createSlice({
  name: 'toast',
  initialState: {},
  reducers: {
    showToast: (_, action) => {
      const { type, message } = action.payload;

      switch (type) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'info':
          toast.info(message);
          break;
        default:
          toast(message);
      }
    },
  },
});

export const { showToast } = toastSlice.actions;
export default toastSlice.reducer;
