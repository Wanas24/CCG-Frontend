import type { TSimpleResult } from "@/modules/authentication/types";
import type { TApiPagedResult } from "@/modules/userControl/types";

export type TClient = {
  id: number;
  name: string | null;
  notes: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  contactPerson: string | null;
  taxNumber: string | null;
  projectsCount: number;
  addedBy: string;
  addedAt: string;
  updatedBy: string;
  updatedAt: string;
};

export type TGetClientsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  id?: number;
};

export type TGetClientsResponse = TSimpleResult<TApiPagedResult<TClient>>;

export type TAddClientCommand = {
  name: string | null;
  notes: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  contactPerson: string | null;
  taxNumber: string | null;
};

export type TCreateClientRequest = TAddClientCommand;

export type TCreateClientResponse = TSimpleResult<number>;

export type TEditClientCommand = {
  id: number;
  name: string | null;
  notes: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  contactPerson: string | null;
  taxNumber: string | null;
};

export type TUpdateClientRequest = TEditClientCommand;

export type TUpdateClientResponse = TSimpleResult;

export type TDeleteClientResponse = TSimpleResult;
