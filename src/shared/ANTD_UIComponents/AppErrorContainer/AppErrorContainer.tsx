import { useTranslation } from "react-i18next";

type Props = {
  error?: string | null;
};

const AppErrorContainer = ({ error }: Props) => {
  const { t } = useTranslation();
  const message = error?.trim() || t("common.unexpectedError");

  return (
    <div className="bg-red-200 text-red-950 text-sm p-2 rounded-lg text-center font-bold">
      {message}
    </div>
  );
};

export default AppErrorContainer;
