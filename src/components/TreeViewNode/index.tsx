import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import componentIcon from "@/assets/icons/tree-view-component.png";
import locationIcon from "@/assets/icons/tree-view-location.svg";
import assetIcon from "@/assets/icons/tree-view-asset.svg";
import componentSelectedIcon from "@/assets/icons/tree-view-component-selected.png";
import dropDownIcon from "@/assets/icons/tree-node-drop-down.svg";
import operatingComponentIcon from "@/assets/icons/tree-node-operating-component.svg";
import alertComponentIcon from "@/assets/icons/tree-node-alert-component.svg";
import vibrationOperatingIcon from "@/assets/icons/tree-node-operating-vibration-component.svg";
import {
  NodeType,
  TreeNodeType,
  TreeViewActionType,
  TreeViewNode,
} from "@/types/components/treeView";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import { get } from "http";

const NODE_ICON_BY_TYPE = {
  [NodeType.Location]: locationIcon,
  [NodeType.Component]: componentIcon,
  [NodeType.Asset]: assetIcon,
};

const NODE_ICON_ALT_BY_TYPE = {
  [NodeType.Location]: "Location Icon",
  [NodeType.Component]: "Component Icon",
  [NodeType.Asset]: "Asset Icon",
};

function getComponentIcon(asset: TreeViewNode) {
  if (asset.status === "alert") {
    return alertComponentIcon;
  }

  return asset.sensorType === "energy"
    ? operatingComponentIcon
    : vibrationOperatingIcon;
}

export const TreeNode = ({ node, key }: { node: any; key: string }) => {
  const { setSelectedComponent, selectedComponent, dispatchNodes } =
    useScreenContentContext();
  const toggle = () =>
    dispatchNodes({
      type: TreeViewActionType.Toggle,
      id: node.id,
      isExpanded: !node.isExpanded,
    });
  const selectComponent = () => setSelectedComponent(node);
  const typeIsComponent = node.type === NodeType.Component;
  const componentIsSelected = selectedComponent?.id === node.id;

  const isCollapsable = Boolean(node.collapsable);

  return (
    !node.hidden && (
      <div className={styles.treeNodeWrapper} key={key}>
        <div
          className={
            componentIsSelected
              ? styles.treeNodeOptionWrapperSelected
              : styles.treeNodeOptionWrapper
          }
          onClick={
            typeIsComponent
              ? selectComponent
              : isCollapsable
              ? toggle
              : undefined
          }
        >
          {Boolean(node.children.length) && (
            <div>
              {node.isExpanded ? (
                <Image alt="Seta para cima" src={dropDownIcon} />
              ) : (
                <Image
                  alt="Seta para baixo"
                  style={{ transform: "rotate(180deg)" }}
                  src={dropDownIcon}
                />
              )}
            </div>
          )}
          <Image
            className={styles.treeNodeIcon}
            alt={NODE_ICON_ALT_BY_TYPE[node.type as TreeNodeType]}
            src={
              componentIsSelected
                ? componentSelectedIcon
                : NODE_ICON_BY_TYPE[node.type as TreeNodeType]
            }
          />
          <span title={node.name} className={styles.treeNodeName} />
          {typeIsComponent && (
            <Image
              className={styles.treeNodeComponentStatusIcon}
              src={getComponentIcon(node)}
              height={
                node.status === "operating" && node.sensorType === "energy"
                  ? 15
                  : 8
              }
              alt="Component Status Icon"
            />
          )}
        </div>

        <div style={{ padding: `0 1em` }}>
          {node.isExpanded &&
            node.children.map((child: any) =>
              node.hidden ? null : <TreeNode key={child.id} node={child} />
            )}
        </div>
      </div>
    )
  );
};
