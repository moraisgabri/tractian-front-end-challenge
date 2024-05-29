"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ScreenLayout from "@/components/ScreenLayout";
import { useUnitContext } from "@/contexts/UnitContext";
import { ContentTopBar } from "@/components/ContentTopBar";
import { ScreenContentContextProvider } from "@/contexts/ScreenContentContext.ts";
import { TreeView } from "@/components/TreeView";
import { ScreenContent } from "@/components/ScreenContent";

export default function Screen() {
  const { selectedUnit } = useUnitContext();
  return (
    <ScreenLayout>
      {selectedUnit ? (
        <div className={styles.screenContainer}>
          <ScreenContentContextProvider>
            <ContentTopBar />
            <div className={styles.screenContentContainer}>
              <TreeView />
              <ScreenContent />
            </div>
          </ScreenContentContextProvider>
        </div>
      ) : null}
    </ScreenLayout>
  );
}
