import AppHeaderActions from "../../components/AppNavbar/AppHeaderActions/AppHeaderActions";
import AppHeaderWelcome from "./AppHeaderWelcome/AppHeaderWelcome";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between">
      <AppHeaderWelcome />
      <AppHeaderActions />
    </header>
  );
};
export default AppHeader;
