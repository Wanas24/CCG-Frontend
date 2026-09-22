import type { Key } from "react";
import type { MenuProps, TreeDataNode } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PlusCircle } from "lucide-react";

interface TreeDataNodeWithMain extends TreeDataNode {
  isMain?: boolean;
}

interface UseTreeContextMenuProps {
  addLabel: string;
  editLabel: string;
  deleteLabel: string;
}

export const useTreeContextMenu = ({
  addLabel,
  editLabel,
  deleteLabel,
}: UseTreeContextMenuProps) => {
  const getContextMenu = (
    _nodeKey: Key,
    nodeData?: TreeDataNode,
  ): MenuProps => {
    const isMain = (nodeData as TreeDataNodeWithMain)?.isMain === true;

    const menuItems: MenuProps["items"] = [];

    if (isMain) {
      menuItems.push({
        key: "add",
        className: "text-base!",
        label: addLabel,
        icon: <PlusCircle className="size-4" />,
      });
    }

    menuItems.push(
      {
        key: "edit",
        label: editLabel,
        className: "text-base!",
        icon: <EditOutlined />,
      },
      {
        type: "divider",
      },
      {
        key: "delete",
        className: "text-(--statusR200)! text-base!",
        label: deleteLabel,
        icon: <DeleteOutlined />,
      },
    );

    return { items: menuItems };
  };

  return { getContextMenu };
};
