import { useState, useMemo, useCallback } from "react";
import { Tree, Dropdown } from "antd";
import type { TreeDataNode, MenuProps, TreeProps } from "antd";
import type { ReactNode, Key, MouseEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import TreeSkeleton from "./TreeSkeleton";
import "./styles.css";

export interface AppTreeViewProps extends Omit<
  TreeProps,
  | "treeData"
  | "expandedKeys"
  | "selectedKeys"
  | "titleRender"
  | "showIcon"
  | "switcherIcon"
> {
  treeData: TreeDataNode[];
  getContextMenu: (nodeKey: Key, nodeData?: TreeDataNode) => MenuProps;
  onNodeSelect?: (nodeId: string) => void;
  onAdd?: (parentNodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onDelete?: (nodeId: string) => void;
  emptyState?: ReactNode;
  emptyStateImage?: string;
  emptyStateText?: string;
  renderNodeContent?: (nodeData: TreeDataNode, title: ReactNode) => ReactNode;
  controlledExpandedKeys?: Key[];
  renderIcon?: (nodeData: TreeDataNode, isExpanded: boolean) => ReactNode;
  mainIcon?: ReactNode;
  subIcon?: ReactNode;
  className?: string;
  loading?: boolean;
}

interface ExtendedTreeDataNode extends TreeDataNode {
  isMain?: boolean;
}

const defaultFolderIconClassName = "size-4 text-(--Primary400)";
const MAX_TITLE_LENGTH = 25;

export const AppTreeView = ({
  treeData,
  getContextMenu,
  onNodeSelect,
  onAdd,
  onEdit,
  onDelete,
  emptyState,
  emptyStateImage,
  emptyStateText,
  renderNodeContent,
  controlledExpandedKeys,
  renderIcon,
  mainIcon,
  subIcon,
  className,
  loading = false,
  onSelect: antdOnSelect,
  onExpand: antdOnExpand,
  ...restTreeProps
}: AppTreeViewProps) => {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [isRightClicking, setIsRightClicking] = useState(false);

  const expandedKeys = controlledExpandedKeys ?? internalExpandedKeys;

  const handleContextMenuOpen = useCallback(
    (nodeKey: Key) => {
      setIsRightClicking(true);
      setSelectedKeys([nodeKey]);

      if (onNodeSelect) {
        onNodeSelect(nodeKey.toString());
      }
    },
    [onNodeSelect],
  );

  const handleSelect = useCallback(
    (keys: Key[], info: Parameters<NonNullable<TreeProps["onSelect"]>>[1]) => {
      if (isRightClicking) {
        setIsRightClicking(false);
        return;
      }

      setSelectedKeys(keys);

      if (keys.length > 0 && onNodeSelect) {
        onNodeSelect(keys[0].toString());
      }

      antdOnSelect?.(keys, info);
    },
    [isRightClicking, onNodeSelect, antdOnSelect],
  );

  const handleExpand = useCallback(
    (keys: Key[], info: Parameters<NonNullable<TreeProps["onExpand"]>>[1]) => {
      if (controlledExpandedKeys === undefined) {
        setInternalExpandedKeys(keys);
      }

      antdOnExpand?.(keys, info);
    },
    [controlledExpandedKeys, antdOnExpand],
  );

  const toggleNode = useCallback(
    (nodeKey: Key, e?: MouseEvent) => {
      e?.stopPropagation();
      if (controlledExpandedKeys === undefined) {
        setInternalExpandedKeys((prev) =>
          prev.includes(nodeKey)
            ? prev.filter((key) => key !== nodeKey)
            : [...prev, nodeKey],
        );
      }
    },
    [controlledExpandedKeys],
  );

  const handleMenuClick = useCallback(
    (key: string, nodeKey: Key) => {
      const nodeId = nodeKey.toString();

      switch (key) {
        case "add":
          onAdd?.(nodeId);
          break;
        case "edit":
          onNodeSelect?.(nodeId);
          onEdit?.(nodeId);
          break;
        case "delete":
          onDelete?.(nodeId);
          break;
      }
    },
    [onAdd, onNodeSelect, onEdit, onDelete],
  );

  const processContextMenu = useCallback(
    (menu: MenuProps, nodeKey: Key): MenuProps => ({
      ...menu,
      onClick: (info) => {
        const { key } = info;

        if (key === "add" || key === "edit" || key === "delete") {
          handleMenuClick(key as string, nodeKey);
        }

        menu.onClick?.(info);
      },
    }),
    [handleMenuClick],
  );

  const renderNodeIcon = useCallback(
    (node: ExtendedTreeDataNode, isExpanded: boolean) => {
      if (renderIcon) {
        return renderIcon(node, isExpanded);
      }

      const hasChildren = Boolean(node.children?.length);

      if (hasChildren) {
        return (
          <span
            className="cursor-pointer!"
            onClick={(e) => toggleNode(node.key, e)}
          >
            {mainIcon ??
              (isExpanded ? (
                <FolderOpen className={defaultFolderIconClassName} />
              ) : (
                <Folder className={defaultFolderIconClassName} />
              ))}
          </span>
        );
      }

      return subIcon ?? <File className="size-4 text-(--Grey700)" />;
    },
    [toggleNode, renderIcon, mainIcon, subIcon],
  );

  const treeDataWithIcons = useMemo(() => {
    const addIcons = (nodes: TreeDataNode[]): TreeDataNode[] => {
      return nodes.map((node) => {
        const extendedNode = node as ExtendedTreeDataNode;
        const isExpanded = expandedKeys.includes(node.key);
        const processedChildren = node.children
          ? addIcons(node.children)
          : undefined;

        const contextMenu = getContextMenu(node.key, node);
        const processedMenu = processContextMenu(contextMenu, node.key);

        return {
          ...node,
          icon: (
            <Dropdown
              menu={processedMenu}
              trigger={["contextMenu"]}
              onOpenChange={(open) => {
                if (open) {
                  handleContextMenuOpen(node.key);
                }
              }}
            >
              <span>{renderNodeIcon(extendedNode, isExpanded)}</span>
            </Dropdown>
          ),
          children: processedChildren,
        };
      });
    };

    return addIcons(treeData);
  }, [
    expandedKeys,
    treeData,
    getContextMenu,
    processContextMenu,
    handleContextMenuOpen,
    renderNodeIcon,
  ]);

  const handleTitleClick = useCallback(
    (nodeData: TreeDataNode, e: MouseEvent) => {
      const hasChildren = nodeData.children && nodeData.children.length > 0;

      if (onNodeSelect) {
        onNodeSelect(nodeData.key.toString());
        setSelectedKeys([nodeData.key]);
      }

      if (hasChildren) {
        toggleNode(nodeData.key, e);
      }
    },
    [onNodeSelect, toggleNode],
  );

  const titleRender = useCallback(
    (nodeData: TreeDataNode): ReactNode => {
      const contextMenu = getContextMenu(nodeData.key, nodeData);
      const processedMenu = processContextMenu(contextMenu, nodeData.key);
      const title =
        typeof nodeData.title === "function"
          ? nodeData.title(nodeData)
          : nodeData.title;
      const truncatedTitle =
        typeof title === "string" && title.length > MAX_TITLE_LENGTH
          ? `${title.slice(0, MAX_TITLE_LENGTH)}...`
          : title;

      const content = renderNodeContent
        ? renderNodeContent(nodeData, truncatedTitle)
        : truncatedTitle;

      return (
        <Dropdown
          menu={processedMenu}
          trigger={["contextMenu"]}
          onOpenChange={(open) => {
            if (open) {
              handleContextMenuOpen(nodeData.key);
            }
          }}
        >
          <span
            onClick={(e) => handleTitleClick(nodeData, e)}
            onContextMenu={() => setIsRightClicking(true)}
            className="cursor-pointer px-2 inline-flex max-w-full min-w-0"
            title={typeof title === "string" ? title : undefined}
          >
            <span className="block truncate">{content}</span>
          </span>
        </Dropdown>
      );
    },
    [
      getContextMenu,
      processContextMenu,
      handleContextMenuOpen,
      handleTitleClick,
      renderNodeContent,
    ],
  );

  if (loading) {
    return <TreeSkeleton />;
  }

  if (treeData.length === 0) {
    if (emptyState) {
      return <>{emptyState}</>;
    }

    return (
      <div className="flex items-center justify-center h-full flex-col gap-2">
        {emptyStateImage && (
          <img
            src={emptyStateImage}
            alt="empty-state"
            className="w-[270px] h-[270px] object-contain"
          />
        )}
        {emptyStateText && (
          <span className="text-base font-normal text-(--Grey800)">
            {emptyStateText}
          </span>
        )}
      </div>
    );
  }

  return (
    <Tree
      {...restTreeProps}
      className={
        className ??
        "max-h-[500px] overflow-y-auto custom-scrollbar my-tree p-3! bg-(--naturalWhite)! rounded-xl!"
      }
      showLine
      showIcon
      switcherIcon={({ expanded }) =>
        expanded ? (
          <ChevronDown className="size-4 text-(--Grey700)" />
        ) : (
          <ChevronRight className="size-4 text-(--Grey700)" />
        )
      }
      expandedKeys={expandedKeys}
      onExpand={handleExpand}
      onSelect={handleSelect}
      selectedKeys={selectedKeys}
      treeData={treeDataWithIcons}
      titleRender={titleRender}
    />
  );
};

export default AppTreeView;
