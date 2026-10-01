import { useCallback, useEffect, useRef, useState } from "react";

const COPIED_RESET_MS = 2000;

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (value: string) => {
    if (!value) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, COPIED_RESET_MS);

      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  return { copied, copy };
};
