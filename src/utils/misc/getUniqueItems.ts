import { TreeViewNode } from "@/types/components/treeView";

export function getUniqueItems(items: TreeViewNode[]) {
  const uniqueIds = new Set(items.map((item) => item.id));

  const itemsWithUniqueIds = [...uniqueIds]
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);

  return itemsWithUniqueIds;
}
