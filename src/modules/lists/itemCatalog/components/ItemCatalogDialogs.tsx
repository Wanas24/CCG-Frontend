import { useTranslation } from "react-i18next";
import { AppButton, AppDialog } from "@/shared/ANTD_UIComponents";
import type { TItemCategory, TItemCategoryFile } from "../types/itemCategory";

type DeleteItemProps = {
  item: TItemCategory | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ItemCategoryDeleteDialog = ({
  item,
  loading,
  onConfirm,
  onClose,
}: DeleteItemProps) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(item)}
      title={t("lists.itemCatalog.deleteTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("lists.itemCatalog.deleteConfirm", { name: item?.name ?? "" })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" onClick={onClose}>
          {t("lists.common.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("lists.itemCatalog.delete")}
        </AppButton>
      </div>
    </AppDialog>
  );
};

type DeleteFileProps = {
  file: TItemCategoryFile | null;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const ItemCategoryFileDeleteDialog = ({
  file,
  loading,
  onConfirm,
  onClose,
}: DeleteFileProps) => {
  const { t } = useTranslation();

  return (
    <AppDialog
      open={Boolean(file)}
      title={t("lists.itemCatalog.deleteFileTitle")}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <p className="m-0 text-sm text-(--Grey600)">
        {t("lists.itemCatalog.deleteFileConfirm", {
          name: file?.fileName ?? "",
        })}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <AppButton variant="secondary" onClick={onClose}>
          {t("lists.common.cancel")}
        </AppButton>
        <AppButton variant="delete" loading={loading} onClick={onConfirm}>
          {t("lists.itemCatalog.deleteFile")}
        </AppButton>
      </div>
    </AppDialog>
  );
};
