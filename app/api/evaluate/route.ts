import { NextResponse } from "next/server";
import { evaluateProperty, PropertyInput } from "../../../lib/prediction";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PropertyInput;

    const result = evaluateProperty({
      location: body.location,
      propertyType: body.propertyType,
      listedPriceUsd: Number(body.listedPriceUsd),
      sizeSqm: Number(body.sizeSqm),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      amenitiesCount: Number(body.amenitiesCount),
      completenessScore: Number(body.completenessScore),
      description: body.description ?? "",
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);

    return NextResponse.json(
      { error: "Failed to evaluate listing." },
      { status: 500 }
    );
  }
}