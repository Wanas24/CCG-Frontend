import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TCompany,
  TCreateCompanyRequest,
  TUpdateCompanyRequest,
  TUserCompany,
} from "./company";

export type { TCreateCompanyRequest, TUpdateCompanyRequest };

export type TGetCurrentCompanyResponse = TSimpleResult<TCompany>;

export type TGetAvailableCompaniesResponse = TSimpleResult<TUserCompany[]>;

export type TCreateCompanyResponse = TSimpleResult<number>;

export type TUpdateCompanyResponse = TSimpleResult<boolean>;

export type TDeleteCompanyResponse = TSimpleResult<boolean>;

export type TCompanyLogoResponse = TSimpleResult<string>;

export type TDeleteCompanyLogoResponse = TSimpleResult;
