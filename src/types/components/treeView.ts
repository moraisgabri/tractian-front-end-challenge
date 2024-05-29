import { StaticImageData } from "next/image";

export interface TreeViewNode extends Asset {
  name: string;
  key: string;
  children: TreeViewNode[];
  type: "component" | "asset" | "location";
  collapsable?: boolean;
}

export enum NodeType {
  Location = "location",
  Component = "component",
  Asset = "asset",
}

export enum TreeViewActionType {
  DefaultTree = "DEFAULT_TREE",
  Toggle = "TOGGLE",
  ExpandAll = "EXPAND_ALL",
  CollapseAll = "COLLAPSE_ALL",
  SearchByName = "SEARCH_BY_NAME",
  SearchByFilter = "SEARCH_BY_FILTER",
}

export type TreeNodeType = "location" | "component" | "asset";
