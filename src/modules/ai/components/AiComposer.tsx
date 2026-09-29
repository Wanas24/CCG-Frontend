import { useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { AppButton, AppTextArea } from "@/shared/ANTD_UIComponents";

type SendResult = {
  ok: boolean;
  restoreMessage?: string;
  aborted?: boolean;
};

type Props = {
  isSending: boolean;
  onSend: (message: string) => Promise<SendResult>;
};

const AiComposer = ({ isSending, onSend }: Props) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const trimmedMessage = message.trim();
  const canSend = trimmedMessage.length > 0 && !isSending;

  const submit = async () => {
    if (!canSend) {
      return;
    }

    const outgoing = trimmedMessage;
    setMessage("");

    const result = await onSend(outgoing);
    if (!result.ok && result.restoreMessage && !result.aborted) {
      setMessage(result.restoreMessage);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void submit();
  };

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
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
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
        disabled={!canSend}
        loading={isSending}
        aria-label={
          isSending ? t("ai.composer.sending") : t("ai.composer.send")
        }
        icon={<SendHorizontal size={20} className="rtl:-scale-x-100" />}
        onClick={() => {
          void submit();
        }}
        className="w-11! shrink-0 px-0!"
      />
    </div>
  );
};

export default AiComposer;
