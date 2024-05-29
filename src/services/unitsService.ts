import { apiRequest } from ".";

export class UnitsService {
  static async getUnits() {
    const response = await apiRequest("units");

    return response;
  }
}
