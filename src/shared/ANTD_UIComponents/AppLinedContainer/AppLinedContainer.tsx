import { Card } from "antd";
import clsx from "clsx";

interface IAppLinedContainerProps {
  children: React.ReactNode;
  lineDirection?: "vertical" | "horizontal";
}

const AppLinedContainer = ({
  children,
  lineDirection = "vertical",
}: IAppLinedContainerProps) => {
  return (
    <Card className="relative overflow-hidden p-0!">
      <div
        className={clsx(
          "gradient absolute top-0 start-0",
          lineDirection === "horizontal" ? "h-1 w-full" : "h-full w-1",
        )}
      />
      {children}
    </Card>
  );
};

export default AppLinedContainer;
