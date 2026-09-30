import type { TAuthPayload } from "./authPayload";
import type { TSimpleResult } from "./simpleResult";

export type TSwitchCompanyRequest = {
  companyId: number;
};

export type TSwitchCompanyResponse = TSimpleResult<TAuthPayload>;
