import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    pendingCount: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.pendingCount += 1;
    },
    stopLoading: (state) => {
      state.pendingCount = Math.max(0, state.pendingCount - 1);
    },
    resetLoading: (state) => {
      state.pendingCount = 0;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
