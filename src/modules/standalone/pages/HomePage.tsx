import { AppButton } from "@/shared/ANTD_UIComponents";
import { useGetCompanies } from "@/modules/company/api/hooks/useGetCompanies";

const HomePage = () => {
  const { mutate: getCompanies, isPending } = useGetCompanies();

  return (
    <div className="p-6">
      <AppButton
        variant="primary"
        loading={isPending}
        onClick={() => getCompanies()}
      >
        Get Companies
      </AppButton>
    </div>
  );
};

export default HomePage;
