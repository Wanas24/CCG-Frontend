import { toast } from "react-toastify";
import i18n from "@/i18n/config";

export const hint = (key: "auth.companyDisabled" | "auth.noCompany") => {
  toast.info(i18n.t(key));
};
