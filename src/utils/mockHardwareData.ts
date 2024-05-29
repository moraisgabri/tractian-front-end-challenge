import { TreeViewNode } from "@/types/components/treeView";

export function mockHardwareData(node: TreeViewNode): {
  sensorValue: string;
  receiver: string;
} {
  if (node.status === "alert") {
    return {
      sensorValue: "RWET667",
      receiver: "86GTFD7",
    };
  }

  if (node.sensorType === "energy") {
    return {
      sensorValue: "TFV655",
      receiver: "YTF265",
    };
  }

  return {
    sensorValue: "HIO4510",
    receiver: "EUH4R27",
  };
}
