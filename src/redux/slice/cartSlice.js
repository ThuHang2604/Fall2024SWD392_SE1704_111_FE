// src/redux/slice/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array to store the selected services
  },
  reducers: {
    addServiceToCart: (state, action) => {
      state.items.push(action.payload); // Add service to cart
    },
    removeServiceFromCart: (state, action) => {
      state.items = state.items.filter((item, index) => index !== action.payload); // Remove by index
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addServiceToCart, removeServiceFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
