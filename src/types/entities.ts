interface Unit {
  id: number;
  tradename: string;
}

interface Asset {
  name: string;
  parentId: null | string;
  sensorType: string;
  status: string;
  locationId: null | string;
  id: string;
}

interface Location {
  name: string;
  parentId: null | string;
  id: string;
}
