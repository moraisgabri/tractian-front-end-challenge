import { apiRequest } from ".";

export class AssetsService {
  static async getListByUnitId(id: string) {
    const response = await apiRequest("assets", id);

    return response;
  }
}
