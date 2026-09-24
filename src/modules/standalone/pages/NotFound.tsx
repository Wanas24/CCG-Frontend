import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Home, LogIn } from "lucide-react";
import { AppButton } from "@/shared/ANTD_UIComponents";
import { AUTH_ROUTES } from "@/modules/authentication/routes/paths";
import { APP_ROUTES } from "@/modules/standalone/routes/paths";

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("CCG_TOKEN"));

  return (
    <main className="relative flex w-full flex-1 flex-col h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,var(--Primary100)_0%,transparent_55%),radial-gradient(ellipse_at_85%_90%,var(--Secondary300)_0%,transparent_45%),linear-gradient(165deg,var(--app-bg)_0%,var(--Grey100)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-112 -translate-x-1/2 rounded-full bg-(--Primary300)/10 blur-3xl animate-[notFoundGlow_8s_ease-in-out_infinite]"
      />

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <p
          aria-hidden
          className="select-none text-[clamp(7rem,28vw,14rem)] leading-none font-semibold tracking-tighter text-(--Primary400)/10 animate-[notFoundFloat_6s_ease-in-out_infinite]"
        >
          404
        </p>

        <div className="-mt-10 flex max-w-lg flex-col items-center gap-4 sm:-mt-14 animate-[notFoundRise_0.7s_ease-out_both]">
          <h1 className="text-5xl font-semibold tracking-wide text-(--Primary400) sm:text-6xl">
            {t("common.appName")}
          </h1>
          <p className="text-xl font-medium text-(--app-text) sm:text-2xl">
            {t("notFound.title")}
          </p>
          <p className="text-base text-(--Grey600) sm:text-lg">
            {t("notFound.description")}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to={APP_ROUTES.home}>
                <AppButton variant="primary" icon={<Home size={18} />}>
                  {t("notFound.goHome")}
                </AppButton>
              </Link>
            ) : (
              <Link to={AUTH_ROUTES.login}>
                <AppButton variant="primary" icon={<LogIn size={18} />}>
                  {t("notFound.goLogin")}
                </AppButton>
              </Link>
            )}
            <AppButton variant="secondary" onClick={() => navigate(-1)}>
              {t("common.back")}
            </AppButton>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
