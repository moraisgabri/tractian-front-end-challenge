import React from "react";
import styles from "./styles.module.css";
import TopBar from "../TopBar";

interface ScreenLayoutProps {
  children?: React.ReactNode;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children }) => {
  return (
    <div className={styles.screenWrapper}>
      <TopBar />
      <div className={styles.screenContent}>{children}</div>
    </div>
  );
};

export default ScreenLayout;
