import { Navigate } from "react-router";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";
import ApprovalStudioSkeleton from "../components/ApprovalStudioSkeleton";
import ApprovalStudioView from "../components/ApprovalStudioView";
import { useApprovalAccess } from "../hooks/useApprovalAccess";
import { useApprovalStudio } from "../hooks/useApprovalStudio";

const ApprovalContent = () => {
  const studio = useApprovalStudio();
  return <ApprovalStudioView studio={studio} />;
};

const ApprovalPage = () => {
  const { isLoading, canOpen } = useApprovalAccess();

  if (isLoading) {
    return <ApprovalStudioSkeleton />;
  }

  if (!canOpen) {
    return <Navigate to={APP_ROUTES.home} replace />;
  }

  return <ApprovalContent />;
};

export default ApprovalPage;
