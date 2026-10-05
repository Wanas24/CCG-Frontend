import { useEffect, useRef } from "react";
import { AppSkeleton } from "@/shared/ANTD_UIComponents";

type Props = {
  hasMore: boolean;
  loading: boolean;
  onLoad: () => void;
};

const scrollRoot = (node: HTMLElement) => {
  let current = node.parentElement;
  while (current) {
    const overflowY = getComputedStyle(current).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return current;
    current = current.parentElement;
  }
  return null;
};

const ScrollLoadSentinel = ({ hasMore, loading, onLoad }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const onLoadRef = useRef(onLoad);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadRef.current();
      },
      { root: scrollRoot(node), rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  if (!hasMore && !loading) return null;

  return (
    <div ref={ref} className="min-h-7 px-0 py-2 text-center text-xs text-(--Grey500)">
      {loading ? (
        <AppSkeleton.Input active size="small" className="!h-4 !w-24 !min-w-24" />
      ) : null}
    </div>
  );
};

export default ScrollLoadSentinel;
