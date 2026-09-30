export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userType: "User" | "Admin";
  companyId: number | null;
  isManager: boolean;
  isActive: boolean;
  language: "en" | "ar";
  theme: "light" | "dark" | "system";
};
