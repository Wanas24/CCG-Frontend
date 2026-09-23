interface IEmptyStateViewProps {
  emptyStateText: string;
  FolderView?: boolean;
}

function AppEmptyDataView({
  emptyStateText,
  FolderView = false,
}: IEmptyStateViewProps) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-2 p-3 rounded-[10px] mt-5">
      <img
        src={
          FolderView
            ? "/assets/empty/EmptyFolder.webp"
            : "/assets/empty/emptySearch.webp"
        }
        alt="empty-state"
        className="w-[270px] h-[270px] object-contain"
      />
      <span className="text-base font-normal text-(--Grey800) mt-4">
        {emptyStateText}
      </span>
    </div>
  );
}

export default AppEmptyDataView;
