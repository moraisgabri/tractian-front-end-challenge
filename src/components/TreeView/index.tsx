import React, { FC } from "react";
import styles from "./styles.module.css";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import { TreeNode } from "../TreeViewNode";
import { TreeViewNode } from "@/types/components/treeView";
import { TreeViewSearchInput } from "../TreeViewSearchInput";

export const TreeView: FC = () => {
  const { nodes } = useScreenContentContext();

  return (
    <div className={styles.treeViewWrapper}>
      <TreeViewSearchInput />
      {nodes?.map((node: TreeViewNode) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};
