import operatingComponentIcon from "@/assets/icons/tree-node-operating-component.svg";
import alertComponentIcon from "@/assets/icons/tree-node-alert-component.svg";
import vibrationOperatingIcon from "@/assets/icons/tree-node-operating-vibration-component.svg";
import { TreeViewNode } from "@/types/components/treeView";

export function getComponentIcon(asset: TreeViewNode) {
  if (asset.status === "alert") {
    return alertComponentIcon;
  }

  return asset.sensorType === "energy"
    ? operatingComponentIcon
    : vibrationOperatingIcon;
}
