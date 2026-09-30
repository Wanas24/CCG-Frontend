import type { TAuthPayload } from "./authPayload";
import type { TSimpleResult } from "./simpleResult";

export type TLoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type TLoginResponse = TSimpleResult<TAuthPayload>;
