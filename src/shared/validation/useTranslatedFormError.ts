import { useTranslation } from "react-i18next";
import { translateFormError } from "./translateFormError";

export const useTranslatedFormError = () => {
  const { t } = useTranslation();

  return (errorMessage: string | undefined) => translateFormError(errorMessage, t);
};
