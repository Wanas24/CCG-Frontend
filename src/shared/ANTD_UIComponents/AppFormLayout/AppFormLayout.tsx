import type { ReactNode } from "react";
import clsx from "clsx";
import AppRoundedContainer from "../AppRoundedContainer";
import AppDivider from "../AppDivider";

export type AppFormHeaderProps = {
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export const AppFormHeader = ({
  title,
  actions,
  className,
  titleClassName = "font-semibold",
}: AppFormHeaderProps) => {
  if (!title && !actions) return null;

  return (
    <div className={clsx("flex items-center justify-between", className)}>
      {title &&
        (typeof title === "string" ? (
          <span className={clsx("text-(--app-text)", titleClassName)}>
            {title}
          </span>
        ) : (
          title
        ))}
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
};

export type AppFormFieldsProps = {
  children: ReactNode;
  className?: string;
};

export const AppFormFields = ({ children, className }: AppFormFieldsProps) => (
  <div className={clsx("flex flex-col gap-4", className)}>{children}</div>
);

export type AppFormSectionProps = {
  children: ReactNode;
  className?: string;
};

export const AppFormSection = ({
  children,
  className,
}: AppFormSectionProps) => (
  <AppRoundedContainer
    whiteBG
    className={clsx("flex flex-col gap-4", className)}
  >
    {children}
  </AppRoundedContainer>
);

export type AppFormPanelProps = {
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  showDivider?: boolean;
};

export const AppFormPanel = ({
  children,
  title,
  actions,
  className,
  titleClassName,
  showDivider = true,
}: AppFormPanelProps) => {
  const hasHeader = Boolean(title || actions);

  return (
    <AppRoundedContainer className={className}>
      {hasHeader && (
        <>
          <AppFormHeader
            title={title}
            actions={actions}
            titleClassName={titleClassName}
          />
          {showDivider && <AppDivider />}
        </>
      )}
      {children}
    </AppRoundedContainer>
  );
};

export type AppFormSplitProps = {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarWidth?: string;
  mainWidth?: string;
  className?: string;
};

export const AppFormSplit = ({
  sidebar,
  children,
  sidebarWidth = "25%",
  mainWidth = "75%",
  className,
}: AppFormSplitProps) => (
  <div className={clsx("flex h-fit w-full justify-between gap-4", className)}>
    <div className="shrink-0" style={{ width: sidebarWidth }}>
      {sidebar}
    </div>
    <div className="min-w-0" style={{ width: mainWidth }}>
      {children}
    </div>
  </div>
);

export type AppFormPageProps = {
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  bodyClassName?: string;
  titleClassName?: string;
  elevated?: boolean;
};

export const AppFormPage = ({
  children,
  title,
  actions,
  toolbar,
  className,
  bodyClassName,
  titleClassName,
  elevated = true,
}: AppFormPageProps) => {
  const hasHeader = Boolean(title || actions);

  return (
    <AppRoundedContainer
      className={clsx(
        "h-full w-full",
        elevated && "bg-(--app-surface) shadow",
        className,
      )}
    >
      {hasHeader && (
        <>
          <AppFormHeader
            title={title}
            actions={actions}
            titleClassName={titleClassName}
          />
          <AppDivider />
        </>
      )}
      <div className={clsx("w-full", bodyClassName)}>
        {toolbar}
        <div className={clsx("w-full", toolbar && "mt-4")}>{children}</div>
      </div>
    </AppRoundedContainer>
  );
};

const AppFormLayout = {
  Page: AppFormPage,
  Split: AppFormSplit,
  Panel: AppFormPanel,
  Section: AppFormSection,
  Fields: AppFormFields,
  Header: AppFormHeader,
};

export default AppFormLayout;
