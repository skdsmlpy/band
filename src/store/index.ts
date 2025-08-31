import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/auth";
import tasksReducer from "@/store/slices/tasks";
import queuesReducer from "@/store/slices/queues";
import notificationsReducer from "@/store/slices/notifications";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    queues: queuesReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
