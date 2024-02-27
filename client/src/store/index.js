import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { api } from "../api";

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    user: {
      name: "Dan",
    },
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
