import { configureStore, isRejected } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";

const userPersistConfig = {
  key: "user",
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
