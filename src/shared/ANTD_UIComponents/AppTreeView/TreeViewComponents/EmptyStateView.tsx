import { FolderPlus, Plus } from "lucide-react";
import { AppButton } from "../../AppButton/AppButton";
import AppEmptyView from "../../AppEmptyView/AppEmptyView";

interface EmptyStateViewProps<T extends string> {
  onOpenModal?: (type: T) => void;
  emptyStateText: string;
  addMainButtonText: string;
  addSubButtonText: string;
  mainModalType: T;
  subModalType: T;
  showButtons?: boolean;
}

function EmptyStateView<T extends string>({
  onOpenModal,
  emptyStateText,
  addMainButtonText,
  addSubButtonText,
  mainModalType,
  subModalType,
  showButtons = true,
}: EmptyStateViewProps<T>) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <AppEmptyView emptyStateText={emptyStateText} FolderView />
      {showButtons && (
        <div className="grid grid-cols-2 items-center gap-2">
          <AppButton
            variant="primary"
            icon={<FolderPlus className="size-4" />}
            iconPlacement="start"
            onClick={() => onOpenModal?.(mainModalType)}
          >
            {addMainButtonText}
          </AppButton>
          <AppButton
            variant="secondary"
            icon={<Plus className="size-4" />}
            iconPlacement="start"
            onClick={() => onOpenModal?.(subModalType)}
          >
            {addSubButtonText}
          </AppButton>
        </div>
      )}
    </div>
  );
}

export default EmptyStateView;
