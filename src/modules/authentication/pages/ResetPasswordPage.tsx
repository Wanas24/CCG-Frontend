import { useSearchParams } from "react-router";
import ResetPasswordForm from "@/modules/authentication/components/ResetPasswordForm";
import ResetPasswordMissingParams from "@/modules/authentication/components/ResetPasswordMissingParams";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return <ResetPasswordMissingParams />;
  }

  return <ResetPasswordForm email={email} token={token} />;
};

export default ResetPasswordPage;
