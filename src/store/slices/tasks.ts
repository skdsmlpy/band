import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

export type TaskStatus = "new" | "in_progress" | "peer_review" | "awaiting_approval" | "completed" | "escalated";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  assigneeId?: string;
}

interface TasksState {
  items: Task[];
}

const initialState: TasksState = {
  items: [
    { id: nanoid(), title: "Verify student eligibility", status: "new", priority: "high" },
    { id: nanoid(), title: "Scan equipment QR", status: "in_progress", priority: "medium" },
  ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      state.items.push({ id: nanoid(), ...action.payload });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
