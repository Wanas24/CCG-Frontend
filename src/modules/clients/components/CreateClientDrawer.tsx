import type { BaseSyntheticEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ClientFormValues } from "../schemas/clientFormSchema";
import ClientFormDrawer from "./ClientFormDrawer";

type Props = {
  open: boolean;
  form: UseFormReturn<ClientFormValues>;
  loading?: boolean;
  onSubmit: (event?: BaseSyntheticEvent) => Promise<void>;
  onClose: () => void;
};

const CreateClientDrawer = ({
  open,
  form,
  loading,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation();

  return (
    <ClientFormDrawer
      open={open}
      form={form}
      formId="create-client-form"
      title={t("clients.form.createTitle")}
      subtitle={t("clients.form.createSubtitle")}
      submitLabel={t("clients.form.create")}
      loading={loading}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
};

export default CreateClientDrawer;
