export type TCompany = {
  id: number;
  name: string;
  description: string;
  logo: string | null;
  address: string;
  timeZoneId: string;
};

export type TUserCompany = {
  id: number;
  name: string;
  isDisabled: boolean;
  isManager: boolean;
  isCurrent: boolean;
};

export type TCreateCompanyRequest = {
  name: string;
  description: string;
  address: string;
  timeZoneId: string;
};

export type TUpdateCompanyRequest = {
  name: string;
  description: string;
  address: string;
  timeZoneId: string;
};
