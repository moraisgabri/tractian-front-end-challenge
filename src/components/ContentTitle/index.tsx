import React, { FC } from "react";
import styles from "./styles.module.css";

interface ContentTitleProps {
  unitTradeName: string;
}

export const ContentTitle: FC<ContentTitleProps> = ({ unitTradeName }) => {
  return (
    <div className={styles.contentTitleWrapper}>
      <h3>Ativos</h3>
      <span className={styles.contentTitleUnitName}>
        / {unitTradeName} Unit
      </span>
    </div>
  );
};
