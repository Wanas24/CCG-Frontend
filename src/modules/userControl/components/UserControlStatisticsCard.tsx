import { Card } from "antd";

const glowClassName = {
  primary: "bg-(--Primary400)",
  secondary: "bg-(--Secondary300)",
  teal: "bg-(--statusB200)",
  amber: "bg-(--statusY200)",
} as const;

type StatGlow = keyof typeof glowClassName;

type Props = {
  title: string;
  value: React.ReactNode;
  content: React.ReactNode;
  glow: StatGlow;
};

const UserControlStatisticsCard = ({
  title,
  value,
  content,
  glow,
}: Props) => {
  return (
    <Card className="relative h-fit overflow-hidden p-4 shadow-xl">
      <div
        className={`absolute -top-10 -right-8 h-25 w-25 rounded-full opacity-30 blur-2xl ${glowClassName[glow]}`}
      />
      <p className="text-xs uppercase text-(--Grey600) font-semibold">
        {title}
      </p>
      <div className="py-1 text-2xl font-bold">{value}</div>
      <div className="text-sm text-(--Grey500)">{content}</div>
    </Card>
  );
};

export default UserControlStatisticsCard;