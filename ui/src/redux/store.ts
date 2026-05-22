import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/AuthenticationSlice";

import phoneReducer from "./features/phones/PhoneSlice";
import laptopReducer from "./features/laptops/LaptopSlice";

export const store = configureStore({
  reducer: {

    auth: authReducer,

    phones: phoneReducer,

    laptops: laptopReducer,

  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;
