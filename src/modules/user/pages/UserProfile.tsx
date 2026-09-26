import { useGetUser } from "../api/hooks/useGetUser";
import UserProfileHeaderDetails from "../components/UserProfileHeaderDetails";

const UserProfile = () => {
  const { data } = useGetUser();
  console.log("data", data);

  return (
    <div>
      <UserProfileHeaderDetails />
    </div>
  );
};

export default UserProfile;
