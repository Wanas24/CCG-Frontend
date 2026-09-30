import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { AI_ROUTES } from "@/modules/ai/routes/paths";

type Props = {
  showLabel?: boolean;
  onNavigate?: () => void;
};

const NavbarAiSubscriptionsAction = ({
  showLabel = false,
  onNavigate,
}: Props) => {
  const { t } = useTranslation();
  const { hasPermission, isLoading } = usePermissions();
  const label = t("ai.subscriptions.navLabel");

  if (isLoading || !hasPermission(PermissionsList.AiSubscriptionGet)) {
    return null;
  }

  return (
    <Link to={AI_ROUTES.subscriptions} onClick={onNavigate}>
      <AppButton
        variant="default"
        icon={<ShieldCheck size={18} />}
        aria-label={label}
        className={showLabel ? "w-full justify-start" : undefined}
      >
        {showLabel ? label : null}
      </AppButton>
    </Link>
  );
};

export default NavbarAiSubscriptionsAction;
