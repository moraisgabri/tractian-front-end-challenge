"use client";
import React, { FC, use, useEffect } from "react";
import { ContentTitle } from "../ContentTitle";
import { useUnitContext } from "@/contexts/UnitContext";
import styles from "./styles.module.css";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import { ContentTopBarButton } from "../ContentTopBarButton";
import unselectedAlertStatusIcon from "@/assets/icons/alert-status-badge-unselected.svg";
import selectedAlertStatusIcon from "@/assets/icons/alert-status-badge-selected.svg";
import unselectedEnergySensorTypeIcon from "@/assets/icons/energy-sensor-type-badge-unselected.svg";
import selectedEnergySensorTypeIcon from "@/assets/icons/energy-sensor-type-badge-selected.png";
import { TreeViewActionType } from "@/types/components/treeView";

export const ContentTopBar: FC = () => {
  const { selectedUnit } = useUnitContext();
  const {
    energySensorTypeFilterSelected,
    setEnergySensorTypeFilterSelected,
    alertStatusFilterSelected,
    setAlertStatusFilterSelected,
    dispatchNodes,
  } = useScreenContentContext();

  const onSelectEnergySensorTypeFilter = () => {
    setEnergySensorTypeFilterSelected(!energySensorTypeFilterSelected);
    dispatchNodes({ type: TreeViewActionType.SearchByFilter });
  };
  const onSelectAlertStatusFilter = () => {
    setAlertStatusFilterSelected(!alertStatusFilterSelected);
    dispatchNodes({ type: TreeViewActionType.SearchByFilter });
  };

  const onCollapseAll = () => {
    setEnergySensorTypeFilterSelected(false);
    setAlertStatusFilterSelected(false);
    dispatchNodes({ type: TreeViewActionType.CollapseAll });
  };

  const onExpandAll = () => {
    setEnergySensorTypeFilterSelected(false);
    setAlertStatusFilterSelected(false);
    dispatchNodes({ type: TreeViewActionType.ExpandAll });
  };

  useEffect(() => {
    setEnergySensorTypeFilterSelected(false);
    setAlertStatusFilterSelected(false);
  }, [
    selectedUnit,
    setEnergySensorTypeFilterSelected,
    setAlertStatusFilterSelected,
  ]);

  return (
    <div className={styles.contentTopBarWrapper}>
      <div>
        {selectedUnit && (
          <ContentTitle unitTradeName={selectedUnit?.tradename} />
        )}
      </div>

      <div className={styles.contentTopBarBadgesWrapper}>
        <ContentTopBarButton
          selected
          title="Expandir tudo"
          onClick={onExpandAll}
        />

        <ContentTopBarButton
          selected
          title="Fechar tudo"
          onClick={onCollapseAll}
        />

        <ContentTopBarButton
          icon={
            energySensorTypeFilterSelected
              ? selectedEnergySensorTypeIcon
              : unselectedEnergySensorTypeIcon
          }
          onClick={onSelectEnergySensorTypeFilter}
          title="Sensor de Energia"
          selected={energySensorTypeFilterSelected}
        />
        <ContentTopBarButton
          icon={
            alertStatusFilterSelected
              ? selectedAlertStatusIcon
              : unselectedAlertStatusIcon
          }
          onClick={onSelectAlertStatusFilter}
          title="Crítico"
          selected={alertStatusFilterSelected}
        />
      </div>
    </div>
  );
};
