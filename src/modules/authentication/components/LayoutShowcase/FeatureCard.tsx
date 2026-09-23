interface TFeatureCard {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: TFeatureCard) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex items-center gap-3 backdrop-blur-sm hover:bg-white/[0.06] transition-colors">
    <div className="w-9 h-9 shrink-0 rounded-lg bg-white/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-white/80" strokeWidth={1.75} />
    </div>
    <div className="flex flex-col">
      <p className="text-sm font-semibold text-white leading-tight">{title}</p>
      <p className="text-xs text-white/45 leading-tight">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
