import { TreeViewNode } from "@/types/components/treeView";
import { nodeHasName } from "./nodeHasName";

export function handleAssets(
  rawAssets: Asset[],
  searchConfig?: {
    searchName?: string;
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
  }
): {
  componentsWithAssetParent: TreeViewNode[];
  componentsWithLocationParent: TreeViewNode[];
  firstLevelComponents: TreeViewNode[];
  components: Asset[];
  assets: Asset[];
} {
  const componentsWithAssetParent: TreeViewNode[] = [];
  const componentsWithLocationParent: TreeViewNode[] = [];

  const firstLevelComponents: TreeViewNode[] = [];
  let unCollapsable: boolean = searchConfig ? true : false;

  let components = rawAssets.filter((asset) => asset.sensorType);
  const assets = rawAssets
    .filter((asset) => !asset.sensorType)
    .map((asset) => ({ ...asset, type: "asset" }));

  if (searchConfig) {
    let alertStatusComponents: any = [];
    let energyComponents: any = [];

    if (searchConfig.filterEnergyComponent) {
      energyComponents = components.filter((component) => {
        return (
          component.sensorType === "energy" && component.status === "operating"
        );
      });
    }

    if (searchConfig.filterAlertStatus) {
      alertStatusComponents = components.filter((component) => {
        return component.status === "alert";
      });
    }

    components = [...alertStatusComponents, ...energyComponents];
  }

  const iterableAssets = searchConfig ? [...components, ...assets] : rawAssets;

  for (const asset of iterableAssets) {
    if (!asset.parentId && !asset.locationId) {
      firstLevelComponents.push({
        ...asset,
        children: [],
        key: asset.id,
        type: asset.sensorType ? "component" : "asset",
      });
      continue;
    }

    if (asset.sensorType) {
      // component
      if (asset.parentId) {
        componentsWithAssetParent.push({
          ...asset,
          children: [],
          key: asset.id,
          type: "component",
          collapsable: !unCollapsable,
        });
        continue;
      }

      componentsWithLocationParent.push({
        ...asset,
        children: [],
        key: asset.id,
        type: "component",
        collapsable: !unCollapsable,
      });
      continue;
    }
  }

  return {
    componentsWithAssetParent,
    componentsWithLocationParent,
    firstLevelComponents,
    components,
    assets,
  };
}

export function handleAssetsByName(
  rawAssets: Asset[],
  searchConfig: {
    searchName: string;
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
  }
): {
  componentsWithAssetParent: TreeViewNode[];
  componentsWithLocationParent: TreeViewNode[];
  firstLevelComponents: TreeViewNode[];
  components: Asset[];
  assets: Asset[];
} {
  const componentsWithAssetParent: TreeViewNode[] = [];
  const componentsWithLocationParent: TreeViewNode[] = [];
  const firstLevelComponents: TreeViewNode[] = [];

  let components = rawAssets.filter((asset) => asset.sensorType);
  const assets = rawAssets
    .filter((asset) => !asset.sensorType)
    .map((asset) => ({ ...asset, type: "asset" }));

  const iterableAssets = rawAssets;

  for (const asset of iterableAssets) {
    const matchName = nodeHasName(asset, searchConfig.searchName);

    if (!asset.parentId && !asset.locationId) {
      firstLevelComponents.push({
        ...asset,
        matchName,
        hidden: !matchName,
        children: [],
        key: asset.id,
        type: asset.sensorType ? "component" : "asset",
      });
      continue;
    }

    if (asset.sensorType) {
      // component
      if (asset.parentId) {
        componentsWithAssetParent.push({
          ...asset,
          matchName,
          hidden: !matchName,
          children: [],
          key: asset.id,
          type: "component",
        });
        continue;
      }

      componentsWithLocationParent.push({
        ...asset,
        matchName,
        children: [],
        key: asset.id,
        hidden: !matchName,
        type: "component",
      });
      continue;
    }
  }

  return {
    componentsWithAssetParent,
    componentsWithLocationParent,
    firstLevelComponents,
    components,
    assets,
  };
}
