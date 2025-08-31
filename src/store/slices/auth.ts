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

// Check for persisted token on initialization
const getInitialToken = () => {
  if (typeof window === 'undefined') return null;
  
  // Check cookie for token
  const tokenMatch = document.cookie.match(/token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
};

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage for user data
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: getInitialToken(),
  refreshToken: null,
  user: getInitialUser(),
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
      
      // Persist user data to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      
      // Clear persisted data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        document.cookie = 'token=; Max-Age=0; path=/';
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
