import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";

const ConfirmEmailMissingParams = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.confirmEmail.missingParamsTitle")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {t("auth.confirmEmail.missingParamsDescription")}
        </p>
      </div>

      <Link to={AUTH_ROUTES.login}>
        <AppButton variant="primary" block>
          {t("auth.confirmEmail.backToLogin")}
        </AppButton>
      </Link>
    </div>
  );
};

export default ConfirmEmailMissingParams;
