import type { TAuthPayload } from "./authPayload";
import type { TSimpleResult } from "./simpleResult";

export type TRegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  fullAddress: string;
  extraPhone: string;
  nationalId: string;
  dateOfBirth: string;
};

export type TRegisterResponse = TSimpleResult<TAuthPayload>;
