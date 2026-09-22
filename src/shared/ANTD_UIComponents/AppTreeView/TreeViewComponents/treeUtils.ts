import type { TreeDataNode } from "antd";

export interface TreeNode {
    id: number;
    name: string;
    code?: string;
    description?: string;
    isMain?: boolean;
    children?: TreeNode[];
}

export const transformToTreeData = <T extends TreeNode>(items: T[]): TreeDataNode[] => {
    return items.map((item) => ({
        ...item,
        title: item.name,
        key: item.id.toString(),
        children: item.children?.length ? transformToTreeData(item.children as T[]) : undefined,
    }));
};

export const findNodeById = <T extends TreeNode>(
    items: T[],
    id: string
): T | null => {
    for (const item of items) {
        if (item.id.toString() === id) return item;
        if (item.children?.length) {
            const found = findNodeById(item.children as T[], id);
            if (found) return found;
        }
    }
    return null;
};

export const findParentMainNode = <T extends TreeNode>(
    items: T[],
    targetId: string,
    parentMainNode: T | null = null
): T | null => {
    for (const item of items) {
        // If this is the target node
        if (item.id.toString() === targetId) {
            // If the target itself is a Main node, return it
            if (item.isMain) return item;
            // Otherwise, return the parent Main node
            return parentMainNode;
        }

        // Track if this is a Main node for children
        const currentMainNode = item.isMain ? item : parentMainNode;

        // Search in children
        if (item.children?.length) {
            const found = findParentMainNode(item.children as T[], targetId, currentMainNode);
            if (found !== null) return found;
        }
    }
    return null;
};

// Find the direct parent node in the tree (not just the main parent)
export const findDirectParent = <T extends TreeNode>(
    items: T[],
    targetId: string
): T | null => {
    for (const item of items) {
        // Check if any child matches the target
        if (item.children?.some(child => child.id.toString() === targetId)) {
            return item;
        }
        // Recursively search in children
        if (item.children?.length) {
            const found = findDirectParent(item.children as T[], targetId);
            if (found) return found;
        }
    }
    return null;
};
