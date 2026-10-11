import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { ClipboardList } from "lucide-react";
import { useAuthStore } from "@/modules/authentication/store/authStore";
import { PermissionsList } from "@/modules/user/permissions/PermissionsList";
import { usePermissions } from "@/modules/user/hooks/usePermissions";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { APPROVAL_ROUTES } from "../routes/paths";

const MyApprovalRequestsLauncher = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const companyId = useAuthStore((state) => state.user?.companyId ?? null);
  const { hasPermission, isLoading: isPermissionsLoading } = usePermissions();

  const isAiLauncherVisible =
    isAuthenticated &&
    !isPermissionsLoading &&
    companyId !== null &&
    hasPermission(PermissionsList.Ai.AiAssistantChat);

  if (!isAuthenticated) {
    return null;
  }

  if (location.pathname === APPROVAL_ROUTES.myRequests) {
    return null;
  }

  const openLabel = t("approval.myRequests.launcher.open");
  const positionClass = isAiLauncherVisible
    ? "fixed! bottom-24 end-6 z-50 h-14! w-14! shadow-lg! transition-transform hover:scale-105 focus-visible:scale-105 max-[650px]:bottom-20 max-[650px]:end-4"
    : "fixed! bottom-6 end-6 z-50 h-14! w-14! shadow-lg! transition-transform hover:scale-105 focus-visible:scale-105 max-[650px]:bottom-4 max-[650px]:end-4";

  return (
    <Tooltip title={openLabel} placement="left">
      <AppButton
        shape="circle"
        aria-label={openLabel}
        icon={<ClipboardList size={24} />}
        onClick={() => navigate(APPROVAL_ROUTES.myRequests)}
        className={positionClass}
      />
    </Tooltip>
  );
};

export default MyApprovalRequestsLauncher;
