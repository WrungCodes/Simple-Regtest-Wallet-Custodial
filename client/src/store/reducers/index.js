import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../api";

const transaction = createSlice({
  name: "UserSlice",
  initialState: {
    bankId: null,
  },
  reducers: {
    setBankId(state, action) {
      state.bankId = action.payload;
    },
  },
});

const rootReducer = {
  transaction: transaction.reducer,
  [api.reducerPath]: api.reducer,
};

export const { setBankId } = transaction.actions;

export default rootReducer;
