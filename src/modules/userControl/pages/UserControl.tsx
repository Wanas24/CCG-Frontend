import { Navigate } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import UserControlPageSkeleton from "../components/UserControlPageSkeleton";
import UserControlView from "../components/UserControlView";
import { useUserControl } from "../hooks/useUserControl";
import { useUserControlAccess } from "../hooks/useUserControlAccess";

const UserControlContent = () => {
  const userControl = useUserControl();
  return <UserControlView userControl={userControl} />;
};

const UserControl = () => {
  const { isLoading, canOpen } = useUserControlAccess();

  if (isLoading) {
    return <UserControlPageSkeleton />;
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <UserControlContent />;
};

export default UserControl;
