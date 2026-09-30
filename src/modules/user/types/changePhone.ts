import type { TSimpleResult } from "@/modules/authentication/types";

export type TChangePhoneRequest = {
  phoneNumber: string;
};

export type TChangePhoneResponse = TSimpleResult<string>;
