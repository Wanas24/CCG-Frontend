import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

type Props = {
  title: string | null;
  message: string | null;
  fallback: string;
  hasContent: boolean;
};

const NotificationToastBody = ({
  title,
  message,
  fallback,
  hasContent,
}: Props) => {
  if (!hasContent) {
    return (
      <p
        className={clsx(
          DesignTokens.inputs.labelFontSize,
          DesignTokens.typography.emphasis,
          "m-0",
        )}
      >
        {fallback}
      </p>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      {title ? (
        <p
          className={clsx(
            DesignTokens.inputs.labelFontSize,
            DesignTokens.typography.emphasis,
            "m-0 break-words",
          )}
        >
          {title}
        </p>
      ) : null}
      {message ? (
        <p
          className={clsx(
            DesignTokens.inputs.labelFontSize,
            "m-0 break-words whitespace-pre-wrap font-normal text-(--app-text)",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default NotificationToastBody;
