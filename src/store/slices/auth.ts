import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "Admin" | "Supervisor" | "Operator" | "Student" | "Band Director" | "Equipment Manager";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string; user: NonNullable<AuthState["user"]> }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
