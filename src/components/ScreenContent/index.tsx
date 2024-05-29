import React, { FC } from "react";
import styles from "./styles.module.css";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import Image from "next/image";
import { getComponentIcon } from "@/utils/getComponentIcon";
import energyComponentImage from "@/assets/energy-component-image.png";
import vibrationComponentImage from "@/assets/vibration-component-image.png";
import { UploadImage } from "../UploadImage";
import { mockHardwareData } from "@/utils/mockHardwareData";
import { TreeViewNode } from "@/types/components/treeView";
import receiverIcon from "@/assets/icons/receiver-content.svg";
import sensorIcon from "@/assets/icons/sensor-content.svg";

interface ScreenContentProps {}

export const ScreenContent: FC<ScreenContentProps> = () => {
  const { selectedComponent } = useScreenContentContext();

  const renderHardwareData = (component: TreeViewNode) => {
    const { sensorValue, receiver } = mockHardwareData(component);

    return (
      <div className={styles.hardwareDataWrapper}>
        <div className={styles.sectionWrapper}>
          <span className={styles.sectionTitle}>Sensor</span>
          <div className={styles.hardwareValueWrapper}>
            <Image alt="Símbolo de wifi" src={sensorIcon} />
            <span className={styles.sectionValue}>{sensorValue}</span>
          </div>
        </div>
        <div className={styles.sectionWrapper}>
          <span className={styles.sectionTitle}>Receptor</span>
          <div className={styles.hardwareValueWrapper}>
            <Image alt="Um roteador" src={receiverIcon} />
            <span className={styles.sectionValue}>{receiver}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.screenContentWrapper}>
      {selectedComponent && (
        <>
          <div className={styles.componentContentTitleWrapper}>
            <span className={styles.componentContentTitle}>
              {selectedComponent.name}
            </span>
            <Image alt="icon" src={getComponentIcon(selectedComponent)} />
          </div>
          <div className={styles.componentContentDescription}>
            <div className={styles.componentDescription}>
              {selectedComponent.status === "alert" ? (
                <UploadImage />
              ) : (
                <Image
                  src={
                    selectedComponent.sensorType === "energy"
                      ? energyComponentImage
                      : vibrationComponentImage
                  }
                  alt="Componente de energia ou vibração"
                />
              )}

              <div className={styles.gearSeactionWrapper}>
                <div
                  className={styles.sectionWrapper}
                  style={{ borderBottom: "1px solid #D8DFE6" }}
                >
                  <span className={styles.sectionTitle}>
                    Tipo de equipamento
                  </span>
                  <span className={styles.sectionValue}>
                    Motor Elétrico (Trifásico)
                  </span>
                </div>

                <div className={styles.sectionWrapper}>
                  <span className={styles.sectionTitle}>Responsáveis</span>
                  <div>
                    {selectedComponent.status === "alert" ? (
                      <div className={styles.responsibleSectionValueWrapper}>
                        <div className={styles.responsibleSectionSymbol}>M</div>

                        <span className={styles.sectionValue}>Mecânica</span>
                      </div>
                    ) : (
                      <div className={styles.responsibleSectionValueWrapper}>
                        <div className={styles.responsibleSectionSymbol}>E</div>

                        <span className={styles.sectionValue}>Elétrica</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderHardwareData(selectedComponent)}
        </>
      )}
    </div>
  );
};
