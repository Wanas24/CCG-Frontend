import { memo, type AnchorHTMLAttributes, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { useLocale } from "@/i18n";

type Props = {
  content: string;
};

const ALLOWED_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

const sanitizeMarkdownUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed, "https://example.invalid");
    if (!ALLOWED_URL_PROTOCOLS.has(parsed.protocol)) {
      return "";
    }

    if (parsed.origin === "https://example.invalid") {
      return "";
    }

    return trimmed;
  } catch {
    return "";
  }
};

const MarkdownLink = ({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const safeHref = href ? sanitizeMarkdownUrl(href) : "";

  if (!safeHref) {
    return <span>{children}</span>;
  }

  return (
    <a
      {...props}
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words text-(--Primary400) underline underline-offset-2"
    >
      {children}
    </a>
  );
};

const markdownComponents: ComponentProps<typeof ReactMarkdown>["components"] = {
  h1: ({ children }) => (
    <h1 className="m-0 mb-2 text-base font-semibold text-(--app-text)">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="m-0 mb-2 text-sm font-semibold text-(--app-text)">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="m-0 mb-1.5 text-sm font-semibold text-(--app-text)">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="m-0 mb-1.5 text-sm font-medium text-(--app-text)">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="m-0 mb-1 text-sm font-medium text-(--app-text)">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="m-0 mb-1 text-sm font-medium text-(--app-text)">
      {children}
    </h6>
  ),
  p: ({ children }) => (
    <p className="m-0 mb-2 last:mb-0 text-sm leading-relaxed text-(--app-text)">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="m-0 mb-2 list-disc ps-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="m-0 mb-2 list-decimal ps-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="mb-1 text-sm leading-relaxed last:mb-0">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-(--app-text)">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="m-0 mb-2 border-s-2 border-(--Grey400) ps-3 text-(--Grey700) last:mb-0">
      {children}
    </blockquote>
  ),
  a: MarkdownLink,
  code: ({ className, children, ...props }) => {
    if (className) {
      return (
        <code
          {...props}
          className={clsx("font-mono text-[0.85em] text-(--app-text)", className)}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        dir="ltr"
        className="rounded bg-(--Grey300)/50 px-1 py-0.5 font-mono text-[0.85em] text-(--app-text)"
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre
      dir="ltr"
      className="mb-2 max-w-full overflow-x-auto rounded-lg bg-(--app-surface) p-3 last:mb-0 [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0"
    >
      {children}
    </pre>
  ),
  hr: () => <hr className="my-3 border-0 border-t border-(--Grey300)" />,
  table: ({ children }) => (
    <div className="mb-2 max-w-full overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-start text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-(--Grey300) bg-(--app-surface) px-2 py-1 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-(--Grey300) px-2 py-1">{children}</td>
  ),
};

const AiMarkdown = ({ content }: Props) => {
  const { isRtl } = useLocale();

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="ai-markdown max-w-full overflow-hidden text-sm text-(--app-text)"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={sanitizeMarkdownUrl}
        skipHtml
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default memo(AiMarkdown);
