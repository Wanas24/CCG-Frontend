import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Download, Paperclip } from "lucide-react";
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
  }, [artifact.contentBase64, artifact.contentType, artifact.url]);

  useEffect(() => {
    return () => {
      if (download.kind === "blob") {
        URL.revokeObjectURL(download.href);
      }
    };
  }, [download]);

  return (
    <li className="flex min-w-0 items-center gap-2 py-0.5">
      <Paperclip
        size={12}
        aria-hidden="true"
        className="shrink-0 text-(--Grey600)"
      />
      <div className="min-w-0 flex-1">
        <p dir="ltr" className="m-0 truncate font-medium text-(--app-text)">
          {artifact.fileName}
        </p>
        <p
          dir="ltr"
          className="m-0 truncate font-mono text-[0.65rem] text-(--Grey600)"
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
          title={t("ai.response.download")}
          className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-(--Primary400) hover:bg-(--Grey200)"
        >
          <Download size={14} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">
            {t("ai.response.download")}
          </span>
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
    <details className="mt-1.5 text-xs text-(--Grey700)" open>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-0.5 marker:content-none [&::-webkit-details-marker]:hidden">
        <Paperclip
          size={12}
          aria-hidden="true"
          className="shrink-0 opacity-70"
        />
        <span className="min-w-0 truncate font-medium">
          {t("ai.response.artifacts")}
        </span>
        <span className="shrink-0 text-(--Grey600)">
          · {artifacts.length}
        </span>
      </summary>

      <ul
        aria-label={t("ai.response.artifacts")}
        className="ms-4 mt-1 flex list-none flex-col gap-0.5 border-s border-(--Grey300) ps-2 p-0"
      >
        {artifacts.map((artifact, index) => (
          <AiArtifactItem
            key={`${artifact.fileName}-${artifact.contentType}-${index}`}
            artifact={artifact}
          />
        ))}
      </ul>
    </details>
  );
};

export default AiArtifacts;
