import { useState } from "react";
import { UserIcon } from "lucide-react";
import clsx from "clsx";
import { DesignTokens } from "@/AntdTheme/DesignTokens";

type Props = {
  profileImage: string | null;
  alt: string;
  className?: string;
};

const NavbarUserAvatar = ({ profileImage, alt, className }: Props) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(profileImage) && profileImage !== failedSrc;

  if (showImage && profileImage) {
    return (
      <img
        src={profileImage}
        alt={alt}
        className={clsx("object-cover", className)}
        onError={() => setFailedSrc(profileImage)}
      />
    );
  }

  return (
    <span
      className={clsx(
        "flex items-center justify-center bg-(--Grey100) text-(--Grey600)",
        className,
      )}
      aria-hidden
    >
      <UserIcon size={DesignTokens.media.iconSm} />
    </span>
  );
};

export default NavbarUserAvatar;
