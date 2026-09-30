import { useSearchParams } from "react-router";
import ConfirmEmailMissingParams from "@/modules/authentication/components/ConfirmEmailMissingParams";
import ConfirmEmailResult from "@/modules/authentication/components/ConfirmEmailResult";

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  if (!userId || !token) {
    return <ConfirmEmailMissingParams />;
  }

  return <ConfirmEmailResult userId={userId} token={token} />;
};

export default ConfirmEmailPage;
