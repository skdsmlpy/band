import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
}

interface NotificationState {
  items: NotificationItem[];
}

const initialState: NotificationState = {
  items: [
    { id: nanoid(), message: "Task assigned to you", read: false },
    { id: nanoid(), message: "Peer review requested", read: true },
  ],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<string>) => {
      state.items.unshift({ id: nanoid(), message: action.payload, read: false });
    },
    markRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.read = true;
    },
    markAllRead: (state) => {
      state.items.forEach((i) => (i.read = true));
    },
  },
});

export const { addNotification, markRead, markAllRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
