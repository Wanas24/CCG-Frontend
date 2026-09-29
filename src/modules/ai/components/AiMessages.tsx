import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

const AiMessages = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-6 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--Primary100) text-(--Primary400)">
        <Sparkles size={24} aria-hidden="true" />
      </span>
      <p className="m-0 text-sm font-medium text-(--Grey600)">
        {t("ai.title")}
      </p>
      <h3 className="m-0 text-lg font-semibold text-(--app-text)">
        {t("ai.chat.emptyTitle")}
      </h3>
    </div>
  );
};

export default AiMessages;
