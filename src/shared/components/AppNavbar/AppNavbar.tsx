import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Menu, PanelLeft } from "lucide-react";
import { useLocale } from "@/i18n/useLocale";
import { useLogoutManager } from "@/modules/authentication/hooks/useLogoutManager";
import { AppButton, AppDrawer } from "@/shared/ANTD_UIComponents";
import DesktopNavbarActions from "./DesktopNavbarActions";
import MobileNavbarMenu from "./MobileNavbarMenu";

type Props = {
  showSidebarTrigger?: boolean;
  onOpenSidebar?: () => void;
};

const navbarIconActionClassName =
  "size-9! shrink-0 justify-center! rounded-lg! border! border-(--Grey300)! px-0! hover:bg-(--Grey100)!";

const AppNavbar = ({
  showSidebarTrigger = false,
  onOpenSidebar,
}: Props) => {
  const { t } = useTranslation();
  const { isRtl } = useLocale();
  const location = useLocation();
  const { logout, isPending } = useLogoutManager();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const mobileOpen = menuPath === location.pathname;

  const openMobileMenu = () => setMenuPath(location.pathname);
  const closeMobileMenu = () => setMenuPath(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) {
        setMenuPath(null);
      }
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-(--Grey300) px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {showSidebarTrigger && (
          <AppButton
            variant="default"
            icon={<PanelLeft size={18} />}
            aria-label={t("common.menu")}
            onClick={onOpenSidebar}
            className={navbarIconActionClassName}
          />
        )}
        <h1 className="m-0 min-w-0 truncate text-lg font-semibold text-(--app-text)">
          {/* {t("common.appName")} */}
        </h1>
      </div>

      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label={t("common.menu")}
      >
        <DesktopNavbarActions
          logout={logout}
          isPending={isPending}
          iconActionClassName={navbarIconActionClassName}
        />
      </nav>

      <div className="shrink-0 md:hidden">
        <AppButton
          variant="default"
          icon={<Menu size={18} />}
          aria-label={t("common.menu")}
          aria-expanded={mobileOpen}
          onClick={openMobileMenu}
          className={navbarIconActionClassName}
        />
        <AppDrawer
          open={mobileOpen}
          onClose={closeMobileMenu}
          placement={isRtl ? "left" : "right"}
          title={t("common.menu")}
          width={280}
          destroyOnHidden
          classNames={{ body: "flex flex-col gap-3" }}
        >
          <MobileNavbarMenu
            logout={logout}
            isPending={isPending}
            onNavigate={closeMobileMenu}
          />
        </AppDrawer>
      </div>
    </header>
  );
};

export default AppNavbar;
