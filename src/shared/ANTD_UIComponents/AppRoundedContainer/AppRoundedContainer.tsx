import clsx from "clsx";

const AppRoundedContainer = ({
  children,
  className,
  whiteBG,
}: {
  children: React.ReactNode;
  className?: string;
  whiteBG?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "border border-(--Grey300) rounded-xl p-4",
        whiteBG ? "bg-(--naturalWhite)" : "bg-(--Grey200)",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default AppRoundedContainer;
