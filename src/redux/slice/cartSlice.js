import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    removeServiceFromCart: (state, action) => {
      state.items = state.items.filter((item, index) => index !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeServiceFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
