import { TreeViewNode } from "@/types/components/treeView";
import { makeNodeTree, makeNodeTreeBySearchName } from "./makeTree";

export const toggleNode = (
  nodes: TreeViewNode[],
  id: string,
  expanded: boolean
): TreeViewNode[] => {
  return nodes.map((node: TreeViewNode) => {
    if (node.id === id) {
      return { ...node, isExpanded: expanded };
    }
    if (node.children) {
      return { ...node, children: toggleNode(node.children, id, expanded) };
    }
    return node;
  });
};

export const updateAllNodes = (
  nodes: TreeViewNode[],
  isExpanded: boolean
): TreeViewNode[] => {
  return nodes.map((node) => {
    if (node.children) {
      return {
        ...node,
        isExpanded,
        children: updateAllNodes(node.children, isExpanded),
      };
    }
    return { ...node, isExpanded };
  });
};

export const searchNodes = (
  assets: Asset[],
  locations: Location[],
  config: {
    filterEnergyComponent: boolean;
    filterAlertStatus: boolean;
    searchName?: string;
  }
) => {
  if (
    !config.filterAlertStatus &&
    !config.filterEnergyComponent &&
    !config.searchName
  ) {
    return makeNodeTree(locations, assets);
  }

  const newTree = makeNodeTree(locations, assets, config);

  return newTree;
};

export const searchNodesByName = (
  assets: Asset[],
  locations: Location[],
  config: {
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
    searchName?: string;
  }
) => {
  if (!config.searchName) {
    return makeNodeTree(locations, assets);
  }

  const newTree = makeNodeTreeBySearchName(locations, assets, {
    searchName: config.searchName,
  });

  return newTree;
};
