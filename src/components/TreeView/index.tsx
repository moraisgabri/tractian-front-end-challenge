import React, { FC, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import { Button } from "../Button";
import { TreeNode } from "../TreeViewNode";
import { TreeViewNode } from "@/types/components/treeView";
import { TreeViewSearchInput } from "../TreeViewSearchInput";

export const TreeView: FC = () => {
  const { nodes } = useScreenContentContext();

  console.log({ nodes });

  return (
    <div className={styles.treeViewWrapper}>
      <TreeViewSearchInput />
      {nodes?.map((node: TreeViewNode) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
};
