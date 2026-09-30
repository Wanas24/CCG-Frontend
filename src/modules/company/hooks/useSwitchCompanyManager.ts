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

    const activeCompanyId = useAuthStore.getState().user?.companyId ?? null;
    const selected = companies.find((company) => company.id === companyId);

    if (selected?.isDisabled) {
      hint("auth.companyDisabled");
      return false;
    }

    // Only trust the authenticated session companyId. A companies-list
    // `isCurrent` flag can be ahead of the JWT/store (e.g. after create while
    // companyId was null) and must not skip establishSession.
    if (companyId === activeCompanyId) {
      return true;
    }

    const response = await switchCompanyMutate({ companyId });

    if (
      !response.isSuccess ||
      !response.data?.token ||
      !response.data.isAuthenticated
    ) {
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
