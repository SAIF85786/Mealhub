import { configureStore, isRejected } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";

const userTransform = createTransform(
  // Exclude `message` when persisting
  (inboundState, key) => {
    if (key === "message") return "";
    return inboundState;
  }
);

export const userPersistConfig = {
  key: "user",
  transforms: [userTransform],
  storage,
};

const persistUserReducer = persistReducer(userPersistConfig, userSlice);

export const store = configureStore({
  reducer: {
    user: persistUserReducer,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
