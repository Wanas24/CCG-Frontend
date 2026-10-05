import { callEndpoint } from "@/lib/api/callEndpoint";
import { companyEndpoints } from "../endPoints/company.endpoints";
import type {
  TCompanyLogoResponse,
  TCreateCompanyRequest,
  TCreateCompanyResponse,
  TDeleteCompanyLogoResponse,
  TDeleteCompanyResponse,
  TGetCurrentCompanyResponse,
  TUpdateCompanyRequest,
  TUpdateCompanyResponse,
} from "../../types";

export const companyService = {
  getCurrent: () =>
    callEndpoint<TGetCurrentCompanyResponse>(companyEndpoints.getCurrent),
  create: (body: TCreateCompanyRequest) =>
    callEndpoint<TCreateCompanyResponse, TCreateCompanyRequest>(
      companyEndpoints.create,
      { body },
    ),
  update: (body: TUpdateCompanyRequest) =>
    callEndpoint<TUpdateCompanyResponse, TUpdateCompanyRequest>(
      companyEndpoints.update,
      { body },
    ),
  delete: () => callEndpoint<TDeleteCompanyResponse>(companyEndpoints.delete),
  uploadLogo: (file: File) => {
    const body = new FormData();
    body.append("File", file);

    return callEndpoint<TCompanyLogoResponse, FormData>(
      companyEndpoints.uploadLogo,
      { body },
    );
  },
  deleteLogo: () =>
    callEndpoint<TDeleteCompanyLogoResponse>(companyEndpoints.deleteLogo),
};
