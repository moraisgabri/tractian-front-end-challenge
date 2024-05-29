import React, { useCallback } from "react";
import styles from "./styles.module.css";
import { useUnitContext } from "@/contexts/UnitContext";
import { Button } from "../Button";
import { Unit } from "@/types/api";
import tractianLogo from "@/assets/LOGO TRACTIAN.svg";
import unitIcon from "@/assets/icons/unit-button.svg";
import Image from "next/image";

interface TopBarProps {}

const TopBar: React.FC<TopBarProps> = () => {
  const { units, setSelectedUnit, selectedUnit } = useUnitContext();

  const onSelectUnit = useCallback(
    (unit: Unit) => setSelectedUnit(unit),
    [setSelectedUnit]
  );

  return (
    <div className={styles.topBarWrapper}>
      <Image
        priority
        width={150}
        height={50}
        src={tractianLogo}
        alt="Tractian Logo"
      />

      <div>
        {units.length &&
          units.map((unit, i) => (
            <Button
              key={`unit-button-${i}`}
              title={`${unit.tradename} Unit`}
              icon={
                <Image
                  alt="Barras de ouro"
                  height={14}
                  width={14}
                  src={unitIcon}
                />
              }
              selected={unit.id === selectedUnit?.id}
              onClick={() => onSelectUnit(unit)}
            />
          ))}
      </div>
    </div>
  );
};

export default TopBar;
