import { useTranslation } from "react-i18next";
import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { AppButton, AppTextArea } from "@/shared/ANTD_UIComponents";

const AiComposer = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-end gap-2 border-t border-(--Grey300) p-3">
      <AppButton
        variant="default"
        disabled
        aria-label={t("ai.composer.attach")}
        icon={<Paperclip size={20} />}
        className="shrink-0"
      />

      <AppTextArea
        disabled
        className="min-w-0 flex-1"
        autoSize={{ minRows: 1, maxRows: 4 }}
        aria-label={t("ai.composer.label")}
        placeholder={t("ai.composer.placeholder")}
      />

      <AppButton
        variant="default"
        disabled
        aria-label={t("ai.composer.voice")}
        icon={<Mic size={20} />}
        className="shrink-0"
      />

      <AppButton
        disabled
        aria-label={t("ai.composer.send")}
        icon={<SendHorizontal size={20} className="rtl:-scale-x-100" />}
        className="w-11! shrink-0 px-0!"
      />
    </div>
  );
};

export default AiComposer;
