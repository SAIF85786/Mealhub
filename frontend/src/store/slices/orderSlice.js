import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    cart: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      if (state.cart[itemId]) {
        state.cart[itemId] += 1;
      } else {
        state.cart[itemId] = 1;
      }
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      if (state.cart[itemId] > 1) {
        state.cart[itemId] -= 1;
      } else {
        delete state.cart[itemId]; // Remove item if quantity is 0
      }
    },
  },
});

export const { addToCart, removeFromCart } = orderSlice.actions;
export default orderSlice.reducer;
