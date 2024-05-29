export enum UnitName {
  Apex = "Apex",
  Tobias = "Tobias",
  Jaguar = "Jaguar",
}

export interface Unit {
  id: string;
  tradename: UnitName;
}
