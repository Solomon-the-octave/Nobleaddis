import { NextResponse } from "next/server";
import { sampleListings } from "../../../lib/sampleData";

export async function GET() {
  return NextResponse.json({
    listings: sampleListings,
  });
}