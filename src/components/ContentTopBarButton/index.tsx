"use client";
import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./styles.module.css";
import Image from "next/image";

interface ContentTopBarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: string;
  selected?: boolean;
  filter?: boolean;
}

export const ContentTopBarButton: FC<ContentTopBarButtonProps> = ({
  title,
  icon,
  selected,
  filter,
  ...props
}) => {
  return (
    <button
      {...props}
      className={
        filter
          ? styles.contentBadgeWrapperFilter
          : selected
          ? styles.contentBadgeWrappperSelected
          : styles.contentBadgeWrapper
      }
    >
      {icon && <Image alt={`${title} icon`} src={icon} />}
      {title}
    </button>
  );
};
