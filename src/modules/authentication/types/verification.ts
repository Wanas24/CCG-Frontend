import type { TSimpleResult } from "./simpleResult";

export type TConfirmationStatus = {
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
};

export type TConfirmationStatusResponse = TSimpleResult<TConfirmationStatus>;

export type TSendEmailConfirmationPayload = {
  email: string;
};

export type TConfirmEmailParams = {
  userId: string;
  token: string;
};

export const isAccountVerified = (
  status: TConfirmationStatus | null | undefined,
): boolean =>
  Boolean(status?.emailConfirmed && status?.phoneNumberConfirmed);
