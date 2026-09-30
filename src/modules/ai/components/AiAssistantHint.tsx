import { useTranslation } from "react-i18next";

const AiAssistantHint = () => {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-9 end-24 z-50 rounded-full border border-(--Grey300) bg-(--app-surface) px-3 py-1.5 text-xs font-medium text-(--Grey800) shadow-md max-[650px]:bottom-7 max-[650px]:end-20"
    >
      {t("ai.launcher.hint")}
    </div>
  );
};

export default AiAssistantHint;
