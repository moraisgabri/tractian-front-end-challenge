import React, { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  selected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  icon,
  selected,
  ...props
}) => {
  return (
    <button
      className={selected ? styles.mainButtonSelected : styles.mainButton}
      {...props}
    >
      <div className={styles.mainButtonContentWrapper}>
        {icon && <i className={styles.mainButtonIcon}>{icon}</i>}
        {title}
      </div>
    </button>
  );
};
