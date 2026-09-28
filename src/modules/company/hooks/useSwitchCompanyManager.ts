import { hint } from "@/lib/feedback/hint";
import { establishSession } from "@/modules/authentication/hooks/establishSession";
import { useSwitchCompany } from "@/modules/authentication/api/hooks/useSwitchCompany";
import { useGetAvailableCompanies } from "@/modules/authentication/api/hooks/useGetAvailableCompanies";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { useGetCurrentCompany } from "../api/hooks/useGetCurrentCompany";
import { refreshAfterCompanySwitch } from "../utils/refreshAfterCompanySwitch";

export const useSwitchCompanyManager = () => {
  const { mutateAsync: switchCompanyMutate, isPending } = useSwitchCompany();
  const { data: companiesResponse } = useGetAvailableCompanies();
  const { data: currentCompanyResponse } = useGetCurrentCompany();
  const companies = companiesResponse?.isSuccess
    ? (companiesResponse.data ?? [])
    : [];
  const currentCompanyId = useAuthStore((state) => state.user?.companyId ?? null);
  const currentCompanyDetails = currentCompanyResponse?.isSuccess
    ? currentCompanyResponse.data
    : undefined;

  const currentCompany =
    companies.find((company) => company.isCurrent) ??
    companies.find((company) => company.id === currentCompanyId) ??
    null;

  const currentCompanyLogo =
    currentCompanyDetails && currentCompanyDetails.id === currentCompanyId
      ? currentCompanyDetails.logo
      : null;

  const switchCompany = async (companyId: number) => {
    if (!companyId) {
      hint("auth.noCompany");
      return false;
    }

    const selected = companies.find((company) => company.id === companyId);

    if (selected?.isDisabled) {
      hint("auth.companyDisabled");
      return false;
    }

    if (selected?.isCurrent || companyId === currentCompanyId) {
      return true;
    }

    const response = await switchCompanyMutate({ companyId });

    if (!response.isSuccess || !response.data?.token || !response.data.isAuthenticated) {
      return false;
    }

    establishSession(response.data);
    await refreshAfterCompanySwitch();
    return true;
  };

  return {
    companies,
    currentCompany,
    currentCompanyId,
    currentCompanyLogo,
    isSwitching: isPending,
    switchCompany,
  };
};
