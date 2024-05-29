import { handleAssets, handleAssetsByName } from "./handleAssets";
import { getUniqueItems } from "./getUniqueItems";

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
          console.log({
            filter: children.filter(
              (child: any) => child.sensorType === "alert"
            ),
            filterBool: Boolean(
              children.filter((child: any) => child.sensorType === "alert")
                .length
            ),
          });
          isUncollapsable = isUncollapsable
            ? Boolean(
                children.filter((child: any) => child.status === "alert").length
              )
            : false;
        }

        if (searchConfig?.filterEnergyComponent) {
          console.log({
            filter: children.filter(
              (child: any) =>
                child.sensorType === "energy" && child.status === "operating"
            ),
            filterBool: Boolean(
              children.filter((child: any) => child.sensorType === "energy")
                .length
            ),
          });
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
  return baseArr.reduce((acc: any, baseItem: any) => {
    let children = toMergeArr.filter(
      (item: any) => item[idKey] === baseItem.id
    );

    children = getUniqueItems([...(baseItem.children ?? []), ...children]);

    let baseItemHasUncollapsableChildren = children.some(
      (node: any) => node.collapsable === false
    );

    let isUncollapsable = false;

    if (searchConfig && !baseItemHasUncollapsableChildren) {
      if (searchConfig?.filterAlertStatus) {
        console.log({
          filterAsset: children.filter(
            (child: any) => child.sensorType === "alert"
          ),
          filterBoolAsset: Boolean(
            children.filter((child: any) => child.sensorType === "alert").length
          ),
        });
        isUncollapsable = isUncollapsable
          ? Boolean(
              children.filter((child: any) => child.status === "alert").length
            )
          : false;
      }

      if (searchConfig?.filterEnergyComponent) {
        console.log({
          filterAsset: children.filter(
            (child: any) =>
              child.sensorType === "energy" && child.status === "operating"
          ),
          filterBoolAsset: Boolean(
            children.filter((child: any) => child.sensorType === "energy")
              .length
          ),
        });
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
      ...acc,
      {
        ...baseItem,
        hidden:
          Boolean(
            (baseItemHasUncollapsableChildren || isUncollapsable
              ? false
              : true) && searchConfig
          ) || children.length === 0,
        isExpanded: isUncollapsable || baseItemHasUncollapsableChildren,
        collapsable:
          baseItemHasUncollapsableChildren || isUncollapsable ? false : true,
        children: [...(baseItem.children ?? []), ...children],
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
    ? makeAssetsTree(
        assetsList,
        componentsWithAssetParent,
        "parentId",
        searchConfig
      )
    : assetsList;

  console.log({ assetListWithComponentChildren });

  const assetsTree = makeTree(
    assetListWithComponentChildren,
    "parentId",
    null,
    searchConfig
  );

  console.log({ assetsTree });

  const locationsWithComponents = componentsWithLocationParent.length
    ? makeAssetsTree(
        locationsWithType,
        componentsWithLocationParent,
        "locationId",
        searchConfig
      )
    : locationsWithType;

  console.log({ locationsWithComponents });

  const locationsWithAssets = makeAssetsTree(
    locationsWithComponents,
    assetsTree,
    "locationId",
    searchConfig
  );

  console.log({ locationsWithAssets });

  let finalTree = makeTree(locationsWithAssets, "parentId", null, searchConfig);

  console.log({ finalTree });

  finalTree = [...firstLevelComponents, ...finalTree];

  return finalTree;
}
