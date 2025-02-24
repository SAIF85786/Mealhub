import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {}, // Stores item _id as key and quantity as value
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      state.cart[itemId] = (state.cart[itemId] || 0) + 1;
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;

      // If a second argument is passed as true, remove item completely
      if (typeof action.payload === "object" && action.payload.removeAll) {
        delete state.cart[action.payload.itemId];
      } else {
        if (state.cart[itemId] > 1) {
          state.cart[itemId] -= 1;
        } else {
          delete state.cart[itemId];
        }
      }
    },
  },
});

export const { addToCart, removeFromCart } = orderSlice.actions;
export default orderSlice.reducer;
