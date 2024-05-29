import React, {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { LocationsService } from "@/services/locationsService";
import { AssetsService } from "@/services/assetsService";
import { useUnitContext } from "../UnitContext";
import { makeNodeTree } from "@/utils/makeTree";
import { TreeViewActionType, TreeViewNode } from "@/types/components/treeView";
import {
  searchNodes,
  searchNodesByName,
  toggleNode,
  updateAllNodes,
} from "@/utils/treeViewReducer";

interface ScreenContentContextProviderProps {
  children?: React.ReactNode;
}

interface ScreenContentContextProps {
  assets: Asset[];
  locations: Location[];
  fetchTreeViewData: () => Promise<void>;
  setSelectedComponent: Dispatch<SetStateAction<TreeViewNode | undefined>>;
  selectedComponent?: TreeViewNode;
  energySensorTypeFilterSelected: boolean;
  setEnergySensorTypeFilterSelected: Dispatch<SetStateAction<boolean>>;
  alertStatusFilterSelected: boolean;
  setAlertStatusFilterSelected: Dispatch<SetStateAction<boolean>>;
  nodes: any[];
  dispatchNodes: Dispatch<any>;
}

const defaultMainState = {
  assets: [] as Asset[],
  locations: [] as Location[],
  fetchTreeViewData: async () => {},
  selectedComponent: undefined,
  setSelectedComponent: () => {},
  nodeTree: [] as any[],
  energySensorTypeFilterSelected: false,
  setEnergySensorTypeFilterSelected: () => {},
  alertStatusFilterSelected: false,
  setAlertStatusFilterSelected: () => {},
  nodes: [],
  dispatchNodes: () => {},
};

const ScreenContentContext =
  createContext<ScreenContentContextProps>(defaultMainState);

export const ScreenContentContextProvider: FC<
  ScreenContentContextProviderProps
> = ({ children }) => {
  const { selectedUnit } = useUnitContext();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<TreeViewNode>();
  const [energySensorTypeFilterSelected, setEnergySensorTypeFilterSelected] =
    useState<boolean>(false);
  const [alertStatusFilterSelected, setAlertStatusFilterSelected] =
    useState<boolean>(false);

  const treeReducer = (state: TreeViewNode[], action: any) => {
    console.log("ttt", action);
    switch (action.type) {
      case TreeViewActionType.DefaultTree:
        return action.data;
      case TreeViewActionType.Toggle:
        return toggleNode(state, action.id, action.isExpanded);
      case TreeViewActionType.ExpandAll:
        return updateAllNodes(state, true);
      case TreeViewActionType.CollapseAll:
        return updateAllNodes(state, false);
      case TreeViewActionType.SearchByFilter:
        return searchNodes(assets, locations, {
          filterEnergyComponent: energySensorTypeFilterSelected,
          filterAlertStatus: alertStatusFilterSelected,
        });
      case TreeViewActionType.SearchByName:
        return searchNodesByName(assets, locations, {
          filterEnergyComponent: false,
          filterAlertStatus: false,
          searchName: action.query,
        });
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(treeReducer, []);

  const fetchTreeViewData = useCallback(async () => {
    if (selectedUnit) {
      const [assetsResponse, locationsResponse] = await Promise.all([
        await AssetsService.getListByUnitId(selectedUnit.id as string),
        await LocationsService.getListByUnitId(selectedUnit.id),
      ]);
      setAssets(assetsResponse.data);
      setLocations(locationsResponse.data);
      setSelectedComponent(undefined);
    }
  }, [selectedUnit]);

  useEffect(() => {
    if (locations && assets) {
      const tree = makeNodeTree(locations, assets);
      dispatch({ type: TreeViewActionType.DefaultTree, data: tree });
    }
  }, [locations, assets]);

  useEffect(() => {
    if (!energySensorTypeFilterSelected && !alertStatusFilterSelected) {
      const tree = makeNodeTree(locations, assets);
      dispatch({ type: TreeViewActionType.DefaultTree, data: tree });
      dispatch({ type: "COLAPSE_ALL", data: tree });
    }
  }, [
    energySensorTypeFilterSelected,
    alertStatusFilterSelected,
    dispatch,
    locations,
    assets,
  ]);

  useEffect(() => {
    fetchTreeViewData();
  }, [fetchTreeViewData]);

  const data = {
    assets,
    locations,
    fetchTreeViewData,
    selectedComponent,
    setSelectedComponent,
    energySensorTypeFilterSelected,
    setEnergySensorTypeFilterSelected,
    alertStatusFilterSelected,
    setAlertStatusFilterSelected,
    nodes: state,
    dispatchNodes: dispatch,
  };

  return (
    <ScreenContentContext.Provider value={data}>
      {children}
    </ScreenContentContext.Provider>
  );
};

export const useScreenContentContext = () => useContext(ScreenContentContext);
