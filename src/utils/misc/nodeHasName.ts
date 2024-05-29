export const nodeHasName = (node: Asset, nameParam: string) => {
  return node.name.toLocaleLowerCase().includes(nameParam.toLocaleLowerCase());
};
