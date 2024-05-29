import { NextResponse } from "next/server";
import { Unit, UnitName } from "@/types/api";
import { getUnitById } from "@/utils/api";
import { INDEXED_LOCATIONS_BY_UNIT_NAME } from "@/constants/api/indexedLocations";
import { INDEXED_ASSETS_BY_UNIT_NAME } from "@/constants/api/indexedAssets";

export async function GET(_request: Request, context: any) {
  const { unitId } = context.params;

  const { success, data } = getUnitById(unitId);

  if (!success) {
    return data as NextResponse;
  }

  const unit = data as Unit;
  const unitName = unit.tradename as UnitName;
  const assets = INDEXED_ASSETS_BY_UNIT_NAME[unitName];

  return NextResponse.json({ success: true, data: assets });
}
