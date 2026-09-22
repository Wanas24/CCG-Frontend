import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

const ResetPasswordMissingParams = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--naturalBlack)">
          {t("auth.resetPassword.missingParamsTitle")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {t("auth.resetPassword.missingParamsDescription")}
        </p>
      </div>

      <Link to={AUTH_ROUTES.forgotPassword}>
        <AppButton variant="primary" block>
          {t("auth.resetPassword.requestNewLink")}
        </AppButton>
      </Link>

      <Link
        to={AUTH_ROUTES.login}
        className="text-center text-sm text-(--Grey700) underline underline-offset-4"
      >
        {t("auth.resetPassword.backToLogin")}
      </Link>
    </div>
  );
};

export default ResetPasswordMissingParams;
