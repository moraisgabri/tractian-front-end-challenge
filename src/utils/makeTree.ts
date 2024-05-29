import { handleAssets, handleAssetsByName } from "./handleAssets";
import { getUniqueItems } from "./getUniqueItems";
import { nodeHasName } from "./nodeHasName";
import { unHideAllNodes } from "./treeViewReducer";

function makeTree(
  nodes: any,
  idKey: string,
  parentId: string | null = null,
  searchConfig?: any
) {
  return nodes
    .filter((node: any) => node[idKey] === parentId)
    .reduce((tree: any[], node: any) => {
      let children = makeTree(nodes, idKey, node.id, searchConfig);

      children = getUniqueItems([...(node.children ?? []), ...children]);

      let baseItemHasUncollapsableChildren = children.some(
        (node: any) => node.collapsable === false
      );

      let isUncollapsable = false;

      if (searchConfig && !baseItemHasUncollapsableChildren) {
        if (searchConfig?.searchName) {
          isUncollapsable = Boolean(
            children.filter((child: any) =>
              child.name
                .toLocaleLowerCase()
                .includes(searchConfig.searchName as string)
            )
          );
        }

        if (searchConfig?.filterAlertStatus) {
          isUncollapsable = isUncollapsable
            ? Boolean(
                children.filter((child: any) => child.status === "alert").length
              )
            : false;
        }

        if (searchConfig?.filterEnergyComponent) {
          isUncollapsable = isUncollapsable
            ? Boolean(
                children.filter(
                  (child: any) =>
                    child.sensorType === "energy" &&
                    child.status === "operating"
                )
              )
            : false;
        }
      }

      return [
        ...tree,
        {
          ...node,
          hidden:
            (Boolean(isUncollapsable && searchConfig) ||
              Boolean(!baseItemHasUncollapsableChildren && searchConfig)) ??
            false,
          isExpanded: isUncollapsable || baseItemHasUncollapsableChildren,
          collapsable:
            baseItemHasUncollapsableChildren || isUncollapsable ? false : true,
          children: children,
        },
      ];
    }, []);
}

function makeTreeBySearchName(
  nodes: any,
  idKey: string,
  parentId: string | null = null,
  searchConfig?: any
) {
  return nodes
    .filter((node: any) => node[idKey] === parentId)
    .reduce((tree: any[], node: any) => {
      let children = makeTreeBySearchName(nodes, idKey, node.id, searchConfig);

      children = getUniqueItems([...(node.children ?? []), ...children]);

      const nodeMatchesName = nodeHasName(node, searchConfig.searchName);

      let childrenHasMatchName = children.some((child: any) => child.matchName);

      if (nodeMatchesName) {
        return [
          ...tree,
          {
            ...node,
            hidden: false,
            isExpanded: childrenHasMatchName ? true : false,
            collapsable: childrenHasMatchName ? false : true,
            matchName: true,
            children: unHideAllNodes(children),
          },
        ];
      }

      return [
        ...tree,
        {
          ...node,
          hidden: !childrenHasMatchName,
          isExpanded: childrenHasMatchName,
          collapsable: !childrenHasMatchName,
          matchName: childrenHasMatchName,
          children,
        },
      ];
    }, []);
}

function makeAssetsTree(
  baseArr: any,
  toMergeArr: any,
  idKey: string,
  searchConfig?: {
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
    searchName?: string;
  }
) {
  return baseArr.reduce((tree: any, node: any) => {
    let children = toMergeArr.filter((item: any) => item[idKey] === node.id);

    children = getUniqueItems([...(node.children ?? []), ...children]);

    let baseItemHasUncollapsableChildren = children.some(
      (node: any) => node.collapsable === false
    );

    let isUncollapsable = false;

    if (searchConfig && !baseItemHasUncollapsableChildren) {
      if (searchConfig?.filterAlertStatus) {
        isUncollapsable = isUncollapsable
          ? Boolean(
              children.filter((child: any) => child.status === "alert").length
            )
          : false;
      }

      if (searchConfig?.filterEnergyComponent) {
        isUncollapsable = isUncollapsable
          ? Boolean(
              children.filter(
                (child: any) =>
                  child.sensorType === "energy" && child.status === "operating"
              )
            )
          : false;
      }
    }

    return [
      ...tree,
      {
        ...node,
        hidden:
          Boolean(
            (baseItemHasUncollapsableChildren || isUncollapsable
              ? false
              : true) && searchConfig
          ) || children.length === 0,
        isExpanded: isUncollapsable || baseItemHasUncollapsableChildren,
        collapsable:
          baseItemHasUncollapsableChildren || isUncollapsable ? false : true,
        children: [...(node.children ?? []), ...children],
      },
    ];
  }, []);
}

export function makeAssetsTreeBySearchName(
  baseArr: any,
  toMergeArr: any,
  idKey: string,
  searchConfig: {
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
    searchName: string;
  }
) {
  return baseArr.reduce((acc: any, baseItem: any) => {
    let children = toMergeArr.filter(
      (item: any) => item[idKey] === baseItem.id
    );

    children = getUniqueItems([...(baseItem.children ?? []), ...children]);

    const nodeMatchesName = nodeHasName(baseItem, searchConfig.searchName);

    let hasMatchName = children.some((child: any) => child.matchName);

    if (nodeMatchesName) {
      return [
        ...acc,
        {
          ...baseItem,
          hidden: false,
          isExpanded: hasMatchName ? true : false,
          collapsable: true,
          matchName: true,
          children,
        },
      ];
    }

    return [
      ...acc,
      {
        ...baseItem,
        hidden: !hasMatchName,
        isExpanded: hasMatchName,
        collapsable: !hasMatchName,
        matchName: hasMatchName,
        children,
      },
    ];
  }, []);
}

export function makeNodeTree(
  locations: Location[],
  assets: Asset[],
  searchConfig?: {
    searchName?: string;
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
  }
) {
  const {
    componentsWithAssetParent,
    componentsWithLocationParent,
    firstLevelComponents,
    assets: assetsList,
  } = handleAssets(assets, searchConfig);

  const locationsWithType = locations.map((location) => ({
    ...location,
    type: "location",
  }));

  const assetListWithComponentChildren = componentsWithAssetParent.length
    ? makeAssetsTree(
        assetsList,
        componentsWithAssetParent,
        "parentId",
        searchConfig
      )
    : assetsList;

  const assetsTree = makeTree(
    assetListWithComponentChildren,
    "parentId",
    null,
    searchConfig
  );

  const locationsWithComponents = componentsWithLocationParent.length
    ? makeAssetsTree(
        locationsWithType,
        componentsWithLocationParent,
        "locationId",
        searchConfig
      )
    : locationsWithType;

  const locationsWithAssets = makeAssetsTree(
    locationsWithComponents,
    assetsTree,
    "locationId",
    searchConfig
  );

  let finalTree = makeTree(locationsWithAssets, "parentId", null, searchConfig);

  finalTree = [...firstLevelComponents, ...finalTree];

  return finalTree;
}

export function makeNodeTreeBySearchName(
  locations: Location[],
  assets: Asset[],
  searchConfig: {
    searchName: string;
    filterEnergyComponent?: boolean;
    filterAlertStatus?: boolean;
  }
) {
  const {
    componentsWithAssetParent,
    componentsWithLocationParent,
    firstLevelComponents,
    assets: assetsList,
  } = handleAssetsByName(assets, {
    searchName: searchConfig.searchName,
  });

  const locationsWithType = locations.map((location) => ({
    ...location,
    type: "location",
  }));

  const assetListWithComponentChildren = componentsWithAssetParent.length
    ? makeAssetsTreeBySearchName(
        assetsList,
        componentsWithAssetParent,
        "parentId",
        searchConfig
      )
    : assetsList;

  const assetsTree = makeTreeBySearchName(
    assetListWithComponentChildren,
    "parentId",
    null,
    searchConfig
  );

  const locationsWithComponents = componentsWithLocationParent.length
    ? makeAssetsTreeBySearchName(
        locationsWithType,
        componentsWithLocationParent,
        "locationId",
        searchConfig
      )
    : locationsWithType;

  const locationsWithAssets = makeAssetsTreeBySearchName(
    locationsWithComponents,
    assetsTree,
    "locationId",
    searchConfig
  );

  let finalTree = makeTreeBySearchName(
    locationsWithAssets,
    "parentId",
    null,
    searchConfig
  );

  finalTree = [...firstLevelComponents, ...finalTree];

  return finalTree;
}
