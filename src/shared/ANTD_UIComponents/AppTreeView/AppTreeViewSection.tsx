import { Divider } from "antd";
import type { TreeDataNode, MenuProps } from "antd";
import type { ReactNode, Key } from "react";
import { Search } from "lucide-react";
import { AppInput } from "../AppInput";
import { AppTreeView } from "./AppTreeView";
import { useTreeSearch } from "./hooks/useTreeSearch";
import TreeSkeleton from "./TreeSkeleton";

export interface AppTreeViewSectionProps {
  isLoading: boolean;
  treeData: TreeDataNode[];
  getContextMenu: (nodeKey: Key, nodeData?: TreeDataNode) => MenuProps;
  onNodeSelect?: (nodeId: string) => void;
  onAdd?: (parentNodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  searchPlaceholder?: string;
  searchAllowClear?: boolean;
  emptyState?: ReactNode;
  emptyStateImage?: string;
  emptyStateText?: string;
  skeletonComponent?: ReactNode;
  className?: string;
  treeClassName?: string;
  renderNodeContent?: (nodeData: TreeDataNode, title: ReactNode) => ReactNode;
  renderIcon?: (nodeData: TreeDataNode, isExpanded: boolean) => ReactNode;
  mainIcon?: ReactNode;
  subIcon?: ReactNode;
}

export const AppTreeViewSection = ({
  isLoading,
  treeData,
  getContextMenu,
  onNodeSelect,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder,
  searchAllowClear = true,
  emptyState,
  emptyStateImage,
  emptyStateText,
  skeletonComponent,
  className = "bg-(--Grey200) w-full rounded-2xl p-4",
  treeClassName = "bg-(--naturalWhite) rounded-xl p-4",
  renderNodeContent,
  renderIcon,
  mainIcon,
  subIcon,
}: AppTreeViewSectionProps) => {
  const {
    searchQuery,
    filteredTreeData,
    autoExpandedKeys,
    handleSearchChange,
  } = useTreeSearch(treeData);

  return (
    <div className={className}>
      {searchPlaceholder && (
        <>
          <AppInput
            placeholder={searchPlaceholder}
            allowClear={searchAllowClear}
            onChange={handleSearchChange}
            value={searchQuery}
            prefix={<Search className="size-4 text-(--Grey700)" />}
          />
          <Divider orientation="horizontal" className="bg-(--Grey400)! mt-4!" />
        </>
      )}

      <div className={treeClassName}>
        {isLoading ? (
          (skeletonComponent ?? (
            <div className="flex flex-col gap-3">
              <TreeSkeleton />
            </div>
          ))
        ) : (
          <AppTreeView
            treeData={filteredTreeData}
            getContextMenu={getContextMenu}
            onNodeSelect={onNodeSelect}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            emptyState={emptyState}
            emptyStateImage={emptyStateImage}
            emptyStateText={emptyStateText}
            renderNodeContent={renderNodeContent}
            controlledExpandedKeys={autoExpandedKeys}
            renderIcon={renderIcon}
            mainIcon={mainIcon}
            subIcon={subIcon}
          />
        )}
      </div>
    </div>
  );
};

export default AppTreeViewSection;
