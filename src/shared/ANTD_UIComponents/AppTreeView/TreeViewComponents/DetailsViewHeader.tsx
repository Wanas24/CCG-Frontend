import { type ReactNode } from "react";
import { Popconfirm } from "antd";
import { Save, Trash2 } from "lucide-react";
import { AppButton } from "../../AppButton/AppButton";

interface DetailsViewHeaderProps {
  isLoading?: boolean;
  isUpdating?: boolean;
  isDirty?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  detailsText: string;
  saveText: string;
  HeaderChildren?: ReactNode;
  childrenDirection?: "after" | "before";
  confirmTitle?: string;
  confirmDescription?: string;
}

const DetailsViewHeader = ({
  isLoading = false,
  isUpdating = false,
  isDirty = false,
  onSave,
  onDelete,
  detailsText,
  saveText,
  HeaderChildren,
  childrenDirection = "before",
  confirmTitle = "Are you sure you want to delete?",
  confirmDescription,
}: DetailsViewHeaderProps) => {
  return (
    <div className="w-full flex justify-between items-center mb-4">
      <span className="text-base font-normal text-(--app-text)">
        {detailsText}
      </span>
      <div className="flex items-center gap-3">
        {childrenDirection === "before" && HeaderChildren}

        <AppButton
          variant="secondary"
          loading={isUpdating}
          icon={<Save className="size-4" />}
          iconPlacement="start"
          onClick={onSave}
          disabled={isUpdating || isLoading || !isDirty}
        >
          {saveText}
        </AppButton>

        <Popconfirm
          title={confirmTitle}
          description={confirmDescription}
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
          disabled={!onDelete}
        >
          <button
            type="button"
            className="flex size-8 items-center justify-center cursor-pointer border-0 bg-transparent p-0"
            disabled={!onDelete}
          >
            <Trash2 className="size-5 text-(--statusR200)" />
          </button>
        </Popconfirm>

        {childrenDirection === "after" && HeaderChildren}
      </div>
    </div>
  );
};

export default DetailsViewHeader;
