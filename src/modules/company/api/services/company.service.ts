import { callEndpoint } from "@/lib/api/callEndpoint";
import { companyEndpoints } from "../endPoints/company.endpoints";

export const companyService = {
  getCompanies: () => callEndpoint<unknown>(companyEndpoints.getCompanies),
};
