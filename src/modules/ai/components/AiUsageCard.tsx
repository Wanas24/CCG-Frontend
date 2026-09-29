type Props = {
  title: string;
  description: string;
};

const AiUsageCard = ({ title, description }: Props) => {
  return (
    <section className="flex flex-col gap-1 rounded-xl border border-(--Grey300) bg-(--app-surface) p-3">
      <h4 className="m-0 text-sm font-semibold text-(--app-text)">{title}</h4>
      <p className="m-0 text-xs text-(--Grey600)">{description}</p>
    </section>
  );
};

export default AiUsageCard;
