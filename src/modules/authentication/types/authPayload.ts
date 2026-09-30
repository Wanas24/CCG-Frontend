import type { TUser } from "./user";

export type TAuthPayload = {
  isSuccess: boolean;
  token: string;
  expiresOn: string;
  message: string;
  isAuthenticated: boolean;
  rememberMe: boolean;
} & TUser;
