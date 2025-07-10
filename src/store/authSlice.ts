import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, IUser } from './types';
import { RootState } from './store';

const initialState: AuthState = {
  loader: false,
  token: null,
  user: null,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoader: state => {
      state.loader = true;
    },
    stopLoader: state => {
      state.loader = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    resetCredentials: state => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    setError: (state, action: PayloadAction<string | null | unknown>) => {
      state.error = action.payload;
    },
    resetError: state => {
      state.error = null;
    },
  },
});

export default authSlice.reducer;
export const {
  startLoader,
  stopLoader,
  setToken,
  setCredentials,
  resetCredentials,
  setError,
  resetError,
} = authSlice.actions;
export const userAuth = (state: RootState) => state.auth;
