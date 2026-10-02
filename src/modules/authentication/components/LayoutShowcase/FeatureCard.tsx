type Props = {
  icon: React.ElementType;
  title: string;
  description: string;
  email: string;
};

const FeatureCard = ({ icon: Icon, title, description, email }: Props) => (
  <div className="rounded-2xl border border-(--Grey300) bg-(--app-surface) p-4 flex items-center gap-3 hover:bg-(--Grey200) transition-colors h-full">
    <div className="w-9 h-9 shrink-0 rounded-lg bg-(--Primary100) flex items-center justify-center">
      <Icon className="w-4 h-4 text-(--Primary400)" strokeWidth={1.75} aria-hidden />
    </div>
    <div className="flex flex-col min-w-0 gap-0.5">
      <p className="text-sm font-semibold text-(--app-text) leading-tight">{title}</p>
      <p className="text-xs text-(--Grey500) leading-tight">{description}</p>
      <p className="text-xs text-(--Grey600) leading-tight truncate">{email}</p>
    </div>
  </div>
);

export default FeatureCard;
