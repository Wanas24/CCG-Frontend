import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import clsx from "clsx";
import { Mic, SendHorizontal, Trash2 } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { formatAiFileSize } from "../utils/aiComposerLimits";

type Props = {
  disabled?: boolean;
  audioFile: File | null;
  className?: string;
  onAudioChange: (file: File | null) => void;
  onConfirmSend: (file: File) => void;
  onRecordingChange?: (isRecording: boolean) => void;
  onError: (messageKey: "permissionDenied" | "unsupported" | "failed") => void;
};

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const pickRecorderMimeType = () => {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
};

const AiVoiceRecorder = ({
  disabled,
  audioFile,
  className,
  onAudioChange,
  onConfirmSend,
  onRecordingChange,
  onError,
}: Props) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const sendAfterStopRef = useRef(false);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopTracks();
    };
  }, []);

  const setRecordingState = (recording: boolean) => {
    setIsRecording(recording);
    onRecordingChange?.(recording);
  };

  const startRecording = async () => {
    if (disabled || isRecording) {
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      onError("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      sendAfterStopRef.current = false;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const shouldSend = sendAfterStopRef.current;
        sendAfterStopRef.current = false;

        const type = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const extension = type.includes("ogg")
          ? "ogg"
          : type.includes("mp4")
            ? "m4a"
            : "webm";
        const file = new File([blob], `voice-recording.${extension}`, {
          type,
        });
        onAudioChange(file);
        stopTracks();
        clearTimer();
        setRecordingState(false);

        if (shouldSend) {
          onConfirmSend(file);
        }
      };

      recorder.start();
      setRecordingState(true);
      setElapsedSeconds(0);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((current) => current + 1);
      }, 1000);
    } catch {
      stopTracks();
      onError("permissionDenied");
    }
  };

  const stopAndSend = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return;
    }

    sendAfterStopRef.current = true;
    recorder.stop();
  };

  const discardRecording = () => {
    sendAfterStopRef.current = false;

    if (isRecording) {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.ondataavailable = null;
        recorder.onstop = () => {
          stopTracks();
          clearTimer();
          setRecordingState(false);
          setElapsedSeconds(0);
        };
        recorder.stop();
      }
    }

    onAudioChange(null);
    setElapsedSeconds(0);
  };

  if (audioFile && !isRecording) {
    return (
      <div
        className={clsx(
          "flex min-w-0 flex-1 items-center gap-1",
          className,
        )}
      >
        <Tooltip title={t("ai.composer.discardVoice")}>
          <AppButton
            variant="default"
            disabled={disabled}
            aria-label={t("ai.composer.discardVoice")}
            icon={<Trash2 size={18} />}
            onClick={discardRecording}
            className="shrink-0"
          />
        </Tooltip>

        <div className="min-w-0 flex-1 px-1 text-xs">
          <p className="m-0 truncate font-medium text-(--app-text)">
            {t("ai.composer.voiceReady")}
          </p>
          <p dir="ltr" className="m-0 truncate text-(--Grey600)">
            {formatAiFileSize(audioFile.size)}
          </p>
        </div>

        <Tooltip title={t("ai.composer.sendVoice")}>
          <AppButton
            variant="default"
            disabled={disabled}
            aria-label={t("ai.composer.sendVoice")}
            icon={<SendHorizontal size={20} className="rtl:-scale-x-100" />}
            onClick={() => onConfirmSend(audioFile)}
            className="w-11! shrink-0 px-0!"
          />
        </Tooltip>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div
        className={clsx(
          "flex min-w-0 flex-1 items-center gap-1",
          className,
        )}
      >
        <Tooltip title={t("ai.composer.discardVoice")}>
          <AppButton
            variant="default"
            aria-label={t("ai.composer.discardVoice")}
            icon={<Trash2 size={18} />}
            onClick={discardRecording}
            className="shrink-0"
          />
        </Tooltip>

        <div
          aria-live="polite"
          className="flex min-w-0 flex-1 items-center gap-2 px-1 text-xs font-medium text-(--statusR200)"
        >
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 animate-pulse rounded-full bg-(--statusR200)"
          />
          <span className="min-w-0 truncate">
            {t("ai.composer.recording", {
              duration: formatDuration(elapsedSeconds),
            })}
          </span>
        </div>

        <Tooltip title={t("ai.composer.sendVoice")}>
          <AppButton
            variant="default"
            aria-label={t("ai.composer.sendVoice")}
            icon={<SendHorizontal size={20} className="rtl:-scale-x-100" />}
            onClick={stopAndSend}
            className="w-11! shrink-0 px-0!"
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <Tooltip title={t("ai.composer.voice")}>
      <AppButton
        variant="default"
        disabled={disabled}
        aria-label={t("ai.composer.voice")}
        icon={<Mic size={20} />}
        onClick={() => {
          void startRecording();
        }}
        className={clsx("shrink-0", className)}
      />
    </Tooltip>
  );
};

export default AiVoiceRecorder;
