import { createSlice } from "@reduxjs/toolkit";

interface QueueState {
  myCount: number;
  availableCount: number;
}

const initialState: QueueState = {
  myCount: 5,
  availableCount: 12,
};

const queuesSlice = createSlice({
  name: "queues",
  initialState,
  reducers: {
    setMyCount(state, action) {
      state.myCount = action.payload;
    },
    setAvailableCount(state, action) {
      state.availableCount = action.payload;
    },
  },
});

export const { setMyCount, setAvailableCount } = queuesSlice.actions;
export default queuesSlice.reducer;
