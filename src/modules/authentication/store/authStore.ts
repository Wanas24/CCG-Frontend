import { create } from "zustand";
import type { TConfirmationStatus, TUser } from "../types";

export type { TUser };

type TSessionStorePayload = {
  accessToken: string;
  user: TUser;
};

type TAuthStore = {
  accessToken: string | null;
  user: TUser | null;
  confirmationStatus: TConfirmationStatus | null;

  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (payload: TSessionStorePayload) => void;
  logout: () => void;

  setAccessToken: (token: string | null) => void;
  setUser: (user: TUser | null) => void;
  setInitialized: (value: boolean) => void;
  setConfirmationStatus: (status: TConfirmationStatus | null) => void;
};

const initialState = {
  accessToken: null,
  user: null,
  confirmationStatus: null,
  isAuthenticated: false,
  isInitialized: false,
};

export const useAuthStore = create<TAuthStore>((set) => ({
  ...initialState,

  login: ({ accessToken, user }) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isInitialized: true,
    }),

  logout: () =>
    set({
      ...initialState,
      isInitialized: true,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: Boolean(accessToken),
    }),

  setUser: (user) =>
    set({
      user,
    }),

  setInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),

  setConfirmationStatus: (confirmationStatus) =>
    set({
      confirmationStatus,
    }),
}));
