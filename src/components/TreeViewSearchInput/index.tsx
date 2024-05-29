import React, {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  useState,
} from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import searchIcon from "@/assets/icons/search.svg";
import { useScreenContentContext } from "@/contexts/ScreenContentContext.ts";
import { TreeViewActionType } from "@/types/components/treeView";

export const TreeViewSearchInput: FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const {
    dispatchNodes,
    setAlertStatusFilterSelected,
    setEnergySensorTypeFilterSelected,
  } = useScreenContentContext();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const onSearch = () => {
    setAlertStatusFilterSelected(false);
    setEnergySensorTypeFilterSelected(false);
    dispatchNodes({
      type: TreeViewActionType.SearchByName,
      query: searchValue,
    });
  };

  const onPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={styles.treeViewSearchInputWrapper}>
      <input
        placeholder="Buscar Ativo ou Local"
        className={styles.treeViewSearchInput}
        onChange={handleSearch}
        onKeyUp={onPressEnter}
      />
      <Image
        className={styles.treeViewSearchInputIcon}
        src={searchIcon}
        onClick={onSearch}
        alt="Icone de lupa para pesquisar"
      />
    </div>
  );
};
