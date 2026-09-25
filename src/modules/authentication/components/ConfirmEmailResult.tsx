import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { MailCheck } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { useConfirmEmailManager } from "../hooks/useConfirmEmailManager";
import type { TConfirmEmailParams } from "../types";

const ConfirmEmailResult = ({ userId, token }: TConfirmEmailParams) => {
  const { t } = useTranslation();
  const { isPending, isSuccess, message, continuePath } = useConfirmEmailManager({ userId, token });

  return (
    <div className="flex flex-col gap-6">
      <div className="w-10 h-10 rounded-xl bg-[#E8F5F0] flex items-center justify-center">
        <MailCheck className="w-6 h-6 text-[#3D7A6A]" />
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-(--app-text)">
          {t("auth.confirmEmail.title")}
        </h1>
        <p className="text-sm text-(--Grey600)">
          {isPending
            ? t("auth.confirmEmail.pending")
            : isSuccess
              ? t("auth.confirmEmail.success")
              : t("auth.confirmEmail.failed")}
        </p>
      </div>

      {message && (
        <p className="text-sm text-(--statusG200)">{message}</p>
      )}

      {!isPending && (
        <Link to={continuePath}>
          <AppButton variant="primary" block>
            {t("auth.confirmEmail.continue")}
          </AppButton>
        </Link>
      )}
    </div>
  );
};

export default ConfirmEmailResult;
