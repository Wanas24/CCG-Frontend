import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText } from "lucide-react";
import type { TAiAssistantArtifact } from "../types";
import {
  createBlobFromBase64,
  sanitizeAiArtifactUrl,
} from "../utils/aiResponseMeta";

type Props = {
  artifacts?: TAiAssistantArtifact[];
};

type ArtifactItemProps = {
  artifact: TAiAssistantArtifact;
};

const AiArtifactItem = ({ artifact }: ArtifactItemProps) => {
  const { t } = useTranslation();

  const download = useMemo(() => {
    const safeUrl = sanitizeAiArtifactUrl(artifact.url);
    if (safeUrl) {
      return { kind: "url" as const, href: safeUrl };
    }

    if (!artifact.contentBase64) {
      return { kind: "none" as const };
    }

    const blob = createBlobFromBase64(
      artifact.contentBase64,
      artifact.contentType,
    );

    if (!blob) {
      return { kind: "none" as const };
    }

    return {
      kind: "blob" as const,
      href: URL.createObjectURL(blob),
    };
  }, [
    artifact.contentBase64,
    artifact.contentType,
    artifact.url,
  ]);

  useEffect(() => {
    return () => {
      if (download.kind === "blob") {
        URL.revokeObjectURL(download.href);
      }
    };
  }, [download]);

  return (
    <li className="flex items-start justify-between gap-2 rounded-lg border border-(--Grey300) bg-(--app-surface) px-2 py-2">
      <div className="min-w-0 flex-1">
        <p dir="ltr" className="m-0 break-all font-medium text-(--app-text)">
          {artifact.fileName}
        </p>
        <p
          dir="ltr"
          className="m-0 mt-0.5 break-all font-mono text-[0.7rem] text-(--Grey600)"
        >
          {artifact.contentType}
        </p>
      </div>

      {download.kind !== "none" ? (
        <a
          href={download.href}
          download={artifact.fileName}
          target={download.kind === "url" ? "_blank" : undefined}
          rel={download.kind === "url" ? "noopener noreferrer" : undefined}
          aria-label={`${t("ai.response.download")} ${artifact.fileName}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-(--Primary400) hover:bg-(--Grey200)"
        >
          <Download size={14} aria-hidden="true" />
          <span>{t("ai.response.download")}</span>
        </a>
      ) : null}
    </li>
  );
};

const AiArtifacts = ({ artifacts }: Props) => {
  const { t } = useTranslation();

  if (!artifacts?.length) {
    return null;
  }

  return (
    <section
      aria-label={t("ai.response.artifacts")}
      className="mt-2 rounded-lg border border-(--Grey300) bg-(--app-surface)/70 px-2 py-2 text-xs"
    >
      <div className="mb-2 flex items-center gap-1.5 font-medium text-(--Grey700)">
        <FileText size={14} aria-hidden="true" className="shrink-0" />
        <span>{t("ai.response.artifacts")}</span>
        <span className="text-(--Grey600)">({artifacts.length})</span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {artifacts.map((artifact, index) => (
          <AiArtifactItem
            key={`${artifact.fileName}-${artifact.contentType}-${index}`}
            artifact={artifact}
          />
        ))}
      </ul>
    </section>
  );
};

export default AiArtifacts;
