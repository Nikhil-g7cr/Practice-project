import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/AuthenticationSlice";

import phoneReducer from "./features/phones/PhoneSlice";

export const store = configureStore({
  reducer: {

    auth: authReducer,

    phones: phoneReducer,

  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;