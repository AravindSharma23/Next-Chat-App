import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import chatReducer from "./features/chatSlice";
import locationReducer from "./features/locationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;