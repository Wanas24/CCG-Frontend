import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { USER_ROUTES } from "@/modules/user/routes/paths";
import { useGetMe } from "@/modules/user/api/hooks/useGetMe";
import { AppButton } from "@/shared/ANTD_UIComponents";
import NavbarUserAvatar from "./NavbarUserAvatar";

type Props = {
  showLabel?: boolean;
  onNavigate?: () => void;
};

const NavbarProfileAction = ({
  showLabel = false,
  onNavigate,
}: Props) => {
  const { t } = useTranslation();
  const { data } = useGetMe();
  const profile = data?.isSuccess ? data.data : undefined;
  const profileImage = profile?.profileImage ?? null;
  const label = t("user.profile.navLabel");
  const imageAlt = t("user.profile.imageAlt");

  return (
    <Link to={USER_ROUTES.profile} onClick={onNavigate} className="w-full">
      <AppButton
        variant="default"
        aria-label={label}
        icon={
          <span className="size-5 shrink-0 overflow-hidden rounded-md">
            <NavbarUserAvatar
              profileImage={profileImage}
              alt={imageAlt}
              className="size-5 rounded-md"
            />
          </span>
        }
        className={clsx(
          showLabel && "w-full! justify-start! hover:bg-(--Grey100)!",
        )}
      >
        {showLabel ? label : null}
      </AppButton>
    </Link>
  );
};

export default NavbarProfileAction;
