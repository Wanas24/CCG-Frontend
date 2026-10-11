import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import { Paperclip, SendHorizontal, Square } from "lucide-react";
import { AppButton, AppTextArea } from "@/shared/ANTD_UIComponents";
import type { TAiComposerSendPayload } from "../types";
import {
  AI_CHAT_LIMITS,
  isAllowedAiAudioFile,
} from "../utils/aiComposerLimits";
import AiAttachmentList from "./AiAttachmentList";
import AiVoiceRecorder from "./AiVoiceRecorder";

type AttachmentItem = {
  id: string;
  file: File;
};

type SendResult = {
  ok: boolean;
  restore?: TAiComposerSendPayload;
  aborted?: boolean;
};

type Props = {
  isSending: boolean;
  onSend: (payload: TAiComposerSendPayload) => Promise<SendResult>;
  onCancel: () => void;
};

const AiComposer = ({ isSending, onSend, onCancel }: Props) => {
  const { t } = useTranslation();
  const composerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasSendingRef = useRef(false);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const trimmedMessage = message.trim();
  const isVoiceMode = isRecording || Boolean(audioFile);
  const canSend =
    !isSending && (trimmedMessage.length > 0 || Boolean(audioFile));

  useLayoutEffect(() => {
    if (isSending) {
      wasSendingRef.current = true;
      return;
    }

    if (!wasSendingRef.current) {
      return;
    }

    wasSendingRef.current = false;

    if (isVoiceMode) {
      return;
    }

    const active = document.activeElement;
    if (
      active &&
      active !== document.body &&
      composerRef.current &&
      !composerRef.current.contains(active)
    ) {
      return;
    }

    const textarea = composerRef.current?.querySelector("textarea");
    textarea?.focus();
  }, [isSending, isVoiceMode]);

  const handleRecordingChange = useCallback((recording: boolean) => {
    setIsRecording(recording);
  }, []);

  const restoreComposer = (payload: TAiComposerSendPayload) => {
    setMessage(payload.message);
    setAudioFile(payload.audio ?? null);
    setAttachments(
      (payload.attachments ?? []).map((file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    );
  };

  const validatePayload = (
    nextMessage: string,
    nextAudio: File | null,
    nextAttachments: File[],
  ): string | null => {
    if (nextMessage.length > AI_CHAT_LIMITS.maxMessageLength) {
      return t("ai.composer.messageTooLong", {
        max: AI_CHAT_LIMITS.maxMessageLength,
      });
    }

    if (nextAttachments.length > AI_CHAT_LIMITS.maxAttachments) {
      return t("ai.composer.tooManyAttachments", {
        max: AI_CHAT_LIMITS.maxAttachments,
      });
    }

    for (const file of nextAttachments) {
      if (file.size > AI_CHAT_LIMITS.maxAttachmentBytes) {
        return t("ai.composer.attachmentTooLarge", {
          name: file.name,
          maxMb: 10,
        });
      }
    }

    if (nextAudio) {
      if (nextAudio.size > AI_CHAT_LIMITS.maxAudioBytes) {
        return t("ai.composer.audioTooLarge", { maxMb: 25 });
      }

      if (!isAllowedAiAudioFile(nextAudio)) {
        return t("ai.composer.audioUnsupported");
      }
    }

    if (nextMessage.length === 0 && !nextAudio) {
      return t("ai.composer.emptySend");
    }

    return null;
  };

  const submit = async (overrides?: {
    message?: string;
    audio?: File | null;
  }) => {
    if (isSending) {
      return;
    }

    const nextMessage =
      overrides?.message !== undefined
        ? overrides.message.trim()
        : trimmedMessage;
    const nextAudio =
      overrides && "audio" in overrides
        ? (overrides.audio ?? null)
        : audioFile;
    const nextAttachments = attachments.map((item) => item.file);

    const error = validatePayload(nextMessage, nextAudio, nextAttachments);
    if (error) {
      setValidationError(error);
      return;
    }

    const payload: TAiComposerSendPayload = {
      message: nextMessage,
      audio: nextAudio,
      attachments: nextAttachments,
    };

    setValidationError(null);
    setMessage("");
    setAttachments([]);
    setAudioFile(null);

    const result = await onSend(payload);
    if (!result.ok && result.restore) {
      restoreComposer(result.restore);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || isSending) {
      return;
    }

    event.preventDefault();
    void submit();
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList?.length) {
      return;
    }

    const nextFiles = Array.from(fileList);
    const remainingSlots =
      AI_CHAT_LIMITS.maxAttachments - attachments.length;

    if (remainingSlots <= 0) {
      setValidationError(
        t("ai.composer.tooManyAttachments", {
          max: AI_CHAT_LIMITS.maxAttachments,
        }),
      );
      return;
    }

    const accepted: AttachmentItem[] = [];
    for (const file of nextFiles.slice(0, remainingSlots)) {
      if (file.size > AI_CHAT_LIMITS.maxAttachmentBytes) {
        setValidationError(
          t("ai.composer.attachmentTooLarge", {
            name: file.name,
            maxMb: 10,
          }),
        );
        continue;
      }

      accepted.push({ id: crypto.randomUUID(), file });
    }

    if (nextFiles.length > remainingSlots) {
      setValidationError(
        t("ai.composer.tooManyAttachments", {
          max: AI_CHAT_LIMITS.maxAttachments,
        }),
      );
    }

    if (accepted.length > 0) {
      setAttachments((current) => [...current, ...accepted]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVoiceError = (key: "permissionDenied" | "unsupported" | "failed") => {
    if (key === "permissionDenied") {
      setValidationError(t("ai.composer.micPermissionDenied"));
    } else if (key === "unsupported") {
      setValidationError(t("ai.composer.recordingUnsupported"));
    } else {
      setValidationError(t("ai.composer.recordingFailed"));
    }
  };

  return (
    <div
      ref={composerRef}
      className="flex flex-col gap-2 border-t border-(--Grey300) p-3"
    >
      {!isVoiceMode && (
        <AiAttachmentList
          attachments={attachments}
          disabled={isSending}
          onRemove={(id) =>
            setAttachments((current) =>
              current.filter((item) => item.id !== id),
            )
          }
        />
      )}

      <div className="flex min-h-11 items-end gap-1 rounded-2xl border border-(--Grey300) bg-(--Grey100) px-1 py-1">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />

        {isSending ? (
          <div className="flex min-h-9 w-full items-center justify-end px-1">
            <Tooltip title={t("ai.composer.stopGenerating")}>
              <AppButton
                variant="default"
                aria-label={t("ai.composer.stopGenerating")}
                icon={
                  <Square
                    size={16}
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                }
                onClick={onCancel}
                className="w-11! shrink-0 px-0!"
              />
            </Tooltip>
          </div>
        ) : (
          <>
            {!isVoiceMode && (
              <Tooltip title={t("ai.composer.attach")}>
                <AppButton
                  variant="default"
                  aria-label={t("ai.composer.attach")}
                  icon={<Paperclip size={20} />}
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-0.5 shrink-0"
                />
              </Tooltip>
            )}

            {!isVoiceMode && (
              <AppTextArea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-0 flex-1 border-0! bg-transparent! shadow-none! [&_.ant-input]:bg-transparent! [&_.ant-input]:shadow-none!"
                autoSize={{ minRows: 1, maxRows: 4 }}
                aria-label={t("ai.composer.label")}
                placeholder={t("ai.composer.placeholder")}
              />
            )}

            <AiVoiceRecorder
              disabled={isSending}
              audioFile={audioFile}
              onRecordingChange={handleRecordingChange}
              onAudioChange={(file) => {
                setValidationError(null);
                setAudioFile(file);
              }}
              onConfirmSend={(file) => {
                void submit({ audio: file });
              }}
              onError={handleVoiceError}
            />

            {!isVoiceMode && (
              <Tooltip title={t("ai.composer.send")}>
                <AppButton
                  disabled={!canSend}
                  aria-label={t("ai.composer.send")}
                  icon={
                    <SendHorizontal size={20} className="rtl:-scale-x-100" />
                  }
                  onClick={() => {
                    void submit();
                  }}
                  className="mb-0.5 w-11! shrink-0 px-0!"
                />
              </Tooltip>
            )}
          </>
        )}
      </div>

      {validationError && (
        <p className="m-0 text-xs text-(--statusR200)">{validationError}</p>
      )}
    </div>
  );
};

export default AiComposer;
