import { create } from "zustand";

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userType: "User" | "Admin";
  companyId: number | null;
  isManager: boolean;
  isActive: boolean;
  language: "en" | "ar";
  theme: "light" | "dark" | "system";
};

type TLoginPayload = {
  accessToken: string;
  user: TUser;
};

type TAuthStore = {
  accessToken: string | null;
  user: TUser | null;

  isAuthenticated: boolean;
  isInitialized: boolean;

  login: (payload: TLoginPayload) => void;
  logout: () => void;

  setAccessToken: (token: string | null) => void;
  setUser: (user: TUser | null) => void;
  setInitialized: (value: boolean) => void;
};

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: true,
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
}));
