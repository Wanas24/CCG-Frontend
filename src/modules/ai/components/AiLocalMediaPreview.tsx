import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TAiUiLocalAttachment, TAiUiLocalAudio } from "../types";
import { formatAiFileSize } from "../utils/aiComposerLimits";

type Props = {
  attachments?: TAiUiLocalAttachment[];
  audio?: TAiUiLocalAudio | null;
};

const LocalAudioPreview = ({ audio }: { audio: TAiUiLocalAudio }) => {
  const { t } = useTranslation();
  const objectUrl = useMemo(
    () => URL.createObjectURL(audio.file),
    [audio.file],
  );

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return (
    <div className="mt-2 rounded-lg bg-(--app-surface)/50 p-2">
      <p className="m-0 mb-1 text-xs opacity-80">{t("ai.composer.voiceMessage")}</p>
      <audio controls preload="metadata" src={objectUrl} className="w-full">
        <track kind="captions" />
      </audio>
      <p dir="ltr" className="m-0 mt-1 text-[0.7rem] opacity-70">
        {audio.fileName} · {formatAiFileSize(audio.size)}
      </p>
    </div>
  );
};

const AiLocalMediaPreview = ({ attachments, audio }: Props) => {
  const { t } = useTranslation();
  const hasAttachments = Boolean(attachments?.length);
  const hasAudio = Boolean(audio);

  if (!hasAttachments && !hasAudio) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      {hasAttachments && (
        <ul
          aria-label={t("ai.composer.attachments")}
          className="m-0 flex list-none flex-col gap-1 p-0"
        >
          {attachments?.map((item) => (
            <li
              key={item.id}
              className="rounded-md bg-(--app-surface)/50 px-2 py-1 text-xs"
            >
              <p dir="ltr" className="m-0 truncate font-medium">
                {item.fileName}
              </p>
              <p dir="ltr" className="m-0 opacity-70">
                {item.contentType || t("ai.composer.unknownType")} ·{" "}
                {formatAiFileSize(item.size)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {audio ? <LocalAudioPreview audio={audio} /> : null}
    </div>
  );
};

export default AiLocalMediaPreview;
