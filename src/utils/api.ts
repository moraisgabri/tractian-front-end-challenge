import { API_ERRORS } from "@/constants/api/errors";
import units from "@/data/units.json";
import { Unit } from "@/types/api";
import { NextResponse } from "next/server";

interface GetUnitsResponse {
  success: boolean;
  data: Unit | NextResponse;
}

export function getUnitById(id: string): GetUnitsResponse {
  const response: GetUnitsResponse = {
    success: false,
    data: {} as Unit,
  };

  if (!id) {
    response.success = false;
    response.data = NextResponse.json({
      success: response.success,
      message: API_ERRORS.UNIT_ID_REQUIRED,
    });

    return response;
  }

  const unit = units.find((unit) => unit.id === id) as Unit;

  if (!unit) {
    response.success = false;
    response.data = NextResponse.json({
      success: response.success,
      message: API_ERRORS.UNIT_NOT_FOUND,
    });

    return response;
  }

  response.success = true;
  response.data = unit;

  return response;
}
