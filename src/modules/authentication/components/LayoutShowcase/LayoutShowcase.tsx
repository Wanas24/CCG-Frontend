import { AppLocaleSwitcher } from "@/i18n";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Sparkles,
  FolderKanban,
  Package,
  CircleDollarSign,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const LayoutShowcase = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col w-full min-h-dvh text-white overflow-hidden bg-[#16241F]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 30% 40%, rgba(74,122,104,0.35) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 85% 30%, rgba(120,160,140,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-10 py-8 min-h-dvh">
        <div className="flex w-full items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
            <ShieldCheck
              className="w-4.5 h-4.5 text-white"
              strokeWidth={1.75}
            />
          </div>
          <span className="text-lg font-bold tracking-wide">
            {t("common.appName")}
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 tracking-widest uppercase">
            {t("auth.showcase.badge")}
          </span>
          <div className="ms-auto rounded-xl bg-white/[0.08]">
            <AppLocaleSwitcher whiteIcon />
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-center gap-5 py-12 max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/55" strokeWidth={1.75} />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-white/55">
              {t("auth.showcase.eyebrow")}
            </span>
          </div>

          <h1 className="whitespace-pre-line text-5xl font-bold leading-[1.1] tracking-tight">
            {t("auth.showcase.headline")}
          </h1>

          <p className="text-[15px] text-white/55 max-w-md leading-relaxed">
            {t("auth.showcase.description")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-auto mb-5">
          <FeatureCard
            icon={FolderKanban}
            title={t("auth.showcase.features.projects.title")}
            description={t("auth.showcase.features.projects.description")}
          />
          <FeatureCard
            icon={Package}
            title={t("auth.showcase.features.procurement.title")}
            description={t("auth.showcase.features.procurement.description")}
          />
          <FeatureCard
            icon={CircleDollarSign}
            title={t("auth.showcase.features.finance.title")}
            description={t("auth.showcase.features.finance.description")}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutShowcase;
