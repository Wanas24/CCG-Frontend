import { AppLocaleSwitcher } from "@/i18n";
import AppNotification from "./AppNotification";
import AppUserActions from "./AppUserActions";

const AppHeaderActions = () => {
  return (
    <div className="flex items-center gap-2">
      <AppLocaleSwitcher />
      <AppNotification />
      <AppUserActions />
    </div>
  );
};

export default AppHeaderActions;
