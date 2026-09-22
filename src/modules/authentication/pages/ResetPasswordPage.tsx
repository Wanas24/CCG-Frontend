import { useSearchParams } from "react-router";
import ResetPasswordForm from "@/modules/authentication/components/ResetPasswordForm";
import ResetPasswordMissingParams from "@/modules/authentication/components/ResetPasswordMissingParams";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  if (!userId || !token) {
    return (
      <ResetPasswordMissingParams />
    );
  }

  return (
    <ResetPasswordForm userId={userId} token={token} />
  );
};

export default ResetPasswordPage;
