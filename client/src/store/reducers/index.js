import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

const user = createSlice({
  name: "UserSlice",
  initialState: {
    name: "Dan",
  },
  reducers: {
    updateUser(state, action) {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },
});

const rootReducer = {
  user: user.reducer,
  [api.reducerPath]: api.reducer,
};

export const { updateUser } = user.actions;

export default rootReducer;
