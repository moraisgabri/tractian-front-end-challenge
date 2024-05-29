"use client";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UnitsService } from "@/services/unitsService";
import { Unit } from "@/types/api";

interface MainProviderProps {
  children?: React.ReactNode;
}

interface UnitContextProps {
  units: Unit[];
  setUnits: Dispatch<SetStateAction<Unit[]>>;
  selectedUnit: Unit | undefined;
  setSelectedUnit: (unit: Unit) => void;
  fetchUnits: () => Promise<void>;
}

const defaultMainState = {
  units: [] as Unit[],
  setUnits: () => {},
  selectedUnit: {} as Unit,
  setSelectedUnit: () => {},
  fetchUnits: async () => {},
};

const UnitContext = createContext<UnitContextProps>(defaultMainState);

export const UnitContextProvider: FC<MainProviderProps> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>();

  const fetchUnits = useCallback(async () => {
    const unitsResponse = await UnitsService.getUnits();
    setUnits(unitsResponse.data);
    setSelectedUnit(unitsResponse.data[0]);
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const data = {
    units,
    setUnits,
    selectedUnit,
    setSelectedUnit,
    fetchUnits,
  };

  return <UnitContext.Provider value={data}>{children}</UnitContext.Provider>;
};

export const useUnitContext = () => useContext(UnitContext);
