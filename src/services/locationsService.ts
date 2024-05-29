import { apiRequest } from ".";

export class LocationsService {
  static async getListByUnitId(id: string) {
    const response = await apiRequest("locations", id);

    return response;
  }
}
