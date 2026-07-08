import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string | null;
  email: string | null;
  role: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  name: null,
  email: null,
  role: null,
  isLoading: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name?: string; email: string; role?: string }>) => {
      state.name = action.payload.name || null;
      state.email = action.payload.email;
      state.role = action.payload.role || "user";
      state.isLoggedIn = true;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearUser: (state) => {
      state.name = null;
      state.email = null;
      state.role = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;
