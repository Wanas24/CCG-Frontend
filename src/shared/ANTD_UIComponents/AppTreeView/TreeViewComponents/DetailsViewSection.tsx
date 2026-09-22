import type { ReactNode } from "react";
import DetailsViewHeader from "./DetailsViewHeader";
import EmptyStateView from "./EmptyStateView";

interface DetailsViewSectionProps<TModalType extends string> {
  isLoading: boolean;
  selectedNodeId: string | null;
  isUpdating: boolean;
  isDirty?: boolean;
  onSave: () => void;
  onDelete: () => void;
  onOpenModal?: (type: TModalType) => void;
  detailsText: string;
  saveText: string;
  emptyStateText: string;
  addMainButtonText: string;
  addSubButtonText: string;
  mainModalType: TModalType;
  subModalType: TModalType;
  formComponent: ReactNode;
  HeaderChildren?: ReactNode;
  childrenDirection?: "after" | "before";
  showButtons?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

function DetailsViewSection<TModalType extends string>({
  isLoading,
  selectedNodeId,
  isUpdating,
  isDirty = false,
  onSave,
  onDelete,
  onOpenModal,
  detailsText,
  saveText,
  emptyStateText,
  addMainButtonText,
  addSubButtonText,
  mainModalType,
  subModalType,
  formComponent,
  HeaderChildren,
  childrenDirection,
  showButtons = true,
  confirmTitle,
  confirmDescription,
}: DetailsViewSectionProps<TModalType>) {
  return (
    <div className="bg-(--Grey200) w-[65%] rounded-2xl p-4">
      {isLoading || selectedNodeId ? (
        <>
          <DetailsViewHeader
            isLoading={isLoading}
            isUpdating={isUpdating}
            isDirty={isDirty}
            onSave={selectedNodeId ? onSave : undefined}
            onDelete={selectedNodeId ? onDelete : undefined}
            detailsText={detailsText}
            saveText={saveText}
            HeaderChildren={HeaderChildren}
            childrenDirection={childrenDirection}
            confirmTitle={confirmTitle}
            confirmDescription={confirmDescription}
          />
          {formComponent}
        </>
      ) : (
        <EmptyStateView
          onOpenModal={onOpenModal}
          emptyStateText={emptyStateText}
          addMainButtonText={addMainButtonText}
          addSubButtonText={addSubButtonText}
          mainModalType={mainModalType}
          subModalType={subModalType}
          showButtons={showButtons}
        />
      )}
    </div>
  );
}

export default DetailsViewSection;
