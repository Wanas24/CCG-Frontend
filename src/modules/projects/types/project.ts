import type { TSimpleResult } from "@/modules/authentication/types";
import type {
  TApiPagedResult,
  TPagedQueryParams,
} from "@/modules/userControl/types";

export type TProject = {
  id: number;
  name: string;
  number?: string | null;
  officialName?: string | null;
  clientId?: number | null;
  clientName?: string | null;
  status?: number | null;
  approvalStatus?: number | null;
  projectType?: number | null;
  isActive?: boolean | null;
  notes?: string | null;
  taxIncluded?: boolean | null;
  hasDemolisionLicence?: boolean | null;
  hasCivilDefenseLicence?: boolean | null;
  country?: string | null;
  city?: string | null;
  district?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  landmark?: string | null;
  locationNotes?: string | null;
  hasLocation?: boolean | null;
  canApprove?: boolean | null;
};

export type TGetProjectsParams = TPagedQueryParams & {
  id?: number;
  status?: number | "";
  approvalStatus?: number | "";
  projectType?: number | "";
  isActive?: boolean | "";
  clientId?: number | "";
};

export type TProjectWriteBody = {
  name: string;
  number?: string | null;
  officialName?: string | null;
  clientId: number;
  projectType: number;
  status: number;
  notes?: string | null;
  taxIncluded: boolean;
  hasDemolisionLicence: boolean;
  hasCivilDefenseLicence: boolean;
  country?: string | null;
  city?: string | null;
  district?: string | null;
  street?: string | null;
  buildingNumber?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  landmark?: string | null;
  locationNotes?: string | null;
};

export type TCreateProjectRequest = TProjectWriteBody;

export type TUpdateProjectRequest = TProjectWriteBody & {
  id: number;
  isActive: boolean;
};

export type TGetProjectsResponse = TSimpleResult<TApiPagedResult<TProject>>;

export type TCreateProjectResponse = TSimpleResult<number>;

export type TUpdateProjectResponse = TSimpleResult;

export type TDeleteProjectResponse = TSimpleResult;

export type TProjectExportResult =
  | { ok: true; blob: Blob; fileName: string }
  | { ok: false; message: string };
