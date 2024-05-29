import React from "react";
import styles from "./styles.module.css";
import uploadImageIcon from "@/assets/icons/upload-image.svg";
import Image from "next/image";

export const UploadImage: React.FC = () => {
  return (
    <div className={styles.uploadImageWrapper}>
      <Image src={uploadImageIcon} alt="Uma caixa azul" />
      <span>Adicionar imagem do ativo</span>
    </div>
  );
};
