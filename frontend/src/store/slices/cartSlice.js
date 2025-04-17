import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {}, // Stores item _id as key and quantity as value
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload;
      state.cart[itemId] = (state.cart[itemId] || 0) + 1;
      console.log(state.cart[itemId]);
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
    clearCart: (state) => {
      state.cart = {};
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
