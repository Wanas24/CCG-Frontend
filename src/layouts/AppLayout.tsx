import { Outlet } from "react-router";
import { AppNavbar } from "@/shared/components";

const AppLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-(--app-bg) text-(--app-text)">
      <AppNavbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
