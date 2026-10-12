import MyApprovalRequestsView from "../components/myApprovalRequests/MyApprovalRequestsView";
import { useMyApprovalRequests } from "../hooks/useMyApprovalRequests";

const MyApprovalRequestsPage = () => {
  const studio = useMyApprovalRequests();
  return <MyApprovalRequestsView studio={studio} />;
};

export default MyApprovalRequestsPage;
