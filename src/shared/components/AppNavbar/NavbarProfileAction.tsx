import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { UserIcon } from "lucide-react";
import { USER_ROUTES } from "@/modules/user/routes/paths";
import { AppButton } from "@/shared/ANTD_UIComponents";

type Props = {
  showLabel?: boolean;
  onNavigate?: () => void;
};

const NavbarProfileAction = ({ showLabel = false, onNavigate }: Props) => {
  const { t } = useTranslation();
  const label = t("user.profile.navLabel");

  return (
    <Link to={USER_ROUTES.profile} onClick={onNavigate}>
      <AppButton
        variant="default"
        icon={<UserIcon size={18} />}
        aria-label={label}
        className={showLabel ? "w-full justify-start" : undefined}
      >
        {showLabel ? label : null}
      </AppButton>
    </Link>
  );
};

export default NavbarProfileAction;
