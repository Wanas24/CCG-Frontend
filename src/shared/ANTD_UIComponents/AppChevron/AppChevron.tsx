import { useContext, useSyncExternalStore } from "react";
import clsx from "clsx";
import { ConfigProvider } from "antd";
import { ChevronRight } from "lucide-react";

interface IAppChevronProps {
  className?: string;
  direction: "next" | "previous";
  onClick?: () => void;
  size?: number;
}

function subscribeToDocumentDirection(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dir"],
  });
  return () => observer.disconnect();
}

function getDocumentIsRtl() {
  const html = document.documentElement;
  const htmlDir = html.getAttribute("dir");

  if (htmlDir === "rtl") return true;
  if (htmlDir === "ltr") return false;

  return getComputedStyle(html).direction === "rtl";
}

function useIsRtl() {
  const { direction: configDirection } = useContext(ConfigProvider.ConfigContext);
  const documentIsRtl = useSyncExternalStore(
    subscribeToDocumentDirection,
    getDocumentIsRtl,
    () => false,
  );

  if (configDirection === "rtl") return true;
  if (document.documentElement.getAttribute("dir") === "ltr") return false;

  return documentIsRtl;
}

const AppChevron = ({ direction, className, onClick, size = 16 }: IAppChevronProps) => {
  const isRtl = useIsRtl();
  const pointsBackward = direction === "previous";
  const shouldRotate = isRtl ? !pointsBackward : pointsBackward;

  return (
    <ChevronRight
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      size={size}
      className={clsx(
        "cursor-pointer",
        shouldRotate ? "rotate-180" : "rotate-0",
        className,
      )}
    />
  );
};

export default AppChevron;
