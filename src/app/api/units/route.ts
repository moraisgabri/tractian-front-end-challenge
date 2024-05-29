import { NextResponse } from "next/server";
import units from "@/data/units.json";

export async function GET() {
  return NextResponse.json({ data: units });
}
