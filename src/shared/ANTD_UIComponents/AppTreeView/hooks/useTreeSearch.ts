import { useState, useMemo, type Key } from "react";
import type { TreeDataNode } from "antd";

interface SearchableTreeNode extends TreeDataNode {
  code?: string;
  name?: string;
}

export const useTreeSearch = (treeData: TreeDataNode[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const collectAllKeys = (nodes: TreeDataNode[]): Key[] => {
    const keys: Key[] = [];

    const traverse = (items: TreeDataNode[]) => {
      items.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);
    return keys;
  };

  const filterTreeNodes = (
    nodes: TreeDataNode[],
    query: string
  ): TreeDataNode[] => {
    if (!query.trim()) return nodes;

    const lowerQuery = query.toLowerCase().trim();

    return nodes.reduce<TreeDataNode[]>((acc, node) => {
      const nodeData = node as SearchableTreeNode;
      const title = typeof node.title === "string" ? node.title : "";
      const code = nodeData.code ?? "";
      const name = nodeData.name ?? "";

      // Check if current node matches
      const matches =
        title.toLowerCase().includes(lowerQuery) ||
        code.toLowerCase().includes(lowerQuery) ||
        name.toLowerCase().includes(lowerQuery);

      // Recursively filter children
      const filteredChildren = node.children
        ? filterTreeNodes(node.children, query)
        : [];

      // Include node if it matches or has matching children
      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: node.children ? filteredChildren : undefined,
        });
      }

      return acc;
    }, []);
  };

  // Memoize filtered tree data for performance
  const filteredTreeData = useMemo(
    () => filterTreeNodes(treeData, searchQuery),
    [treeData, searchQuery]
  );

  // Auto-expand all nodes when searching
  const autoExpandedKeys = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    return collectAllKeys(filteredTreeData);
  }, [filteredTreeData, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    filteredTreeData,
    autoExpandedKeys,
    handleSearchChange,
    clearSearch,
  };
};
